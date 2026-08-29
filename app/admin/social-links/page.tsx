import { createClient } from "@/lib/supabase/server";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_links")//
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold">Projects</h1>

      {error ? (
        <p className="mt-6 text-red-400">{error.message}</p>
      ) : (
        <div className="mt-8 space-y-3">
          {data?.map((project) => (
            <div
              key={project.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950 p-5"
            >
              <pre className="overflow-auto text-sm text-zinc-400">
                {JSON.stringify(project, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}