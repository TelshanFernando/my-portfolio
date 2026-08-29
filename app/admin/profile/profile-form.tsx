"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileFormState } from "./actions";

type Profile = {
  id: string;
  full_name: string | null;
  professional_title: string | null;
  bio: string | null;
  profile_image_url: string | null;
  location: string | null;
  email: string | null;
  phone: string | null;
  website_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  available_for_work: boolean;
};

const initialState: ProfileFormState = {};

export default function ProfileForm({
  profile,
}: {
  profile: Profile;
}) {
  const [state, formAction, pending] = useActionState(
    updateProfile,
    initialState,
  );

  return (
    <form action={formAction} className="mt-8 space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
          {state.error}
        </div>
      )}

      {state.success && (
        <div className="rounded-lg border border-green-900 bg-green-950/40 p-4 text-sm text-green-300">
          {state.success}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            name="full_name"
            label="Full name"
            defaultValue={profile.full_name ?? ""}
          />

          <Field
            name="professional_title"
            label="Professional title"
            defaultValue={profile.professional_title ?? ""}
          />

          <Field
            name="location"
            label="Location"
            defaultValue={profile.location ?? ""}
          />

          <Field
            name="phone"
            label="Phone"
            defaultValue={profile.phone ?? ""}
          />
        </div>

        <div className="mt-5">
          <label className="text-sm text-zinc-400">Bio</label>
          <textarea
            name="bio"
            defaultValue={profile.bio ?? ""}
            rows={6}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-white"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <h2 className="text-lg font-semibold">Online Presence</h2>

        <div className="mt-6 space-y-5">
          <Field
            name="profile_image_url"
            label="Profile image URL"
            defaultValue={profile.profile_image_url ?? ""}
          />

          <Field
            name="website_url"
            label="Website URL"
            defaultValue={profile.website_url ?? ""}
          />

          <Field
            name="github_url"
            label="GitHub URL"
            defaultValue={profile.github_url ?? ""}
          />

          <Field
            name="linkedin_url"
            label="LinkedIn URL"
            defaultValue={profile.linkedin_url ?? ""}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
        <label className="flex items-center gap-3 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="available_for_work"
            defaultChecked={profile.available_for_work}
            className="h-4 w-4"
          />
          Available for work
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-white px-6 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="text-sm text-zinc-400">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-white"
      />
    </div>
  );
}
