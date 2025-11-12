"use client"

import { DndContext, DragOverlay } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import type { Task, TaskStatus } from "@/lib/types"
import { statusConfig } from "@/lib/types"
import { DroppableLane } from "./task-lane"
import { DraggableTaskCard } from "./task-card"
import { useTaskDnd } from "./hooks/use-task-dnd"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function TaskBoard({
  tasksByStatus,
  onStatusChange,
  onDelete,
  compact = false,
}: {
  tasksByStatus: Record<TaskStatus, Task[]>
  onStatusChange: (id: string, status: TaskStatus) => void
  onDelete: (id: string) => void
  compact?: boolean
}) {
  const { sensors, activeTask, handleDragStart, handleDragOver, handleDragEnd, collisionDetection } = useTaskDnd(
    tasksByStatus,
    onStatusChange,
  )

  return (
    <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-0 border-0 my-0">
        {(Object.keys(tasksByStatus) as TaskStatus[]).map((status) => {
          const laneCfg = statusConfig[status]
          const items = tasksByStatus[status]
          return (
            <SortableContext key={status} items={items.map((t) => t.id)} strategy={verticalListSortingStrategy}>
              <DroppableLane
                status={status}
                count={items.length}
                headerClasses={laneCfg.headerColor}
                laneClasses={laneCfg.laneBackground + " " + laneCfg.laneColor}
                accentClasses={laneCfg.accentColor}
                compact={compact}
              >
                {items.map((task) => (
                  <DraggableTaskCard key={task.id} task={task} compact={compact} onStatusChange={onStatusChange} onDelete={onDelete} />
                ))}
                {items.length === 0 && (
                  <Card>
                    <CardContent className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <CardDescription className="text-sm text-muted-foreground">Drop tasks here</CardDescription>
                    </CardContent>
                  </Card>
                )}
              </DroppableLane>
            </SortableContext>
          )
        })}
      </div>
      <DragOverlay>
        {activeTask ? (
          <Card className="shadow-lg">
            <CardHeader className="pb-1.5 pt-2 px-3">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <CardTitle className="text-base font-semibold line-clamp-1 leading-tight">{activeTask.title}</CardTitle>
                <CardDescription className="text-sm mt-1 line-clamp-2 leading-snug">{activeTask.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
