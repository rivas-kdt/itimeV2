"use client";

import * as React from "react";
import * as Progress from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function ProgressBar({
  className,
  value,
  ...props
}: React.ComponentProps<typeof Progress.Root>) {
  return (
    <Progress.Root
      data-slot="progress"
      className={cn(
        "bg-muted h-1 rounded-full relative flex w-full items-center overflow-x-hidden",
        className,
      )}
      {...props}
    >
      <Progress.Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full flex-1 transition-all"
        style={{ width: `${value || 0}%` }}
      />
    </Progress.Root>
  );
}

export { ProgressBar as Progress };
