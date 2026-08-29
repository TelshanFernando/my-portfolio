"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = {
  error: string;
};

export async function loginAdmin(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    };
  }

  const supabase = await createClient();

  const { error: signInError } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (signInError) {
    console.error(
      "[admin-auth] Supabase sign-in failed:",
      signInError.message,
    );

    return {
      error: "Invalid email or password.",
    };
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    await supabase.auth.signOut();

    return {
      error: "Authentication succeeded, but the user session could not be verified.",
    };
  }

  const role = user.user_metadata?.role;

  if (role !== "admin") {
    console.error(
      "[admin-auth] Authenticated user is not an admin:",
      user.id,
    );

    await supabase.auth.signOut();

    return {
      error: "This account does not have administrator access.",
    };
  }

  redirect("/admin");
}
