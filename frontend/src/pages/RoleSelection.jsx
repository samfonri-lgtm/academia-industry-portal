import { useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { FadeIn, ScaleIn } from "../components/animations";

const roles = [
  {
    id: "student",
    title: "Student",
    description:
      "Build your skill profile, discover opportunities, improve your resume and track applications.",
    icon: "🎓",
    features: [
      "Skill Profile",
      "AI Resume",
      "Skill Gap Analysis",
      "Internships & Jobs",
    ],
    path: "/student/dashboard",
  },
  {
    id: "academician",
    title: "Academician",
    description:
      "Connect with industry, manage training, research, consultancy and collaboration opportunities.",
    icon: "👨‍🏫",
    features: [
      "Industry Collaboration",
      "Training & FDP",
      "Research",
      "Consultancy",
    ],
    path: "/academician/dashboard",
  },
  {
    id: "company",
    title: "Industry",
    description:
      "Create opportunities, define skill requirements and discover suitable candidates.",
    icon: "🏢",
    features: [
      "Company Profile",
      "Create Opportunities",
      "Candidate Matching",
      "Skill Requirements",
    ],
    path: "/company/dashboard",
  },
  {
    id: "institution",
    title: "Institution",
    description:
      "Monitor students, skills, training, internships, placements and industry partnerships.",
    icon: "🏛️",
    features: [
      "Student Analytics",
      "Skill Analytics",
      "Internships",
      "Placement Reports",
    ],
    path: "/institution/dashboard",
  },
];

export default function RoleSelection() {
  const navigate = useNavigate();
  const { session } = useAuth();

  function handleRoleSelect(role) {
    // Already signed in with this role: go straight to the workspace.
    if (session?.role === role.id) {
      navigate(role.path);
      return;
    }

    // Otherwise sign in (or switch account) with the role preselected.
    navigate("/login", { state: { role: role.id, from: role.path } });
  }

  return (
    <div className="min-h-screen bg-slate-950 px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <FadeIn>
          <div className="mb-10 flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="text-xl font-black tracking-tight"
            >
              Academia
              <span className="text-cyan-400">Connect</span>
            </button>

            <button
              onClick={() => navigate("/login")}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
            >
              Login
            </button>
          </div>
        </FadeIn>

        {/* Heading */}
        <FadeIn delay={0.05}>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
              AcademiaConnect
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Choose your
              <span className="text-cyan-400"> workspace</span>
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-400 sm:text-lg">
              Select your role to enter the platform and access the tools
              designed for your workflow.
            </p>
          </div>
        </FadeIn>

        {/* Role Cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {roles.map((role, index) => (
            <ScaleIn key={role.id} delay={0.1 + index * 0.06}>
              <button
                onClick={() => handleRoleSelect(role)}
                className="group flex h-full w-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:shadow-2xl"
              >
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-3xl transition group-hover:border-cyan-400/20 group-hover:bg-cyan-400/10">
                  {role.icon}
                </div>

                {/* Title */}
                <h2 className="mt-6 text-xl font-black">
                  {role.title}
                </h2>

                {/* Description */}
                <p className="mt-3 min-h-[84px] text-sm leading-6 text-slate-400">
                  {role.description}
                </p>

                {/* Features */}
                <div className="mt-5 space-y-2">
                  {role.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-xs font-medium text-slate-300"
                    >
                      <span className="text-cyan-400">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-bold text-cyan-400">
                    Enter Workspace
                  </span>

                  <span className="text-lg text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-400">
                    →
                  </span>
                </div>
              </button>
            </ScaleIn>
          ))}
        </div>

        {/* Bottom note */}
        <FadeIn delay={0.4}>
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center">
            <p className="text-sm text-slate-500">
              Select your role to sign in to the matching workspace. You can
              switch roles later by signing out and choosing another workspace.
            </p>
          </div>
        </FadeIn>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-slate-600">
          AcademiaConnect • SIH 2026 Prototype
        </div>
      </div>
    </div>
  );
}