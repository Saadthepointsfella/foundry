// apps/studio/app/(flows)/SessionLog.tsx
"use client";

import React from "react";
import type { Mode, PromptTask } from "@vibefoundry/core";

interface Entry {
  id: string;
  mode: Mode;
  task: PromptTask;
  prompt: string;
  createdAt: string;
}

interface Props {
  entries: Entry[];
}

export default function SessionLog({ entries }: Props) {
  return (
    <section className="border border-zinc-800 rounded-lg p-3 flex flex-col gap-2 min-h-[120px]">
      <header className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          session log
        </span>
        <span className="text-[10px] text-zinc-500">
          last {entries.length} prompts
        </span>
      </header>
      {entries.length === 0 ? (
        <p className="text-[11px] text-zinc-400">
          Compose a prompt and hit &quot;Save to session&quot; to keep a
          copy here.
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-40 overflow-y-auto">
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className="text-left text-[11px] border border-zinc-800 rounded-md px-2 py-1 hover:border-zinc-600"
              onClick={() => {
                navigator.clipboard.writeText(entry.prompt).catch(() => {});
              }}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-medium text-zinc-100">
                  {entry.task.title || "Untitled"}
                </span>
                <span className="text-[9px] text-zinc-500">
                  {entry.mode === "vibe" ? "Vibe" : "Pro"} ·{" "}
                  {new Date(entry.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <div className="text-zinc-400 truncate">
                {entry.task.description}
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
