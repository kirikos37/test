import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import os from 'os'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import pricesRouter from './routes/prices.js'
import newsRouter from './routes/news.js'
import trendsRouter from './routes/trends.js'
import chatRouter from './routes/chat.js'
import catalogRouter from './routes/catalog.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../../.env') })

const isProduction = process.env.NODE_ENV === 'production'
const clientDist = path.join(__dirname, '../../client/dist')

function getLocalIp() {
  const nets = os.networkInterfaces()
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address
    }
  }
  return null
}

function isDevOrigin(origin) {
  if (!origin) return true
  return /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/.test(origin)
}

const app = express()
const PORT = process.env.PORT || 3001
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173'

if (!isProduction) {
  app.use(
    cors({
      origin(origin, callback) {
        if (isDevOrigin(origin) || origin === CLIENT_URL) {
          callback(null, true)
        } else {
          callback(null, false)
        }
      },
    })
  )
}

app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'CAP PC API', mode: isProduction ? 'production' : 'development' })
})

app.use('/api/prices', pricesRouter)
app.use('/api/news', newsRouter)
app.use('/api/trends', trendsRouter)
app.use('/api/chat', chatRouter)
app.use('/api/catalog', catalogRouter)

if (isProduction) {
  if (!fs.existsSync(clientDist)) {
    console.error('Ошибка: папка client/dist не найдена. Выполните: npm run build')
    process.exit(1)
  }

  app.use(express.static(clientDist))

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIp()
  const mode = isProduction ? 'PRODUCTION' : 'development'

  console.log(`CAP PC [${mode}]: http://localhost:${PORT}`)
  if (ip) console.log(`CAP PC [${mode}] (сеть): http://${ip}:${PORT}`)

  if (isProduction) {
    console.log('Статика: client/dist + API на одном порту')
  } else {
    console.log('Dev: запустите client (npm run dev) на порту 5173')
  }
})
