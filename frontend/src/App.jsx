import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RoleSelection from "./pages/RoleSelection";

import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import StudentSkills from "./pages/StudentSkills";
import StudentResume from "./pages/StudentResume";
import StudentSkillGap from "./pages/StudentSkillGap";
import StudentOpportunities from "./pages/StudentOpportunities";
import StudentApplications from "./pages/StudentApplications";

import CompanyDashboard from "./pages/CompanyDashboard";
import CompanyProfile from "./pages/CompanyProfile";
import CompanyOpportunities from "./pages/CompanyOpportunities";
import CompanyApplications from "./pages/CompanyApplications";
import CompanySettings from "./pages/CompanySettings";
import CreateOpportunity from "./pages/CreateOpportunity";

import AcademicianDashboard from "./pages/AcademicianDashboard";
import AcademicianTraining from "./pages/AcademicianTraining";
import AcademicianCollaboration from "./pages/AcademicianCollaboration";

import InstitutionDashboard from "./pages/InstitutionDashboard";
import InstitutionStudents from "./pages/InstitutionStudents";
import InstitutionReports from "./pages/InstitutionReports";
import InstitutionSkillAnalytics from "./pages/InstitutionSkillAnalytics";
import InstitutionTraining from "./pages/InstitutionTraining";
import InstitutionInternships from "./pages/InstitutionInternships";
import InstitutionPlacements from "./pages/InstitutionPlacements";
import InstitutionPartners from "./pages/InstitutionPartners";

import AdminDashboard from "./pages/AdminDashboard";
import CandidateMatching from "./pages/CandidateMatching";
import FacultyProfile from "./pages/FacultyProfile";
import FDPWorkshops from "./pages/FDPWorkshops";
import Consultancy from "./pages/Consultancy";
import ResearchCollaboration from "./pages/ResearchCollaboration";
import LiveIndustryProjects from "./pages/LiveIndustryProjects";
import PlaceholderPage from "./pages/PlaceholderPage";

