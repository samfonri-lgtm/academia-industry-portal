import React, { useMemo, useState } from "react";

const demoPrograms = [
  {
    id: 1,
    title: "DSA & Coding Interview Bootcamp",
    provider: "CodeCraft Systems",
    category: "Technical",
    mode: "Hybrid",
    duration: "4 Weeks",
    enrolled: 42,
    capacity: 50,
    completion: 68,
    status: "Ongoing",
    skills: ["DSA", "Java", "Problem Solving"],
    nextSession: "05 Sep 2026",
  },
  {
    id: 2,
    title: "Cloud Foundations with AWS",
    provider: "CloudByte Technologies",
    category: "Cloud & DevOps",
    mode: "Online",
    duration: "6 Weeks",
    enrolled: 31,
    capacity: 40,
    completion: 44,
    status: "Ongoing",
    skills: ["AWS", "Linux", "Networking"],
    nextSession: "07 Sep 2026",
  },
  {
    id: 3,
    title: "Professional Communication for Placements",
    provider: "FutureWorks Consulting",
    category: "Soft Skills",
    mode: "Offline",
    duration: "2 Weeks",
    enrolled: 55,
    capacity: 60,
    completion: 91,
    status: "Ongoing",
    skills: ["Communication", "Presentation", "Interview"],
    nextSession: "04 Sep 2026",
  },
  {
    id: 4,
    title: "Modern React Development",
    provider: "InnovateX Labs",
    category: "Technical",
    mode: "Online",
    duration: "5 Weeks",
    enrolled: 28,
    capacity: 35,
    completion: 100,
    status: "Completed",
    skills: ["React", "JavaScript", "REST API"],
    nextSession: "—",
  },
  {
    id: 5,
    title: "UI/UX Design Fundamentals",
    provider: "DesignSphere",
    category: "Design",
    mode: "Hybrid",
    duration: "3 Weeks",
    enrolled: 24,
    capacity: 30,
    completion: 37,
    status: "Ongoing",
    skills: ["Figma", "UI/UX", "Prototyping"],
    nextSession: "09 Sep 2026",
  },
  {
    id: 6,
    title: "Python for Data & Automation",
    provider: "TechNova Solutions",
    category: "Technical",
    mode: "Online",
    duration: "4 Weeks",
    enrolled: 36,
    capacity: 45,
    completion: 0,
    status: "Upcoming",
    skills: ["Python", "Automation", "Data"],
    nextSession: "15 Sep 2026",
  },
];

