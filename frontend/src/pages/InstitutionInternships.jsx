import React, { useMemo, useState } from "react";

const demoInternships = [
  {
    id: 1,
    student: "Aarav Sharma",
    branch: "CSIT",
    company: "TechNova Solutions",
    role: "Java Backend Intern",
    type: "Internship",
    duration: "8 Weeks",
    start: "12 Aug 2026",
    end: "07 Oct 2026",
    status: "Ongoing",
    mentor: "Dr. Priya Mehta",
    progress: 68,
    skillMatch: 87,
    feedback: "Good technical progress. Needs more consistency in documentation.",
  },
  {
    id: 2,
    student: "Ananya Verma",
    branch: "CSIT",
    company: "InnovateX Labs",
    role: "Frontend Developer Intern",
    type: "Internship",
    duration: "6 Weeks",
    start: "20 Jul 2026",
    end: "31 Aug 2026",
    status: "Completed",
    mentor: "Prof. R. Sharma",
    progress: 100,
    skillMatch: 91,
    feedback: "Excellent delivery and strong UI implementation skills.",
  },
  {
    id: 3,
    student: "Rohan Patel",
    branch: "CSE",
    company: "CodeCraft Systems",
    role: "Software Development Intern",
    type: "Internship",
    duration: "10 Weeks",
    start: "01 Sep 2026",
    end: "09 Nov 2026",
    status: "Ongoing",
    mentor: "Dr. Amit Joshi",
    progress: 34,
    skillMatch: 72,
    feedback: "Initial onboarding completed. Technical mentorship required.",
  },
  {
    id: 4,
    student: "Mehak Jain",
    branch: "CSIT",
    company: "CloudByte Technologies",
    role: "Cloud Engineering Intern",
    type: "Internship",
    duration: "8 Weeks",
    start: "15 Aug 2026",
    end: "10 Oct 2026",
    status: "Needs Review",
    mentor: "Prof. Neha Singh",
    progress: 52,
    skillMatch: 64,
    feedback: "Attendance is acceptable, but cloud fundamentals need improvement.",
  },
  {
    id: 5,
    student: "Vivek Tiwari",
    branch: "IT",
    company: "NextGen Digital",
    role: "Full Stack Intern",
    type: "Internship",
    duration: "12 Weeks",
    start: "05 Jul 2026",
    end: "27 Sep 2026",
    status: "Completed",
    mentor: "Dr. Kunal Rao",
    progress: 100,
    skillMatch: 84,
    feedback: "Strong project ownership and satisfactory industry feedback.",
  },
  {
    id: 6,
    student: "Ishita Gupta",
    branch: "CSE",
    company: "DesignSphere",
    role: "UI/UX Design Intern",
    type: "Internship",
    duration: "6 Weeks",
    start: "25 Aug 2026",
    end: "05 Oct 2026",
    status: "Pending Evaluation",
    mentor: "Prof. S. Kapoor",
    progress: 76,
    skillMatch: 88,
    feedback: "Final evaluation is pending from the industry mentor.",
  },
];

