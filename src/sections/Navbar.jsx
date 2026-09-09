import { useEffect, useState, useCallback } from 'react'
import Button from '../components/ui/Button.jsx'
import { useQuote } from '../context/QuoteContext.jsx'

const LINKS = [
  { label: 'About Us', id: 'about' },
  { label: 'Services', id: 'services' },
  { label: 'Company', id: 'company' },
  { label: 'Ventures', id: 'ventures' },
  { label: 'Contact Us', id: 'contact' },
]

export function scrollToId(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function Navbar() {
  const { openQuote } = useQuote()
  const [solid, setSolid] = useState(false)
  const [drawer, setDrawer] = useState(false)

  // Turn solid the moment the flat content (.sr-site) reaches the top edge,
  // i.e. once the 3D experience has scrolled away. Robust to the 1500vh height.
  useEffect(() => {
    const onScroll = () => {
      const flat = document.querySelector('.sr-site')
      if (flat) setSolid(flat.getBoundingClientRect().top <= 8)
      else setSolid(window.scrollY > 80)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = drawer ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawer])

  const go = useCallback((id) => {
    setDrawer(false)
    // Allow the drawer to start closing before we scroll.
    setTimeout(() => scrollToId(id), 10)
  }, [])

  const Brand = (
    <a
      className="brand"
      href="#top"
      onClick={(e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setDrawer(false)
      }}
      aria-label="Shri Radhey Logistics — back to top"
    >
      <span className="brand-mark">SR</span>
      <span className="brand-text">
        <span className="brand-name">Shri Radhey</span>
        <span className="brand-sub">Logistics Pvt Ltd</span>
      </span>
    </a>
  )

  return (
    <>
      <header className={`nav${solid ? ' is-solid' : ''}`}>
        <div className="nav-inner">
          {Brand}

          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <a
                key={l.id}
                className="nav-link"
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(l.id)
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav-cta">
            <Button variant="ghost" onClick={() => go('contact')} className="nav-contact-ghost">
              Contact
            </Button>
            <Button variant="accent" icon="truck" onClick={() => openQuote()}>
              Get Quote
            </Button>
            <button
              className={`nav-toggle${drawer ? ' is-open' : ''}`}
              aria-label={drawer ? 'Close menu' : 'Open menu'}
              aria-expanded={drawer}
              onClick={() => setDrawer((d) => !d)}
            >
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`nav-scrim${drawer ? ' is-open' : ''}`}
        onClick={() => setDrawer(false)}
        aria-hidden="true"
      />
      <aside className={`nav-drawer${drawer ? ' is-open' : ''}`} aria-label="Mobile navigation" aria-hidden={!drawer}>
        {LINKS.map((l) => (
          <a
            key={l.id}
            className="nav-link"
            href={`#${l.id}`}
            onClick={(e) => {
              e.preventDefault()
              go(l.id)
            }}
            tabIndex={drawer ? 0 : -1}
          >
            {l.label}
          </a>
        ))}
        <Button
          variant="accent"
          block
          icon="truck"
          onClick={() => {
            setDrawer(false)
            openQuote()
          }}
          tabIndex={drawer ? 0 : -1}
        >
          Get Quote
        </Button>
      </aside>
    </>
  )
}
