"use client";

import { useState } from "react";
import { FolderKanban, Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import ProjectForm from "./ProjectForm";
import { deleteProject } from "@/app/admin/projects/actions";

type Project = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  github_url: string | null;
  live_url: string | null;
  category: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
};

export default function ProjectsClient({
  initialProjects,
}: {
  initialProjects: Project[];
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [editing, setEditing] = useState<Project | undefined>();
  const [showForm, setShowForm] = useState(false);

  function openCreate() {
    setEditing(undefined);
    setShowForm(true);
  }

  function openEdit(project: Project) {
    setEditing(project);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditing(undefined);
    window.location.reload();
  }

  async function handleDelete(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    const result = await deleteProject(project.id);

    if (!result.success) {
      window.alert(result.error ?? "Failed to delete project.");
      return;
    }

    setProjects((current) =>
      current.filter((item) => item.id !== project.id),
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <FolderKanban className="h-7 w-7 text-zinc-400" />
            <h1 className="text-3xl font-bold">Projects</h1>
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            Manage the projects displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          Add project
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 text-xl font-semibold">
            {editing ? "Edit project" : "Create project"}
          </h2>

          <ProjectForm project={editing} onDone={closeForm} />
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/50 p-12 text-center">
          <FolderKanban className="mx-auto h-10 w-10 text-zinc-700" />

          <h2 className="mt-4 text-lg font-semibold">
            No projects yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Add your first project to start building your portfolio.
          </p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-6 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-zinc-200"
          >
            Add your first project
          </button>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950"
            >
              {project.image_url ? (
                <div className="aspect-video overflow-hidden bg-zinc-900">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex aspect-video items-center justify-center bg-zinc-900">
                  <FolderKanban className="h-12 w-12 text-zinc-700" />
                </div>
              )}

              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {project.title}
                    </h2>

                    {project.category && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {project.category}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {project.featured && (
                      <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs text-amber-400">
                        Featured
                      </span>
                    )}

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        project.published
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-zinc-800 text-zinc-500"
                      }`}
                    >
                      {project.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>

                {project.short_description && (
                  <p className="mt-4 line-clamp-2 text-sm leading-6 text-zinc-400">
                    {project.short_description}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900"
                    >
                      Live
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-900"
                    >
                      GitHub
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(project)}
                      className="rounded-lg border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      title="Edit project"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(project)}
                      className="rounded-lg border border-red-950 p-2 text-red-400 hover:bg-red-950/40"
                      title="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
