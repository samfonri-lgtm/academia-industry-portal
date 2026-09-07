import { useMemo, useState } from "react";
import { FadeIn, ScaleIn } from "../components/animations";

const PROJECTS = [
  {
    id: 1,
    title: "Inventory Forecasting Dashboard",
    company: "DigitalWorks India",
    status: "Active",
    students: 6,
    skills: ["Python", "Data Analysis", "React"],
    deadline: "30 Oct 2026",
    progress: 65,
  },
  {
    id: 2,
    title: "Campus Placement Analytics Tool",
    company: "NextGen Systems",
    status: "Active",
    students: 4,
    skills: ["SQL", "Power BI", "Data Analysis"],
    deadline: "15 Nov 2026",
    progress: 40,
  },
  {
    id: 3,
    title: "Smart Attendance via Face Recognition",
    company: "CodeCraft Technologies",
    status: "Open for Mentorship",
    students: 0,
    skills: ["Python", "OpenCV", "Machine Learning"],
    deadline: "20 Nov 2026",
    progress: 0,
  },
  {
    id: 4,
    title: "E-commerce Recommendation Engine",
    company: "TechNova Solutions",
    status: "Completed",
    students: 5,
    skills: ["Python", "Machine Learning", "Flask"],
    deadline: "Completed Aug 2026",
    progress: 100,
  },
];

const STATUS_STYLE = {
  Active: "bg-cyan-400/10 text-cyan-300",
  "Open for Mentorship": "bg-amber-400/10 text-amber-300",
  Completed: "bg-emerald-400/10 text-emerald-300",
};

export default function LiveIndustryProjects() {
  const [projects, setProjects] = useState(PROJECTS);
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    if (statusFilter === "All") return projects;
    return projects.filter((p) => p.status === statusFilter);
  }, [projects, statusFilter]);

  function handleMentor(id, title) {
    setProjects((current) =>
      current.map((p) =>
        p.id === id
          ? { ...p, status: "Active", students: p.students || 1 }
          : p
      )
    );
    setToast(`You're now mentoring "${title}".`);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-400">
            Live Industry Projects
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight">
            Mentor students on real industry projects
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track progress on projects you mentor, or pick up a new one
            offered by an industry partner.
          </p>
        </FadeIn>

        {toast && (
          <FadeIn>
            <div className="mt-5 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
              {toast}
            </div>
          </FadeIn>
        )}

        <FadeIn delay={0.05}>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Stat
              icon="🚀"
              value={projects.filter((p) => p.status === "Active").length}
              label="Active Projects"
            />
            <Stat
              icon="👨‍🎓"
              value={projects.reduce((sum, p) => sum + p.students, 0)}
              label="Students Mentored"
            />
            <Stat
              icon="✅"
              value={projects.filter((p) => p.status === "Completed").length}
              label="Completed"
            />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2">
            {["All", "Active", "Open for Mentorship", "Completed"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${
                    statusFilter === status
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-white/5 text-slate-300 ring-1 ring-white/10"
                  }`}
                >
                  {status}
                </button>
              )
            )}
          </div>
        </FadeIn>

        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          {filtered.map((project, index) => (
            <ScaleIn key={project.id} delay={index * 0.04}>
              <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        STATUS_STYLE[project.status] ||
                        "bg-white/5 text-slate-400"
                      }`}
                    >
                      {project.status}
                    </span>
                    <h3 className="mt-3 font-bold">{project.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">
                      {project.company}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs font-semibold text-slate-500">
                    {project.students} student{project.students === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300 ring-1 ring-white/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Progress</span>
                    <span className="font-bold text-slate-200">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full ${
                        project.progress === 100
                          ? "bg-emerald-400"
                          : "bg-cyan-400"
                      }`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-500">
                  📅 {project.deadline}
                </p>

                {project.status === "Open for Mentorship" && (
                  <button
                    onClick={() => handleMentor(project.id, project.title)}
                    className="mt-5 w-full rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                  >
                    Mentor This Project
                  </button>
                )}
              </div>
            </ScaleIn>
          ))}

          {!filtered.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="font-bold">No projects in this category</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-xl">
          {icon}
        </span>
        <span className="text-2xl font-black">{value}</span>
      </div>
      <p className="mt-4 text-sm font-bold text-slate-300">{label}</p>
    </div>
  );
}
