import Reveal from './Reveal.jsx'

export function Eyebrow({ children, center = false }) {
  return <span className={`sr-eyebrow${center ? ' is-center' : ''}`}>{children}</span>
}

/**
 * Standard section header: eyebrow + h2 + optional lead paragraph.
 * Wrapped in a Reveal so it animates in on scroll.
 */
export default function SectionHeading({ eyebrow, title, lead, center = false, id }) {
  return (
    <Reveal>
      <div className={`sr-section-head${center ? ' is-center' : ''}`}>
        {eyebrow && <Eyebrow center={center}>{eyebrow}</Eyebrow>}
        <h2 className="sr-h2" id={id}>
          {title}
        </h2>
        {lead && <p className="sr-lead" style={{ marginTop: 18 }}>{lead}</p>}
      </div>
    </Reveal>
  )
}
