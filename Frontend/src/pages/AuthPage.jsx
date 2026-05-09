import { useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { loading, error, login, register, clearError, setError } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  clearError();

  try {

    if (isLogin) {

      if (!form.email || !form.password) {
        setError("Please fill in all fields");
        return;
      }

      const result = await login({
        email: form.email,
        password: form.password,
      });

      if (result?.ok) {
        navigate("/dashboard");
      }

    } else {

      if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!form.name || !form.email || !form.password) {
        setError("Please fill in all fields");
        return;
      }

      const result = await register({
        username: form.name,
        email: form.email,
        password: form.password,
      });

      if (result?.ok) {
        navigate("/dashboard");
      }
    }

  } catch (error) {
    console.log(error);
  }
};

  const toggle = () => {
    setIsLogin(!isLogin);
    clearError();
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen bg-navy-950 bg-grid flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-glow/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-glow/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-glow/3 rounded-full blur-[200px] pointer-events-none" />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-glow to-cyan-glow/60 flex items-center justify-center glow-cyan-strong">
            <svg
              className="w-9 h-9 text-navy-950"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Task<span className="text-cyan-glow text-glow-cyan">Forge</span>
          </h1>
          <p className="text-text-muted text-sm mt-1">
            Command your team's productivity
          </p>
        </div>

        {/* Auth Card */}
        <div className="glass-strong rounded-2xl p-8">
          {/* Toggle */}
          <div className="flex bg-navy-950/50 rounded-xl p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                ${isLogin ? "bg-cyan-glow text-navy-950 glow-cyan" : "text-text-muted hover:text-white"}`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                clearError();
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                ${!isLogin ? "bg-cyan-glow text-navy-950 glow-cyan" : "text-text-muted hover:text-white"}`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-glow/10 border border-red-glow/20 text-red-glow text-sm animate-fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="input-field"
                  id="auth-name"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@taskforge.io"
                className="input-field"
                id="auth-email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                id="auth-password"
              />
            </div>

            {!isLogin && (
              <div className="animate-fade-in">
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-field"
                  id="auth-confirm-password"
                />
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-xs text-cyan-glow hover:text-cyan-light transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              id="auth-submit"
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              ) : null}
              {loading
                ? "Processing..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-text-muted uppercase tracking-wider">
              or
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Social Login */}
          {/* <button
            className="btn-secondary w-full flex items-center justify-center gap-3"
            id="auth-google"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button> */}

          {/* Toggle link */}
          <p className="text-center text-sm text-text-muted mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={toggle}
              className="text-cyan-glow hover:text-cyan-light font-medium transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
