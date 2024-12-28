import { cn } from "~/utils/shadcn-helper"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/25", className)}
      {...props}
    />
  )
}

export { Skeleton }
