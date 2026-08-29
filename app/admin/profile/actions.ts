"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = {
  error?: string;
  success?: string;
};

export async function updateProfile(
  _previousState: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        error: "You must be signed in.",
      };
    }

    const updates = {
      full_name: String(formData.get("full_name") ?? "").trim() || null,
      professional_title:
        String(formData.get("professional_title") ?? "").trim() || null,
      bio: String(formData.get("bio") ?? "").trim() || null,
      profile_image_url:
        String(formData.get("profile_image_url") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      phone: String(formData.get("phone") ?? "").trim() || null,
      website_url:
        String(formData.get("website_url") ?? "").trim() || null,
      github_url:
        String(formData.get("github_url") ?? "").trim() || null,
      linkedin_url:
        String(formData.get("linkedin_url") ?? "").trim() || null,
      available_for_work: formData.get("available_for_work") === "on",
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    if (error) {
      return {
        error: error.message,
      };
    }

    revalidatePath("/admin/profile");
    revalidatePath("/");

    return {
      success: "Profile updated successfully.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update profile.",
    };
  }
}
