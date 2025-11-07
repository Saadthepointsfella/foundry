// packages/core/src/composer.ts

import {
  Mode,
  PromptSpec,
  ResolvedInvariantPack,
  VerifierCommand,
} from "./schema";

/**
 * Render the full prompt text that users will copy into their LLM.
 * Sections:
 *  - SYSTEM
 *  - MODE
 *  - INVARIANTS
 *  - TASK
 *  - OUTPUT FORMAT
 *  - VERIFICATION
 */
export function composePrompt(spec: PromptSpec): string {
  const { mode } = spec;

  const parts: string[] = [];

  // SYSTEM
  parts.push(renderSystemSection(mode));

  // MODE banner & context
  parts.push(renderModeBanner(spec));

  // INVARIANTS
  parts.push(renderInvariantsSection(spec.invariants));

  // TASK
  parts.push(renderTaskSection(spec));

  // PLAN (optional but nice UX – gives the model structure)
  if (spec.plan.length > 0) {
    parts.push(renderPlanSection(spec));
  }

  // OUTPUT FORMAT
  parts.push(renderOutputSection(spec));

  // VERIFIER
  if (spec.verifier.length > 0) {
    parts.push(renderVerifierSection(spec.verifier));
  }

  return parts.join("\n\n");
}

function renderSystemSection(mode: Mode): string {
  if (mode === "vibe") {
    return [
      "SYSTEM:",
      "You are a collaborative, fast-moving pair programmer.",
      "Priorities: speed, clarity, small reversible changes.",
      "Non-negotiables: never leak secrets, keep type boundaries sound, validate external inputs, and avoid obvious foot-guns.",
      "You are generating code *only via text suggestions*, not running commands.",
    ].join("\n");
  }

  // pro
  return [
    "SYSTEM:",
    "You are a senior production engineer.",
    "Priorities: correctness, contracts, SLO adherence, observability, and security.",
    "Non-negotiables: schema-first APIs, versioned contracts, strict performance and bundle budgets, and comprehensive tests.",
    "You are generating code *only via text suggestions*, not running commands.",
  ].join("\n");
}

function renderModeBanner(spec: PromptSpec): string {
  const { mode } = spec;
  const label =
    mode === "vibe" ? "VIBE CODER MODE (exploratory, TODOs allowed)" :
    "PRO CODER MODE (production-grade, no TODOs)";
  const stack = spec.context?.stackSummary ?? "";
  return [
    "MODE:",
    `- ${label}`,
    stack ? `- Stack: ${stack}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function renderInvariantsSection(
  invariants: ResolvedInvariantPack[]
): string {
  if (!invariants.length) return "INVARIANTS:\n- (none)";

  const lines: string[] = ["INVARIANTS (rules and budgets you must respect):"];

  for (const pack of invariants) {
    const header = `- [${pack.id}] (${pack.category}) — ${pack.summary}`;
    lines.push(header);

    for (const rule of pack.must) {
      lines.push(`  • ${rule}`);
    }

    if (pack.thresholds && Object.keys(pack.thresholds).length > 0) {
      const th = Object.entries(pack.thresholds)
        .map(([k, v]) => `${k}: ${String(v)}`)
        .join(", ");
      lines.push(`  • thresholds: ${th}`);
    }
  }

  return lines.join("\n");
}

function renderTaskSection(spec: PromptSpec): string {
  const { task } = spec;

  const lines: string[] = [
    "TASK:",
    `Title: ${task.title}`,
    "",
    task.description.trim(),
  ];

  if (task.repoPaths?.length) {
    lines.push(
      "",
      `Target paths: ${task.repoPaths.join(", ")}`
    );
  }

  if (task.constraints?.length) {
    lines.push(
      "",
      "Constraints:",
      ...task.constraints.map((c) => `- ${c}`)
    );
  }

  return lines.join("\n");
}

function renderPlanSection(spec: PromptSpec): string {
  const lines: string[] = [
    "IMPLEMENTATION PLAN:",
    "Follow these steps in order. Keep each step as a small, reviewable diff.",
  ];

  const sorted = [...spec.plan].sort((a, b) => a.order - b.order);

  for (const step of sorted) {
    lines.push(
      "",
      `- (${step.order}) ${step.title}`,
      `  ${step.description}`
    );
  }

  return lines.join("\n");
}

function renderOutputSection(spec: PromptSpec): string {
  const { format, allowTODOs } = spec.output;

  const lines: string[] = [
    "OUTPUT FORMAT:",
    "- Provide only code and file changes, no extra commentary.",
  ];

  if (format === "diff") {
    lines.push(
      "- Output a unified diff (git-style) with correct paths and context."
    );
  } else if (format === "multi-file") {
    lines.push(
      "- Output code grouped by file, using clear headings like `// file: path/to/file.ts`."
    );
  } else {
    lines.push(
      "- Output a single complete file, no surrounding text."
    );
  }

  if (allowTODOs) {
    lines.push(
      "- You may use TODO comments for non-critical follow-ups, but the main path must be functional."
    );
  } else {
    lines.push(
      "- Do NOT leave TODO comments; all core behavior must be fully implemented."
    );
  }

  lines.push(
    "- Do not modify unrelated code.",
    "- Do not introduce new dependencies unless strictly necessary; if you must, explain why in a short comment."
  );

  return lines.join("\n");
}

function renderVerifierSection(commands: VerifierCommand[]): string {
  if (!commands.length) {
    return "VERIFICATION:\n- No automated checks specified.";
  }

  const lines: string[] = [
    "VERIFICATION (commands that should pass after applying your changes):",
  ];

  for (const cmd of commands) {
    const severity = cmd.critical ? "CRITICAL" : "advisory";
    lines.push(
      `- [${severity}] ${cmd.command}  # ${cmd.label}`
    );
  }

  lines.push(
    "",
    "You MUST write the code such that these commands are expected to pass without manual fixes."
  );

  return lines.join("\n");
}
