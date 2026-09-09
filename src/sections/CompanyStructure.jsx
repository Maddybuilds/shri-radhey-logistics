import Icon from '../lib/icons.jsx'
import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

const STATS = [
  { icon: 'users', num: '2', label: 'Directors', sub: 'Experienced leadership team' },
  { icon: 'briefcase', num: '20+', label: 'Staff Members', sub: 'Dedicated professionals' },
  { icon: 'building', num: '1', label: 'Base Office', sub: 'Lucknow headquarters' },
  { icon: 'network', num: '2', label: 'Branch Offices', sub: 'Noida operational, Ludhiana upcoming' },
]

const OFFICES = [
  {
    city: 'Lucknow',
    region: 'Uttar Pradesh · Head Office',
    status: 'Operational',
    desc: 'Headquarters managing overall operations and strategic planning.',
  },
  {
    city: 'Noida',
    region: 'Uttar Pradesh · Transport Nagar',
    status: 'Operational',
    desc: 'Fully operational branch serving the North India region.',
  },
  {
    city: 'Ludhiana',
    region: 'Punjab',
    status: 'Upcoming',
    desc: 'New branch office expanding Punjab operations.',
  },
]

const FINANCE = [
  'Initial capital of ₹20 lakhs',
  'Strategic investment in infrastructure',
  'Expansion-ready financial planning',
]

const FINANCE_TAGS = ['Private Limited', 'Expansion-ready', 'Reinvestment focused']

export default function CompanyStructure() {
  return (
    <section id="company" className="sr-section sr-bg-grey">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="Company Structure"
          title="A solid organisation built to scale"
          center
        />

        <Stagger className="stat-row">
          {STATS.map((s) => (
            <RevealItem key={s.label}>
              <div className="struct-stat">
                <span className="ss-ic">
                  <Icon name={s.icon} />
                </span>
                <div className="num">{s.num}</div>
                <div className="label">{s.label}</div>
                <div className="sub">{s.sub}</div>
              </div>
            </RevealItem>
          ))}
        </Stagger>

        <Stagger className="office-grid" style={{ marginTop: 'clamp(40px, 4vw, 56px)' }}>
          {OFFICES.map((o) => (
            <RevealItem key={o.city}>
              <div className={`office-card${o.status === 'Upcoming' ? ' is-upcoming' : ''}`}>
                <div className="office-head">
                  <span className="o-pin">
                    <Icon name="pin" />
                  </span>
                  <span
                    className={`status-chip ${
                      o.status === 'Operational' ? 'is-operational' : 'is-upcoming'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <h4 className="o-city">{o.city}</h4>
                <div className="o-region">{o.region}</div>
                <p>{o.desc}</p>
              </div>
            </RevealItem>
          ))}
        </Stagger>

        <Reveal>
          <div className="finance-block" style={{ marginTop: 'clamp(40px, 4vw, 56px)' }}>
            <div className="finance-intro">
              <span className="sr-eyebrow">Financial Strength</span>
              <h3>Strong Financial Foundation</h3>
              <p className="fb-body">
                Established as a private limited company with a robust initial capital investment to
                support expansion plans.
              </p>
              <ul className="finance-list">
                {FINANCE.map((f) => (
                  <li key={f}>
                    <Icon name="check" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="finance-headline">
              <span className="fh-kicker">Initial Capital</span>
              <div className="big">₹20L</div>
              <div className="cap">Driving growth and expansion across India</div>
              <div className="finance-tags">
                {FINANCE_TAGS.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
