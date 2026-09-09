import Icon from '../lib/icons.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

const COST = {
  groups: [
    {
      title: 'Network Optimization & Warehouse Efficiency',
      items: [
        'Strategic warehouse placement and network optimization',
        'Reduced inter-warehouse stock transfers',
        'Channel and route optimization for efficient distribution',
        'Decreased last-mile distances and delivery times',
      ],
    },
    {
      title: 'Warehouse Utilization and Automation',
      items: [
        'Automation and customized fit-outs for streamlined operations',
        'Effective FIFO (First In, First Out) implementation',
        'Area optimization to maximize storage capacity',
        'Reduced labor costs through optimized processes',
      ],
    },
    {
      title: 'Vehicle and Logistics Optimization',
      items: [
        'Optimal selection of truck types for cost-efficient transport',
        'Cross-utilization of B2B–B2C loads for increased efficiency',
        'Efficient route planning and consolidation for milk runs',
        'Maximizing vehicle capacity to reduce transportation costs',
      ],
    },
  ],
}

const REVENUE = {
  groups: [
    {
      title: 'Extended Reach',
      items: [
        'More than 75 million cu. ft. warehousing capacity',
        'Pan-India reach (19k+ pin codes)',
        'Presence in T2/3/4 locations',
        'Efficient reverse management',
      ],
    },
    {
      title: 'Faster Fulfillment',
      items: [
        'Dynamic LTL to FTL conversion',
        'Next-day coverage: cities within 300 km served',
        'GPS-enabled fleet management',
        'Flexible delivery: 2-hour, 4-hour, and same-day options',
      ],
    },
    {
      title: 'Flexible Operations',
      items: [
        'Ability to scale up capacity quickly',
        'Value-added services such as storage, pick, pack, and dispatch',
        'In-plant logistics',
        'Dedicated team working 24/7',
      ],
    },
  ],
}

function Column({ variant, icon, title, data }) {
  return (
    <div className={`compare-col ${variant}`}>
      <div className="compare-head">
        <span className="ch-ic">
          <Icon name={icon} />
        </span>
        <h3>{title}</h3>
      </div>
      {data.groups.map((g) => (
        <div className="compare-group" key={g.title}>
          <h4>{g.title}</h4>
          <ul className="compare-list">
            {g.items.map((it) => (
              <li key={it}>
                <Icon name="check" size={17} strokeWidth={2.2} />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function CostRevenue() {
  return (
    <section className="sr-section sr-bg-grey">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="Value We Deliver"
          title="Cost Reduction & Revenue Enhancement"
          lead="Two sides of the same outcome — leaner operations and broader reach that grow your business."
          center
        />
        <div className="compare-grid">
          <Reveal>
            <Column variant="is-cost" icon="cost" title="Cost Reduction" data={COST} />
          </Reveal>
          <Reveal delay={0.1}>
            <Column variant="is-revenue" icon="revenue" title="Revenue Enhancement" data={REVENUE} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
