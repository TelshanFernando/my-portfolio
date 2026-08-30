"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { createCertification, updateCertification } from "@/app/admin/certifications/actions";

type ActionState = {
  success?: string;
  error?: string;
};

export type Certification = {
  id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  display_order: number;
  visible: boolean;
};

type Props = {
  certification?: Certification;
  onDone?: () => void;
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
      className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200 disabled:opacity-50"
    >
      {pending
        ? "Saving..."
        : editing
          ? "Save Changes"
          : "Add Certification"}
    </button>
  );
}

export default function CertificationForm({
  certification,
  onDone,
}: Props) {
  const editing = Boolean(certification);

  const action = editing
    ? updateCertification.bind(null, certification!.id)
    : createCertification;

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
        <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Name"
          name="name"
          required
          defaultValue={certification?.name ?? ""}
          placeholder="AWS Certified Cloud Practitioner"
        />

        <Field
          label="Issuing Organization"
          name="issuing_organization"
          required
          defaultValue={certification?.issuing_organization ?? ""}
          placeholder="Amazon Web Services"
        />

        <Field
          label="Issue Date"
          name="issue_date"
          type="date"
          required
          defaultValue={certification?.issue_date ?? ""}
        />

        <Field
          label="Expiry Date"
          name="expiry_date"
          type="date"
          defaultValue={certification?.expiry_date ?? ""}
        />

        <Field
          label="Credential ID"
          name="credential_id"
          defaultValue={certification?.credential_id ?? ""}
          placeholder="Credential ID"
        />

        <Field
          label="Verification URL"
          name="credential_url"
          type="url"
          defaultValue={certification?.credential_url ?? ""}
          placeholder="https://..."
        />

        <Field
          label="Display Order"
          name="display_order"
          type="number"
          defaultValue={String(certification?.display_order ?? 0)}
        />
      </div>

      <label className="flex items-center gap-3 text-sm text-zinc-300">
        <input
          type="checkbox"
          name="visible"
          defaultChecked={certification?.visible ?? true}
          className="h-4 w-4"
        />
        Display this certification on my portfolio
      </label>

      <div className="flex justify-end gap-3">
        {onDone && (
          <button
            type="button"
            onClick={onDone}
            className="rounded-lg border border-zinc-800 px-5 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
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
        className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
      />
    </div>
  );
}