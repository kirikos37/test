import './BuildSummary.css'

function calcStats(selected) {
  const parts = Object.values(selected).filter(Boolean)
  const total = parts.reduce((sum, p) => sum + (p.price || 0), 0)
  const tdp = parts.reduce((sum, p) => sum + (p.tdp || 0), 0)
  const score = parts.reduce((sum, p) => sum + (p.score || 0), 0)
  return { total, tdp, score, count: parts.length }
}

export default function BuildSummary({ selected, savedBuilds, onCompareBuilds }) {
  const stats = calcStats(selected)
  const parts = Object.entries(selected).filter(([, p]) => p)

  return (
    <div className="card build-summary">
      <h3>Ваша сборка</h3>
      <div className="build-summary__total">{stats.total.toLocaleString('ru-RU')} ₽</div>

      <div className="build-summary__stats">
        <div className="build-summary__stat">
          <div className="build-summary__stat-value">{stats.count}/7</div>
          <div className="build-summary__stat-label">Компонентов</div>
        </div>
        <div className="build-summary__stat">
          <div className="build-summary__stat-value">{stats.tdp}W</div>
          <div className="build-summary__stat-label">TDP</div>
        </div>
        <div className="build-summary__stat">
          <div className="build-summary__stat-value">{stats.score}</div>
          <div className="build-summary__stat-label">Баллы</div>
        </div>
      </div>

      <ul className="build-summary__list">
        {parts.map(([catId, part]) => (
          <li key={catId}>
            <span>{part.name}</span>
            <span>{part.price.toLocaleString('ru-RU')} ₽</span>
          </li>
        ))}
        {parts.length === 0 && <li>Выберите комплектующие</li>}
      </ul>

      {savedBuilds?.length > 0 && (
        <div className="build-compare">
          <h4>Сохранённые сборки</h4>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Цена</th>
                  <th>TDP</th>
                  <th>Баллы</th>
                </tr>
              </thead>
              <tbody>
                {savedBuilds.map((build) => (
                  <tr key={build.id}>
                    <td>{build.name}</td>
                    <td>{build.total.toLocaleString('ru-RU')} ₽</td>
                    <td>{build.tdp}W</td>
                    <td>{build.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {savedBuilds.length >= 2 && (
            <button type="button" className="btn btn-outline" style={{ marginTop: '0.75rem' }} onClick={onCompareBuilds}>
              Сравнить сборки
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export { calcStats }
