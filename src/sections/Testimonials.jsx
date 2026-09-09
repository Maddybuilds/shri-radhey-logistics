import Icon from '../lib/icons.jsx'
import { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

// ⚠️ PLACEHOLDER TESTIMONIALS — replace with real client quotes/names when available.
// Attributions are sector roles (not invented people/companies) to avoid presenting
// fabricated endorsements as real. Swap freely once genuine quotes are collected.
const QUOTES = [
  {
    quote:
      'Consignments reach us on schedule, every time. Their tracking keeps our dispatch team fully in the loop.',
    role: 'Operations Head',
    sector: 'FMCG Distributor',
    initial: 'F',
  },
  {
    quote:
      'They handled our oversized equipment move end to end — careful planning and zero damage on delivery.',
    role: 'Plant Manager',
    sector: 'Industrial Manufacturing',
    initial: 'I',
  },
  {
    quote:
      'A dependable partner for our pan-India distribution. Responsive team and consistent transit times.',
    role: 'Supply Chain Lead',
    sector: 'Food Products',
    initial: 'F',
  },
]

export default function Testimonials() {
  return (
    <section className="sr-section sr-bg-grey testimonials">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="Trusted Across Sectors"
          title="What our partners value"
          lead="From FMCG to heavy industry, businesses rely on us to keep their goods moving."
          center
        />

        <Stagger className="grid grid-3 testi-grid">
          {QUOTES.map((q) => (
            <RevealItem key={q.quote}>
              <figure className="testi-card">
                <div className="testi-stars" aria-label="5 out of 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" />
                  ))}
                </div>
                <blockquote>{q.quote}</blockquote>
                <figcaption className="testi-author">
                  <span className="testi-avatar">{q.initial}</span>
                  <span>
                    <span className="testi-role">{q.role}</span>
                    <span className="testi-sector">{q.sector}</span>
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
