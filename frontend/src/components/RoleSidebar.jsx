import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export const navItems = {
  student: [
    { label: "Dashboard", path: "/student/dashboard", icon: "🏠" },
    { label: "My Profile", path: "/student/profile", icon: "👤" },
    { label: "My Skills", path: "/student/skills", icon: "🧠" },
    { label: "Resume & AI", path: "/student/resume", icon: "📄" },
    { label: "Skill Gap", path: "/student/skill-gap", icon: "🎯" },
    { label: "Opportunities", path: "/student/opportunities", icon: "💼" },
    { label: "Applications", path: "/student/applications", icon: "📋" },
  ],

  academician: [
    { label: "Dashboard", path: "/academician/dashboard", icon: "🏠" },
    { label: "My Profile", path: "/academician/profile", icon: "👤" },
    { label: "Training", path: "/academician/training", icon: "🎓" },
    { label: "Collaboration", path: "/academician/collaboration", icon: "🤝" },
    { label: "FDP & Workshops", path: "/academician/fdp", icon: "📚" },
    { label: "Research", path: "/academician/research", icon: "🔬" },
    { label: "Projects", path: "/academician/projects", icon: "🚀" },
    { label: "Consultancy", path: "/academician/consultancy", icon: "💡" },
  ],

  company: [
    { label: "Dashboard", path: "/company/dashboard", icon: "🏠" },
    { label: "Company Profile", path: "/company/profile", icon: "🏢" },
    { label: "Opportunities", path: "/company/opportunities", icon: "💼" },
    {
      label: "Create Opportunity",
      path: "/company/opportunities/create",
      icon: "➕",
    },
    { label: "Applications", path: "/company/applications", icon: "📋" },
    { label: "Settings", path: "/company/settings", icon: "⚙️" },
  ],

  institution: [
    { label: "Dashboard", path: "/institution/dashboard", icon: "🏠" },
    { label: "Students", path: "/institution/students", icon: "👥" },
    { label: "Skill Analytics", path: "/institution/skills", icon: "🧠" },
    { label: "Training", path: "/institution/training", icon: "🎓" },
    { label: "Internships", path: "/institution/internships", icon: "💼" },
    { label: "Placements", path: "/institution/placements", icon: "📈" },
    { label: "Industry Partners", path: "/institution/partners", icon: "🤝" },
    { label: "Reports", path: "/institution/reports", icon: "📊" },
  ],
};

const roleLabels = {
  student: "Student",
  academician: "Academician",
  company: "Industry",
  institution: "Institution",
};

export default function RoleSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, logout } = useAuth();

  const role = session?.role;
  const items = navItems[role] || [];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-white/10 bg-slate-900 lg:block">

      {/* LOGO */}
      <div className="border-b border-white/10 px-6 py-6">
        <button
          onClick={() => navigate("/")}
          className="text-left text-xl font-black"
        >
          Academia
          <span className="text-cyan-400">Connect</span>
        </button>

        <p className="mt-1 text-xs text-slate-500">
          {roleLabels[role] || "Workspace"}
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-1 px-3 py-5">
        {items.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                active
                  ? "bg-cyan-400/10 text-cyan-300"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-lg">{item.icon}</span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* USER SECTION */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 p-4">

        <div className="mb-3 rounded-xl bg-white/[0.03] p-3">
          <p className="truncate text-sm font-bold">
            {session?.name || "User"}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {session?.email || ""}
          </p>

          <p className="mt-2 text-xs font-semibold text-cyan-400">
            {roleLabels[role] || "User"}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-rose-400/20 px-4 py-2.5 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10"
        >
          🚪 Logout
        </button>
      </div>

    </aside>
  );
}