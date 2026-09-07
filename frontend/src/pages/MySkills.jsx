import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

const initialSkills = [
  {
    id: 1,
    name: "Java",
    category: "Programming",
    level: "Advanced",
    score: 88,
    verified: true,
  },
  {
    id: 2,
    name: "JavaScript",
    category: "Programming",
    level: "Intermediate",
    score: 82,
    verified: true,
  },
  {
    id: 3,
    name: "React",
    category: "Web Development",
    level: "Intermediate",
    score: 76,
    verified: false,
  },
  {
    id: 4,
    name: "SQL",
    category: "Database",
    level: "Intermediate",
    score: 71,
    verified: false,
  },
  {
    id: 5,
    name: "Git",
    category: "Tools",
    level: "Intermediate",
    score: 68,
    verified: true,
  },
];

const levelScore = {
  Beginner: 35,
  Intermediate: 65,
  Advanced: 85,
  Expert: 95,
};

const levelStyles = {
  Beginner: "bg-slate-400/10 text-slate-300",
  Intermediate: "bg-cyan-400/10 text-cyan-300",
  Advanced: "bg-violet-400/10 text-violet-300",
  Expert: "bg-emerald-400/10 text-emerald-300",
};

function SkillCard({ skill, onDelete }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-black">{skill.name}</h3>

            {skill.verified && (
              <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                ✓ VERIFIED
              </span>
            )}
          </div>

          <p className="mt-1 text-xs text-slate-500">{skill.category}</p>
        </div>

        <button
          type="button"
          onClick={() => onDelete(skill.id)}
          className="rounded-lg px-2 py-1 text-xs text-slate-600 transition hover:bg-rose-400/10 hover:text-rose-300"
          title="Remove skill"
        >
          Remove
        </button>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            levelStyles[skill.level] || "bg-white/5 text-slate-300"
          }`}
        >
          {skill.level}
        </span>

        <span className="text-sm font-black text-cyan-300">
          {skill.score}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{ width: `${skill.score}%` }}
        />
      </div>
    </div>
  );
}

export default function MySkills() {
  const [skills, setSkills] = useState(initialSkills);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "Programming",
    level: "Beginner",
  });

  const categories = useMemo(() => {
    return ["All", ...new Set(skills.map((skill) => skill.category))];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      const matchesSearch = skill.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || skill.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [skills, search, categoryFilter]);

  const averageScore = skills.length
    ? Math.round(
        skills.reduce((total, skill) => total + skill.score, 0) /
          skills.length
      )
    : 0;

  const verifiedCount = skills.filter((skill) => skill.verified).length;

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleAddSkill(event) {
    event.preventDefault();

    const trimmedName = form.name.trim();

    if (!trimmedName) {
      return;
    }

    const alreadyExists = skills.some(
      (skill) => skill.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (alreadyExists) {
      return;
    }

    const newSkill = {
      id: Date.now(),
      name: trimmedName,
      category: form.category,
      level: form.level,
      score: levelScore[form.level],
      verified: false,
    };

    setSkills((current) => [...current, newSkill]);

    setForm({
      name: "",
      category: "Programming",
      level: "Beginner",
    });

    setShowForm(false);
  }

  function handleDeleteSkill(id) {
    setSkills((current) => current.filter((skill) => skill.id !== id));
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-cyan-400">MY SKILLS</p>

          <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Your Skill Profile
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Manage your skills and proficiency levels. Your skill profile
            helps the platform recommend relevant opportunities.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((current) => !current)}
          className="w-fit rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          {showForm ? "Close Form" : "+ Add Skill"}
        </button>
      </div>

      {/* SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">Total Skills</p>
          <p className="mt-2 text-3xl font-black">{skills.length}</p>
          <p className="mt-2 text-xs text-slate-600">Across all categories</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">Average Score</p>
          <p className="mt-2 text-3xl font-black text-cyan-300">
            {averageScore}%
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Overall proficiency
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">Verified Skills</p>
          <p className="mt-2 text-3xl font-black text-emerald-300">
            {verifiedCount}
          </p>
          <p className="mt-2 text-xs text-slate-600">
            Verified through assessment
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-sm text-slate-400">Opportunity Match</p>
          <p className="mt-2 text-3xl font-black text-violet-300">87%</p>
          <p className="mt-2 text-xs text-slate-600">
            Based on current skills
          </p>
        </div>
      </div>

      {/* ADD SKILL FORM */}
      {showForm && (
        <section className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-6">
          <div className="mb-6">
            <h3 className="text-xl font-black">Add New Skill</h3>
            <p className="mt-1 text-sm text-slate-500">
              Add a skill to your professional profile.
            </p>
          </div>

          <form onSubmit={handleAddSkill}>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Skill Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleFormChange}
                  placeholder="e.g. Python"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                >
                  <option>Programming</option>
                  <option>Web Development</option>
                  <option>Database</option>
                  <option>Data Science</option>
                  <option>AI / ML</option>
                  <option>Cloud</option>
                  <option>Tools</option>
                  <option>Soft Skills</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Proficiency
                </label>

                <select
                  name="level"
                  value={form.level}
                  onChange={handleFormChange}
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Add Skill
              </button>
            </div>
          </form>
        </section>
      )}

      {/* FILTERS */}
      <section>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search skills..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* SKILLS */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black">All Skills</h3>
            <p className="mt-1 text-sm text-slate-500">
              {filteredSkills.length} skill
              {filteredSkills.length === 1 ? "" : "s"} displayed
            </p>
          </div>
        </div>

        {filteredSkills.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onDelete={handleDeleteSkill}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
            <div className="text-4xl">🧠</div>

            <h3 className="mt-4 font-bold">No skills found</h3>

            <p className="mt-2 text-sm text-slate-500">
              Try changing your search or add a new skill.
            </p>
          </div>
        )}
      </section>

      {/* SKILL GAP CTA */}
      <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-bold text-cyan-300">
              WANT BETTER OPPORTUNITIES?
            </p>

            <h3 className="mt-2 text-xl font-black">
              Identify your missing skills
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Compare your current skill profile with industry requirements
              and find the areas that can improve your career opportunities.
            </p>
          </div>

          <Link
            to="/student/skill-gap"
            className="inline-flex w-fit shrink-0 items-center rounded-xl bg-white/5 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-white/10"
          >
            Analyze Skill Gap →
          </Link>
        </div>
      </section>
    </div>
  );
}