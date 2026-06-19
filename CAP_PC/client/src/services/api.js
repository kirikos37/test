const API_BASE = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Ошибка ${res.status}`)
  }
  return data
}

export const api = {
  getCatalog: () => request('/api/catalog'),
  searchPrices: (queries) =>
    request('/api/prices/search', {
      method: 'POST',
      body: JSON.stringify({ queries }),
    }),
  getNews: () => request('/api/news'),
  getTrends: () => request('/api/trends'),
  sendChat: (payload) =>
    request('/api/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
}
