import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { FadeIn, ScaleIn } from "../components/animations";
import { loginApi } from "../auth";

const ROLE_DASHBOARDS = {
  student: "/student/dashboard",
  academician: "/academician/dashboard",
  company: "/company/dashboard",
  institution: "/institution/dashboard",
  admin: "/admin/dashboard",
};

const ROLES = [
  {
    value: "student",
    label: "Student",
  },
  {
    value: "academician",
    label: "Academician",
  },
  {
    value: "company",
    label: "Industry",
  },
  {
    value: "institution",
    label: "Institution",
  },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ROLES.some((item) => item.value === location.state?.role)
      ? location.state.role
      : "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const email = form.email.trim().toLowerCase();
    const password = form.password;
    const role = form.role;

    if (!email || !password || !role) {
      setError("Please enter email, password and select a role.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginApi(email, password, role);

      if (!data?.user) {
        throw new Error(
          "Login succeeded but the server returned invalid user data."
        );
      }

      const user = data.user;

      if (!user.id || !user.role || !user.email) {
        throw new Error(
          "Login succeeded but the server returned incomplete user data."
        );
      }

      const session = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: data.token,
        expiresAt: new Date(
          Date.now() + (data.expires_in || 0) * 1000
        ).toISOString(),
        loggedInAt: new Date().toISOString(),
      };

      login(session);

      const dashboard = ROLE_DASHBOARDS[user.role];

      if (!dashboard) {
        throw new Error("No dashboard is configured for this role.");
      }

      const requestedPath = from;

      const isValidRequestedPath =
        typeof requestedPath === "string" &&
        requestedPath.startsWith(`/${user.role}/`);

      navigate(
        isValidRequestedPath ? requestedPath : dashboard,
        {
          replace: true,
        }
      );
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error?.status === 401 || error?.status === 403
          ? error.message
          : error?.message ||
              "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* LEFT SIDE */}

        <div className="hidden flex-col justify-center px-10 lg:flex xl:px-16">
          <FadeIn>
            <Link
              to="/"
              className="text-2xl font-black tracking-tight"
            >
              Academia
              <span className="text-cyan-400">Connect</span>
            </Link>

            <div className="mt-12 max-w-xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-widest text-cyan-400">
                Skill-first ecosystem
              </p>

              <h1 className="text-5xl font-black leading-tight xl:text-6xl">
                Welcome back to your
                <span className="text-cyan-400"> workspace.</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                Connect skills, training, internships, projects,
                research and placement opportunities through one
                unified platform.
              </p>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-4">
              <LoginStat value="4" label="Stakeholders" />
              <LoginStat value="360°" label="Skill Journey" />
              <LoginStat value="1" label="Platform" />
            </div>
          </FadeIn>
        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center justify-center px-5 py-10 sm:px-8">
          <ScaleIn>
            <div className="w-full max-w-md">
              {/* MOBILE LOGO */}

              <div className="mb-8 lg:hidden">
                <Link
                  to="/"
                  className="text-2xl font-black tracking-tight"
                >
                  Academia
                  <span className="text-cyan-400">Connect</span>
                </Link>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur sm:p-8">
                {/* HEADER */}

                <div className="mb-8">
                  <p className="text-sm font-semibold text-cyan-400">
                    ACCOUNT LOGIN
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Sign in
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Enter your credentials to access your workspace.
                  </p>
                </div>

                {/* ERROR */}

                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
                  >
                    {error}
                  </div>
                )}

                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-200"
                    >
                      Email
                    </label>

                    <input
                      id="email"
                      data-testid="login-email-input"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* PASSWORD */}

                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-200"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      data-testid="login-password-input"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>

                  {/* ROLE */}

                  <div>
                    <label
                      htmlFor="role"
                      className="mb-2 block text-sm font-semibold text-slate-200"
                    >
                      Login As
                    </label>

                    <select
                      id="role"
                      data-testid="login-role-select"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {ROLES.map((role) => (
                        <option
                          key={role.value}
                          value={role.value}
                        >
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    data-testid="login-submit-button"
                    disabled={loading}
                    className="w-full rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Signing in..." : "Sign In →"}
                  </button>
                </form>

                {/* INFO */}

                <div className="mt-6 rounded-xl border border-cyan-400/10 bg-cyan-400/5 p-4">
                  <p className="text-xs font-bold text-cyan-300">
                    Secure API Login
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Your credentials are verified by the AcademiaConnect
                    backend.
                  </p>
                </div>

                {/* REGISTER */}

                <p className="mt-7 text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    Create one
                  </Link>
                </p>
              </div>

              <p className="mt-6 text-center text-xs text-slate-600">
                AcademiaConnect • SIH 2026 Prototype
              </p>
            </div>
          </ScaleIn>
        </div>
      </div>
    </div>
  );
}

function LoginStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="text-2xl font-black">{value}</div>

      <div className="mt-1 text-xs text-slate-500">
        {label}
      </div>
    </div>
  );
}
