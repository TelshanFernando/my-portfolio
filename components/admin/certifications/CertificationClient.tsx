"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  deleteCertification,
} from "@/app/admin/certifications/actions";
import CertificationForm from "./CertificationForm";

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
  initialCertifications: Certification[];
};

export default function CertificationClient({
  initialCertifications,
}: Props) {
  const router = useRouter();

  const [items, setItems] =
    useState<Certification[]>(initialCertifications);

  const [editing, setEditing] =
    useState<Certification | undefined>();

  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const refresh = () => {
    setShowForm(false);
    setEditing(undefined);
    router.refresh();
  };

  const openCreate = () => {
    setEditing(undefined);
    setShowForm(true);
  };

  const openEdit = (item: Certification) => {
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (item: Certification) => {
    const confirmed = window.confirm(
      `Delete "${item.name}"? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(item.id);

    try {
      const result = await deleteCertification(item.id);

      if (result.error) {
        window.alert(result.error);
        return;
      }

      setItems((current) =>
        current.filter((entry) => entry.id !== item.id),
      );

      router.refresh();
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete certification.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Certifications
          </h1>

          <p className="mt-1 text-sm text-zinc-400">
            Manage the certifications displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          + Add Certification
        </button>
      </header>

      {showForm && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              {editing
                ? "Edit Certification"
                : "Add Certification"}
            </h2>

            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditing(undefined);
              }}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <CertificationForm
            certification={editing}
            onDone={refresh}
          />
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
          <h2 className="text-lg font-semibold text-white">
            No certifications yet
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            Add your first certification.
          </p>

          <button
            type="button"
            onClick={openCreate}
            className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black"
          >
            Add Certification
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const deleting = deletingId === item.id;

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-white">
                        {item.name}
                      </h2>

                      <span
                        className={
                          item.visible
                            ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                            : "rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-500"
                        }
                      >
                        {item.visible ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <p className="mt-2 text-zinc-400">
                      {item.issuing_organization}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-zinc-500">
                      <p>
                        Issue date: {item.issue_date}
                      </p>

                      {item.expiry_date && (
                        <p>
                          Expiry date: {item.expiry_date}
                        </p>
                      )}

                      {item.credential_id && (
                        <p>
                          Credential ID: {item.credential_id}
                        </p>
                      )}

                      {item.credential_url && (
                        <a
                          href={item.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-zinc-300 underline"
                        >
                          Verify credential
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      disabled={deleting}
                      className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={deleting}
                      className="rounded-lg border border-red-950 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40 disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}