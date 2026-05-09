import { useSelector } from "react-redux";

export default function Dashboard() {
  const { tasks } = useSelector((state) => state.tasks);
  const { projects } = useSelector((state) => state.projects);
  const { members } = useSelector((state) => state.team);

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

  const totalTasks = tasks.length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const overdue = tasks.filter((t) => {
    const dueDate = parseDate(t.dueDate);
    return dueDate && dueDate < new Date() && t.status !== "done";
  }).length;

  const getMember = (id) => members.find((m) => m.id === id);
  const getProject = (id) => projects.find((p) => p.id === id);

  const stats = [
    {
      label: "Total Tasks",
      value: totalTasks,
      accent: "text-cyan-glow",
      icon: "📋",
    },
    {
      label: "In Progress",
      value: inProgress,
      accent: "text-purple-glow",
      icon: "⚡",
    },
    {
      label: "Completed",
      value: completed,
      accent: "text-green-glow",
      icon: "✅",
    },
    { label: "Overdue", value: overdue, accent: "text-red-glow", icon: "🔥" },
  ];

  const columns = [
    {
      key: "todo",
      title: "To Do",
      tasks: tasks.filter((t) => t.status === "todo"),
      dot: "bg-text-muted",
    },
    {
      key: "in-progress",
      title: "In Progress",
      tasks: tasks.filter((t) => t.status === "in-progress"),
      dot: "bg-cyan-glow",
    },
    {
      key: "review",
      title: "Review",
      tasks: tasks.filter((t) => t.status === "review"),
      dot: "bg-purple-glow",
    },
    {
      key: "done",
      title: "Done",
      tasks: tasks.filter((t) => t.status === "done"),
      dot: "bg-green-glow",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="glass rounded-2xl p-5 hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className={`text-3xl font-bold ${s.accent}`}>
                {s.value}
              </span>
            </div>
            <p className="text-sm text-text-muted font-medium uppercase tracking-wider">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Active Projects */}
      <div className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-glow rounded-full animate-pulse-glow" />
          Active Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="glass-dark rounded-xl p-4 hover:border-cyan-glow/20 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: p.color,
                    boxShadow: `0 0 8px ${p.color}50`,
                  }}
                />
                <h3 className="font-semibold text-white text-sm group-hover:text-cyan-glow transition-colors">
                  {p.name}
                </h3>
              </div>
              <p className="text-xs text-text-muted mb-3 line-clamp-1">
                {p.description}
              </p>
              <div className="progress-track mb-2">
                <div
                  className="progress-fill"
                  style={{ width: `${p.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>{p.progress}%</span>
                <span>{p.taskCount} tasks</span>
              </div>
              <div className="flex -space-x-2 mt-3">
                {p.members.slice(0, 3).map((mid) => {
                  const m = getMember(mid);
                  return m ? (
                    <div
                      key={m.id}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-navy-950 border-2 border-navy-800"
                      style={{ backgroundColor: m.color }}
                    >
                      {m.avatar}
                    </div>
                  ) : null;
                })}
                {p.members.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-navy-500 flex items-center justify-center text-[10px] text-text-muted border-2 border-navy-800">
                    +{p.members.length - 3}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-glow rounded-full animate-pulse-glow" />
          Task Board
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => (
            <div key={col.key} className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot}`} />
                  <h3 className="text-sm font-semibold text-white">
                    {col.title}
                  </h3>
                </div>
                <span className="text-xs font-bold text-text-muted bg-navy-500/50 px-2 py-0.5 rounded-full">
                  {col.tasks.length}
                </span>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {col.tasks.map((task) => {
                  const assignee = getMember(task.assignee);
                  const proj = getProject(task.projectId);
                  const dueDate = parseDate(task.dueDate);
                  const isOverdue =
                    dueDate && dueDate < new Date() && task.status !== "done";
                  return (
                    <div
                      key={task.id}
                      className="glass-dark rounded-xl p-3.5 hover:border-cyan-glow/20 transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-text-primary group-hover:text-white leading-snug flex-1 mr-2">
                          {task.title}
                        </h4>
                        <span
                          className={`priority-dot flex-shrink-0 mt-1 priority-${task.priority}`}
                        />
                      </div>
                      {proj && (
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-2"
                          style={{
                            backgroundColor: proj.color + "15",
                            color: proj.color,
                          }}
                        >
                          {proj.name}
                        </span>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        {assignee && (
                          <div className="flex items-center gap-1.5">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-navy-950"
                              style={{ backgroundColor: assignee.color }}
                            >
                              {assignee.avatar}
                            </div>
                            <span className="text-[11px] text-text-muted">
                              {assignee.name.split(" ")[0]}
                            </span>
                          </div>
                        )}
                        <span
                          className={`text-[11px] ${isOverdue ? "text-red-glow" : "text-text-muted"}`}
                        >
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {col.tasks.length === 0 && (
                  <p className="text-xs text-text-muted text-center py-4 opacity-50">
                    No tasks
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
