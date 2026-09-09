import Icon from '../lib/icons.jsx'
import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import IndustryTile from '../components/ui/IndustryTile.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

const TILES = [
  { icon: 'fmcg', title: 'FMCG Products', desc: 'Fast-moving consumer goods distribution' },
  { icon: 'food', title: 'Food Products', desc: 'Temperature-controlled and safe food transportation' },
  { icon: 'ration', title: 'Ration Distribution', desc: 'Large-scale government and institutional supply' },
  { icon: 'heavy', title: 'Heavy Equipment', desc: 'Specialized handling with long platform trailers' },
  { icon: 'atm', title: 'ATM Services', desc: 'ATM transportation & installation services' },
  { icon: 'plant', title: 'Plant Shifting', desc: 'Specialized project movements & plant relocations' },
  { icon: 'infra', title: 'Infrastructure', desc: 'Critical and high-value project cargo' },
  { icon: 'manufacturing', title: 'Manufacturing', desc: 'Precision handling for manufacturing sectors' },
]

const SPEC = [
  'Long platform trailer services',
  'Oversized consignment handling',
  'ATM transportation & installation',
  'Plant shifting & relocation',
  'Critical project movements',
  'Skilled handling & planning',
]

export default function IndustriesSpecialized() {
  return (
    <section className="sr-section sr-bg-grey">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="Industries & Specialized Services"
          title="Built for the loads others can't handle"
          center
        />

        <Stagger className="grid grid-4">
          {TILES.map((t) => (
            <RevealItem key={t.title}>
              <IndustryTile icon={t.icon} title={t.title} desc={t.desc} />
            </RevealItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="spec-strip">
            <h3>Specialized Heavy Equipment Services</h3>
            <div className="spec-chips">
              {SPEC.map((s) => (
                <span className="spec-chip" key={s}>
                  <Icon name="check" size={18} strokeWidth={2.2} />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
