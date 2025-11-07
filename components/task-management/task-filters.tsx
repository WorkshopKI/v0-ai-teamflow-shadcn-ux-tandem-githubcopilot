"use client"

import { Search, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import type { TaskPriority, TaskStatus } from "@/lib/types"
import { LaneColorCustomizer } from "@/components/lane-color-customizer"

export function TaskFilters({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPriority,
  setFilterPriority,
  filterAssignee,
  setFilterAssignee,
  uniqueAssignees,
  onOpenTrash,
  trashCount,
  newTaskButton,
}: {
  searchQuery: string
  setSearchQuery: (v: string) => void
  filterStatus: TaskStatus | "all"
  setFilterStatus: (v: TaskStatus | "all") => void
  filterPriority: TaskPriority | "all"
  setFilterPriority: (v: TaskPriority | "all") => void
  filterAssignee: string
  setFilterAssignee: (v: string) => void
  uniqueAssignees: string[]
  onOpenTrash: () => void
  trashCount: number
  newTaskButton?: React.ReactNode
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-full" />
        </div>
        {newTaskButton}
      </div>
      {/* Toggle statistics button slot */}
      {/* This will be injected from parent via newTaskButton or a new prop if needed */}
      <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as TaskStatus | "all")}> 
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="todo">To Do</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="blocked">Blocked</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="w-full sm:w-auto bg-transparent" onClick={onOpenTrash}>
        <Trash2 className="h-4 w-4 mr-2" />
        Trash ({trashCount})
      </Button>
      <LaneColorCustomizer iconOnly />
    </div>
  )
}
