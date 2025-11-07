// apps/studio/app/(flows)/PlanPreview.tsx
"use client";

import React from "react";
import type {
  Mode,
  ResolvedInvariantPack,
  PlanStep,
  VerifierCommand,
  PromptOutputPrefs,
} from "@vibefoundry/core";
import DiffViewer from "../../components/DiffViewer";

interface Props {
  mode: Mode;
  stackSummary: string;
  invariants: ResolvedInvariantPack[];
  plan: PlanStep[];
  verifier: VerifierCommand[];
  prompt: string;
  outputPrefs: PromptOutputPrefs;
  canCompose: boolean;
  onSavePrompt: () => void;
}

export default function PlanPreview({
  mode,
  stackSummary,
  invariants,
  plan,
  verifier,
  prompt,
  outputPrefs,
  canCompose,
  onSavePrompt,
}: Props) {
  return (
    <section className="border border-zinc-800 rounded-lg flex flex-col min-h-[260px] max-h-[420px]">
      <header className="px-3 py-2 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            prompt preview
          </span>
          <span className="text-[11px] text-zinc-400">
            {stackSummary} ·{" "}
            {mode === "vibe"
              ? "Vibe Coder · TODOs allowed, light gates"
              : "Pro Coder · strict invariants, CI-style verification"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-[11px] rounded-md border border-zinc-700 px-2 py-1 text-zinc-300 hover:border-zinc-500"
            onClick={() => {
              navigator.clipboard.writeText(prompt).catch(() => {});
            }}
            disabled={!canCompose}
          >
            Copy prompt
          </button>
          <button
            type="button"
            className="text-[11px] rounded-md border border-emerald-500 px-2 py-1 text-emerald-100 bg-emerald-950 disabled:opacity-40"
            onClick={onSavePrompt}
            disabled={!canCompose}
          >
            Save to session
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left column: plan + checks summary */}
        <div className="w-[32%] border-r border-zinc-800 p-2 overflow-y-auto text-[11px] text-zinc-300">
          <div className="mb-2">
            <div className="font-semibold text-zinc-200 mb-1">Plan</div>
            {plan.length === 0 ? (
              <p className="text-zinc-500">
                Select frameworks/variants to generate a plan.
              </p>
            ) : (
              <ol className="space-y-1 list-decimal list-inside">
                {plan
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((step) => (
                    <li key={step.id}>
                      <span className="font-medium">{step.title}</span>
                      <br />
                      <span className="text-zinc-400">
                        {step.description}
                      </span>
                    </li>
                  ))}
              </ol>
            )}
          </div>

          <div>
            <div className="font-semibold text-zinc-200 mb-1">
              Checks implied
            </div>
            {verifier.length === 0 ? (
              <p className="text-zinc-500">
                No checks yet. Add frameworks or invariants.
              </p>
            ) : (
              <ul className="space-y-1">
                {verifier.map((cmd) => (
                  <li key={cmd.id}>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 ${
                        cmd.critical
                          ? "bg-red-950 text-red-200"
                          : "bg-zinc-900 text-zinc-300"
                      }`}
                    >
                      <span className="text-[9px] uppercase">
                        {cmd.critical ? "critical" : "advisory"}
                      </span>
                      <span className="text-[9px] font-mono">
                        {cmd.command}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right column: prompt text */}
        <div className="flex-1 p-0 overflow-hidden">
          <DiffViewer
            prompt={prompt}
            outputFormat={outputPrefs.format}
          />
        </div>
      </div>
    </section>
  );
}
