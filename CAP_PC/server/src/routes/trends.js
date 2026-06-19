import { Router } from 'express'
import { chatCompletion, hasOpenAI } from '../services/openai.js'

const router = Router()

let cache = { data: null, expiresAt: 0 }

const FALLBACK_TRENDS = [
  {
    id: 1,
    title: 'AI-ускорители в домашних ПК',
    category: 'GPU',
    description: 'NPU и AI-ядра в новых процессорах и видеокартах меняют подход к сборке рабочих станций.',
    icon: '🤖',
  },
  {
    id: 2,
    title: 'DDR5 — новый стандарт',
    category: 'RAM',
    description: 'Цены на DDR5 снижаются, большинство новых плат поддерживают только DDR5.',
    icon: '💾',
  },
  {
    id: 3,
    title: 'PCIe 5.0 SSD',
    category: 'Storage',
    description: 'NVMe Gen5 даёт скорость до 12 ГБ/с, но для игр достаточно Gen4.',
    icon: '💿',
  },
  {
    id: 4,
    title: 'Компактные корпуса ITX',
    category: 'Cases',
    description: 'Мини-ПК на базе SFF-корпусов популярны для домашних медиацентров и киберспорта.',
    icon: '🖥️',
  },
  {
    id: 5,
    title: 'Энергоэффективные БП 80+ Gold',
    category: 'PSU',
    description: 'Модульные блоки питания с сертификацией Gold — оптимальный выбор для mid/high-end сборок.',
    icon: '⚡',
  },
]

router.get('/', async (_req, res) => {
  const now = Date.now()
  if (cache.data && cache.expiresAt > now) {
    return res.json({ items: cache.data, source: cache.source })
  }

  if (hasOpenAI()) {
    try {
      const result = await chatCompletion(
        'Ты эксперт по рынку ПК в России. Отвечай только JSON.',
        `Верни JSON: { "trends": [{ "id": number, "title": string, "category": string, "description": string, "icon": emoji }] }
Сгенерируй 6 актуальных трендов в сфере ПК и компьютерных технологий на 2026 год. Текст на русском.`
      )

      if (result?.trends?.length) {
        cache = { data: result.trends, expiresAt: now + 24 * 60 * 60 * 1000, source: 'openai' }
        return res.json({ items: result.trends, source: 'openai' })
      }
    } catch (err) {
      console.warn('OpenAI trends error:', err.message)
    }
  }

  cache = { data: FALLBACK_TRENDS, expiresAt: now + 60 * 60 * 1000, source: 'fallback' }
  res.json({ items: FALLBACK_TRENDS, source: 'fallback' })
})

export default router
