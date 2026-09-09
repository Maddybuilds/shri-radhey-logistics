/**
 * Stat tile: big number + label (+ optional sub).
 * `num` may include markup-free strings like "15+", "₹20L".
 */
export default function StatTile({ num, label, sub, accent = false }) {
  return (
    <div className="stat-tile">
      <div className={`num${accent ? ' accent' : ''}`}>{num}</div>
      {label && <div className="label">{label}</div>}
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}
