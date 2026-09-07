import { useState } from "react";
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
  formatDate,
  secondaryButtonClass,
} from "../components/ui";

async function loadOpportunities(userId) {
  const result = await apiRequest(`/company/opportunities/${userId}`);

  const skills = await Promise.all(
    result.opportunities.map((opportunity) =>
      apiRequest(`/matching/opportunity/${opportunity.id}/skills`).then((r) => r.skills).catch(() => [])
    )
  );

  return result.opportunities.map((opportunity, index) => ({ ...opportunity, skills: skills[index] }));
}

export default function CompanyOpportunities() {
  const { session } = useAuth();
  const { data: opportunities, setData, loading, error, reload } = useFetch(() => loadOpportunities(session.id), [session.id]);

  const [deleting, setDeleting] = useState(null);
  const [notice, setNotice] = useState(null);

  async function handleDelete(opportunity) {
    if (!window.confirm(`Delete "${opportunity.title}"? Applications for it will also be removed.`)) return;

    setNotice(null);
    setDeleting(opportunity.id);

    try {
      await apiRequest(`/company/opportunities/${opportunity.id}?user_id=${session.id}`, { method: "DELETE" });
      setData((current) => current.filter((item) => item.id !== opportunity.id));
      setNotice({ tone: "success", text: "Opportunity deleted." });
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setDeleting(null);
    }
  }

  const totalApplicants = (opportunities || []).reduce((sum, item) => sum + (item.application_count || 0), 0);

  return (
    <div className="space-y-8" data-testid="company-opportunities">
      <PageHeader
        eyebrow="Opportunities"
        title="Manage your opportunities"
        description={opportunities ? `${opportunities.length} published • ${totalApplicants} total applicants` : "Published internships, projects and jobs."}
        action={
          <Link to="/company/opportunities/create" data-testid="create-opportunity-link" className="inline-flex w-fit items-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
            + Create Opportunity
          </Link>
        }
      />

      {loading && <LoadingState label="Loading your opportunities..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      {opportunities && opportunities.length === 0 && (
        <EmptyState icon="💼" title="No opportunities published yet" description="Create your first opportunity so students can discover and apply." actionLabel="Create Opportunity" actionTo="/company/opportunities/create" />
      )}

      {opportunities && opportunities.length > 0 && (
        <div className="grid gap-4 xl:grid-cols-2">
          {opportunities.map((opportunity) => (
            <Card key={opportunity.id} className="p-5" data-testid={`company-opportunity-${opportunity.id}`}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-bold capitalize text-cyan-300">{opportunity.type}</span>
                    {opportunity.location && <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">{opportunity.location}</span>}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">{opportunity.title}</h3>
                  {opportunity.description && <p className="mt-1 line-clamp-2 text-sm text-slate-400">{opportunity.description}</p>}
                </div>

                <div className="shrink-0 rounded-xl bg-white/5 px-3 py-2 text-center">
                  <p className="text-lg font-black text-white">{opportunity.application_count}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Applicants</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                <span>💰 {opportunity.stipend || "Not specified"}</span>
                <span>📅 Deadline: {opportunity.deadline ? formatDate(opportunity.deadline) : "Open"}</span>
                <span>🕒 Posted {formatDate(opportunity.created_at)}</span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {opportunity.skills.length === 0 ? (
                  <span className="text-xs text-slate-600">No skill requirements defined.</span>
                ) : (
                  opportunity.skills.map((skill) => (
                    <span key={skill.id} className="rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1 text-xs text-slate-400">
                      {skill.name} · {skill.required_level}
                    </span>
                  ))
                )}
              </div>

              <div className="mt-5 flex flex-wrap gap-3 border-t border-white/10 pt-4">
                <Link to={`/company/opportunities/${opportunity.id}/candidates`} className="rounded-xl bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20" data-testid={`view-candidates-${opportunity.id}`}>
                  View Candidates
                </Link>
                <button type="button" onClick={() => handleDelete(opportunity)} disabled={deleting === opportunity.id} className={`${secondaryButtonClass} !py-2 text-rose-300 hover:!bg-rose-400/10`} data-testid={`delete-opportunity-${opportunity.id}`}>
                  {deleting === opportunity.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
