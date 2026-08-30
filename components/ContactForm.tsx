"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus({
        type: "error",
        message: "Please fill in your name, email, and message.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message.");
      }

      form.reset();

      setStatus({
        type: "success",
        message: "Your message has been sent successfully. I'll get back to you soon.",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="contact-name"
          className="mb-2 block text-sm font-medium text-zinc-200"
        >
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          placeholder="Your name"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition duration-200 placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-white/10"
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-2 block text-sm font-medium text-zinc-200"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition duration-200 placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-white/10"
        />
      </div>

      <div>
        <label
          htmlFor="contact-subject"
          className="mb-2 block text-sm font-medium text-zinc-200"
        >
          Subject <span className="text-zinc-600">(optional)</span>
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          autoComplete="off"
          placeholder="Project inquiry"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition duration-200 placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-white/10"
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-2 block text-sm font-medium text-zinc-200"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          rows={6}
          placeholder="Tell me about your project..."
          className="w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition duration-200 placeholder:text-zinc-600 focus:border-white/30 focus:bg-white/[0.05] focus:ring-2 focus:ring-white/10"
        />
      </div>

      {status && (
        <div
          role="alert"
          aria-live="polite"
          className={`rounded-xl border px-4 py-3 text-sm ${
            status.type === "success"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
              : "border-red-500/20 bg-red-500/10 text-red-300"
          }`}
        >
          {status.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black shadow-lg shadow-white/5 transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-200 hover:shadow-xl hover:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-black disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
      >
        {loading ? (
          <>
            <span
              aria-hidden="true"
              className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black"
            />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              →
            </span>
          </>
        )}
      </button>
    </form>
  );
}