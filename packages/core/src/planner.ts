// packages/core/src/planner.ts

import { Mode, PlanStep, ResolvedInvariantPack } from "./schema";
import { makeId } from "./utils";

export interface PlanInput {
  mode: Mode;
  invariants: ResolvedInvariantPack[];
}

export interface PlanResult {
  steps: PlanStep[];
}

/**
 * Extremely simple deterministic planner:
 * - Always emits scaffold → implement → tests → perf/ops steps.
 * - Uses invariant categories to attach descriptions.
 * You can make this richer later, but this is enough to unblock UI.
 */
export function makePlan(input: PlanInput): PlanResult {
  const { mode, invariants } = input;

  const hasFrontend = invariants.some((p) => p.category === "frontend");
  const hasBackend = invariants.some((p) => p.category === "backend");
  const hasML = invariants.some((p) => p.category === "ml");
  const hasOps = invariants.some((p) => p.category === "ops");

  const steps: PlanStep[] = [];

  steps.push({
    id: makeId("step", ["scaffold"]),
    order: 10,
    title: "Scaffold & Wiring",
    description:
      "Create or update the minimal files, routes, and types required for the feature. Prefer small, composable units.",
    tags: ["scaffold"],
  });

  steps.push({
    id: makeId("step", ["logic"]),
    order: 20,
    title: "Implement Core Logic",
    description:
      "Fill in the core business logic while respecting the invariants (types, validation, error taxonomy).",
    tags: ["logic"],
  });

  if (hasFrontend) {
    steps.push({
      id: makeId("step", ["ui-tests"]),
      order: 30,
      title: "UI Tests & Accessibility",
      description:
        "Add React Testing Library / axe-core tests for critical UI paths and ensure accessibility budgets are met.",
      tags: ["tests", "frontend"],
    });
  }

  if (hasBackend) {
    steps.push({
      id: makeId("step", ["api-contract"]),
      order: 40,
      title: "API Contracts & Error Mapping",
      description:
        "Ensure OpenAPI/JSON Schemas are updated and contract tests cover success and failure cases with correct status codes.",
      tags: ["backend", "contracts"],
    });
  }

  if (hasML) {
    steps.push({
      id: makeId("step", ["ml-eval"]),
      order: 50,
      title: "Evaluation & Safety",
      description:
        "Run offline evaluations and safety checks on model behavior, including prompt-injection and PII leakage tests.",
      tags: ["ml", "eval"],
    });
  }

  if (hasOps) {
    steps.push({
      id: makeId("step", ["ops-verify"]),
      order: 60,
      title: "Perf, Observability & Rollout",
      description:
        "Verify SLOs, observability, and rollout strategy (canary/blue-green) before deployment.",
      tags: ["ops", "observability"],
    });
  }

  return { steps };
}
