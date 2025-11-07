// apps/studio/app/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import type {
  Mode,
  FrameworkSelection,
  PromptTask,
  ResolvedInvariantPack,
  PlanStep,
  VerifierCommand,
} from "@vibefoundry/core"; // or from @vibefoundry/sdk if you re-export
import { useResolver } from "../lib/useResolver";
import { useComposer } from "../lib/useComposer";

import FrameworkSelect from "./(flows)/FrameworkSelect";
import VariantSelect from "./(flows)/VariantSelect";
import InvariantToggle from "./(flows)/InvariantToggle";
import IntentForm from "./(flows)/IntentForm";
import PlanPreview from "./(flows)/PlanPreview";
import SessionLog from "./(flows)/SessionLog";

type SessionEntry = {
  id: string;
  mode: Mode;
  task: PromptTask;
  prompt: string;
  createdAt: string;
};

const DEFAULT_TASK: PromptTask = {
  title: "",
  description: "",
  repoPaths: [],
  constraints: [],
};

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>("vibe");
  const [frameworkSelections, setFrameworkSelections] = useState<
    FrameworkSelection[]
  >([]);
  const [task, setTask] = useState<PromptTask>(DEFAULT_TASK);
  const [overrideInvariants, setOverrideInvariants] = useState<
    ResolvedInvariantPack[] | null
  >(null);
  const [sessionLog, setSessionLog] = useState<SessionEntry[]>([]);

  // 1) Resolve invariants + plan + verifier from frameworks/variants
  const {
    invariants: resolvedInvariants,
    plan,
    verifier,
  }: {
    invariants: ResolvedInvariantPack[];
    plan: PlanStep[];
    verifier: VerifierCommand[];
  } = useResolver(mode, frameworkSelections);

  const effectiveInvariants = overrideInvariants ?? resolvedInvariants;

  // 2) Compose final prompt from mode + task + invariants + plan + verifier
  const { prompt, outputPrefs } = useComposer({
    mode,
    task,
    invariants: effectiveInvariants,
    plan,
    verifier,
    frameworks: frameworkSelections,
  });

  const stackSummary = useMemo(() => {
    if (!frameworkSelections.length) return "no frameworks selected";
    return frameworkSelections.map((s) => s.frameworkId).join(", ");
  }, [frameworkSelections]);

  const canCompose =
    task.title.trim().length > 0 &&
    task.description.trim().length > 0 &&
    effectiveInvariants.length > 0;

  const handleSavePrompt = () => {
    if (!canCompose) return;
    const entry: SessionEntry = {
      id: `${Date.now()}`,
      mode,
      task,
      prompt,
      createdAt: new Date().toISOString(),
    };
    setSessionLog((prev) => [entry, ...prev]);
  };

  return (
    <div className="flex h-full">
      {/* Left: mode + frameworks + variants */}
      <div className="w-[26%] border-r border-zinc-800 flex flex-col gap-4 p-4 overflow-y-auto">
        <ModeToggle mode={mode} onChange={setMode} />

        <FrameworkSelect
          mode={mode}
          selections={frameworkSelections}
          onChange={setFrameworkSelections}
        />

        <VariantSelect
          mode={mode}
          selections={frameworkSelections}
          onChange={setFrameworkSelections}
        />
      </div>

      {/* Middle: invariants + intent */}
      <div className="w-[30%] border-r border-zinc-800 flex flex-col gap-4 p-4 overflow-y-auto">
        <InvariantToggle
          mode={mode}
          resolved={resolvedInvariants}
          overrides={overrideInvariants}
          onOverridesChange={setOverrideInvariants}
        />

        <IntentForm task={task} onChange={setTask} />
      </div>

      {/* Right: plan + prompt + log */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
        <PlanPreview
          mode={mode}
          stackSummary={stackSummary}
          invariants={effectiveInvariants}
          plan={plan}
          verifier={verifier}
          prompt={prompt}
          outputPrefs={outputPrefs}
          canCompose={canCompose}
          onSavePrompt={handleSavePrompt}
        />
        <SessionLog entries={sessionLog} />
      </div>
    </div>
  );
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  return (
    <div className="border border-zinc-800 rounded-lg p-3 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          mode
        </span>
        <span className="text-[10px] text-zinc-400">
          vibes → pro as you grow
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className={`flex-1 text-xs rounded-md px-2 py-1 border ${
            mode === "vibe"
              ? "border-emerald-400 bg-emerald-950 text-emerald-100"
              : "border-zinc-700 text-zinc-300"
          }`}
          onClick={() => onChange("vibe")}
        >
          Vibe Coder
        </button>
        <button
          type="button"
          className={`flex-1 text-xs rounded-md px-2 py-1 border ${
            mode === "pro"
              ? "border-sky-400 bg-sky-950 text-sky-100"
              : "border-zinc-700 text-zinc-300"
          }`}
          onClick={() => onChange("pro")}
        >
          Pro Coder
        </button>
      </div>
    </div>
  );
}
