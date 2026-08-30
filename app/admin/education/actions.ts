"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionState = {
  success?: string;
  error?: string;
};

async function assertAuthenticated() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user) {
    if (error) {
      throw new Error(error.message);
    }

    throw new Error("Not authenticated");
  }
}

export async function createEducation(
  _prev: ActionState,
  form: FormData
): Promise<ActionState> {
  await assertAuthenticated();

  const supabase = await createClient();

  const degree = String(form.get("degree") ?? "").trim();
  const institution = String(form.get("institution") ?? "").trim();
  const fieldOfStudy = String(form.get("field_of_study") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();
  const grade = String(form.get("grade") ?? "").trim();
  const startDate = String(form.get("start_date") ?? "").trim();
  const endDate = String(form.get("end_date") ?? "").trim();
  const currentStatus = String(form.get("current_status") ?? "")
    .trim()
    .toUpperCase();
  const description = String(form.get("description") ?? "").trim();

  const display = Number(form.get("display") ?? 0) || 0;
  const visible = form.get("visible") === "on";

  if (!degree) return { error: "Degree is required." };
  if (!institution) return { error: "Institution is required." };
  if (!startDate) return { error: "Start date is required." };

  const { error } = await supabase.from("education").insert({
    degree,
    institution,
    field_of_study: fieldOfStudy || null,
    location: location || null,
    grade: grade || null,
    start_date: startDate,
    end_date: currentStatus === "PRESENT" || currentStatus === "HOLD" ? null : endDate || null,
    current_status: currentStatus === "HOLD" ? "HOLD" : "PRESENT",
    description: description || null,
    display_order: display,
    visible,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/education");
  revalidatePath("/");

  return { success: "Education added successfully." };
}

export async function updateEducation(
  id: string,
  _prev: ActionState,
  form: FormData
): Promise<ActionState> {
  await assertAuthenticated();

  const supabase = await createClient();

  const degree = String(form.get("degree") ?? "").trim();
  const institution = String(form.get("institution") ?? "").trim();
  const fieldOfStudy = String(form.get("field_of_study") ?? "").trim();
  const location = String(form.get("location") ?? "").trim();
  const grade = String(form.get("grade") ?? "").trim();
  const startDate = String(form.get("start_date") ?? "").trim();
  const endDate = String(form.get("end_date") ?? "").trim();
  const currentStatus = String(form.get("current_status") ?? "")
    .trim()
    .toUpperCase();
  const description = String(form.get("description") ?? "").trim();

  const display = Number(form.get("display") ?? 0) || 0;
  const visible = form.get("visible") === "on";

  if (!degree) return { error: "Degree is required." };
  if (!institution) return { error: "Institution is required." };
  if (!startDate) return { error: "Start date is required." };

  const { error } = await supabase
    .from("education")
    .update({
      degree,
      institution,
      field_of_study: fieldOfStudy || null,
      location: location || null,
      grade: grade || null,
      start_date: startDate,
      end_date: currentStatus === "PRESENT" || currentStatus === "HOLD" ? null : endDate || null,
      current_status: currentStatus === "HOLD" ? "HOLD" : "PRESENT",
      description: description || null,
      display_order: display,
      visible,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/education");
  revalidatePath("/");

  return { success: "Education updated successfully." };
}

export async function deleteEducation(
  id: string
): Promise<ActionState> {
  await assertAuthenticated();

  const supabase = await createClient();

  const { error } = await supabase
    .from("education")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/education");
  revalidatePath("/");

  return { success: "Education deleted successfully." };
}