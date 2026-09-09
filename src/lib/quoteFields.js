// Shared service options used by the modal + contact form dropdowns.
export const SERVICE_OPTIONS = [
  'Full Truck Load (FTL)',
  'Part Truck Load (PTL)',
  'Pan-India Network',
  'Heavy Equipment',
  '3PL / Warehousing',
  'Plant Shifting',
  'Other',
]

export const TRUCKS_OPTIONS = ['1', '2-5', '5-10', '10+', 'Not sure']

export const FREQUENCY_OPTIONS = ['One-time', 'Weekly', 'Monthly', 'Ongoing contract']

/**
 * Field config for the rich Get Quote modal (13 fields).
 * type: text | tel | email | select | textarea
 * Half-width fields pair up on desktop via `half: true`.
 */
export const QUOTE_FIELDS = [
  { name: 'fullName', label: 'Full Name', type: 'text', required: true, placeholder: 'John Doe', half: true },
  { name: 'company', label: 'Company Name', type: 'text', placeholder: 'Your Company Ltd.', half: true },
  { name: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '+91 98765 43210', half: true },
  { name: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'john@company.com', half: true },
  { name: 'city', label: 'City / Location', type: 'text', required: true, placeholder: 'Lucknow', half: true },
  { name: 'service', label: 'Service Required', type: 'select', required: true, options: SERVICE_OPTIONS, placeholder: 'Select a service', half: true },
  { name: 'trucks', label: 'Number of Trucks Needed', type: 'select', options: TRUCKS_OPTIONS, placeholder: 'Select', half: true },
  { name: 'cargoType', label: 'Cargo Type', type: 'text', placeholder: 'e.g. FMCG, pharma, machinery', half: true },
  { name: 'pickup', label: 'Pickup Location', type: 'text', placeholder: 'City / address', half: true },
  { name: 'delivery', label: 'Delivery Location', type: 'text', placeholder: 'City / address', half: true },
  { name: 'tonnage', label: 'Approx. Tonnage / Volume', type: 'text', placeholder: 'e.g. 9 MT / 1200 cu.ft', half: true },
  { name: 'frequency', label: 'Frequency', type: 'select', options: FREQUENCY_OPTIONS, placeholder: 'Select frequency', half: true },
  { name: 'message', label: 'Message / Additional Requirements', type: 'textarea', placeholder: 'Tell us about timelines, special handling, or anything else…', half: false },
]

// Human-readable labels for building the email body.
export const FIELD_LABELS = QUOTE_FIELDS.reduce((acc, f) => {
  acc[f.name] = f.label
  return acc
}, {})
