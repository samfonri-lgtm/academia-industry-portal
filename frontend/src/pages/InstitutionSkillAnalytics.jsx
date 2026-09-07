import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const skills = [
  { name: "Java", category: "Technical", students: 148, demand: 176, avgLevel: 3.2, gap: 16, trend: "+18%", priority: "High" },
  { name: "Python", category: "Technical", students: 126, demand: 164, avgLevel: 2.8, gap: 23, trend: "+24%", priority: "High" },
  { name: "Communication", category: "Professional", students: 184, demand: 221, avgLevel: 2.7, gap: 17, trend: "+12%", priority: "High" },
  { name: "SQL", category: "Technical", students: 113, demand: 141, avgLevel: 2.6, gap: 20, trend: "+15%", priority: "High" },
  { name: "UI/UX Design", category: "Design", students: 62, demand: 84, avgLevel: 2.4, gap: 26, trend: "+31%", priority: "Medium" },
  { name: "Data Analysis", category: "Technical", students: 74, demand: 119, avgLevel: 2.1, gap: 38, trend: "+36%", priority: "High" },
  { name: "Video Editing", category: "Media", students: 41, demand: 58, avgLevel: 3.1, gap: 29, trend: "+9%", priority: "Medium" },
  { name: "Leadership", category: "Professional", students: 96, demand: 137, avgLevel: 2.3, gap: 30, trend: "+14%", priority: "Medium" },
];

const categories = [
  { name: "Technical", value: 78, color: "bg-cyan-400" },
  { name: "Professional", value: 72, color: "bg-violet-400" },
  { name: "Design", value: 64, color: "bg-amber-400" },
  { name: "Media", value: 69, color: "bg-emerald-400" },
  { name: "Business", value: 58, color: "bg-rose-400" },
];

const recommendations = [
  {
    title: "Data Analytics Accelerator",
    reason: "Largest measurable gap between student supply and industry demand.",
    impact: "High",
    skills: ["Python", "Data Analysis", "SQL"],
  },
  {
    title: "Communication & Interview Lab",
    reason: "Communication demand exceeds the current institution skill pool.",
    impact: "High",
    skills: ["Communication", "Presentation", "Professionalism"],
  },
  {
    title: "UI/UX Portfolio Program",
    reason: "Growing design demand with a limited advanced-level student pool.",
    impact: "Medium",
    skills: ["UI/UX Design", "Figma", "Prototyping"],
  },
];

