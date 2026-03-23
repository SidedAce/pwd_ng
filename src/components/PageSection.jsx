export function Panel({ title, children }) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

export function StatGrid({ stats }) {
  return (
    <div className="stat-grid">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <span className="label">{stat.label}</span>
          <strong>{stat.value}</strong>
          {stat.help ? <p>{stat.help}</p> : null}
        </article>
      ))}
    </div>
  );
}

export function BulletList({ items }) {
  return (
    <ul className="timeline-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
