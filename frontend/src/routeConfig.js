import { ROUTES, ROLES } from "./constants";

export const publicRoutes = [
  {
    path: ROUTES.LOGIN,
    label: "Login",
  },
  {
    path: ROUTES.REGISTER,
    label: "Register",
  },
  {
    path: ROUTES.ROLE_SELECTION,
    label: "Role Selection",
  },
];

export const roleRoutes = {
  [ROLES.STUDENT]: [
    ROUTES.STUDENT_DASHBOARD,
    ROUTES.STUDENT_PROFILE,
    ROUTES.STUDENT_SKILLS,
    ROUTES.STUDENT_SKILL_GAP,
    ROUTES.STUDENT_OPPORTUNITIES,
    ROUTES.STUDENT_APPLICATIONS,
    ROUTES.STUDENT_RESUME,
  ],

  [ROLES.COMPANY]: [
    ROUTES.COMPANY_DASHBOARD,
    ROUTES.COMPANY_PROFILE,
    ROUTES.COMPANY_OPPORTUNITIES,
    ROUTES.COMPANY_APPLICATIONS,
    ROUTES.COMPANY_SETTINGS,
  ],

  [ROLES.INSTITUTION]: [
    ROUTES.INSTITUTION_DASHBOARD,
    ROUTES.INSTITUTION_STUDENTS,
    ROUTES.INSTITUTION_INTERNSHIPS,
    ROUTES.INSTITUTION_PLACEMENTS,
    ROUTES.INSTITUTION_PARTNERS,
    ROUTES.INSTITUTION_REPORTS,
    ROUTES.INSTITUTION_SKILL_ANALYTICS,
    ROUTES.INSTITUTION_TRAINING,
  ],

  [ROLES.ACADEMICIAN]: [
    ROUTES.ACADEMICIAN_DASHBOARD,
    ROUTES.ACADEMICIAN_COLLABORATION,
    ROUTES.ACADEMICIAN_TRAINING,
  ],

  [ROLES.ADMIN]: [
    ROUTES.ADMIN_DASHBOARD,
  ],
};

export const defaultDashboardByRole = {
  [ROLES.STUDENT]: ROUTES.STUDENT_DASHBOARD,
  [ROLES.COMPANY]: ROUTES.COMPANY_DASHBOARD,
  [ROLES.INSTITUTION]: ROUTES.INSTITUTION_DASHBOARD,
  [ROLES.ACADEMICIAN]: ROUTES.ACADEMICIAN_DASHBOARD,
  [ROLES.ADMIN]: ROUTES.ADMIN_DASHBOARD,
};

export function getDefaultDashboard(role) {
  return (
    defaultDashboardByRole[role] ||
    ROUTES.LOGIN
  );
}

export function canAccessRoute(role, path) {
  if (!role || !path) {
    return false;
  }

  const allowedRoutes = roleRoutes[role] || [];

  return allowedRoutes.includes(path);
}

export function getRoutesForRole(role) {
  return roleRoutes[role] || [];
}

export default {
  publicRoutes,
  roleRoutes,
  defaultDashboardByRole,
  getDefaultDashboard,
  canAccessRoute,
  getRoutesForRole,
};