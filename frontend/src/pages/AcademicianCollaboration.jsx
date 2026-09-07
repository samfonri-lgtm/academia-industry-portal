import { useState } from "react";
import { FadeIn } from "../components/animations";

const COLLABORATIONS = [
  {
    id: 1,
    title: "Industry Mentorship Program",
    organization: "Tech Industry Network",
    type: "Mentorship",
    status: "Active",
    participants: 24,
    date: "12 Sep 2026",
  },
  {
    id: 2,
    title: "Student Innovation Lab",
    organization: "AcademiaConnect",
    type: "Project",
    status: "Active",
    participants: 18,
    date: "20 Sep 2026",
  },
  {
    id: 3,
    title: "AI & Emerging Technology Workshop",
    organization: "Industry Partners",
    type: "Workshop",
    status: "Upcoming",
    participants: 42,
    date: "28 Sep 2026",
  },
];

export default function AcademicianCollaboration() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? COLLABORATIONS
      : COLLABORATIONS.filter(
          (item) => item.status.toLowerCase() === activeTab
        );

  return (
    <div className="space-y-8">
      <FadeIn>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-cyan-400">
            Collaboration
          </p>

          <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
            Academic Collaboration
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Manage mentorships, projects, workshops and collaboration
            opportunities across the academic and industry ecosystem.
          </p>
        </div>
      </FadeIn>

      <FadeIn>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Active Collaborations"
            value="2"
            icon="🤝"
          />

          <StatCard
            label="Total Participants"
            value="84"
            icon="👥"
          />

          <StatCard
            label="Upcoming Programs"
            value="1"
            icon="📅"
          />
        </div>
      </FadeIn>

      <FadeIn>
        <div className="flex flex-wrap gap-2">
          {["all", "active", "upcoming"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2 text-sm font-bold capitalize transition ${
                activeTab === tab
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </FadeIn>

      <div className="space-y-4">
        {filtered.map((item) => (
          <FadeIn key={item.id}>
            <CollaborationCard item={item} />
          </FadeIn>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <div className="text-4xl">📭</div>

            <h3 className="mt-4 font-bold text-white">
              No collaborations found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There are no collaborations in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-white">{value}</p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function CollaborationCard({ item }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-cyan-400/20 hover:bg-white/[0.06]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
            {item.type === "Mentorship"
              ? "🎓"
              : item.type === "Project"
              ? "💡"
              : "🧑‍🏫"}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-bold text-white">{item.title}</h2>

              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                  item.status === "Active"
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-amber-400/10 text-amber-300"
                }`}
              >
                {item.status}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {item.organization}
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>📌 {item.type}</span>
              <span>👥 {item.participants} participants</span>
              <span>📅 {item.date}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="rounded-xl border border-white/10 px-4 py-2.5 text-sm font-bold text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
        >
          View Details →
        </button>
      </div>
    </div>
  );
}