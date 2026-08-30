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
export async function createService(
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await assertAuthenticated();
  const supabase = await createClient();
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const iconName = String(form.get("icon") ?? "").trim();
  const price = String(form.get("price") ?? "").trim();
  const displayOrder = Number(form.get("display") ?? 0) || 0;
  const visible = form.get("visible") === "on";
  if (!title) {
    return { error: "Title is required." };
  }
  if (!description) {
    return { error: "Description is required." };
  }
  const { error } = await supabase.from("services").insert({
    title,
    description,
    icon_name: iconName || null,
    price: price || null,
    display_order: displayOrder,
    visible,
  });
  if (error) {
    console.error("createService error:", error);
    return { error: error.message };
  }
  revalidatePath("/admin/services");
  revalidatePath("/");
  return {
    success: "Service added successfully.",
  };
}
export async function updateService(
  id: string,
  _prev: ActionState,
  form: FormData,
): Promise<ActionState> {
  await assertAuthenticated();
  if (!id) {
    return { error: "Service ID is required." };
  }
  const supabase = await createClient();
  const title = String(form.get("title") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const iconName = String(form.get("icon") ?? "").trim();
  const price = String(form.get("price") ?? "").trim();
  const displayOrder = Number(form.get("display") ?? 0) || 0;
  const visible = form.get("visible") === "on";
  if (!title) {
    return { error: "Title is required." };
  }
  if (!description) {
    return { error: "Description is required." };
  }
  const { error } = await supabase
    .from("services")
    .update({
      title,
      description,
      icon_name: iconName || null,
      price: price || null,
      display_order: displayOrder,
      visible,
    })
    .eq("id", id);
  if (error) {
    console.error("updateService error:", error);
    return { error: error.message };
  }
  revalidatePath("/admin/services");
  revalidatePath("/");
  return {
    success: "Service updated successfully.",
  };
}
export async function deleteService(
  id: string,
): Promise<ActionState> {
  await assertAuthenticated();
  if (!id) {
    return { error: "Service ID is required." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("deleteService error:", error);
    return { error: error.message };
  }
  revalidatePath("/admin/services");
  revalidatePath("/");
  return {
    success: "Service deleted successfully.",
  };
}