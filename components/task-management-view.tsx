"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  Columns2,
  Columns3,
  Minimize2,
  Maximize2,
  LayoutList,
  Trash2,
  RotateCcw,
  X,
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
import { ScrollArea } from "@/components/ui/scroll-area"

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
  deletedAt?: string
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
  {
    id: "5",
    title: 'Prüfe Statikgutachten „Bürogebäude Ost"',
    description:
      "Überprüfe eingereichte Statikberechnungen und Tragwerksplanung auf Vollständigkeit und Plausibilität gemäß DIN 1055.",
    status: "todo",
    priority: "high",
    assignee: "Clara Hoffmann",
    dueDate: "2025-11-12",
    tags: ["structural", "review", "compliance"],
    createdAt: "2025-11-04",
  },
  {
    id: "6",
    title: 'Koordiniere Baustellenbesichtigung „Wohnanlage Nord"',
    description:
      "Termine mit Bauherr, Architekt und Brandschutzbeauftragtem für Vor-Ort-Termin abstimmen und Protokoll vorbereiten.",
    status: "in-progress",
    priority: "medium",
    assignee: "Thomas Becker",
    dueDate: "2025-11-08",
    tags: ["inspection", "coordination", "meeting"],
    createdAt: "2025-11-03",
  },
  {
    id: "7",
    title: "Aktualisiere Denkmalschutzauflagen Projekt #2025-125",
    description:
      "Neue Auflagen vom Denkmalschutzamt in Genehmigungsunterlagen einarbeiten und an Antragsteller kommunizieren.",
    status: "todo",
    priority: "medium",
    assignee: "Clara Hoffmann",
    dueDate: "2025-11-10",
    tags: ["monument-protection", "documentation", "communication"],
    createdAt: "2025-11-04",
  },
  {
    id: "8",
    title: 'Erstelle Lärmschutzgutachten „Industriepark Süd"',
    description:
      "Automatische Lärmschutzanalyse über EnviroCheck durchführen, Grenzwerte prüfen und Gutachten erstellen.",
    status: "in-progress",
    priority: "high",
    assignee: "EnviroCheck",
    dueDate: "2025-11-11",
    tags: ["environment", "noise", "ai", "report"],
    createdAt: "2025-11-02",
  },
  {
    id: "9",
    title: "Überprüfe Abstandsflächenberechnung Antrag #2025-130",
    description:
      "Prüfe eingereichte Abstandsflächenberechnung auf Einhaltung der Landesbauordnung §6 und markiere Abweichungen.",
    status: "todo",
    priority: "high",
    assignee: "Thomas Becker",
    dueDate: "2025-11-09",
    tags: ["calculation", "compliance", "review"],
    createdAt: "2025-11-04",
  },
  {
    id: "10",
    title: 'Genehmige Nutzungsänderung „Lagerhaus Mitte"',
    description: "Finale Prüfung aller Unterlagen für Nutzungsänderung von Lager zu Bürofläche, Genehmigung erteilen.",
    status: "completed",
    priority: "medium",
    assignee: "BauFlowAI",
    dueDate: "2025-11-05",
    tags: ["approval", "change-of-use", "automation"],
    createdAt: "2025-10-28",
  },
  {
    id: "11",
    title: 'Prüfe Stellplatznachweis „Einkaufszentrum West"',
    description:
      "Überprüfe Stellplatzberechnung gemäß Stellplatzsatzung, prüfe Anzahl und Dimensionierung der Parkplätze.",
    status: "todo",
    priority: "medium",
    assignee: "Clara Hoffmann",
    dueDate: "2025-11-13",
    tags: ["parking", "calculation", "compliance"],
    createdAt: "2025-11-04",
  },
  {
    id: "12",
    title: "Koordiniere Abstimmung mit Umweltamt",
    description:
      'Rücksprache mit Umweltamt bezüglich Bodengutachten und Altlastenverdacht für Projekt „Gewerbegebiet Ost".',
    status: "blocked",
    priority: "high",
    assignee: "Thomas Becker",
    dueDate: "2025-11-07",
    tags: ["environment", "coordination", "soil-analysis"],
    createdAt: "2025-11-01",
  },
  {
    id: "13",
    title: 'Erstelle Baugenehmigung „Mehrfamilienhaus Ost"',
    description: "Alle Prüfungen abgeschlossen, finale Baugenehmigung mit Auflagen erstellen und an Bauherr versenden.",
    status: "in-progress",
    priority: "high",
    assignee: "BauFlowAI",
    dueDate: "2025-11-08",
    tags: ["permit", "approval", "automation"],
    createdAt: "2025-11-02",
  },
  {
    id: "14",
    title: 'Überprüfe Energieausweis „Sanierung Altbau"',
    description:
      "Prüfe eingereichten Energieausweis auf Vollständigkeit und Einhaltung EnEV-Anforderungen für Bestandssanierung.",
    status: "todo",
    priority: "medium",
    assignee: "Clara Hoffmann",
    dueDate: "2025-11-14",
    tags: ["energy", "certificate", "renovation"],
    createdAt: "2025-11-04",
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
  const [trashedTasks, setTrashedTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all")
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isTrashDialogOpen, setIsTrashDialogOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [listColumns, setListColumns] = useState<1 | 2 | 3>(1)
  const [activeView, setActiveView] = useState<"board" | "list">("board")
  const [boardCompactMode, setBoardCompactMode] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "todo" as TaskStatus,
    priority: "medium" as TaskPriority,
    assignee: "",
    dueDate: "",
    tags: "",
  })

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedTrash = localStorage.getItem("trashedTasks")

    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks)
        if (Array.isArray(parsedTasks)) {
          // Merge mockTasks with saved tasks to ensure new mockTasks always appear
          const mockTaskIds = new Set(mockTasks.map((t) => t.id))
          const additionalTasks = parsedTasks.filter((t) => !mockTaskIds.has(t.id))
          const mergedTasks = [...mockTasks, ...additionalTasks]
          setTasks(mergedTasks)
          console.log("[v0] Loaded tasks from localStorage and merged with mockTasks:", mergedTasks.length, "tasks")
        }
      } catch (error) {
        console.error("[v0] Failed to load tasks from localStorage:", error)
      }
    } else {
      console.log("[v0] No saved tasks found, using mockTasks:", mockTasks.length, "tasks")
    }

    if (savedTrash) {
      try {
        const parsedTrash = JSON.parse(savedTrash)
        if (Array.isArray(parsedTrash)) {
          setTrashedTasks(parsedTrash)
        }
      } catch (error) {
        console.error("[v0] Failed to load trash from localStorage:", error)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
    console.log("[v0] Saved tasks to localStorage:", tasks.length, "tasks")
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("trashedTasks", JSON.stringify(trashedTasks))
  }, [trashedTasks])

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
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority
    const matchesAssignee = filterAssignee === "all" || task.assignee === filterAssignee
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  const uniqueAssignees = Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean))) as string[]

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
      ...(newTask.assignee && { assignee: newTask.assignee }),
      ...(newTask.dueDate && { dueDate: newTask.dueDate }),
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
    const taskToDelete = tasks.find((task) => task.id === taskId)
    if (taskToDelete) {
      const trashedTask = { ...taskToDelete, deletedAt: new Date().toISOString() }
      setTrashedTasks([...trashedTasks, trashedTask])
      setTasks(tasks.filter((task) => task.id !== taskId))
    }
  }

  const handleRestoreTask = (taskId: string) => {
    const taskToRestore = trashedTasks.find((task) => task.id === taskId)
    if (taskToRestore) {
      const { deletedAt, ...restoredTask } = taskToRestore
      setTasks([...tasks, restoredTask as Task])
      setTrashedTasks(trashedTasks.filter((task) => task.id !== taskId))
    }
  }

  const handlePermanentDelete = (taskId: string) => {
    setTrashedTasks(trashedTasks.filter((task) => task.id !== taskId))
  }

  const handleEmptyTrash = () => {
    if (
      window.confirm("Are you sure you want to permanently delete all tasks in trash? This action cannot be undone.")
    ) {
      setTrashedTasks([])
    }
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

    const activeTask = tasks.find((t) => t.id === activeId)
    if (!activeTask) return

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

    if (overId.startsWith("column-")) {
      const newStatus = overId.replace("column-", "") as TaskStatus
      if (activeTask.status !== newStatus) {
        setTasks((tasks) => tasks.map((task) => (task.id === activeId ? { ...task, status: newStatus } : task)))
      }
    } else {
      const overTask = tasks.find((t) => t.id === overId)
      if (overTask && activeTask.status !== overTask.status) {
        setTasks((tasks) => tasks.map((task) => (task.id === activeId ? { ...task, status: overTask.status } : task)))
      }
    }
  }

  const DraggableTaskCard = ({ task, compact = false }: { task: Task; compact?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: task.id,
    })

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    }

    const StatusIcon = statusConfig[task.status].icon

    if (compact) {
      return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
          <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
            <CardHeader className="pb-1 pt-1.5 px-2.5">
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-start gap-1.5 flex-1 min-w-0">
                  <div className="mt-0.5">
                    <GripVertical className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-semibold line-clamp-1 leading-tight">{task.title}</CardTitle>
                    <CardDescription className="text-xs mt-0.5 line-clamp-2 leading-snug">
                      {task.description}
                    </CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 shrink-0"
                      onPointerDown={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleStatusChange(task.id, "todo")}>
                      Mark as To Do
                    </DropdownMenuItem>
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
            <CardContent className="space-y-1 px-2.5 pb-1.5">
              <div className="flex items-center gap-1 flex-wrap">
                <Badge
                  variant={priorityConfig[task.priority].variant}
                  className="text-[10px] px-1 py-0 h-4 leading-none"
                >
                  {priorityConfig[task.priority].label}
                </Badge>
                <div className={`flex items-center gap-0.5 text-[10px] ${statusConfig[task.status].color}`}>
                  <StatusIcon className="h-2.5 w-2.5" />
                  <span className="leading-none">{statusConfig[task.status].label}</span>
                </div>
                {task.tags.length > 0 &&
                  task.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[10px] px-1 py-0 h-4 leading-none">
                      {tag}
                    </Badge>
                  ))}
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t">
                {task.assignee && <span className="truncate">{task.assignee}</span>}
                {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Normal mode (existing code)
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
          <CardHeader className="pb-1.5 pt-2 px-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="mt-0.5">
                  <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base font-semibold line-clamp-1 leading-tight">{task.title}</CardTitle>
                  <CardDescription className="text-sm mt-1 line-clamp-2 leading-snug">
                    {task.description}
                  </CardDescription>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
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
          <CardContent className="space-y-2 px-3 pb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant={priorityConfig[task.priority].variant} className="text-xs px-1.5 py-0 h-5">
                {priorityConfig[task.priority].label}
              </Badge>
              <div className={`flex items-center gap-1 text-xs ${statusConfig[task.status].color}`}>
                <StatusIcon className="h-3 w-3" />
                <span className="leading-none">{statusConfig[task.status].label}</span>
              </div>
            </div>

            {task.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1.5 border-t">
              {task.assignee && <span className="truncate">{task.assignee}</span>}
              {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
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
        <CardHeader className="pb-1.5 pt-2 px-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold line-clamp-1 leading-tight">{task.title}</CardTitle>
                <CardDescription className="text-sm mt-1 line-clamp-2 leading-snug">{task.description}</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 px-3 pb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={priorityConfig[task.priority].variant} className="text-xs px-1.5 py-0 h-5">
              {priorityConfig[task.priority].label}
            </Badge>
            <div className={`flex items-center gap-1 text-xs ${statusConfig[task.status].color}`}>
              <StatusIcon className="h-3 w-3" />
              <span className="leading-none">{statusConfig[task.status].label}</span>
            </div>
          </div>

          {task.tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1.5 border-t">
            {task.assignee && <span className="truncate">{task.assignee}</span>}
            {task.dueDate && <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const ListViewTaskCard = ({ task }: { task: Task }) => {
    const StatusIcon = statusConfig[task.status].icon

    return (
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="pb-1 pt-1.5 px-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base font-semibold line-clamp-1 leading-tight">{task.title}</CardTitle>
                <CardDescription className="text-sm mt-0.5 line-clamp-2 leading-snug">
                  {task.description}
                </CardDescription>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                  <MoreVertical className="h-3.5 w-3.5" />
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
        <CardContent className="space-y-1.5 px-3 pb-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={priorityConfig[task.priority].variant} className="text-xs px-1.5 py-0 h-5">
              {priorityConfig[task.priority].label}
            </Badge>
            <div className={`flex items-center gap-1 text-xs ${statusConfig[task.status].color}`}>
              <StatusIcon className="h-3 w-3" />
              <span className="leading-none">{statusConfig[task.status].label}</span>
            </div>
            {task.tags.length > 0 &&
              task.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                  {tag}
                </Badge>
              ))}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
            {task.assignee && <span className="truncate">{task.assignee}</span>}
            {task.dueDate && <span className="text-xs">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
          </div>
        </CardContent>
      </Card>
    )
  }

  const DroppableColumn = ({
    status,
    children,
    compact = false,
  }: {
    status: TaskStatus
    children: React.ReactNode
    compact?: boolean
  }) => {
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
          ${compact ? "px-2.5 py-1.5" : "px-3 py-2"} border-b-2 border-inherit
          flex items-center justify-between gap-2
          ${config.headerColor}
          font-semibold
        `}
        >
          <div className="flex items-center gap-2">
            <StatusIcon className={compact ? "h-3.5 w-3.5 shrink-0" : "h-4 w-4 shrink-0"} />
            <h3 className={`font-semibold ${compact ? "text-[10px]" : "text-xs"} uppercase tracking-wide`}>
              {config.label}
            </h3>
          </div>
          <Badge
            variant="secondary"
            className={`${compact ? "text-[10px] px-1 py-0 h-4" : "text-xs px-1.5 py-0 h-5"} font-semibold`}
          >
            {tasksByStatus[status].length}
          </Badge>
        </div>

        <div className={`${compact ? "p-1.5 space-y-1.5" : "p-2 space-y-2"} min-h-[400px]`}>{children}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-balance">Task Management</h1>
          <p className="text-muted-foreground text-lg">Organize and track your team's work efficiently</p>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
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

          <Button
            variant="outline"
            className="w-full sm:w-auto bg-transparent"
            onClick={() => setIsTrashDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Trash ({trashedTasks.length})
          </Button>

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

        {/* Trash Dialog */}
        <Dialog open={isTrashDialogOpen} onOpenChange={setIsTrashDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Trash ({trashedTasks.length})
              </DialogTitle>
              <DialogDescription>
                Deleted tasks are stored here. You can restore them or permanently delete them.
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              {trashedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Trash2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Trash is empty</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Deleted tasks will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {trashedTasks.map((task) => {
                    const StatusIcon = statusConfig[task.status].icon
                    return (
                      <Card key={task.id} className="shadow-sm">
                        <CardHeader className="pb-2 pt-3 px-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-semibold line-clamp-1">{task.title}</CardTitle>
                              <CardDescription className="text-sm mt-1 line-clamp-2">
                                {task.description}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRestoreTask(task.id)}
                                title="Restore task"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to permanently delete this task? This action cannot be undone.",
                                    )
                                  ) {
                                    handlePermanentDelete(task.id)
                                  }
                                }}
                                title="Delete permanently"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2 px-3 pb-3">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge variant={priorityConfig[task.priority].variant} className="text-xs">
                              {priorityConfig[task.priority].label}
                            </Badge>
                            <div className={`flex items-center gap-1 text-xs ${statusConfig[task.status].color}`}>
                              <StatusIcon className="h-3 w-3" />
                              <span>{statusConfig[task.status].label}</span>
                            </div>
                            {task.tags.length > 0 &&
                              task.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                            <span>
                              Deleted {task.deletedAt ? new Date(task.deletedAt).toLocaleDateString() : "Unknown"}
                            </span>
                            {task.assignee && <span className="truncate">{task.assignee}</span>}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              )}
            </ScrollArea>
            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button
                variant="destructive"
                onClick={handleEmptyTrash}
                disabled={trashedTasks.length === 0}
                className="mr-auto"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Empty Trash
              </Button>
              <Button variant="outline" onClick={() => setIsTrashDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-1.5">
              <CardDescription>To Do</CardDescription>
              <CardTitle className="text-3xl">{tasksByStatus["todo"].length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-1.5">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl">{tasksByStatus["in-progress"].length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-1.5">
              <CardDescription>Completed</CardDescription>
              <CardTitle className="text-3xl">{tasksByStatus["completed"].length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-1.5">
              <CardDescription>Blocked</CardDescription>
              <CardTitle className="text-3xl">{tasksByStatus["blocked"].length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* View Controls and Color Customization */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Tabs
            defaultValue="board"
            className="w-full"
            onValueChange={(value) => setActiveView(value as "board" | "list")}
          >
            <div className="flex items-center justify-between flex-wrap gap-px">
              <div className="flex items-center gap-4">
                <TabsList>
                  <TabsTrigger value="board">Board View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                {activeView === "board" && (
                  <div className="hidden md:flex items-center gap-1 border rounded-md p-1">
                    <Button
                      variant={!boardCompactMode ? "secondary" : "ghost"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setBoardCompactMode(false)}
                      title="Normal mode"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={boardCompactMode ? "secondary" : "ghost"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setBoardCompactMode(true)}
                      title="Ultra-compact mode"
                    >
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {activeView === "list" && (
                  <div className="hidden md:flex items-center gap-1 border rounded-md p-1">
                    <Button
                      variant={listColumns === 1 ? "secondary" : "ghost"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setListColumns(1)}
                      title="Single column"
                    >
                      <LayoutList className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={listColumns === 2 ? "secondary" : "ghost"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setListColumns(2)}
                      title="Two columns"
                    >
                      <Columns2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={listColumns === 3 ? "secondary" : "ghost"}
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setListColumns(3)}
                      title="Three columns"
                    >
                      <Columns3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <>
                  <Select
                    value={filterPriority}
                    onValueChange={(value) => setFilterPriority(value as TaskPriority | "all")}
                  >
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue placeholder="Assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Assignees</SelectItem>
                      {uniqueAssignees.map((assignee) => (
                        <SelectItem key={assignee} value={assignee}>
                          {assignee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>

                <LaneColorCustomizer iconOnly />
              </div>
            </div>

            <TabsContent value="board" className="space-y-4 mt-4">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-0 border-0 my-0">
                  {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
                    <SortableContext
                      key={status}
                      items={statusTasks.map((t) => t.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <DroppableColumn status={status as TaskStatus} compact={boardCompactMode}>
                        {statusTasks.map((task) => (
                          <DraggableTaskCard key={task.id} task={task} compact={boardCompactMode} />
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

            <TabsContent value="list" className="mt-4">
              {filteredTasks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No tasks found</p>
                  </CardContent>
                </Card>
              ) : (
                <div
                    className={`grid gap-2 ${listColumns === 1
                      ? "grid-cols-1"
                      : listColumns === 2
                        ? "grid-cols-1 lg:grid-cols-2"
                        : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                      }`}
                >
                  {filteredTasks.map((task) => (
                    <ListViewTaskCard key={task.id} task={task} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
