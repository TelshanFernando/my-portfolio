"use client";

import {
  useActionState,
  useEffect,
} from "react";
import { useFormStatus } from "react-dom";
import { createService,  updateService,} from "@/app/admin/services/actions";
import type { Service } from "./ServiceClient";

type Props = {
  service?: Service;
  onDone: () => void;
};

type State = {
  success?: string;
  error?: string;
};

export default function ServiceForm({
  service,
  onDone,
}: Props) {
  const editing = Boolean(service);

  const action = editing
    ? updateService.bind(null, service!.id)
    : createService;

  const [state, formAction] =
    useActionState<State, FormData>(action, {});

  useEffect(() => {
    if (state.success) {
      onDone();
    }
  }, [state.success, onDone]);

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg bg-red-950/40 p-4 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Title"
          name="title"
          required
          defaultValue={service?.title ?? ""}
          placeholder="Web Development"
        />

        <Field
          label="Icon Name"
          name="icon"
          defaultValue={service?.icon_name ?? ""}
          placeholder="code"
        />

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Description
          </label>

          <textarea
            name="description"
            required
            rows={5}
            defaultValue={service?.description ?? ""}
            placeholder="Describe the service..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>

        <Field
          label="Price"
          name="price"
          defaultValue={service?.price ?? ""}
          placeholder="Starting from $500"
        />

        <Field
          label="Display Order"
          name="display"
          type="number"
          defaultValue={String(
            service?.display_order ?? 0,
          )}
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-300">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={service?.visible ?? true}
          className="h-4 w-4"
        />
        Display this service on my portfolio
      </label>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onDone}
          className="rounded-lg border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
        >
          Cancel
        </button>

        <SubmitButton editing={editing} />
      </div>
    </form>
  );
}

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
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
    >
      {pending
        ? "Saving..."
        : editing
          ? "Save Changes"
          : "Add Service"}
    </button>
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
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <input
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