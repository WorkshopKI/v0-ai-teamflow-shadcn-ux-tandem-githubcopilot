"use client"

import type React from "react"

import { useState } from "react"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  GripVertical,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragOverEvent,
} from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LaneColorCustomizer } from "@/components/lane-color-customizer"

type TaskStatus = "todo" | "in-progress" | "completed" | "blocked"
type TaskPriority = "low" | "medium" | "high" | "urgent"

interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee?: string
  dueDate?: string
  tags: string[]
  createdAt: string
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create wireframes and mockups for the new product landing page",
    status: "in-progress",
    priority: "high",
    assignee: "Sarah Chen",
    dueDate: "2025-02-15",
    tags: ["design", "frontend"],
    createdAt: "2025-02-01",
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Set up OAuth and JWT-based authentication system",
    status: "todo",
    priority: "urgent",
    assignee: "Mike Johnson",
    dueDate: "2025-02-10",
    tags: ["backend", "security"],
    createdAt: "2025-02-02",
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST API endpoints with examples",
    status: "completed",
    priority: "medium",
    assignee: "Alex Kim",
    dueDate: "2025-02-05",
    tags: ["documentation"],
    createdAt: "2025-01-28",
  },
  {
    id: "4",
    title: "Fix mobile responsive issues",
    description: "Address layout problems on mobile devices",
    status: "blocked",
    priority: "high",
    assignee: "Sarah Chen",
    tags: ["frontend", "bug"],
    createdAt: "2025-02-03",
  },
]

const statusConfig = {
  todo: {
    label: "To Do",
    icon: Circle,
    color: "text-muted-foreground",
    laneColor: "border-[var(--lane-todo-border)]",
    laneBackground: "bg-[var(--lane-todo-bg)]",
    headerColor: "bg-[var(--lane-todo-header)] text-[var(--lane-todo-text)]",
    accentColor: "border-l-[3px] border-l-[var(--lane-todo-accent)]",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    color: "text-primary",
    laneColor: "border-[var(--lane-progress-border)]",
    laneBackground: "bg-[var(--lane-progress-bg)]",
    headerColor: "bg-[var(--lane-progress-header)] text-[var(--lane-progress-text)]",
    accentColor: "border-l-[3px] border-l-[var(--lane-progress-accent)]",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    color: "text-chart-2",
    laneColor: "border-[var(--lane-completed-border)]",
    laneBackground: "bg-[var(--lane-completed-bg)]",
    headerColor: "bg-[var(--lane-completed-header)] text-[var(--lane-completed-text)]",
    accentColor: "border-l-[3px] border-l-[var(--lane-completed-accent)]",
  },
  blocked: {
    label: "Blocked",
    icon: AlertCircle,
    color: "text-destructive",
    laneColor: "border-[var(--lane-blocked-border)]",
    laneBackground: "bg-[var(--lane-blocked-bg)]",
    headerColor: "bg-[var(--lane-blocked-header)] text-[var(--lane-blocked-text)]",
    accentColor: "border-l-[3px] border-l-[var(--lane-blocked-accent)]",
  },
}

const priorityConfig = {
  low: { label: "Low", variant: "secondary" as const },
  medium: { label: "Medium", variant: "default" as const },
  high: { label: "High", variant: "default" as const },
  urgent: { label: "Urgent", variant: "destructive" as const },
}

