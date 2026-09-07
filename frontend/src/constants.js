export const ROLES = {
  STUDENT: "student",
  COMPANY: "company",
  INSTITUTION: "institution",
  ACADEMICIAN: "academician",
  ADMIN: "admin",
};

export const ROLE_LABELS = {
  [ROLES.STUDENT]: "Student",
  [ROLES.COMPANY]: "Company",
  [ROLES.INSTITUTION]: "Institution",
  [ROLES.ACADEMICIAN]: "Academician",
  [ROLES.ADMIN]: "Administrator",
};

export const APPLICATION_STATUS = {
  PENDING: "pending",
  SHORTLISTED: "shortlisted",
  SELECTED: "selected",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
};

export const OPPORTUNITY_TYPES = {
  INTERNSHIP: "internship",
  JOB: "job",
  TRAINING: "training",
  COLLABORATION: "collaboration",
};

export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

export const API_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  ROLE_SELECTION: "/role-selection",

  STUDENT_DASHBOARD: "/student/dashboard",
  STUDENT_PROFILE: "/student/profile",
  STUDENT_SKILLS: "/student/skills",
  STUDENT_SKILL_GAP: "/student/skill-gap",
  STUDENT_OPPORTUNITIES: "/student/opportunities",
  STUDENT_APPLICATIONS: "/student/applications",
  STUDENT_RESUME: "/student/resume",

  COMPANY_DASHBOARD: "/company/dashboard",
  COMPANY_PROFILE: "/company/profile",
  COMPANY_OPPORTUNITIES: "/company/opportunities",
  COMPANY_APPLICATIONS: "/company/applications",
  COMPANY_SETTINGS: "/company/settings",

  INSTITUTION_DASHBOARD: "/institution/dashboard",
  INSTITUTION_STUDENTS: "/institution/students",
  INSTITUTION_INTERNSHIPS: "/institution/internships",
  INSTITUTION_PLACEMENTS: "/institution/placements",
  INSTITUTION_PARTNERS: "/institution/partners",
  INSTITUTION_REPORTS: "/institution/reports",
  INSTITUTION_SKILL_ANALYTICS: "/institution/skill-analytics",
  INSTITUTION_TRAINING: "/institution/training",

  ACADEMICIAN_DASHBOARD: "/academician/dashboard",
  ACADEMICIAN_COLLABORATION: "/academician/collaboration",
  ACADEMICIAN_TRAINING: "/academician/training",

  ADMIN_DASHBOARD: "/admin/dashboard",
};

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};

export default {
  ROLES,
  ROLE_LABELS,
  APPLICATION_STATUS,
  OPPORTUNITY_TYPES,
  STORAGE_KEYS,
  API_STATUS,
  ROUTES,
  PAGINATION,
};