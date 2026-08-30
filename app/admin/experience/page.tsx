import { createClient } from "@/lib/supabase/server";
import ExperienceClient from "@/components/admin/experience/ExperienceClient";

export default async function ExperiencePage() {
  const supabase = await createClient();

  const { data: experiences, error } = await supabase
    .from("experience")
    .select("*")
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Experience</h1>
        <p className="mt-6 text-red-400">{error.message}</p>
      </div>
    );
  }

  return (
    <ExperienceClient
      initialExperiences={experiences ?? []}
    />
  );
}
