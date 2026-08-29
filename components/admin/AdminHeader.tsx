"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-800 bg-black/90 px-6 backdrop-blur">
      <div>
        <h1 className="font-semibold text-white">Admin Dashboard</h1>
      </div>

      <button
        onClick={handleLogout}
        className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
      >
        Sign out
      </button>
    </header>
  );
}