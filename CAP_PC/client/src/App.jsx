import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import HomePage from './pages/HomePage'
import PriceComparePage from './pages/PriceComparePage'
import NewsPage from './pages/NewsPage'
import TrendsPage from './pages/TrendsPage'
import ConfiguratorPage from './pages/ConfiguratorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="prices" element={<PriceComparePage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="trends" element={<TrendsPage />} />
          <Route path="configurator" element={<ConfiguratorPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
