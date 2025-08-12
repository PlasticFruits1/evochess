import { cn } from "@/lib/utils"

export const Loader = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn("h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent", className)}
    />
  )
}
