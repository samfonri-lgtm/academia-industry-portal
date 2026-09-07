import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { apiRequest } from "../auth";
import useFetch from "../hooks/useFetch";
import {
  Alert,
  Card,
  Field,
  LoadingState,
  PageHeader,
  inputClass,
  primaryButtonClass,
} from "../components/ui";

const EMPTY_FORM = { college: "", branch: "", semester: "", cgpa: "", career_goal: "" };

const SEMESTERS = ["1", "2", "3", "4", "5", "6", "7", "8"];

function CompletionItem({ label, completed }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${completed ? "bg-emerald-400/15 text-emerald-300" : "bg-white/5 text-slate-600"}`}>
        {completed ? "✓" : "•"}
      </div>
      <span className={completed ? "text-slate-300" : "text-slate-500"}>{label}</span>
    </div>
  );
}

export default function StudentProfile() {
  const { session } = useAuth();

  const { data, loading, error, reload } = useFetch(
    () => apiRequest(`/student/profile/${session.id}`),
    [session.id]
  );

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!data?.profile) return;

    const profile = data.profile;

    setForm({
      college: profile.college || "",
      branch: profile.branch || "",
      semester: profile.semester ? String(profile.semester) : "",
      cgpa: profile.cgpa !== null && profile.cgpa !== undefined ? String(profile.cgpa) : "",
      career_goal: profile.career_goal || "",
    });
  }, [data]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
    setSaveError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaveError("");
    setSaved(false);

    if (form.cgpa && (Number.isNaN(Number(form.cgpa)) || Number(form.cgpa) < 0 || Number(form.cgpa) > 10)) {
      setSaveError("CGPA must be a number between 0 and 10.");
      return;
    }

    setSaving(true);

    try {
      await apiRequest("/student/profile/", {
        method: "PUT",
        body: { user_id: session.id, ...form },
      });
      setSaved(true);
      reload();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const completedFields = Object.values(form).filter(Boolean).length;
  const completion = Math.round((completedFields / Object.keys(form).length) * 100);
  const user = data?.user || session;

  return (
    <div className="space-y-8" data-testid="student-profile">
      <PageHeader
        eyebrow="My Profile"
        title="Build your student profile"
        description="Keep your academic information complete so companies and the matching engine understand your background."
        action={
          <Link to="/student/resume" className="inline-flex w-fit items-center rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white">
            View Resume →
          </Link>
        }
      />

      {loading && <LoadingState label="Loading your profile..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}

      {data && (
        <>
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <Card className="p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-3xl font-black text-slate-950">
                  {(user?.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-black" data-testid="profile-name">{user?.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {form.branch || "Branch not set"}{form.semester ? ` • Semester ${form.semester}` : ""}
                  </p>
                </div>
              </div>
            </Card>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-cyan-300">Profile Strength</p>
                  <p className="mt-1 text-xs text-slate-500">Complete your profile</p>
                </div>
                <span className="text-2xl font-black" data-testid="profile-completion">{completion}%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="student-profile-form">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-black">Academic Information</h3>
                <p className="mt-1 text-sm text-slate-500">Your current academic details.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="College / Institution">
                  <input name="college" value={form.college} onChange={handleChange} placeholder="Enter your college name" className={inputClass} data-testid="profile-college-input" />
                </Field>

                <Field label="Branch">
                  <input name="branch" value={form.branch} onChange={handleChange} placeholder="e.g. Computer Science" className={inputClass} data-testid="profile-branch-input" />
                </Field>

                <Field label="Semester">
                  <select name="semester" value={form.semester} onChange={handleChange} className={inputClass} data-testid="profile-semester-select">
                    <option value="">Select semester</option>
                    {SEMESTERS.map((value) => (
                      <option key={value} value={value}>Semester {value}</option>
                    ))}
                  </select>
                </Field>

                <Field label="CGPA" hint="On a 10-point scale">
                  <input name="cgpa" value={form.cgpa} onChange={handleChange} placeholder="e.g. 8.2" inputMode="decimal" className={inputClass} data-testid="profile-cgpa-input" />
                </Field>
              </div>
            </Card>

            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-black">Career Goal</h3>
                <p className="mt-1 text-sm text-slate-500">Describe the role or direction you are aiming for.</p>
              </div>

              <textarea
                name="career_goal"
                value={form.career_goal}
                onChange={handleChange}
                rows={4}
                maxLength={500}
                placeholder="Example: Backend developer role working with Python and cloud technologies..."
                className={`${inputClass} resize-none leading-6`}
                data-testid="profile-career-goal-input"
              />
              <p className="mt-2 text-right text-xs text-slate-600">{form.career_goal.length}/500</p>
            </Card>

            {saveError && <Alert>{saveError}</Alert>}
            {saved && <Alert tone="success">Profile saved successfully.</Alert>}

            <div className="flex justify-end border-t border-white/10 pt-6">
              <button type="submit" disabled={saving} className={primaryButtonClass} data-testid="profile-save-button">
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>

          <Card className="p-6">
            <h3 className="text-xl font-black">Profile Checklist</h3>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <CompletionItem label="College / institution" completed={Boolean(form.college)} />
              <CompletionItem label="Branch" completed={Boolean(form.branch)} />
              <CompletionItem label="Semester" completed={Boolean(form.semester)} />
              <CompletionItem label="CGPA" completed={Boolean(form.cgpa)} />
              <CompletionItem label="Career goal" completed={Boolean(form.career_goal)} />
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
