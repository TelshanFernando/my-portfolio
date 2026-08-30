"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type ActionState = {
  success?: string;
  error?: string;
};

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return { supabase, user: null, error: error.message };
  if (!user) return { supabase, user: null, error: "Not authenticated." };

  return { supabase, user, error: null };
}

function getCertificationFormData(formData: FormData) {
  return {
    title: String(formData.get("title") ?? "").trim(),
    issuingOrganization: String(formData.get("issuing_organization") ?? "",).trim(),
    issueDate: String(formData.get("issue_date") ?? "").trim(),
    expiryDate: String(formData.get("expiry_date") ?? "").trim(),
    credentialId: String(formData.get("credential_id") ?? "").trim(),
    credentialUrl: String(formData.get("credential_url") ?? "").trim(),
    imageUrl: String(formData.get("image_url") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    displayOrder: Number(formData.get("display_order") ?? 0) || 0,
    visible:
      formData.get("visible") === "on" || formData.get("visible") === "true",
  };
}

function validateCertification(
  data: ReturnType<typeof getCertificationFormData>,
) {
  if (!data.title) return "Title is required.";
  if (!data.issuingOrganization) return "Issuing organization is required.";
  if (!data.issueDate) return "Issue date is required.";
  return null;
}

function getCertificationPayload(
  data: ReturnType<typeof getCertificationFormData>,
) {
  return {
    title: data.title,
    issuing_organization: data.issuingOrganization,
    credential_id: data.credentialId || null,
    issue_date: data.issueDate,
    expiry_date: data.expiryDate || null,
    credential_url: data.credentialUrl || null,
    image_url: data.imageUrl || null,
    description: data.description || null,
    display_order: data.displayOrder,
    visible: data.visible,
  };
}

export async function createCertification(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase, error: authError } = await getAuthenticatedClient();
  if (authError) return { error: authError };

  const data = getCertificationFormData(formData);
  const validationError = validateCertification(data);
  if (validationError) return { error: validationError };

  const { error } = await supabase
    .from("certifications")
    .insert(getCertificationPayload(data));

  if (error) {
    console.error("createCertification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/");
  return { success: "Certification added successfully." };
}

export async function updateCertification(
  id: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!id) return { error: "Certification ID is required." };

  const { supabase, error: authError } = await getAuthenticatedClient();
  if (authError) return { error: authError };

  const data = getCertificationFormData(formData);
  const validationError = validateCertification(data);
  if (validationError) return { error: validationError };

  const { error } = await supabase
    .from("certifications")
    .update(getCertificationPayload(data))
    .eq("id", id);

  if (error) {
    console.error("updateCertification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/");
  return { success: "Certification updated successfully." };
}

export async function deleteCertification(id: string): Promise<ActionState> {
  if (!id) return { error: "Certification ID is required." };

  const { supabase, error: authError } = await getAuthenticatedClient();
  if (authError) return { error: authError };

  const { error } = await supabase
    .from("certifications")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteCertification:", error);
    return { error: error.message };
  }

  revalidatePath("/admin/certifications");
  revalidatePath("/");
  return { success: "Certification deleted successfully." };
}