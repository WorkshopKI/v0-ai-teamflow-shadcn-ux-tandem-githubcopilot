import { CheckCircle2, Circle, Clock, AlertCircle, type LucideIcon } from "lucide-react"
import type { TaskPriority, TaskStatus } from "@/lib/types"

export const statusIcons: Record<TaskStatus, LucideIcon> = {
  todo: Circle,
  "in-progress": Clock,
  completed: CheckCircle2,
  blocked: AlertCircle,
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  completed: "Completed",
  blocked: "Blocked",
}

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
}
