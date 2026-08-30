import { createClient } from "@/lib/supabase/server";
import ServiceClient from "./ServiceClient";

export default async function ServicesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-red-400">
        Failed to load services: {error.message}
      </div>
    );
  }

  return <ServiceClient initialServices={data ?? []} />;
}