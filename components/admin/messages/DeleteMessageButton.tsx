"use client";

import { useState } from "react";

type Props = {
  messageId: string;
  deleteAction: (formData: FormData) => Promise<void>;
};

export default function DeleteMessageButton({
  messageId,
  deleteAction,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="flex w-full gap-2 md:w-auto">
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-900/60 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-950/40 md:flex-none"
        >
          Delete
        </button>
      ) : (
        <>
          <form action={deleteAction} className="flex-1 md:flex-none">
            <input type="hidden" name="id" value={messageId} />
            <button
              type="submit"
              className="w-full rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
            >
              Confirm
            </button>
          </form>

          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}