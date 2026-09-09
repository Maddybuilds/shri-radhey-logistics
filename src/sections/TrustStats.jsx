import Icon from '../lib/icons.jsx'
import { Stagger, RevealItem } from '../components/ui/Reveal.jsx'

// Real figures only — drawn from the company's stated reach (see globe overlay counters).
const STATS = [
  { icon: 'calendar', num: '15+', label: 'Years of Experience', sub: 'Across three founding companies' },
  { icon: 'network', num: '19,000+', label: 'Pin Codes Served', sub: 'Pan-India delivery reach' },
  { icon: 'building', num: '75M+', label: 'cu.ft Warehousing', sub: 'Storage & distribution capacity' },
  { icon: 'pin', num: '3', label: 'Office Locations', sub: 'Lucknow · Noida · Ludhiana' },
]

export default function TrustStats() {
  return (
    <section className="sr-section trust-band">
      <div className="sr-wrap">
        <Stagger className="trust-panel">
          {STATS.map((s) => (
            <RevealItem key={s.label} className="trust-item">
              <span className="ti-ic">
                <Icon name={s.icon} />
              </span>
              <div className="ti-num">{s.num}</div>
              <div className="ti-label">{s.label}</div>
              <div className="ti-sub">{s.sub}</div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
