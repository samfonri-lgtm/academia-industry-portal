import React, { useMemo, useState } from "react";

const demoPlacements = [
  {
    id: 1,
    student: "Ananya Verma",
    branch: "CSIT",
    company: "TechNova Solutions",
    role: "Software Engineer",
    package: "₹8.5 LPA",
    type: "Full-time",
    status: "Placed",
    skillMatch: 91,
    offerDate: "28 Aug 2026",
    skills: ["Java", "SQL", "Spring Boot", "Git"],
  },
  {
    id: 2,
    student: "Vivek Tiwari",
    branch: "IT",
    company: "NextGen Digital",
    role: "Full Stack Developer",
    package: "₹7.2 LPA",
    type: "Full-time",
    status: "Placed",
    skillMatch: 84,
    offerDate: "26 Aug 2026",
    skills: ["React", "Node.js", "JavaScript", "SQL"],
  },
  {
    id: 3,
    student: "Rohan Patel",
    branch: "CSE",
    company: "CodeCraft Systems",
    role: "Software Developer",
    package: "₹6.4 LPA",
    type: "Full-time",
    status: "Interview",
    skillMatch: 78,
    offerDate: "—",
    skills: ["Java", "DSA", "Git", "REST API"],
  },
  {
    id: 4,
    student: "Mehak Jain",
    branch: "CSIT",
    company: "CloudByte Technologies",
    role: "Cloud Associate",
    package: "₹5.8 LPA",
    type: "Full-time",
    status: "Shortlisted",
    skillMatch: 73,
    offerDate: "—",
    skills: ["AWS", "Linux", "Python", "Networking"],
  },
  {
    id: 5,
    student: "Ishita Gupta",
    branch: "CSE",
    company: "DesignSphere",
    role: "UI/UX Designer",
    package: "₹5.2 LPA",
    type: "Full-time",
    status: "Placed",
    skillMatch: 88,
    offerDate: "22 Aug 2026",
    skills: ["Figma", "UI Design", "Prototyping", "UX Research"],
  },
  {
    id: 6,
    student: "Arjun Singh",
    branch: "CSIT",
    company: "InnovateX Labs",
    role: "Frontend Developer",
    package: "₹4.8 LPA",
    type: "Full-time",
    status: "Not Placed",
    skillMatch: 59,
    offerDate: "—",
    skills: ["HTML", "CSS", "JavaScript"],
  },
  {
    id: 7,
    student: "Neha Sharma",
    branch: "CSE",
    company: "—",
    role: "—",
    package: "—",
    type: "—",
    status: "Not Placed",
    skillMatch: 51,
    offerDate: "—",
    skills: ["Python", "SQL", "Communication"],
  },
];

