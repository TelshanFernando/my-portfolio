"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCertification } from "./actions";
import CertificationForm from "./CertificationForm";

export type Certification = {
  id: string;
  title: string;
  issuing_organization: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  display_order: number;
  visible: boolean;
};

type CertificationClientProps = {
  initialCertifications: Certification[];
};

export default function CertificationClient({
  initialCertifications,
}: CertificationClientProps) {
  const router = useRouter();
  const [certifications, setCertifications] = useState<Certification[]>(
    initialCertifications,
  );
  const [editing, setEditing] = useState<Certification | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditing(undefined);
    setShowForm(true);
  };

  const openEdit = (certification: Certification) => {
    setEditing(certification);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(undefined);
    router.refresh();
  };

  const handleDelete = async (certification: Certification) => {
    const confirmed = window.confirm(
      `Delete "${certification.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(certification.id);

    try {
      const result = await deleteCertification(certification.id);

      if (result.error) {
        window.alert(result.error);
        return;
      }

      setCertifications((current) =>
        current.filter((item) => item.id !== certification.id),
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to delete certification:", error);
      window.alert("Failed to delete certification. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Certifications</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Add and manage certifications displayed on your portfolio.
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
          <h2 className="mb-6 text-xl font-semibold text-white">
            {editing ? "Edit Certification" : "Add Certification"}
          </h2>
          <CertificationForm certification={editing} onDone={closeForm} />
        </div>
      )}

      {certifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-12 text-center">
          <h2 className="text-lg font-semibold text-white">
            No certifications yet
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Add your first certification.
          </p>
          {!showForm && (
            <button
              type="button"
              onClick={openCreate}
              className="mt-6 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
            >
              Add Certification
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {certifications.map((certification) => {
            const deleting = deletingId === certification.id;

            return (
              <article
                key={certification.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-xl font-semibold text-white">
                        {certification.title}
                      </h2>
                      <span
                        className={
                          certification.visible
                            ? "rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                            : "rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-500"
                        }
                      >
                        {certification.visible ? "Visible" : "Hidden"}
                      </span>
                    </div>

                    <p className="mt-2 text-zinc-300">
                      {certification.issuing_organization}
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      Issued: {certification.issue_date}
                      {certification.expiry_date
                        ? ` • Expires: ${certification.expiry_date}`
                        : ""}
                    </p>

                    {certification.credential_id && (
                      <p className="mt-2 text-sm text-zinc-500">
                        Credential ID: {certification.credential_id}
                      </p>
                    )}

                    {certification.credential_url && (
                      <a
                        href={certification.credential_url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-sm text-zinc-300 underline underline-offset-4 hover:text-white"
                      >
                        View credential
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => openEdit(certification)}
                      className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900 disabled:opacity-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => handleDelete(certification)}
                      className="rounded-lg border border-red-900 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40 disabled:opacity-50"
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