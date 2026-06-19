import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Header.css'

export default function Header() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (q) {
      navigate(`/prices?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="logo">
          <span className="logo__name">CAP PC</span>
          <span className="logo__tagline">Compare · Assemble · Purchase</span>
        </Link>

        <form className="header__search" onSubmit={handleSearch}>
          <input
            type="search"
            placeholder="Глобальный поиск комплектующих..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Поиск товаров"
          />
          <button type="submit" className="btn btn-accent">
            Найти
          </button>
        </form>

        <nav className="header__nav">
          <NavLink to="/prices">Цены</NavLink>
          <NavLink to="/news">Новости</NavLink>
          <NavLink to="/trends">Тренды</NavLink>
          <NavLink to="/configurator">Конфигуратор</NavLink>
        </nav>
      </div>
    </header>
  )
}
