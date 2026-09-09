import Icon from '../lib/icons.jsx'
import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import { Eyebrow } from '../components/ui/SectionHeading.jsx'

const INDUSTRIES = [
  { icon: 'pharma', title: 'Pharmaceuticals & Wellness', desc: 'Temperature-controlled logistics for healthcare products' },
  { icon: 'fmcg', title: 'FMCG', desc: 'Fast-moving consumer goods distribution' },
  { icon: 'apparel', title: 'Apparels & Footwear', desc: 'Fashion and textile supply chain solutions' },
  { icon: 'electronics', title: 'Electronics & Electricals', desc: 'Safe handling of sensitive electronic goods' },
  { icon: 'retail', title: 'Retail Outlets', desc: 'Last-mile delivery for retail chains' },
  { icon: 'ecommerce', title: 'E-commerce', desc: 'Fulfillment and distribution for online businesses' },
  { icon: 'auto', title: 'Auto & Engineering', desc: 'Heavy equipment and automotive parts logistics' },
]

export default function IndustriesServed() {
  return (
    <section className="sr-section sr-bg-white industries-served">
      <div className="sr-wrap">
        <div className="served-layout">
          <Reveal>
            <div className="served-intro">
              <Eyebrow>Industries We Serve</Eyebrow>
              <h2 className="sr-h2" style={{ marginTop: 18 }}>
                Trusted across the sectors that keep India moving
              </h2>
              <p className="sr-lead" style={{ marginTop: 18 }}>
                From pharma cold-chains to e-commerce fulfilment, we tailor logistics to each sector's
                demands — with the right vehicles, handling, and timelines.
              </p>
            </div>
          </Reveal>

          <Stagger className="served-grid">
            {INDUSTRIES.map((i) => (
              <RevealItem key={i.title}>
                <div className="served-row">
                  <span className="srv-ic">
                    <Icon name={i.icon} size={24} />
                  </span>
                  <div>
                    <h4>{i.title}</h4>
                    <p>{i.desc}</p>
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
