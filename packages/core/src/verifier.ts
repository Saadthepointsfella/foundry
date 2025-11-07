// packages/core/src/verifier.ts

import { Mode, ResolvedInvariantPack, VerifierCommand } from "./schema";
import { makeId } from "./utils";

export interface VerifierInput {
  mode: Mode;
  invariants: ResolvedInvariantPack[];
}

export interface VerifierResult {
  commands: VerifierCommand[];
}

/**
 * Collapse enforcement configs on packs into a normalized list of
 * VerifierCommands, taking mode into account.
 */
export function makeVerifier(input: VerifierInput): VerifierResult {
  const { mode, invariants } = input;

  const commands: VerifierCommand[] = [];

  for (const pack of invariants) {
    if (!pack.enforce) continue;
    if (pack.strictness === "off") continue;

    const critical = mode === "pro" || pack.strictness === "hard";

    const pushCommands = (kind: VerifierCommand["kind"], cmds?: string[]) => {
      if (!cmds?.length) return;
      for (const cmd of cmds) {
        commands.push({
          id: makeId("cmd", [kind ?? "other", cmd]),
          label: `${kind ?? "other"}: ${pack.summary}`,
          command: cmd,
          critical,
          kind,
        });
      }
    };

    pushCommands("lint", pack.enforce.lint);
    pushCommands("tests", pack.enforce.tests);
    pushCommands("perf", pack.enforce.perf);
    pushCommands("build", pack.enforce.build);
    pushCommands("security", pack.enforce.security);
    pushCommands("custom", pack.enforce.custom);
  }

  // Deduplicate by command string
  const byCmd = new Map<string, VerifierCommand>();
  for (const cmd of commands) {
    const existing = byCmd.get(cmd.command);
    if (!existing) {
      byCmd.set(cmd.command, cmd);
    } else if (cmd.critical && !existing.critical) {
      // upgrade to critical if any source is critical
      byCmd.set(cmd.command, { ...existing, critical: true });
    }
  }

  return { commands: Array.from(byCmd.values()) };
}
