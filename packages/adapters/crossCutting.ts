// packages/adapters/crossCutting.ts
import type {
  Framework,
  FrameworkAdapter,
  FrameworkSelection,
  Mode,
  AdapterResolution
} from "@vibefoundry/core";

export const crossCuttingFramework: Framework = {
  id: "cross-cutting",
  name: "Cross-cutting defaults",
  description: "Types, secrets, logging, and versioning defaults.",
  category: "cross-cutting",
  basePackIds: [
    "xcut.types.strict",
    "xcut.sec.secrets.envonly",
    "xcut.obs.structlog",
    "xcut.sec.validate.edge",
    "xcut.versioning.deprecation"
  ],
  variantDimensions: []
};

function resolveCrossCutting(
  _mode: Mode,
  _selection: FrameworkSelection
): AdapterResolution {
  return {
    frameworkId: crossCuttingFramework.id,
    packIds: crossCuttingFramework.basePackIds ?? [],
    planHints: ["cross-cutting"]
  };
}

export const crossCuttingAdapter: FrameworkAdapter = {
  framework: crossCuttingFramework,
  resolveVariants: resolveCrossCutting
};
