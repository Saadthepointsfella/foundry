// apps/studio/app/(flows)/IntentForm.tsx
"use client";

import React, { useState } from "react";
import type { PromptTask } from "@vibefoundry/core";

interface Props {
  task: PromptTask;
  onChange: (task: PromptTask) => void;
}

export default function IntentForm({ task, onChange }: Props) {
  const [pathsInput, setPathsInput] = useState(
    (task.repoPaths ?? []).join(", ")
  );
  const [constraintsInput, setConstraintsInput] = useState(
    (task.constraints ?? []).join("\n")
  );

  const update = (partial: Partial<PromptTask>) => {
    onChange({
      ...task,
      ...partial,
    });
  };

  const handlePathsBlur = () => {
    const parts = pathsInput
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    update({ repoPaths: parts });
  };

  const handleConstraintsBlur = () => {
    const lines = constraintsInput
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    update({ constraints: lines });
  };

  return (
    <section className="border border-zinc-800 rounded-lg p-3 flex flex-col gap-2">
      <header>
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          intent
        </span>
        <p className="text-[11px] text-zinc-400">
          Describe the change you want the LLM to make. This, plus the
          invariants, becomes your final prompt.
        </p>
      </header>

      <input
        type="text"
        className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-2 py-1 text-xs text-zinc-100"
        placeholder="Short title, e.g. &quot;Add /api/users and UserList page&quot;"
        value={task.title}
        onChange={(e) => update({ title: e.target.value })}
      />

      <textarea
        className="w-full h-28 rounded-md bg-zinc-900 border border-zinc-700 px-2 py-1 text-xs text-zinc-100 resize-none"
        placeholder="Describe what you want in a couple of paragraphs. Mention behavior, edge-cases, and constraints."
        value={task.description}
        onChange={(e) => update({ description: e.target.value })}
      />

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-zinc-400">
          Repo paths (comma-separated)
        </span>
        <input
          type="text"
          className="w-full rounded-md bg-zinc-900 border border-zinc-700 px-2 py-1 text-xs text-zinc-100"
          placeholder="apps/web, services/user-api"
          value={pathsInput}
          onChange={(e) => setPathsInput(e.target.value)}
          onBlur={handlePathsBlur}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-[11px] text-zinc-400">
          Hard constraints (one per line)
        </span>
        <textarea
          className="w-full h-20 rounded-md bg-zinc-900 border border-zinc-700 px-2 py-1 text-xs text-zinc-100 resize-none"
          placeholder="e.g. Do not change auth middleware&#10;e.g. Do not modify DB schema"
          value={constraintsInput}
          onChange={(e) => setConstraintsInput(e.target.value)}
          onBlur={handleConstraintsBlur}
        />
      </label>
    </section>
  );
}
