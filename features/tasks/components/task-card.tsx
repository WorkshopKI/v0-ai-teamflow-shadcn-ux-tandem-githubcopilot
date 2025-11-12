"use client"

import { GripVertical, MoreVertical } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Task } from "@/lib/types"
import { priorityConfig } from "@/lib/types"
import { formatDateISO } from "@/lib/utils"
import { statusIcons } from "./config"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

export function DraggableTaskCard({
  task,
  onStatusChange,
  onDelete,
  compact = false,
}: {
  task: Task
  onStatusChange: (id: string, status: Task["status"]) => void
  onDelete: (id: string) => void
  compact?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  const StatusIcon = statusIcons[task.status]

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
        <CardHeader className={compact ? "pb-1 pt-1.5 px-2.5" : "pb-1.5 pt-2 px-3"}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <GripVertical className={compact ? "h-3 w-3" : "h-3.5 w-3.5" + " text-muted-foreground mt-0.5"} />
              <div className="flex-1 min-w-0">
                <CardTitle className={compact ? "text-sm font-semibold line-clamp-1" : "text-base font-semibold line-clamp-1"}>
                  {task.title}
                </CardTitle>
                <CardDescription className={compact ? "text-xs mt-0.5 line-clamp-2" : "text-sm mt-1 line-clamp-2"}>
                  {task.description}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className={compact ? "h-5 w-5" : "h-6 w-6"} onPointerDown={(e) => e.stopPropagation()}>
                  <MoreVertical className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "todo")}>Mark as To Do</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "in-progress")}>Mark as In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>Mark as Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onStatusChange(task.id, "blocked")}>Mark as Blocked</DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">Delete Task</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className={compact ? "space-y-1 px-2.5 pb-1.5" : "space-y-2 px-3 pb-2"}>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={priorityConfig[task.priority].variant} className={compact ? "text-[10px] px-1 py-0 h-4" : "text-xs px-1.5 py-0 h-5"}>
              {priorityConfig[task.priority].label}
            </Badge>
            <div className={compact ? "flex items-center gap-0.5 text-[10px]" : "flex items-center gap-1 text-xs"}>
              <StatusIcon className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
              <span className="leading-none capitalize">{task.status.replace("-", " ")}</span>
            </div>
            {task.tags?.length > 0 && task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className={compact ? "text-[10px] px-1 py-0 h-4" : "text-xs px-1.5 py-0 h-5"}>
                {tag}
              </Badge>
            ))}
          </div>
          <div className={compact ? "flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t" : "flex items-center justify-between text-xs text-muted-foreground pt-1.5 border-t"}>
            {task.assignee && <span className="truncate">{task.assignee}</span>}
            {task.dueDate && <span>Due {formatDateISO(task.dueDate)}</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function ListViewTaskCard({
  task,
  onStatusChange,
  onDelete,
}: {
  task: Task
  onStatusChange: (id: string, status: Task["status"]) => void
  onDelete: (id: string) => void
}) {
  const StatusIcon = statusIcons[task.status]
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-1 pt-1.5 px-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold line-clamp-1 leading-tight">{task.title}</CardTitle>
              <CardDescription className="text-sm mt-0.5 line-clamp-2 leading-snug">{task.description}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "todo")}>Mark as To Do</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "in-progress")}>Mark as In Progress</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "completed")}>Mark as Completed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(task.id, "blocked")}>Mark as Blocked</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive">Delete Task</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 px-3 pb-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={priorityConfig[task.priority].variant} className="text-xs px-1.5 py-0 h-5">
            {priorityConfig[task.priority].label}
          </Badge>
          <div className="flex items-center gap-1 text-xs">
            <StatusIcon className="h-3 w-3" />
            <span className="leading-none capitalize">{task.status.replace("-", " ")}</span>
          </div>
          {task.tags?.length > 0 && task.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">{tag}</Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
          {task.assignee && <span className="truncate">{task.assignee}</span>}
          {task.dueDate && <span className="text-xs">Due {formatDateISO(task.dueDate)}</span>}
        </div>
      </CardContent>
    </Card>
  )
}
