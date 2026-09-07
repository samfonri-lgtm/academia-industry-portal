import { useMemo, useState } from "react";
import { FadeIn, ScaleIn } from "../components/animations";

const PROJECTS = [
  {
    id: 1,
    title: "Joint Research: Intelligent Tutoring Systems",
    partner: "EduFuture Labs",
    area: "AI in Education",
    stage: "Proposal Stage",
    duration: "12 Months",
    funding: "₹8,00,000",
    collaborators: 3,
    description:
      "Building an adaptive tutoring system that personalizes learning paths using student performance data.",
  },
  {
    id: 2,
    title: "Federated Learning for Healthcare Diagnostics",
    partner: "MedTech Innovations",
    area: "Machine Learning",
    stage: "Active",
    duration: "18 Months",
    funding: "₹15,00,000",
    collaborators: 5,
    description:
      "Privacy-preserving diagnostic model training across multiple hospital datasets without centralizing patient data.",
  },
  {
    id: 3,
    title: "Smart Grid Optimization using Reinforcement Learning",
    partner: "PowerGrid Analytics",
    area: "Energy Systems",
    stage: "Proposal Stage",
    duration: "10 Months",
    funding: "₹6,50,000",
    collaborators: 2,
    description:
      "Applying reinforcement learning techniques to optimize load balancing in regional smart grids.",
  },
];

const MY_PUBLICATIONS_PIPELINE = [
  { title: "Federated Learning for Privacy-Preserving Diagnostics", stage: "Under Review", venue: "IEEE TNSM" },
  { title: "Adaptive Learning Path Generation via RL", stage: "Draft", venue: "Springer AISC" },
];

export default function ResearchCollaboration() {
  const [interested, setInterested] = useState(new Set());
  const [stageFilter, setStageFilter] = useState("All");
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    if (stageFilter === "All") return PROJECTS;
    return PROJECTS.filter((p) => p.stage === stageFilter);
  }, [stageFilter]);

  function handleInterest(id, title) {
    setInterested((current) => new Set(current).add(id));
    setToast(`Collaboration request sent for "${title}".`);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-400">
            Research Collaboration
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight">
            Industry-funded research projects
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Partner with companies on applied research problems and secure
            funding for your lab.
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
            <Stat icon="🔬" value={PROJECTS.length} label="Open Projects" />
            <Stat
              icon="⚡"
              value={PROJECTS.filter((p) => p.stage === "Active").length}
              label="Active Collaborations"
            />
            <Stat icon="📄" value="2" label="Papers in Pipeline" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold">Available Projects</h2>
            <div className="flex flex-wrap gap-2">
              {["All", "Proposal Stage", "Active"].map((stage) => (
                <button
                  key={stage}
                  onClick={() => setStageFilter(stage)}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${
                    stageFilter === stage
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-white/5 text-slate-300 ring-1 ring-white/10"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <div className="mt-5 space-y-4">
          {filtered.map((project, index) => {
            const isInterested = interested.has(project.id);
            return (
              <ScaleIn key={project.id} delay={index * 0.04}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                          {project.area}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            project.stage === "Active"
                              ? "bg-emerald-400/10 text-emerald-300"
                              : "bg-white/5 text-slate-400"
                          }`}
                        >
                          {project.stage}
                        </span>
                      </div>
                      <h3 className="mt-3 font-bold">{project.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {project.partner}
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                        {project.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
                        <span className="rounded-lg bg-white/5 px-3 py-2">
                          ⏱ {project.duration}
                        </span>
                        <span className="rounded-lg bg-white/5 px-3 py-2">
                          👥 {project.collaborators} collaborators
                        </span>
                        <span className="rounded-lg bg-white/5 px-3 py-2">
                          💰 {project.funding}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInterest(project.id, project.title)}
                      disabled={isInterested}
                      className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                        isInterested
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                      }`}
                    >
                      {isInterested ? "✓ Request Sent" : "Request to Join"}
                    </button>
                  </div>
                </div>
              </ScaleIn>
            );
          })}

          {!filtered.length && (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="font-bold">No projects in this stage</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different filter.
              </p>
            </div>
          )}
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-cyan-400">
              Publication Pipeline
            </p>
            <div className="mt-4 space-y-3">
              {MY_PUBLICATIONS_PIPELINE.map((pub) => (
                <div
                  key={pub.title}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{pub.title}</p>
                    <p className="text-xs text-slate-500">{pub.venue}</p>
                  </div>
                  <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-[10px] font-bold text-amber-300">
                    {pub.stage}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
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
