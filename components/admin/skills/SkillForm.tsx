"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  createSkill,
  updateSkill,
} from "@/app/admin/skills/actions";

type Skill = {
  id: string;
  name: string;
  category: string;
  icon_name: string | null;
  proficiency: number | null;
  years_experience: number | null;
  display_order: number;
  visible: boolean;
};

type Props = {
  skill?: Skill;
  onDone?: () => void;
};

type ActionState = {
  error?: string;
  success?: string;
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
          : "Create skill"}
    </button>
  );
}

export default function SkillForm({ skill, onDone }: Props) {
  const editing = Boolean(skill);

  const action = editing
    ? updateSkill.bind(null, skill!.id)
    : createSkill;

  const [state, formAction] = useActionState<ActionState, FormData>(
    action,
    {},
  );

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
          label="Skill name"
          name="name"
          required
          defaultValue={skill?.name ?? ""}
          placeholder="Python"
        />

        <Field
          label="Category"
          name="category"
          required
          defaultValue={skill?.category ?? ""}
          placeholder="Backend Development"
        />

        <Field
          label="Icon name"
          name="icon_name"
          defaultValue={skill?.icon_name ?? ""}
          placeholder="python"
        />

        <Field
          label="Proficiency"
          name="proficiency"
          type="number"
          min="0"
          max="100"
          defaultValue={
            skill?.proficiency != null
              ? String(skill.proficiency)
              : ""
          }
          placeholder="85"
        />

        <Field
          label="Years of experience"
          name="years_experience"
          type="number"
          step="0.1"
          min="0"
          defaultValue={
            skill?.years_experience != null
              ? String(skill.years_experience)
              : ""
          }
          placeholder="2.5"
        />

        <Field
          label="Display order"
          name="display_order"
          type="number"
          defaultValue={String(skill?.display_order ?? 0)}
          placeholder="0"
        />
      </div>

      <label className="flex cursor-pointer items-center gap-3 text-sm text-zinc-300">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={skill?.visible ?? true}
          className="h-4 w-4 rounded border-zinc-700 bg-zinc-900"
        />
        Visible on portfolio
      </label>

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
  min,
  max,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
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
        min={min}
        max={max}
        step={step}
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
      />
    </div>
  );
}