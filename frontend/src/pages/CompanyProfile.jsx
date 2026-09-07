import { useEffect, useState } from "react";
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

const EMPTY_FORM = { name: "", industry: "", description: "", location: "" };

export default function CompanyProfile() {
  const { session } = useAuth();
  const { data, loading, error, reload } = useFetch(() => apiRequest(`/company/profile/${session.id}`), [session.id]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!data?.company) return;
    const company = data.company;
    setForm({
      name: company.name || "",
      industry: company.industry || "",
      description: company.description || "",
      location: company.location || "",
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

    if (!form.name.trim()) {
      setSaveError("Company name is required.");
      return;
    }

    setSaving(true);

    try {
      await apiRequest("/company/profile/", { method: "PUT", body: { user_id: session.id, ...form } });
      setSaved(true);
      reload();
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const completion = Math.round((Object.values(form).filter(Boolean).length / 4) * 100);

  return (
    <div className="space-y-8" data-testid="company-profile">
      <PageHeader
        eyebrow="Company Profile"
        title="Your company identity"
        description="This information is shown to students alongside your opportunities."
      />

      {loading && <LoadingState label="Loading company profile..." />}
      {error && <Alert onRetry={reload}>{error}</Alert>}

      {data && (
        <>
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <Card className="p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-cyan-400 text-3xl font-black text-slate-950">
                  {(form.name || "C").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-2xl font-black" data-testid="company-name">{form.name || "Company name"}</h3>
                  <p className="mt-1 text-sm text-slate-400">{form.industry || "Industry not set"}</p>
                  <p className="mt-1 text-sm text-slate-500">{form.location || "Location not set"} • {data.user?.email}</p>
                </div>
              </div>
            </Card>

            <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-cyan-300">Profile Strength</p>
                  <p className="mt-1 text-xs text-slate-500">Complete your company profile</p>
                </div>
                <span className="text-2xl font-black">{completion}%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-cyan-400 transition-all" style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="company-profile-form">
            <Card className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-black">Company Information</h3>
                <p className="mt-1 text-sm text-slate-500">Basic details about your organization.</p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <Field label="Company Name">
                  <input name="name" value={form.name} onChange={handleChange} placeholder="Enter company name" className={inputClass} data-testid="company-name-input" />
                </Field>
                <Field label="Industry">
                  <input name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Information Technology" className={inputClass} data-testid="company-industry-input" />
                </Field>
                <Field label="Location">
                  <input name="location" value={form.location} onChange={handleChange} placeholder="City, State" className={inputClass} data-testid="company-location-input" />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="About the Company">
                  <textarea name="description" value={form.description} onChange={handleChange} rows={5} maxLength={1000} placeholder="Describe what your company does..." className={`${inputClass} resize-none leading-6`} data-testid="company-description-input" />
                </Field>
                <p className="mt-2 text-right text-xs text-slate-600">{form.description.length}/1000</p>
              </div>
            </Card>

            {saveError && <Alert>{saveError}</Alert>}
            {saved && <Alert tone="success">Company profile saved successfully.</Alert>}

            <div className="flex justify-end border-t border-white/10 pt-6">
              <button type="submit" disabled={saving} className={primaryButtonClass} data-testid="company-profile-save-button">
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
