import React, { useMemo, useState } from "react";

const demoPartners = [
  {
    id: 1,
    name: "TechNova Solutions",
    sector: "Software & IT",
    location: "Bengaluru, India",
    contact: "Priya Nair",
    email: "partnerships@technova.example",
    status: "Active",
    students: 18,
    internships: 12,
    placements: 6,
    programs: 5,
    mou: "Active",
    lastActivity: "Industry workshop · 28 Aug 2026",
    focus: ["Java", "Cloud", "Backend", "AI"],
  },
  {
    id: 2,
    name: "InnovateX Labs",
    sector: "Technology",
    location: "Pune, India",
    contact: "Rahul Mehta",
    email: "industry@innovatex.example",
    status: "Active",
    students: 14,
    internships: 9,
    placements: 4,
    programs: 3,
    mou: "Active",
    lastActivity: "Guest lecture · 24 Aug 2026",
    focus: ["React", "UI/UX", "Product", "JavaScript"],
  },
  {
    id: 3,
    name: "CodeCraft Systems",
    sector: "Software Development",
    location: "Hyderabad, India",
    contact: "Amit Rao",
    email: "campus@codecraft.example",
    status: "Active",
    students: 11,
    internships: 7,
    placements: 3,
    programs: 4,
    mou: "Active",
    lastActivity: "Live project · 20 Aug 2026",
    focus: ["DSA", "Java", "APIs", "Testing"],
  },
  {
    id: 4,
    name: "CloudByte Technologies",
    sector: "Cloud & DevOps",
    location: "Noida, India",
    contact: "Neha Kapoor",
    email: "talent@cloudbyte.example",
    status: "Review Due",
    students: 8,
    internships: 5,
    placements: 2,
    programs: 2,
    mou: "Renewal Due",
    lastActivity: "Internship review · 16 Aug 2026",
    focus: ["AWS", "Linux", "DevOps", "Networking"],
  },
  {
    id: 5,
    name: "DesignSphere",
    sector: "Design & Media",
    location: "Mumbai, India",
    contact: "Sana Khan",
    email: "collab@designsphere.example",
    status: "Active",
    students: 7,
    internships: 4,
    placements: 2,
    programs: 3,
    mou: "Active",
    lastActivity: "Portfolio review · 12 Aug 2026",
    focus: ["Figma", "UI/UX", "Animation", "Branding"],
  },
  {
    id: 6,
    name: "FutureWorks Consulting",
    sector: "Business & Consulting",
    location: "Delhi, India",
    contact: "Karan Shah",
    email: "university@futureworks.example",
    status: "Onboarding",
    students: 0,
    internships: 0,
    placements: 0,
    programs: 1,
    mou: "Draft",
    lastActivity: "Partner onboarding · 08 Aug 2026",
    focus: ["Management", "Marketing", "Analytics"],
  },
];

const activity = [
  ["TechNova Solutions", "Industry workshop", "28 Aug 2026"],
  ["InnovateX Labs", "Guest lecture", "24 Aug 2026"],
  ["CodeCraft Systems", "Live project", "20 Aug 2026"],
  ["CloudByte Technologies", "Internship review", "16 Aug 2026"],
  ["DesignSphere", "Student portfolio review", "12 Aug 2026"],
];

const statusStyles = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Review Due": "bg-amber-50 text-amber-700 border-amber-200",
  Onboarding: "bg-blue-50 text-blue-700 border-blue-200",
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

