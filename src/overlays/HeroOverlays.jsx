import { useEffect, useRef } from 'react'
import Button from '../components/ui/Button.jsx'
import { useQuote } from '../context/QuoteContext.jsx'
import { scrollToId } from '../sections/Navbar.jsx'
import { getScrollProgress, band } from '../lib/scrollProgress.js'

const INDUSTRIES = ['FMCG', 'Pharma', 'Heavy Equipment', 'Ration', 'E-commerce']

// Apply opacity + a small rise; `centered` panels keep their -50% Y centering.
function paint(el, a, centered) {
  if (!el) return
  el.style.opacity = a.toFixed(3)
  const rise = (1 - a) * 16
  el.style.transform = centered
    ? `translate(0, calc(-50% + ${rise}px))`
    : `translateY(${rise}px)`
  el.style.pointerEvents = a > 0.6 ? 'auto' : 'none'
}

export default function HeroOverlays() {
  const { openQuote } = useQuote()
  const heading = useRef(null)
  const stats = useRef(null)
  const chips = useRef(null)

  useEffect(() => {
    let raf
    const loop = () => {
      const p = getScrollProgress()
      // Truck choreography lives in scroll 0–0.40; space three beats across it.
      paint(heading.current, band(p, -1, 0, 0.07, 0.14), true) // intro / side
      paint(stats.current, band(p, 0.1, 0.15, 0.21, 0.28), true) // headlights / front
      paint(chips.current, band(p, 0.24, 0.29, 0.35, 0.41), false) // doors open / back
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="sr-overlay" aria-hidden="false">
      {/* SIDE — hero heading + CTAs */}
      <div className="ov-panel left" ref={heading}>
        <span className="ov-eyebrow">Transportation &amp; Supply Chain</span>
        <h1 className="ov-title">Shri Radhey Logistics</h1>
        <p className="ov-sub">Efficient transportation &amp; logistics across India.</p>
        <div className="ov-cta">
          <Button variant="primary" icon="truck" onClick={() => openQuote()}>
            Get Quote
          </Button>
          <Button variant="secondary" className="on-dark" onClick={() => scrollToId('services')}>
            Our Services
          </Button>
        </div>
      </div>

      {/* FRONT — experience + stat tiles */}
      <div className="ov-panel right" ref={stats}>
        <span className="ov-eyebrow">15+ Years of Experience</span>
        <div className="ov-stats">
          <div className="ov-stat">
            <div className="num">
              15<span className="accent">+</span>
            </div>
            <div className="label">Years</div>
          </div>
          <div className="ov-stat">
            <div className="num">
              20<span className="accent">+</span>
            </div>
            <div className="label">Staff</div>
          </div>
          <div className="ov-stat">
            <div className="num">3</div>
            <div className="label">Offices</div>
          </div>
          <div className="ov-stat">
            <div className="num">
              <span className="accent">₹</span>20L
            </div>
            <div className="label">Capital</div>
          </div>
        </div>
      </div>

      {/* BACK — what we move */}
      <div className="ov-panel bottom-left" ref={chips}>
        <span className="ov-eyebrow">What We Move</span>
        <div className="ov-chips">
          {INDUSTRIES.map((i) => (
            <span className="ov-chip" key={i}>
              {i}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
