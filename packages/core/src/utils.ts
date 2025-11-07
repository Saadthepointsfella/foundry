// packages/core/src/utils.ts

import {
  Mode,
  ResolvedInvariantPack,
  InvariantPack,
  FrameworkSelection,
  FrameworkAdapter,
  AdapterRegistry,
} from "./schema";

/**
 * Simple deterministic ID helper – avoids pulling in nanoid/etc
 * for core. Caller can prepend domain-specific prefixes.
 */
export function makeId(prefix: string, parts: (string | number)[]): string {
  const body = parts.join("-");
  return `${prefix}:${body}`;
}

/**
 * Apply mode overrides to a base pack to get a ResolvedInvariantPack.
 */
export function resolvePackForMode(
  pack: InvariantPack,
  mode: Mode
): ResolvedInvariantPack {
  const overrides = pack.modeOverrides?.[mode];
  const thresholds = {
    ...(pack.thresholds ?? {}),
    ...(overrides?.thresholds ?? {}),
  };

  const strictness = overrides?.strictness ?? "hard";

  return {
    ...pack,
    thresholds,
    strictness,
    sources: [],
  };
}

/**
 * Merge multiple ResolvedInvariantPacks with the same id.
 * - unions `must` and `sources`
 * - last-wins for thresholds/strictness (later ones can be more specific).
 */
export function mergeResolvedPacks(
  packs: ResolvedInvariantPack[]
): ResolvedInvariantPack[] {
  const byId = new Map<string, ResolvedInvariantPack>();

  for (const pack of packs) {
    const existing = byId.get(pack.id);
    if (!existing) {
      byId.set(pack.id, { ...pack, sources: [...pack.sources] });
    } else {
      byId.set(pack.id, {
        ...existing,
        ...pack,
        must: Array.from(new Set([...existing.must, ...pack.must])),
        sources: [...existing.sources, ...pack.sources],
      });
    }
  }

  return Array.from(byId.values()).sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Helper to run all adapters for the user-selected frameworks.
 */
export function resolveAdaptersForSelections(
  mode: Mode,
  selections: FrameworkSelection[],
  registry: AdapterRegistry
): {
  resolutions: {
    selection: FrameworkSelection;
    adapter: FrameworkAdapter;
    packIds: string[];
  }[];
} {
  const resolutions: {
    selection: FrameworkSelection;
    adapter: FrameworkAdapter;
    packIds: string[];
  }[] = [];

  for (const sel of selections) {
    const adapter = registry[sel.frameworkId];
    if (!adapter) continue;

    const result = adapter.resolveVariants(mode, sel);
    resolutions.push({
      selection: sel,
      adapter,
      packIds: result.packIds,
    });
  }

  return { resolutions };
}
