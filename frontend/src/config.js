const config = {
  appName: "Academia Industry Portal",

  api: {
    baseURL:
      import.meta.env.VITE_API_URL || "http://127.0.0.1:8000",
  },

  auth: {
    tokenKey: "token",
    userKey: "user",
  },

  roles: {
    STUDENT: "student",
    COMPANY: "company",
    INSTITUTION: "institution",
    ACADEMICIAN: "academician",
    ADMIN: "admin",
  },

  storage: {
    token: "token",
    user: "user",
  },
};

export default config;