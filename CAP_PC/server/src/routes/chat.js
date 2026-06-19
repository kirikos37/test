import { Router } from 'express'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const messagesPath = join(__dirname, '../data/messages.json')

const router = Router()

function loadMessages() {
  try {
    return JSON.parse(readFileSync(messagesPath, 'utf8'))
  } catch {
    return []
  }
}

function saveMessages(messages) {
  writeFileSync(messagesPath, JSON.stringify(messages, null, 2), 'utf8')
}

router.post('/', (req, res) => {
  const { name, email, message } = req.body

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Заполните все поля' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Некорректный email' })
  }

  const entry = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
  }

  const messages = loadMessages()
  messages.push(entry)
  saveMessages(messages)

  res.json({
    ok: true,
    reply: 'Сообщение получено. Мы ответим в течение 24 часов.',
  })
})

export default router
