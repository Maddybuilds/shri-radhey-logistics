import { useState } from 'react'
import Icon from '../lib/icons.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import { Eyebrow } from '../components/ui/SectionHeading.jsx'
import { SERVICE_OPTIONS } from '../lib/quoteFields.js'
import { CONTACT, submitQuote, validateQuote, telLink, whatsappLink } from '../lib/sendQuote.js'

// Verbatim 6-field copy form.
const FIELDS = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe' },
  { name: 'company', label: 'Company Name', type: 'text', placeholder: 'Your Company Ltd.' },
  { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'john@company.com' },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+91 98765 43210' },
  { name: 'service', label: 'Service Required', type: 'select', options: SERVICE_OPTIONS, placeholder: 'Select a service' },
  {
    name: 'message',
    label: 'Message',
    type: 'textarea',
    required: true,
    placeholder:
      'Tell us about your logistics requirements, pickup/delivery locations, cargo details, timeline...',
  },
]

const EMPTY = FIELDS.reduce((a, f) => ({ ...a, [f.name]: '' }), {})

const CHANNELS = [
  {
    icon: 'phone',
    label: 'Call us',
    lines: [
      { text: '+91 9359001122', href: 'tel:+919359001122' },
      { text: '+91 9140334550', href: 'tel:+919140334550' },
    ],
  },
  {
    icon: 'mail',
    label: 'Email us',
    lines: [{ text: CONTACT.email, href: `mailto:${CONTACT.email}` }],
  },
  {
    icon: 'pin',
    label: 'Head office',
    lines: [{ text: 'Lucknow, Uttar Pradesh, India' }],
  },
  {
    icon: 'clock',
    label: 'Business hours',
    lines: [{ text: 'Mon–Sat · 9:00 AM – 6:00 PM' }, { text: 'Sunday · Emergency only' }],
  },
]

const OFFICES = [
  { name: 'Noida Transport Nagar', region: 'Uttar Pradesh', status: 'Operational' },
  { name: 'Ludhiana Branch', region: 'Punjab', status: 'Coming Soon' },
]

export default function Contact() {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  const onChange = (name, v) => {
    setValues((s) => ({ ...s, [name]: v }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const errs = validateQuote(values, FIELDS)
    setErrors(errs)
    if (Object.keys(errs).length) {
      const bad = FIELDS.find((f) => errs[f.name])
      if (bad) document.getElementById(`c-${bad.name}`)?.focus()
      return
    }
    await submitQuote(values)
    setSent(true)
  }

  return (
    <section id="contact" className="sr-section contact-section">
      <div className="sr-wrap">
        <div className="contact-layout">
          {/* LEFT — dark info rail */}
          <Reveal>
            <div className="contact-intro">
              <Eyebrow>Get in Touch</Eyebrow>
              <h2 className="sr-h2 contact-title">Let's Start a Conversation</h2>
              <p className="contact-lead">
                We're here to help streamline your logistics operations with tailored solutions.
                Reach out and our team responds within 24 hours.
              </p>

              <div className="contact-channels">
                {CHANNELS.map((c) => (
                  <div className="channel" key={c.label}>
                    <span className="channel-ic">
                      <Icon name={c.icon} />
                    </span>
                    <div className="channel-body">
                      <span className="channel-label">{c.label}</span>
                      {c.lines.map((l) =>
                        l.href ? (
                          <a className="channel-val" href={l.href} key={l.text}>
                            {l.text}
                          </a>
                        ) : (
                          <span className="channel-val" key={l.text}>
                            {l.text}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="office-strip">
                {OFFICES.map((o) => (
                  <div className="office-tag" key={o.name}>
                    <span className="ot-pin">
                      <Icon name="pin" />
                    </span>
                    <div>
                      <span className="ot-name">{o.name}</span>
                      <span className="ot-region">{o.region}</span>
                    </div>
                    <span
                      className={`status-chip ${
                        o.status === 'Operational' ? 'is-operational' : 'is-upcoming'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="assist-cta">
                <div className="assist-copy">
                  <span className="assist-kicker">Need immediate assistance?</span>
                  <a className="assist-phone" href={telLink()}>
                    {CONTACT.phoneDisplay}
                  </a>
                </div>
                <div className="assist-actions">
                  <Button as="a" variant="accent" icon="phone" href={telLink()}>
                    Call Now
                  </Button>
                  <Button as="a" variant="whatsapp" icon="whatsapp" href={whatsappLink()}>
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — floating form card */}
          <Reveal delay={0.1}>
            <div className="contact-form-card">
              <div className="cf-head">
                <span className="cf-badge">
                  <Icon name="briefcase" />
                </span>
                <div>
                  <h3>Request a Quote</h3>
                  <p className="cf-note">Fill out the form and we'll get back to you within 24 hours.</p>
                </div>
              </div>

              {sent ? (
                <div className="cf-success">
                  <span className="cf-success-ic">
                    <Icon name="check" size={32} strokeWidth={2.4} />
                  </span>
                  <h4>Thank you!</h4>
                  <p>
                    Your email is ready to send. If it didn't open automatically, we've launched Gmail
                    in a new tab. We'll be in touch within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate>
                  {FIELDS.map((f) => {
                    const id = `c-${f.name}`
                    const common = {
                      id,
                      name: f.name,
                      value: values[f.name],
                      onChange: (e) => onChange(f.name, e.target.value),
                      'aria-invalid': errors[f.name] ? 'true' : undefined,
                      'aria-describedby': errors[f.name] ? `${id}-err` : undefined,
                    }
                    return (
                      <div className={`field${errors[f.name] ? ' has-error' : ''}`} key={f.name}>
                        <label htmlFor={id}>
                          {f.label}{' '}
                          {f.required && (
                            <span className="req" aria-hidden="true">
                              *
                            </span>
                          )}
                        </label>
                        {f.type === 'select' ? (
                          <select {...common}>
                            <option value="">{f.placeholder}</option>
                            {f.options.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        ) : f.type === 'textarea' ? (
                          <textarea {...common} placeholder={f.placeholder} rows={5} />
                        ) : (
                          <input {...common} type={f.type} placeholder={f.placeholder} />
                        )}
                        {errors[f.name] && (
                          <span className="err-msg" id={`${id}-err`} role="alert">
                            {errors[f.name]}
                          </span>
                        )}
                      </div>
                    )
                  })}
                  <Button type="submit" variant="accent" block iconRight="arrow-right">
                    Send Message
                  </Button>
                  <p className="cf-privacy">We respect your privacy — your details are only used to respond to your enquiry.</p>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
