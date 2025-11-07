// apps/studio/app/layout.tsx
import React from "react";
import "../styles.css"; // optional: if you have a global stylesheet

export const metadata = {
  title: "Vibe Studio – vibefoundry",
  description: "Prompt-engineering OS for software engineers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-50">
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm uppercase tracking-[0.3em] text-zinc-400">
                vibefoundry
              </span>
              <span className="text-xs text-zinc-500">/ studio</span>
            </div>
            <div className="text-xs text-zinc-500">
              frameworks → variants → invariants → prompt
            </div>
          </header>
          <main className="flex-1 overflow-hidden">{children}</main>
        </div>
      </body>
    </html>
  );
}
