import React from "react";
import { cn } from "@/lib/utils";

const taglines = [
  "EFFORTLESS ELEGANCE",
  "SS_'26 EDITION",
  "BE YOURSELF",
  "#SYSTASYSTA",
  "#BUUBUVIBES",
];

export function MarqueeTicker({ className }: { className?: string }) {
  // Duplicate array a few times to ensure smooth infinite scrolling
  const items = [...taglines, ...taglines, ...taglines, ...taglines];

  return (
    <div className={cn("w-full overflow-hidden bg-foreground text-background py-3 border-y border-border", className)}>
      <div className="relative flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee inline-block whitespace-nowrap">
          {items.map((text, i) => (
            <React.Fragment key={i}>
              <span className="mx-4 font-heading text-sm tracking-widest">{text}</span>
              <span className="mx-4 text-accent text-xs align-middle">♦</span>
            </React.Fragment>
          ))}
        </div>
        <div className="animate-marquee inline-block whitespace-nowrap absolute top-0">
          {items.map((text, i) => (
            <React.Fragment key={`dup-${i}`}>
              <span className="mx-4 font-heading text-sm tracking-widest">{text}</span>
              <span className="mx-4 text-accent text-xs align-middle">♦</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
