import { useMemo, useState } from "react";
import { FadeIn, ScaleIn } from "../components/animations";

const PROGRAMS = [
  {
    id: 1,
    title: "AI in Healthcare — Faculty Workshop",
    organizer: "MedTech Innovations",
    type: "Workshop",
    mode: "Online",
    duration: "3 Days",
    date: "18 Sep 2026",
    seats: 60,
    registered: 41,
    skills: ["Artificial Intelligence", "Healthcare Analytics"],
    certification: true,
  },
  {
    id: 2,
    title: "Industry 4.0 Faculty Development Program",
    organizer: "TechNova Solutions",
    type: "FDP",
    mode: "Hybrid",
    duration: "1 Week",
    date: "25 Sep 2026",
    seats: 45,
    registered: 45,
    skills: ["Industrial Automation", "IoT"],
    certification: true,
  },
  {
    id: 3,
    title: "Modern Pedagogy & Curriculum Design",
    organizer: "National Teaching Council",
    type: "FDP",
    mode: "Offline",
    duration: "5 Days",
    date: "02 Oct 2026",
    seats: 80,
    registered: 52,
    skills: ["Curriculum Design", "Teaching"],
    certification: true,
  },
  {
    id: 4,
    title: "Cloud Computing for Educators",
    organizer: "CloudByte Technologies",
    type: "Workshop",
    mode: "Online",
    duration: "2 Days",
    date: "10 Oct 2026",
    seats: 100,
    registered: 63,
    skills: ["Cloud Computing", "AWS"],
    certification: false,
  },
];

const MY_REGISTRATIONS = [
  { title: "Data Analytics Bootcamp for Faculty", status: "Completed", date: "Aug 2026" },
  { title: "UI/UX Fundamentals Workshop", status: "In Progress", date: "Sep 2026" },
];

export default function FDPWorkshops() {
  const [registered, setRegistered] = useState(new Set());
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [toast, setToast] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return PROGRAMS.filter((program) => {
      const matchesSearch =
        !query ||
        `${program.title} ${program.organizer} ${program.skills.join(" ")}`
          .toLowerCase()
          .includes(query);
      const matchesType = typeFilter === "All" || program.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [search, typeFilter]);

  function handleRegister(id, title) {
    setRegistered((current) => new Set(current).add(id));
    setToast(`Registered for "${title}".`);
    setTimeout(() => setToast(""), 3000);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <FadeIn>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-400">
            FDP & Workshops
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-tight">
            Faculty development programs & workshops
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Discover certification-backed programs run with industry partners
            to keep your skills current.
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
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programs, organizers, skills..."
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-cyan-400 sm:max-w-sm"
            />
            <div className="flex flex-wrap gap-2">
              {["All", "FDP", "Workshop"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${
                    typeFilter === type
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-white/5 text-slate-300 ring-1 ring-white/10"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold text-slate-500 sm:ml-auto">
              {filtered.length} program{filtered.length === 1 ? "" : "s"}
            </span>
          </div>
        </FadeIn>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          {filtered.map((program, index) => {
            const isFull = program.registered >= program.seats;
            const isRegistered = registered.has(program.id);

            return (
              <ScaleIn key={program.id} delay={index * 0.04}>
                <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold text-cyan-300">
                      {program.type}
                    </span>
                    <span className="rounded-full bg-white/5 px-2.5 py-1 text-[10px] font-bold text-slate-400">
                      {program.mode}
                    </span>
                    {program.certification && (
                      <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300">
                        Certificate
                      </span>
                    )}
                  </div>

                  <h3 className="mt-4 font-bold">{program.title}</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {program.organizer}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {program.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-slate-300 ring-1 ring-white/10"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-400">
                    <span className="rounded-lg bg-white/5 px-3 py-2">
                      📅 {program.date}
                    </span>
                    <span className="rounded-lg bg-white/5 px-3 py-2">
                      ⏱ {program.duration}
                    </span>
                    <span className="rounded-lg bg-white/5 px-3 py-2">
                      👥 {program.registered}/{program.seats}
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full bg-cyan-400"
                      style={{
                        width: `${Math.min(
                          100,
                          (program.registered / program.seats) * 100
                        )}%`,
                      }}
                    />
                  </div>

                  <button
                    onClick={() => handleRegister(program.id, program.title)}
                    disabled={isFull || isRegistered}
                    className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold transition ${
                      isRegistered
                        ? "bg-emerald-400/10 text-emerald-300"
                        : isFull
                        ? "cursor-not-allowed bg-white/5 text-slate-500"
                        : "bg-cyan-400 text-slate-950 hover:bg-cyan-300"
                    }`}
                  >
                    {isRegistered
                      ? "✓ Registered"
                      : isFull
                      ? "Registration Full"
                      : "Register Now"}
                  </button>
                </div>
              </ScaleIn>
            );
          })}

          {!filtered.length && (
            <div className="col-span-full rounded-2xl border border-dashed border-white/10 p-10 text-center">
              <p className="font-bold">No programs found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try a different search term or filter.
              </p>
            </div>
          )}
        </div>

        <FadeIn delay={0.1}>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
            <p className="text-sm font-bold uppercase tracking-wider text-cyan-400">
              My Registrations
            </p>
            <div className="mt-4 space-y-3">
              {MY_REGISTRATIONS.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.date}</p>
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
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
