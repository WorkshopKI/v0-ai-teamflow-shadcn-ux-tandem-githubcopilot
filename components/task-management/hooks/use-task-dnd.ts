"use client"

import { useState } from "react"
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from "@dnd-kit/core"
import type { Task, TaskStatus } from "@/lib/types"

export function useTaskDnd(tasksByStatus: Record<TaskStatus, Task[]>, onStatusChange: (id: string, status: TaskStatus) => void) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const allTasks = () => Object.values(tasksByStatus).flat()

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const t = allTasks().find((x) => x.id === String(active.id)) || null
    setActiveTask(t)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeId = String(active.id)
    const overId = String(over.id)
    const t = allTasks().find((x) => x.id === activeId)
    if (!t) return
    if (overId.startsWith("column-")) {
      const newStatus = overId.replace("column-", "") as TaskStatus
      if (t.status !== newStatus) onStatusChange(activeId, newStatus)
    } else {
      const overTask = allTasks().find((x) => x.id === overId)
      if (overTask && t.status !== overTask.status) onStatusChange(activeId, overTask.status)
    }
  }

  const handleDragEnd = (_event: DragEndEvent) => {
    setActiveTask(null)
  }

  return { sensors, activeTask, handleDragStart, handleDragOver, handleDragEnd, collisionDetection: closestCorners }
}
