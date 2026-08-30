"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEducation } from "@/app/admin/education/actions";
import EducationForm from "./EducationForm";

export type Edu = {
  id: string;
  degree: string;
  field_of_study: string | null;
  institution: string;
  location: string | null;
  grade: string | null;
  start_date: string;
  end_date: string | null;
  current_status: "PRESENT" | "HOLD" | null;
  description: string | null;
  display_order: number;
  visible: boolean;
};

export default function EducationClient({
  initialEducation,
}: {
  initialEducation: Edu[];
}) {
  const [educations, setEducations] = useState<Edu[]>(initialEducation);
  const [editing, setEditing] = useState<Edu | undefined>();
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const openCreate = () => {
    setEditing(undefined);
    setShowForm(true);
  };

  const openEdit = (edu: Edu) => {
    setEditing(edu);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(undefined);
    router.refresh();
  };

  const handleDelete = async (edu: Edu) => {
    if (!window.confirm(`Delete "${edu.degree}" at ${edu.institution}?`))
      return;
    const result = await deleteEducation(edu.id);
    if (!result.success) {
      window.alert(result.error ?? "Delete failed.");
      return;
    }
    setEducations((e) => e.filter((x) => x.id !== edu.id));
    router.refresh();
  };

  return (
    <section className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Education</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg flex gap-2 items-center bg-white text-black px-4 py-2.5 hover:bg-zinc-200"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Education
        </button>
      </header>

      {showForm && (
  <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
    <h2 className="font-semibold text-xl mb-4">
      {editing ? "Edit Education" : "Add Education"}
    </h2>
    <EducationForm education={editing} onDone={closeForm} />
  </div>
  )}

      {educations.length === 0 ? (
        <div className="border-dashed border border-zinc-800 p-12 rounded-2xl bg-zinc-950/50 text-center text-zinc-400">
          <svg className="h-10 w-10 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polygon points="12 8 16 12 12 16 8 12 12 8"/>
          </svg>
          <h3 className="text-lg font-semibold">No education records yet.</h3>
          <p className="mt-2 text-sm">Use the button above to add your first entry.</p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-6 rounded-lg bg-white px-5 py-2 text-black hover:bg-zinc-200 flex items-center gap-2"
          >
            Add first education
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {educations.map((edu) => (
            <article key={edu.id} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{edu.degree}</h2>
                  <p className="mt-1 text-zinc-300">{edu.institution}</p>
                  {edu.field_of_study && (
                    <p className="mt-1 text-zinc-400">{edu.field_of_study}</p>
                  )}
                  <p className="mt-2 text-sm text-zinc-500">
                    {edu.start_date} – {edu.current_status === "HOLD" ? "HOLD" : edu.end_date ?? "PRESENT"}
                  </p>
                  {edu.description && (
                    <p className="mt-2 text-sm text-zinc-400">{edu.description}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      edu.visible
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-zinc-800 text-zinc-500"
                    }`}
                  >
                    {edu.visible ? "Visible" : "Hidden"}
                  </span>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => openEdit(edu)}
                      aria-label="Edit education"
                      className="rounded-lg border border-zinc-800 px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(edu)}
                      aria-label="Delete education"
                      className="rounded-lg border border-red-950 px-3 py-2 text-sm text-red-400 hover:bg-red-950/40 flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18" />
                        <path d="M8 6V4h8v2" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v5" />
                        <path d="M14 11v5" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
