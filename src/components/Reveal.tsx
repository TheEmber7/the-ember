import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/hooks/use-reveal";

interface RevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "article" | "header";
}

export function Reveal({ children, delay = 0, className, as: Tag = "div", ...rest }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref as never}
      style={{ animationDelay: visible ? `${delay}ms` : undefined }}
      className={cn(
        "transition-opacity",
        visible ? "animate-zoom-fade-in opacity-100" : "opacity-0",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
