// packages/core/src/resolver.ts

import {
  AdapterRegistry,
  FrameworkSelection,
  Mode,
  PackRegistry,
  ResolvedInvariantPack,
} from "./schema";
import { resolvePackForMode, mergeResolvedPacks, resolveAdaptersForSelections } from "./utils";

export interface ResolveInput {
  mode: Mode;
  selections: FrameworkSelection[];
  adapters: AdapterRegistry;
  packs: PackRegistry;
}

export interface ResolveResult {
  invariants: ResolvedInvariantPack[];
}

/**
 * Deterministically resolve frameworks + variant selections into a
 * final set of ResolvedInvariantPacks.
 *
 * No IO, no randomness – purely combinatorial.
 */
export function resolveInvariants(input: ResolveInput): ResolveResult {
  const { mode, selections, adapters, packs } = input;

  const { resolutions } = resolveAdaptersForSelections(mode, selections, adapters);

  const resolved: ResolvedInvariantPack[] = [];

  for (const { selection, adapter, packIds } of resolutions) {
    for (const packId of packIds) {
      const pack = packs[packId];
      if (!pack) {
        // Silent skip: pack library and adapters are assumed consistent.
        continue;
      }
      const base = resolvePackForMode(pack, mode);
      base.sources.push({
        frameworkId: selection.frameworkId,
        variantIds: selection.variants.map((v) => v.optionId),
        reason: adapter.framework.name,
      });
      resolved.push(base);
    }
  }

  return {
    invariants: mergeResolvedPacks(resolved),
  };
}
