import React from "react";
import { cn } from "@/lib/utils";

interface BracketLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function BracketLabel({ children, className, ...props }: BracketLabelProps) {
  return (
    <span 
      className={cn(
        "font-heading text-xs tracking-[0.2em] uppercase font-bold text-foreground inline-block",
        className
      )}
      {...props}
    >
      [ {children} ]
    </span>
  );
}
