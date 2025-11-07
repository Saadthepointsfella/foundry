// apps/studio/app/(flows)/VariantSelect.tsx
"use client";

import React from "react";
import type { FrameworkSelection, Mode } from "@vibefoundry/core";
import { adapterRegistry } from "@vibefoundry/adapters";

interface Props {
  mode: Mode;
  selections: FrameworkSelection[];
  onChange: (next: FrameworkSelection[]) => void;
}

export default function VariantSelect({ selections, onChange }: Props) {
  const handleVariantChange = (
    frameworkId: string,
    dimensionId: string,
    optionId: string
  ) => {
    const next = selections.map((sel) => {
      if (sel.frameworkId !== frameworkId) return sel;

      const existing = sel.variants.find(
        (v) => v.dimensionId === dimensionId
      );
      if (existing) {
        return {
          ...sel,
          variants: sel.variants.map((v) =>
            v.dimensionId === dimensionId ? { ...v, optionId } : v
          ),
        };
      }
      return {
        ...sel,
        variants: [...sel.variants, { dimensionId, optionId }],
      };
    });

    onChange(next);
  };

  if (selections.length === 0) {
    return (
      <section className="border border-zinc-800 rounded-lg p-3 text-[11px] text-zinc-500">
        Choose one or more frameworks to configure their variants.
      </section>
    );
  }

  return (
    <section className="border border-zinc-800 rounded-lg p-3 flex flex-col gap-4">
      <header>
        <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          variants
        </span>
        <p className="text-[11px] text-zinc-400">
          For each framework, pick the flavour you&apos;re actually using
          (SSR vs CSR, REST vs GraphQL, etc.). Variants determine which
          invariants apply.
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {selections.map((sel) => {
          const adapter = adapterRegistry[sel.frameworkId];
          if (!adapter) return null;

          const dims = adapter.framework.variantDimensions;

          return (
            <div
              key={sel.frameworkId}
              className="rounded-md border border-zinc-800 p-2"
            >
              <div className="text-xs font-medium text-zinc-200 mb-2">
                {adapter.framework.name}
              </div>
              <div className="flex flex-col gap-3">
                {dims.map((dim) => {
                  const current = sel.variants.find(
                    (v) => v.dimensionId === dim.id
                  );
                  return (
                    <div key={dim.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-zinc-300">
                          {dim.label}
                        </span>
                        {dim.description && (
                          <span className="text-[10px] text-zinc-500">
                            {dim.description}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {dim.options.map((opt) => {
                          const active = current?.optionId === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              className={`text-[11px] px-2 py-0.5 rounded-full border ${
                                active
                                  ? "border-emerald-400 bg-emerald-950 text-emerald-100"
                                  : "border-zinc-700 text-zinc-300"
                              }`}
                              onClick={() =>
                                handleVariantChange(
                                  sel.frameworkId,
                                  dim.id,
                                  opt.id
                                )
                              }
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
