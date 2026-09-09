import Icon from '../lib/icons.jsx'
import { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

const COLUMNS = [
  {
    icon: 'supplychain',
    title: 'End-to-End Supply Chain',
    items: [
      'Warehouse/Storage Solutions – 3PL/4PL services',
      'Fulfilment Centre Services (B2B/B2C/D2C/D2B)',
      'Warehouse Automation (material handling & storage)',
      'E-Commerce Enablement & Management',
      'Contract Logistics',
      'Distribution Services',
      'Custom-bonded Warehousing',
    ],
  },
  {
    icon: 'monitor',
    title: 'Technology and Innovation',
    items: [
      'Customised Dashboards for Detailed Insights',
      'Control Tower',
      'Warehouse Management Based on Blockchain Data Flow',
      'TMS (Transportation Management System)',
      'Inventory Management',
      'GPS-enabled Fleet for Online Tracking',
      'POS System Integration',
    ],
  },
  {
    icon: 'capabilities',
    title: 'Service Capabilities',
    items: [
      'E-commerce Operations Handling',
      'Quick Commerce Fulfilment',
      'Omni-channel Enablement',
      'Multi-channel Fulfillment',
      'Multi-box Handling',
      'Same Day/Next Day',
      'Reverse Logistics',
    ],
  },
]

export default function CoreOfferings() {
  return (
    <section className="sr-section sr-bg-white">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="Core Offerings"
          title="Comprehensive logistics solutions that reduce costs and drive revenue."
          center
        />
        <Stagger className="offerings-grid">
          {COLUMNS.map((c) => (
            <RevealItem key={c.title}>
              <div className="offering-col">
                <div className="oc-head">
                  <span className="oc-ic">
                    <Icon name={c.icon} />
                  </span>
                  <h3>{c.title}</h3>
                </div>
                <ul className="capability-list">
                  {c.items.map((it) => (
                    <li key={it}>
                      <Icon name="check" size={18} strokeWidth={2.2} />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
