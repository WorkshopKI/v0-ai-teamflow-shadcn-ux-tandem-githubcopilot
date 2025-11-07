/**
 * Task type definitions
 */

export type TaskStatus = "todo" | "in-progress" | "completed" | "blocked"
export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: string
  tags: string[]
  createdAt: string
  deletedAt?: string
}

export const statusConfig = {
  todo: {
    label: "To Do",
    color: "text-muted-foreground",
    laneColor: "border-[var(--lane-todo-border)]",
    laneBackground: "bg-[var(--lane-todo-bg)]",
    headerColor: "bg-[var(--lane-todo-header)] text-[var(--lane-todo-text)]",
    accentColor: "border-l-[3px] border-l-[var(--lane-todo-accent)]",
  },
  "in-progress": {
    label: "In Progress",
    color: "text-primary",
    laneColor: "border-[var(--lane-progress-border)]",
    laneBackground: "bg-[var(--lane-progress-bg)]",
    headerColor: "bg-[var(--lane-progress-header)] text-[var(--lane-progress-text)]",
    accentColor: "border-l-[3px] border-l-[var(--lane-progress-accent)]",
  },
  completed: {
    label: "Completed",
    color: "text-chart-2",
    laneColor: "border-[var(--lane-completed-border)]",
    laneBackground: "bg-[var(--lane-completed-bg)]",
    headerColor: "bg-[var(--lane-completed-header)] text-[var(--lane-completed-text)]",
    accentColor: "border-l-[3px] border-l-[var(--lane-completed-accent)]",
  },
  blocked: {
    label: "Blocked",
    color: "text-destructive",
    laneColor: "border-[var(--lane-blocked-border)]",
    laneBackground: "bg-[var(--lane-blocked-bg)]",
    headerColor: "bg-[var(--lane-blocked-header)] text-[var(--lane-blocked-text)]",
    accentColor: "border-l-[3px] border-l-[var(--lane-blocked-accent)]",
  },
} as const

export const priorityConfig = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "default" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
} as const
