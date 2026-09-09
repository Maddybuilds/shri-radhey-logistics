/**
 * Inline SVG icon set (no icon dependency). Stroke style, 24x24, currentColor.
 * Usage: <Icon name="truck" /> — size + className optional.
 */

const P = {
  // --- general / ui ---
  check: <polyline points="20 6 9 17 4 12" />,
  'arrow-right': (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </>
  ),
  'arrow-down': (
    <>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </>
  ),
  close: (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ),
  // --- contact ---
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-10 6L2 7" />
    </>
  ),
  pin: (
    <>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 14" />
    </>
  ),
  whatsapp: (
    <path d="M17.5 14.4c-.3-.2-1.7-.8-2-.9-.3-.1-.5-.2-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-1.6-.8-2.6-1.4-3.7-3.2-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6 1.9.8 2.7.9 3.6.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.4z M12 2a10 10 0 0 0-8.6 15l-1.3 4.7L7 20.4A10 10 0 1 0 12 2z" />
  ),
  // --- stats / structure ---
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 22v-4h6v4M9 6h.01M15 6h.01M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
    </>
  ),
  rupee: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9 8h6M9 11h6M14 8c0 2.5-2 4-5 4l4 4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </>
  ),
  infinity: (
    <path d="M18.6 6.6a4.8 4.8 0 1 0 0 10.8c2.4 0 3.6-2.4 5.4-5.4M5.4 17.4a4.8 4.8 0 1 1 0-10.8C7.8 6.6 9 9 10.8 12 9 15 7.8 17.4 5.4 17.4z" />
  ),
  // --- core values ---
  excellence: (
    <polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9" />
  ),
  reliability: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 11 11 13 15 9" />
    </>
  ),
  trust: (
    <path d="M11 17 7 21l-4-4 4-2 2-3 3-3 3 1 4-4 1 3-3 4-3 1-2 3z M14 11l3 3" />
  ),
  innovation: (
    <>
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V18h6v-1.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
    </>
  ),
  // --- growth strategy ---
  expansion: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20M12 2a14 14 0 0 1 0 20M12 2a14 14 0 0 0 0 20" />
    </>
  ),
  tech: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  diversification: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  partnership: (
    <path d="M11 4 7 8H3v6l4 4 5-3 5 3 4-4V8h-4l-4-4-2 2 3 3-1 1-3-3z" />
  ),
  // --- services ---
  truck: (
    <>
      <path d="M1 4h14v11H1zM15 8h4l3 3v4h-7z" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
    </>
  ),
  box: (
    <>
      <path d="M21 8 12 3 3 8v8l9 5 9-5z" />
      <path d="M3 8l9 5 9-5M12 13v8" />
    </>
  ),
  network: (
    <>
      <circle cx="12" cy="12" r="9" />
      <ellipse cx="12" cy="12" rx="4" ry="9" />
      <path d="M3 12h18" />
    </>
  ),
  expertise: (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  // --- industry tiles ---
  fmcg: (
    <>
      <circle cx="9" cy="21" r="1" />
      <circle cx="18" cy="21" r="1" />
      <path d="M2 3h3l2.6 12.6a2 2 0 0 0 2 1.4h7.7a2 2 0 0 0 2-1.6L23 7H6" />
    </>
  ),
  food: (
    <>
      <path d="M4 3v7a3 3 0 0 0 6 0V3M7 3v18" />
      <path d="M17 3c-1.5 0-3 1.5-3 5s1.5 5 3 5v8" />
    </>
  ),
  ration: (
    <>
      <path d="M4 7h16l-1 13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2M9 12h6" />
    </>
  ),
  heavy: (
    <>
      <path d="M3 21h18M5 21V8l9-4 1 3M5 8h6" />
      <path d="M15 7l5 2v4h-5z" />
      <circle cx="8" cy="21" r="0" />
    </>
  ),
  atm: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <line x1="6" y1="15" x2="10" y2="15" />
    </>
  ),
  plant: (
    <>
      <path d="M2 21h20M4 21V10l5-3v3l5-3v14M14 21V7l6 4v10" />
      <path d="M8 13v4M18 14v3" />
    </>
  ),
  infra: (
    <>
      <path d="M2 20h20M4 20V8l8-5 8 5v12" />
      <path d="M9 20v-5h6v5M9 9h.01M15 9h.01" />
    </>
  ),
  manufacturing: (
    <>
      <path d="M2 20h20M4 20V9l5 3V9l5 3V9l6 4v7" />
      <circle cx="12" cy="6" r="2" />
    </>
  ),
  // --- industries we serve ---
  pharma: (
    <>
      <rect x="3" y="8" width="18" height="13" rx="2" />
      <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M12 12v5M9.5 14.5h5" />
    </>
  ),
  apparel: (
    <path d="M16 3 21 7l-3 3-2-1.5V21H8V8.5L6 10 3 7l5-4 2 2a2 2 0 0 0 4 0z" />
  ),
  electronics: (
    <>
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <path d="M9 7h6M11 17h2" />
    </>
  ),
  retail: (
    <>
      <path d="M3 9 4 4h16l1 5M4 9v11h16V9M4 9h16" />
      <path d="M9 20v-5h6v5" />
    </>
  ),
  ecommerce: (
    <>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <path d="M3 6h18M16 10a4 4 0 0 1-8 0" />
    </>
  ),
  auto: (
    <path d="M14.7 6.3a4 4 0 0 0-5 5L4 17l3 3 5.7-5.7a4 4 0 0 0 5-5l-2.5 2.5-2.1-2.1z" />
  ),
  // --- offerings ---
  supplychain: (
    <>
      <rect x="2" y="13" width="8" height="8" rx="1" />
      <rect x="14" y="13" width="8" height="8" rx="1" />
      <rect x="8" y="3" width="8" height="8" rx="1" />
      <path d="M12 11v2M6 13v-1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </>
  ),
  monitor: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  capabilities: (
    <>
      <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </>
  ),
  // --- compare ---
  cost: (
    <>
      <polyline points="3 7 9 13 13 9 21 17" />
      <polyline points="21 11 21 17 15 17" />
    </>
  ),
  revenue: (
    <>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="21 13 21 7 15 7" />
    </>
  ),
  // --- misc ---
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
    </>
  ),
  gps: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <circle cx="12" cy="12" r="8" />
    </>
  ),
  layers: (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 12 12 17 22 12" />
      <polyline points="2 17 12 22 22 17" />
    </>
  ),
  star: <polygon points="12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 9h18M8 2v4M16 2v4" />
    </>
  ),
}

export default function Icon({ name, size = 24, className = '', strokeWidth = 1.8, ...rest }) {
  const path = P[name]
  if (!path) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {path}
    </svg>
  )
}
