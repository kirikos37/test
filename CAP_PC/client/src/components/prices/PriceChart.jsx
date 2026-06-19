import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

export default function PriceChart({ items }) {
  if (!items?.length) return null

  const data = items[0]?.history || []
  if (!data.length) return null

  return (
    <div className="card" style={{ marginTop: '1rem' }}>
      <h3>График цен: {items[0].name}</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e8ef" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v) => [`${v.toLocaleString('ru-RU')} ₽`, 'Цена']} />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            name="Цена, ₽"
            stroke="rgb(97, 106, 190)"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
