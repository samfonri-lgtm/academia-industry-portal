import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const students = [
  {
    id: 1,
    name: "Aarav Sharma",
    roll: "CSIT23041",
    branch: "CSIT",
    semester: "6th",
    cgpa: 8.7,
    skills: ["Java", "Spring Boot", "SQL", "Git & GitHub"],
    match: 92,
    internship: "Completed",
    placement: "Ready",
    gap: "Low",
    avatar: "AS",
  },
  {
    id: 2,
    name: "Priya Verma",
    roll: "CSIT23058",
    branch: "CSIT",
    semester: "6th",
    cgpa: 8.4,
    skills: ["Figma", "UI/UX Design", "Prototyping", "Canva"],
    match: 86,
    internship: "In Progress",
    placement: "Ready",
    gap: "Medium",
    avatar: "PV",
  },
  {
    id: 3,
    name: "Rahul Patel",
    roll: "IT23019",
    branch: "IT",
    semester: "8th",
    cgpa: 8.2,
    skills: ["Python", "Data Analysis", "SQL", "Machine Learning"],
    match: 88,
    internship: "Completed",
    placement: "Ready",
    gap: "Low",
    avatar: "RP",
  },
  {
    id: 4,
    name: "Ananya Singh",
    roll: "CSIT24012",
    branch: "CSIT",
    semester: "4th",
    cgpa: 7.4,
    skills: ["Communication", "Presentation", "Canva"],
    match: 71,
    internship: "Not Started",
    placement: "Needs Training",
    gap: "High",
    avatar: "AN",
  },
  {
    id: 5,
    name: "Rohan Jain",
    roll: "CSIT23073",
    branch: "CSIT",
    semester: "6th",
    cgpa: 7.9,
    skills: ["JavaScript", "React", "Git & GitHub"],
    match: 79,
    internship: "Applied",
    placement: "Developing",
    gap: "Medium",
    avatar: "RJ",
  },
  {
    id: 6,
    name: "Sneha Yadav",
    roll: "IT23044",
    branch: "IT",
    semester: "8th",
    cgpa: 8.9,
    skills: ["Python", "AWS", "Data Analysis", "Communication"],
    match: 94,
    internship: "Completed",
    placement: "Ready",
    gap: "Low",
    avatar: "SY",
  },
  {
    id: 7,
    name: "Vivek Tiwari",
    roll: "CSIT24031",
    branch: "CSIT",
    semester: "4th",
    cgpa: 7.1,
    skills: ["C", "C++", "Data Structures"],
    match: 64,
    internship: "Not Started",
    placement: "Needs Training",
    gap: "High",
    avatar: "VT",
  },
  {
    id: 8,
    name: "Mehak Khan",
    roll: "CSIT23091",
    branch: "CSIT",
    semester: "6th",
    cgpa: 8.1,
    skills: ["Video Editing", "DaVinci Resolve", "Graphic Design"],
    match: 83,
    internship: "In Progress",
    placement: "Developing",
    gap: "Medium",
    avatar: "MK",
  },
];

