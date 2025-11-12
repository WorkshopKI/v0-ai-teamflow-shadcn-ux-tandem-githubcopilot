"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, Columns2, Columns3, LayoutList, Maximize2, Minimize2, RotateCcw, Trash2, X, ListTodo, Clock, CheckCircle2, Ban, ChevronUp, ChevronDown } from "lucide-react"
import { TaskBoard } from "./task-board"
import { TaskFilters } from "./task-filters"
import { useTasksState, type NewTaskForm } from "./hooks/use-tasks-state"
import type { Task, TaskStatus, TaskPriority } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ListViewTaskCard } from "./task-card"
import { formatDateISO } from "@/lib/utils"

export function TaskManagementView() {
  const state = useTasksState()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isTrashDialogOpen, setIsTrashDialogOpen] = useState(false)
  const [listColumns, setListColumns] = useState<1 | 2 | 3>(1)
  const [activeView, setActiveView] = useState<"board" | "list">("board")
  const [boardCompactMode, setBoardCompactMode] = useState(false)
  const [showStats, setShowStats] = useState(true)

  const [newTask, setNewTask] = useState<NewTaskForm>({
    title: "",
    description: "",
    status: "todo",
    priority: "medium",
    assignee: "",
    dueDate: "",
    tags: "",
  })

  const stats = {
    todo: state.tasks.filter((t) => t.status === "todo").length,
    inProgress: state.tasks.filter((t) => t.status === "in-progress").length,
    completed: state.tasks.filter((t) => t.status === "completed").length,
    blocked: state.tasks.filter((t) => t.status === "blocked").length,
  }

  const totalTasks = stats.todo + stats.inProgress + stats.completed + stats.blocked
  const percent = (n: number) => (totalTasks > 0 ? Math.round((n / totalTasks) * 100) : 0)
  const completionRate = percent(stats.completed)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-balance">Task Management</h1>
          <p className="text-muted-foreground text-lg">Organize and track your team's work efficiently</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <TaskFilters
            searchQuery={state.searchQuery}
            setSearchQuery={state.setSearchQuery}
            filterStatus={state.filterStatus}
            setFilterStatus={state.setFilterStatus}
            filterPriority={state.filterPriority}
            setFilterPriority={state.setFilterPriority}
            filterAssignee={state.filterAssignee}
            setFilterAssignee={state.setFilterAssignee}
            uniqueAssignees={state.uniqueAssignees}
            onOpenTrash={() => setIsTrashDialogOpen(true)}
            trashCount={state.trashedTasks.length}
            newTaskButton={
              <div className="flex items-center gap-2">
                <DialogTrigger asChild>
                  <Button className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                  </Button>
                </DialogTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowStats(!showStats)}
                  title={showStats ? "Hide statistics" : "Show statistics"}
                  className="h-9 w-9"
                >
                  {showStats ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            }
          />
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>Add a new task to your workflow. Fill in the details below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Enter task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the task" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={newTask.status} onValueChange={(value) => setNewTask({ ...newTask, status: value as TaskStatus })}>
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
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({ ...newTask, priority: value as TaskPriority })}>
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
                <Input id="assignee" placeholder="Assign to team member" value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input id="tags" placeholder="frontend, backend, design (comma separated)" value={newTask.tags} onChange={(e) => setNewTask({ ...newTask, tags: e.target.value })} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => { state.createTask(newTask); setIsCreateDialogOpen(false); setNewTask({ title: "", description: "", status: "todo", priority: "medium", assignee: "", dueDate: "", tags: "" }) }} disabled={!newTask.title}>Create Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {showStats && (
          <>
            {/* Overall Completion Card */}
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Overall Completion</CardTitle>
                <CardDescription>Track your team's progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold">{completionRate}%</div>
                  <div className="text-sm text-muted-foreground">
                    {stats.completed} of {totalTasks} tasks completed
                  </div>
                </div>
                <Progress value={completionRate} className="h-2" />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-12">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">To Do</CardTitle>
                  <ListTodo className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todo}</div>
                  <p className="text-xs text-muted-foreground">{percent(stats.todo)}% of total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                  <p className="text-xs text-muted-foreground">{percent(stats.inProgress)}% of total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Completed</CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.completed}</div>
                  <p className="text-xs text-muted-foreground">{percent(stats.completed)}% of total</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Blocked</CardTitle>
                  <Ban className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.blocked}</div>
                  <p className="text-xs text-muted-foreground">{percent(stats.blocked)}% of total</p>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        <div className="flex items-center justify-between gap-4 mb-4">
          <Tabs defaultValue="board" className="w-full" onValueChange={(value) => setActiveView(value as "board" | "list")}>
            <div className="flex items-center justify-between flex-wrap gap-px">
              <div className="flex items-center gap-4">
                <TabsList>
                  <TabsTrigger value="board">Board View</TabsTrigger>
                  <TabsTrigger value="list">List View</TabsTrigger>
                </TabsList>

                {activeView === "board" && (
                  <div className="hidden md:flex items-center gap-1 border rounded-md p-1">
                    <Button variant={!boardCompactMode ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setBoardCompactMode(false)} title="Normal mode">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant={boardCompactMode ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setBoardCompactMode(true)} title="Ultra-compact mode">
                      <Minimize2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {activeView === "list" && (
                  <div className="hidden md:flex items-center gap-1 border rounded-md p-1">
                    <Button variant={listColumns === 1 ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setListColumns(1)} title="Single column">
                      <LayoutList className="h-4 w-4" />
                    </Button>
                    <Button variant={listColumns === 2 ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setListColumns(2)} title="Two columns">
                      <Columns2 className="h-4 w-4" />
                    </Button>
                    <Button variant={listColumns === 3 ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setListColumns(3)} title="Three columns">
                      <Columns3 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Select value={state.filterPriority} onValueChange={(value) => state.setFilterPriority(value as TaskPriority | "all")}>
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

                <Select value={state.filterAssignee} onValueChange={state.setFilterAssignee}>
                  <SelectTrigger className="w-[140px] h-9">
                    <SelectValue placeholder="Assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    {state.uniqueAssignees.map((assignee) => (
                      <SelectItem key={assignee} value={assignee}>
                        {assignee}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="board" className="space-y-4 mt-4">
              <TaskBoard
                tasksByStatus={state.tasksByStatus as Record<TaskStatus, Task[]>}
                compact={boardCompactMode}
                onStatusChange={state.updateTaskStatus}
                onDelete={state.deleteTask}
              />
            </TabsContent>

            <TabsContent value="list" className="mt-4">
              {Object.values(state.tasksByStatus).flat().length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No tasks found</p>
                  </CardContent>
                </Card>
              ) : (
                <div
                  className={
                    `grid gap-2 ` +
                    (listColumns === 1
                      ? "grid-cols-1"
                      : listColumns === 2
                      ? "grid-cols-1 lg:grid-cols-2"
                      : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3")
                  }
                >
                  {Object.values(state.tasksByStatus)
                    .flat()
                    .map((task) => (
                      <ListViewTaskCard
                        key={task.id}
                        task={task}
                        onStatusChange={state.updateTaskStatus}
                        onDelete={state.deleteTask}
                      />
                    ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Trash Dialog */}
        <Dialog open={isTrashDialogOpen} onOpenChange={setIsTrashDialogOpen}>
          <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5" />
                Trash ({state.trashedTasks.length})
              </DialogTitle>
              <DialogDescription>Deleted tasks are stored here. You can restore them or permanently delete them.</DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] pr-4">
              {state.trashedTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Trash2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">Trash is empty</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Deleted tasks will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {state.trashedTasks.map((task) => (
                    <Card key={task.id} className="shadow-sm">
                      <CardHeader className="pb-2 pt-3 px-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base font-semibold line-clamp-1">{task.title}</CardTitle>
                            <CardDescription className="text-sm mt-1 line-clamp-2">{task.description}</CardDescription>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => state.restoreTask(task.id)} title="Restore task">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => {
                                if (window.confirm("Are you sure you want to permanently delete this task? This action cannot be undone.")) {
                                  state.permanentlyDeleteTask(task.id)
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
                          <Badge variant={state.priorityConfig[task.priority].variant} className="text-xs">
                            {state.priorityConfig[task.priority].label}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                          <span>Deleted {task.deletedAt ? formatDateISO(task.deletedAt) : "Unknown"}</span>
                          {task.assignee && <span className="truncate">{task.assignee}</span>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
            <DialogFooter className="flex items-center justify-between sm:justify-between">
              <Button variant="destructive" onClick={() => state.emptyTrash()} disabled={state.trashedTasks.length === 0} className="mr-auto">
                <Trash2 className="h-4 w-4 mr-2" />
                Empty Trash
              </Button>
              <Button variant="outline" onClick={() => setIsTrashDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
