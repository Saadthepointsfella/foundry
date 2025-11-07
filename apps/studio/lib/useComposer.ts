// apps/studio/app/lib/useComposer.ts
"use client";

import { useMemo } from "react";
import type {
  Mode,
  FrameworkSelection,
  PromptSpec,
  PromptTask,
  ResolvedInvariantPack,
  PlanStep,
  VerifierCommand,
  PromptOutputPrefs,
} from "@vibefoundry/core";
import { composePrompt, makeId } from "@vibefoundry/core";

interface UseComposerArgs {
  mode: Mode;
  task: PromptTask;
  frameworks: FrameworkSelection[];
  invariants: ResolvedInvariantPack[];
  plan: PlanStep[];
  verifier: VerifierCommand[];
}

export function useComposer(args: UseComposerArgs): {
  prompt: string;
  spec: PromptSpec;
  outputPrefs: PromptOutputPrefs;
} {
  const spec = useMemo<PromptSpec>(() => {
    const stackSummary = args.frameworks
      .map((f) => f.frameworkId)
      .join(", ");

    const outputPrefs: PromptOutputPrefs = {
      format: "diff",
      allowTODOs: args.mode === "vibe",
    };

    const spec: PromptSpec = {
      id: makeId("prompt", [Date.now()]),
      mode: args.mode,
      task: args.task,
      frameworks: args.frameworks,
      invariants: args.invariants,
      plan: args.plan,
      verifier: args.verifier,
      output: outputPrefs,
      context: {
        stackSummary,
      },
    };

    return spec;
  }, [args.mode, args.task, args.frameworks, args.invariants, args.plan, args.verifier]);

  const prompt = useMemo(() => composePrompt(spec), [spec]);

  return {
    prompt,
    spec,
    outputPrefs: spec.output,
  };
}
