"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteService } from "@/app/admin/services/actions";
import ServiceForm from "./ServiceForm";

export type Service = {
  id: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  price: string | null;
  display_order: number;
  visible: boolean;
};

type ServiceClientProps = {
  initialServices?: Service[] | null;
};

export default function ServiceClient({
  initialServices,
}: ServiceClientProps) {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>(
    Array.isArray(initialServices) ? initialServices : [],
  );
  const [editing, setEditing] = useState<Service | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const done = () => {
    setShowForm(false);
    setEditing(undefined);
    router.refresh();
  };

  const deleteItem = async (service: Service) => {
    if (!window.confirm(`Delete "${service.title}"? This cannot be undone.`)) {
      return;
    }

    setDeletingId(service.id);

    try {
      const result = await deleteService(service.id);

      if (result.error) {
        window.alert(result.error);
        return;
      }

      setServices((current) =>
        current.filter((item) => item.id !== service.id),
      );
      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error ? error.message : "Failed to delete service.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Services</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage services displayed on your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditing(undefined);
            setShowForm(true);
          }}
          className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-200"
        >
          + Add Service
        </button>
      </header>

      {showForm && (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
          <h2 className="mb-6 text-xl font-semibold text-white">
            {editing ? "Edit Service" : "Add Service"}
          </h2>
          <ServiceForm service={editing} onDone={done} />
        </div>
      )}

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 p-12 text-center">
          <h2 className="text-lg font-semibold text-white">No services yet</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Add your first service using the button below.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditing(undefined);
              setShowForm(true);
            }}
            className="mt-6 rounded-lg bg-white px-5 py-2.5 font-semibold text-black hover:bg-zinc-200"
          >
            Add Service
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <article
              key={service.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-white">
                      {service.title}
                    </h2>
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400">
                      {service.visible ? "Visible" : "Hidden"}
                    </span>
                  </div>

                  <p className="mt-2 text-zinc-400">
                    {service.description || "No description provided."}
                  </p>

                  {service.icon_name && (
                    <p className="mt-2 text-sm text-zinc-500">
                      Icon: {service.icon_name}
                    </p>
                  )}

                  {service.price && (
                    <p className="mt-1 text-sm text-zinc-500">
                      Price: {service.price}
                    </p>
                  )}

                  <p className="mt-1 text-sm text-zinc-600">
                    Display order: {service.display_order}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(service);
                      setShowForm(true);
                    }}
                    className="rounded-lg border border-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-900"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={deletingId === service.id}
                    onClick={() => deleteItem(service)}
                    className="rounded-lg border border-red-950 px-4 py-2 text-sm text-red-400 hover:bg-red-950/40 disabled:opacity-50"
                  >
                    {deletingId === service.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}