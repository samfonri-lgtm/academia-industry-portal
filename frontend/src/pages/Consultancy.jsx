import { useMemo, useState } from "react";
import { FadeIn, ScaleIn } from "../components/animations";

const OPEN_REQUESTS = [
  {
    id: 1,
    title: "Predictive Maintenance Model Review",
    organization: "TechNova Solutions",
    domain: "Machine Learning",
    engagement: "Advisory · 4 weeks",
    compensation: "₹40,000",
    description:
      "Review and improve an existing predictive maintenance ML pipeline used on factory sensor data.",
  },
  {
    id: 2,
    title: "Curriculum Alignment for Cloud Certification",
    organization: "CloudByte Technologies",
    domain: "Cloud Computing",
    engagement: "Consulting · 2 weeks",
    compensation: "₹18,000",
    description:
      "Help align an internal training curriculum with current industry cloud certification standards.",
  },
  {
    id: 3,
    title: "Data Privacy Audit for Student Analytics Platform",
    organization: "EduFuture Labs",
    domain: "Data Privacy",
    engagement: "Advisory · 3 weeks",
    compensation: "₹25,000",
    description:
      "Independent audit of data handling practices in a student analytics dashboard.",
  },
];

const MY_ENGAGEMENTS = [
  {
    title: "AI Ethics Advisory Panel",
    organization: "NextGen Systems",
    status: "Active",
    progress: 60,
  },
  {
    title: "Statistical Modeling Review",
    organization: "InsightWorks",
    status: "Completed",
    progress: 100,
  },
];

export default function Consultancy() {
  const [applied, setApplied] = useState(new Set());
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return OPEN_REQUESTS;
    return OPEN_REQUESTS.filter((r) =>
      `${r.title} ${r.organization} ${r.domain}`
        .toLowerCase()
        .includes(query)
    );
  }, [search]);

  function handleApply(id, title) {
    setApplied((current) => new Set(current).add(id));
    setToast(`Expressed interest in "${title}".`);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-400">
            Consultancy
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight">
            Share your expertise with industry partners
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Paid advisory and consulting engagements matched to your area of
            expertise.
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
            <Stat icon="💼" value={OPEN_REQUESTS.length} label="Open Requests" />
            <Stat icon="🤝" value="1" label="Active Engagement" />
            <Stat icon="💰" value="₹65K" label="Earned This Year" />
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-8 flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold">Open Consultancy Requests</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by domain or organization..."
              className="w-full max-w-xs rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
            />
          </div>
        </FadeIn>

        <div className="mt-5 space-y-4">
          {filtered.map((request, index) => {
            const isApplied = applied.has(request.id);
            return (
              <ScaleIn key={request.id} delay={index * 0.04}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold text-cyan-300">
                          {request.domain}
                        </span>
                        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                          {request.engagement}
                        </span>
                      </div>
                      <h3 className="mt-3 font-bold">{request.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">
                        {request.organization}
                      </p>
                      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                        {request.description}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 sm:items-end">
                      <span className="text-lg font-black text-emerald-300">
                        {request.compensation}
                      </span>
                      <button
                        onClick={() => handleApply(request.id, request.title)}
                        disabled={isApplied}
                        className={`rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                          isApplied
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                        }`}
                      >
                        {isApplied ? "✓ Interest Sent" : "Express Interest"}
                      </button>
                    </div>
                  </div>
                </div>
              </ScaleIn>
            );
          })}

          {!filtered.length && (
            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="font-bold">No requests found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search term.
              </p>
            </div>
          )}
        </div>

        <FadeIn delay={0.15}>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-cyan-400">
              My Engagements
            </p>
            <div className="mt-4 space-y-4">
              {MY_ENGAGEMENTS.map((item) => (
                <div key={item.title} className="rounded-xl bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-slate-500">
                        {item.organization}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        item.status === "Completed"
                          ? "bg-emerald-400/10 text-emerald-300"
                          : "bg-amber-400/10 text-amber-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-cyan-400"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
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
