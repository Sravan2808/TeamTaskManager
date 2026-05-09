import { useState } from "react";
import { useSelector } from "react-redux";
import useTasks from "../hooks/useTasks";

export default function Tasks() {
  const { tasks, filter, setFilter, createTask, updateTaskStatus, deleteTask } =
    useTasks();
  const { projects } = useSelector((state) => state.projects);
  const { members } = useSelector((state) => state.team);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    projectId: "",
    assignee: "",
    priority: "medium",
    dueDate: "",
  });

  const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const formatDate = (value) => {
    const date = parseDate(value);
    return date
      ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      : "No due date";
  };

  const getMember = (id) => members.find((m) => m.id === id);
  const getProject = (id) => projects.find((p) => p.id === id);

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title) return;
    createTask({
      ...form,
      status: "todo",
      createdAt: new Date().toISOString().split("T")[0],
    });
    setForm({
      title: "",
      description: "",
      projectId: "",
      assignee: "",
      priority: "medium",
      dueDate: "",
    });
    setShowModal(false);
  };

  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
  ];

  const badgeClass = {
    todo: "badge-todo",
    "in-progress": "badge-progress",
    review: "badge-review",
    done: "badge-done",
  };

  const filters = [
    { value: "all", label: "All" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
          <p className="text-sm text-text-muted mt-1">
            {filteredTasks.length} tasks
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
          id="new-task-btn"
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
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${filter === f.value ? "bg-cyan-glow/15 text-cyan-glow border border-cyan-glow/30" : "glass text-text-muted hover:text-white"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task, i) => {
          const assignee = getMember(task.assignee);
          const project = getProject(task.projectId);
          const dueDate = parseDate(task.dueDate);
          const isOverdue =
            dueDate && dueDate < new Date() && task.status !== "done";
          return (
            <div
              key={task.id}
              className="glass rounded-2xl p-5 hover:border-cyan-glow/20 transition-all duration-200 group"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Left: Task info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span
                      className={`priority-dot priority-${task.priority}`}
                    />
                    <h3 className="text-base font-semibold text-white group-hover:text-cyan-glow transition-colors truncate">
                      {task.title}
                    </h3>
                    {isOverdue && (
                      <span className="badge badge-overdue text-[10px]">
                        Overdue
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-muted line-clamp-1 ml-6">
                    {task.description}
                  </p>
                </div>

                {/* Right: Meta */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 flex-shrink-0 ml-0">
                  {project && (
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: project.color + "15",
                        color: project.color,
                      }}
                    >
                      {project.name}
                    </span>
                  )}

                  {assignee && (
                    <div
                      className="flex items-center gap-2"
                      title={assignee.name}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold text-navy-950"
                        style={{ backgroundColor: assignee.color }}
                      >
                        {assignee.avatar}
                      </div>
                      <span className="text-xs text-text-muted hidden xl:block">
                        {assignee.name.split(" ")[0]}
                      </span>
                    </div>
                  )}

                  <span
                    className={`text-xs ${isOverdue ? "text-red-glow" : "text-text-muted"}`}
                  >
                    {formatDate(task.dueDate)}
                  </span>

                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTaskStatus({
                        id: task.id,
                        status: e.target.value,
                      })
                    }
                    className="bg-navy-600 text-xs text-text-primary border border-white/10 rounded-lg px-2 py-1.5 outline-none focus:border-cyan-glow/50 cursor-pointer"
                  >
                    {statusOptions.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  {/* Delete */}
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-glow/10 rounded-lg transition-all"
                    title="Delete"
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
              </div>
            </div>
          );
        })}
        {filteredTasks.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-text-muted text-lg">No tasks found</p>
            <p className="text-text-muted text-sm mt-1">
              Create a new task to get started
            </p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="glass-strong rounded-2xl p-6 sm:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up border border-cyan-glow/20">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-cyan-glow rounded-full" /> Create New
              Task
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Task title"
                  className="input-field"
                  id="task-title"
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
                  placeholder="Task description"
                  className="input-field resize-none h-20"
                  id="task-desc"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Project
                  </label>
                  <select
                    value={form.projectId}
                    onChange={(e) =>
                      setForm({ ...form, projectId: e.target.value })
                    }
                    className="input-field"
                    id="task-project"
                  >
                    <option value="">Select project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Assignee
                  </label>
                  <select
                    value={form.assignee}
                    onChange={(e) =>
                      setForm({ ...form, assignee: e.target.value })
                    }
                    className="input-field"
                    id="task-assignee"
                  >
                    <option value="">Select member</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Priority
                  </label>
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                    className="input-field"
                    id="task-priority"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) =>
                      setForm({ ...form, dueDate: e.target.value })
                    }
                    className="input-field"
                    id="task-due"
                  />
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
                  id="create-task-submit"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
