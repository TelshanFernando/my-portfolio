import { createClient } from "@/lib/supabase/server";
import ProjectsClient from "@/components/admin/projects/ProjectsClient";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="mt-6 text-red-400">{error.message}</p>
      </div>
    );
  }

  return <ProjectsClient initialProjects={projects ?? []} />;
}
