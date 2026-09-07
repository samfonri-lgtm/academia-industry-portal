import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const skillData = [
  { name: "Java", students: 148, level: "Advanced", demand: "High" },
  { name: "Python", students: 126, level: "Intermediate", demand: "High" },
  { name: "Communication", students: 184, level: "Intermediate", demand: "High" },
  { name: "UI/UX Design", students: 62, level: "Intermediate", demand: "Medium" },
  { name: "Data Analysis", students: 74, level: "Beginner", demand: "High" },
  { name: "Video Editing", students: 41, level: "Advanced", demand: "Medium" },
];

const students = [
  { name: "Aarav Sharma", branch: "CSIT", year: "3rd", skill: "Java", score: 92, status: "Internship Ready" },
  { name: "Priya Verma", branch: "CSIT", year: "3rd", skill: "UI/UX Design", score: 86, status: "Skill Development" },
  { name: "Rahul Patel", branch: "IT", year: "4th", skill: "Python", score: 88, status: "Placement Ready" },
  { name: "Ananya Singh", branch: "CSIT", year: "2nd", skill: "Communication", score: 71, status: "Needs Training" },
];

const activities = [
  { icon: "🏢", title: "TechNova Solutions joined", text: "New industry partner added to the ecosystem.", time: "Today" },
  { icon: "🎓", title: "42 students completed training", text: "Java Backend Development program completed.", time: "Yesterday" },
  { icon: "💼", title: "18 internship applications", text: "Applications moved to industry review.", time: "2 days ago" },
  { icon: "🤝", title: "Industry workshop scheduled", text: "Cloud & DevOps workshop for CSIT students.", time: "3 days ago" },
];

function InstitutionDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [search, setSearch] = useState("");

  const filteredStudents = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return students;
    return students.filter((student) =>
      `${student.name} ${student.branch} ${student.skill} ${student.status}`
        .toLowerCase()
        .includes(q)
    );
  }, [search]);

  const navItems = [
    ["Dashboard", "📊", "/institution/dashboard"],
    ["Students", "🎓", "/institution/students"],
    ["Skill Analytics", "🧠", "/institution/skills"],
    ["Internships", "💼", "/institution/internships"],
    ["Placements", "🎯", "/institution/placements"],
    ["Industry Partners", "🏢", "/institution/partners"],
    ["Training Programs", "📚", "/institution/training"],
    ["Reports", "📈", "/institution/reports"],
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-900/80 lg:flex lg:flex-col">
          <div className="border-b border-white/10 px-6 py-6">
            <Link to="/" className="text-xl font-black">
              Academia<span className="text-cyan-400">Connect</span>
            </Link>
            <p className="mt-1 text-xs text-slate-500">Institution Control Center</p>
          </div>

          <div className="px-4 py-5">
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
              <div className="text-2xl">🏫</div>
              <p className="mt-3 text-sm font-bold">SIRT College</p>
              <p className="mt-1 text-xs text-slate-400">Institution Admin</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {navItems.map(([label, icon, path]) => (
              <Link
                key={label}
                to={path}
                onClick={() => setActive(label)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active === label
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link
              to="/select-role"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <span>↩</span>
              Switch Role
            </Link>
          </div>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">

          {/* TOPBAR */}
          <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-950/90 px-5 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                  Institution Dashboard
                </p>
                <h1 className="mt-1 text-xl font-black md:text-2xl">
                  SIRT College
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="relative rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-lg hover:bg-white/10">
                  🔔
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-cyan-400" />
                </button>
                <div className="hidden rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm md:block">
                  <span className="font-semibold">Institution Admin</span>
                </div>
              </div>
            </div>
          </header>

          <div className="p-5 md:p-8">

            {/* MOBILE ROLE BAR */}
            <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
              {navItems.map(([label, icon, path]) => (
                <Link
                  key={label}
                  to={path}
                  className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-slate-300"
                >
                  {icon} {label}
                </Link>
              ))}
            </div>

            {/* WELCOME */}
            <section className="overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-slate-900 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <div className="mb-3 inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    2026–27 Academic Session
                  </div>
                  <h2 className="text-3xl font-black md:text-4xl">
                    Institution at a glance.
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                    Monitor student skills, industry engagement, internships,
                    placement readiness and training outcomes from one control center.
                  </p>
                </div>

                <Link
                  to="/institution/reports"
                  className="rounded-2xl bg-cyan-400 px-5 py-3 text-center text-sm font-black text-slate-950"
                >
                  Generate Report →
                </Link>
              </div>
            </section>

            {/* STATS */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard icon="🎓" label="Students Tracked" value="1,248" note="+8.4% this semester" />
              <StatCard icon="🧠" label="Skill Profiles" value="1,106" note="88.6% completion" />
              <StatCard icon="💼" label="Internship Participation" value="438" note="35.1% of students" />
              <StatCard icon="🎯" label="Placement Ready" value="312" note="74 students need training" />
            </section>

            {/* ANALYTICS ROW */}
            <section className="mt-6 grid gap-6 xl:grid-cols-3">

              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 xl:col-span-2">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-black">Skill Development Overview</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Institution-wide proficiency distribution
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                    76% overall readiness
                  </span>
                </div>

                <div className="mt-7 space-y-5">
                  <ProgressRow label="Technical Skills" value={82} />
                  <ProgressRow label="Professional Skills" value={78} />
                  <ProgressRow label="Industry Exposure" value={64} />
                  <ProgressRow label="Certifications" value={59} />
                  <ProgressRow label="Internship Readiness" value={71} />
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                <h3 className="text-lg font-black">Placement Funnel</h3>
                <p className="mt-1 text-sm text-slate-500">Current final-year pipeline</p>

                <div className="mt-6 space-y-3">
                  <Funnel label="Eligible Students" value="482" width="100%" />
                  <Funnel label="Profile Complete" value="421" width="87%" />
                  <Funnel label="Placement Ready" value="312" width="65%" />
                  <Funnel label="Interview Stage" value="184" width="38%" />
                  <Funnel label="Placed" value="96" width="20%" />
                </div>
              </div>

            </section>

            {/* SKILL DEMAND */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-lg font-black">Institution Skill Intelligence</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Compare student capabilities with industry demand.
                  </p>
                </div>

                <Link
                  to="/institution/skills"
                  className="text-sm font-bold text-cyan-400 hover:text-cyan-300"
                >
                  View detailed analytics →
                </Link>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-white/10 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="pb-3">Skill</th>
                      <th className="pb-3">Students</th>
                      <th className="pb-3">Typical Level</th>
                      <th className="pb-3">Industry Demand</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {skillData.map((item) => (
                      <tr key={item.name} className="border-b border-white/5">
                        <td className="py-4 font-semibold">{item.name}</td>
                        <td className="py-4 text-slate-300">{item.students}</td>
                        <td className="py-4">
                          <LevelBadge level={item.level} />
                        </td>
                        <td className="py-4">
                          <DemandBadge demand={item.demand} />
                        </td>
                        <td className="py-4">
                          <Link
                            to="/institution/training"
                            className="font-semibold text-cyan-400"
                          >
                            Train →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* STUDENT MONITORING + ACTIVITY */}
            <section className="mt-6 grid gap-6 xl:grid-cols-3">

              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 xl:col-span-2">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-lg font-black">Student Readiness Monitor</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Identify students who need intervention.
                    </p>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500">⌕</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search student..."
                      className="w-full rounded-xl border border-white/10 bg-slate-950 py-2 pl-9 pr-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/40 sm:w-64"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {filteredStudents.map((student) => (
                    <div
                      key={student.name}
                      className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 font-bold text-cyan-300">
                          {student.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-bold">{student.name}</p>
                          <p className="text-xs text-slate-500">
                            {student.branch} • {student.year} Year • {student.skill}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-black">{student.score}%</span>
                        <StatusBadge status={student.status} />
                        <Link
                          to="/institution/students"
                          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-white/5"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}

                  {filteredStudents.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-slate-500">
                      No students found.
                    </div>
                  )}
                </div>
              </div>


              <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black">Recent Activity</h3>
                    <p className="mt-1 text-sm text-slate-500">Ecosystem updates</p>
                  </div>
                  <span className="text-xl">⚡</span>
                </div>

                <div className="mt-6 space-y-5">
                  {activities.map((activity) => (
                    <div key={activity.title} className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5">
                        {activity.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold">{activity.title}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {activity.text}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </section>


            {/* COLLABORATION SNAPSHOT */}
            <section className="mt-6 grid gap-4 md:grid-cols-3">

              <CollabCard
                icon="🏢"
                title="Industry Partners"
                value="38"
                text="12 active collaborations this month"
                link="/institution/partners"
              />

              <CollabCard
                icon="📚"
                title="Training Programs"
                value="17"
                text="6 currently accepting students"
                link="/institution/training"
              />

              <CollabCard
                icon="🤝"
                title="Industry Projects"
                value="24"
                text="9 projects currently in progress"
                link="/institution/internships"
              />

            </section>


            {/* FOOTER */}
            <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
              AcademiaConnect • Institution Control Center • SIH 2026 Prototype
            </footer>

          </div>
        </main>
      </div>
    </div>
  );
}


/* ---------- COMPONENTS ---------- */

function StatCard({ icon, label, value, note }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-5 transition hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="flex items-center justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs text-emerald-300">● Live</span>
      </div>

      <p className="mt-5 text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
      <p className="mt-2 text-xs text-slate-600">{note}</p>
    </div>
  );
}


function ProgressRow({ label, value }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold text-slate-300">{label}</span>
        <span className="font-bold text-cyan-300">{value}%</span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all duration-700"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}


function Funnel({ label, value, width }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold">{value}</span>
      </div>

      <div className="mt-2 h-2 rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-cyan-400/70"
          style={{ width }}
        />
      </div>
    </div>
  );
}


function LevelBadge({ level }) {
  return (
    <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-300">
      {level}
    </span>
  );
}


function DemandBadge({ demand }) {
  const high = demand === "High";

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
        high
          ? "bg-rose-400/10 text-rose-300"
          : "bg-amber-400/10 text-amber-300"
      }`}
    >
      {demand}
    </span>
  );
}


function StatusBadge({ status }) {
  const styles = {
    "Placement Ready": "bg-emerald-400/10 text-emerald-300",
    "Internship Ready": "bg-cyan-400/10 text-cyan-300",
    "Skill Development": "bg-amber-400/10 text-amber-300",
    "Needs Training": "bg-rose-400/10 text-rose-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
        styles[status] || "bg-white/5 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}


function CollabCard({ icon, title, value, text, link }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-3xl">{icon}</span>
          <h3 className="mt-4 font-black">{title}</h3>
        </div>

        <span className="text-3xl font-black text-cyan-400">
          {value}
        </span>
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {text}
      </p>

      <Link
        to={link}
        className="mt-5 inline-block text-sm font-bold text-cyan-400"
      >
        Explore →
      </Link>
    </div>
  );
}


export default InstitutionDashboard;
