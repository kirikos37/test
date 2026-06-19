import './PartPicker.css'

function isCompatible(part, categoryId, selected) {
  const cpu = selected.cpu
  const mb = selected.motherboard
  const ram = selected.ram

  if (categoryId === 'motherboard' && cpu && part.socket !== cpu.socket) {
    return { ok: false, reason: `Сокет ${part.socket} не совместим с ${cpu.name}` }
  }
  if (categoryId === 'cpu' && mb && part.socket !== mb.socket) {
    return { ok: false, reason: `Сокет ${part.socket} не совместим с ${mb.name}` }
  }
  if (categoryId === 'ram' && mb && part.ramType !== mb.ramType) {
    return { ok: false, reason: `Тип ${part.ramType} не подходит к ${mb.name}` }
  }
  if (categoryId === 'motherboard' && ram && part.ramType !== ram.ramType) {
    return { ok: false, reason: `Плата ${part.ramType} не подходит к ${ram.name}` }
  }
  return { ok: true }
}

export default function PartPicker({ catalog, selected, onSelect }) {
  if (!catalog) return null

  return (
    <div className="part-picker">
      {catalog.categories.map((cat) => {
        const parts = catalog.parts[cat.id] || []
        return (
          <div key={cat.id} className="part-picker__category">
            <div className="part-picker__head">
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
            <div className="part-picker__list">
              {parts.map((part) => {
                const compat = isCompatible(part, cat.id, selected)
                const isSelected = selected[cat.id]?.id === part.id
                return (
                  <label
                    key={part.id}
                    className={`part-option ${isSelected ? 'selected' : ''} ${!compat.ok ? 'disabled' : ''}`}
                  >
                    <input
                      type="radio"
                      name={cat.id}
                      checked={isSelected}
                      disabled={!compat.ok}
                      onChange={() => compat.ok && onSelect(cat.id, part)}
                    />
                    <div className="part-option__info">
                      <div className="part-option__name">{part.name}</div>
                      <div className="part-option__meta">
                        {part.socket && `Сокет: ${part.socket} · `}
                        {part.ramType && `${part.ramType} · `}
                        {part.tdp && `TDP: ${part.tdp}W · `}
                        {part.wattage && `${part.wattage}W · `}
                        {part.capacity && `${part.capacity >= 1024 ? part.capacity / 1024 + 'TB' : part.capacity + 'GB'}`}
                        {part.score && ` · Балл: ${part.score}`}
                      </div>
                      {!compat.ok && <div className="compat-warning">{compat.reason}</div>}
                    </div>
                    <div className="part-option__price">{part.price.toLocaleString('ru-RU')} ₽</div>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
