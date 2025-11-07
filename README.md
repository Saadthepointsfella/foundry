# SaveX

**Deterministic AI Framework Orchestration System**

SaveX is a structured system for managing AI-driven development workflows with deterministic guarantees, automated verification, and intelligent prompt composition.

## Overview

SaveX provides a complete toolkit for:
- 🎯 **Framework-aware prompt composition** - Tailored prompts for React, Flask, PyTorch, Solidity, K8s, and more
- 🔧 **Variant management** - Handle feature flags, configurations, and dependencies
- ✅ **Invariant enforcement** - Maintain security, performance, and quality standards
- 📋 **Automated planning** - Generate deterministic execution plans
- 🔍 **Verification engine** - Run automated checks, tests, and linters
- 🔄 **Repair workflows** - Structured feedback loops for fixing issues

## Project Structure

```
savex/
├── packages/          # Core deterministic engine
│   ├── core/         # Schema, resolver, composer, planner, verifier
│   ├── packs/        # Curated invariant libraries
│   ├── adapters/     # Variant logic for different frameworks
│   ├── engine/       # Diff parser, test runner, repair logic
│   └── sdk/          # Client SDK for integration
├── apps/
│   ├── studio/       # Next.js web UI
│   ├── cli/          # Command-line interface
│   └── vscode/       # VS Code extension
├── runners/          # Framework-specific check runners
├── infra/            # Templates, CI workflows, Docker configs
└── docs/             # Documentation
```

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Run tests
pnpm test

# Build all packages
pnpm build
```

## Documentation

- [Architecture](./docs/architecture.md)
- [Schema Reference](./docs/schema.md)
- [Packs Guide](./docs/packs-guide.md)
- [Prompting Flow](./docs/prompting-flow.md)
- [VS Code Integration](./docs/integration-vscode.md)
- [Contributing](./docs/contribution.md)

## License

MIT
