import { createClient } from "@/lib/supabase/server";

const tables = [
  { name: "Projects", table: "projects" },
  { name: "Skills", table: "skills" },
  { name: "Experience", table: "experience" },
  { name: "Education", table: "education" },
  { name: "Certifications", table: "certifications" },
  { name: "Services", table: "services" },
  { name: "Social Links", table: "social_links" },
  { name: "Messages", table: "contact_messages" },
];

export default async function AdminDashboard() {
  const supabase = await createClient();

  const results = await Promise.all(
    tables.map(async (item) => {
      const { count } = await supabase
        .from(item.table)
        .select("*", { count: "exact", head: true });

      return {
        ...item,
        count: count ?? 0,
      };
    }),
  );

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-zinc-500">Overview</p>

        <h1 className="mt-1 text-3xl font-bold">
          Portfolio Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Manage your portfolio content from one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {results.map((item) => (
          <div
            key={item.table}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <p className="text-sm text-zinc-500">{item.name}</p>

            <p className="mt-3 text-3xl font-bold">
              {item.count}
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Records
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}