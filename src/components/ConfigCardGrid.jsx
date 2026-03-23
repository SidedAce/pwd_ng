import { Link } from "react-router-dom";

export function ConfigCardGrid({ items }) {
  return (
    <div className="card-grid">
      {items.map((item) => (
        <Link key={item.to} className="action-card" to={item.to}>
          <strong>{item.title}</strong>
          <p>{item.body}</p>
        </Link>
      ))}
    </div>
  );
}
