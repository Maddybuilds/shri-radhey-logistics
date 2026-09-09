import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import { Eyebrow } from '../components/ui/SectionHeading.jsx'

const STRATEGY = [
  { title: 'Geographic Expansion', desc: 'Extending our reach across India with new branch offices and partnerships' },
  { title: 'Technology Integration', desc: 'Implementing advanced tracking and management systems for enhanced efficiency' },
  { title: 'Service Diversification', desc: 'Expanding our service portfolio to meet evolving market demands' },
  { title: 'Strategic Partnerships', desc: 'Building alliances with industry leaders for mutual growth' },
]

const MILESTONES = [
  { year: '2026', label: 'Pan-India Coverage' },
  { year: '2027', label: 'International Operations' },
]

export default function GrowthStrategy() {
  return (
    <section className="sr-section sr-bg-white">
      <div className="sr-wrap">
        <div className="strategy-grid">
          <div>
            <Reveal>
              <Eyebrow>Growth Strategy</Eyebrow>
              <h2 className="sr-h2" style={{ marginTop: 18, marginBottom: 32 }}>
                A clear roadmap for sustainable growth
              </h2>
            </Reveal>
            <Stagger className="strategy-list">
              {STRATEGY.map((s, i) => (
                <RevealItem key={s.title}>
                  <div className="strategy-item">
                    <span className="num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>
                    </div>
                  </div>
                </RevealItem>
              ))}
            </Stagger>
          </div>

          <Reveal delay={0.1}>
            <div className="milestones">
              <h3>Future Milestones</h3>
              <p className="ms-sub">Our committed path of expansion over the coming years.</p>
              <div className="timeline">
                {MILESTONES.map((m) => (
                  <div className="timeline-item" key={m.year}>
                    <div className="timeline-year">{m.year}</div>
                    <div className="timeline-label">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
