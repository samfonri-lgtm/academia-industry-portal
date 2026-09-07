import React, { useMemo, useState } from "react";

const skillData = [
  { skill: "Java", category: "Technical", students: 86, demand: 92, readiness: 78, gap: 14 },
  { skill: "DSA", category: "Technical", students: 74, demand: 95, readiness: 67, gap: 28 },
  { skill: "React", category: "Technical", students: 61, demand: 79, readiness: 72, gap: 7 },
  { skill: "AWS", category: "Cloud", students: 39, demand: 73, readiness: 54, gap: 19 },
  { skill: "Communication", category: "Soft Skills", students: 93, demand: 88, readiness: 76, gap: 12 },
  { skill: "UI/UX", category: "Design", students: 42, demand: 61, readiness: 81, gap: 0 },
];

const monthlyData = [
  { month: "Apr", internships: 18, placements: 7, training: 31 },
  { month: "May", internships: 24, placements: 9, training: 38 },
  { month: "Jun", internships: 31, placements: 12, training: 44 },
  { month: "Jul", internships: 37, placements: 16, training: 52 },
  { month: "Aug", internships: 46, placements: 21, training: 67 },
];

const interventions = [
  ["High Priority", "Launch DSA interview bootcamp", "28 students show a measurable DSA gap."],
  ["Industry", "Increase cloud partners", "AWS demand is higher than current student readiness."],
  ["Training", "Track post-training improvement", "Compare assessments before and after training."],
  ["Placement", "Follow up on active candidates", "5 candidates are currently in the recruitment pipeline."],
];

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  );
}

function Bar({ value, max = 100 }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-slate-900 transition-all duration-500"
        style={{ width: `${Math.min((value / max) * 100, 100)}%` }}
      />
    </div>
  );
}

