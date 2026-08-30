import DeleteMessageButton from "@/components/admin/messages/DeleteMessageButton";
import { createClient } from "@/lib/supabase/server";

async function deleteMessage(formData: FormData) {
  "use server";

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteMessage:", error);
  }
}

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    const isMissingTable =
      error.code === "PGRST205" ||
      error.message.toLowerCase().includes("could not find the table") ||
      error.message.toLowerCase().includes("schema cache");

    return (
      <section>
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Messages sent through your portfolio contact form.
          </p>
        </header>

        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-12 text-center">
          <h2 className="text-lg font-semibold text-white">
            {isMissingTable ? "No messages yet" : "Unable to load messages"}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {isMissingTable
              ? "Contact form submissions will appear here once your contact_messages table is connected."
              : `Failed to load messages: ${error.message}`}
          </p>
        </div>
      </section>
    );
  }

  const messages = (data ?? []) as Array<Record<string, unknown>>;

  return (
    <section>
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Messages sent through your portfolio contact form.
          </p>
        </div>
        <div className="inline-flex w-fit items-center rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-400">
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </div>
      </header>

      {!messages.length ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 p-12 text-center">
          <h2 className="text-lg font-semibold text-white">No messages yet</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => {
            const id = String(message.id ?? `message-${index}`);
            const canDelete = Boolean(message.id);
            const senderName =
              String(message.name ?? message.full_name ?? "Unknown sender").trim() ||
              "Unknown sender";
            const email = String(
              message.email ?? message.sender_email ?? "",
            ).trim();
            const subject =
              String(message.subject ?? "No subject").trim() || "No subject";
            const body = String(
              message.message ?? message.content ?? message.body ?? "",
            ).trim();
            const createdAt = message.created_at
              ? new Date(String(message.created_at)).toLocaleString()
              : "";
            const isRead =
              message.is_read === true ||
              message.read === true ||
              message.status === "read";

            return (
              <article
                key={id}
                className={`rounded-2xl border p-5 transition-colors sm:p-6 ${
                  isRead
                    ? "border-zinc-800 bg-zinc-950"
                    : "border-white/20 bg-zinc-900/60"
                }`}
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z" />
                          <path d="m22 6-10 7L2 6" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="truncate text-lg font-semibold text-white">
                            {senderName}
                          </h2>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              isRead
                                ? "bg-zinc-800 text-zinc-400"
                                : "bg-white text-black"
                            }`}
                          >
                            {isRead ? "Read" : "Unread"}
                          </span>
                        </div>
                        {email ? (
                          <p className="mt-1 truncate text-sm text-zinc-400">{email}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-5">
                      <h3 className="text-base font-medium text-zinc-200">{subject}</h3>
                      {body ? (
                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-zinc-400">
                          {body}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-zinc-500">No message content.</p>
                      )}
                    </div>

                    {createdAt ? (
                      <p className="mt-5 text-xs text-zinc-600">Received {createdAt}</p>
                    ) : null}
                  </div>

                  <div className="flex w-full flex-col gap-2 md:w-auto">
  {email ? (
    <a
      href={`mailto:${email}`}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 md:w-auto"
    >
      Reply
    </a>
  ) : null}

  <DeleteMessageButton
    messageId={id}
    deleteAction={deleteMessage}
  />
</div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}