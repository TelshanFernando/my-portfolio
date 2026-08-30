

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const SETTING_FIELDS = [
  "site_name",
  "site_title",
  "site_description",
  "logo_url",
  "favicon_url",
  "hero_badge",
  "hero_heading",
  "hero_subheading",
  "primary_cta_text",
  "primary_cta_url",
  "secondary_cta_text",
  "secondary_cta_url",
  "footer_text",
] as const;

export async function saveSettings(formData: FormData) {
  const supabase = await createClient();

  const values: Record<string, string> = {};
  for (const field of SETTING_FIELDS) {
    values[field] = String(formData.get(field) ?? "").trim();
  }

  const { data: existing, error: fetchError } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    return { error: `Failed to load site settings: ${fetchError.message}` };
  }

  const { error: saveError } = existing
    ? await supabase
        .from("site_settings")
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
    : await supabase.from("site_settings").insert(values);

  if (saveError) {
    return { error: `Failed to save site settings: ${saveError.message}` };
  }

  revalidatePath("/admin/settings");
  revalidatePath("/");

  return { success: true };
}