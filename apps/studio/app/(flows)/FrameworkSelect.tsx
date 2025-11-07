// apps/studio/app/(flows)/FrameworkSelect.tsx
"use client";

import React from "react";
import type { FrameworkSelection, Mode } from "@vibefoundry/core";
import { adapterList } from "@vibefoundry/adapters"; // array of available frameworks

interface Props {
  mode: Mode;
  selections: FrameworkSelection[];
  onChange: (next: FrameworkSelection[]) => void;
}

export default function FrameworkSelect({
  mode,
  selections,
  onChange,
}: Props) {
  const toggleFramework = (frameworkId: string) => {
    const exists = selections.find((s) => s.frameworkId === frameworkId);
    if (exists) {
      onChange(selections.filter((s) => s.frameworkId !== frameworkId));
    } else {
      onChange([
        ...selections,
        { frameworkId, variants: [] },
      ]);
    }
  };

  return (
    <section className="border border-zinc-800 rounded-lg p-3 flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          frameworks
        </span>
        <span className="text-[10px] text-zinc-500">
          select your active stacks
        </span>
      </header>

      <div className="flex flex-wrap gap-2">
        {adapterList.map(({ framework }) => {
          const active = selections.some(
            (s) => s.frameworkId === framework.id
          );

          return (
            <button
              key={framework.id}
              type="button"
              className={`text-xs px-2 py-1 rounded-full border ${
                active
                  ? "border-emerald-400 bg-emerald-950 text-emerald-100"
                  : "border-zinc-700 text-zinc-300"
              }`}
              onClick={() => toggleFramework(framework.id)}
            >
              {framework.name}
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-zinc-400">
        {selections.length === 0
          ? "Pick at least one framework to start."
          : `${selections.length} framework(s) selected.`}
      </p>
    </section>
  );
}
