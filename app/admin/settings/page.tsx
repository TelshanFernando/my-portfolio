import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const fields = [
  { key: "site_name", label: "Site Name", type: "text" },
  { key: "site_title", label: "Site Title", type: "text" },
  { key: "site_description", label: "Site Description", type: "textarea" },
  { key: "logo_url", label: "Logo URL", type: "url" },
  { key: "favicon_url", label: "Favicon URL", type: "url" },
  { key: "hero_badge", label: "Hero Badge", type: "text" },
  { key: "hero_heading", label: "Hero Heading", type: "text" },
  { key: "hero_subheading", label: "Hero Subheading", type: "textarea" },
  { key: "primary_cta_text", label: "Primary CTA Text", type: "text" },
  { key: "primary_cta_url", label: "Primary CTA URL", type: "url" },
  { key: "secondary_cta_text", label: "Secondary CTA Text", type: "text" },
  { key: "secondary_cta_url", label: "Secondary CTA URL", type: "url" },
  { key: "footer_text", label: "Footer Text", type: "textarea" },
] as const;

async function saveSettings(formData: FormData) {
  "use server";

  const supabase = await createClient();
  const { data: existing, error: fetchError } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    redirect(`/admin/settings?error=${encodeURIComponent(fetchError.message)}`);
  }

  const values: Record<string, string> = {};
  for (const { key } of fields) {
    values[key] = String(formData.get(key) ?? "").trim();
  }

  const existingRecord = existing as Record<string, unknown> | null;
  const payload: Record<string, unknown> = existingRecord
    ? Object.fromEntries([
        ["id", existingRecord.id],
        ...fields.map(({ key }) => [key, values[key]]),
      ])
    : values;

  const query = existingRecord
    ? supabase.from("site_settings").update(payload).eq("id", existingRecord.id)
    : supabase.from("site_settings").insert(payload);

  const { error: saveError } = await query;

  if (saveError) {
    redirect(`/admin/settings?error=${encodeURIComponent(saveError.message)}`);
  }

  redirect("/admin/settings?saved=1");
}

type SettingsPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const supabase = await createClient();
  const params = await searchParams;

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error) {
    return (
      <section>
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage the information used across your portfolio.
        </p>
        <p className="mt-6 text-red-400">Failed to load settings: {error.message}</p>
      </section>
    );
  }

  const settings = (data ?? {}) as Record<string, unknown>;

  return (
    <section className="max-w-3xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Site Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage the information used across your portfolio.
        </p>
      </header>

      {params.saved === "1" ? (
        <div className="mb-6 rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          Settings saved successfully.
        </div>
      ) : null}

      {params.error ? (
        <div className="mb-6 rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-400">
          {params.error}
        </div>
      ) : null}

      <form action={saveSettings} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <div className="space-y-6">
          {fields.map(({ key, label, type }) => {
            const value = settings[key] == null ? "" : String(settings[key]);

            return (
              <div key={key}>
                <label htmlFor={key} className="mb-2 block text-sm font-medium text-zinc-200">
                  {label}
                </label>

                {type === "textarea" ? (
                  <textarea
                    id={key}
                    name={key}
                    defaultValue={value}
                    rows={4}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
                  />
                ) : (
                  <input
                    id={key}
                    name={key}
                    type={type}
                    defaultValue={value}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-zinc-600"
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Save Settings
          </button>
        </div>
      </form>
    </section>
  );
}