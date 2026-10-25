import { useEffect, useState } from "react";

const colors = [
  "#6c63ff",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
];

export default function HabitForm({ habit, onSave, onClose }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    color: colors[0],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (habit) {
      setForm({
        name: habit.name || "",
        description: habit.description || "",
        color: habit.color || colors[0],
      });
    }
  }, [habit]);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim()) {
      setError("Please enter a habit name.");
      return;
    }

    try {
      setLoading(true);

      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        color: form.color,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">{habit ? "UPDATE" : "NEW HABIT"}</p>
            <h2>{habit ? "Edit habit" : "Create a habit"}</h2>
          </div>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="habit-form">
          <label>
            Habit name
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Read for 20 minutes"
              maxLength="80"
              autoFocus
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add a little detail about this habit..."
              rows="3"
              maxLength="200"
            />
          </label>

          <div>
            <span className="field-label">Choose a color</span>

            <div className="color-picker">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`color-option ${
                    form.color === color ? "selected" : ""
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setForm({
                      ...form,
                      color,
                    })
                  }
                  aria-label={`Choose ${color}`}
                />
              ))}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button className="primary-button" disabled={loading}>
              {loading
                ? "Saving..."
                : habit
                ? "Save changes"
                : "Create habit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}