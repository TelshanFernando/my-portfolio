"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = {
  error?: string;
  success?: string;
};

function parseSkillForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const iconName = String(formData.get("icon_name") ?? "").trim();

  const proficiencyRaw = String(
    formData.get("proficiency") ?? "",
  ).trim();

  const yearsRaw = String(
    formData.get("years_experience") ?? "",
  ).trim();

  const displayOrderRaw = String(
    formData.get("display_order") ?? "0",
  ).trim();

  if (!name) {
    throw new Error("Skill name is required.");
  }

  if (!category) {
    throw new Error("Category is required.");
  }

  const proficiency =
    proficiencyRaw === "" ? null : Number(proficiencyRaw);

  const yearsExperience =
    yearsRaw === "" ? null : Number(yearsRaw);

  const displayOrder =
    displayOrderRaw === "" ? 0 : Number(displayOrderRaw);

  if (
    proficiency !== null &&
    (!Number.isFinite(proficiency) ||
      proficiency < 0 ||
      proficiency > 100)
  ) {
    throw new Error(
      "Proficiency must be a number between 0 and 100.",
    );
  }

  if (
    yearsExperience !== null &&
    (!Number.isFinite(yearsExperience) ||
      yearsExperience < 0)
  ) {
    throw new Error(
      "Years of experience must be a valid positive number.",
    );
  }

  if (
    !Number.isInteger(displayOrder) ||
    displayOrder < 0
  ) {
    throw new Error(
      "Display order must be a non-negative integer.",
    );
  }

  return {
    name,
    category,
    icon_name: iconName || null,
    proficiency,
    years_experience: yearsExperience,
    display_order: displayOrder,
    visible: formData.get("visible") === "on",
  };
}

export async function createSkill(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    const values = parseSkillForm(formData);

    const { error } = await supabase
      .from("skills")
      .insert(values);

    if (error) {
      console.error("[skills] create failed:", error);
      return { error: error.message };
    }

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return {
      success: "Skill created successfully.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to create skill.",
    };
  }
}

export async function updateSkill(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (!id) {
      return { error: "Skill ID is missing." };
    }

    const supabase = await createClient();
    const values = parseSkillForm(formData);

    const { error } = await supabase
      .from("skills")
      .update(values)
      .eq("id", id);

    if (error) {
      console.error("[skills] update failed:", error);
      return { error: error.message };
    }

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return {
      success: "Skill updated successfully.",
    };
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Failed to update skill.",
    };
  }
}

export async function deleteSkill(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: "Skill ID is missing.",
      };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("skills")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[skills] delete failed:", error);

      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/admin/skills");
    revalidatePath("/");

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to delete skill.",
    };
  }
}
