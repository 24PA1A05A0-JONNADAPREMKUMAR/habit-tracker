function getStreak(completedDates = []) {
  const dates = new Set(completedDates);

  const today = new Date();
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  let streak = 0;
  const current = new Date(today);

  while (dates.has(formatDate(current))) {
    streak += 1;
    current.setDate(current.getDate() - 1);
  }

  return streak;
}

function isCompletedToday(completedDates = []) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return completedDates.includes(`${year}-${month}-${day}`);
}

export default function HabitCard({
  habit,
  onToggle,
  onEdit,
  onDelete,
}) {
  const completed = isCompletedToday(habit.completedDates);
  const streak = getStreak(habit.completedDates);

  return (
    <article
      className={`habit-card ${completed ? "completed" : ""}`}
      style={{ "--habit-color": habit.color }}
    >
      <div className="habit-color-bar"></div>

      <div className="habit-main">
        <button
          className={`check-button ${completed ? "checked" : ""}`}
          onClick={() => onToggle(habit._id)}
          aria-label={
            completed
              ? `Mark ${habit.name} incomplete`
              : `Mark ${habit.name} complete`
          }
        >
          {completed ? "✓" : ""}
        </button>

        <div className="habit-info">
          <h3>{habit.name}</h3>

          {habit.description && <p>{habit.description}</p>}

          <div className="habit-meta">
            <span className="streak">
              🔥 {streak} {streak === 1 ? "day" : "days"} streak
            </span>

            {completed && (
              <span className="completed-label">Completed today</span>
            )}
          </div>
        </div>
      </div>

      <div className="habit-actions">
        <button
          className="icon-button"
          onClick={() => onEdit(habit)}
          title="Edit habit"
          aria-label="Edit habit"
        >
          ✎
        </button>

        <button
          className="icon-button delete-button"
          onClick={() => onDelete(habit._id)}
          title="Delete habit"
          aria-label="Delete habit"
        >
          ×
        </button>
      </div>
    </article>
  );
}