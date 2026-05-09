import { useState } from "react";
import { useSelector } from "react-redux";
import useTeam from "../hooks/useTeam";

export default function Team() {
  const { members, addMember, removeMember } = useTeam();
  const { tasks } = useSelector((state) => state.tasks);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  const getTaskCount = (memberId) =>
    tasks.filter((t) => t.assignee === memberId).length;
  const getCompletedCount = (memberId) =>
    tasks.filter((t) => t.assignee === memberId && t.status === "done").length;
  const getInProgressCount = (memberId) =>
    tasks.filter((t) => t.assignee === memberId && t.status === "in-progress")
      .length;

  const colors = [
    "#00D4FF",
    "#7B61FF",
    "#00FF88",
    "#FFB800",
    "#FF4757",
    "#d1bcff",
    "#3cd7ff",
  ];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    const initials = form.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
    addMember({
      id: "user-" + Date.now(),
      name: form.name,
      email: form.email,
      role: form.role || "Member",
      avatar: initials,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    setForm({ name: "", email: "", role: "" });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Team</h2>
          <p className="text-sm text-text-muted mt-1">
            {members.length} members
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          id="add-member-btn"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
          Add Member
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {members.map((m, i) => {
          const taskCount = getTaskCount(m.id);
          const completedCount = getCompletedCount(m.id);
          const inProgressCount = getInProgressCount(m.id);
          const completionRate =
            taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

          return (
            <div
              key={m.id}
              className="glass rounded-2xl p-6 hover:border-cyan-glow/20 transition-all duration-300 group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-navy-950 transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: m.color,
                      boxShadow: `0 0 20px ${m.color}30`,
                    }}
                  >
                    {m.avatar}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {m.name}
                    </h3>
                    <p className="text-xs text-text-muted">{m.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeMember(m.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-glow/10 rounded-lg transition-all"
                  title="Remove member"
                >
                  <svg
                    className="w-4 h-4 text-red-glow"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Role Badge */}
              <span className="badge badge-progress mb-4">{m.role}</span>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="glass-dark rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-cyan-glow">
                    {taskCount}
                  </p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                    Total
                  </p>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-purple-glow">
                    {inProgressCount}
                  </p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                    Active
                  </p>
                </div>
                <div className="glass-dark rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-green-glow">
                    {completedCount}
                  </p>
                  <p className="text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
                    Done
                  </p>
                </div>
              </div>

              {/* Completion Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-text-muted mb-1.5">
                  <span>Completion Rate</span>
                  <span className="text-green-glow font-semibold">
                    {completionRate}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${completionRate}%`,
                      background: `linear-gradient(90deg, ${m.color}, ${m.color}aa)`,
                      boxShadow: `0 0 8px ${m.color}40`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="glass-strong rounded-2xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up border border-cyan-glow/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-glow rounded-full" /> Add Team
              Member
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="input-field"
                  id="member-name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@taskforge.io"
                  className="input-field"
                  id="member-email"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Role
                </label>
                <input
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  placeholder="e.g. Frontend Dev"
                  className="input-field"
                  id="member-role"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                  id="add-member-submit"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
