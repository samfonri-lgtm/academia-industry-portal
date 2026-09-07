import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { API_BASE_URL } from "../auth";

const TARGET_ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Java Developer",
  "Software Developer",
];

export default function StudentSkillGap() {
  const { session } = useAuth();
  const [targetRole, setTargetRole] = useState("Backend Developer");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function analyseSkills(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/student/skill-gap/${session.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ target_role: targetRole }),
        }
      );
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const detail = data?.detail;
        throw new Error(
          typeof detail === "object" ? detail.message : detail || "Unable to analyse skills."
        );
      }

      setAnalysis(data);
    } catch (analysisError) {
      setError(analysisError?.message || "Unable to analyse skills.");
    } finally {
      setLoading(false);
    }
  }

  const percentage = analysis?.match_percentage ?? 0;
  const summary = analysis?.summary;

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          Skill Intelligence
        </p>
        <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
          Live Skill Gap Analysis
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Compare the skills in your profile with a target role and get a practical learning checklist.
        </p>
      </section>

      <form
        onSubmit={analyseSkills}
        className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-end"
      >
        <label className="block flex-1">
          <span className="mb-2 block text-sm font-semibold text-slate-200">Target role</span>
          <select
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            disabled={loading}
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
          >
            {TARGET_ROLES.map((role) => <option key={role}>{role}</option>)}
          </select>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Analysing..." : "Analyse My Skills"}
        </button>
      </form>

      {error && (
        <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </p>
      )}

      {!analysis && !loading && (
        <section className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
          <div className="text-4xl">🎯</div>
          <h2 className="mt-4 text-lg font-bold text-white">Choose a role to begin</h2>
          <p className="mt-2 text-sm text-slate-500">Add skills in your profile first for a more useful result.</p>
          <Link to="/student/skills" className="mt-5 inline-block font-semibold text-cyan-400 hover:text-cyan-300">
            Manage my skills →
          </Link>
        </section>
      )}

      {analysis && (
        <>
          <section className="rounded-3xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 p-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-300">{analysis.target_role}</p>
              <h2 className="mt-2 text-2xl font-black text-white">Career readiness snapshot</h2>
              <p className="mt-2 text-sm text-slate-300">Based on {summary.total_required_skills} role requirements from your live skill profile.</p>
            </div>
            <div className="mt-5 flex h-28 w-28 shrink-0 flex-col items-center justify-center rounded-full border-8 border-cyan-300/30 bg-slate-950/30 sm:mt-0">
              <span className="text-3xl font-black text-cyan-300">{percentage}%</span>
              <span className="text-xs text-slate-400">match</span>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-3">
            <Stat title="Matched" value={summary.matched_skills} tone="text-emerald-300" />
            <Stat title="Missing" value={summary.missing_skills} tone="text-orange-300" />
            <Stat title="Requirements" value={summary.total_required_skills} tone="text-cyan-300" />
          </section>

          <section className="grid gap-6 xl:grid-cols-2">
            <SkillList title="Your strengths" empty="No matched skills yet—start with the recommended skills." skills={analysis.matched_skills} tone="emerald" />
            <SkillList title="Your next learning steps" empty="Great work—no gaps found for this role." skills={analysis.missing_skills} tone="orange" missing />
          </section>

          <section className="flex flex-wrap gap-3">
            <Link to="/student/skills" className="rounded-xl bg-cyan-400 px-5 py-3 font-bold text-slate-950 hover:bg-cyan-300">Update Skills</Link>
            <Link to="/student/opportunities" className="rounded-xl border border-white/10 px-5 py-3 font-semibold text-white hover:bg-white/[0.05]">Find Opportunities</Link>
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ title, value, tone }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><p className="text-sm text-slate-500">{title} skills</p><p className={`mt-2 text-3xl font-black ${tone}`}>{value}</p></div>;
}

function SkillList({ title, empty, skills, tone, missing = false }) {
  const colors = tone === "emerald" ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" : "border-orange-400/20 bg-orange-400/10 text-orange-300";
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-lg font-black text-white">{title}</h2>
      <div className="mt-4 space-y-3">
        {skills.length ? skills.map((skill) => (
          <div key={skill.id || skill.skill_id || skill.name} className={`rounded-xl border p-4 ${colors}`}>
            <div className="flex items-center justify-between gap-3"><span className="font-bold">{skill.name}</span><span className="text-xs font-semibold">{missing ? skill.required_level : skill.level}</span></div>
            <p className="mt-1 text-xs opacity-75">{skill.category}</p>
          </div>
        )) : <p className="rounded-xl border border-dashed border-white/10 p-5 text-sm text-slate-500">{empty}</p>}
      </div>
    </section>
  );
}
