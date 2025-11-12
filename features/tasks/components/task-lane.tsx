"use client"

import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { statusIcons } from "./config"
import type { TaskStatus } from "@/lib/types"
import { useSortable } from "@dnd-kit/sortable"

export function DroppableLane({
  status,
  count,
  headerClasses,
  laneClasses,
  accentClasses,
  compact = false,
  children,
}: {
  status: TaskStatus
  count: number
  headerClasses: string
  laneClasses: string
  accentClasses: string
  compact?: boolean
  children: ReactNode
}) {
  const { setNodeRef, isOver } = useSortable({ id: `column-${status}` })
  const Icon = statusIcons[status]

  return (
    <div
      ref={setNodeRef}
      className={
        `rounded-lg border-2 overflow-hidden transition-all duration-200 ${laneClasses} ${accentClasses} ` +
        (isOver ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg" : "shadow-sm")
      }
    >
      <div className={`${compact ? "px-2.5 py-1.5" : "px-3 py-2"} border-b-2 border-inherit flex items-center justify-between gap-2 ${headerClasses} font-semibold`}>
        <div className="flex items-center gap-2">
          <Icon className={compact ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4 shrink-0"} />
          <h3 className={`font-semibold ${compact ? "text-[10px]" : "text-xs"} uppercase tracking-wide`}>
            {status.replace("-", " ")}
          </h3>
        </div>
        <Badge variant="secondary" className={`${compact ? "text-[10px] px-1 py-0 h-4" : "text-xs px-1.5 py-0 h-5"} font-semibold`}>
          {count}
        </Badge>
      </div>

      <div className={`${compact ? "p-1.5 space-y-1.5" : "p-2 space-y-2"} min-h-[400px]`}>{children}</div>
    </div>
  )
}