export default function InstitutionReports() {
  const [range, setRange] = useState("Last 5 Months");
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase();

    return skillData.filter((item) => {
      const matchesSearch = !q || item.skill.toLowerCase().includes(q);
      const matchesCategory = category === "All" || item.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const totalStudents = 120;
  const avgReadiness = Math.round(
    skillData.reduce((sum, item) => sum + item.readiness, 0) / skillData.length
  );
  const placementRate = 72;
  const trainingImpact = 81;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-sm font-semibold text-slate-500">Institution Portal</p>

          <div className="mt-1 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">
                One institutional view of skills, training, internships, placements and industry
                collaboration.
              </p>
            </div>

            <div className="flex gap-2">
              <select
                value={range}
                onChange={(e) => setRange(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option>Last 5 Months</option>
                <option>Current Semester</option>
                <option>Academic Year</option>
              </select>

              <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-7">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Students Analysed" value={totalStudents} hint="Skill profiles available" />
          <StatCard label="Avg. Skill Readiness" value={`${avgReadiness}%`} hint="Across tracked skills" />
          <StatCard label="Placement Rate" value={`${placementRate}%`} hint="Current demo cohort" />
          <StatCard label="Training Impact" value={`${trainingImpact}%`} hint="Post-training improvement" />
          <StatCard label="Industry Partners" value="12" hint="Active ecosystem partners" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">Institution Performance Trend</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Growth of training participation, internships and placements.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {range}
              </span>
            </div>

            <div className="mt-7 flex h-64 items-end gap-4 border-b border-slate-200 px-2 pb-2">
              {monthlyData.map((item) => (
                <div key={item.month} className="flex h-full flex-1 items-end justify-center gap-1">
                  <div
                    title={`${item.training} training enrollments`}
                    className="w-1/4 rounded-t-md bg-slate-200 transition-all hover:bg-slate-300"
                    style={{ height: `${item.training * 2.6}px`, maxHeight: "100%" }}
                  />
                  <div
                    title={`${item.internships} internships`}
                    className="w-1/4 rounded-t-md bg-slate-500 transition-all hover:bg-slate-700"
                    style={{ height: `${item.internships * 4}px`, maxHeight: "100%" }}
                  />
                  <div
                    title={`${item.placements} placements`}
                    className="w-1/4 rounded-t-md bg-slate-900 transition-all hover:bg-slate-700"
                    style={{ height: `${item.placements * 7}px`, maxHeight: "100%" }}
                  />
                  <span className="absolute mt-72 text-xs font-medium text-slate-500">{item.month}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-5 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <i className="h-2.5 w-2.5 rounded-sm bg-slate-200" /> Training
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2.5 w-2.5 rounded-sm bg-slate-500" /> Internships
              </span>
              <span className="flex items-center gap-2">
                <i className="h-2.5 w-2.5 rounded-sm bg-slate-900" /> Placements
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold text-slate-300">Executive Insight</p>
            <h2 className="mt-3 text-2xl font-bold">Skill-first progress is improving.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Internship and training activity is growing, but DSA and cloud readiness remain the
              biggest placement risks.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Overall readiness</span>
                  <span>{avgReadiness}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-white" style={{ width: `${avgReadiness}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Training impact</span>
                  <span>{trainingImpact}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-white" style={{ width: `${trainingImpact}%` }} />
                </div>
              </div>
            </div>

            <button className="mt-7 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
              View Recommendations
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Industry Demand vs Student Readiness</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Transparent skill-level comparison for institutional decisions.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search skill..."
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>Technical</option>
                  <option>Cloud</option>
                  <option>Soft Skills</option>
                  <option>Design</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Skill</th>
                  <th className="px-5 py-4">Students</th>
                  <th className="px-5 py-4">Industry Demand</th>
                  <th className="px-5 py-4">Readiness</th>
                  <th className="px-5 py-4">Gap</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSkills.map((item) => (
                  <tr key={item.skill} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-semibold">{item.skill}</div>
                      <div className="mt-1 text-xs text-slate-500">{item.category}</div>
                    </td>
                    <td className="px-5 py-4 text-sm">{item.students}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-10 text-sm font-semibold">{item.demand}%</span>
                        <div className="w-28">
                          <Bar value={item.demand} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-10 text-sm font-semibold">{item.readiness}%</span>
                        <div className="w-28">
                          <Bar value={item.readiness} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`font-semibold ${
                          item.gap >= 20 ? "text-red-600" : item.gap >= 10 ? "text-amber-600" : "text-emerald-600"
                        }`}
                      >
                        {item.gap}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedSkill(item)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold transition hover:bg-slate-100"
                      >
                        Analyse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Placement Outcome Snapshot</h3>
            <p className="mt-1 text-sm text-slate-500">Current cohort overview</p>

            <div className="mt-5 space-y-5">
              {[
                ["Placed", 72, "72 students"],
                ["Active Pipeline", 18, "18 students"],
                ["Internship Completed", 84, "84 students"],
                ["Not Yet Placed", 28, "28 students"],
              ].map(([label, value, count]) => (
                <div key={label}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-xs text-slate-500">{count}</span>
                  </div>
                  <div className="mt-2">
                    <Bar value={value} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Recommended Interventions</h3>
            <p className="mt-1 text-sm text-slate-500">Data-backed institutional actions</p>

            <div className="mt-5 space-y-3">
              {interventions.map(([priority, title, description]) => (
                <div key={title} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                      {priority}
                    </span>
                    <button className="text-xs font-semibold text-slate-500 hover:text-slate-900">
                      Take Action →
                    </button>
                  </div>
                  <div className="mt-3 text-sm font-semibold">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Explainability & Data Flow</h2>
              <p className="mt-1 text-sm text-slate-500">
                Keep institutional recommendations transparent and defensible.
              </p>
            </div>
            <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-500">
              SIH Demo Principle
            </span>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {[
              ["Student Skills", "Profiles + proficiency"],
              ["Industry Demand", "Opportunity requirements"],
              ["Skill Gaps", "Demand − readiness"],
              ["Intervention", "Training / mentoring"],
              ["Outcome", "Internship / placement"],
            ].map(([title, text], index) => (
              <div key={title} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-400">0{index + 1}</div>
                <div className="mt-2 text-sm font-semibold">{title}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">{text}</div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs leading-5 text-slate-500">
            Demo note: these analytics use seeded frontend data. In the final implementation,
            values should come from the FastAPI database and transparent matching calculations.
          </p>
        </section>
      </main>

      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Skill Analysis</p>
                <h2 className="mt-1 text-2xl font-bold">{selectedSkill.skill}</h2>
                <p className="mt-1 text-sm text-slate-500">{selectedSkill.category}</p>
              </div>

              <button
                onClick={() => setSelectedSkill(null)}
                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Students</div>
                <div className="mt-1 text-xl font-bold">{selectedSkill.students}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Demand</div>
                <div className="mt-1 text-xl font-bold">{selectedSkill.demand}%</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Skill Gap</div>
                <div className="mt-1 text-xl font-bold">{selectedSkill.gap}%</div>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Industry Demand</span>
                  <span>{selectedSkill.demand}%</span>
                </div>
                <div className="mt-2">
                  <Bar value={selectedSkill.demand} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Student Readiness</span>
                  <span>{selectedSkill.readiness}%</span>
                </div>
                <div className="mt-2">
                  <Bar value={selectedSkill.readiness} />
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-semibold">Recommended Institutional Response</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {selectedSkill.gap >= 20
                  ? `High-priority gap detected. Create or expand ${selectedSkill.skill} training and monitor post-training assessment.`
                  : selectedSkill.gap >= 10
                  ? `Moderate gap detected. Add targeted training and industry practice opportunities for ${selectedSkill.skill}.`
                  : `${selectedSkill.skill} readiness is relatively aligned with demand. Continue monitoring through internships and placements.`}
              </p>
            </div>

            <button
              onClick={() => setSelectedSkill(null)}
              className="mt-6 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
