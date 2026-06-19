import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { chatCompletion, hasOpenAI } from '../services/openai.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const mockPrices = JSON.parse(readFileSync(join(__dirname, '../data/mockPrices.json'), 'utf8'))

const router = Router()

function isUrl(str) {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

function normalize(str) {
  return String(str)
    .toLowerCase()
    .replace(/[^\w\s\u0400-\u04FF-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findMockItem(query) {
  const q = normalize(query)
  if (!q) return null

  let best = null
  let bestScore = 0

  for (const item of mockPrices.items) {
    const terms = [item.name, item.query, ...(item.keywords || [])].map(normalize)

    for (const term of terms) {
      if (!term || term.length < 2) continue

      let score = 0
      if (q === term) score = term.length + 100
      else if (q.includes(term)) score = term.length + 50
      else if (term.includes(q) && q.length >= 3) score = q.length + 25

      if (score > bestScore) {
        bestScore = score
        best = item
      }
    }
  }

  return best
}

function generateHistory(basePrice) {
  const months = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05']
  return months.map((date, i) => ({
    date,
    price: Math.round(basePrice * (1 + (4 - i) * 0.015)),
  }))
}

function buildFallbackItem(query) {
  const basePrice = 15000 + Math.floor(Math.random() * 20000)
  return {
    name: isUrl(query) ? 'Товар по ссылке' : query,
    query,
    shops: [
      { name: 'DNS', price: basePrice, url: 'https://www.dns-shop.ru/', city: 'Иваново' },
      { name: 'Ситилинк', price: basePrice + 500, url: 'https://www.citilink.ru/', city: 'Иваново' },
      { name: 'Ozon', price: basePrice - 300, url: 'https://www.ozon.ru/', city: 'Москва' },
      { name: 'Wildberries', price: basePrice + 200, url: 'https://www.wildberries.ru/', city: 'Иваново' },
    ],
    history: generateHistory(basePrice),
  }
}

async function searchWithOpenAI(queries) {
  const prompt = `Запросы пользователя: ${JSON.stringify(queries)}
Найди примерные цены на комплектующие ПК в магазинах России (DNS, Ситилинк, Ozon, Wildberries, Regard).
Приоритет город Иваново. Если точных данных нет — укажи реалистичные оценки.
Верни JSON:
{
  "items": [{
    "name": "название товара",
    "query": "исходный запрос",
    "shops": [{ "name": "магазин", "price": число_в_рублях, "url": "ссылка", "city": "город" }],
    "history": [{ "date": "2026-01", "price": число }]
  }],
  "disclaimer": "данные ориентировочные"
}`

  return chatCompletion(
    'Ты помощник по сравнению цен на комплектующие ПК в России. Отвечай только валидным JSON.',
    prompt
  )
}

router.post('/search', async (req, res) => {
  const { queries } = req.body
  if (!Array.isArray(queries) || queries.length === 0) {
    return res.status(400).json({ error: 'Укажите хотя бы один товар или ссылку' })
  }

  const cleaned = queries.map((q) => String(q).trim()).filter(Boolean)
  if (cleaned.length === 0) {
    return res.status(400).json({ error: 'Пустые запросы не допускаются' })
  }

  for (const q of cleaned) {
    if (isUrl(q) && !q.startsWith('http')) {
      return res.status(400).json({ error: `Некорректная ссылка: ${q}` })
    }
  }

  const items = []
  const stillUnmatched = []

  for (const query of cleaned) {
    const mock = findMockItem(query)
    if (mock) {
      const { keywords, category, ...rest } = mock
      items.push({ ...rest, query, matchedFrom: 'catalog' })
    } else {
      stillUnmatched.push(query)
    }
  }

  let openaiUsed = false
  const afterOpenAI = []

  if (stillUnmatched.length > 0 && hasOpenAI()) {
    try {
      const result = await searchWithOpenAI(stillUnmatched)
      if (result?.items?.length) {
        openaiUsed = true
        result.items.forEach((item, i) => {
          items.push({ ...item, query: stillUnmatched[i] || item.query, matchedFrom: 'openai' })
        })
      } else {
        afterOpenAI.push(...stillUnmatched)
      }
    } catch (err) {
      console.warn('OpenAI prices error:', err.message)
      afterOpenAI.push(...stillUnmatched)
    }
  } else {
    afterOpenAI.push(...stillUnmatched)
  }

  for (const query of afterOpenAI) {
    items.push({ ...buildFallbackItem(query), matchedFrom: 'fallback' })
  }

  const catalogCount = items.filter((i) => i.matchedFrom === 'catalog').length
  let source = 'mock'
  if (catalogCount === cleaned.length) source = 'mock-catalog'
  else if (catalogCount > 0) source = 'mock-mixed'
  else if (openaiUsed) source = 'openai'

  res.json({
    items: items.map(({ matchedFrom, ...item }) => item),
    source,
    catalogSize: mockPrices.items.length,
    disclaimer: mockPrices.disclaimer,
  })
})

export default router