export function TaskManagementView() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    assignee: "",
    dueDate: "",
    tags: "",
  })

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || task.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const tasksByStatus = {
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
    blocked: filteredTasks.filter((t) => t.status === "blocked"),
  }

  const handleCreateTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: newTask.status,
      priority: newTask.priority,
      assignee: newTask.assignee || undefined,
      dueDate: newTask.dueDate || undefined,
      tags: newTask.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    }
    setTasks([...tasks, task])
    setIsCreateDialogOpen(false)
    setNewTask({
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: "",
      dueDate: "",
      tags: "",
    })
  }

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Check if we're dragging over a different column
    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    // If dragging over a status column (not another task)
    if (overId.startsWith("column-")) {
      const newStatus = overId.replace("column-", "") as TaskStatus
      if (activeTask.status !== newStatus) {
        setTasks((tasks) => tasks.map((task) => (task.id === activeId ? { ...task, status: newStatus } : task)))
      }
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

    // If dropped on a column
    if (overId.startsWith("column-")) {
      const newStatus = overId.replace("column-", "") as TaskStatus
      if (activeTask.status !== newStatus) {
        setTasks((tasks) => tasks.map((task) => (task.id === activeId ? { ...task, status: newStatus } : task)))
      }
    }
    // If dropped on another task
    else {
      const overTask = tasks.find((t) => t.id === overId)
      if (overTask && activeTask.status !== overTask.status) {
        setTasks((tasks) => tasks.map((task) => (task.id === activeId ? { ...task, status: overTask.status } : task)))
      }
    }
  }

  const DraggableTaskCard = ({ task }: { task: Task }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: task.id,
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }

    const StatusIcon = statusConfig[task.status].icon

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="mt-1">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold line-clamp-1">{task.title}</CardTitle>
                  <CardDescription className="text-sm mt-1 line-clamp-2">{task.description}</CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "todo")}>Mark as To Do</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "in-progress")}>
                    Mark as In Progress
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "completed")}>
                    Mark as Completed
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusChange(task.id, "blocked")}>
                    Mark as Blocked
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-destructive">
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={priorityConfig[task.priority].variant}>{priorityConfig[task.priority].label}</Badge>
              <div className={`flex items-center gap-1 text-sm ${statusConfig[task.status].color}`}>
                <StatusIcon className="h-4 w-4" />
                <span>{statusConfig[task.status].label}</span>
              </div>
            </div>

            {task.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
              {task.assignee && <span className="truncate">{task.assignee}</span>}
              {task.dueDate && <span className="text-xs">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const TaskCard = ({ task }: { task: Task }) => {
    const StatusIcon = statusConfig[task.status].icon

    return (
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <GripVertical className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold line-clamp-1">{task.title}</CardTitle>
                <CardDescription className="text-sm mt-1 line-clamp-2">{task.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={priorityConfig[task.priority].variant}>{priorityConfig[task.priority].label}</Badge>
            <div className={`flex items-center gap-1 text-sm ${statusConfig[task.status].color}`}>
              <StatusIcon className="h-4 w-4" />
              <span>{statusConfig[task.status].label}</span>
            </div>
          </div>

          {task.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
            {task.assignee && <span className="truncate">{task.assignee}</span>}
            {task.dueDate && <span className="text-xs">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const DroppableColumn = ({ status, children }: { status: TaskStatus; children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useSortable({
      id: `column-${status}`,
    })

    const StatusIcon = statusConfig[status].icon
    const config = statusConfig[status]

    return (
      <div
        ref={setNodeRef}
        className={`
          rounded-lg border-2 overflow-hidden
          transition-all duration-200
          ${config.laneBackground}
          ${config.laneColor}
          ${config.accentColor}
          ${isOver ? "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-lg" : "shadow-sm"}
        `}
      >
        <div
          className={`
          px-4 py-3 border-b-2 border-inherit
          flex items-center justify-between gap-2
          ${config.headerColor}
          font-semibold
        `}
        >
          <div className="flex items-center gap-2">
            <StatusIcon className="h-5 w-5 shrink-0" />
            <h3 className="font-semibold text-sm uppercase tracking-wide">{config.label}</h3>
          </div>
          <Badge variant="secondary" className="text-xs font-semibold">
            {tasksByStatus[status].length}
          </Badge>
        </div>

        <div className="p-3 space-y-3 min-h-[400px]">{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-balance">Task Management</h1>
          <p className="text-muted-foreground text-lg">Organize and track your team's work efficiently</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as TaskStatus | "all")}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
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

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogDescription>Add a new task to your workflow. Fill in the details below.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the task"
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newTask.status}
                      onValueChange={(value) => setNewTask({ ...newTask, status: value as TaskStatus })}
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todo">To Do</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newTask.priority}
                      onValueChange={(value) => setNewTask({ ...newTask, priority: value as TaskPriority })}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Input
                    id="assignee"
                    placeholder="Assign to team member"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="frontend, backend, design (comma separated)"
                    value={newTask.tags}
                    onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTask} disabled={!newTask.title}>
                  Create Task
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>To Do</CardDescription>
              <CardTitle className="text-3xl">{tasksByStatus["todo"].length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl">{tasksByStatus["in-progress"].length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">{tasksByStatus["completed"].length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Blocked</CardDescription>
              <CardTitle className="text-3xl">{tasksByStatus["blocked"].length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* View Controls and Color Customization */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Tabs defaultValue="board" className="w-full">
            <div className="flex items-center justify-between gap-4">
              <TabsList>
                <TabsTrigger value="board">Board View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <LaneColorCustomizer iconOnly />
            </div>

            <TabsContent value="board" className="space-y-4 mt-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                    <SortableContext
                      key={status}
                      items={statusTasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <DroppableColumn status={status as TaskStatus}>
                        {statusTasks.map((task) => (
                          <DraggableTaskCard key={task.id} task={task} />
                        ))}
                        {statusTasks.length === 0 && (
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                            <p className="text-sm text-muted-foreground">Drop tasks here</p>
                          </div>
                        )}
                      </DroppableColumn>
                    </SortableContext>
                  ))}
                </div>
                <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
              </DndContext>
            </TabsContent>

            <TabsContent value="list" className="space-y-3 mt-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No tasks found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
