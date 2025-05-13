// src/components/ui/skeleton.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "rect" | "circle";

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Forma del placeholder */
  variant?: Variant;
  /** Ancho y alto por defecto si no se aplica con clase */
  width?: string;
  height?: string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "rect",
      width = "100%",
      height = "1rem",
      ...props
    },
    ref
  ) => {
    const shapeClasses =
      variant === "circle" ? "rounded-full" : "rounded-md";

    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        data-slot="skeleton"
        style={{ width, height }}
        className={cn(
          "relative overflow-hidden bg-muted",
          shapeClasses,
          className
        )}
        {...props}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>
    );
  }
);

Skeleton.displayName = "Skeleton";
