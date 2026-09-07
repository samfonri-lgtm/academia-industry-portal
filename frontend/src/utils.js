export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function formatDate(date, options = {}) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    options || {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

export function formatDateTime(date) {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function capitalize(value = "") {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function capitalizeWords(value = "") {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export function truncateText(text = "", maxLength = 100) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength).trim()}...`;
}

export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }

  if (typeof value === "string") {
    return value.trim().length === 0;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}

export function getErrorMessage(error, fallback = "Something went wrong") {
  if (!error) return fallback;

  if (typeof error === "string") {
    return error;
  }

  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.message ||
    fallback
  );
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(value) {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN").format(number);
}

export function formatPercentage(value) {
  if (value === null || value === undefined || value === "") {
    return "0%";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return "0%";
  }

  return `${Math.round(number)}%`;
}

export function getStatusLabel(status = "") {
  return capitalizeWords(status.replace(/[_-]/g, " "));
}

export function getStatusClass(status = "") {
  return `status-${String(status).toLowerCase().replace(/\s+/g, "-")}`;
}

export function debounce(callback, delay = 300) {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export function safeJSONParse(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}