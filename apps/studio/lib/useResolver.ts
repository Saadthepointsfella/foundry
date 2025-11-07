// apps/studio/app/lib/useResolver.ts
"use client";

import { useMemo } from "react";
import type {
  Mode,
  FrameworkSelection,
  ResolvedInvariantPack,
  PlanStep,
  VerifierCommand,
} from "@vibefoundry/core";
import {
  resolveInvariants,
  makePlan,
  makeVerifier,
} from "@vibefoundry/core";
import { adapters } from "@vibefoundry/adapters";
import { packs } from "@vibefoundry/packs-registry"; // you can expose a combined registry from packages/packs

export function useResolver(
  mode: Mode,
  selections: FrameworkSelection[]
): {
  invariants: ResolvedInvariantPack[];
  plan: PlanStep[];
  verifier: VerifierCommand[];
} {
  return useMemo(() => {
    if (selections.length === 0) {
      return { invariants: [], plan: [], verifier: [] };
    }

    const { invariants } = resolveInvariants({
      mode,
      selections,
      adapters,
      packs,
    });

    const { steps } = makePlan({ mode, invariants });
    const { commands } = makeVerifier({ mode, invariants });

    return {
      invariants,
      plan: steps,
      verifier: commands,
    };
  }, [mode, selections]);
}
