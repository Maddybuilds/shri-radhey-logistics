import Icon from '../lib/icons.jsx'
import { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

// ⚠️ PLACEHOLDER CONTENT — replace titles/dates/links with real articles when available.
// Kept generic and industry-relevant so nothing reads as a fabricated, dated event.
const POSTS = [
  {
    icon: 'truck',
    category: 'Road Freight',
    title: 'Choosing between FTL and PTL for your shipment',
    excerpt: 'How load size, urgency, and cost shape the right mode for moving goods across India.',
  },
  {
    icon: 'globe',
    category: 'Pan-India Network',
    title: 'Building reliable delivery reach beyond the metros',
    excerpt: 'What it takes to serve thousands of pin codes with consistent transit times.',
  },
  {
    icon: 'box',
    category: 'Supply Chain',
    title: 'Smarter warehousing for seasonal demand',
    excerpt: 'Using flexible storage and routing to absorb peaks without inflating cost.',
  },
]

export default function Insights() {
  return (
    <section id="insights" className="sr-section sr-bg-white insights">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="Insights"
          title="Perspectives on moving India forward"
          lead="Practical thinking on logistics, supply chain, and the road ahead."
          center
        />

        <Stagger className="grid grid-3 insights-grid">
          {POSTS.map((p) => (
            <RevealItem key={p.title}>
              <article className="insight-card">
                <div className="ic-media">
                  <span className="ic-media-glyph">
                    <Icon name={p.icon} />
                  </span>
                  <span className="ic-cat">{p.category}</span>
                </div>
                <div className="ic-body">
                  <h3>{p.title}</h3>
                  <p>{p.excerpt}</p>
                  <span className="ic-readmore">
                    Read more <Icon name="arrow-right" />
                  </span>
                </div>
              </article>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
