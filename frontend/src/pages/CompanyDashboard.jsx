import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { apiRequest } from "../auth";
import useFetch from "../hooks/useFetch";
import {
  Alert,
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
  StatCard,
  formatDate,
} from "../components/ui";

async function loadDashboard(userId) {
  const [dashboard, opportunities] = await Promise.all([
    apiRequest(`/dashboard/company/${userId}`),
    apiRequest(`/company/opportunities/${userId}`),
  ]);

  return { ...dashboard, opportunities: opportunities.opportunities };
}

const quickActions = [
  { title: "Create Opportunity", description: "Publish an internship, project or job with skill requirements.", path: "/company/opportunities/create", icon: "➕" },
  { title: "Manage Opportunities", description: "Review, edit or close your published opportunities.", path: "/company/opportunities", icon: "💼" },
  { title: "Review Applications", description: "Shortlist, select or reject candidates.", path: "/company/applications", icon: "📋" },
  { title: "Company Profile", description: "Keep your company information up to date.", path: "/company/profile", icon: "🏢" },
];

export default function CompanyDashboard() {
  const { session } = useAuth();
  const { data, loading, error, reload } = useFetch(() => loadDashboard(session.id), [session.id]);

  return (
    <div className="space-y-8" data-testid="company-dashboard">
      <PageHeader
        eyebrow="Industry Dashboard"
        title={data?.company?.name || session?.name || "Company"}
        description="Publish opportunities, define skill requirements and manage candidates."
        action={
          <Link to="/company/opportunities/create" data-testid="create-opportunity-link" className="inline-flex w-fit items-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
            + Create Opportunity
          </Link>
        }
      />

      {loading && <LoadingState label="Loading company dashboard..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Opportunities" value={data.statistics.opportunities} description="Published by your company" icon="💼" />
            <StatCard label="Applications" value={data.statistics.applications} description="Total received" icon="📋" />
            <StatCard label="Pending" value={data.statistics.pending_applications} description="Awaiting a decision" icon="⏳" tone="text-amber-300" />
            <StatCard label="Selected" value={data.statistics.accepted_applications} description="Candidates selected" icon="🏆" tone="text-emerald-300" />
          </div>

          <section>
            <h3 className="text-xl font-black">Quick Actions</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {quickActions.map((item) => (
                <Link key={item.path} to={item.path} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-xl transition group-hover:bg-cyan-400/10">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-white">{item.title}</h4>
                      <p className="mt-1 text-sm leading-6 text-slate-400">{item.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <Card>
            <div className="flex flex-col gap-2 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-black">Recent Opportunities</h3>
                <p className="mt-1 text-sm text-slate-500">Your latest published opportunities and their applicant counts.</p>
              </div>
              <Link to="/company/opportunities" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">Manage all →</Link>
            </div>

            {data.opportunities.length === 0 ? (
              <div className="p-6">
                <EmptyState icon="💼" title="No opportunities published yet" description="Create your first opportunity so students can discover and apply." actionLabel="Create Opportunity" actionTo="/company/opportunities/create" />
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {data.opportunities.slice(0, 5).map((opportunity) => (
                  <div key={opportunity.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="font-semibold text-white">{opportunity.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">{opportunity.type} • {opportunity.location || "Location not specified"} • Posted {formatDate(opportunity.created_at)}</p>
                    </div>
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                      {opportunity.application_count} applicant{opportunity.application_count === 1 ? "" : "s"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
