// apps/studio/app/components/DiffViewer.tsx
"use client";

import React from "react";
import type { OutputFormat } from "@vibefoundry/core";

interface Props {
  prompt: string;
  outputFormat: OutputFormat;
}

export default function DiffViewer({ prompt }: Props) {
  return (
    <div className="h-full w-full bg-zinc-950 text-zinc-100 text-xs font-mono overflow-auto p-3">
      <pre className="whitespace-pre-wrap">{prompt}</pre>
    </div>
  );
}