import PortalLayout from "./components/PortalLayout";
import RequireRole from "./components/RequireRole";
import { AuthProvider } from "./components/AuthContext";

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="text-xl font-black tracking-tight">
            Academia<span className="text-cyan-400">Connect</span>
          </Link>

          <div className="hidden gap-7 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">
              Features
            </a>

            <a href="#workflow" className="transition hover:text-white">
              Workflow
            </a>

            <a href="#roles" className="transition hover:text-white">
              Stakeholders
            </a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/login"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/5"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-5 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
              SIH 2026 • Skill-first ecosystem
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-tight md:text-6xl">
              Connect skills with
              <span className="text-cyan-400">
                {" "}
                real opportunities.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              A unified platform connecting students, academicians,
              institutions and industries across skill assessment, training,
              internships, projects and placement.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/select-role"
                className="rounded-2xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
              >
                Explore Platform →
              </Link>

              <Link
                to="/register"
                className="rounded-2xl border border-white/15 px-6 py-3 font-semibold text-white transition hover:bg-white/5"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <LandingStat value="4" label="Stakeholders" />
              <LandingStat value="360°" label="Skill Journey" />
              <LandingStat value="1" label="Unified Platform" />
            </div>
          </div>

          {/* Platform Preview */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
            <div className="rounded-2xl bg-slate-900 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Platform Overview
                  </p>

                  <h3 className="mt-1 text-xl font-bold">
                    Skill Ecosystem
                  </h3>
                </div>

                <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Live Demo
                </span>
              </div>

              <div className="mt-6 space-y-3">
                <MiniStat
                  title="Student Skill Profile"
                  value="87%"
                />

                <MiniStat
                  title="Industry Opportunities"
                  value="24"
                />

                <MiniStat
                  title="Faculty Collaborations"
                  value="12"
                />

                <MiniStat
                  title="Institution Progress"
                  value="76%"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="border-y border-white/10 bg-white/[0.02]"
        >
          <div className="mx-auto max-w-7xl px-6 py-16">
            <div className="max-w-2xl">
              <p className="font-semibold text-cyan-400">
                WHY ACADEMIACONNECT
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                One ecosystem instead of disconnected portals.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                icon="🧠"
                title="Skill Intelligence"
                text="Build structured profiles, assess proficiency and identify skill gaps."
              />

              <FeatureCard
                icon="🎯"
                title="Smart Matching"
                text="Match actual skills and proficiency with relevant opportunities."
              />

              <FeatureCard
                icon="🤝"
                title="Academicians"
                text="Training, FDPs, mentorship, consultancy and research."
              />

              <RoleCard
                icon="🏢"
                title="Industries"
                text="Opportunities, skill requirements and candidate discovery."
              />

              <RoleCard
                icon="🏫"
                title="Institutions"
                text="Dashboards for skill, internship and placement outcomes."
              />
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="workflow" className="mx-auto max-w-7xl px-6 py-20">
          <div className="max-w-2xl">
            <p className="font-semibold text-cyan-400">
              PLATFORM WORKFLOW
            </p>

            <h2 className="mt-2 text-3xl font-black md:text-4xl">
              From skills to opportunities.
            </h2>

            <p className="mt-4 text-slate-400">
              AcademiaConnect connects the complete academic-to-industry
              journey through a single platform.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <FlowCard
              n="01"
              title="Build Profile"
              text="Students create structured academic and skill profiles."
            />

            <FlowCard
              n="02"
              title="Assess Skills"
              text="Skills and proficiency levels are captured and analyzed."
            />

            <FlowCard
              n="03"
              title="Find Opportunities"
              text="Students discover relevant internships, projects and jobs."
            />

            <FlowCard
              n="04"
              title="Track Outcomes"
              text="Institutions monitor training, internships and placement outcomes."
            />
          </div>
        </section>

        {/* Stakeholders */}
        <section
          id="roles"
          className="border-y border-white/10 bg-white/[0.02]"
        >
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="text-center">
              <p className="font-semibold text-cyan-400">
                FOUR STAKEHOLDERS
              </p>

              <h2 className="mt-2 text-3xl font-black md:text-4xl">
                One connected ecosystem.
              </h2>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <StakeholderCard
                icon="🎓"
                title="Students"
                text="Skills, resume, opportunities, applications and career growth."
              />

              <StakeholderCard
                icon="👨‍🏫"
                title="Academicians"
                text="Training, research, consultancy, mentorship and collaboration."
              />

              <StakeholderCard
                icon="🏢"
                title="Industries"
                text="Talent discovery, opportunities, projects and hiring."
              />

              <StakeholderCard
                icon="🏫"
                title="Institutions"
                text="Skill analytics, internships, training and placement monitoring."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-6 py-20 text-center">
          <h2 className="text-4xl font-black">
            Build the bridge between academia and industry.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            A demo-ready foundation for the SIH 2026 problem statement.
          </p>

          <Link
            to="/select-role"
            className="mt-8 inline-block rounded-2xl bg-cyan-400 px-7 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Enter Platform →
          </Link>
        </section>
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-slate-500">
        AcademiaConnect • SIH 2026 Prototype
      </footer>
    </div>
  );
}

function LandingStat({ value, label }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-2xl font-black">{value}</div>

      <div className="mt-1 text-xs text-slate-400">
        {label}
      </div>
    </div>
  );
}

function MiniStat({ title, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] p-4">
      <span className="text-sm text-slate-300">
        {title}
      </span>

      <span className="font-bold text-cyan-300">
        {value}
      </span>
    </div>
  );
}

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function FlowCard({ n, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="text-xs font-bold text-cyan-400">
        {n}
      </div>

      <h3 className="mt-3 font-bold">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-400">
        {text}
      </p>
    </div>
  );
}

function RoleCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950 p-6">
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function StakeholderCard({ icon, title, text }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 text-center transition hover:-translate-y-1 hover:border-cyan-400/30">
      <div className="text-4xl">{icon}</div>

      <h3 className="mt-4 text-lg font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function Protected({ role, children }) {
  return (
    <RequireRole allowedRole={role}>
      <PortalLayout>{children}</PortalLayout>
    </RequireRole>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/select-role" element={<RoleSelection />} />

      {/* ================= STUDENT ================= */}

      <Route
        path="/student/dashboard"
        element={
          <Protected role="student">
            <StudentDashboard />
          </Protected>
        }
      />

      <Route
        path="/student/profile"
        element={
          <Protected role="student">
            <StudentProfile />
          </Protected>
        }
      />

      <Route
        path="/student/skills"
        element={
          <Protected role="student">
            <StudentSkills />
          </Protected>
        }
      />

      <Route
        path="/student/resume"
        element={
          <Protected role="student">
            <StudentResume />
          </Protected>
        }
      />

      <Route
        path="/student/skill-gap"
        element={
          <Protected role="student">
            <StudentSkillGap />
          </Protected>
        }
      />

      <Route
        path="/student/opportunities"
        element={
          <Protected role="student">
            <StudentOpportunities />
          </Protected>
        }
      />

      <Route
        path="/student/applications"
        element={
          <Protected role="student">
            <StudentApplications />
          </Protected>
        }
      />

      {/* ================= COMPANY / INDUSTRY ================= */}

      <Route
        path="/company/dashboard"
        element={
          <Protected role="company">
            <CompanyDashboard />
          </Protected>
        }
      />

      <Route
        path="/company/profile"
        element={
          <Protected role="company">
            <CompanyProfile />
          </Protected>
        }
      />

      <Route
        path="/company/opportunities"
        element={
          <Protected role="company">
            <CompanyOpportunities />
          </Protected>
        }
      />

      <Route
        path="/company/opportunities/create"
        element={
          <Protected role="company">
            <CreateOpportunity />
          </Protected>
        }
      />

      <Route
        path="/company/opportunities/:id/candidates"
        element={
          <Protected role="company">
            <CandidateMatching />
          </Protected>
        }
      />

      <Route
        path="/company/applications"
        element={
          <Protected role="company">
            <CompanyApplications />
          </Protected>
        }
      />

      <Route
        path="/company/settings"
        element={
          <Protected role="company">
            <CompanySettings />
          </Protected>
        }
      />

      {/* ================= ACADEMICIAN ================= */}

      <Route
        path="/academician/dashboard"
        element={
          <Protected role="academician">
            <AcademicianDashboard />
          </Protected>
        }
      />

      <Route
        path="/academician/profile"
        element={
          <Protected role="academician">
            <FacultyProfile />
          </Protected>
        }
      />

      <Route
        path="/academician/training"
        element={
          <Protected role="academician">
            <AcademicianTraining />
          </Protected>
        }
      />

      <Route
        path="/academician/fdp"
        element={
          <Protected role="academician">
            <FDPWorkshops />
          </Protected>
        }
      />

      <Route
        path="/academician/consultancy"
        element={
          <Protected role="academician">
            <Consultancy />
          </Protected>
        }
      />

      <Route
        path="/academician/research"
        element={
          <Protected role="academician">
            <ResearchCollaboration />
          </Protected>
        }
      />

      <Route
        path="/academician/projects"
        element={
          <Protected role="academician">
            <LiveIndustryProjects />
          </Protected>
        }
      />

      <Route
        path="/academician/collaboration"
        element={
          <Protected role="academician">
            <AcademicianCollaboration />
          </Protected>
        }
      />

      {/* ================= INSTITUTION ================= */}

      <Route
        path="/institution/dashboard"
        element={
          <Protected role="institution">
            <InstitutionDashboard />
          </Protected>
        }
      />

      <Route
        path="/institution/students"
        element={
          <Protected role="institution">
            <InstitutionStudents />
          </Protected>
        }
      />

      <Route
        path="/institution/skills"
        element={
          <Protected role="institution">
            <InstitutionSkillAnalytics />
          </Protected>
        }
      />

      <Route
        path="/institution/training"
        element={
          <Protected role="institution">
            <InstitutionTraining />
          </Protected>
        }
      />

      <Route
        path="/institution/internships"
        element={
          <Protected role="institution">
            <InstitutionInternships />
          </Protected>
        }
      />

      <Route
        path="/institution/placements"
        element={
          <Protected role="institution">
            <InstitutionPlacements />
          </Protected>
        }
      />

      <Route
        path="/institution/partners"
        element={
          <Protected role="institution">
            <InstitutionPartners />
          </Protected>
        }
      />

      <Route
        path="/institution/reports"
        element={
          <Protected role="institution">
            <InstitutionReports />
          </Protected>
        }
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin/dashboard"
        element={<AdminDashboard />}
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={<PlaceholderPage title="Page Not Found" />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
