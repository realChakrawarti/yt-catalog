import { ReactNode } from "react";

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
    <div id={id} className={`bg-accent/70 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}
