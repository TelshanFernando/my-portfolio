import { createClient } from "@/lib/supabase/server";
import ProfileForm from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-4 text-red-400">{error.message}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="mt-4 text-yellow-400">
          No profile exists for this account.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="mt-2 text-zinc-500">
        Manage the information displayed on your portfolio.
      </p>

      <ProfileForm profile={profile} />
    </div>
  );
}
