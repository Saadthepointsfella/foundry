// apps/studio/app/(flows)/InvariantToggle.tsx
"use client";

import React from "react";
import type {
  Mode,
  ResolvedInvariantPack,
} from "@vibefoundry/core";
import InvariantCard from "../../components/InvariantCard";

interface Props {
  mode: Mode;
  resolved: ResolvedInvariantPack[];
  overrides: ResolvedInvariantPack[] | null;
  onOverridesChange: (next: ResolvedInvariantPack[] | null) => void;
}

export default function InvariantToggle({
  mode,
  resolved,
  overrides,
  onOverridesChange,
}: Props) {
  const effective = overrides ?? resolved;

  const toggleStrictness = (id: string) => {
    if (mode === "pro") {
      // Pro mode: no direct toggles, but you could open a waiver modal here.
      return;
    }
    const current = overrides ?? resolved;
    const next = current.map((p) => {
      if (p.id !== id) return p;
      const nextStrictness: "off" | "soft" | "hard" =
        p.strictness === "hard"
          ? "soft"
          : p.strictness === "soft"
          ? "off"
          : "hard";
      return { ...p, strictness: nextStrictness };
    });
    onOverridesChange(next);
  };

  const reset = () => onOverridesChange(null);

  return (
    <section className="border border-zinc-800 rounded-lg p-3 flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          invariants
        </span>
        <button
          type="button"
          className="text-[10px] text-zinc-500 hover:text-zinc-200"
          onClick={reset}
        >
          reset
        </button>
      </header>

      {resolved.length === 0 ? (
        <p className="text-[11px] text-zinc-400">
          Once you pick frameworks and variants, we&apos;ll derive the
          invariants that your prompt will enforce.
        </p>
      ) : (
        <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto">
          {effective.map((pack) => (
            <InvariantCard
              key={pack.id}
              pack={pack}
              mode={mode}
              onToggleStrictness={() => toggleStrictness(pack.id)}
            />
          ))}
        </div>
      )}

      <p className="text-[11px] text-zinc-500">
        {mode === "vibe"
          ? "Tap a card to cycle hard → soft → off. Cross-cutting safety invariants should usually stay hard."
          : "In Pro mode, invariants are locked; waivers are explicit and tracked (coming soon)."}
      </p>
    </section>
  );
}