const statusStyles = {
  Placed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Interview: "bg-blue-50 text-blue-700 border-blue-200",
  Shortlisted: "bg-violet-50 text-violet-700 border-violet-200",
  "Not Placed": "bg-amber-50 text-amber-700 border-amber-200",
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

function Progress({ value }) {
  return (
    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-slate-900 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function InstitutionPlacements() {
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);

  const stats = useMemo(() => {
    const placed = demoPlacements.filter((x) => x.status === "Placed");
    const active = demoPlacements.filter(
      (x) => x.status === "Interview" || x.status === "Shortlisted"
    );
    const packages = placed
      .map((x) => Number(x.package.replace(/[₹ LPA]/g, "")))
      .filter(Boolean);

    const avg = packages.length
      ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1)
      : "0";

    return {
      total: demoPlacements.length,
      placed: placed.length,
      active: active.length,
      avg,
      rate: Math.round((placed.length / demoPlacements.length) * 100),
    };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return demoPlacements.filter((item) => {
      const matchesSearch =
        !q ||
        item.student.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.role.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (branch === "All" || item.branch === branch) &&
        (status === "All" || item.status === status)
      );
    });
  }, [search, branch, status]);

  const companyStats = useMemo(() => {
    const map = {};
    demoPlacements
      .filter((x) => x.company !== "—")
      .forEach((x) => {
        if (!map[x.company]) map[x.company] = { hires: 0, active: 0 };
        if (x.status === "Placed") map[x.company].hires += 1;
        if (x.status === "Interview" || x.status === "Shortlisted") map[x.company].active += 1;
      });

    return Object.entries(map).sort((a, b) => b[1].hires - a[1].hires);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-sm font-semibold text-slate-500">Institution Portal</p>
          <div className="mt-1 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Placement Management</h1>
              <p className="mt-1 text-sm text-slate-500">
                Monitor placement pipelines, offers, company hiring and student readiness.
              </p>
            </div>
            <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
              + Add Placement Record
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-7">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label="Students Tracked" value={stats.total} hint="Current placement batch" />
          <StatCard label="Placed" value={stats.placed} hint="Confirmed offers" />
          <StatCard label="Active Pipeline" value={stats.active} hint="Interview + shortlisted" />
          <StatCard label="Placement Rate" value={`${stats.rate}%`} hint="Current demo cohort" />
          <StatCard label="Avg. Package" value={`₹${stats.avg} LPA`} hint="Among placed students" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Placement Pipeline</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track students through the complete recruitment journey.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                2026 Batch
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-5">
              {[
                ["Registered", 7],
                ["Eligible", 6],
                ["Shortlisted", 5],
                ["Interview", 3],
                ["Placed", 3],
              ].map(([label, value], index) => (
                <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-bold text-slate-400">0{index + 1}</div>
                  <div className="mt-2 text-2xl font-bold">{value}</div>
                  <div className="mt-1 text-xs font-medium text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <div className="text-sm font-semibold text-slate-300">Placement Health</div>
            <div className="mt-3 text-3xl font-bold">Good</div>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Most active candidates have a skill match above 70%.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Skill readiness</span>
                  <span>78%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-full w-[78%] rounded-full bg-white" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Placement conversion</span>
                  <span>{stats.rate}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${stats.rate}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Student Placement Directory</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Placement status and skill-match based readiness.
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
                  <option>Placed</option>
                  <option>Shortlisted</option>
                  <option>Interview</option>
                  <option>Not Placed</option>
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
                <div className="grid gap-5 lg:grid-cols-[1.15fr_1.15fr_0.8fr_0.9fr] lg:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold">
                      {item.student
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{item.student}</div>
                      <div className="text-xs text-slate-500">{item.branch}</div>
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold">{item.role}</div>
                    <div className="mt-1 text-xs text-slate-500">{item.company}</div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-400">Skill Match</div>
                    <div className="mt-1 font-bold">{item.skillMatch}%</div>
                    <Progress value={item.skillMatch} />
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusStyles[item.status] || "bg-slate-50 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.status}
                    </span>
                    <div className="mt-2 text-xs font-semibold text-slate-600">
                      {item.package !== "—" ? item.package : "No offer yet"}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Company Hiring</h3>
            <p className="mt-1 text-sm text-slate-500">Recruitment activity by partner</p>
            <div className="mt-5 space-y-3">
              {companyStats.map(([company, data]) => (
                <div key={company} className="rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold">{company}</span>
                    <span className="text-xs text-slate-500">
                      {data.hires} hire{data.hires === 1 ? "" : "s"}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    {data.active} active candidate{data.active === 1 ? "" : "s"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Skill-Gap Signals</h3>
            <p className="mt-1 text-sm text-slate-500">Where placement preparation is needed</p>
            <div className="mt-5 space-y-4">
              {[
                ["DSA", "6 students", 71],
                ["Communication", "5 students", 76],
                ["Cloud / DevOps", "4 students", 58],
                ["Advanced SQL", "3 students", 63],
              ].map(([skill, count, readiness]) => (
                <div key={skill}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{skill}</span>
                    <span className="text-xs text-slate-500">{count}</span>
                  </div>
                  <Progress value={readiness} />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Recommended Actions</h3>
            <p className="mt-1 text-sm text-slate-500">Institution interventions</p>
            <div className="mt-5 space-y-3">
              {[
                ["Training", "Run a DSA placement bootcamp"],
                ["Mentoring", "Review candidates below 65% match"],
                ["Industry", "Invite more cloud hiring partners"],
                ["Follow-up", "Track pending interview outcomes"],
              ].map(([tag, text]) => (
                <div key={tag} className="rounded-xl border border-slate-200 p-3">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                    {tag}
                  </span>
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
                <p className="text-sm font-semibold text-slate-500">Placement Record</p>
                <h2 className="mt-1 text-2xl font-bold">{selected.student}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.role} · {selected.company}
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
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Placement Status</div>
                <div className="mt-1 font-semibold">{selected.status}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Package</div>
                <div className="mt-1 font-semibold">{selected.package}</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Skill Match</div>
                <div className="mt-1 font-semibold">{selected.skillMatch}%</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs text-slate-500">Offer Date</div>
                <div className="mt-1 font-semibold">{selected.offerDate}</div>
              </div>
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold">Relevant Skills</div>
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
                Update Status
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View Student Profile
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
