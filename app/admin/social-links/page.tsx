import { createClient } from "@/lib/supabase/server";
import SocialLinkClient from "./SocialLinkClient";

export default async function SocialLinksPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6 text-red-400">
        Failed to load social links: {error.message}
      </div>
    );
  }

  return <SocialLinkClient initialSocialLinks={data ?? []} />;
}