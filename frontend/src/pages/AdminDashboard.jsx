import { Link } from "react-router-dom";
import { apiRequest } from "../auth";
import useFetch from "../hooks/useFetch";
import { Alert, LoadingState, StatCard } from "../components/ui";

export default function AdminDashboard() {
  const { data, loading, error, reload } = useFetch(() => apiRequest("/dashboard/admin"), []);

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white" data-testid="admin-dashboard">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-black tracking-tight">
            Academia<span className="text-cyan-400">Connect</span>
          </Link>
          <Link to="/login" className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5">
            Login
          </Link>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Platform Overview</p>
          <h1 className="mt-2 text-3xl font-black sm:text-4xl">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-slate-400">Live platform-wide statistics from the AcademiaConnect backend.</p>
        </div>

        {loading && <LoadingState label="Loading platform statistics..." />}
        {error && <Alert onRetry={reload}>{error}</Alert>}

        {data && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <StatCard label="Users" value={data.statistics.users} icon="👥" />
            <StatCard label="Students" value={data.statistics.students} icon="🎓" />
            <StatCard label="Companies" value={data.statistics.companies} icon="🏢" />
            <StatCard label="Opportunities" value={data.statistics.opportunities} icon="💼" />
            <StatCard label="Applications" value={data.statistics.applications} icon="📋" />
          </div>
        )}
      </div>
    </div>
  );
}
