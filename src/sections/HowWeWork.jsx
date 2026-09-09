import Icon from '../lib/icons.jsx'
import Button from '../components/ui/Button.jsx'
import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import { useQuote } from '../context/QuoteContext.jsx'

const STEPS = [
  {
    n: '01',
    icon: 'box',
    title: 'Order Placement',
    desc: 'Customers submit orders online or by phone — specifying pickup, delivery, and cargo type to initiate the process.',
  },
  {
    n: '02',
    icon: 'network',
    title: 'Route Planning',
    desc: 'Optimal routes are determined using distance, traffic, and delivery priorities for the fastest, safest path.',
  },
  {
    n: '03',
    icon: 'truck',
    title: 'Transportation',
    desc: 'Goods are loaded onto the right vehicles and dispatched with careful handling and full adherence to schedules.',
  },
  {
    n: '04',
    icon: 'gps',
    title: 'Tracking & Monitoring',
    desc: 'Real-time tracking monitors every shipment, keeping you updated and enabling proactive management of issues.',
  },
  {
    n: '05',
    icon: 'check',
    title: 'Delivery & Confirmation',
    desc: 'On arrival, goods are unloaded, verified against order details, and delivery is confirmed with the recipient.',
  },
]

export default function HowWeWork() {
  const { openQuote } = useQuote()

  return (
    <section id="how-we-work" className="sr-section sr-bg-grey howwework">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="How We Work"
          title="A streamlined process, every step of the way"
          lead="From the first call to final confirmation, our process is built for efficiency, visibility, and reliability."
          center
        />

        <Stagger className="process-track">
          {STEPS.map((s) => (
            <RevealItem key={s.n}>
              <div className="process-step">
                <div className="ps-node">{s.n}</div>
                <span className="ps-ic">
                  <Icon name={s.icon} />
                </span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            </RevealItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="process-cta">
            <p>Ready to move your cargo with a partner you can trust?</p>
            <Button variant="accent" onClick={() => openQuote()} iconRight="arrow-right">
              Get a Quote
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
