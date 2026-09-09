import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../lib/icons.jsx'
import Button from './ui/Button.jsx'
import { useQuote } from '../context/QuoteContext.jsx'
import { QUOTE_FIELDS } from '../lib/quoteFields.js'
import {
  CONTACT,
  submitQuote,
  validateQuote,
  whatsappLink,
  telLink,
} from '../lib/sendQuote.js'

const EMPTY = QUOTE_FIELDS.reduce((a, f) => ({ ...a, [f.name]: '' }), {})

function Field({ field, value, error, onChange }) {
  const id = `q-${field.name}`
  const common = {
    id,
    name: field.name,
    value,
    onChange: (e) => onChange(field.name, e.target.value),
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': error ? `${id}-err` : undefined,
  }
  return (
    <div
      className={`field${error ? ' has-error' : ''}`}
      style={field.half ? { marginBottom: 0 } : { marginBottom: 0, gridColumn: '1 / -1' }}
    >
      <label htmlFor={id}>
        {field.label}{' '}
        {field.required && (
          <span className="req" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {field.type === 'select' ? (
        <select {...common}>
          <option value="">{field.placeholder || 'Select'}</option>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea {...common} placeholder={field.placeholder} rows={4} />
      ) : (
        <input {...common} type={field.type} placeholder={field.placeholder} />
      )}
      {error && (
        <span className="err-msg" id={`${id}-err`} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default function QuoteModal() {
  const { isOpen, prefill, closeQuote } = useQuote()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)
  const dialogRef = useRef(null)
  const lastActive = useRef(null)

  // Seed/reset when opening.
  useEffect(() => {
    if (isOpen) {
      lastActive.current = document.activeElement
      setValues({ ...EMPTY, ...(prefill?.service ? { service: prefill.service } : {}) })
      setErrors({})
      setSent(false)
    }
  }, [isOpen, prefill])

  // Body scroll lock + focus management + ESC + focus trap.
  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => document.getElementById('q-fullName')?.focus(), 60)

    const onKey = (e) => {
      if (e.key === 'Escape') {
        closeQuote()
        return
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const f = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = prevOverflow
      document.removeEventListener('keydown', onKey)
      lastActive.current?.focus?.()
    }
  }, [isOpen, closeQuote])

  const onChange = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validateQuote(values, QUOTE_FIELDS)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      const firstBad = QUOTE_FIELDS.find((f) => errs[f.name])
      if (firstBad) document.getElementById(`q-${firstBad.name}`)?.focus()
      return
    }
    await submitQuote(values)
    setSent(true)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-scrim"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeQuote()
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className="modal-close" onClick={closeQuote} aria-label="Close quote form">
              <Icon name="close" />
            </button>

            {sent ? (
              <div className="modal-success">
                <span className="ms-ic">
                  <Icon name="check" size={38} strokeWidth={2.4} />
                </span>
                <h2 id="quote-title">Your request is on its way</h2>
                <p>
                  We've opened your email with the quote details pre-filled. If it didn't open, we've
                  launched Gmail in a new tab. Our team replies within 24 hours — or reach us directly
                  below.
                </p>
                <div className="modal-secondary" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <Button
                    as="a"
                    variant="whatsapp"
                    icon="whatsapp"
                    href={whatsappLink(values.service)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp Us
                  </Button>
                  <Button as="a" variant="call" icon="phone" href={telLink()}>
                    Call {CONTACT.phoneDisplay}
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="modal-head">
                  <span className="eyebrow-sm">Request a Quote</span>
                  <h2 id="quote-title">Tell us what you need to move</h2>
                  <p>Fill in the details and we'll get back to you within 24 hours.</p>
                </div>
                <form className="modal-body" onSubmit={onSubmit} noValidate>
                  <div
                    className="quote-fields"
                    style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
                  >
                    {QUOTE_FIELDS.map((f) => (
                      <Field
                        key={f.name}
                        field={f}
                        value={values[f.name]}
                        error={errors[f.name]}
                        onChange={onChange}
                      />
                    ))}
                  </div>

                  <div className="modal-actions">
                    <Button type="submit" variant="primary" iconRight="arrow-right">
                      Send Quote Request
                    </Button>
                  </div>
                  <div className="modal-secondary">
                    <Button
                      as="a"
                      variant="whatsapp"
                      icon="whatsapp"
                      href={whatsappLink(values.service)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp Us
                    </Button>
                    <Button as="a" variant="call" icon="phone" href={telLink()}>
                      Call Now
                    </Button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
