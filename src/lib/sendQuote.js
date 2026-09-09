// Quote submission helpers: build a clean email and deliver it via mailto:,
// with a Gmail-web fallback for desktops that have no registered mail handler.

export const CONTACT = {
  email: 'info@shriradheylogistics.co.in',
  phoneDisplay: '+91 9359001122',
  phoneTel: '+919359001122',
  whatsapp: '919359001122',
}

const ORDER = [
  ['fullName', 'Full Name'],
  ['company', 'Company'],
  ['phone', 'Phone'],
  ['email', 'Email'],
  ['city', 'City / Location'],
  ['service', 'Service Required'],
  ['trucks', 'Number of Trucks'],
  ['cargoType', 'Cargo Type'],
  ['pickup', 'Pickup Location'],
  ['delivery', 'Delivery Location'],
  ['tonnage', 'Tonnage / Volume'],
  ['frequency', 'Frequency'],
  ['message', 'Message'],
]

export function buildSubject(values) {
  const name = (values.fullName || '').trim() || 'Website Visitor'
  const service = (values.service || '').trim() || 'General Enquiry'
  return `Quote Request from ${name} — ${service}`
}

export function buildBody(values) {
  const lines = ['New quote request from the Shri Radhey Logistics website:', '']
  for (const [key, label] of ORDER) {
    const v = (values[key] || '').toString().trim()
    if (v) lines.push(`${label}: ${v}`)
  }
  lines.push('', '— Sent from shriradheylogistics.co.in')
  return lines.join('\n')
}

export function gmailLink(values) {
  const su = encodeURIComponent(buildSubject(values))
  const body = encodeURIComponent(buildBody(values))
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    CONTACT.email
  )}&su=${su}&body=${body}`
}

export function mailtoLink(values) {
  const su = encodeURIComponent(buildSubject(values))
  const body = encodeURIComponent(buildBody(values))
  return `mailto:${CONTACT.email}?subject=${su}&body=${body}`
}

export function whatsappLink(service) {
  const svc = (service || 'logistics services').toString().trim() || 'logistics services'
  const text = encodeURIComponent(`Hi, I'd like a quote for ${svc}`)
  return `https://wa.me/${CONTACT.whatsapp}?text=${text}`
}

export function telLink() {
  return `tel:${CONTACT.phoneTel}`
}

/**
 * Fire mailto: and, if the page is still here ~700ms later (no mail handler
 * took focus), open Gmail web compose as a fallback. Works on mobile (native
 * mail app) and desktop (mail app, else Gmail tab).
 */
export function submitQuote(values) {
  const mailto = mailtoLink(values)
  let handled = false
  const onHide = () => {
    if (document.hidden) handled = true
  }
  document.addEventListener('visibilitychange', onHide)
  window.addEventListener('blur', () => (handled = true), { once: true })

  // Trigger the mail client.
  window.location.href = mailto

  return new Promise((resolve) => {
    setTimeout(() => {
      document.removeEventListener('visibilitychange', onHide)
      if (!handled) {
        // No mail client grabbed focus — open Gmail compose in a new tab.
        window.open(gmailLink(values), '_blank', 'noopener,noreferrer')
      }
      resolve(true)
    }, 700)
  })
}

// --- Validation ---
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^[+\d][\d\s\-()]{7,}$/

export function validateQuote(values, fields) {
  const errors = {}
  for (const f of fields) {
    const v = (values[f.name] || '').toString().trim()
    if (f.required && !v) {
      errors[f.name] = `${f.label} is required`
      continue
    }
    if (!v) continue
    if (f.type === 'email' && !EMAIL_RE.test(v)) errors[f.name] = 'Enter a valid email address'
    if (f.type === 'tel' && !PHONE_RE.test(v)) errors[f.name] = 'Enter a valid phone number'
  }
  return errors
}