const statusStyles = {
  Ongoing: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Upcoming: "bg-violet-50 text-violet-700 border-violet-200",
};

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm font-medium text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-slate-900 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function InstitutionTraining() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const stats = useMemo(() => {
    const totalEnrolled = demoPrograms.reduce((sum, p) => sum + p.enrolled, 0);
    const ongoing = demoPrograms.filter((p) => p.status === "Ongoing").length;
    const completed = demoPrograms.filter((p) => p.status === "Completed").length;
    const avgCompletion = Math.round(
      demoPrograms.reduce((sum, p) => sum + p.completion, 0) / demoPrograms.length
    );

    return {
      programs: demoPrograms.length,
      enrolled: totalEnrolled,
      ongoing,
      completed,
      avgCompletion,
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return demoPrograms.filter((program) => {
      const matchesSearch =
        !q ||
        program.title.toLowerCase().includes(q) ||
        program.provider.toLowerCase().includes(q) ||
        program.skills.some((skill) => skill.toLowerCase().includes(q));

      return (
        matchesSearch &&
        (status === "All" || program.status === status) &&
        (category === "All" || program.category === category)
      );
    });
  }, [search, status, category]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-sm font-semibold text-slate-500">Institution Portal</p>

          <div className="mt-1 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Training Management</h1>
              <p className="mt-1 text-sm text-slate-500">
                Connect student skill gaps with targeted training, certifications and industry programs.
              </p>
            </div>

            <button
              onClick={() => setShowCreate(true)}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
            >
              + Create Training Program
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-7">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Programs" value={stats.programs} hint="Institution training catalog" />
          <StatCard label="Enrollments" value={stats.enrolled} hint="Current student enrollments" />
          <StatCard label="Ongoing" value={stats.ongoing} hint="Programs in progress" />
          <StatCard label="Completed" value={stats.completed} hint="Finished programs" />
          <StatCard
            label="Avg. Completion"
            value={`${stats.avgCompletion}%`}
            hint="Across all demo programs"
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">Skill-Gap → Training Flow</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Institution can convert analytics into actionable training programs.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Skill-first workflow
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {[
                ["01", "Detect Gap"],
                ["02", "Select Program"],
                ["03", "Enroll Students"],
                ["04", "Track Progress"],
                ["05", "Measure Impact"],
              ].map(([number, label]) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">{number}</div>
                  <div className="mt-2 text-sm font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold text-slate-300">AI-Assisted Insight</p>
            <div className="mt-3 text-3xl font-bold">34 students</div>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              currently show a measurable gap in DSA, cloud or communication skills.
            </p>
            <button className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-200">
              View Skill Gaps
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Training Programs</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search, filter and monitor institution-led and industry-led training.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search program, provider, skill..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 sm:w-72"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>Technical</option>
                  <option>Cloud & DevOps</option>
                  <option>Soft Skills</option>
                  <option>Design</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>Ongoing</option>
                  <option>Upcoming</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map((program) => (
              <button
                key={program.id}
                onClick={() => setSelected(program)}
                className="block w-full px-5 py-5 text-left transition hover:bg-slate-50"
              >
                <div className="grid gap-5 lg:grid-cols-[1.45fr_0.8fr_0.9fr_0.9fr] lg:items-center">
                  <div>
                    <div className="font-semibold">{program.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {program.provider} · {program.mode} · {program.duration}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {program.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-400">Enrollment</div>
                    <div className="mt-1 text-sm font-semibold">
                      {program.enrolled} / {program.capacity}
                    </div>
                    <ProgressBar value={Math.round((program.enrolled / program.capacity) * 100)} />
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-400">Completion</div>
                    <div className="mt-1 text-sm font-semibold">{program.completion}%</div>
                    <ProgressBar value={program.completion} />
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusStyles[program.status] ||
                        "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {program.status}
                    </span>
                    <div className="mt-2 text-xs text-slate-500">
                      Next: {program.nextSession}
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {!filtered.length && (
              <div className="px-6 py-12 text-center">
                <div className="font-semibold">No training programs found</div>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or filter.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">High-Demand Training</h3>
            <p className="mt-1 text-sm text-slate-500">Based on current skill-gap signals</p>

            <div className="mt-5 space-y-3">
              {[
                ["DSA & Problem Solving", "42 students", "High"],
                ["Cloud / AWS", "31 students", "High"],
                ["Communication", "27 students", "Medium"],
                ["Advanced SQL", "19 students", "Medium"],
              ].map(([name, count, priority]) => (
                <div key={name} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                  <div>
                    <div className="text-sm font-semibold">{name}</div>
                    <div className="mt-1 text-xs text-slate-500">{count} need support</div>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold">
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Certification Tracking</h3>
            <p className="mt-1 text-sm text-slate-500">Outcome beyond attendance</p>

            <div className="mt-5 space-y-4">
              {[
                ["AWS Foundations", 74],
                ["Java Backend", 81],
                ["Professional Communication", 93],
              ].map(([name, value]) => (
                <div key={name}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{name}</span>
                    <span className="text-xs text-slate-500">{value}% certified</span>
                  </div>
                  <ProgressBar value={value} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Institution Actions</h3>
            <p className="mt-1 text-sm text-slate-500">Next steps for administrators</p>

            <div className="mt-5 space-y-3">
              {[
                ["Assign Training", "Recommend AWS training to cloud-gap students."],
                ["Create Batch", "Open a new DSA batch before placement season."],
                ["Collect Feedback", "Request mentor feedback for ongoing programs."],
                ["Measure Impact", "Compare skill assessment before and after training."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-slate-200 p-3">
                  <div className="text-sm font-semibold">{title}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{text}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-500">Training Program</p>
                <h2 className="mt-1 text-2xl font-bold">{selected.title}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.provider} · {selected.mode} · {selected.duration}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                ["Category", selected.category],
                ["Status", selected.status],
                ["Enrollment", `${selected.enrolled} / ${selected.capacity}`],
                ["Next Session", selected.nextSession],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 font-semibold">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Program Completion</span>
                <span className="text-slate-500">{selected.completion}%</span>
              </div>
              <ProgressBar value={selected.completion} />
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold">Target Skills</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
                Manage Enrollments
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View Attendance
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View Outcomes
              </button>
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Create Training Program</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Demo form — connect to FastAPI later.
                </p>
              </div>

              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                "Program Title",
                "Industry / Training Provider",
                "Category",
                "Mode",
                "Duration",
                "Capacity",
              ].map((label) => (
                <label key={label} className="text-sm font-medium text-slate-700">
                  {label}
                  <input
                    placeholder={label}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  />
                </label>
              ))}
            </div>

            <label className="mt-4 block text-sm font-medium text-slate-700">
              Target Skills
              <textarea
                placeholder="Example: Java, DSA, Problem Solving"
                rows={3}
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </label>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Create Program
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
