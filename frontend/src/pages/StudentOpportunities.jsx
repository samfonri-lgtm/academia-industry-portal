import { useMemo, useState } from "react";
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
  primaryButtonClass,
} from "../components/ui";

const FILTERS = ["All", "Internship", "Project", "Job"];

async function loadOpportunities(userId) {
  const dashboard = await apiRequest(`/dashboard/student/${userId}`);
  const studentId = dashboard.student.student_id;

  const [list, applications] = await Promise.all([
    apiRequest("/opportunities/"),
    apiRequest(`/applications/student/${studentId}`),
  ]);

  const matches = await Promise.all(
    list.opportunities.map((opportunity) =>
      apiRequest(`/matching/student/${studentId}/opportunity/${opportunity.id}`).catch(() => null)
    )
  );

  const appliedIds = new Set(applications.applications.map((item) => item.opportunity_id));

  return {
    studentId,
    opportunities: list.opportunities.map((opportunity, index) => ({
      ...opportunity,
      match: matches[index],
      applied: appliedIds.has(opportunity.id),
    })),
  };
}

function matchTone(percentage) {
  if (percentage >= 80) return "bg-emerald-400/10 text-emerald-300";
  if (percentage >= 50) return "bg-amber-400/10 text-amber-300";
  return "bg-white/5 text-slate-300";
}

function OpportunityCard({ opportunity, onApply, applying }) {
  const match = opportunity.match;
  const requiredSkills = match ? [...match.matched_skills, ...match.partial_skills, ...match.missing_skills] : [];
  const percentage = requiredSkills.length > 0 ? match?.match?.percentage ?? null : null;
  const missingNames = new Set((match?.missing_skills || []).map((skill) => skill.name));

  return (
    <Card className="p-5 transition hover:border-cyan-400/20" data-testid={`opportunity-card-${opportunity.id}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-bold capitalize text-cyan-300">{opportunity.type}</span>
            {opportunity.location && <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-400">{opportunity.location}</span>}
          </div>
          <h3 className="mt-3 text-lg font-bold text-white">{opportunity.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{opportunity.company_name}</p>
        </div>

        {percentage !== null && (
          <div className={`shrink-0 rounded-xl px-3 py-2 text-center ${matchTone(percentage)}`}>
            <p className="text-lg font-black">{Math.round(percentage)}%</p>
            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-70">Match</p>
          </div>
        )}
      </div>

      {opportunity.description && <p className="mt-4 text-sm leading-6 text-slate-400">{opportunity.description}</p>}

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
        <span>💰 {opportunity.stipend || "Not specified"}</span>
        <span>📅 Deadline: {opportunity.deadline ? formatDate(opportunity.deadline) : "Open"}</span>
        <span>🕒 Posted {formatDate(opportunity.created_at)}</span>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Required skills</p>
        {requiredSkills.length === 0 ? (
          <p className="mt-2 text-xs text-slate-600">No specific skill requirements listed.</p>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            {requiredSkills.map((skill) => (
              <span
                key={skill.skill_id}
                className={`rounded-lg border px-2.5 py-1 text-xs ${
                  missingNames.has(skill.name)
                    ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
                    : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                }`}
                title={`Required: ${skill.required_level}`}
              >
                {skill.name} · {skill.required_level}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-xs text-slate-500">
          {percentage === null
            ? "This opportunity has no skill requirements yet."
            : match?.match?.recommendation || "Add skills to see how well you match."}
        </span>

        {opportunity.applied ? (
          <span className="rounded-xl bg-emerald-400/10 px-4 py-2 text-sm font-bold text-emerald-300" data-testid={`applied-badge-${opportunity.id}`}>
            ✓ Applied
          </span>
        ) : (
          <button
            type="button"
            onClick={() => onApply(opportunity)}
            disabled={applying === opportunity.id}
            className={primaryButtonClass}
            data-testid={`apply-button-${opportunity.id}`}
          >
            {applying === opportunity.id ? "Applying..." : "Apply Now"}
          </button>
        )}
      </div>
    </Card>
  );
}

export default function StudentOpportunities() {
  const { session } = useAuth();
  const [filter, setFilter] = useState("All");
  const [applying, setApplying] = useState(null);
  const [notice, setNotice] = useState(null);

  const { data, setData, loading, error, reload } = useFetch(() => loadOpportunities(session.id), [session.id]);

  const visible = useMemo(() => {
    if (!data) return [];
    return data.opportunities.filter(
      (item) => filter === "All" || item.type.toLowerCase() === filter.toLowerCase()
    );
  }, [data, filter]);

  async function handleApply(opportunity) {
    setNotice(null);
    setApplying(opportunity.id);

    try {
      await apiRequest(`/applications/student/${data.studentId}/opportunity/${opportunity.id}`, { method: "POST" });

      setData((current) => ({
        ...current,
        opportunities: current.opportunities.map((item) =>
          item.id === opportunity.id ? { ...item, applied: true } : item
        ),
      }));

      setNotice({ tone: "success", text: `Application submitted for "${opportunity.title}".` });
    } catch (err) {
      setNotice({ tone: "error", text: err.message });
    } finally {
      setApplying(null);
    }
  }

  return (
    <div className="space-y-8" data-testid="student-opportunities">
      <PageHeader
        eyebrow="Opportunities"
        title="Find your next opportunity"
        description="Live opportunities published by companies. Match scores compare their skill requirements with your skill profile."
        action={
          <Link to="/student/applications" className="inline-flex w-fit items-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">
            My Applications →
          </Link>
        }
      />

      <div className="flex flex-wrap gap-2" data-testid="opportunity-filters">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            data-testid={`filter-${item.toLowerCase()}`}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              filter === item ? "bg-cyan-400 text-slate-950" : "border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {notice && <Alert tone={notice.tone}>{notice.text}</Alert>}
      {loading && <LoadingState label="Loading opportunities and computing matches..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}

      {data && !loading && visible.length === 0 && (
        <EmptyState
          icon="💼"
          title={filter === "All" ? "No opportunities published yet" : `No ${filter.toLowerCase()} opportunities right now`}
          description="Opportunities appear here as soon as companies publish them."
        />
      )}

      {visible.length > 0 && (
        <div className="grid gap-4 xl:grid-cols-2">
          {visible.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} onApply={handleApply} applying={applying} />
          ))}
        </div>
      )}
    </div>
  );
}
