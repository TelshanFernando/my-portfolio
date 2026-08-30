"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

type ActionState = {
  success?: string;
  error?: string;
};

export async function uploadResume(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const file = formData.get("file");
  const title = String(formData.get("title") || "").trim();

  if (!(file instanceof File)) {
    return { error: "Please select a resume file." };
  }

  if (!title) {
    return { error: "Please enter a resume title." };
  }

  if (file.size === 0) {
    return { error: "The selected file is empty." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "Resume must be smaller than 10 MB." };
  }

  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.type)) {
    return { error: "Only PDF, DOC, and DOCX files are allowed." };
  }

  const admin = createAdminClient();
  const extension = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const fileName = `resume-${Date.now()}.${extension}`;

  const { error: uploadError } = await admin.storage
    .from("resumes")
    .upload(fileName, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Resume upload error:", uploadError);
    return { error: `Upload failed: ${uploadError.message}` };
  }

  const { data: publicUrlData } = admin.storage
    .from("resumes")
    .getPublicUrl(fileName);

  const fileUrl = publicUrlData.publicUrl;

  // Do not use the authenticated/server user's Supabase client here.
  // This action must use the service-role client for both UPDATE and INSERT.
  const { error: deactivateError } = await admin
    .from("resumes")
    .update({ is_active: false })
    .eq("is_active", true);

  if (deactivateError) {
    console.error("Deactivate resumes error:", deactivateError);
    await admin.storage.from("resumes").remove([fileName]);
    return {
      error: `Could not update existing resumes: ${deactivateError.message}`,
    };
  }

  const { error: insertError } = await admin
    .from("resumes")
    .insert({
      title,
      file_url: fileUrl,
      storage_path: fileName,
      original_file_name: file.name,
      mime_type: file.type,
      file_size: file.size,
      is_active: true,
    });

  if (insertError) {
    console.error("Insert resume error:", insertError);
    await admin.storage.from("resumes").remove([fileName]);
    return {
      error: `Could not save resume: ${insertError.message}`,
    };
  }

  revalidatePath("/admin/resumes");

  return { success: "Resume uploaded successfully." };
}

export async function deleteResume(id: string): Promise<ActionState> {
  const admin = createAdminClient();

  const { data: resume, error: fetchError } = await admin
    .from("resumes")
    .select("storage_path")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("Find resume error:", fetchError);
    return { error: `Could not find resume: ${fetchError.message}` };
  }

  if (resume?.storage_path) {
    const { error: storageError } = await admin.storage
      .from("resumes")
      .remove([resume.storage_path]);

    // A missing Storage object should not prevent deleting the database row.
    if (storageError) {
      console.warn("Resume storage delete error:", storageError.message);
    }
  }

  const { error: deleteError } = await admin
    .from("resumes")
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("Delete resume error:", deleteError);
    return { error: `Could not delete resume: ${deleteError.message}` };
  }

  revalidatePath("/admin/resumes");
  revalidatePath("/");

  return { success: "Resume deleted successfully." };
}