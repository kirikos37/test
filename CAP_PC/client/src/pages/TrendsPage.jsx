import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function TrendsPage() {
  const [items, setItems] = useState([])
  const [source, setSource] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .getTrends()
      .then((data) => {
        setItems(data.items || [])
        setSource(data.source || '')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="loading">Загрузка трендов...</p>
  if (error) return <p className="form-error">{error}</p>

  return (
    <div>
      <h1 className="page-title">Современные тренды</h1>
      <p className="page-subtitle">
        Актуальные направления в сфере ПК и компьютерных технологий.
        {source === 'fallback' && ' (демо-данные — подключите OPENAI_API_KEY для генерации)'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map((trend) => (
          <article key={trend.id} className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{trend.icon || '📌'}</div>
            <span
              style={{
                fontSize: '0.75rem',
                background: 'var(--color-accent)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 600,
              }}
            >
              {trend.category}
            </span>
            <h2 style={{ fontSize: '1.1rem', margin: '0.5rem 0' }}>{trend.title}</h2>
            <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
              {trend.description}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
