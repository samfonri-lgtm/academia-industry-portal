import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { API_BASE_URL } from "../auth";


const LEVELS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Expert",
];


function StudentSkills() {
  const { session } = useAuth();

  const userId = session?.id;
  const studentName = session?.name || "Student";

  const [skillLibrary, setSkillLibrary] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);

  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("Beginner");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================================================
  // LOAD DATA
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadSkills() {
      if (!userId) {
        if (!cancelled) {
          setLoading(false);
          setError("User session not found. Please login again.");
        }

        return;
      }

      try {
        setLoading(true);
        setError("");

        const [libraryResponse, studentResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/student/skills/library`),

          fetch(`${API_BASE_URL}/student/skills/${userId}`),
        ]);


        // -----------------------------------------------------
        // Skill Library
        // -----------------------------------------------------

        let libraryData = null;

        try {
          libraryData = await libraryResponse.json();
        } catch {
          libraryData = null;
        }

        if (!libraryResponse.ok) {
          throw new Error(
            libraryData?.detail ||
              "Unable to load skill library."
          );
        }


        // -----------------------------------------------------
        // Student Skills
        // -----------------------------------------------------

        let studentData = null;

        try {
          studentData = await studentResponse.json();
        } catch {
          studentData = null;
        }

        if (!studentResponse.ok) {
          throw new Error(
            studentData?.detail ||
              "Unable to load your skills."
          );
        }


        if (!cancelled) {
          setSkillLibrary(
            Array.isArray(libraryData?.skills)
              ? libraryData.skills
              : []
          );

          setStudentSkills(
            Array.isArray(studentData?.skills)
              ? studentData.skills
              : []
          );
        }

      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message ||
              "Unable to load skills."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }


    loadSkills();


    return () => {
      cancelled = true;
    };

  }, [userId]);


  // =========================================================
  // CATEGORIES
  // =========================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        skillLibrary.map(
          (skill) => skill.category
        )
      ),
    ];

    return ["All", ...uniqueCategories];
  }, [skillLibrary]);


  // =========================================================
  // FILTER SKILLS
  // =========================================================

  const filteredSkills = useMemo(() => {

    const normalizedSearch =
      search.trim().toLowerCase();


    return skillLibrary.filter((skill) => {

      const matchesSearch =
        !normalizedSearch ||
        skill.name
          .toLowerCase()
          .includes(normalizedSearch);


      const matchesCategory =
        category === "All" ||
        skill.category === category;


      return (
        matchesSearch &&
        matchesCategory
      );
    });

  }, [
    skillLibrary,
    search,
    category,
  ]);


  // =========================================================
  // ADD SKILL
  // =========================================================

  async function handleAddSkill() {

    if (!userId) {
      setError(
        "User session not found. Please login again."
      );

      return;
    }


    if (!selectedSkill) {
      setError(
        "Please select a skill."
      );

      return;
    }


    try {

      setAdding(true);
      setError("");
      setSuccess("");


      const response = await fetch(
        `${API_BASE_URL}/student/skills/`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: userId,

            skill_id:
              Number(selectedSkill),

            level: selectedLevel,
          }),
        }
      );


      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }


      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to add skill."
        );
      }


      // Add returned skill to UI
      setStudentSkills(
        (current) => [
          ...current,
          data.skill,
        ]
      );


      setSelectedSkill("");
      setSelectedLevel("Beginner");

      setSuccess(
        "Skill added successfully."
      );


      window.setTimeout(() => {
        setSuccess("");
      }, 3000);


    } catch (err) {

      setError(
        err?.message ||
          "Unable to add skill."
      );

    } finally {

      setAdding(false);

    }
  }


  // =========================================================
  // UPDATE LEVEL
  // =========================================================

  async function handleLevelChange(
    studentSkillId,
    newLevel
  ) {

    if (!userId) {
      setError(
        "User session not found."
      );

      return;
    }


    try {

      setError("");
      setSuccess("");


      const response = await fetch(
        `${API_BASE_URL}/student/skills/${studentSkillId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            user_id: userId,

            skill_id:
              studentSkillId,

            level: newLevel,
          }),
        }
      );


      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }


      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to update skill."
        );
      }


      setStudentSkills(
        (current) =>
          current.map((skill) =>
            skill.id === studentSkillId
              ? {
                  ...skill,
                  level: newLevel,
                }
              : skill
          )
      );


      setSuccess(
        "Skill level updated."
      );


      window.setTimeout(() => {
        setSuccess("");
      }, 2000);


    } catch (err) {

      setError(
        err?.message ||
          "Unable to update skill."
      );

    }
  }


  // =========================================================
  // DELETE SKILL
  // =========================================================

  async function handleDeleteSkill(
    studentSkillId
  ) {

    if (!userId) {
      setError(
        "User session not found."
      );

      return;
    }


    const confirmed =
      window.confirm(
        "Remove this skill from your profile?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setError("");
      setSuccess("");


      const response = await fetch(
        `${API_BASE_URL}/student/skills/${studentSkillId}?user_id=${userId}`,
        {
          method: "DELETE",
        }
      );


      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }


      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Unable to remove skill."
        );
      }


      setStudentSkills(
        (current) =>
          current.filter(
            (skill) =>
              skill.id !==
              studentSkillId
          )
      );


      setSuccess(
        "Skill removed successfully."
      );


      window.setTimeout(() => {
        setSuccess("");
      }, 2000);


    } catch (err) {

      setError(
        err?.message ||
          "Unable to remove skill."
      );

    }
  }


  // =========================================================
  // STATS
  // =========================================================

  const skillCount =
    studentSkills.length;


  const advancedCount =
    studentSkills.filter(
      (skill) =>
        skill.level === "Advanced" ||
        skill.level === "Expert"
    ).length;


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">


      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-sm font-semibold text-cyan-400">
            STUDENT SKILLS
          </p>

          <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
            My Skills
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Build your skill profile for better
            internship and placement matching.
          </p>

        </div>


        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3">

          <p className="text-xs font-semibold text-slate-400">
            PROFILE SKILLS
          </p>

          <p className="mt-1 text-2xl font-black text-cyan-400">
            {skillCount}
          </p>

        </div>

      </div>


      {/* =====================================================
          ALERTS
      ===================================================== */}

      {error && (
        <section className="rounded-2xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">
          {error}
        </section>
      )}


      {success && (
        <section className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-300">
          ✓ {success}
        </section>
      )}


      {/* =====================================================
          STATS
      ===================================================== */}

      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

          <p className="text-sm text-slate-400">
            Total Skills
          </p>

          <p className="mt-2 text-3xl font-black text-white">
            {skillCount}
          </p>

        </div>


        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

          <p className="text-sm text-slate-400">
            Advanced / Expert
          </p>

          <p className="mt-2 text-3xl font-black text-cyan-400">
            {advancedCount}
          </p>

        </div>

      </div>


      {/* =====================================================
          ADD SKILL
      ===================================================== */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg">

        <div>

          <p className="text-sm font-semibold text-cyan-400">
            ADD A SKILL
          </p>

          <h2 className="mt-1 text-xl font-black text-white">
            Grow Your Skill Profile
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add skills and specify your current
            proficiency level.
          </p>

        </div>


        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px_auto]">


          {/* Skill */}

          <div>

            <label className="text-sm font-medium text-slate-400">
              Skill
            </label>

            <select
              value={selectedSkill}
              onChange={(event) =>
                setSelectedSkill(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-400/50"
            >

              <option value="">
                Select a skill
              </option>

              {skillLibrary.map(
                (skill) => (
                  <option
                    key={skill.id}
                    value={skill.id}
                  >
                    {skill.name}
                  </option>
                )
              )}

            </select>

          </div>


          {/* Level */}

          <div>

            <label className="text-sm font-medium text-slate-400">
              Level
            </label>

            <select
              value={selectedLevel}
              onChange={(event) =>
                setSelectedLevel(
                  event.target.value
                )
              }
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm font-semibold text-white outline-none focus:border-cyan-400/50"
            >

              {LEVELS.map(
                (level) => (
                  <option
                    key={level}
                    value={level}
                  >
                    {level}
                  </option>
                )
              )}

            </select>

          </div>


          {/* Button */}

          <div className="flex items-end">

            <button
              type="button"
              onClick={handleAddSkill}
              disabled={
                adding ||
                !selectedSkill
              }
              className="w-full rounded-xl bg-cyan-400 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
            >
              {adding
                ? "Adding..."
                : "Add Skill +"}
            </button>

          </div>

        </div>

      </section>


      {/* =====================================================
          MY SKILLS
      ===================================================== */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-sm font-semibold text-cyan-400">
              YOUR SKILLS
            </p>

            <h2 className="mt-1 text-xl font-black text-white">
              Skill Portfolio
            </h2>

          </div>


          {/* Search */}

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search skills..."
            className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/50 lg:w-72"
          />

        </div>


        {/* Categories */}

        <div className="mt-5 flex gap-2 overflow-x-auto pb-2">

          {categories.map(
            (item) => (

              <button
                key={item}
                type="button"
                onClick={() =>
                  setCategory(item)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition ${
                  category === item
                    ? "bg-cyan-400 text-slate-950"
                    : "border border-white/10 bg-white/[0.03] text-slate-400 hover:border-cyan-400/30 hover:text-white"
                }`}
              >
                {item}
              </button>

            )
          )}

        </div>


        {/* Loading */}

        {loading && (

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6">

            <div className="flex items-center gap-3 text-sm text-slate-400">

              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />

              Loading skills...

            </div>

          </div>

        )}


        {/* Student Skills */}

        {!loading && studentSkills.length === 0 && (

          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">

            <div className="text-4xl">
              🧠
            </div>

            <h3 className="mt-3 font-bold text-white">
              No skills added yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
              Add your programming,
              technical, design or
              professional skills above.
            </p>

          </div>

        )}


        {!loading &&
          studentSkills.length > 0 && (

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {studentSkills
                .filter((skill) => {

                  const matchesSearch =
                    !search.trim() ||
                    skill.skill_name
                      .toLowerCase()
                      .includes(
                        search
                          .trim()
                          .toLowerCase()
                      );

                  const matchesCategory =
                    category === "All" ||
                    skill.category === category;

                  return (
                    matchesSearch &&
                    matchesCategory
                  );

                })
                .map((skill) => (

                  <div
                    key={skill.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:-translate-y-1 hover:border-cyan-400/20"
                  >

                    <div className="flex items-start justify-between gap-3">

                      <div>

                        <p className="font-bold text-white">
                          {skill.skill_name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {skill.category}
                        </p>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteSkill(
                            skill.id
                          )
                        }
                        className="text-xs font-bold text-rose-400 transition hover:text-rose-300"
                      >
                        Remove
                      </button>

                    </div>


                    <div className="mt-5">

                      <label className="text-xs font-medium text-slate-500">
                        Proficiency
                      </label>

                      <select
                        value={skill.level}
                        onChange={(event) =>
                          handleLevelChange(
                            skill.id,
                            event.target.value
                          )
                        }
                        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm font-semibold text-white outline-none focus:border-cyan-400/50"
                      >

                        {LEVELS.map(
                          (level) => (
                            <option
                              key={level}
                              value={level}
                            >
                              {level}
                            </option>
                          )
                        )}

                      </select>

                    </div>

                  </div>

                ))}

            </div>

          )}


        {/* No filtered results */}

        {!loading &&
          studentSkills.length > 0 &&
          studentSkills.filter((skill) => {

            const matchesSearch =
              !search.trim() ||
              skill.skill_name
                .toLowerCase()
                .includes(
                  search
                    .trim()
                    .toLowerCase()
                );

            const matchesCategory =
              category === "All" ||
              skill.category === category;

            return (
              matchesSearch &&
              matchesCategory
            );

          }).length === 0 && (

            <div className="mt-6 rounded-2xl border border-dashed border-white/10 p-8 text-center">

              <p className="font-semibold text-white">
                No matching skills
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Try another search or category.
              </p>

            </div>

          )}

      </section>


      {/* =====================================================
          NEXT STEP
      ===================================================== */}

      <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>

            <p className="text-sm font-semibold text-cyan-400">
              NEXT STEP
            </p>

            <h3 className="mt-1 text-lg font-bold text-white">
              Ready to analyze your skill gap?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Once your skills are added,
              AcademiaConnect can compare
              them with target career roles.
            </p>

          </div>


          <Link
            to="/student/skill-gap"
            className="shrink-0 rounded-xl bg-cyan-400 px-5 py-3 text-center text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
          >
            Check Skill Gap →
          </Link>

        </div>

      </section>

    </div>
  );
}


export default StudentSkills;