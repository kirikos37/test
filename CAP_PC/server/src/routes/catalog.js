import { Router } from 'express'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(readFileSync(join(__dirname, '../data/catalog.json'), 'utf8'))

const router = Router()

router.get('/', (_req, res) => {
  res.json(catalog)
})

export default router
