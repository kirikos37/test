import { Router } from 'express'
import { getNews } from '../services/newsParser.js'

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const news = await getNews()
    res.json({ items: news })
  } catch (err) {
    res.status(500).json({ error: 'Не удалось загрузить новости', details: err.message })
  }
})

export default router
