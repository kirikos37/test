const METHODS = {
  min: {
    label: 'По минимальной цене',
    sort: (shops) => [...shops].sort((a, b) => a.price - b.price),
  },
  shop: {
    label: 'По магазину (А–Я)',
    sort: (shops) => [...shops].sort((a, b) => a.name.localeCompare(b.name)),
  },
  city: {
    label: 'По городу (Иваново первым)',
    sort: (shops) =>
      [...shops].sort((a, b) => {
        if (a.city === 'Иваново' && b.city !== 'Иваново') return -1
        if (b.city === 'Иваново' && a.city !== 'Иваново') return 1
        return a.price - b.price
      }),
  },
}

export default function CompareTable({ items, method = 'min' }) {
  if (!items?.length) return null

  const sorter = METHODS[method]?.sort || METHODS.min.sort

  return (
    <div className="card">
      <h3>Таблица сравнения</h3>
      {items.map((item) => {
        const shops = sorter(item.shops || [])
        const prices = shops.map((s) => s.price)
        const min = Math.min(...prices)
        const max = Math.max(...prices)
        const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)

        return (
          <div key={item.query || item.name} style={{ marginBottom: '1.5rem' }}>
            <h4>{item.name}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
              Мин: {min.toLocaleString('ru-RU')} ₽ · Макс: {max.toLocaleString('ru-RU')} ₽ ·
              Средняя: {avg.toLocaleString('ru-RU')} ₽
            </p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Магазин</th>
                    <th>Город</th>
                    <th>Цена</th>
                    <th>Ссылка</th>
                  </tr>
                </thead>
                <tbody>
                  {shops.map((shop) => (
                    <tr key={`${shop.name}-${shop.city}`}>
                      <td>{shop.name}</td>
                      <td>{shop.city}</td>
                      <td>
                        <strong>{shop.price.toLocaleString('ru-RU')} ₽</strong>
                        {shop.price === min && (
                          <span style={{ color: 'var(--color-success)', marginLeft: 6 }}>лучшая</span>
                        )}
                      </td>
                      <td>
                        <a href={shop.url} target="_blank" rel="noreferrer">
                          Перейти
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export { METHODS }
