import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  secondaryButtonClass,
} from "../components/ui";

const TYPES = ["Internship", "Project", "Job"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const EMPTY_FORM = { title: "", type: "Internship", description: "", location: "", stipend: "", deadline: "" };

export default function CreateOpportunity() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const { data: library, loading, error, reload } = useFetch(() => apiRequest("/student/skills/library").then((r) => r.skills), []);

  const [form, setForm] = useState(EMPTY_FORM);
  const [requiredSkills, setRequiredSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [warning, setWarning] = useState("");

  const categories = useMemo(() => ["All", ...new Set((library || []).map((skill) => skill.category))], [library]);

  const visibleSkills = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();
    return (library || []).filter(
      (skill) =>
        (category === "All" || skill.category === category) &&
        (!query || skill.name.toLowerCase().includes(query)) &&
        !requiredSkills.some((item) => item.skill_id === skill.id)
    );
  }, [library, category, skillSearch, requiredSkills]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitError("");
  }

  function addSkill(skill) {
    setRequiredSkills((current) => [...current, { skill_id: skill.id, name: skill.name, category: skill.category, required_level: "Intermediate" }]);
  }

  function setLevel(skillId, level) {
    setRequiredSkills((current) => current.map((item) => (item.skill_id === skillId ? { ...item, required_level: level } : item)));
  }

  function removeSkill(skillId) {
    setRequiredSkills((current) => current.filter((item) => item.skill_id !== skillId));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    setWarning("");

    if (!form.title.trim()) return setSubmitError("Opportunity title is required.");
    if (form.title.trim().length < 3) return setSubmitError("Title must be at least 3 characters.");
    if (form.deadline && new Date(form.deadline) < new Date(new Date().toDateString())) {
      return setSubmitError("Deadline cannot be in the past.");
    }

    setSubmitting(true);

    try {
      const created = await apiRequest("/company/opportunities/", {
        method: "POST",
        body: { user_id: session.id, ...form, deadline: form.deadline || null },
      });

      const opportunityId = created.opportunity.id;

      const results = await Promise.allSettled(
        requiredSkills.map((skill) =>
          apiRequest(`/matching/opportunity/${opportunityId}/skill/${skill.skill_id}?required_level=${encodeURIComponent(skill.required_level)}`, { method: "POST" })
        )
      );

      const failed = results.filter((result) => result.status === "rejected").length;

      if (failed > 0) {
        setWarning(`Opportunity created, but ${failed} skill requirement${failed === 1 ? "" : "s"} could not be saved.`);
        setSubmitting(false);
        return;
      }

      navigate("/company/opportunities", { replace: true });
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8" data-testid="create-opportunity">
      <PageHeader
        eyebrow="Create Opportunity"
        title="Publish a new opportunity"
        description="Define the role and the skills it requires. Students are matched against these requirements."
        action={
          <Link to="/company/opportunities" className={secondaryButtonClass}>← Back to Opportunities</Link>
        }
      />

      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_380px]" data-testid="create-opportunity-form">
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-xl font-black">1. Opportunity Details</h3>
            <p className="mt-1 text-sm text-slate-500">What are you offering?</p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <Field label="Title *">
                  <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Software Development Intern" className={inputClass} data-testid="opportunity-title-input" />
                </Field>
              </div>

              <Field label="Type *">
                <select name="type" value={form.type} onChange={handleChange} className={inputClass} data-testid="opportunity-type-select">
                  {TYPES.map((type) => <option key={type}>{type}</option>)}
                </select>
              </Field>

              <Field label="Location">
                <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bhopal / Remote" className={inputClass} data-testid="opportunity-location-input" />
              </Field>

              <Field label="Stipend / Salary">
                <input name="stipend" value={form.stipend} onChange={handleChange} placeholder="e.g. ₹15,000/month" className={inputClass} data-testid="opportunity-stipend-input" />
              </Field>

              <Field label="Application Deadline">
                <input name="deadline" type="date" value={form.deadline} onChange={handleChange} className={inputClass} data-testid="opportunity-deadline-input" />
              </Field>

              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea name="description" value={form.description} onChange={handleChange} rows={5} maxLength={2000} placeholder="Describe the role, responsibilities and what the student will learn..." className={`${inputClass} resize-none leading-6`} data-testid="opportunity-description-input" />
                </Field>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-black">2. Required Skills</h3>
            <p className="mt-1 text-sm text-slate-500">Pick skills from the platform skill library and set the level you expect.</p>

            {loading && <div className="mt-5"><LoadingState label="Loading skill library..." /></div>}
            {error && <div className="mt-5"><Alert onRetry={reload}>{error}</Alert></div>}

            {library && (
              <>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <input value={skillSearch} onChange={(e) => setSkillSearch(e.target.value)} placeholder="Search skills..." className={inputClass} data-testid="skill-search-input" />
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} sm:w-56`} data-testid="skill-category-select">
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>

                <div className="mt-4 flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">
                  {visibleSkills.length === 0 ? (
                    <p className="text-xs text-slate-600">No more skills match this filter.</p>
                  ) : (
                    visibleSkills.map((skill) => (
                      <button key={skill.id} type="button" onClick={() => addSkill(skill)} className="rounded-lg border border-white/10 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-white" data-testid={`add-skill-${skill.id}`}>
                        + {skill.name}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-black">Selected Skills ({requiredSkills.length})</h3>

            {requiredSkills.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No skills selected. Adding skills enables match scores for students.</p>
            ) : (
              <div className="mt-4 space-y-3" data-testid="selected-skills">
                {requiredSkills.map((skill) => (
                  <div key={skill.skill_id} className="rounded-xl border border-white/10 bg-slate-950 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">{skill.name}</p>
                        <p className="text-xs text-slate-500">{skill.category}</p>
                      </div>
                      <button type="button" onClick={() => removeSkill(skill.skill_id)} className="text-xs font-bold text-rose-300 hover:text-rose-200" aria-label={`Remove ${skill.name}`}>✕</button>
                    </div>
                    <select value={skill.required_level} onChange={(e) => setLevel(skill.skill_id, e.target.value)} className={`${inputClass} mt-2 !py-2`}>
                      {LEVELS.map((level) => <option key={level}>{level}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {submitError && <Alert>{submitError}</Alert>}
          {warning && (
            <Alert tone="warning">
              {warning}{" "}
              <Link to="/company/opportunities" className="font-bold underline">Go to opportunities →</Link>
            </Alert>
          )}

          <button type="submit" disabled={submitting} className={`${primaryButtonClass} w-full`} data-testid="publish-opportunity-button">
            {submitting ? "Publishing..." : "Publish Opportunity"}
          </button>
        </div>
      </form>
    </div>
  );
}
