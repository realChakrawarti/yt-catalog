import { cn } from "~/utils/shadcn-helper"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-50 opacity-25", className)}
      {...props}
    />
  )
}

export { Skeleton }
