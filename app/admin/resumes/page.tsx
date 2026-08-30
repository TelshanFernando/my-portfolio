import { createClient } from "@/lib/supabase/server";
import ResumeClient from "./ResumeClient";

export type Resume = {
  id: string;
  title: string;
  file_url: string;
  storage_path: string;
  original_file_name: string;
  mime_type: string;
  file_size: number;
  is_active: boolean;
  created_at: string;
};

export default async function ResumesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section className="space-y-6">
        <div className="rounded-2xl border border-red-900 bg-red-950/30 p-6">
          <h1 className="text-lg font-semibold text-red-400">
            Failed to load resumes
          </h1>

          <p className="mt-2 text-sm text-red-300">
            {error.message}
          </p>
        </div>
      </section>
    );
  }

  return <ResumeClient initialResumes={data ?? []} />;
}