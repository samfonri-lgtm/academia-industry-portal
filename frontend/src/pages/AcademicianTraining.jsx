import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialPrograms = [
  {
    id: 1,
    title: "Java Backend Development",
    partner: "TechNova Solutions",
    type: "Industry Training",
    mode: "Hybrid",
    duration: "6 Weeks",
    seats: 40,
    enrolled: 32,
    status: "Active",
    skills: ["Java", "Spring Boot", "REST API", "SQL"],
    start: "15 Sep 2026",
  },
  {
    id: 2,
    title: "UI/UX Design Masterclass",
    partner: "DesignSphere Studio",
    type: "Workshop",
    mode: "Online",
    duration: "2 Weeks",
    seats: 50,
    enrolled: 41,
    status: "Registration Open",
    skills: ["Figma", "UI/UX Design", "Prototyping"],
    start: "22 Sep 2026",
  },
  {
    id: 3,
    title: "Cloud & DevOps Fundamentals",
    partner: "CloudByte Technologies",
    type: "Industry Training",
    mode: "Online",
    duration: "4 Weeks",
    seats: 35,
    enrolled: 35,
    status: "Full",
    skills: ["AWS", "Docker", "Linux", "Cloud Computing"],
    start: "05 Oct 2026",
  },
  {
    id: 4,
    title: "Industry Ready Communication",
    partner: "SkillBridge Academy",
    type: "Skill Program",
    mode: "Offline",
    duration: "3 Weeks",
    seats: 60,
    enrolled: 27,
    status: "Registration Open",
    skills: ["Communication", "Presentation", "Interview Skills"],
    start: "28 Sep 2026",
  },
];

const recommendations = [
  {
    title: "Data Analytics Bootcamp",
    partner: "InsightWorks",
    reason: "Matches high student demand for Data Analysis.",
    skills: ["Python", "Data Analysis", "SQL"],
    mode: "Hybrid",
  },
  {
    title: "Industry Mentorship: Product Design",
    partner: "DesignSphere Studio",
    reason: "Useful for students building UI/UX portfolios.",
    skills: ["Figma", "Wireframing", "Prototyping"],
    mode: "Online",
  },
  {
    title: "Full Stack Live Project",
    partner: "NextGen Systems",
    reason: "Addresses the institution's internship readiness gap.",
    skills: ["React", "Node.js", "MongoDB"],
    mode: "Hybrid",
  },
];

