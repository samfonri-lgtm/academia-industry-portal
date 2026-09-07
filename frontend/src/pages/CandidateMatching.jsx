import { Link, useParams } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { apiRequest } from "../auth";
import useFetch from "../hooks/useFetch";
import {
  Alert,
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
  StatusBadge,
  formatDate,
  secondaryButtonClass,
} from "../components/ui";

async function loadCandidates(userId, opportunityId) {
  const [opportunity, skills, applications] = await Promise.all([
    apiRequest(`/company/opportunities/${userId}/${opportunityId}`).then((r) => r.opportunity),
    apiRequest(`/matching/opportunity/${opportunityId}/skills`).then((r) => r.skills),
    apiRequest(`/company/opportunities/${userId}/${opportunityId}/applications`).then((r) => r.applications),
  ]);

  const matches = await Promise.all(
    applications.map((application) =>
      apiRequest(`/matching/student/${application.student_id}/opportunity/${opportunityId}`).catch(() => null)
    )
  );

  const candidates = applications
    .map((application, index) => ({ ...application, match: matches[index] }))
    .sort((a, b) => (b.match?.match?.percentage ?? -1) - (a.match?.match?.percentage ?? -1));

  return { opportunity, skills, candidates };
}

function tone(percentage) {
  if (percentage >= 80) return "text-emerald-300";
  if (percentage >= 50) return "text-amber-300";
  return "text-slate-300";
}

export default function CandidateMatching() {
  const { id } = useParams();
  const { session } = useAuth();
  const { data, loading, error, reload } = useFetch(() => loadCandidates(session.id, id), [session.id, id]);

  return (
    <div className="space-y-8" data-testid="candidate-matching">
      <PageHeader
        eyebrow="Candidate Matching"
        title={data?.opportunity?.title || "Candidates"}
        description="Applicants ranked by how well their skill profile matches this opportunity's requirements."
        action={
          <div className="flex flex-wrap gap-3">
            <Link to="/company/applications" className={secondaryButtonClass}>Manage Statuses</Link>
            <Link to="/company/opportunities" className={secondaryButtonClass}>← Back</Link>
          </div>
        }
      />

      {loading && <LoadingState label="Loading candidates and computing matches..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}

      {data && (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-black">Skill Requirements</h3>
            {data.skills.length === 0 ? (
              <p className="mt-2 text-sm text-slate-500">No skill requirements were defined for this opportunity, so match scores are not available.</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {data.skills.map((skill) => (
                  <span key={skill.id} className="rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1 text-xs text-slate-300">
                    {skill.name} · {skill.required_level}
                  </span>
                ))}
              </div>
            )}
          </Card>

          {data.candidates.length === 0 ? (
            <EmptyState icon="👥" title="No applicants yet" description="Candidates appear here as soon as students apply to this opportunity." />
          ) : (
            <div className="space-y-4">
              {data.candidates.map((candidate, index) => {
                const match = candidate.match;
                const percentage = match?.match?.percentage;

                return (
                  <Card key={candidate.id} className="p-5" data-testid={`candidate-${candidate.id}`}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-black text-cyan-300">#{index + 1}</div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{candidate.student_name}</h3>
                            <StatusBadge status={candidate.status} />
                          </div>
                          <p className="mt-1 text-sm text-slate-400">{candidate.student_email}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {[candidate.college, candidate.branch, candidate.cgpa ? `CGPA ${candidate.cgpa}` : null].filter(Boolean).join(" • ") || "Profile details not provided"} • Applied {formatDate(candidate.applied_at)}
                          </p>

                          {match && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {match.matched_skills.map((skill) => <span key={skill.skill_id} className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-xs text-emerald-300">✓ {skill.name}</span>)}
                              {match.partial_skills.map((skill) => <span key={skill.skill_id} className="rounded-lg border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-xs text-amber-300">~ {skill.name} ({skill.student_level})</span>)}
                              {match.missing_skills.map((skill) => <span key={skill.skill_id} className="rounded-lg border border-rose-400/20 bg-rose-400/10 px-2 py-1 text-xs text-rose-300">✕ {skill.name}</span>)}
                            </div>
                          )}
                        </div>
                      </div>

                      {percentage !== undefined && (
                        <div className="shrink-0 rounded-xl bg-white/5 px-4 py-3 text-center">
                          <p className={`text-2xl font-black ${tone(percentage)}`}>{Math.round(percentage)}%</p>
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">{match.match.recommendation}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
