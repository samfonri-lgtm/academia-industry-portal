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
  StatCard,
  StatusBadge,
  formatDate,
  secondaryButtonClass,
} from "../components/ui";

async function loadApplications(userId) {
  const dashboard = await apiRequest(`/dashboard/student/${userId}`);
  const result = await apiRequest(`/applications/student/${dashboard.student.student_id}`);
  return result.applications;
}

const PIPELINE = ["Applied", "Shortlisted", "Selected"];

export default function StudentApplications() {
  const { session } = useAuth();
  const { data: applications, setData, loading, error, reload } = useFetch(() => loadApplications(session.id), [session.id]);

  const [withdrawing, setWithdrawing] = useState(null);
  const [notice, setNotice] = useState(null);

  const counts = (applications || []).reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  async function handleWithdraw(application) {
    if (!window.confirm(`Withdraw your application for "${application.title}"?`)) return;

    setNotice(null);
    setWithdrawing(application.id);

    try {
      await apiRequest(`/applications/${application.id}`, { method: "DELETE" });
      setData((current) => current.filter((item) => item.id !== application.id));
      setNotice({ tone: "success", text: "Application withdrawn." });
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setWithdrawing(null);
    }
  }

  return (
    <div className="space-y-8" data-testid="student-applications">
      <PageHeader
        eyebrow="Applications"
        title="Track your applications"
        description="Every application you submit and its current status, updated by the company."
        action={
          <Link to="/student/opportunities" className="inline-flex w-fit items-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300">
            Browse Opportunities →
          </Link>
        }
      />

      {loading && <LoadingState label="Loading your applications..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}
      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}

      {applications && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total" value={applications.length} description="Applications submitted" icon="📋" />
            <StatCard label="Shortlisted" value={counts.Shortlisted || 0} description="Under consideration" icon="⭐" tone="text-amber-300" />
            <StatCard label="Selected" value={counts.Selected || 0} description="Offers received" icon="🏆" tone="text-emerald-300" />
            <StatCard label="Rejected" value={counts.Rejected || 0} description="Not selected" icon="✕" tone="text-rose-300" />
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-black">Application Pipeline</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PIPELINE.map((stage, index) => (
                <div key={stage} className="rounded-xl border border-white/10 bg-slate-950 p-4">
                  <p className="text-xs font-bold text-cyan-400">STEP {index + 1}</p>
                  <p className="mt-1 font-semibold text-white">{stage}</p>
                  <p className="mt-1 text-2xl font-black">{counts[stage] || 0}</p>
                </div>
              ))}
            </div>
          </Card>

          {applications.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No applications yet"
              description="Apply to an opportunity and it will show up here with live status updates."
              actionLabel="Find opportunities"
              actionTo="/student/opportunities"
            />
          ) : (
            <div className="space-y-4">
              {applications.map((application) => (
                <Card key={application.id} className="p-5" data-testid={`application-card-${application.id}`}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-bold capitalize text-cyan-300">{application.type}</span>
                        <StatusBadge status={application.status} />
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-white">{application.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{application.company_name}</p>
                      <p className="mt-2 text-xs text-slate-500">
                        {application.location || "Location not specified"} • {application.stipend || "Stipend not specified"} • Applied {formatDate(application.applied_at)}
                      </p>
                    </div>

                    {["Applied", "Shortlisted"].includes(application.status) && (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(application)}
                        disabled={withdrawing === application.id}
                        className={secondaryButtonClass}
                        data-testid={`withdraw-button-${application.id}`}
                      >
                        {withdrawing === application.id ? "Withdrawing..." : "Withdraw"}
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
