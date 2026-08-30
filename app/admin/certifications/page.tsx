import { createClient } from "@/lib/supabase/server";
import CertificationClient from "./CertificationClient";

export default async function CertificationsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("certifications")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section
        role="alert"
        className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-red-300"
      >
        <h1 className="text-lg font-semibold">Unable to load certifications</h1>
        <p className="mt-1 text-sm text-red-300/80">{error.message}</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Certifications
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Add, edit, and manage the certifications displayed on your portfolio.
        </p>
      </div>

      <CertificationClient initialCertifications={data ?? []} />
    </section>
  );
}
