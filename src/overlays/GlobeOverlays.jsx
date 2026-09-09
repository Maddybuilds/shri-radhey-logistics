import { useEffect, useRef, useState } from 'react'
import useCountUp from '../hooks/useCountUp.js'
import { getScrollProgress, band } from '../lib/scrollProgress.js'

const CITIES = [
  {
    key: 'lucknow',
    tab: 'Lucknow',
    title: 'Head Office — Lucknow',
    status: 'Operational',
    desc: 'Headquarters managing overall operations and strategic planning.',
  },
  {
    key: 'noida',
    tab: 'Noida',
    title: 'Branch — Noida Transport Nagar',
    status: 'Operational',
    desc: 'Fully operational branch serving the North India region.',
  },
  {
    key: 'ludhiana',
    tab: 'Ludhiana',
    title: 'Coming Soon — Ludhiana, Punjab',
    status: 'Upcoming',
    desc: 'New branch office expanding our Punjab operations.',
  },
]

export default function GlobeOverlays() {
  const panel = useRef(null)
  const pin = useRef(null)
  const [live, setLive] = useState(false)
  const [active, setActive] = useState('lucknow')

  const years = useCountUp(15, live)
  const pins = useCountUp(19000, live)
  const warehouse = useCountUp(75, live)

  useEffect(() => {
    let raf
    let isLive = false
    const loop = () => {
      const p = getScrollProgress()
      // Globe "zoom to India" window (≈0.48–0.75), fading out before the tour
      // captions (which run from ≈0.75) so the two never overlap.
      const a = band(p, 0.48, 0.56, 0.7, 0.75)
      if (panel.current) {
        panel.current.style.opacity = a.toFixed(3)
        panel.current.style.transform = `translate(0, calc(-50% + ${(1 - a) * 16}px))`
      }
      if (pin.current) pin.current.style.opacity = a.toFixed(3)
      // Kick off the counters once we enter the window.
      if (!isLive && p > 0.52) {
        isLive = true
        setLive(true)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const current = CITIES.find((c) => c.key === active) || CITIES[0]

  return (
    <div className="sr-overlay">
      <div className="ov-panel left" ref={panel}>
        <span className="ov-eyebrow">Our Network</span>
        <h2 className="ov-title" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' }}>
          Pan-India
        </h2>
        <div className="ov-stats" style={{ justifyContent: 'flex-end' }}>
          <div className="ov-stat">
            <div className="num">
              {Math.round(years)}
              <span className="accent">+</span>
            </div>
            <div className="label">Years</div>
          </div>
          <div className="ov-stat">
            <div className="num">
              {Math.round(pins).toLocaleString('en-IN')}
              <span className="accent">+</span>
            </div>
            <div className="label">Pin Codes</div>
          </div>
          <div className="ov-stat">
            <div className="num">
              {Math.round(warehouse)}M<span className="accent">+</span>
            </div>
            <div className="label">cu.ft Warehousing</div>
          </div>
        </div>
      </div>

      {/* Interactive city pin panel */}
      <div className="pin-panel" ref={pin}>
        <div className="pin-tabs" role="tablist" aria-label="Office locations">
          {CITIES.map((c) => (
            <button
              key={c.key}
              role="tab"
              aria-selected={active === c.key}
              className={`pin-tab${active === c.key ? ' is-active' : ''}`}
              onMouseEnter={() => setActive(c.key)}
              onFocus={() => setActive(c.key)}
              onClick={() => setActive(c.key)}
            >
              {c.tab}
            </button>
          ))}
        </div>
        <span
          className={`status-chip ${
            current.status === 'Operational' ? 'is-operational' : 'is-upcoming'
          }`}
        >
          {current.status}
        </span>
        <h4>{current.title}</h4>
        <p>{current.desc}</p>
      </div>
    </div>
  )
}
