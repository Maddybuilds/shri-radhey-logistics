import Button from './ui/Button.jsx'
import { useQuote } from '../context/QuoteContext.jsx'
import { scrollToId } from '../sections/Navbar.jsx'

const STATS = [
  { num: '15+', label: 'Years Experience' },
  { num: '20+', label: 'Staff Members' },
  { num: '3', label: 'Offices' },
  { num: '₹20L', label: 'Initial Capital' },
]

/**
 * Lightweight, static hero shown instead of the R3F scroll experience on
 * low-power / small touch devices, so they never run the 3D timeline.
 */
export default function StaticHeroFallback() {
  const { openQuote } = useQuote()
  return (
    <section className="static-hero">
      <div className="static-hero-inner">
        <span className="ov-eyebrow">Transportation &amp; Supply Chain · Since 2009</span>
        <h1>Shri Radhey Logistics</h1>
        <p className="sh-sub">
          With over 15 years of experience, we deliver efficient transportation and logistics
          solutions across India.
        </p>
        <div className="sh-cta">
          <Button variant="primary" size="lg" icon="truck" onClick={() => openQuote()}>
            Get Quote Now
          </Button>
          <Button variant="secondary" size="lg" className="on-dark" onClick={() => scrollToId('about')}>
            Learn More
          </Button>
        </div>
        <div className="sh-stats">
          {STATS.map((s) => (
            <div className="sh-stat" key={s.label}>
              <div className="num">{s.num}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