const statusStyles = {
  Ongoing: "bg-blue-50 text-blue-700 border-blue-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Needs Review": "bg-amber-50 text-amber-700 border-amber-200",
  "Pending Evaluation": "bg-violet-50 text-violet-700 border-violet-200",
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

export default function InstitutionInternships() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [branch, setBranch] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const stats = useMemo(() => {
    const total = demoInternships.length;
    const ongoing = demoInternships.filter((x) => x.status === "Ongoing").length;
    const completed = demoInternships.filter((x) => x.status === "Completed").length;
    const review = demoInternships.filter(
      (x) => x.status === "Needs Review" || x.status === "Pending Evaluation"
    ).length;
    return { total, ongoing, completed, review };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return demoInternships.filter((item) => {
      const matchesSearch =
        !q ||
        item.student.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q);

      const matchesStatus = status === "All" || item.status === status;
      const matchesBranch = branch === "All" || item.branch === branch;

      return matchesSearch && matchesStatus && matchesBranch;
    });
  }, [search, status, branch]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-slate-500">Institution Portal</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight">Internship Management</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track industry exposure, student progress, mentor feedback and completion.
            </p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
          >
            + Add Internship
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-7">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Internships" value={stats.total} hint="Tracked by institution" />
          <StatCard label="Ongoing" value={stats.ongoing} hint="Students currently placed" />
          <StatCard label="Completed" value={stats.completed} hint="Successfully completed" />
          <StatCard label="Needs Attention" value={stats.review} hint="Review or evaluation pending" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">Internship Lifecycle</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Institution-side monitoring from approval to completion.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Demo workflow
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {["Applied", "Approved", "Ongoing", "Evaluation", "Completed"].map((step, index) => (
                <div key={step} className="relative">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs font-bold text-slate-400">0{index + 1}</div>
                    <div className="mt-2 text-sm font-semibold">{step}</div>
                  </div>
                  {index < 4 && (
                    <div className="hidden h-px bg-slate-200 md:absolute md:left-full md:top-1/2 md:block md:w-3" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold text-slate-300">Institution Insight</p>
            <div className="mt-3 text-3xl font-bold">81%</div>
            <p className="mt-1 text-sm text-slate-300">Average skill match across tracked internships</p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-white" style={{ width: "81%" }} />
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-400">
              Use this dashboard to identify students who need mentoring, training or industry
              follow-up before completion.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Student Internship Directory</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search students, companies and internship roles.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search student, company..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 sm:w-64"
                />

                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>CSIT</option>
                  <option>CSE</option>
                  <option>IT</option>
                </select>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                  <option>Needs Review</option>
                  <option>Pending Evaluation</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className="block w-full px-5 py-5 text-left transition hover:bg-slate-50"
              >
                <div className="grid gap-5 lg:grid-cols-[1.3fr_1.2fr_0.8fr_0.9fr] lg:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold">
                        {item.student
                          .split(" ")
                          .map((x) => x[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold">{item.student}</div>
                        <div className="text-xs text-slate-500">
                          {item.branch} · {item.mentor}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold">{item.role}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.company}</div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-400">Skill Match</div>
                    <div className="mt-1 font-bold">{item.skillMatch}%</div>
                    <ProgressBar value={item.skillMatch} />
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusStyles[item.status] || "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className="mt-2 text-xs text-slate-500">
                      Progress {item.progress}%
                    </div>
                  </div>
                </div>
              </button>
            ))}

            {!filtered.length && (
              <div className="px-6 py-12 text-center">
                <div className="text-lg font-semibold">No internships found</div>
                <p className="mt-1 text-sm text-slate-500">Try changing your filters or search.</p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Partner Companies</h3>
            <p className="mt-1 text-sm text-slate-500">Active industry ecosystem</p>
            <div className="mt-5 space-y-3">
              {["TechNova Solutions", "InnovateX Labs", "CodeCraft Systems", "CloudByte Technologies"].map(
                (company) => (
                  <div key={company} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                    <span className="text-sm font-medium">{company}</span>
                    <span className="text-xs text-slate-500">Active</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Mentor Feedback</h3>
            <p className="mt-1 text-sm text-slate-500">Latest action points</p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-sm font-semibold">Technical documentation</div>
                <div className="mt-1 text-xs text-slate-500">3 students need improvement</div>
              </div>
              <div>
                <div className="text-sm font-semibold">Cloud fundamentals</div>
                <div className="mt-1 text-xs text-slate-500">2 students recommended for training</div>
              </div>
              <div>
                <div className="text-sm font-semibold">Final evaluations</div>
                <div className="mt-1 text-xs text-slate-500">1 industry response pending</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Recommended Actions</h3>
            <p className="mt-1 text-sm text-slate-500">Institution interventions</p>
            <div className="mt-5 space-y-3">
              {[
                ["Training", "Assign cloud fundamentals training"],
                ["Mentoring", "Schedule mentor review for Rohan"],
                ["Evaluation", "Follow up with DesignSphere"],
              ].map(([tag, text]) => (
                <div key={tag} className="rounded-xl border border-slate-200 p-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{tag}</span>
                  <div className="mt-1 text-sm font-medium">{text}</div>
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
                <p className="text-sm font-semibold text-slate-500">Internship Record</p>
                <h2 className="mt-1 text-2xl font-bold">{selected.student}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.role} · {selected.company}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Duration</div>
                <div className="mt-1 font-semibold">{selected.duration}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Status</div>
                <div className="mt-1 font-semibold">{selected.status}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Industry Mentor</div>
                <div className="mt-1 font-semibold">{selected.mentor}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Skill Match</div>
                <div className="mt-1 font-semibold">{selected.skillMatch}%</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="flex justify-between text-sm">
                <span className="font-semibold">Completion Progress</span>
                <span className="text-slate-500">{selected.progress}%</span>
              </div>
              <ProgressBar value={selected.progress} />
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-semibold">Mentor Feedback</div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{selected.feedback}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
                Schedule Review
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View Student Profile
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View Documents
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Add Internship Record</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Demo form — connect to FastAPI later.
                </p>
              </div>
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-lg px-3 py-1 text-xl text-slate-400 hover:bg-slate-100"
              >
                ×
              </button>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {["Student Name", "Company", "Internship Role", "Industry Mentor", "Start Date", "End Date"].map(
                (label) => (
                  <label key={label} className="text-sm font-medium text-slate-700">
                    {label}
                    <input
                      placeholder={label}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                    />
                  </label>
                )
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Save Internship
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
