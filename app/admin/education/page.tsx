import { createClient } from "@/lib/supabase/server";
import EducationClient from "@/components/admin/education/EducationClient";

export default async function EducationPage() {
  const supabase = await createClient();

  const { data: educations, error } = await supabase
    .from("education")
    .select("*")
    .order("display_order", { ascending: true })
    .order("start_date", { ascending: false });

  if (error) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-white">Education</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your education history.
        </p>
        <div className="mt-6 rounded-2xl border border-red-900/50 bg-red-950/20 p-6">
          <p className="text-sm text-red-400">
            Failed to load education: {error.message}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Education</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your education history.
        </p>
      </header>
      <EducationClient initialEducation={educations ?? []} />
    </section>
  );
}
