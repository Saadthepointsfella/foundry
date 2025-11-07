// packages/adapters/opsK8s.ts
import type {
  Framework,
  FrameworkAdapter,
  FrameworkSelection,
  Mode,
  AdapterResolution
} from "@vibefoundry/core";

export const opsK8sFramework: Framework = {
  id: "ops-k8s",
  name: "Ops / Kubernetes",
  description: "Runtime and deployment layer on Kubernetes.",
  category: "ops",
  basePackIds: [
    "ops.k8s.policies",
    "ops.build.immutable"
  ],
  variantDimensions: [
    {
      id: "env",
      label: "Environment",
      description: "Primary environment you are targeting.",
      options: [
        { id: "dev", label: "Development" },
        { id: "staging", label: "Staging" },
        { id: "prod", label: "Production" }
      ],
      defaultByMode: {
        vibe: "dev",
        pro: "prod"
      }
    },
    {
      id: "rollout",
      label: "Rollout strategy",
      description: "How changes are rolled out.",
      options: [
        { id: "rolling", label: "Rolling update" },
        { id: "canary", label: "Canary" },
        { id: "blue-green", label: "Blue/green" }
      ],
      defaultByMode: {
        vibe: "rolling",
        pro: "canary"
      }
    }
  ]
};

function mapVariants(selection: FrameworkSelection): Record<string, string> {
  const m: Record<string, string> = {};
  for (const v of selection.variants) m[v.dimensionId] = v.optionId;
  return m;
}

function resolveOpsK8s(
  mode: Mode,
  selection: FrameworkSelection
): AdapterResolution {
  const variants = mapVariants(selection);
  const packIds = new Set<string>(opsK8sFramework.basePackIds ?? []);

  const env = variants["env"];
  const rollout = variants["rollout"];

  packIds.add("ops.sre.slo");
  packIds.add("ops.cost.guardrails");

  if (rollout === "canary" || rollout === "blue-green") {
    packIds.add("ops.deploy.canary");
  }

  return {
    frameworkId: opsK8sFramework.id,
    packIds: Array.from(packIds),
    planHints: [env, rollout].filter(Boolean) as string[]
  };
}

export const opsK8sAdapter: FrameworkAdapter = {
  framework: opsK8sFramework,
  resolveVariants: resolveOpsK8s
};
