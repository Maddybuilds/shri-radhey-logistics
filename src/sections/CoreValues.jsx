import Icon from '../lib/icons.jsx'
import { Eyebrow } from '../components/ui/SectionHeading.jsx'
import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'

const VALUES = [
  { icon: 'excellence', title: 'Excellence', desc: 'Delivering superior logistics solutions that exceed expectations' },
  { icon: 'reliability', title: 'Reliability', desc: 'Ensuring timely delivery with consistent, dependable service' },
  { icon: 'trust', title: 'Trust', desc: 'Building lasting relationships through transparency and integrity' },
  { icon: 'innovation', title: 'Innovation', desc: 'Leveraging technology and partnerships for optimal solutions' },
]

export default function CoreValues() {
  return (
    <section className="sr-section sr-bg-grey corevalues">
      <div className="sr-wrap">
        <div className="cv-layout">
          <Reveal>
            <div className="cv-intro">
              <Eyebrow>Core Values</Eyebrow>
              <h2 className="sr-h2" style={{ marginTop: 18 }}>
                The principles that move us forward
              </h2>
              <p className="sr-lead" style={{ marginTop: 18 }}>
                Four commitments that shape every shipment we handle — and every relationship we build.
              </p>
            </div>
          </Reveal>

          <Stagger className="cv-list">
            {VALUES.map((v, i) => (
              <RevealItem key={v.title}>
                <div className="cv-item">
                  <span className="cv-index">{String(i + 1).padStart(2, '0')}</span>
                  <span className="cv-ic">
                    <Icon name={v.icon} />
                  </span>
                  <div className="cv-text">
                    <h3>{v.title}</h3>
                    <p>{v.desc}</p>
                  </div>
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
