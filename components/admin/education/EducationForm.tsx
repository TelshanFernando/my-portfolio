"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  createEducation,
  updateEducation,
} from "@/app/admin/education/actions";

export type Edu = {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string | null;
  location: string | null;
  start_date: string;
  end_date: string | null;
  description: string | null;
  grade: string | null;
  display_order: number;
  visible: boolean;
  current_status?: "PRESENT" | "HOLD" | null;
};

export type Props = {
  education?: Edu;
  onDone?: () => void;
};

type ActionState = {
  success?: string;
  error?: string;
};

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
    >
      {pending
        ? editing
          ? "Saving..."
          : "Creating..."
        : editing
          ? "Save changes"
          : "Add Education"}
    </button>
  );
}

export default function EducationForm({
  education,
  onDone,
}: Props) {
  const editing = Boolean(education);

  const [isCurrent, setIsCurrent] = useState(
    Boolean(education && !education.end_date)
  );
  const [currentStatus, setCurrentStatus] = useState<"PRESENT" | "HOLD">(
    education?.current_status === "HOLD" ? "HOLD" : "PRESENT"
  );

  const action = editing
    ? updateEducation.bind(null, education!.id)
    : createEducation;

  const [state, formAction] = useActionState<
    ActionState,
    FormData
  >(action, {});

  useEffect(() => {
    if (state.success) {
      onDone?.();
    }
  }, [state.success, onDone]);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-950 p-4 text-red-300">
          {state.error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Institution"
          name="institution"
          required
          defaultValue={education?.institution ?? ""}
          placeholder="University / Institution"
        />

        <Field
          label="Degree / Qualification"
          name="degree"
          required
          defaultValue={education?.degree ?? ""}
          placeholder="Bachelor of Science"
        />

        <Field
          label="Field of Study"
          name="field_of_study"
          defaultValue={education?.field_of_study ?? ""}
          placeholder="Computer Science"
        />

        <Field
          label="Location"
          name="location"
          defaultValue={education?.location ?? ""}
          placeholder="Colombo, Sri Lanka"
        />

        <Field
          label="Start date"
          name="start_date"
          required
          type="date"
          defaultValue={education?.start_date ?? ""}
        />

        <div>
          <label
            htmlFor="end_date"
            className="block text-sm font-medium text-zinc-300"
          >
            End date
          </label>

          <input
            id="end_date"
            name="end_date"
            type="date"
            disabled={isCurrent}
            defaultValue={education?.end_date && education.end_date !== "HOLD" ? education.end_date : ""}
            className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-white outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />

          <label className="mt-3 flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={isCurrent}
              onChange={(event) => setIsCurrent(event.target.checked)}
              className="h-4 w-4 rounded border-zinc-700 bg-zinc-950"
            />
            Currently studying
          </label>

          {isCurrent && (
            <div className="mt-3">
              <label
                htmlFor="current_status"
                className="block text-sm font-medium text-zinc-300"
              >
                Display as
              </label>
              <select
                id="current_status"
                name="current_status"
                value={currentStatus}
                onChange={(event) =>
                  setCurrentStatus(event.target.value as "PRESENT" | "HOLD")
                }
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-white outline-none focus:border-zinc-600"
              >
                <option value="PRESENT">PRESENT</option>
                <option value="HOLD">HOLD</option>
              </select>
            </div>
          )}

          {isCurrent && (
            <input type="hidden" name="current_status" value={currentStatus} />
          )}
        </div>

        <Field
          label="Grade"
          name="grade"
          defaultValue={education?.grade ?? ""}
          placeholder="First Class / 3.8 GPA / A"
        />

        <Field
          label="Display Order"
          name="display_order"
          type="number"
          min="0"
          defaultValue={String(
            education?.display_order ?? 0
          )}
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-zinc-300"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={education?.description ?? ""}
          placeholder="Describe your education, achievements, coursework, etc."
          className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
        />
      </div>

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="visible"
            defaultChecked={education?.visible ?? true}
            className="h-4 w-4 rounded border-zinc-700 bg-zinc-950"
          />
          Visible in portfolio
        </label>
      </div>

      <div className="mt-5 flex items-center justify-end gap-3">
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
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue: string;
  placeholder?: string;
  min?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-zinc-300"
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
        min={min}
        className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
      />
    </div>
  );
}