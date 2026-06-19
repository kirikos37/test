import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function NewsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getNews()
      .then((data) => setItems(data.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="loading">Загрузка новостей...</p>
  if (error) return <p className="form-error">{error}</p>

  return (
    <div>
      <h1 className="page-title">Новости сферы ПК</h1>
      <p className="page-subtitle">
        Свежие материалы из RSS-лент и VK о компьютерах и технологиях.
      </p>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {items.map((item, i) => (
          <article key={`${item.link}-${i}`} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                {item.source}
              </span>
              <time style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                {new Date(item.date).toLocaleDateString('ru-RU')}
              </time>
            </div>
            <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              <a href={item.link} target="_blank" rel="noreferrer">
                {item.title}
              </a>
            </h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              {item.preview}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
