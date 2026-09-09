import Reveal, { Stagger, RevealItem } from '../components/ui/Reveal.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'

const PARTNERS = [
  {
    logo: 'NA',
    title: 'NAFED Ration Distribution',
    tags: ['Large-scale project', 'State-wide Coverage'],
    body: 'Successfully executed ration distribution for NAFED across Uttar Pradesh, demonstrating capability in government and institutional supply chains.',
  },
  {
    logo: 'CA',
    title: 'Corporate Associations',
    tags: ['Ongoing', 'Multi-sector Partnerships'],
    body: 'Strong working associations with ICDS (Integrated Child Development Services), Gati, Caper India, and other reputed organizations for extended network coverage.',
  },
  {
    logo: 'PB',
    title: 'Biscuit Industry Experience',
    tags: ['7 years in the biscuit sector', 'Brand Partnerships'],
    body: 'Extensive experience working with leading brands such as Priya Gold and Bonbon Industries in the biscuit manufacturing and distribution sector.',
  },
]

const TRACK = [
  { title: 'Heavy Equipment', sub: 'Ashok Leyland Partnership' },
  { title: 'Government Projects', sub: 'NAFED & ICDS' },
  { title: 'FMCG Brands', sub: '7 years in the biscuit sector' },
  { title: 'Corporate Networks', sub: 'Gati, Caper India & More' },
]

export default function StrategicVentures() {
  return (
    <section id="ventures" className="sr-section sr-bg-grey">
      <div className="sr-wrap">
        <SectionHeading
          eyebrow="Strategic Ventures & Associations"
          title="Building strong partnerships and leveraging proven industry experience."
          center
        />

        {/* Featured active partnership */}
        <Reveal>
          <div className="venture-card is-feature" style={{ marginBottom: 'clamp(20px, 2.4vw, 28px)' }}>
            <div className="venture-head">
              <span className="venture-logo">AL</span>
              <h3>Ashok Leyland</h3>
              <div className="tag-row">
                <span className="tag is-active">Active Partnership</span>
                <span className="tag">Heavy Equipment</span>
                <span className="tag">Strategic Alliance</span>
              </div>
            </div>
            <p className="v-body">
              Strategic partnership in the heavy equipment transportation sector, leveraging their
              industry expertise and our logistics capabilities.
            </p>
          </div>
        </Reveal>

        <Stagger className="grid grid-3">
          {PARTNERS.map((p) => (
            <RevealItem key={p.title}>
              <div className="venture-card">
                <div className="venture-head">
                  <span className="venture-logo">{p.logo}</span>
                  <h3>{p.title}</h3>
                </div>
                <div className="tag-row" style={{ marginBottom: 8 }}>
                  {p.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className="v-body">{p.body}</p>
              </div>
            </RevealItem>
          ))}
        </Stagger>

        <Reveal>
          <p
            className="sr-lead"
            style={{ textAlign: 'center', maxWidth: 760, margin: 'clamp(40px,5vw,64px) auto 0' }}
          >
            Our strategic partnerships and industry experience demonstrate our commitment to
            delivering reliable, scalable logistics solutions across diverse sectors and challenging
            projects.
          </p>
        </Reveal>

        <Stagger className="track-record">
          {TRACK.map((t) => (
            <RevealItem key={t.title}>
              <div className="tr-item">
                <h4>{t.title}</h4>
                <p>{t.sub}</p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
