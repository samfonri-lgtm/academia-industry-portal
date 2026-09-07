import { useMemo, useState } from "react";
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
  StatusBadge,
  formatDate,
  inputClass,
} from "../components/ui";

const STATUS_OPTIONS = ["Applied", "Shortlisted", "Selected", "Rejected"];

async function loadApplications(userId) {
  const result = await apiRequest(`/company/opportunities/${userId}`);

  const groups = await Promise.all(
    result.opportunities.map((opportunity) =>
      apiRequest(`/company/opportunities/${userId}/${opportunity.id}/applications`).then((r) =>
        r.applications.map((application) => ({ ...application, opportunity_id: opportunity.id, opportunity_title: opportunity.title, opportunity_type: opportunity.type }))
      )
    )
  );

  return {
    opportunities: result.opportunities,
    applications: groups.flat().sort((a, b) => String(b.applied_at).localeCompare(String(a.applied_at))),
  };
}

export default function CompanyApplications() {
  const { session } = useAuth();
  const { data, setData, loading, error, reload } = useFetch(() => loadApplications(session.id), [session.id]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [opportunityFilter, setOpportunityFilter] = useState("All");
  const [updating, setUpdating] = useState(null);
  const [notice, setNotice] = useState(null);

  const visible = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLowerCase();

    return data.applications.filter(
      (item) =>
        (statusFilter === "All" || item.status === statusFilter) &&
        (opportunityFilter === "All" || String(item.opportunity_id) === opportunityFilter) &&
        (!query || item.student_name.toLowerCase().includes(query) || item.student_email.toLowerCase().includes(query) || (item.college || "").toLowerCase().includes(query))
    );
  }, [data, search, statusFilter, opportunityFilter]);

  const counts = (data?.applications || []).reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  async function updateStatus(application, status) {
    if (status === application.status) return;

    setNotice(null);
    setUpdating(application.id);

    try {
      await apiRequest(`/company/opportunities/applications/${application.id}/status`, {
        method: "PATCH",
        body: { user_id: session.id, status },
      });

      setData((current) => ({
        ...current,
        applications: current.applications.map((item) => (item.id === application.id ? { ...item, status } : item)),
      }));

      setNotice({ tone: "success", text: `${application.student_name} marked as ${status}.` });
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div className="space-y-8" data-testid="company-applications">
      <PageHeader
        eyebrow="Applications"
        title="Review candidates"
        description="Applications received across all your opportunities. Update a status and the student sees it instantly."
      />

      {loading && <LoadingState label="Loading applications..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total" value={data.applications.length} description="Applications received" icon="📋" />
            <StatCard label="Applied" value={counts.Applied || 0} description="Awaiting review" icon="⏳" tone="text-cyan-300" />
            <StatCard label="Shortlisted" value={counts.Shortlisted || 0} description="In consideration" icon="⭐" tone="text-amber-300" />
            <StatCard label="Selected" value={counts.Selected || 0} description="Offers made" icon="🏆" tone="text-emerald-300" />
          </div>

          {data.applications.length === 0 ? (
            <EmptyState
              icon="📋"
              title={data.opportunities.length === 0 ? "No opportunities published yet" : "No applications yet"}
              description={data.opportunities.length === 0 ? "Publish an opportunity first so students can apply." : "Applications will appear here as students apply to your opportunities."}
              actionLabel={data.opportunities.length === 0 ? "Create Opportunity" : undefined}
              actionTo="/company/opportunities/create"
            />
          ) : (
            <>
              <Card className="flex flex-col gap-3 p-4 lg:flex-row">
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email or college..." className={inputClass} data-testid="applications-search-input" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} lg:w-48`} data-testid="applications-status-filter">
                  <option value="All">All statuses</option>
                  {STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
                </select>
                <select value={opportunityFilter} onChange={(e) => setOpportunityFilter(e.target.value)} className={`${inputClass} lg:w-64`} data-testid="applications-opportunity-filter">
                  <option value="All">All opportunities</option>
                  {data.opportunities.map((opportunity) => <option key={opportunity.id} value={opportunity.id}>{opportunity.title}</option>)}
                </select>
              </Card>

              {visible.length === 0 ? (
                <EmptyState icon="🔍" title="No applications match these filters" description="Try clearing the search or choosing a different status." />
              ) : (
                <div className="space-y-4">
                  {visible.map((application) => (
                    <Card key={application.id} className="p-5" data-testid={`company-application-${application.id}`}>
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex min-w-0 items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-lg font-black text-cyan-300">
                            {application.student_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-white">{application.student_name}</h3>
                              <StatusBadge status={application.status} />
                            </div>
                            <p className="mt-1 text-sm text-slate-400">{application.student_email}</p>
                            <p className="mt-2 text-xs text-slate-500">
                              {[application.college, application.branch, application.semester ? `Semester ${application.semester}` : null, application.cgpa ? `CGPA ${application.cgpa}` : null].filter(Boolean).join(" • ") || "Profile details not provided"}
                            </p>
                            {application.career_goal && <p className="mt-2 text-sm italic text-slate-400">“{application.career_goal}”</p>}
                            <p className="mt-2 text-xs text-slate-500">
                              Applied for <span className="font-semibold text-slate-300">{application.opportunity_title}</span> • {formatDate(application.applied_at)}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <label className="mb-1 block text-xs font-semibold text-slate-500">Update status</label>
                          <select
                            value={application.status}
                            disabled={updating === application.id}
                            onChange={(e) => updateStatus(application, e.target.value)}
                            className={`${inputClass} !py-2 lg:w-44`}
                            data-testid={`status-select-${application.id}`}
                          >
                            {STATUS_OPTIONS.map((status) => <option key={status}>{status}</option>)}
                          </select>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
