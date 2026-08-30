"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteResume, uploadResume } from "./actions";

export type Resume = {
  id: string;
  title: string;
  file_url: string;
  is_active: boolean;
  created_at: string;
};

type State = {
  success?: string;
  error?: string;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
    >
      {pending ? "Uploading..." : "Upload Resume"}
    </button>
  );
}

export default function ResumeClient({
  initialResumes,
}: {
  initialResumes: Resume[];
}) {
  const [resumes, setResumes] = useState(initialResumes);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Delete this resume? This cannot be undone.",
    );

    if (!confirmed) return;

    const result = await deleteResume(id);

    if (result.error) {
      window.alert(result.error);
      return;
    }

    setResumes((current) => current.filter((resume) => resume.id !== id));
  }

  const [state, formAction] = useActionState<State, FormData>(
    uploadResume,
    {},
  );

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  useEffect(() => {
    setResumes(initialResumes);
  }, [initialResumes]);

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-white">
          Resumes
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Upload and manage your portfolio resume.
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="mb-6 text-xl font-semibold text-white">
          Upload New Resume
        </h2>

        <form action={formAction} className="space-y-5">
          {state.error && (
            <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
              {state.error}
            </div>
          )}

          {state.success && (
            <div className="rounded-lg border border-green-900/50 bg-green-950/30 p-4 text-sm text-green-400">
              {state.success}
            </div>
          )}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Resume Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="My Professional Resume"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
            />
          </div>

          <div>
            <label
              htmlFor="file"
              className="mb-2 block text-sm font-medium text-zinc-300"
            >
              Resume File
            </label>

            <input
              id="file"
              name="file"
              type="file"
              required
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="block w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-md file:border-0 file:bg-zinc-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-zinc-700"
            />

            <p className="mt-2 text-xs text-zinc-500">
              PDF, DOC, or DOCX. Maximum 10 MB.
            </p>
          </div>

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Uploaded Resumes
        </h2>

        {resumes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
            <h3 className="text-lg font-semibold text-white">
              No resumes yet
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Upload your first resume above.
            </p>
          </div>
        ) : (
          resumes.map((resume) => (
            <article
              key={resume.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-white">
                      {resume.title}
                    </h3>

                    {resume.is_active && (
                      <span className="rounded-full bg-green-950 px-3 py-1 text-xs text-green-400">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-zinc-500">
                    Uploaded{" "}
                    {new Date(
                      resume.created_at,
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
                  >
                    View Resume
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(resume.id)}
                    className="rounded-lg border border-red-900/60 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}