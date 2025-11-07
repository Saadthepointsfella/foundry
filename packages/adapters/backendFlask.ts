// packages/adapters/backendFlask.ts
import type {
  Framework,
  FrameworkAdapter,
  FrameworkSelection,
  Mode,
  AdapterResolution
} from "@vibefoundry/core";

export const backendFlaskFramework: Framework = {
  id: "backend-flask",
  name: "Flask / FastAPI backend",
  description: "Python HTTP API service (Flask / FastAPI style).",
  category: "backend",
  basePackIds: [
    "be.http.idempotency",
    "be.io.validate",
    "be.err.taxonomy",
    "be.obs.triplet"
  ],
  variantDimensions: [
    {
      id: "api-style",
      label: "API style",
      description: "How clients talk to this service.",
      options: [
        { id: "rest", label: "REST (JSON over HTTP)" },
        { id: "graphql", label: "GraphQL" }
      ],
      defaultByMode: {
        vibe: "rest",
        pro: "rest"
      }
    },
    {
      id: "schema-style",
      label: "Schema discipline",
      description: "Where your source of truth for schemas lives.",
      options: [
        { id: "schema-first", label: "Schema-first (OpenAPI/JSON Schema)" },
        { id: "code-first", label: "Code-first (decorators / annotations)" }
      ],
      defaultByMode: {
        vibe: "code-first",
        pro: "schema-first"
      }
    },
    {
      id: "persistence",
      label: "Persistence",
      description: "Primary backing store for the service.",
      options: [
        { id: "postgres", label: "Postgres/SQL" },
        { id: "mongodb", label: "Mongo/NoSQL" },
        { id: "dynamodb", label: "Dynamo/Key-Value" },
        { id: "none", label: "Stateless / no DB" }
      ],
      defaultByMode: {
        vibe: "none",
        pro: "postgres"
      }
    }
  ]
};

function mapVariants(selection: FrameworkSelection): Record<string, string> {
  const m: Record<string, string> = {};
  for (const v of selection.variants) m[v.dimensionId] = v.optionId;
  return m;
}

function resolveBackendFlask(
  mode: Mode,
  selection: FrameworkSelection
): AdapterResolution {
  const variants = mapVariants(selection);
  const packIds = new Set<string>(backendFlaskFramework.basePackIds ?? []);

  const apiStyle = variants["api-style"];
  const schemaStyle = variants["schema-style"];
  const persistence = variants["persistence"];

  if (apiStyle === "rest" && schemaStyle === "schema-first") {
    packIds.add("be.api.schema-first");
  }

  // Persistence-aware invariants
  if (persistence && persistence !== "none") {
    packIds.add("be.db.tx-bounds");
  }

  // SLO + rate limiting are stronger in pro mode
  packIds.add("be.perf.slo");
  if (mode === "pro") {
    packIds.add("be.sec.ratelimit.authz");
  }

  return {
    frameworkId: backendFlaskFramework.id,
    packIds: Array.from(packIds),
    planHints: [apiStyle, schemaStyle, persistence].filter(Boolean) as string[]
  };
}

export const backendFlaskAdapter: FrameworkAdapter = {
  framework: backendFlaskFramework,
  resolveVariants: resolveBackendFlask
};
