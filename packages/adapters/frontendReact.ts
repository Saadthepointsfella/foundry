// packages/adapters/frontendReact.ts
import type {
  Framework,
  FrameworkAdapter,
  FrameworkSelection,
  Mode,
  AdapterResolution,
} from "@vibefoundry/core";

export const frontendReactFramework: Framework = {
  id: "frontend-react",
  name: "React / Next.js frontend",
  description: "React or Next.js UI layer with TypeScript.",
  category: "frontend",
  basePackIds: [
    "fe.component.pure-render",
    "fe.state.local",
    "fe.a11y.baseline",
    "fe.tests.rtl-min"
  ],
  variantDimensions: [
    {
      id: "runtime",
      label: "Runtime / Router",
      description: "How views are structured and routed.",
      options: [
        { id: "react-spa", label: "React SPA (Vite/CRA)" },
        { id: "next-app", label: "Next.js (App Router)" },
        { id: "next-pages", label: "Next.js (Pages Router)" }
      ],
      defaultByMode: {
        vibe: "react-spa",
        pro: "next-app"
      }
    },
    {
      id: "data-fetching",
      label: "Data fetching strategy",
      description: "Where data is loaded.",
      options: [
        { id: "csr", label: "Client-side fetching (CSR)" },
        { id: "ssr", label: "SSR / Server Components" }
      ],
      defaultByMode: {
        vibe: "csr",
        pro: "ssr"
      }
    },
    {
      id: "styling",
      label: "Styling",
      description: "How components are styled.",
      options: [
        { id: "tailwind", label: "Tailwind" },
        { id: "css-modules", label: "CSS Modules" }
      ],
      defaultByMode: {
        vibe: "tailwind",
        pro: "tailwind"
      }
    }
  ]
};

function getVariantMap(selection: FrameworkSelection): Record<string, string> {
  const map: Record<string, string> = {};
  for (const v of selection.variants) {
    map[v.dimensionId] = v.optionId;
  }
  return map;
}

function resolveFrontendReact(
  mode: Mode,
  selection: FrameworkSelection
): AdapterResolution {
  const variantMap = getVariantMap(selection);
  const packIds = new Set<string>(frontendReactFramework.basePackIds ?? []);

  const runtime = variantMap["runtime"];
  const dataFetching = variantMap["data-fetching"];
  const styling = variantMap["styling"];

  // Runtime influences routing + hydration invariants
  if (runtime === "next-app" || runtime === "next-pages") {
    packIds.add("fe.routing.stable-ids");
    packIds.add("fe.ssr.hydration");
    packIds.add("fe.bundle.budget");
  } else {
    // React SPA still cares about bundle + routing, but a bit looser
    packIds.add("fe.bundle.budget");
  }

  // Data fetching
  if (dataFetching === "ssr") {
    packIds.add("fe.ssr.hydration");
  }

  // Styling
  if (styling === "tailwind") {
    packIds.add("fe.style.tailwind.tokens");
  }

  // Image + error boundaries are always good practice in Pro; optional in Vibe.
  if (mode === "pro") {
    packIds.add("fe.media.images");
    packIds.add("fe.error.boundaries");
  } else {
    // In vibe, include them but they can be softened by the user.
    packIds.add("fe.media.images");
  }

  return {
    frameworkId: frontendReactFramework.id,
    packIds: Array.from(packIds),
    planHints: [
      "frontend-ui",
      runtime,
      dataFetching,
      styling
    ].filter(Boolean) as string[]
  };
}

export const frontendReactAdapter: FrameworkAdapter = {
  framework: frontendReactFramework,
  resolveVariants: resolveFrontendReact
};
