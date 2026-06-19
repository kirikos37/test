import { useEffect, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import { api } from '../services/api'
import { useLocalStorage } from '../hooks/useLocalStorage'
import PartPicker from '../components/configurator/PartPicker'
import BuildSummary, { calcStats } from '../components/configurator/BuildSummary'
import './ConfiguratorPage.css'

export default function ConfiguratorPage() {
  const [catalog, setCatalog] = useState(null)
  const [selected, setSelected] = useState({})
  const [savedBuilds, setSavedBuilds] = useLocalStorage('cap-pc-builds', [])
  const [loading, setLoading] = useState(true)
  const [compareMsg, setCompareMsg] = useState('')

  useEffect(() => {
    api
      .getCatalog()
      .then(setCatalog)
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = (categoryId, part) => {
    setSelected((prev) => ({ ...prev, [categoryId]: part }))
  }

  const handleCompareBuilds = () => {
    if (savedBuilds.length < 2) return
    const sorted = [...savedBuilds].sort((a, b) => a.total - b.total)
    const best = sorted[0]
    setCompareMsg(
      `Оптимальная по цене: «${best.name}» — ${best.total.toLocaleString('ru-RU')} ₽. ` +
        `Самая мощная по баллам: «${[...savedBuilds].sort((a, b) => b.score - a.score)[0].name}».`
    )
  }

  if (loading) return <p className="loading">Загрузка каталога...</p>

  return (
    <div>
      <h1 className="page-title">Конфигуратор ПК</h1>
      <p className="page-subtitle">
        Выберите комплектующие — мы проверим совместимость сокетов и типа памяти. Сохраните
        несколько сборок и сравните их.
      </p>

      <div className="configurator-layout">
        <div>
          <PartPicker catalog={catalog} selected={selected} onSelect={handleSelect} />

          <div className="card" style={{ marginTop: '1rem' }}>
            <h3>Сохранить сборку</h3>
            <Formik
              initialValues={{ name: '' }}
              validate={(values) => {
                const errors = {}
                if (!values.name.trim()) errors.name = 'Введите название сборки'
                if (Object.keys(selected).length < 3) {
                  errors.name = errors.name || 'Выберите минимум 3 компонента'
                }
                return errors
              }}
              onSubmit={(values, { resetForm }) => {
                const stats = calcStats(selected)
                const build = {
                  id: Date.now(),
                  name: values.name.trim(),
                  parts: { ...selected },
                  ...stats,
                  createdAt: new Date().toISOString(),
                }
                setSavedBuilds((prev) => [...prev, build].slice(-5))
                resetForm()
                setCompareMsg('')
              }}
            >
              <Form>
                <div className="form-group">
                  <label htmlFor="build-name">Название сборки</label>
                  <Field id="build-name" name="name" placeholder="Игровой ПК 2026" />
                  <ErrorMessage name="name" component="div" className="form-error" />
                </div>
                <button type="submit" className="btn btn-accent">
                  Сохранить
                </button>
              </Form>
            </Formik>
          </div>

          {compareMsg && <p className="disclaimer" style={{ marginTop: '1rem' }}>{compareMsg}</p>}
        </div>

        <BuildSummary
          selected={selected}
          savedBuilds={savedBuilds}
          onCompareBuilds={handleCompareBuilds}
        />
      </div>
    </div>
  )
}
