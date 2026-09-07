const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000"
).replace(/\/+$/, "");

const SESSION_KEY = "academia_session";

function getToken() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null")?.token || null;
  } catch {
    return null;
  }
}

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function describeStatus(status, data) {
  const detail = data?.detail;

  if (typeof detail === "string" && detail) return detail;
  if (detail && typeof detail === "object" && detail.message) return detail.message;

  if (Array.isArray(detail) && detail.length) {
    return detail
      .map((item) => {
        const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : "";
        return field ? `${field}: ${item.msg}` : item.msg;
      })
      .join(" ");
  }

  if (data?.message) return data.message;

  const fallback = {
    401: "Your session has expired. Please log in again.",
    403: "You do not have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "This action conflicts with existing data.",
    422: "Some of the submitted data is invalid. Please check the form.",
    500: "The server encountered an error. Please try again.",
    502: "The server is temporarily unavailable. Please try again shortly.",
    503: "The server is temporarily unavailable. Please try again shortly.",
  };

  return fallback[status] || `Request failed with status ${status}.`;
}

/**
 * Shared request helper used by every page. Attaches the session token,
 * parses JSON, and converts every failure into a readable ApiError.
 */
export async function apiRequest(endpoint, options = {}) {
  const { body, headers: customHeaders, ...rest } = options;

  const isFormData = body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(customHeaders || {}),
  };

  const token = getToken();

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...rest,
      headers,
      body: body === undefined || isFormData || typeof body === "string" ? body : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(
      "Unable to reach the AcademiaConnect server. Check your connection and try again.",
      0,
      null
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(describeStatus(response.status, data), response.status, data);
  }

  return data;
}

export async function loginApi(email, password, role) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password, role },
  });
}

export async function registerApi({ name, email, password, role }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password, role },
  });
}

export async function meApi() {
  return apiRequest("/auth/me");
}

export { API_BASE_URL };