export default function AcademicianTraining() {
  const [programs, setPrograms] = useState(initialPrograms);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [toast, setToast] = useState("");

  const filteredPrograms = useMemo(() => {
    const q = search.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesFilter =
        filter === "All" ||
        program.type === filter ||
        (filter === "Open" &&
          (program.status === "Active" ||
            program.status === "Registration Open"));

      const matchesSearch =
        !q ||
        `${program.title} ${program.partner} ${program.type} ${program.skills.join(
          " "
        )}`
          .toLowerCase()
          .includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [programs, filter, search]);

  function notify(message) {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  }

  function handleCreate(event) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const newProgram = {
      id: Date.now(),
      title: form.get("title"),
      partner: form.get("partner"),
      type: form.get("type"),
      mode: form.get("mode"),
      duration: form.get("duration"),
      seats: Number(form.get("seats")),
      enrolled: 0,
      status: "Registration Open",
      skills: form
        .get("skills")
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      start: form.get("start"),
    };

    setPrograms((current) => [newProgram, ...current]);
    setShowCreate(false);
    notify("Training program created successfully.");
    event.currentTarget.reset();
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
              Academician Workspace
            </p>
          </div>

          <div className="p-4">
            <Link
              to="/academician/dashboard"
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
            >
              ← Dashboard
            </Link>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            <AcademicianNav
              icon="👤"
              label="Faculty Profile"
              to="/academician/profile"
            />
            <AcademicianNav
              icon="📚"
              label="Industry Training"
              to="/academician/training"
              active
            />
            <AcademicianNav
              icon="🎓"
              label="FDP & Workshops"
              to="/academician/fdp"
            />
            <AcademicianNav
              icon="🤝"
              label="Collaboration Hub"
              to="/academician/collaboration"
            />
            <AcademicianNav
              icon="🔬"
              label="Research Collaboration"
              to="/academician/research"
            />
            <AcademicianNav
              icon="💼"
              label="Live Projects"
              to="/academician/projects"
            />
          </nav>
        </aside>

        {/* MAIN */}
        <main className="min-w-0 flex-1">

          {/* TOPBAR */}
          <header className="border-b border-white/10 bg-slate-950/90 px-5 py-5 md:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Academia ↔ Industry
                </p>
                <h1 className="mt-1 text-2xl font-black md:text-3xl">
                  Industry Training
                </h1>
              </div>

              <button
                onClick={() => setShowCreate(true)}
                className="rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-black text-slate-950 hover:bg-cyan-300"
              >
                + Create Program
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-7xl p-5 md:p-8">

            {/* MOBILE NAV */}
            <div className="mb-6 flex gap-2 overflow-x-auto lg:hidden">
              <Link
                to="/academician/dashboard"
                className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold"
              >
                ← Dashboard
              </Link>
              <Link
                to="/academician/fdp"
                className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold"
              >
                🎓 FDP
              </Link>
              <Link
                to="/academician/collaboration"
                className="whitespace-nowrap rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold"
              >
                🤝 Collaboration
              </Link>
            </div>

            {/* HERO */}
            <section className="rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-slate-900 to-slate-900 p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
                <div>
                  <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                    Skill Development Hub
                  </span>

                  <h2 className="mt-4 text-3xl font-black md:text-4xl">
                    Turn industry requirements into learning opportunities.
                  </h2>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                    Discover relevant industry training, manage programs and
                    connect students with practical learning aligned to their
                    skill gaps.
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowCreate(true)}
                      className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950"
                    >
                      Create Training →
                    </button>

                    <Link
                      to="/academician/collaboration"
                      className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-white/5"
                    >
                      Find Industry Partners
                    </Link>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    This semester
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <QuickMetric value="12" label="Programs" />
                    <QuickMetric value="438" label="Enrollments" />
                    <QuickMetric value="38" label="Industry Partners" />
                    <QuickMetric value="86%" label="Completion" />
                  </div>
                </div>
              </div>
            </section>

            {/* PROGRAM STATS */}
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard icon="📚" value={programs.length} label="Total Programs" />
              <MetricCard
                icon="🟢"
                value={programs.filter((p) => p.status === "Active").length}
                label="Active Programs"
              />
              <MetricCard
                icon="👥"
                value={programs.reduce((sum, p) => sum + p.enrolled, 0)}
                label="Total Enrollments"
              />
              <MetricCard
                icon="🏢"
                value={new Set(programs.map((p) => p.partner)).size}
                label="Industry Partners"
              />
            </section>

            {/* SEARCH + FILTER */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-5 md:p-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h3 className="text-lg font-black">Training Programs</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage industry-led learning opportunities.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-600">⌕</span>
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search programs..."
                      className="w-full rounded-xl border border-white/10 bg-slate-950 py-2.5 pl-9 pr-4 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/40 sm:w-64"
                    />
                  </div>

                  <div className="flex gap-2 overflow-x-auto">
                    {["All", "Open", "Industry Training", "Workshop", "Skill Program"].map(
                      (item) => (
                        <button
                          key={item}
                          onClick={() => setFilter(item)}
                          className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold ${
                            filter === item
                              ? "bg-cyan-400 text-slate-950"
                              : "border border-white/10 bg-white/[0.03] text-slate-400"
                          }`}
                        >
                          {item}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {filteredPrograms.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    onView={() => notify(`Opened ${program.title}`)}
                    onEnroll={() => {
                      if (program.enrolled < program.seats) {
                        setPrograms((current) =>
                          current.map((item) =>
                            item.id === program.id
                              ? {
                                  ...item,
                                  enrolled: item.enrolled + 1,
                                  status:
                                    item.enrolled + 1 >= item.seats
                                      ? "Full"
                                      : item.status,
                                }
                              : item
                          )
                        );
                        notify("Demo enrollment added.");
                      }
                    }}
                  />
                ))}

                {filteredPrograms.length === 0 && (
                  <div className="lg:col-span-2 rounded-2xl border border-dashed border-white/10 py-14 text-center text-sm text-slate-500">
                    No training programs match your search.
                  </div>
                )}
              </div>
            </section>

            {/* AI RECOMMENDATIONS */}
            <section className="mt-6 rounded-3xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    AI-assisted discovery
                  </p>
                  <h3 className="mt-1 text-xl font-black">
                    Recommended industry programs
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Suggestions based on institution skill gaps and industry demand.
                  </p>
                </div>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  Skill Gap → Training
                </span>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {recommendations.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/10 bg-slate-950 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-xl bg-cyan-400/10 p-2 text-xl">
                        ✨
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-bold text-slate-500">
                        {item.mode}
                      </span>
                    </div>

                    <h4 className="mt-4 font-black">{item.title}</h4>
                    <p className="mt-1 text-xs font-semibold text-cyan-400">
                      {item.partner}
                    </p>

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

                    <button
                      onClick={() => notify(`Partner request started for ${item.title}.`)}
                      className="mt-5 w-full rounded-xl border border-cyan-400/20 py-2.5 text-xs font-black text-cyan-300 hover:bg-cyan-400/10"
                    >
                      Explore Collaboration →
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* PROCESS */}
            <section className="mt-6 rounded-3xl border border-white/10 bg-slate-900 p-6">
              <h3 className="text-lg font-black">Industry Training Lifecycle</h3>
              <p className="mt-1 text-sm text-slate-500">
                How AcademiaConnect connects skill gaps with practical exposure.
              </p>

              <div className="mt-7 grid gap-4 md:grid-cols-5">
                <Step number="01" title="Identify Gap" text="Institution skill analytics" />
                <Step number="02" title="Find Partner" text="Match industry expertise" />
                <Step number="03" title="Create Program" text="Define skills & outcomes" />
                <Step number="04" title="Enroll" text="Students join training" />
                <Step number="05" title="Track Outcome" text="Completion & feedback" />
              </div>
            </section>

            <footer className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-slate-600">
              AcademiaConnect • Academician Industry Training • SIH 2026 Prototype
            </footer>
          </div>
        </main>
      </div>

      {/* CREATE MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Academician
                </p>
                <h2 className="mt-1 text-2xl font-black">
                  Create Training Program
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Define an industry-aligned learning opportunity.
                </p>
              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="rounded-xl border border-white/10 px-3 py-2 text-slate-400 hover:bg-white/5"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-7 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  name="title"
                  label="Program Title"
                  placeholder="e.g. Full Stack Development"
                  required
                />

                <Input
                  name="partner"
                  label="Industry Partner"
                  placeholder="Company / Organization"
                  required
                />

                <Select
                  name="type"
                  label="Program Type"
                  options={["Industry Training", "Workshop", "Skill Program"]}
                />

                <Select
                  name="mode"
                  label="Mode"
                  options={["Online", "Offline", "Hybrid"]}
                />

                <Input
                  name="duration"
                  label="Duration"
                  placeholder="e.g. 4 Weeks"
                  required
                />

                <Input
                  name="seats"
                  label="Seats"
                  type="number"
                  min="1"
                  placeholder="40"
                  required
                />

                <Input
                  name="start"
                  label="Start Date"
                  placeholder="e.g. 15 Oct 2026"
                  required
                />

                <Input
                  name="skills"
                  label="Required Skills"
                  placeholder="Java, SQL, Spring Boot"
                  required
                />
              </div>

              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4 text-xs leading-5 text-slate-400">
                <strong className="text-cyan-300">Demo logic:</strong> skills entered here
                will later be used by the backend matching engine to recommend this
                program to students with relevant skill gaps.
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-black text-slate-950 hover:bg-cyan-300"
              >
                Publish Training Program →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AcademicianNav({ icon, label, to, active }) {
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

function QuickMetric({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xl font-black">{value}</p>
      <p className="mt-1 text-[11px] text-slate-500">{label}</p>
    </div>
  );
}

function MetricCard({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <div className="text-2xl">{icon}</div>
      <p className="mt-4 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{label}</p>
    </div>
  );
}

function ProgramCard({ program, onView, onEnroll }) {
  const percentage = Math.round((program.enrolled / program.seats) * 100);
  const full = program.enrolled >= program.seats;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 transition hover:border-cyan-400/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold text-cyan-300">
            {program.type}
          </span>
          <h4 className="mt-4 text-lg font-black">{program.title}</h4>
          <p className="mt-1 text-xs font-semibold text-slate-500">
            {program.partner}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
            full
              ? "bg-rose-400/10 text-rose-300"
              : program.status === "Active"
              ? "bg-emerald-400/10 text-emerald-300"
              : "bg-amber-400/10 text-amber-300"
          }`}
        >
          {program.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-xs">
        <Info label="Mode" value={program.mode} />
        <Info label="Duration" value={program.duration} />
        <Info label="Starts" value={program.start} />
      </div>

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-slate-500">Enrollment</span>
          <span className="font-bold">
            {program.enrolled}/{program.seats}
          </span>
        </div>

        <div className="h-2 rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400"
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {program.skills.map((skill) => (
          <span
            key={skill}
            className="rounded-lg bg-white/5 px-2 py-1 text-[10px] text-slate-400"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="mt-5 flex gap-2">
        <button
          onClick={onView}
          className="flex-1 rounded-xl border border-white/10 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5"
        >
          View Details
        </button>

        <button
          onClick={onEnroll}
          disabled={full}
          className={`flex-1 rounded-xl py-2.5 text-xs font-black ${
            full
              ? "cursor-not-allowed bg-white/5 text-slate-600"
              : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
          }`}
        >
          {full ? "Full" : "Demo Enroll"}
        </button>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
      <p className="text-[10px] text-slate-600">{label}</p>
      <p className="mt-1 truncate font-semibold text-slate-300">{value}</p>
    </div>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-5">
      <p className="text-xs font-black text-cyan-400">{number}</p>
      <h4 className="mt-3 font-black">{title}</h4>
      <p className="mt-2 text-xs leading-5 text-slate-500">{text}</p>
    </div>
  );
}

function Input({ label, name, type = "text", placeholder, required, min }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
      />
    </div>
  );
}

function Select({ label, name, options }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold">{label}</label>
      <select
        name={name}
        className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-300 outline-none focus:border-cyan-400/50"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}
