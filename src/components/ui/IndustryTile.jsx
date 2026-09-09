import Icon from '../../lib/icons.jsx'

/**
 * Industry / specialized-service tile: icon + title + one-line description.
 */
export default function IndustryTile({ icon, title, desc }) {
  return (
    <div className="tile tile--hover">
      <span className="tile-icon">
        <Icon name={icon} />
      </span>
      <h4>{title}</h4>
      {desc && <p>{desc}</p>}
    </div>
  )
}
