import * as React from "react"
import { cn } from "@/lib/utils"

export function StatsGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>{children}</div>
}
