import { Link } from 'react-router-dom'
import './HomePage.css'

const FEATURES = [
  {
    to: '/prices',
    icon: '💰',
    title: 'Сравнение цен на товары',
    desc: 'Поиск по названию и ссылке, сравнение магазинов Иваново и России, графики цен.',
  },
  {
    to: '/news',
    icon: '📰',
    title: 'Новости сферы ПК',
    desc: 'Актуальные новости из RSS и VK о компьютерных технологиях.',
  },
  {
    to: '/trends',
    icon: '📈',
    title: 'Современные тренды',
    desc: 'Тренды рынка ПК: GPU, DDR5, AI-ускорители и многое другое.',
  },
  {
    to: '/configurator',
    icon: '🛠️',
    title: 'Конфигуратор ПК',
    desc: 'Соберите ПК из комплектующих, проверьте совместимость и сравните сборки.',
  },
]

export default function HomePage() {
  return (
    <div className="home">
      <section className="home__hero">
        <h1>CAP PC</h1>
        <p className="home__slogan">Compare · Assemble · Purchase</p>
        <p className="home__desc">
          Экономьте на покупке ПК: сравнивайте цены на комплектующие, собирайте конфигурацию
          с проверкой совместимости и следите за новостями и трендами мира компьютеров.
        </p>
      </section>

      <div className="home__grid">
        {FEATURES.map((f) => (
          <article key={f.to} className="card home__card">
            <span className="home__card-icon">{f.icon}</span>
            <h2>{f.title}</h2>
            <p>{f.desc}</p>
            <Link to={f.to} className="btn btn-primary">
              Перейти
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