export default function InstitutionStudents() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [placement, setPlacement] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toast, setToast] = useState("");

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();

    return students.filter((student) => {
      const text = `${student.name} ${student.roll} ${student.branch} ${student.skills.join(" ")}`
        .toLowerCase();

      return (
        (!q || text.includes(q)) &&
        (branch === "All" || student.branch === branch) &&
        (placement === "All" || student.placement === placement)
      );
    });
  }, [search, branch, placement]);

  const stats = {
    total: students.length,
    ready: students.filter((s) => s.placement === "Ready").length,
    training: students.filter((s) => s.placement === "Needs Training").length,
    internship: students.filter((s) => s.internship === "Completed").length,
  };

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
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
            <NavItem icon="🎓" label="Students" to="/institution/students" active />
            <NavItem icon="🧠" label="Skill Analytics" to="/institution/skills" />
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
                  Institution Analytics
                </p>
                <h1 className="mt-1 text-2xl font-black md:text-3xl">
                  Student Monitoring
                </h1>
              </div>

              <button
                onClick={() => notify("Demo student report generated.")}
                className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-300"
              >
                Export Report
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-5 md:p-8">

            {/* MOBILE NAV */}
            <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
              <Link
                to="/institution/dashboard"
                className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold"
              >
                ← Dashboard
              </Link>
              <Link
                to="/institution/skills"
                className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold"
              >
                🧠 Skills
              </Link>
              <Link
                to="/institution/placements"
                className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold"
              >
                🎯 Placements
              </Link>
            </div>

            {/* HERO */}
            <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-slate-900 p-6 md:p-8">
              <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
                <div>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    Student Intelligence
                  </span>

                  <h2 className="mt-4 text-3xl font-black md:text-4xl">
                    Know who is ready — and who needs support.
                  </h2>

                  <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
                    Monitor skill profiles, internship participation, placement
                    readiness and skill gaps at individual student level.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-xs text-slate-500">Profile completion</p>
                  <p className="mt-1 text-3xl font-black">88.6%</p>
                  <div className="mt-3 h-2 w-48 rounded-full bg-slate-800">
                    <div className="h-full w-[88.6%] rounded-full bg-cyan-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* STATS */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat icon="🎓" value={stats.total} label="Students in View" />
              <Stat icon="🎯" value={stats.ready} label="Placement Ready" />
              <Stat icon="📚" value={stats.training} label="Need Training" />
              <Stat icon="💼" value={stats.internship} label="Internship Completed" />
            </section>

            {/* FILTERS */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-5 md:p-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <h3 className="text-lg font-black">Student Directory</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Search and filter students by readiness and academic stream.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-600">⌕</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search student..."
                      className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
                    />
                  </div>

                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none"
                  >
                    <option>All</option>
                    <option>CSIT</option>
                    <option>IT</option>
                  </select>

                  <select
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none"
                  >
                    <option>All</option>
                    <option>Ready</option>
                    <option>Developing</option>
                    <option>Needs Training</option>
                  </select>
                </div>
              </div>

              {/* TABLE */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[900px] text-left text-sm">
                  <thead className="border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-600">
                    <tr>
                      <th className="px-3 pb-4">Student</th>
                      <th className="px-3 pb-4">Academic</th>
                      <th className="px-3 pb-4">Top Skills</th>
                      <th className="px-3 pb-4">Skill Match</th>
                      <th className="px-3 pb-4">Internship</th>
                      <th className="px-3 pb-4">Placement</th>
                      <th className="px-3 pb-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="border-b border-white/5 transition hover:bg-white/[0.02]"
                      >
                        <td className="px-3 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-xs font-black text-cyan-300">
                              {student.avatar}
                            </div>
                            <div>
                              <p className="font-bold">{student.name}</p>
                              <p className="mt-1 text-[11px] text-slate-600">
                                {student.roll}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-4">
                          <p className="font-semibold">{student.branch}</p>
                          <p className="mt-1 text-[11px] text-slate-600">
                            {student.semester} Sem • CGPA {student.cgpa}
                          </p>
                        </td>

                        <td className="px-3 py-4">
                          <div className="flex max-w-[220px] flex-wrap gap-1.5">
                            {student.skills.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-slate-400"
                              >
                                {skill}
                              </span>
                            ))}
                            {student.skills.length > 3 && (
                              <span className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-slate-600">
                                +{student.skills.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-3 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-black">{student.match}%</span>
                            <div className="h-1.5 w-16 rounded-full bg-slate-800">
                              <div
                                className="h-full rounded-full bg-cyan-400"
                                style={{ width: `${student.match}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-4">
                          <Badge text={student.internship} />
                        </td>

                        <td className="px-3 py-4">
                          <PlacementBadge text={student.placement} />
                        </td>

                        <td className="px-3 py-4">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/5"
                          >
                            View Profile
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredStudents.length === 0 && (
                  <div className="py-14 text-center text-sm text-slate-500">
                    No students match the selected filters.
                  </div>
                )}
              </div>
            </section>

            {/* INTERVENTION PANEL */}
            <section className="mt-6 grid gap-5 md:grid-cols-3">
              <Intervention
                icon="🔴"
                title="High Skill Gap"
                value="2"
                text="Students need targeted technical/professional training."
                link="/institution/training"
              />

              <Intervention
                icon="🟠"
                title="Internship Pending"
                value="2"
                text="Students have not started practical industry exposure."
                link="/institution/internships"
              />

              <Intervention
                icon="🟢"
                title="Placement Ready"
                value="4"
                text="Students currently meet the readiness threshold."
                link="/institution/placements"
              />
            </section>

            <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
              AcademiaConnect • Student Monitoring • SIH 2026 Prototype
            </footer>
          </div>
        </main>
      </div>

      {/* PROFILE MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl md:p-8">

            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 font-black text-cyan-300">
                  {selectedStudent.avatar}
                </div>

                <div>
                  <h2 className="text-2xl font-black">
                    {selectedStudent.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedStudent.roll} • {selectedStudent.branch} •{" "}
                    {selectedStudent.semester} Semester
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="rounded-xl border border-white/10 px-3 py-2 text-slate-400 hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-4">
              <Mini label="CGPA" value={selectedStudent.cgpa} />
              <Mini label="Skill Match" value={`${selectedStudent.match}%`} />
              <Mini label="Skill Gap" value={selectedStudent.gap} />
              <Mini label="Placement" value={selectedStudent.placement} />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950 p-5">
              <h3 className="font-black">Verified / Declared Skills</h3>

              <div className="mt-4 flex flex-wrap gap-2">
                {selectedStudent.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-xl bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <InfoCard
                title="Internship Status"
                value={selectedStudent.internship}
                icon="💼"
              />
              <InfoCard
                title="Placement Status"
                value={selectedStudent.placement}
                icon="🎯"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Institution Action
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Based on the current profile, the institution can recommend
                targeted training, internships or placement preparation.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  to="/institution/training"
                  onClick={() => setSelectedStudent(null)}
                  className="rounded-xl bg-cyan-400 px-4 py-2 text-xs font-black text-slate-950"
                >
                  Recommend Training
                </Link>

                <button
                  onClick={() => {
                    notify("Student marked for mentor review.");
                    setSelectedStudent(null);
                  }}
                  className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300"
                >
                  Flag for Mentor Review
                </button>
              </div>
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

function Stat({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className="text-2xl">{icon}</div>
      <p className="mt-4 text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function Badge({ text }) {
  const style =
    text === "Completed"
      ? "bg-emerald-400/10 text-emerald-300"
      : text === "In Progress"
      ? "bg-cyan-400/10 text-cyan-300"
      : text === "Applied"
      ? "bg-amber-400/10 text-amber-300"
      : "bg-white/5 text-slate-500";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${style}`}>
      {text}
    </span>
  );
}

function PlacementBadge({ text }) {
  const style =
    text === "Ready"
      ? "bg-emerald-400/10 text-emerald-300"
      : text === "Needs Training"
      ? "bg-rose-400/10 text-rose-300"
      : "bg-amber-400/10 text-amber-300";

  return (
    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${style}`}>
      {text}
    </span>
  );
}

function Intervention({ icon, title, value, text, link }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
      <div className="flex items-start justify-between">
        <span className="text-2xl">{icon}</span>
        <span className="text-3xl font-black">{value}</span>
      </div>

      <h3 className="mt-5 font-black">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>

      <Link
        to={link}
        className="mt-5 inline-block text-xs font-black text-cyan-400"
      >
        Take Action →
      </Link>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <p className="text-[10px] text-slate-600">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function InfoCard({ title, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-4">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-xs text-slate-500">{title}</span>
      </div>
      <p className="mt-2 font-black">{value}</p>
    </div>
  );
}
