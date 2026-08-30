import { createClient } from "@/lib/supabase/server";
import SkillsClient from "@/components/admin/skills/SkillsClient";

export default async function SkillsPage() {
  const supabase = await createClient();

  const { data: skills, error } = await supabase
    .from("skills")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Skills</h1>
        <p className="mt-6 text-red-400">{error.message}</p>
      </div>
    );
  }

  return <SkillsClient initialSkills={skills ?? []} />;
}