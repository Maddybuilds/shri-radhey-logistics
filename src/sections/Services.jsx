import Icon from '../lib/icons.jsx'
import Card from '../components/ui/Card.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

const SERVICES = [
  { icon: 'truck', tag: 'FTL', title: 'Full Truck Load (FTL)', desc: 'Complete truck capacity for your bulk shipments with dedicated vehicle allocation' },
  { icon: 'box', tag: 'PTL', title: 'Part Truck Load (PTL)', desc: 'Cost-effective solutions for smaller consignments with shared truck space' },
  { icon: 'network', tag: 'NET', title: 'Pan-India Network', desc: 'Extensive coverage across India with strategic partnerships and strong fleet ownership' },
  { icon: 'expertise', tag: 'IND', title: 'Industry Expertise', desc: 'Specialized solutions for FMCG, food products, ration distribution, and heavy equipment' },
]

const FLEET = [
  { icon: 'truck', title: 'Own modern fleet', desc: 'Well-maintained vehicles across every load class.' },
  { icon: 'partnership', title: 'Trusted partner network', desc: 'Strategic alliances with reputed transporters.' },
  { icon: 'gps', title: 'Real-time tracking', desc: 'Live monitoring on every consignment, end to end.' },
  { icon: 'heavy', title: 'Heavy equipment transport', desc: 'Specialized handling of oversized consignments.' },
]

const FLEET_META = ['Pan-India coverage', '24/7 monitoring', 'Own + partner fleet']

export default function Services() {
  return (
    <section id="services" className="sr-section sr-bg-white">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="Our Services"
          title="Logistics solutions tailored to every load"
          center
        />

        <Stagger className="grid grid-4">
          {SERVICES.map((s) => (
            <RevealItem key={s.title}>
              <Card icon={s.icon} title={s.title} desc={s.desc} tag={s.tag} className="service-card" />
            </RevealItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="fleet-block">
            <div className="fleet-intro">
              <span className="sr-eyebrow">Fleet &amp; Network</span>
              <h3>Fleet &amp; Partnerships</h3>
              <p className="fl-body">
                Our success is built on a foundation of strong fleet ownership combined with strategic
                partnerships with reputed transporters across India.
              </p>
              <ul className="fleet-meta">
                {FLEET_META.map((m) => (
                  <li key={m}>
                    <Icon name="check" />
                    {m}
                  </li>
                ))}
              </ul>
              <Button as="a" href="#contact" variant="accent" iconRight="arrow-right">
                Discuss your requirement
              </Button>
            </div>

            <div className="fleet-features">
              {FLEET.map((f) => (
                <div className="fleet-feature" key={f.title}>
                  <span className="ff-ic">
                    <Icon name={f.icon} />
                  </span>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
