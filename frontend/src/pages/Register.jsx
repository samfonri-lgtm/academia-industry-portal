import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { FadeIn, ScaleIn } from "../components/animations";
import { registerApi } from "../auth";

const ROLES = [
  {
    value: "student",
    label: "Student",
    description: "Build skills and discover opportunities",
    icon: "🎓",
  },
  {
    value: "academician",
    label: "Academician",
    description: "Teach, mentor and collaborate",
    icon: "👨‍🏫",
  },
  {
    value: "company",
    label: "Industry",
    description: "Find talent and create opportunities",
    icon: "🏢",
  },
  {
    value: "institution",
    label: "Institution",
    description: "Manage students and outcomes",
    icon: "🏫",
  },
];

const ROLE_DASHBOARDS = {
  student: "/student/dashboard",
  academician: "/academician/dashboard",
  company: "/company/dashboard",
  institution: "/institution/dashboard",
};

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess(false);
  }

  function validateForm() {
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    if (!name) {
      return "Please enter your full name.";
    }

    if (name.length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (!email.includes("@") || !email.includes(".")) {
      return "Please enter a valid email address.";
    }

    if (!form.password) {
      return "Please create a password.";
    }

    if (form.password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!form.role) {
      return "Please select your role.";
    }

    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await registerApi({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });

      if (!response?.user?.id || !response.user.role || !response.token) {
        throw new Error("Registration succeeded but the server returned incomplete session data.");
      }

      login({
        ...response.user,
        token: response.token,
        expiresAt: new Date(Date.now() + (response.expires_in || 0) * 1000).toISOString(),
        registeredAt: new Date().toISOString(),
        loggedInAt: new Date().toISOString(),
      });

      setSuccess(true);
      navigate(ROLE_DASHBOARDS[response.user.role] || "/select-role", {
        replace: true,
      });
    } catch (submitError) {
      setError(submitError?.message || "Unable to create the account. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">
        {/* LEFT PANEL */}
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
                Join the ecosystem
              </p>

              <h1 className="text-5xl font-black leading-tight xl:text-6xl">
                Start building your
                <span className="text-cyan-400"> future.</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-slate-400">
                Create your AcademiaConnect account and connect with
                students, academicians, institutions and industries.
              </p>
            </div>

            <div className="mt-10 space-y-4">
              <RegisterBenefit
                icon="🧠"
                title="Build your skill profile"
                text="Track skills, proficiency and development areas."
              />

              <RegisterBenefit
                icon="🎯"
                title="Discover relevant opportunities"
                text="Find internships, projects and career opportunities."
              />

              <RegisterBenefit
                icon="🤝"
                title="Connect with the ecosystem"
                text="Collaborate across academia and industry."
              />
            </div>
          </FadeIn>
        </div>

        {/* RIGHT PANEL */}
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
                <div className="mb-7">
                  <p className="text-sm font-semibold text-cyan-400">
                    CREATE ACCOUNT
                  </p>

                  <h2 className="mt-2 text-3xl font-black">
                    Get started
                  </h2>

                  <p className="mt-2 text-sm text-slate-400">
                    Choose your role and create your workspace.
                  </p>
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
                  >
                    {error}
                  </div>
                )}

                {success && (
                  <div
                    role="status"
                    className="mb-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
                  >
                    Account created successfully. Redirecting...
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-200"
                    >
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    />
                  </div>

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
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    />
                  </div>

                  {/* ROLE */}
                  <div>
                    <label className="mb-3 block text-sm font-semibold text-slate-200">
                      Select Role
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      {ROLES.map((role) => {
                        const selected = form.role === role.value;

                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() =>
                              setForm((prev) => ({
                                ...prev,
                                role: role.value,
                              }))
                            }
                            className={`rounded-xl border p-3 text-left transition ${
                              selected
                                ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                                : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className="text-xl">
                              {role.icon}
                            </div>

                            <div className="mt-1 text-xs font-bold">
                              {role.label}
                            </div>

                            <div className="mt-1 text-[10px] leading-4 text-slate-500">
                              {role.description}
                            </div>
                          </button>
                        );
                      })}
                    </div>
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
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    />
                  </div>

                  {/* CONFIRM PASSWORD */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-slate-200"
                    >
                      Confirm Password
                    </label>

                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading || success}
                    className="w-full rounded-xl bg-cyan-400 px-4 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Creating Account..."
                      : success
                      ? "Account Created ✓"
                      : "Create Account →"}
                  </button>
                </form>

                <p className="mt-7 text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-cyan-400 hover:text-cyan-300"
                  >
                    Sign in
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

function RegisterBenefit({ icon, title, text }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">
        {icon}
      </div>

      <div>
        <h3 className="font-bold">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-slate-500">
          {text}
        </p>
      </div>
    </div>
  );
}