export default function InstitutionSkillAnalytics() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [toast, setToast] = useState("");

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase();

    return skills.filter((skill) => {
      return (
        (category === "All" || skill.category === category) &&
        (!q ||
          `${skill.name} ${skill.category}`
            .toLowerCase()
            .includes(q))
      );
    });
  }, [category, search]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {toast && (
        <div className="fixed right-5 top-5 z-50 rounded-2xl border border-emerald-400/20 bg-slate-900 px-5 py-3 text-sm font-bold text-emerald-300 shadow-2xl">
          ✓ {toast}
        </div>
      )}

      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-900/80 lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <Link to="/" className="text-xl font-black">
              Academia<span className="text-cyan-400">Connect</span>
            </Link>
            <p className="mt-1 text-xs text-slate-500">
              Institution Control Center
            </p>
          </div>

          <div className="p-4">
            <Link
              to="/institution/dashboard"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
            >
              ← Dashboard
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            <NavItem icon="📊" label="Dashboard" to="/institution/dashboard" />
            <NavItem icon="🎓" label="Students" to="/institution/students" />
            <NavItem icon="🧠" label="Skill Analytics" to="/institution/skills" active />
            <NavItem icon="💼" label="Internships" to="/institution/internships" />
            <NavItem icon="🎯" label="Placements" to="/institution/placements" />
            <NavItem icon="🏢" label="Industry Partners" to="/institution/partners" />
            <NavItem icon="📚" label="Training Programs" to="/institution/training" />
            <NavItem icon="📈" label="Reports" to="/institution/reports" />
          </nav>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">
          <header className="border-b border-white/10 bg-slate-950/90 px-5 py-5 md:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Institution Intelligence
                </p>
                <h1 className="mt-1 text-2xl font-black md:text-3xl">
                  Skill Analytics
                </h1>
              </div>

              <button
                onClick={() => notify("Demo skill report generated.")}
                className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-300"
              >
                Generate Report
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-5 md:p-8">

            {/* MOBILE NAV */}
            <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
              <Link to="/institution/dashboard" className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold">
                ← Dashboard
              </Link>
              <Link to="/institution/students" className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold">
                🎓 Students
              </Link>
              <Link to="/institution/training" className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold">
                📚 Training
              </Link>
            </div>

            {/* HERO */}
            <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-slate-900 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-center">
                <div>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    Skill Mapping Engine
                  </span>

                  <h2 className="mt-4 max-w-3xl text-3xl font-black md:text-4xl">
                    Compare what students have with what industry needs.
                  </h2>

                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                    Identify high-demand skills, institution-wide gaps and
                    training priorities so academic teams can take measurable action.
                  </p>
                </div>

                <div className="min-w-[230px] rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-xs text-slate-500">
                    Overall skill alignment
                  </p>
                  <p className="mt-1 text-4xl font-black">76%</p>

                  <div className="mt-3 h-2 rounded-full bg-slate-800">
                    <div className="h-full w-[76%] rounded-full bg-cyan-400" />
                  </div>

                  <p className="mt-2 text-[11px] text-emerald-300">
                    +8.2% from previous review
                  </p>
                </div>
              </div>
            </section>

            {/* KPI */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Kpi icon="🧠" value="1,106" label="Skill Profiles" note="88.6% complete" />
              <Kpi icon="🏢" value="38" label="Industry Sources" note="12 active partners" />
              <Kpi icon="⚠️" value="14" label="Critical Skill Gaps" note="Require intervention" />
              <Kpi icon="📚" value="17" label="Training Opportunities" note="6 open now" />
            </section>

            {/* CATEGORY PERFORMANCE */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-xl font-black">Skill Category Performance</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Average readiness across major skill domains.
                  </p>
                </div>

                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-bold text-slate-400">
                  Institution-wide
                </span>
              </div>

              <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
                {categories.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold">{item.name}</span>
                      <span className="text-lg font-black">{item.value}%</span>
                    </div>

                    <div className="mt-4 h-2 rounded-full bg-slate-800">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>

                    <p className="mt-3 text-[11px] text-slate-600">
                      Readiness score
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* SKILL GAP TABLE */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-5 md:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h3 className="text-xl font-black">Industry Demand vs Student Skills</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Transparent skill-gap view for institutional action.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-600">⌕</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search skill..."
                      className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/40 sm:w-56"
                    />
                  </div>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none"
                  >
                    <option>All</option>
                    <option>Technical</option>
                    <option>Professional</option>
                    <option>Design</option>
                    <option>Media</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-3 pb-4">Skill</th>
                      <th className="px-3 pb-4">Students</th>
                      <th className="px-3 pb-4">Industry Demand</th>
                      <th className="px-3 pb-4">Avg. Level</th>
                      <th className="px-3 pb-4">Gap</th>
                      <th className="px-3 pb-4">Trend</th>
                      <th className="px-3 pb-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredSkills.map((skill) => (
                      <tr
                        key={skill.name}
                        className="border-b border-white/5 transition hover:bg-white/[0.02]"
                      >
                        <td className="px-3 py-4">
                          <p className="font-bold">{skill.name}</p>
                          <p className="mt-1 text-[10px] text-slate-600">{skill.category}</p>
                        </td>

                        <td className="px-3 py-4 font-semibold">
                          {skill.students}
                        </td>

                        <td className="px-3 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">{skill.demand}</span>
                            <span className="text-[10px] text-slate-600">target</span>
                          </div>
                        </td>

                        <td className="px-3 py-4">
                          <LevelDots value={skill.avgLevel} />
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                              skill.gap >= 30
                                ? "bg-rose-400/10 text-rose-300"
                                : skill.gap >= 20
                                ? "bg-amber-400/10 text-amber-300"
                                : "bg-emerald-400/10 text-emerald-300"
                            }`}
                          >
                            {skill.gap}% gap
                          </span>
                        </td>

                        <td className="px-3 py-4 font-bold text-emerald-300">
                          {skill.trend}
                        </td>

                        <td className="px-3 py-4">
                          <button
                            onClick={() => setSelectedSkill(skill)}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/5"
                          >
                            Analyze
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredSkills.length === 0 && (
                  <div className="py-14 text-center text-sm text-slate-500">
                    No skills match the selected filters.
                  </div>
                )}
              </div>
            </section>

            {/* AI RECOMMENDATIONS */}
            <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  AI-assisted recommendations
                </p>
                <h3 className="mt-1 text-xl font-black">
                  What should the institution do next?
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Recommendations are based on skill-gap and demand signals.
                </p>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {recommendations.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-cyan-400/10 p-2 text-xl">
                        ✨
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-black ${
                          item.impact === "High"
                            ? "bg-rose-400/10 text-rose-300"
                            : "bg-amber-400/10 text-amber-300"
                        }`}
                      >
                        {item.impact} Impact
                      </span>
                    </div>

                    <h4 className="mt-4 font-black">{item.title}</h4>

                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      {item.reason}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {item.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-slate-400"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Link
                      to="/institution/training"
                      className="mt-5 block rounded-xl bg-cyan-400 py-2.5 text-center text-xs font-black text-slate-950"
                    >
                      Plan Training →
                    </Link>
                  </div>
                ))}
              </div>
            </section>

            {/* EXPLAINABILITY */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Transparent intelligence
                  </p>
                  <h3 className="mt-2 text-xl font-black">
                    How the skill-gap signal works
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    The platform compares structured student skill profiles
                    against aggregated skills required by industry opportunities.
                    The result highlights supply, demand and the resulting gap.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Explain
                    number="01"
                    title="Student Supply"
                    text="Count and proficiency of available skills"
                  />
                  <Explain
                    number="02"
                    title="Industry Demand"
                    text="Skills requested by opportunities"
                  />
                  <Explain
                    number="03"
                    title="Gap Signal"
                    text="Priority for training and intervention"
                  />
                </div>
              </div>
            </section>

            <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
              AcademiaConnect • Skill Analytics • SIH 2026 Prototype
            </footer>
          </div>
        </main>
      </div>

      {/* DETAIL MODAL */}
      {selectedSkill && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Skill Analysis
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  {selectedSkill.name}
                </h2>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="rounded-xl border border-white/10 px-3 py-2 text-slate-400 hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Detail label="Students with skill" value={selectedSkill.students} />
              <Detail label="Industry demand" value={selectedSkill.demand} />
              <Detail label="Average proficiency" value={`${selectedSkill.avgLevel}/4`} />
              <Detail label="Skill gap" value={`${selectedSkill.gap}%`} />
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Recommended action
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Create or connect an industry-led training program for{" "}
                <strong className="text-white">{selectedSkill.name}</strong>{" "}
                and prioritize students with lower proficiency.
              </p>

              <Link
                to="/institution/training"
                onClick={() => setSelectedSkill(null)}
                className="mt-4 inline-block rounded-xl bg-cyan-400 px-4 py-2.5 text-xs font-black text-slate-950"
              >
                Open Training Programs →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold ${
        active
          ? "bg-cyan-400 text-slate-950"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      {label}
    </Link>
  );
}

function Kpi({ icon, value, label, note }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-[10px] font-bold text-emerald-300">● Updated</span>
      </div>
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-300">{label}</p>
      <p className="mt-1 text-[11px] text-slate-600">{note}</p>
    </div>
  );
}

function LevelDots({ value }) {
  const rounded = Math.round(value);

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4].map((dot) => (
        <span
          key={dot}
          className={`h-2.5 w-2.5 rounded-full ${
            dot <= rounded ? "bg-cyan-400" : "bg-slate-700"
          }`}
        />
      ))}
      <span className="ml-1 text-[11px] text-slate-500">
        {value}/4
      </span>
    </div>
  );
}

function Explain({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
      <span className="text-xs font-black text-cyan-400">{number}</span>
      <p className="mt-2 text-sm font-black">{title}</p>
      <p className="mt-1 text-[11px] leading-5 text-slate-600">{text}</p>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
      <p className="text-[11px] text-slate-600">{label}</p>
      <p className="mt-1 text-lg font-black">{value}</p>
    </div>
  );
}
