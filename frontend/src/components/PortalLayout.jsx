import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import RoleSidebar, { navItems } from "./RoleSidebar";
import { PageTransition } from "./animations";

const roleLabels = {
  student: "Student",
  academician: "Academician",
  company: "Industry",
  institution: "Institution",
};

export default function PortalLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, logout } = useAuth();

  const role = session?.role;
  const mobileItems = navItems[role] || [];

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function goHome() {
    navigate("/");
  }

  const userName = session?.name || "User";
  const userEmail = session?.email || "";
  const roleLabel = roleLabels[role] || "Workspace";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Desktop Sidebar */}
      <RoleSidebar />

      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-5 py-4">
          <button
            onClick={goHome}
            className="text-lg font-black tracking-tight"
          >
            Academia
            <span className="text-cyan-400">Connect</span>
          </button>

          <button
            onClick={handleLogout}
            data-testid="mobile-logout-button"
            className="rounded-lg border border-rose-400/20 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-400/10"
          >
            Logout
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3" data-testid="mobile-nav">
          {mobileItems.map((item) => {
            const active = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  active
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.icon} {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="min-h-screen lg:ml-64">
        {/* Desktop Header */}
        <header className="hidden border-b border-white/10 bg-slate-950 px-8 py-5 lg:block">
          <div className="flex items-center justify-between">
            {/* Left */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-400">
                {roleLabel}
              </p>

              <h1 className="mt-1 text-xl font-black tracking-tight">
                Welcome back, {userName} 👋
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your AcademiaConnect workspace.
              </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              {/* Prototype Badge */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-slate-400">
                SIH 2026 Prototype
              </div>

              {/* User Avatar */}
              <div
                title={userEmail}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400 font-black text-slate-950"
              >
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Animated Page Content */}
        <PageTransition>
          <section className="min-h-[calc(100vh-80px)] p-5 sm:p-7 lg:p-8">
            {children}
          </section>
        </PageTransition>
      </main>
    </div>
  );
}