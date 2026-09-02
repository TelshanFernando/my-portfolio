"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = {
  success?: string;
  error?: string;
};

async function assertAuthenticated() {
  const supabase = await createClient();

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  return session.user;
}

export async function createSocialLink(
  _prev: ActionState,
  form: FormData
): Promise<ActionState> {
  await assertAuthenticated();

  const supabase = await createClient();

  const platform = String(form.get("platform") ?? "").trim();
const url = String(form.get("url") ?? "").trim();
const icon = String(form.get("icon") ?? "").trim() || null;
const displayOrder = Number(form.get("display_order") ?? 0) || 0;
const visible = form.get("visible") === "on";
const iconName = String(form.get("icon_name") ?? "").trim() || null;

  if (!platform) {
    return { error: "Platform is required." };
  }

  if (!url) {
    return { error: "URL is required." };
  }

  const { data, error } = await supabase
    .from("social_links")
    .insert({
      platform,
      url,
      icon,
      display_order: displayOrder,
      visible,
    })
    .select("*")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return { error: "Social link was not created." };
  }

  revalidatePath("/admin/social-links");
  revalidatePath("/");

  return {
    success: "Social link added successfully.",
  };
}

export async function updateSocialLink(
  id: string,
  _prev: ActionState,
  form: FormData
): Promise<ActionState> {
  await assertAuthenticated();

  const supabase = await createClient();

  const platform = String(form.get("platform") ?? "").trim();
const url = String(form.get("url") ?? "").trim();
const icon = String(form.get("icon") ?? "").trim() || null;
const displayOrder = Number(form.get("display_order") ?? 0) || 0;
const visible = form.get("visible") === "on";

  if (!platform) {
    return { error: "Platform is required." };
  }

  if (!url) {
    return { error: "URL is required." };
  }

  const { data, error } = await supabase
    .from("social_links")
    .update({
      platform,
      url,
      icon,
      display_order: displayOrder,
      visible,
    })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    return { error: error.message };
  }

  if (!data) {
    return {
      error: "Social link was not found or could not be updated.",
    };
  }

  revalidatePath("/admin/social-links");
  revalidatePath("/");

  return {
    success: "Social link updated successfully.",
  };
}

export async function deleteSocialLink(
  id: string
): Promise<ActionState> {
  await assertAuthenticated();

  const supabase = await createClient();

  const { error } = await supabase
    .from("social_links")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/social-links");
  revalidatePath("/");

  return {
    success: "Social link deleted successfully.",
  };
}