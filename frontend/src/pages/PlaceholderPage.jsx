import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";

const ROLE_DASHBOARDS = {
  student: "/student/dashboard",
  academician: "/academician/dashboard",
  company: "/company/dashboard",
  institution: "/institution/dashboard",
};

function PlaceholderPage({ title = "Coming Next 🚀", description }) {
  const { session } = useAuth();
  const backTo = ROLE_DASHBOARDS[session?.role] || "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white" data-testid="placeholder-page">
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400 text-xl font-black text-slate-950">
          AC
        </div>

        <h1 className="mt-6 text-3xl font-black">{title}</h1>

        <p className="mt-3 text-slate-400">
          {description || "The page you are looking for does not exist or is still under development."}
        </p>

        <Link
          to={backTo}
          className="mt-6 inline-block rounded-xl bg-cyan-400 px-6 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          {session ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}

export default PlaceholderPage;
