"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  createSocialLink,
  updateSocialLink,
} from "./actions";
import type { SocialLink } from "./SocialLinkClient";

type Props = {
  socialLink?: SocialLink;
  onDone?: () => void;
};

type ActionState = {
  success?: string;
  error?: string;
};

function SubmitButton({
  editing,
}: {
  editing: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending
        ? "Saving..."
        : editing
          ? "Save Changes"
          : "Add Social Link"}
    </button>
  );
}

export default function SocialLinkForm({
  socialLink,
  onDone,
}: Props) {
  const editing = Boolean(socialLink);

  const action = editing
    ? updateSocialLink.bind(null, socialLink!.id)
    : createSocialLink;

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
        <div className="rounded-lg border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Platform"
          name="platform"
          required
          defaultValue={socialLink?.platform ?? ""}
          placeholder="GitHub"
        />

        <Field
          label="URL"
          name="url"
          type="url"
          required
          defaultValue={socialLink?.url ?? ""}
          placeholder="https://github.com/username"
        />

        <Field
          label="Icon"
          name="icon"
          defaultValue={socialLink?.icon ?? ""}
          placeholder="github"
        />

        <Field
          label="Display Order"
          name="display_order"
          type="number"
          defaultValue={String(
            socialLink?.display_order ?? 0,
          )}
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-300">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={socialLink?.visible ?? true}
          className="h-4 w-4 rounded"
        />

        Display this social link on my portfolio
      </label>

      <div className="flex justify-end gap-3">
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg border border-zinc-700 px-5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
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
  required = false,
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
    <div className="space-y-2">
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
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
      />
    </div>
  );
}