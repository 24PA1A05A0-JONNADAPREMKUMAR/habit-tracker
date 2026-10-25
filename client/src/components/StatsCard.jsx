export default function StatsCard({ label, value, icon }) {
  return (
    <div className="stats-card">
      <div className="stats-icon">{icon}</div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}