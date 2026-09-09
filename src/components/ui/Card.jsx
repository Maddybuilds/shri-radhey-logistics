import Icon from '../../lib/icons.jsx'

/**
 * Generic icon card: icon chip + title + description.
 * Used by Core Values, Services, etc.
 */
export default function Card({ icon, title, desc, tag, hover = true, children, className = '' }) {
  return (
    <article className={`card${hover ? ' card--hover' : ''} ${className}`.trim()}>
      {tag && <span className="svc-tag">{tag}</span>}
      {icon && (
        <span className="card-icon">
          <Icon name={icon} />
        </span>
      )}
      {title && <h3>{title}</h3>}
      {desc && <p>{desc}</p>}
      {children}
    </article>
  )
}
