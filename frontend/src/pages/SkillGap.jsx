import { Link } from "react-router-dom";

function SkillGap() {
  const matchedSkills = [
    { name: "Java", level: "Good", score: 85 },
    { name: "SQL", level: "Good", score: 75 },
    { name: "Git & GitHub", level: "Basic", score: 55 },
    { name: "HTML/CSS", level: "Good", score: 70 },
  ];

  const missingSkills = [
    {
      name: "Spring Boot",
      importance: "High",
      reason: "Required by most Java backend internships",
    },
    {
      name: "REST API",
      importance: "High",
      reason: "Essential for backend service development",
    },
    {
      name: "Docker",
      importance: "Medium",
      reason: "Commonly used for application deployment",
    },
    {
      name: "PostgreSQL",
      importance: "Medium",
      reason: "Useful for production-grade backend systems",
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-cyan-600">
          Skill Intelligence
        </p>

        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Skill Gap Analysis
        </h1>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
          Understand what skills you already have and what you need
          to develop for your target career.
        </p>
      </div>

      {/* TARGET ROLE */}
      <section className="rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 p-6 text-white shadow-lg md:p-8">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-100">
              Target Career
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Java Backend Developer
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-cyan-50">
              Your current profile is being compared with the skills
              commonly required for your target role.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                Java
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                Backend
              </span>

              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold">
                Software Development
              </span>
            </div>
          </div>

          <div className="flex h-32 w-32 shrink-0 flex-col items-center justify-center rounded-full border-8 border-white/20 bg-white/10">
            <span className="text-3xl font-bold">72%</span>

            <span className="text-xs text-cyan-100">
              Skill Match
            </span>
          </div>
        </div>
      </section>

      {/* SUMMARY */}
      <section className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon="✅"
          title="Matched Skills"
          value={matchedSkills.length}
          description="Skills already aligned"
        />

        <SummaryCard
          icon="⚠️"
          title="Missing Skills"
          value={missingSkills.length}
          description="Skills to develop"
        />

        <SummaryCard
          icon="🎯"
          title="Career Readiness"
          value="72%"
          description="Current readiness score"
        />
      </section>

      {/* COMPARISON */}
      <div className="grid gap-6 xl:grid-cols-2">
        {/* MATCHED SKILLS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-600">
                YOUR STRENGTHS
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Matched Skills
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Skills that already match your target role.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              {matchedSkills.length} Matched
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {matchedSkills.map((skill) => (
              <MatchedSkill
                key={skill.name}
                name={skill.name}
                level={skill.level}
                score={skill.score}
              />
            ))}
          </div>
        </section>

        {/* MISSING SKILLS */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-orange-600">
                DEVELOPMENT AREAS
              </p>

              <h2 className="mt-1 text-lg font-bold text-slate-900">
                Skill Gaps
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Skills you should develop next.
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-700">
              {missingSkills.length} Missing
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {missingSkills.map((skill) => (
              <MissingSkill
                key={skill.name}
                name={skill.name}
                importance={skill.importance}
                reason={skill.reason}
              />
            ))}
          </div>
        </section>
      </div>

      {/* LEARNING ROADMAP */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <p className="text-sm font-semibold text-cyan-600">
            RECOMMENDED ROADMAP
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Learning Path
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            A suggested order for closing your skill gaps.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <RoadmapStep
            number="01"
            title="Spring Boot"
            description="Build Java backend applications."
            priority="High Priority"
          />

          <RoadmapStep
            number="02"
            title="REST API"
            description="Create and consume backend APIs."
            priority="High Priority"
          />

          <RoadmapStep
            number="03"
            title="PostgreSQL"
            description="Work with production databases."
            priority="Medium"
          />

          <RoadmapStep
            number="04"
            title="Docker"
            description="Containerize and deploy applications."
            priority="Medium"
          />
        </div>
      </section>

      {/* CAREER IMPACT */}
      <section className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500 text-xl text-slate-950">
              🤖
            </div>

            <div>
              <p className="text-sm font-semibold text-cyan-400">
                AI CAREER RECOMMENDATION
              </p>

              <h2 className="mt-1 text-xl font-bold">
                Your Java foundation is a strong starting point.
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Focus first on Spring Boot and REST APIs, then
                strengthen your database and deployment skills.
                Completing these gaps can improve your eligibility
                for backend internships.
              </p>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-xs font-semibold text-slate-500">
              CURRENT MATCH
            </p>

            <p className="mt-1 text-3xl font-extrabold">72%</p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/student/opportunities"
            className="rounded-xl bg-cyan-500 px-5 py-3 text-center font-bold text-slate-950 transition hover:bg-cyan-400"
          >
            Find Matching Opportunities →
          </Link>

          <Link
            to="/student/skills"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
          >
            Update Skills
          </Link>

          <Link
            to="/student/resume"
            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center font-semibold text-white transition hover:bg-white/10"
          >
            Analyze Resume
          </Link>
        </div>
      </section>

      {/* CAREER JOURNEY */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-cyan-600">
            YOUR JOURNEY
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            Skill → Learning → Internship → Placement
          </h2>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <JourneyStep
            number="01"
            title="Assess"
            text="Understand your current skills."
            active
          />

          <JourneyStep
            number="02"
            title="Learn"
            text="Close important skill gaps."
            active
          />

          <JourneyStep
            number="03"
            title="Intern"
            text="Gain practical industry exposure."
          />

          <JourneyStep
            number="04"
            title="Place"
            text="Convert skills into career outcomes."
          />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icon, title, value, description }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-xl">
          {icon}
        </span>

        <span className="text-2xl font-extrabold text-slate-900">
          {value}
        </span>
      </div>

      <p className="mt-5 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function MatchedSkill({ name, level, score }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50/30">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            {name}
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            Proficiency: {level}
          </p>
        </div>

        <span className="font-bold text-emerald-600">
          {score}%
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function MissingSkill({ name, importance, reason }) {
  const isHigh = importance === "High";

  return (
    <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4 transition hover:border-orange-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
              !
            </span>

            <h3 className="font-semibold text-slate-900">
              {name}
            </h3>
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            {reason}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isHigh
              ? "bg-red-100 text-red-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {importance}
        </span>
      </div>
    </div>
  );
}

function RoadmapStep({
  number,
  title,
  description,
  priority,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-cyan-600">
          STEP {number}
        </span>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">
          {priority}
        </span>
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

function JourneyStep({
  number,
  title,
  text,
  active = false,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        active
          ? "border-cyan-200 bg-cyan-50"
          : "border-slate-200 bg-slate-50"
      }`}
    >
      <div
        className={`text-xs font-black ${
          active ? "text-cyan-600" : "text-slate-400"
        }`}
      >
        {number}
      </div>

      <h3 className="mt-3 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {text}
      </p>
    </div>
  );
}

export default SkillGap;