"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createProject, updateProject } from "@/app/admin/projects/actions";

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

type Props = {
  project?: Project;
  onDone?: () => void;
};

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending
        ? editing
          ? "Saving..."
          : "Creating..."
        : editing
          ? "Save changes"
          : "Create project"}
    </button>
  );
}

export default function ProjectForm({ project, onDone }: Props) {
  const editing = Boolean(project);

  const action = editing
    ? updateProject.bind(null, project!.id)
    : createProject;

  const [state, formAction] = useActionState(action, {});

  useEffect(() => {
    if (state.success) {
      onDone?.();
    }
  }, [state.success, onDone]);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-lg border border-emerald-900 bg-emerald-950/40 p-4 text-sm text-emerald-300">
          {state.success}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Title"
          name="title"
          required
          defaultValue={project?.title ?? ""}
          placeholder="My Portfolio Website"
        />

        <Field
          label="Slug"
          name="slug"
          defaultValue={project?.slug ?? ""}
          placeholder="my-portfolio-website"
        />

        <Field
          label="Category"
          name="category"
          defaultValue={project?.category ?? ""}
          placeholder="Web Development"
        />

        <Field
          label="Display order"
          name="display_order"
          type="number"
          defaultValue={String(project?.display_order ?? 0)}
        />

        <Field
          label="Image URL"
          name="image_url"
          type="url"
          defaultValue={project?.image_url ?? ""}
          placeholder="https://..."
        />

        <Field
          label="GitHub URL"
          name="github_url"
          type="url"
          defaultValue={project?.github_url ?? ""}
          placeholder="https://github.com/..."
        />

        <Field
          label="Live URL"
          name="live_url"
          type="url"
          defaultValue={project?.live_url ?? ""}
          placeholder="https://..."
        />
      </div>

      <TextArea
        label="Short description"
        name="short_description"
        defaultValue={project?.short_description ?? ""}
        placeholder="A short summary of the project..."
        rows={3}
      />

      <TextArea
        label="Description"
        name="description"
        defaultValue={project?.description ?? ""}
        placeholder="Describe the project, architecture, technologies and your role..."
        rows={8}
      />

      <div className="flex flex-wrap gap-6">
        <Checkbox
          name="featured"
          label="Featured project"
          defaultChecked={project?.featured ?? false}
        />

        <Checkbox
          name="published"
          label="Published"
          defaultChecked={project?.published ?? true}
        />
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-5">
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-900"
          >
            Cancel
          </button>
        )}

        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  rows,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder?: string;
  rows: number;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-zinc-300"
      >
        {label}
      </label>

      <textarea
        id={name}
        name={name}
        rows={rows}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full resize-y rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
      />
    </div>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950"
      />
      {label}
    </label>
  );
}
