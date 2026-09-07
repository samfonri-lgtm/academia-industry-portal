import { Link } from "react-router-dom";

export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
          {eyebrow}
        </p>

        <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
          {title}
        </h2>

        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

export function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/[0.03] ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, description, icon, tone = "text-white" }) {
  return (
    <Card className="p-5 transition hover:-translate-y-1 hover:border-cyan-400/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className={`mt-2 text-3xl font-black ${tone}`} data-testid={`stat-${label.toLowerCase().replace(/\s+/g, "-")}`}>
            {value}
          </p>
        </div>

        {icon && (
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
            {icon}
          </div>
        )}
      </div>

      {description && <p className="mt-3 text-xs text-slate-500">{description}</p>}
    </Card>
  );
}

export function Alert({ tone = "error", children, onRetry }) {
  const tones = {
    error: "border-rose-400/20 bg-rose-400/10 text-rose-300",
    success: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    info: "border-cyan-400/20 bg-cyan-400/10 text-cyan-300",
    warning: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  };

  return (
    <div
      role="alert"
      data-testid={`alert-${tone}`}
      className={`flex flex-col gap-3 rounded-xl border px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between ${tones[tone]}`}
    >
      <span>{children}</span>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          data-testid="alert-retry-button"
          className="w-fit rounded-lg border border-current px-3 py-1 text-xs font-bold transition hover:bg-white/5"
        >
          Retry
        </button>
      )}
    </div>
  );
}

export function LoadingState({ label = "Loading..." }) {
  return (
    <div
      data-testid="loading-state"
      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />
      {label}
    </div>
  );
}

export function EmptyState({ icon = "📭", title, description, actionLabel, actionTo, onAction }) {
  return (
    <div
      data-testid="empty-state"
      className="rounded-2xl border border-dashed border-white/10 p-10 text-center"
    >
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-lg font-bold text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-500">{description}</p>}

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 inline-block rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          {actionLabel}
        </Link>
      )}

      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-block rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const STATUS_STYLES = {
  applied: "bg-cyan-400/10 text-cyan-300",
  shortlisted: "bg-amber-400/10 text-amber-300",
  selected: "bg-emerald-400/10 text-emerald-300",
  rejected: "bg-rose-400/10 text-rose-300",
};

export function StatusBadge({ status }) {
  return (
    <span
      data-testid="status-badge"
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_STYLES[String(status).toLowerCase()] || "bg-white/5 text-slate-300"
      }`}
    >
      {status}
    </span>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-slate-600">{hint}</p>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10 disabled:cursor-not-allowed disabled:opacity-60";

export const primaryButtonClass =
  "rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60";

export function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value.includes("T") || value.includes(" ") ? value.replace(" ", "T") + (value.endsWith("Z") ? "" : "Z") : value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
