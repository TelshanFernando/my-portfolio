"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  createExperience,
  updateExperience,
} from "@/app/admin/experience/actions";

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

type Props = {
  experience?: Experience;
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
          : "Add experience"}
    </button>
  );
}

export default function ExperienceForm({
  experience,
  onDone,
}: Props) {
  const editing = Boolean(experience);

  const action = editing
    ? updateExperience.bind(null, experience!.id)
    : createExperience;

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

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Company name"
          name="company_name"
          required
          defaultValue={experience?.company_name ?? ""}
          placeholder="Company name"
        />

        <Field
          label="Position"
          name="position"
          required
          defaultValue={experience?.position ?? ""}
          placeholder="Support Analyst"
        />

        <Field
          label="Location"
          name="location"
          defaultValue={experience?.location ?? ""}
          placeholder="Colombo, Sri Lanka"
        />

        <Field
          label="Display order"
          name="display_order"
          type="number"
          defaultValue={String(experience?.display_order ?? 0)}
        />

        <Field
          label="Start date"
          name="start_date"
          type="date"
          required
          defaultValue={experience?.start_date ?? ""}
        />

        <Field
          label="End date"
          name="end_date"
          type="date"
          defaultValue={experience?.end_date ?? ""}
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox
          name="current_position"
          label="Current position"
          defaultChecked={experience?.current_position ?? false}
        />

        <Checkbox
          name="visible"
          label="Visible on portfolio"
          defaultChecked={experience?.visible ?? true}
        />
      </div>

      <TextArea
        label="Description"
        name="description"
        defaultValue={experience?.description ?? ""}
        placeholder="Describe your role and overall experience..."
        rows={5}
      />

      <TextArea
        label="Responsibilities"
        name="responsibilities"
        defaultValue={
          experience?.responsibilities?.join("\n") ?? ""
        }
        placeholder={`One responsibility per line
Investigated technical issues
Managed support tickets
Worked with internal teams`}
        rows={7}
      />

      <TextArea
        label="Technologies"
        name="technologies"
        defaultValue={
          experience?.technologies?.join("\n") ?? ""
        }
        placeholder={`One technology per line
Python
SQL
FastAPI
PostgreSQL`}
        rows={5}
      />

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
        name={name}
        type="checkbox"
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-zinc-700 bg-zinc-950"
      />

      {label}
    </label>
  );
}
