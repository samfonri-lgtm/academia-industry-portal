import { useState } from "react";
import { FadeIn } from "../components/animations";

const INITIAL_PROFILE = {
  name: "Dr. Priya Sharma",
  email: "priya.sharma@sirtbhopal.ac.in",
  phone: "+91 98765 43210",
  designation: "Assistant Professor",
  department: "Computer Science & IT",
  institution: "SIRT Bhopal",
  experience: "9",
  qualification: "Ph.D. in Computer Science",
  bio: "Faculty member specializing in artificial intelligence and data-driven systems, with a strong interest in bridging academic research and industry-relevant training programs.",
};

const ALL_EXPERTISE = [
  "Artificial Intelligence",
  "Machine Learning",
  "Data Analysis",
  "Cloud Computing",
  "Research",
  "Teaching",
  "Mentoring",
  "IoT",
  "Cybersecurity",
  "Web Development",
];

const PUBLICATIONS = [
  {
    title: "Deep Learning Approaches for Predictive Maintenance in Industry 4.0",
    venue: "IEEE Access, 2025",
  },
  {
    title: "A Framework for Academia-Industry Skill Alignment",
    venue: "Springer AISC, 2024",
  },
  {
    title: "Federated Learning for Privacy-Preserving Student Analytics",
    venue: "ACM COMPUTE, 2023",
  },
];

export default function FacultyProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [draft, setDraft] = useState(INITIAL_PROFILE);
  const [expertise, setExpertise] = useState([
    "Artificial Intelligence",
    "Research",
    "Teaching",
    "Data Analysis",
    "Mentoring",
  ]);
  const [editing, setEditing] = useState(false);
  const [toast, setToast] = useState("");

  function toggleExpertise(skill) {
    setExpertise((current) =>
      current.includes(skill)
        ? current.filter((s) => s !== skill)
        : [...current, skill]
    );
  }

  function handleChange(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSave() {
    setProfile(draft);
    setEditing(false);
    setToast("Profile updated successfully.");
    setTimeout(() => setToast(""), 3000);
  }

  function handleCancel() {
    setDraft(profile);
    setEditing(false);
  }

  const completion = Math.round(
    ((Object.values(profile).filter(Boolean).length +
      (expertise.length ? 1 : 0)) /
      (Object.values(profile).length + 1)) *
      100
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <FadeIn>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-cyan-400">
                Faculty Profile
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight">
                Your industry-ready profile
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Keep this up to date — institutions and companies use it to
                match you with relevant opportunities.
              </p>
            </div>

            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-300"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </FadeIn>

        {toast && (
          <FadeIn>
            <div className="mt-5 rounded-xl bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-300">
              {toast}
            </div>
          </FadeIn>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <FadeIn delay={0.05}>
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400 text-lg font-black text-slate-950">
                  {profile.name
                    .split(" ")
                    .slice(-2)
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-bold">{profile.name}</p>
                  <p className="text-sm text-slate-400">
                    {profile.designation} · {profile.department}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  value={draft.name}
                  editing={editing}
                  onChange={(v) => handleChange("name", v)}
                />
                <Field
                  label="Email"
                  value={draft.email}
                  editing={editing}
                  onChange={(v) => handleChange("email", v)}
                />
                <Field
                  label="Phone"
                  value={draft.phone}
                  editing={editing}
                  onChange={(v) => handleChange("phone", v)}
                />
                <Field
                  label="Designation"
                  value={draft.designation}
                  editing={editing}
                  onChange={(v) => handleChange("designation", v)}
                />
                <Field
                  label="Department"
                  value={draft.department}
                  editing={editing}
                  onChange={(v) => handleChange("department", v)}
                />
                <Field
                  label="Institution"
                  value={draft.institution}
                  editing={editing}
                  onChange={(v) => handleChange("institution", v)}
                />
                <Field
                  label="Years of Experience"
                  value={draft.experience}
                  editing={editing}
                  onChange={(v) => handleChange("experience", v)}
                />
                <Field
                  label="Highest Qualification"
                  value={draft.qualification}
                  editing={editing}
                  onChange={(v) => handleChange("qualification", v)}
                />
              </div>

              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Bio
                </p>
                {editing ? (
                  <textarea
                    value={draft.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-cyan-400"
                  />
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {profile.bio}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Areas of Expertise
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ALL_EXPERTISE.map((skill) => {
                    const active = expertise.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        disabled={!editing}
                        onClick={() => toggleExpertise(skill)}
                        className={`rounded-full px-3.5 py-2 text-xs font-semibold transition ${
                          active
                            ? "bg-cyan-400 text-slate-950"
                            : "bg-white/5 text-slate-300 ring-1 ring-white/10"
                        } ${editing ? "cursor-pointer" : "cursor-default opacity-90"}`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-300">
                    Profile completion
                  </span>
                  <span className="font-black text-cyan-400">
                    {completion}%
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-cyan-400"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  A complete profile improves your visibility for FDPs,
                  consultancy and research collaboration invites.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
                <p className="text-sm font-bold text-slate-300">
                  Publications
                </p>
                <div className="mt-4 space-y-4">
                  {PUBLICATIONS.map((pub) => (
                    <div
                      key={pub.title}
                      className="border-l-2 border-cyan-400/40 pl-3"
                    >
                      <p className="text-sm font-semibold leading-5">
                        {pub.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {pub.venue}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, editing, onChange }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm outline-none focus:border-cyan-400"
        />
      ) : (
        <p className="mt-2 text-sm font-semibold text-slate-200">{value}</p>
      )}
    </div>
  );
}
