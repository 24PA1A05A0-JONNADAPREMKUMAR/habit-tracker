
import { useEffect, useMemo, useState } from "react";
import {
  createHabit,
  deleteHabit,
  getHabits,
  getStats,
  loginUser,
  registerUser,
  toggleHabit,
  updateHabit,
} from "./api";
import HabitCard from "./components/HabitCard";
import HabitForm from "./components/HabitForm";
import Navbar from "./components/Navbar";
import StatsCard from "./components/StatsCard";

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data =
        mode === "login"
          ? await loginUser({
              email: form.email,
              password: form.password,
            })
          : await registerUser(form);

      localStorage.setItem("habitflow_token", data.token);
      localStorage.setItem("habitflow_user", JSON.stringify(data.user));

      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">H</div>

        <p className="eyebrow">HABITFLOW</p>
        <h1>Build better habits.</h1>
        <p className="auth-subtitle">
          Track your daily progress and build streaks that keep you moving.
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
              setShowPassword(false);
            }}
          >
            Login
          </button>

          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => {
              setMode("register");
              setError("");
              setShowPassword(false);
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <label>
              Full name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="password-label">
            Password
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="primary-button full-width"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create account"}
          </button>
        </form>
      </section>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    completionRate: 0,
    bestStreak: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [habitData, statsData] = await Promise.all([
        getHabits(),
        getStats(),
      ]);

      setHabits(Array.isArray(habitData) ? habitData : []);
      setStats(statsData);
      setError("");
    } catch (err) {
      setError(err.message);

      if (
        err.message.toLowerCase().includes("token") ||
        err.message.toLowerCase().includes("unauthorized")
      ) {
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    []
  );

  const handleSaveHabit = async (habitData) => {
    try {
      if (editingHabit) {
        await updateHabit(editingHabit._id, habitData);
      } else {
        await createHabit(habitData);
      }

      setShowForm(false);
      setEditingHabit(null);
      await loadDashboard();
    } catch (err) {
      throw err;
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleHabit(id);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this habit?"
    );

    if (!confirmed) return;

    try {
      await deleteHabit(id);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const openEdit = (habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  const openCreate = () => {
    setEditingHabit(null);
    setShowForm(true);
  };

  return (
    <div className="app-shell">
      <Navbar user={user} onLogout={onLogout} />

      <main className="dashboard">
        <section className="hero-section">
          <div>
            <p className="eyebrow">{todayLabel}</p>
            <h1>
              Good habits,
              <br />
              <span>great results.</span>
            </h1>
            <p className="hero-description">
              Small actions every day create meaningful change. Keep your
              streak alive.
            </p>
          </div>

          <button className="primary-button" onClick={openCreate}>
            <span>+</span> Add habit
          </button>
        </section>

        <section className="stats-grid">
          <StatsCard
            label="Total habits"
            value={stats.totalHabits}
            icon="◎"
          />
          <StatsCard
            label="Completed today"
            value={stats.completedToday}
            icon="✓"
          />
          <StatsCard
            label="Completion rate"
            value={`${stats.completionRate}%`}
            icon="↗"
          />
          <StatsCard
            label="Best streak"
            value={`${stats.bestStreak} days`}
            icon="🔥"
          />
        </section>

        {error && <div className="error-message dashboard-error">{error}</div>}

        <section className="habits-section">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR ROUTINE</p>
              <h2>Today's habits</h2>
            </div>

            <span className="habit-count">
              {habits.length} {habits.length === 1 ? "habit" : "habits"}
            </span>
          </div>

          {loading ? (
            <div className="empty-state">
              <div className="spinner"></div>
              <p>Loading your habits...</p>
            </div>
          ) : habits.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✦</div>
              <h3>No habits yet</h3>
              <p>
                Start with one small habit and build your routine from there.
              </p>
              <button className="primary-button" onClick={openCreate}>
                Create your first habit
              </button>
            </div>
          ) : (
            <div className="habit-list">
              {habits.map((habit) => (
                <HabitCard
                  key={habit._id}
                  habit={habit}
                  onToggle={handleToggle}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {showForm && (
        <HabitForm
          habit={editingHabit}
          onSave={handleSaveHabit}
          onClose={() => {
            setShowForm(false);
            setEditingHabit(null);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("habitflow_user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("habitflow_token");
    localStorage.removeItem("habitflow_user");
    setUser(null);
  };

  if (!user) {
    return <AuthScreen onLogin={setUser} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
