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
} from "../components/ui";

const quickActions = [
  { title: "Update Skills", description: "Add or improve your technical skills.", path: "/student/skills", icon: "🧠" },
  { title: "Find Opportunities", description: "Explore internships, projects and jobs.", path: "/student/opportunities", icon: "💼" },
  { title: "Build Resume", description: "Upload your resume and extract skills with AI.", path: "/student/resume", icon: "📄" },
  { title: "Check Skill Gap", description: "See what skills you need to improve.", path: "/student/skill-gap", icon: "🎯" },
];

const LEVEL_PROGRESS = { Beginner: 25, Intermediate: 50, Advanced: 75, Expert: 100 };

async function loadDashboard(userId) {
  const dashboard = await apiRequest(`/dashboard/student/${userId}`);
  const studentId = dashboard.student.student_id;

  const [profile, skills, applications, recommendations] = await Promise.all([
    apiRequest(`/student/profile/${userId}`),
    apiRequest(`/student/skills/${userId}`),
    apiRequest(`/applications/student/${studentId}`),
    apiRequest(`/matching/student/${studentId}/recommendations`),
  ]);

  return {
    stats: dashboard.statistics,
    profile: profile.profile,
    skills: skills.skills,
    applications: applications.applications,
    recommendations: recommendations.recommendations,
  };
}

function profileCompletion(profile, skillCount) {
  const checks = [profile?.college, profile?.branch, profile?.semester, profile?.cgpa, profile?.career_goal, skillCount > 0];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function StudentDashboard() {
  const { session } = useAuth();

  const { data, loading, error, reload } = useFetch(() => loadDashboard(session.id), [session.id]);

  const completion = data ? profileCompletion(data.profile, data.skills.length) : 0;

  return (
    <div className="space-y-8" data-testid="student-dashboard">
      <PageHeader
        eyebrow="Student Dashboard"
        title="Your career overview"
        description="Track your skills, applications and opportunities from one place."
        action={
          <Link
            to="/student/opportunities"
            data-testid="explore-opportunities-link"
            className="inline-flex w-fit items-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Explore Opportunities →
          </Link>
        }
      />

      {loading && <LoadingState label="Loading your dashboard..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Skills" value={data.stats.skills} description="Skills in your profile" icon="🧠" />
            <StatCard label="Applications" value={data.stats.applications} description={`${data.stats.pending} in progress`} icon="📋" />
            <StatCard label="Opportunities" value={data.stats.available_opportunities} description="Open opportunities" icon="💼" />
            <StatCard label="Selected" value={data.stats.accepted} description={`${data.stats.rejected} rejected`} icon="🏆" tone="text-emerald-300" />
          </div>

          <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-cyan-300">Profile Strength</p>
                <p className="mt-1 text-sm text-slate-400">Complete your profile and add skills to improve opportunity matching.</p>
              </div>
              <span className="text-2xl font-black text-white" data-testid="profile-completion">{completion}%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${completion}%` }} />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
              <span>{completion === 100 ? "Profile complete" : "Keep going"}</span>
              <Link to="/student/profile" className="font-semibold text-cyan-400 hover:text-cyan-300">Complete Profile →</Link>
            </div>
          </div>

          <section>
            <h3 className="text-xl font-black">Quick Actions</h3>
            <p className="mt-1 text-sm text-slate-500">Continue improving your career profile.</p>
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

          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h3 className="text-xl font-black">Recommended Opportunities</h3>
                <p className="mt-1 text-sm text-slate-500">Ranked by how well your skills match the requirements.</p>
              </div>
              <Link to="/student/opportunities" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">View all →</Link>
            </div>

            {data.recommendations.length === 0 ? (
              <EmptyState icon="💼" title="No matched opportunities yet" description="Recommendations appear once companies publish opportunities with skill requirements and you add skills." actionLabel="Browse all opportunities" actionTo="/student/opportunities" />
            ) : (
              <div className="grid gap-4 lg:grid-cols-3">
                {data.recommendations.slice(0, 3).map((item) => (
                  <Card key={item.opportunity_id} className="p-5 transition hover:border-cyan-400/20">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-xs font-bold capitalize text-cyan-300">{item.type}</span>
                        <h4 className="mt-3 font-bold text-white">{item.title}</h4>
                        <p className="mt-1 text-sm text-slate-400">{item.company_name}</p>
                      </div>
                      <div className="shrink-0 rounded-xl bg-emerald-400/10 px-3 py-2 text-center">
                        <p className="text-lg font-black text-emerald-300">{Math.round(item.match_percentage)}%</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-400/70">Match</p>
                      </div>
                    </div>
                    <p className="mt-4 text-xs text-slate-500">{item.location || "Location not specified"}{item.stipend ? ` • ${item.stipend}` : ""}</p>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="grid gap-5 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <div className="flex flex-col gap-2 border-b border-white/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-black">Recent Applications</h3>
                  <p className="mt-1 text-sm text-slate-500">Keep track of your latest applications.</p>
                </div>
                <Link to="/student/applications" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">View applications →</Link>
              </div>

              {data.applications.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">You have not applied to any opportunity yet.</p>
              ) : (
                <div className="divide-y divide-white/10">
                  {data.applications.slice(0, 4).map((application) => (
                    <div key={application.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h4 className="font-semibold text-white">{application.title}</h4>
                        <p className="mt-1 text-sm text-slate-500">{application.company_name} • {formatDate(application.applied_at)}</p>
                      </div>
                      <StatusBadge status={application.status} />
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Skill Journey</h3>
                <Link to="/student/skills" className="text-sm font-semibold text-cyan-400 hover:text-cyan-300">Manage →</Link>
              </div>

              {data.skills.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No skills added yet. Add skills to unlock matching and skill-gap analysis.</p>
              ) : (
                <div className="mt-6 space-y-4">
                  {data.skills.slice(0, 5).map((skill) => (
                    <div key={skill.id}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-300">{skill.skill_name}</span>
                        <span className="text-slate-500">{skill.level}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-cyan-400" style={{ width: `${LEVEL_PROGRESS[skill.level] || 25}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Link to="/student/skill-gap" className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/15">
                View Skill Gap
              </Link>
            </Card>
          </section>
        </>
      )}
    </div>
  );
}
