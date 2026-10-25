export default function Navbar({ user, onLogout }) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-brand">
          <div className="brand-mark small">H</div>

          <div>
            <strong>HabitFlow</strong>
            <span>Habit Tracker</span>
          </div>
        </div>

        <div className="nav-user">
          <div className="user-avatar">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div className="user-details">
            <strong>{user?.name}</strong>
            <span>{user?.email}</span>
          </div>

          <button className="logout-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}