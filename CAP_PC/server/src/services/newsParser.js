import Parser from 'rss-parser'

const parser = new Parser({ timeout: 10000 })

const RSS_FEEDS = [
  { url: 'https://www.ixbt.com/export/news.rss', source: 'IXBT' },
  { url: 'https://3dnews.ru/news/rss/', source: '3DNews' },
  { url: 'https://habr.com/ru/rss/hubs/hardware/articles/all/', source: 'Habr Hardware' },
]

let cache = { data: null, expiresAt: 0 }

async function fetchRssFeed(feed) {
  try {
    const parsed = await parser.parseURL(feed.url)
    return (parsed.items || []).slice(0, 8).map((item) => ({
      title: item.title || 'Без названия',
      link: item.link || '#',
      source: feed.source,
      date: item.isoDate || item.pubDate || new Date().toISOString(),
      preview: (item.contentSnippet || item.summary || '').slice(0, 200),
      type: 'rss',
    }))
  } catch {
    return []
  }
}

async function fetchVkPosts() {
  const token = process.env.VK_ACCESS_TOKEN
  const groupId = process.env.VK_GROUP_ID || '123456789'
  if (!token) return []

  try {
    const url = `https://api.vk.com/method/wall.get?owner_id=-${groupId}&count=5&access_token=${token}&v=5.131`
    const res = await fetch(url)
    const json = await res.json()
    if (!json.response?.items) return []

    return json.response.items.map((post) => ({
      title: (post.text || 'Пост VK').split('\n')[0].slice(0, 120),
      link: `https://vk.com/wall-${groupId}_${post.id}`,
      source: 'VK',
      date: new Date(post.date * 1000).toISOString(),
      preview: (post.text || '').slice(0, 200),
      type: 'vk',
    }))
  } catch {
    return []
  }
}

export async function getNews() {
  const now = Date.now()
  if (cache.data && cache.expiresAt > now) {
    return cache.data
  }

  const rssResults = await Promise.all(RSS_FEEDS.map(fetchRssFeed))
  const vkPosts = await fetchVkPosts()
  const all = [...rssResults.flat(), ...vkPosts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 30)

  if (all.length === 0) {
    cache = {
      data: getFallbackNews(),
      expiresAt: now + 30 * 60 * 1000,
    }
    return cache.data
  }

  cache = { data: all, expiresAt: now + 30 * 60 * 1000 }
  return all
}

function getFallbackNews() {
  return [
    {
      title: 'NVIDIA представила новую линейку видеокарт для игровых ПК',
      link: '#',
      source: 'CAP PC Demo',
      date: new Date().toISOString(),
      preview: 'Обзор актуальных GPU и рекомендации по сборке игрового ПК в 2026 году.',
      type: 'demo',
    },
    {
      title: 'DDR5 становится стандартом для новых сборок',
      link: '#',
      source: 'CAP PC Demo',
      date: new Date(Date.now() - 86400000).toISOString(),
      preview: 'Сравнение цен на оперативную память DDR4 и DDR5 в магазинах России.',
      type: 'demo',
    },
    {
      title: 'SSD NVMe: как выбрать накопитель для игр и работы',
      link: '#',
      source: 'CAP PC Demo',
      date: new Date(Date.now() - 172800000).toISOString(),
      preview: 'PCIe 4.0 vs PCIe 5.0 — что выгоднее для домашней сборки.',
      type: 'demo',
    },
  ]
}
