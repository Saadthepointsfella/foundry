// packages/core/src/schema.ts

export type Mode = "vibe" | "pro";

/**
 * High-level categories used for grouping in the UI and prompt.
 */
export type InvariantCategory =
  | "cross-cutting"
  | "frontend"
  | "backend"
  | "ml"
  | "blockchain"
  | "ops"
  | "data"
  | "other";

export interface Thresholds {
  // arbitrary numeric or string thresholds; keys are pack-defined
  [key: string]: number | string | boolean;
}

/**
 * Enforcement metadata – what kind of checks this pack implies.
 * These map directly into VerifierCommands.
 */
export interface EnforcementConfig {
  lint?: string[];   // e.g. ["pnpm lint", "eslint src/**/*.ts"]
  tests?: string[];  // e.g. ["pnpm test", "pytest tests/"]
  perf?: string[];   // e.g. ["k6 run perf/smoke.js"]
  build?: string[];  // e.g. ["pnpm build"]
  security?: string[]; // e.g. ["osv-scanner -r ."]
  custom?: string[];   // any additional commands
}

/**
 * Mode-specific overrides for a pack – mainly thresholds + strictness.
 */
export type ModeOverrides = {
  [K in Mode]?: {
    thresholds?: Thresholds;
    // A pack can be soft in vibe mode, hard in pro mode, etc.
    strictness?: "off" | "soft" | "hard";
  };
};

/**
 * Atomic invariant unit, usually authored in JSON in packages/packs.
 */
export interface InvariantPack {
  id: string; // unique, e.g. "fe.a11y.baseline"
  name?: string;
  summary: string;
  category: InvariantCategory;
  must: string[]; // human-readable rules
  thresholds?: Thresholds;
  enforce?: EnforcementConfig;
  modeOverrides?: ModeOverrides;
}

/**
 * After resolution, we keep some provenance + resolved strictness.
 */
export interface ResolvedInvariantPack extends InvariantPack {
  // strictness effective for a given mode
  strictness: "off" | "soft" | "hard";
  // where this pack came from (framework/variant)
  sources: {
    frameworkId?: FrameworkId;
    variantIds?: string[];
    reason?: string;
  }[];
}

/**
 * Variant dimension for a framework – e.g. "rendering", "apiStyle".
 */
export interface VariantDimension {
  id: string;          // "rendering"
  label: string;       // "Rendering Strategy"
  description?: string;
  options: VariantOption[];
  // optional default per mode
  defaultByMode?: Partial<Record<Mode, string>>; // option.id
}

/**
 * A single option inside a dimension – e.g. "SSR" or "REST".
 */
export interface VariantOption {
  id: string;         // "ssr", "rest"
  label: string;      // "Server-Side Rendering (SSR)"
  description?: string;
}

/**
 * What the user actually selected.
 */
export interface VariantSelection {
  dimensionId: string;
  optionId: string;
}

/**
 * Framework identity – e.g. Next.js frontend, Flask backend, etc.
 * Adapters will be keyed by frameworkId.
 */
export type FrameworkId =
  | "frontend-react"
  | "backend-flask"
  | "ml-pytorch"
  | "evm-solidity"
  | "ops-k8s"
  | "cross-cutting"
  | string; // allow extension

export interface Framework {
  id: FrameworkId;
  name: string;
  description?: string;
  category: InvariantCategory;
  // Which variant dimensions this framework exposes.
  variantDimensions: VariantDimension[];
  // Base packs that always apply when this framework is selected.
  basePackIds?: string[];
}

/**
 * A single framework + its chosen variants for a session.
 */
export interface FrameworkSelection {
  frameworkId: FrameworkId;
  variants: VariantSelection[];
}

/**
 * The resolved result from the adapter layer:
 * from framework + variants to a list of implied pack IDs + hints.
 */
export interface AdapterResolution {
  frameworkId: FrameworkId;
  packIds: string[];
  // optional hints that planner/verifier can use
  planHints?: string[];
}

/**
 * Adapter interface each domain adapter implements.
 */
export interface FrameworkAdapter {
  framework: Framework;
  resolveVariants: (
    mode: Mode,
    selection: FrameworkSelection
  ) => AdapterResolution;
}

/**
 * Registry types
 */
export type AdapterRegistry = Record<FrameworkId, FrameworkAdapter>;
export type PackRegistry = Record<string, InvariantPack>;

/**
 * One step in the high-level execution plan presented to the user.
 */
export interface PlanStep {
  id: string;
  title: string;
  description: string;
  // Used for ordering and grouping in UI.
  order: number;
  tags?: string[]; // e.g. ["scaffold", "tests", "perf"]
}

/**
 * Commands that we surface in the verifier section of the prompt.
 */
export interface VerifierCommand {
  id: string;
  label: string;  // human-facing
  command: string; // shell command
  // Whether failure is allowed in this mode.
  critical: boolean;
  // Optional categories: "lint", "tests", etc.
  kind?: keyof EnforcementConfig | "other";
}

/**
 * A single "session" prompt spec – everything needed to compile
 * the final prompt string.
 */
export interface PromptTask {
  title: string;
  description: string;
  // Files or directories involved, user-provided.
  repoPaths?: string[];
  constraints?: string[]; // "do not touch auth", etc.
}

export type OutputFormat = "diff" | "multi-file" | "single-file";

export interface PromptOutputPrefs {
  format: OutputFormat;
  // Whether TODOs are permitted in code output (vibe = true, pro = false).
  allowTODOs: boolean;
}

/**
 * Main primitive of the whole system.
 */
export interface PromptSpec {
  id: string;
  mode: Mode;
  task: PromptTask;
  frameworks: FrameworkSelection[];
  invariants: ResolvedInvariantPack[];
  plan: PlanStep[];
  verifier: VerifierCommand[];
  output: PromptOutputPrefs;
  // free-form context / notes
  context?: {
    stackSummary?: string;
    userNotes?: string;
  };
}
