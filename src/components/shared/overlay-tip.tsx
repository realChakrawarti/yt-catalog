import { ReactNode } from "react";

import { cn } from "~/utils/shadcn-helper";

interface OverlayTipProps {
  children: ReactNode;
  className?: string;
  id: string;
}

export default function OverlayTip({
  children,
  className,
  id,
}: OverlayTipProps) {
  return (
    <div id={id} className={cn("bg-accent/70 backdrop-blur-sm", className)}>
      {children}
    </div>
  );
}