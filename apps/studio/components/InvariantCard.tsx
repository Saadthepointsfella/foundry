// apps/studio/app/components/InvariantCard.tsx
"use client";

import React from "react";
import type { Mode, ResolvedInvariantPack } from "@vibefoundry/core";

interface Props {
  pack: ResolvedInvariantPack;
  mode: Mode;
  onToggleStrictness?: () => void;
}

export default function InvariantCard({
  pack,
  mode,
  onToggleStrictness,
}: Props) {
  const strictLabel =
    pack.strictness === "hard"
      ? "hard"
      : pack.strictness === "soft"
      ? "soft"
      : "off";

  const colorClasses =
    pack.strictness === "hard"
      ? "border-emerald-500/80 bg-emerald-950/40"
      : pack.strictness === "soft"
      ? "border-amber-400/70 bg-amber-950/20"
      : "border-zinc-700 bg-zinc-900/60";

  return (
    <button
      type="button"
      className={`w-full text-left border rounded-md px-2 py-1.5 text-[11px] ${colorClasses}`}
      onClick={mode === "vibe" ? onToggleStrictness : undefined}
    >
      <div className="flex items-center justify-between mb-0.5">
        <span className="font-mono text-[10px] text-zinc-400">
          {pack.id}
        </span>
        <span
          className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full ${
            pack.strictness === "hard"
              ? "bg-emerald-500 text-emerald-950"
              : pack.strictness === "soft"
              ? "bg-amber-400 text-amber-950"
              : "bg-zinc-700 text-zinc-50"
          }`}
        >
          {strictLabel}
        </span>
      </div>
      <div className="text-zinc-100 mb-0.5">{pack.summary}</div>
      {pack.thresholds && Object.keys(pack.thresholds).length > 0 && (
        <div className="text-[10px] text-zinc-400">
          thresholds:{" "}
          {Object.entries(pack.thresholds)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ")}
        </div>
      )}
    </button>
  );
}
