import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const ACTIVITIES = [
  {
    title: "Industry Training",
    icon: "🏭",
    description: "Apply for short-term industry exposure and practical training.",
    count: 12,
    tone: "blue",
  },
  {
    title: "Faculty Development Program",
    icon: "🎓",
    description: "Discover FDPs, workshops and certification opportunities.",
    count: 8,
    tone: "violet",
  },
  {
    title: "Consultancy",
    icon: "💼",
    description: "Connect with organizations for academic and domain expertise.",
    count: 5,
    tone: "emerald",
  },
  {
    title: "Research Collaboration",
    icon: "🔬",
    description: "Find industry problems and collaborative research projects.",
    count: 7,
    tone: "amber",
  },
];

const OPPORTUNITIES = [
  {
    title: "AI in Healthcare — Faculty Workshop",
    organization: "MedTech Innovations",
    type: "Workshop",
    mode: "Online",
    date: "18 Sep 2026",
    skill: "Artificial Intelligence",
  },
  {
    title: "Industry 4.0 Faculty Training",
    organization: "TechNova Solutions",
    type: "Training",
    mode: "Hybrid",
    date: "25 Sep 2026",
    skill: "Industrial Automation",
  },
  {
    title: "Joint Research: Intelligent Education",
    organization: "EduFuture Labs",
    type: "Research",
    mode: "Hybrid",
    date: "30 Sep 2026",
    skill: "Research",
  },
];

const COLLABORATIONS = [
  {
    title: "Live Project Mentorship",
    organization: "CodeCraft Technologies",
    area: "Software Development",
    students: 24,
    status: "Active",
  },
  {
    title: "Guest Lecture Series",
    organization: "NextGen Systems",
    area: "Cloud Computing",
    students: 86,
    status: "Upcoming",
  },
  {
    title: "Industry Problem Statement",
    organization: "DigitalWorks India",
    area: "Data Analytics",
    students: 15,
    status: "Open",
  },
];

function AcademicianDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");

  const filteredOpportunities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return OPPORTUNITIES;

    return OPPORTUNITIES.filter((item) =>
      `${item.title} ${item.organization} ${item.type} ${item.skill}`
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
              AC
            </div>
            <div>
              <p className="font-bold">AcademiaConnect</p>
              <p className="text-xs text-slate-400">Academician Portal</p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-semibold text-slate-500 md:flex">
            {["Overview", "Opportunities", "Collaborations", "Profile"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`transition ${
                    activeTab === tab
                      ? "text-blue-600"
                      : "hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold">Dr. Priya Sharma</p>
              <p className="text-xs text-slate-400">Computer Science</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              PS
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl md:p-9">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-blue-300">
                ACADEMIA ↔ INDUSTRY
              </span>
              <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight md:text-4xl">
                Connect academic expertise with real industry opportunities.
              </h1>
              <p className="mt-3 max-w-2xl leading-7 text-slate-400">
                Discover faculty training, consultancy, research projects,
                guest lectures and student-industry collaborations from one
                portal.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:w-72">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Collaboration Score
              </p>
              <p className="mt-2 text-4xl font-extrabold">84%</p>
              <div className="mt-4 h-2 rounded-full bg-white/10">
                <div className="h-2 w-[84%] rounded-full bg-blue-500" />
              </div>
              <p className="mt-3 text-xs text-slate-400">
                Strong alignment with current industry demand.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon="🤝" value="18" label="Industry Connections" />
          <Stat icon="🎓" value="7" label="Active Programs" />
          <Stat icon="🔬" value="4" label="Research Projects" />
          <Stat icon="👨‍🎓" value="125" label="Students Mentored" />
        </section>

        <section className="mt-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Faculty Opportunities
              </p>
              <h2 className="mt-2 text-2xl font-extrabold">
                Grow through industry exposure
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Opportunities are organized around skills, expertise and
                collaboration type.
              </p>
            </div>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search opportunities..."
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 md:max-w-sm"
            />
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {ACTIVITIES.map((item) => (
              <ActivityCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[1.25fr_.75fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                  Recommended
                </p>
                <h2 className="mt-2 text-xl font-extrabold">
                  Opportunities matching your profile
                </h2>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                Skill-based
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {filteredOpportunities.map((item) => (
                <OpportunityCard key={item.title} {...item} />
              ))}

              {!filteredOpportunities.length && (
                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                  <p className="font-bold">No opportunities found</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Try another search term.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
              Faculty Profile
            </p>
            <h2 className="mt-2 text-xl font-extrabold">
              Your industry-ready profile
            </h2>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 font-bold text-white">
                PS
              </div>
              <div>
                <p className="font-bold">Dr. Priya Sharma</p>
                <p className="text-sm text-slate-500">
                  Assistant Professor · CSIT
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">
                  Profile completion
                </span>
                <span className="font-extrabold text-blue-600">82%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-200">
                <div className="h-2 w-[82%] rounded-full bg-blue-600" />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Artificial Intelligence",
                "Research",
                "Teaching",
                "Data Analysis",
                "Mentoring",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-600 ring-1 ring-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button
              onClick={() => setActiveTab("Profile")}
              className="mt-7 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Complete Faculty Profile →
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-600">
                Collaboration Hub
              </p>
              <h2 className="mt-2 text-2xl font-extrabold">
                Turn industry connections into student opportunities
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track live projects, guest lectures and industry problem
                statements involving your students.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("Collaborations")}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Explore Collaborations
            </button>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {COLLABORATIONS.map((item) => (
              <CollaborationCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl bg-blue-600 p-7 text-white shadow-xl md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-100">
                Academia–Industry Bridge
              </p>
              <h2 className="mt-2 text-2xl font-extrabold">
                Have an industry problem your students can solve?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100">
                Create a collaboration request and connect students with a
                real-world project, mentorship opportunity or innovation
                challenge.
              </p>
            </div>
            <button
              onClick={() => setActiveTab("Collaborations")}
              className="rounded-xl bg-white px-5 py-3.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
            >
              Start Collaboration →
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-xl">
          {icon}
        </span>
        <span className="text-2xl font-extrabold">{value}</span>
      </div>
      <p className="mt-4 text-sm font-bold">{label}</p>
    </div>
  );
}

function ActivityCard({ title, icon, description, count }) {
  return (
    <button
      type="button"
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-xl">
          {icon}
        </span>
        <span className="text-xs font-bold text-slate-400">{count} open</span>
      </div>
      <h3 className="mt-5 font-bold group-hover:text-blue-600">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </button>
  );
}

function OpportunityCard({
  title,
  organization,
  type,
  mode,
  date,
  skill,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
              {type}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
              {mode}
            </span>
          </div>
          <h3 className="mt-3 font-bold">{title}</h3>
          <p className="mt-1 text-sm text-slate-500">{organization}</p>
        </div>
        <button
          type="button"
          className="self-start rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
        >
          View
        </button>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span className="rounded-lg bg-slate-50 px-3 py-2">📅 {date}</span>
        <span className="rounded-lg bg-slate-50 px-3 py-2">
          🧩 {skill}
        </span>
      </div>
    </div>
  );
}

function CollaborationCard({
  title,
  organization,
  area,
  students,
  status,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
          {status}
        </span>
        <span className="text-xs text-slate-400">{students} students</span>
      </div>
      <h3 className="mt-5 font-bold">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{organization}</p>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs font-semibold text-slate-600">
        Focus: {area}
      </div>
    </div>
  );
}

export default AcademicianDashboard;
