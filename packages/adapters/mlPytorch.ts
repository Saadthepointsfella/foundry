// packages/adapters/mlPytorch.ts
import type {
  Framework,
  FrameworkAdapter,
  FrameworkSelection,
  Mode,
  AdapterResolution
} from "@vibefoundry/core";

export const mlPytorchFramework: Framework = {
  id: "ml-pytorch",
  name: "ML – PyTorch",
  description: "Training and serving models with PyTorch.",
  category: "ml",
  basePackIds: [
    "ml.det.seeded",
    "ml.data.lineage",
    "ml.train.repro",
    "ml.eval.holdout"
  ],
  variantDimensions: [
    {
      id: "phase",
      label: "Phase",
      description: "Where this prompt will focus.",
      options: [
        { id: "training", label: "Training / experimentation" },
        { id: "serving", label: "Serving / inference" }
      ],
      defaultByMode: {
        vibe: "training",
        pro: "serving"
      }
    },
    {
      id: "surface",
      label: "Surface",
      description: "Is this internal or user-facing?",
      options: [
        { id: "internal", label: "Internal / batch" },
        { id: "user-facing", label: "User-facing (interactive)" }
      ],
      defaultByMode: {
        vibe: "internal",
        pro: "user-facing"
      }
    }
  ]
};

function mapVariants(selection: FrameworkSelection): Record<string, string> {
  const m: Record<string, string> = {};
  for (const v of selection.variants) m[v.dimensionId] = v.optionId;
  return m;
}

function resolveMlPytorch(
  mode: Mode,
  selection: FrameworkSelection
): AdapterResolution {
  const variants = mapVariants(selection);
  const packIds = new Set<string>(mlPytorchFramework.basePackIds ?? []);

  const phase = variants["phase"];
  const surface = variants["surface"];

  if (phase === "serving") {
    packIds.add("ml.perf.qps");
  }

  if (surface === "user-facing") {
    packIds.add("ml.features.contracts");
    packIds.add("ml.safety.filters");
  }

  return {
    frameworkId: mlPytorchFramework.id,
    packIds: Array.from(packIds),
    planHints: [phase, surface].filter(Boolean) as string[]
  };
}

export const mlPytorchAdapter: FrameworkAdapter = {
  framework: mlPytorchFramework,
  resolveVariants: resolveMlPytorch
};
