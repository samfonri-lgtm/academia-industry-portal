import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireRole({ allowedRole, children }) {
  const { session, isAuthenticated } = useAuth();
  const location = useLocation();

  // User is not logged in
  if (!isAuthenticated || !session) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // User is logged in but has the wrong role
  if (session.role !== allowedRole) {
    const roleDashboard = {
      student: "/student/dashboard",
      academician: "/academician/dashboard",
      company: "/company/dashboard",
      institution: "/institution/dashboard",
      admin: "/admin/dashboard",
    };

    return (
      <Navigate
        to={roleDashboard[session.role] || "/select-role"}
        replace
      />
    );
  }

  return children;
}