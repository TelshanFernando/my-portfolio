"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = {
  success?: string;
  error?: string;
};

function parseArray(value: FormDataEntryValue | null): string[] {
  if (!value) return [];

  return String(value)
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getString(
  formData: FormData,
  name: string,
): string {
  return String(formData.get(name) ?? "").trim();
}

function getNullableString(
  formData: FormData,
  name: string,
): string | null {
  const value = getString(formData, name);
  return value || null;
}

function getNumber(
  formData: FormData,
  name: string,
): number {
  const value = Number(formData.get(name) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function getBoolean(
  formData: FormData,
  name: string,
): boolean {
  return formData.get(name) === "on";
}

export async function createExperience(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const supabase = await createClient();

    const companyName = getString(formData, "company_name");
    const position = getString(formData, "position");
    const startDate = getString(formData, "start_date");

    if (!companyName) {
      return { error: "Company name is required." };
    }

    if (!position) {
      return { error: "Position is required." };
    }

    if (!startDate) {
      return { error: "Start date is required." };
    }

    const currentPosition = getBoolean(formData, "current_position");

    const { error } = await supabase.from("experience").insert({
      company_name: companyName,
      position,
      location: getNullableString(formData, "location"),
      start_date: startDate,
      end_date: currentPosition
        ? null
        : getNullableString(formData, "end_date"),
      current_position: currentPosition,
      description: getNullableString(formData, "description"),
      responsibilities: parseArray(
        formData.get("responsibilities"),
      ),
      technologies: parseArray(
        formData.get("technologies"),
      ),
      display_order: getNumber(formData, "display_order"),
      visible: getBoolean(formData, "visible"),
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/experience");
    revalidatePath("/");

    return {
      success: "Experience created successfully.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create experience.",
    };
  }
}

export async function updateExperience(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const supabase = await createClient();

    const companyName = getString(formData, "company_name");
    const position = getString(formData, "position");
    const startDate = getString(formData, "start_date");

    if (!companyName) {
      return { error: "Company name is required." };
    }

    if (!position) {
      return { error: "Position is required." };
    }

    if (!startDate) {
      return { error: "Start date is required." };
    }

    const currentPosition = getBoolean(formData, "current_position");

    const { error } = await supabase
      .from("experience")
      .update({
        company_name: companyName,
        position,
        location: getNullableString(formData, "location"),
        start_date: startDate,
        end_date: currentPosition
          ? null
          : getNullableString(formData, "end_date"),
        current_position: currentPosition,
        description: getNullableString(formData, "description"),
        responsibilities: parseArray(
          formData.get("responsibilities"),
        ),
        technologies: parseArray(
          formData.get("technologies"),
        ),
        display_order: getNumber(formData, "display_order"),
        visible: getBoolean(formData, "visible"),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/experience");
    revalidatePath("/");

    return {
      success: "Experience updated successfully.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update experience.",
    };
  }
}

export async function deleteExperience(
  id: string,
): Promise<ActionState> {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("experience")
      .delete()
      .eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/experience");
    revalidatePath("/");

    return {
      success: "Experience deleted successfully.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete experience.",
    };
  }
}
