import Icon from '../lib/icons.jsx'
import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import { Eyebrow } from '../components/ui/SectionHeading.jsx'

const FOUNDATION = [
  {
    num: '3',
    title: 'Established Companies',
    desc: 'Built through Shri Logistic, Lakshmi Express, and Transworld Cargo Movers',
  },
  {
    num: '₹20L',
    title: 'Strong Capital Base',
    desc: 'Initial investment driving expansion and infrastructure development',
  },
  {
    num: '∞',
    title: 'Commitment to Excellence',
    desc: 'Reliability, efficiency, and unwavering commitment to client success',
  },
]

export default function About() {
  return (
    <section id="about" className="sr-section sr-bg-white">
      <div className="sr-wrap">
        <div className="about-grid">
          <Reveal>
            <div>
              <Eyebrow>About Shri Radhey Logistics</Eyebrow>
              <h2 className="sr-h2" style={{ marginTop: 18 }}>
                Building on a legacy of excellence in logistics and transportation.
              </h2>
              <p className="about-journey">
                Over 15 years of experience in logistics and transportation, built on a strong
                foundation through three companies — Shri Logistic and Courier Services, Lakshmi
                Express, and Transworld Cargo Movers. Having successfully catered to diverse client
                needs with reliability, efficiency, and commitment, we have now established a new
                private limited firm, Shri Radhey Logistics Pvt Ltd, with an initial capital of ₹20
                lakhs — driven by a vision to expand across India and beyond.
              </p>
              <div className="badge" style={{ marginTop: 28 }}>
                <Icon name="award" />
                15+ Years of Excellence
              </div>
            </div>
          </Reveal>

          <Stagger className="foundation-cards">
            {FOUNDATION.map((c) => (
              <RevealItem key={c.title}>
                <div className="foundation-card">
                  <div className="fc-num">{c.num}</div>
                  <div>
                    <h4>{c.title}</h4>
                    <p>{c.desc}</p>
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
