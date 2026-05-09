import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const pageTitle = {
  "/": "Dashboard",
  "/projects": "Projects",
  "/tasks": "Tasks",
  "/team": "Team",
};

export default function Header({
  onMenuClick,
  onToggleSidebar,
  isSidebarCollapsed,
}) {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [showNotif, setShowNotif] = useState(false);

  const title = pageTitle[location.pathname] || "TaskForge";
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good Morning";
    if (h < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="h-14 sm:h-16 lg:h-18 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-white/5 glass-dark">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-white/5 transition-colors"
          aria-label="Open navigation"
        >
          <svg
            className="w-5 h-5 text-text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight">
          {title}
        </h1>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:inline-flex p-2 rounded-xl hover:bg-white/5 transition-colors"
          aria-label={
            isSidebarCollapsed ? "Expand navigation" : "Collapse navigation"
          }
        >
          <svg
            className="w-5 h-5 text-text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            {isSidebarCollapsed ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 5l7 7-7 7M4 12h16"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 5l-7 7 7 7M20 12H4"
              />
            )}
          </svg>
        </button>
        <p className="text-xs text-text-muted hidden lg:block">
          {greeting()},{" "}
          <span className="text-cyan-glow">{user?.name || "Commander"}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 glass rounded-xl px-4 py-2 w-64">
          <svg
            className="w-4 h-4 text-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search tasks..."
            className="bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted w-full"
          />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-2 rounded-xl hover:bg-white/5 transition-colors"
          >
            <svg
              className="w-5 h-5 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-glow rounded-full animate-pulse-glow" />
          </button>

          {showNotif && (
            <div className="absolute right-0 top-12 w-72 glass-strong rounded-2xl p-4 z-50 animate-slide-up border border-cyan-glow/20">
              <h3 className="text-sm font-semibold text-white mb-3">
                Notifications
              </h3>
              <div className="space-y-3">
                {[
                  {
                    text: 'Task "Design hero section" is due tomorrow',
                    time: "2h ago",
                    color: "text-amber-glow",
                  },
                  {
                    text: 'Sarah completed "API Documentation"',
                    time: "4h ago",
                    color: "text-green-glow",
                  },
                  {
                    text: 'New comment on "Auth flow"',
                    time: "6h ago",
                    color: "text-cyan-glow",
                  },
                ].map((n, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <span
                      className={`priority-dot flex-shrink-0 mt-1 ${n.color === "text-amber-glow" ? "priority-medium" : n.color === "text-green-glow" ? "priority-low" : "bg-cyan-glow"}`}
                      style={{ boxShadow: "none" }}
                    />
                    <div>
                      <p className="text-text-primary leading-relaxed">
                        {n.text}
                      </p>
                      <p className="text-text-muted mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-glow to-purple-glow flex items-center justify-center text-sm font-bold text-navy-950">
          {user?.name
            ?.split(" ")
            .map((n) => n[0])
            .join("") || "TF"}
        </div>
      </div>
    </header>
  );
}
