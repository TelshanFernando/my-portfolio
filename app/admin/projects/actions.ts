"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProjectFormState = {
  error?: string;
  success?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("You must be signed in.");
  }

  return { supabase, user };
}

export async function createProject(
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  try {
    const { supabase } = await requireAuthenticatedUser();

    const title = String(formData.get("title") ?? "").trim();
    const suppliedSlug = String(formData.get("slug") ?? "").trim();

    if (!title) {
      return { error: "Project title is required." };
    }

    const slug = slugify(suppliedSlug || title);

    if (!slug) {
      return { error: "A valid slug is required." };
    }

    const project = {
      title,
      slug,
      short_description:
        String(formData.get("short_description") ?? "").trim() || null,
      description:
        String(formData.get("description") ?? "").trim() || null,
      image_url:
        String(formData.get("image_url") ?? "").trim() || null,
      github_url:
        String(formData.get("github_url") ?? "").trim() || null,
      live_url:
        String(formData.get("live_url") ?? "").trim() || null,
      category:
        String(formData.get("category") ?? "").trim() || null,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      display_order: Number(formData.get("display_order") ?? 0) || 0,
    };

    const { error } = await supabase.from("projects").insert(project);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/projects");
    revalidatePath("/");

    return {
      success: "Project created successfully.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create project.",
    };
  }
}

export async function updateProject(
  id: string,
  _previousState: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  try {
    const { supabase } = await requireAuthenticatedUser();

    const title = String(formData.get("title") ?? "").trim();
    const suppliedSlug = String(formData.get("slug") ?? "").trim();

    if (!title) {
      return { error: "Project title is required." };
    }

    const slug = slugify(suppliedSlug || title);

    if (!slug) {
      return { error: "A valid slug is required." };
    }

    const updates = {
      title,
      slug,
      short_description:
        String(formData.get("short_description") ?? "").trim() || null,
      description:
        String(formData.get("description") ?? "").trim() || null,
      image_url:
        String(formData.get("image_url") ?? "").trim() || null,
      github_url:
        String(formData.get("github_url") ?? "").trim() || null,
      live_url:
        String(formData.get("live_url") ?? "").trim() || null,
      category:
        String(formData.get("category") ?? "").trim() || null,
      featured: formData.get("featured") === "on",
      published: formData.get("published") === "on",
      display_order: Number(formData.get("display_order") ?? 0) || 0,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/projects");
    revalidatePath("/");

    return {
      success: "Project updated successfully.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update project.",
    };
  }
}

export async function deleteProject(id: string) {
  try {
    const { supabase } = await requireAuthenticatedUser();

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath("/admin/projects");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete project.",
    };
  }
}
