import { useRef, useState } from 'react'
import { api } from '../../services/api'
import './SupportChat.css'

export default function SupportChat() {
  const [open, setOpen] = useState(false)
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const formRef = useRef(null)

  const validateField = (input) => {
    if (input.name === 'name' && input.value.trim().length < 2) {
      input.setCustomValidity('Имя должно содержать минимум 2 символа')
      return false
    }
    if (input.name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input.value)) {
        input.setCustomValidity('Введите корректный email')
        return false
      }
    }
    if (input.name === 'message' && input.value.trim().length < 10) {
      input.setCustomValidity('Сообщение должно быть не короче 10 символов')
      return false
    }
    input.setCustomValidity('')
    return true
  }

  const handleInvalid = (e) => {
    validateField(e.target)
  }

  const handleInput = (e) => {
    e.target.setCustomValidity('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccess('')
    const form = formRef.current
    const inputs = form.querySelectorAll('input, textarea')
    let valid = true

    inputs.forEach((input) => {
      if (!validateField(input) || !input.checkValidity()) {
        valid = false
        input.reportValidity()
      }
    })

    if (!valid) return

    const data = new FormData(form)
    setLoading(true)
    try {
      const res = await api.sendChat({
        name: data.get('name'),
        email: data.get('email'),
        message: data.get('message'),
      })
      setSuccess(res.reply)
      form.reset()
    } catch (err) {
      setSuccess('')
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="chat-widget">
      {open && (
        <div className="chat-panel">
          <div className="chat-panel__header">Чат поддержки</div>
          <div className="chat-panel__body">
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="chat-name">Имя</label>
                <input
                  id="chat-name"
                  name="name"
                  type="text"
                  required
                  onInvalid={handleInvalid}
                  onInput={handleInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="chat-email">Email</label>
                <input
                  id="chat-email"
                  name="email"
                  type="email"
                  required
                  onInvalid={handleInvalid}
                  onInput={handleInput}
                />
              </div>
              <div className="form-group">
                <label htmlFor="chat-message">Сообщение</label>
                <textarea
                  id="chat-message"
                  name="message"
                  required
                  onInvalid={handleInvalid}
                  onInput={handleInput}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
                {loading ? 'Отправка...' : 'Отправить'}
              </button>
              {success && <p className="chat-success">{success}</p>}
            </form>
          </div>
        </div>
      )}
      <button
        type="button"
        className="chat-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Открыть чат поддержки"
      >
        💬
      </button>
    </div>
  )
}