export default function InstitutionPartners() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [sector, setSector] = useState("All");
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const stats = useMemo(() => {
    const active = demoPartners.filter((p) => p.status === "Active").length;
    const students = demoPartners.reduce((sum, p) => sum + p.students, 0);
    const internships = demoPartners.reduce((sum, p) => sum + p.internships, 0);
    const placements = demoPartners.reduce((sum, p) => sum + p.placements, 0);
    return { active, students, internships, placements };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return demoPartners.filter((partner) => {
      const matchesSearch =
        !q ||
        partner.name.toLowerCase().includes(q) ||
        partner.sector.toLowerCase().includes(q) ||
        partner.contact.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (status === "All" || partner.status === status) &&
        (sector === "All" || partner.sector === sector)
      );
    });
  }, [search, status, sector]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <p className="text-sm font-semibold text-slate-500">Institution Portal</p>
          <div className="mt-1 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Industry Partners</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage industry relationships, MoUs and collaboration impact.
              </p>
            </div>
            <button
              onClick={() => setShowAdd(true)}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              + Add Partner
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-7">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Active Partners" value={stats.active} hint="Current industry ecosystem" />
          <StatCard label="Students Engaged" value={stats.students} hint="Across partner activities" />
          <StatCard label="Internships" value={stats.internships} hint="Contributed by partners" />
          <StatCard label="Placements" value={stats.placements} hint="Offers generated through partners" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold">Partnership Health</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A quick view of engagement across the industry network.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                Institution Overview
              </span>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                ["Internship Contribution", 82],
                ["Placement Contribution", 71],
                ["Collaboration Activity", 86],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-slate-200 p-4">
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="mt-3 flex items-end justify-between">
                    <span className="text-2xl font-bold">{value}%</span>
                    <span className="text-xs text-slate-500">healthy</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <p className="text-sm font-semibold text-slate-300">Attention Required</p>
            <div className="mt-3 text-3xl font-bold">2</div>
            <p className="mt-1 text-sm leading-6 text-slate-300">
              Partner records need institutional follow-up.
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-xl bg-white/10 p-3">
                <div className="text-sm font-semibold">CloudByte Technologies</div>
                <div className="mt-1 text-xs text-slate-300">MoU renewal due</div>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <div className="text-sm font-semibold">FutureWorks Consulting</div>
                <div className="mt-1 text-xs text-slate-300">Onboarding incomplete</div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-lg font-bold">Partner Directory</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search companies and inspect their academic-industry engagement.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search partner, sector..."
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-slate-400 sm:w-64"
                />
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>Software & IT</option>
                  <option>Technology</option>
                  <option>Software Development</option>
                  <option>Cloud & DevOps</option>
                  <option>Design & Media</option>
                  <option>Business & Consulting</option>
                </select>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Review Due</option>
                  <option>Onboarding</option>
                </select>
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filtered.map((partner) => (
              <button
                key={partner.id}
                onClick={() => setSelected(partner)}
                className="block w-full px-5 py-5 text-left transition hover:bg-slate-50"
              >
                <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr_0.9fr_0.9fr] lg:items-center">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold">
                      {partner.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-semibold">{partner.name}</div>
                      <div className="mt-1 text-xs text-slate-500">
                        {partner.sector} · {partner.location}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-400">Engagement</div>
                    <div className="mt-1 text-sm font-semibold">
                      {partner.internships} internships · {partner.placements} placements
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {partner.students} students engaged
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-400">MoU</div>
                    <div className="mt-1 text-sm font-semibold">{partner.mou}</div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                        statusStyles[partner.status] ||
                        "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                    >
                      {partner.status}
                    </span>
                    <div className="mt-2 text-xs text-slate-500">{partner.lastActivity}</div>
                  </div>
                </div>
              </button>
            ))}

            {!filtered.length && (
              <div className="px-6 py-12 text-center">
                <div className="font-semibold">No partners found</div>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or filter.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Recent Collaboration Activity</h3>
            <p className="mt-1 text-sm text-slate-500">Latest industry engagement</p>
            <div className="mt-5 space-y-3">
              {activity.map(([company, action, date]) => (
                <div
                  key={`${company}-${action}`}
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-3"
                >
                  <div>
                    <div className="text-sm font-semibold">{action}</div>
                    <div className="mt-1 text-xs text-slate-500">{company}</div>
                  </div>
                  <div className="whitespace-nowrap text-xs font-medium text-slate-500">{date}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold">Collaboration Opportunities</h3>
            <p className="mt-1 text-sm text-slate-500">
              Potential next actions for the institution
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["Live Projects", "Invite partners to submit real industry problem statements."],
                ["Guest Lectures", "Match experts with high-demand student skill areas."],
                ["FDP / Training", "Plan faculty programs with active industry partners."],
                ["Hiring Drives", "Convert strong internship partners into placement partners."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-slate-200 p-4">
                  <div className="text-sm font-semibold">{title}</div>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{text}</p>
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
                <p className="text-sm font-semibold text-slate-500">Partner Profile</p>
                <h2 className="mt-1 text-2xl font-bold">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.sector} · {selected.location}
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
                ["Industry Contact", selected.contact],
                ["Email", selected.email],
                ["MoU Status", selected.mou],
                ["Partner Status", selected.status],
                ["Internships", selected.internships],
                ["Placements", selected.placements],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-1 font-semibold">{value}</div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="text-sm font-semibold">Collaboration Focus</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {selected.focus.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 p-4">
              <div className="text-sm font-semibold">Latest Activity</div>
              <p className="mt-1 text-sm text-slate-500">{selected.lastActivity}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
                Contact Partner
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View Collaborations
              </button>
              <button className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold">
                View MoU
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
                <h2 className="text-xl font-bold">Add Industry Partner</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Demo form — connect this to FastAPI later.
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
              {["Company Name", "Sector", "Location", "Contact Person", "Email", "MoU Status"].map(
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
                Save Partner
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
