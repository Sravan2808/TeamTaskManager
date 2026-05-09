import { useState } from "react";
import useProjects from "../hooks/useProjects";
import { useSelector } from "react-redux";

export default function Projects() {
  const { projects, createProject, deleteProject } = useProjects();
  const { members } = useSelector((state) => state.team);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    deadline: "",
    members: [],
  });

  const formatDeadline = (value) => {
    if (!value) return "No deadline";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "No deadline"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const getMember = (id) => members.find((m) => m.id === id);
  const colors = ["#00D4FF", "#7B61FF", "#00FF88", "#FFB800", "#FF4757"];

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.name) return;
    createProject({
      name: form.name,
      description: form.description,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
    setForm({ name: "", description: "", deadline: "", members: [] });
    setShowModal(false);
  };

  const toggleMember = (id) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter((m) => m !== id)
        : [...prev.members, id],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-sm text-text-muted mt-1">
            {projects.length} active projects
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          id="new-project-btn"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Project
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((p, i) => (
          <div
            key={p.id}
            className="glass rounded-2xl p-6 hover:border-cyan-glow/20 transition-all duration-300 group"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 12px ${p.color}40`,
                  }}
                />
                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-glow transition-colors">
                  {p.name}
                </h3>
              </div>
              <button
                onClick={() => deleteProject(p.id)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-glow/10 rounded-lg transition-all"
                title="Delete project"
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm text-text-muted mb-4 line-clamp-2">
              {p.description}
            </p>

            {/* Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-text-muted mb-1.5">
                <span>Progress</span>
                <span className="text-cyan-glow font-semibold">
                  {p.progress}%
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
            </div>

            {/* Meta */}
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {p.members.slice(0, 4).map((mid) => {
                  const m = getMember(mid);
                  return m ? (
                    <div
                      key={m.id}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-navy-950 border-2 border-navy-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: m.color }}
                      title={m.name}
                    >
                      {m.avatar}
                    </div>
                  ) : null;
                })}
                {p.members.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-navy-500 flex items-center justify-center text-[10px] text-text-muted border-2 border-navy-600">
                    +{p.members.length - 4}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-text-muted">{p.taskCount} tasks</p>
                <p className="text-xs text-text-muted">
                  {formatDeadline(p.deadline)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="glass-strong rounded-2xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up border border-cyan-glow/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-glow rounded-full" /> Create New
              Project
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Project Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter project name"
                  className="input-field"
                  id="project-name"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Brief project description"
                  className="input-field resize-none h-24"
                  id="project-desc"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Deadline
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(e) =>
                    setForm({ ...form, deadline: e.target.value })
                  }
                  className="input-field"
                  id="project-deadline"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Team Members
                </label>
                <div className="flex flex-wrap gap-2">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => toggleMember(m.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${form.members.includes(m.id) ? "bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30" : "glass text-text-muted hover:text-white"}`}
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-navy-950"
                        style={{ backgroundColor: m.color }}
                      >
                        {m.avatar}
                      </div>
                      {m.name}
                    </button>
                  ))}
                </div>
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
                  id="create-project-submit"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
