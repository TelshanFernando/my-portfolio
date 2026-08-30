"use client";

import { useState } from "react";
import {
  BriefcaseBusiness,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  CalendarDays,
} from "lucide-react";
import ExperienceForm from "./ExperienceForm";
import { deleteExperience } from "@/app/admin/experience/actions";

type Experience = {
  id: string;
  company_name: string;
  position: string;
  location: string | null;
  start_date: string;
  end_date: string | null;
  current_position: boolean;
  description: string | null;
  responsibilities: string[] | null;
  technologies: string[] | null;
  display_order: number;
  visible: boolean;
};

export default function ExperienceClient({
  initialExperiences,
}: {
  initialExperiences: Experience[];
}) {
  const [experiences, setExperiences] =
    useState(initialExperiences);

  const [editing, setEditing] =
    useState<Experience | undefined>();

  const [showForm, setShowForm] = useState(false);

  function openCreate() {
    setEditing(undefined);
    setShowForm(true);
  }

  function openEdit(experience: Experience) {
    setEditing(experience);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(undefined);
    window.location.reload();
  }

  async function handleDelete(experience: Experience) {
    const confirmed = window.confirm(
      `Delete "${experience.position}" at "${experience.company_name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    const result = await deleteExperience(experience.id);

    if (!result.success) {
      window.alert(
        result.error ?? "Failed to delete experience.",
      );
      return;
    }

    setExperiences((current) =>
      current.filter(
        (item) => item.id !== experience.id,
      ),
    );
  }

  function formatDate(date: string | null) {
    if (!date) return "Present";

    return new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="h-7 w-7 text-zinc-400" />

            <h1 className="text-3xl font-bold">
              Experience
            </h1>
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            Manage your professional experience displayed on
            your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          Add experience
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {editing
              ? "Edit experience"
              : "Add experience"}
          </h2>

          <ExperienceForm
            experience={editing}
            onDone={closeForm}
          />
        </div>
      )}

      {experiences.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-12 text-center">
          <BriefcaseBusiness className="mx-auto h-10 w-10 text-zinc-700" />

          <h2 className="mt-4 text-lg font-semibold">
            No experience yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Add your first professional experience.
          </p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Add your first experience
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {experiences.map((experience) => (
            <article
              key={experience.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold">
                      {experience.position}
                    </h2>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        experience.visible
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {experience.visible
                        ? "Visible"
                        : "Hidden"}
                    </span>

                    {experience.current_position && (
                      <span className="rounded-full bg-blue-500/10 px-2.5 py-1 text-xs text-blue-400">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-base text-zinc-300">
                    {experience.company_name}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-zinc-500">
                    {experience.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {experience.location}
                      </span>
                    )}

                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" />

                      {formatDate(
                        experience.start_date,
                      )}{" "}
                      —{" "}
                      {experience.current_position
                        ? "Present"
                        : formatDate(
                            experience.end_date,
                          )}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(experience)
                    }
                    className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    title="Edit experience"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(experience)
                    }
                    className="rounded-lg border border-red-950 p-2 text-red-400 hover:bg-red-950/40"
                    title="Delete experience"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {experience.description && (
                <p className="mt-5 whitespace-pre-line text-sm leading-6 text-zinc-400">
                  {experience.description}
                </p>
              )}

              {experience.responsibilities &&
                experience.responsibilities.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-sm font-medium text-zinc-300">
                      Responsibilities
                    </h3>

                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-500">
                      {experience.responsibilities.map(
                        (item, index) => (
                          <li key={`${item}-${index}`}>
                            {item}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {experience.technologies &&
                experience.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.technologies.map(
                      (technology, index) => (
                        <span
                          key={`${technology}-${index}`}
                          className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400"
                        >
                          {technology}
                        </span>
                      ),
                    )}
                  </div>
                )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
