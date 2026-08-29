"use client";

import { useActionState } from "react";
import { loginAdmin } from "./actions";

const initialState = {
  error: "",
};

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState(
    loginAdmin,
    initialState,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-zinc-400">
            Portfolio Admin
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back
          </h1>

          <p className="mt-3 text-zinc-400">
            Sign in to manage your portfolio.
          </p>
        </div>

        <form
          action={formAction}
          className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 outline-none transition focus:border-white"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <div
              role="alert"
              className="rounded-xl border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-300"
            >
              {state.error}
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-xl bg-white px-4 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
