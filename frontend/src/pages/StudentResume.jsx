import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import { API_BASE_URL } from "../auth";


function StudentResume() {
  const { session } = useAuth();

  const userId = session?.id;

  const fileInputRef = useRef(null);

  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================================================
  // LOAD RESUMES
  // =========================================================

  async function loadResumes() {
    if (!userId) {
      setLoading(false);
      setError("User session not found. Please login again.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/student/resume/${userId}`
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.detail || "Unable to load resumes."
        );
      }

      setResumes(
        Array.isArray(data?.resumes)
          ? data.resumes
          : []
      );

    } catch (err) {
      setError(
        err?.message || "Unable to load resumes."
      );
    } finally {
      setLoading(false);
    }
  }


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    loadResumes();
  }, [userId]);


  // =========================================================
  // FILE SELECT
  // =========================================================

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
    ];

    const extension =
      "." +
      file.name
        .split(".")
        .pop()
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setSelectedFile(null);

      setError(
        "Only PDF, DOC and DOCX files are allowed."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSelectedFile(null);

      setError(
        "Resume must be smaller than 5 MB."
      );

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setSelectedFile(file);
  }


  // =========================================================
  // CLEAR SELECTED FILE
  // =========================================================

  function clearSelectedFile() {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setError("");
    setSuccess("");
  }


  // =========================================================
  // UPLOAD
  // =========================================================

  async function handleUpload() {
    if (!userId) {
      setError(
        "User session not found. Please login again."
      );
      return;
    }

    if (!selectedFile) {
      setError("Please select a resume first.");
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const formData = new FormData();

      formData.append(
        "file",
        selectedFile
      );

      const response = await fetch(
        `${API_BASE_URL}/student/resume/${userId}/upload`,
        {
          method: "POST",
          body: formData,
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
          data?.detail || "Resume upload failed."
        );
      }

      setSuccess(
        "Resume uploaded successfully."
      );

      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadResumes();

    } catch (err) {
      setError(
        err?.message || "Resume upload failed."
      );
    } finally {
      setUploading(false);
    }
  }


  // =========================================================
  // DELETE
  // =========================================================

  async function handleDelete(resumeId) {
    if (!userId) {
      setError(
        "User session not found. Please login again."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(resumeId);
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/student/resume/${userId}/${resumeId}`,
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
          data?.detail || "Unable to delete resume."
        );
      }

      setSuccess(
        "Resume deleted successfully."
      );

      await loadResumes();

    } catch (err) {
      setError(
        err?.message || "Unable to delete resume."
      );
    } finally {
      setDeletingId(null);
    }
  }


  // =========================================================
  // FORMAT FILE SIZE
  // =========================================================

  function formatFileSize(bytes) {
    if (!bytes) {
      return "Unknown size";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(
      bytes /
      (1024 * 1024)
    ).toFixed(1)} MB`;
  }


  // =========================================================
  // FORMAT FILE NAME
  // =========================================================

  function getFileName(filePath) {
    if (!filePath) {
      return "Resume";
    }

    return filePath
      .split(/[\\/]/)
      .pop();
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section>

        <p className="text-sm font-semibold text-cyan-400">
          RESUME CENTER
        </p>

        <h1 className="mt-1 text-3xl font-black text-white">
          My Resume
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Upload your resume and prepare it for
          AI-powered skill extraction and
          opportunity matching.
        </p>

      </section>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}


      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-300">
          ✓ {success}
        </div>
      )}


      {/* =====================================================
          UPLOAD
      ===================================================== */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg">

        <div className="mb-5">

          <h2 className="text-xl font-bold text-white">
            Upload Resume
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            PDF, DOC or DOCX • Maximum 5 MB
          </p>

        </div>


        <label
          htmlFor="resume-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-400/30 bg-cyan-400/5 px-6 py-12 text-center transition hover:border-cyan-400/60 hover:bg-cyan-400/10"
        >

          <div className="text-4xl">
            📄
          </div>

          <p className="mt-4 font-bold text-white">
            Choose your resume
          </p>

          <p className="mt-1 text-sm text-slate-400">
            Click here to browse files
          </p>

          <input
            ref={fileInputRef}
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            className="hidden"
          />

        </label>


        {/* ===================================================
            SELECTED FILE
        =================================================== */}

        {selectedFile && (

          <div className="mt-5 rounded-xl border border-white/10 bg-slate-950 p-4">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="truncate font-semibold text-white">
                  {selectedFile.name}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {formatFileSize(
                    selectedFile.size
                  )}
                </p>

              </div>


              <div className="flex gap-2">

                <button
                  type="button"
                  onClick={clearSelectedFile}
                  disabled={uploading}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="rounded-xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload Resume →"}
                </button>

              </div>

            </div>

          </div>

        )}

      </section>


      {/* =====================================================
          RESUME LIST
      ===================================================== */}

      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-lg">

        <div className="mb-5 flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-white">
              Uploaded Resumes
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Your uploaded resume files.
            </p>

          </div>

          <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
            {resumes.length}
          </span>

        </div>


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="flex items-center justify-center gap-3 py-10 text-sm text-slate-400">

            <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-400/30 border-t-cyan-400" />

            Loading resumes...

          </div>


        ) : resumes.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================= */

          <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">

            <div className="text-4xl">
              📂
            </div>

            <p className="mt-3 font-semibold text-white">
              No resume uploaded yet
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Upload your resume to start the
              skill analysis process.
            </p>

          </div>


        ) : (

          /* =================================================
             RESUME ITEMS
          ================================================= */

          <div className="space-y-3">

            {resumes.map((resume) => (

              <div
                key={resume.id}
                className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:flex-row sm:items-center sm:justify-between"
              >

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
                    📄
                  </div>

                  <div className="min-w-0">

                    <p className="truncate font-semibold text-white">
                      {getFileName(
                        resume.file_path
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Resume #{resume.id}
                      {" • "}
                      Uploaded{" "}
                      {resume.uploaded_at ||
                        "recently"}
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    handleDelete(resume.id)
                  }
                  disabled={
                    deletingId === resume.id
                  }
                  className="rounded-lg border border-rose-400/20 px-4 py-2 text-sm font-semibold text-rose-300 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {deletingId === resume.id
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>

            ))}

          </div>

        )}

      </section>


      {/* =====================================================
          NEXT STEP
      ===================================================== */}

      <section className="rounded-2xl border border-cyan-400/10 bg-cyan-400/5 p-5">

        <p className="text-sm font-semibold text-cyan-400">
          NEXT STEP
        </p>

        <h3 className="mt-1 text-lg font-bold text-white">
          AI Skill Extraction
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Your resume is stored securely in the
          AcademiaConnect backend. The next module
          will extract technical and professional
          skills from the uploaded resume.
        </p>

        <Link
          to="/student/skills"
          className="mt-4 inline-block rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300"
        >
          Go to Skills →
        </Link>

      </section>

    </div>
  );
}


export default StudentResume;