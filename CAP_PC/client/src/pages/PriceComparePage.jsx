import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik'
import { api } from '../services/api'
import CompareTable, { METHODS } from '../components/prices/CompareTable'
import PriceChart from '../components/prices/PriceChart'
import { useLocalStorage } from '../hooks/useLocalStorage'

const isUrl = (str) => {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

export default function PriceComparePage() {
  const [searchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const [result, setResult] = useLocalStorage('cap-pc-last-search', null)
  const [method, setMethod] = useState('min')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validate = (values) => {
    const errors = {}
    const filled = values.queries.filter((q) => q.trim())
    if (filled.length === 0) {
      errors.queries = 'Добавьте хотя бы один товар или ссылку'
    }
    values.queries.forEach((q, i) => {
      if (q.trim() && isUrl(q.trim()) && !q.trim().startsWith('http')) {
        errors[`queries.${i}`] = 'Ссылка должна начинаться с http'
      }
    })
    return errors
  }

  const runSearch = async (queries) => {
    setLoading(true)
    setError('')
    try {
      const data = await api.searchPrices(queries)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialQ) {
      runSearch([initialQ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQ])

  return (
    <div>
      <h1 className="page-title">Сравнение цен на товары</h1>
      <p className="page-subtitle">
        Введите названия комплектующих или ссылки на товары — сравним цены в магазинах России
        (приоритет: Иваново).
      </p>

      <div className="card">
        <Formik
          initialValues={{ queries: initialQ ? [initialQ, ''] : ['', ''] }}
          validate={validate}
          onSubmit={(values) => {
            const queries = values.queries.map((q) => q.trim()).filter(Boolean)
            runSearch(queries)
          }}
          enableReinitialize
        >
          {({ values }) => (
            <Form>
              <FieldArray name="queries">
                {({ push, remove }) => (
                  <>
                    {values.queries.map((_, index) => (
                      <div className="form-group" key={index}>
                        <label htmlFor={`q-${index}`}>
                          Товар или ссылка {index + 1}
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <Field
                            id={`q-${index}`}
                            name={`queries.${index}`}
                            placeholder="RTX 4060 или https://..."
                          />
                          {values.queries.length > 1 && (
                            <button type="button" className="btn btn-outline" onClick={() => remove(index)}>
                              ✕
                            </button>
                          )}
                        </div>
                        <ErrorMessage name={`queries.${index}`} component="div" className="form-error" />
                      </div>
                    ))}
                    {values.queries.length < 5 && (
                      <button type="button" className="btn btn-outline" onClick={() => push('')}>
                        + Добавить товар
                      </button>
                    )}
                  </>
                )}
              </FieldArray>
              <ErrorMessage name="queries" component="div" className="form-error" />
              <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1rem' }}>
                {loading ? 'Поиск...' : 'Сравнить цены'}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      {error && <p className="form-error" style={{ marginTop: '1rem' }}>{error}</p>}

      {result && (
        <>
          {result.disclaimer && <p className="disclaimer">{result.disclaimer}</p>}

          <div style={{ margin: '1rem 0', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.entries(METHODS).map(([key, { label }]) => (
              <button
                key={key}
                type="button"
                className={`btn ${method === key ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setMethod(key)}
              >
                {label}
              </button>
            ))}
          </div>

          <CompareTable items={result.items} method={method} />
          <PriceChart items={result.items} />
        </>
      )}
    </div>
  )
}
