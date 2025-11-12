"use client"

import { useEffect, useMemo, useState } from "react"
import type { Task, TaskPriority, TaskStatus } from "@/lib/types"
import { priorityConfig, statusConfig } from "@/lib/types"
import { mockTasks } from "@/lib/mock-data"
import { STORAGE_KEYS } from "@/lib/storage/storage-keys"
import { useStorage } from "@/lib/storage/use-storage"

export interface NewTaskForm {
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  dueDate: string
  tags: string
}

export function useTasksState() {
  const [tasks, setTasks, tasksLoaded] = useStorage<Task[]>(STORAGE_KEYS.TASKS, mockTasks)
  const [trashedTasks, setTrashedTasks] = useStorage<Task[]>(STORAGE_KEYS.TRASHED_TASKS, [])

  // Merge in any new mock tasks not present in storage yet
  useEffect(() => {
    if (!tasksLoaded) return
    const existingIds = new Set(tasks.map((t) => t.id))
    const additional = mockTasks.filter((t) => !existingIds.has(t.id))
    if (additional.length > 0) {
      setTasks((prev) => [...prev, ...additional])
    }
  }, [tasksLoaded])

  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "all">("all")
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "all">("all")
  const [filterAssignee, setFilterAssignee] = useState<string>("all")

  const filteredTasks = useMemo(() => {
    const q = searchQuery.toLowerCase()
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(q) || task.description.toLowerCase().includes(q)
      const matchesStatus = filterStatus === "all" || task.status === filterStatus
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority
      const matchesAssignee = filterAssignee === "all" || task.assignee === filterAssignee
      return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
    })
  }, [tasks, searchQuery, filterStatus, filterPriority, filterAssignee])

  const uniqueAssignees = useMemo(() => {
    return Array.from(new Set(tasks.map((t) => t.assignee).filter(Boolean))) as string[]
  }, [tasks])

  const tasksByStatus = useMemo(() => ({
    todo: filteredTasks.filter((t) => t.status === "todo"),
    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),
    completed: filteredTasks.filter((t) => t.status === "completed"),
    blocked: filteredTasks.filter((t) => t.status === "blocked"),
  }), [filteredTasks])

  function createTask(data: NewTaskForm) {
    const task: Task = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      ...(data.assignee && { assignee: data.assignee }),
      ...(data.dueDate && { dueDate: data.dueDate }),
      tags: data.tags.split(",").map((t) => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [...prev, task])
  }

  function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)))
  }

  function deleteTask(taskId: string) {
    setTasks((prev) => {
      const toDelete = prev.find((t) => t.id === taskId)
      if (!toDelete) return prev
      setTrashedTasks((trash) => [...trash, { ...toDelete, deletedAt: new Date().toISOString() }])
      return prev.filter((t) => t.id !== taskId)
    })
  }

  function restoreTask(taskId: string) {
    setTrashedTasks((trash) => {
      const item = trash.find((t) => t.id === taskId)
      if (!item) return trash
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { deletedAt, ...restored } = item
      setTasks((prev) => [...prev, restored as Task])
      return trash.filter((t) => t.id !== taskId)
    })
  }

  function permanentlyDeleteTask(taskId: string) {
    setTrashedTasks((trash) => trash.filter((t) => t.id !== taskId))
  }

  function emptyTrash() {
    setTrashedTasks([])
  }

  return {
    // state
    tasks,
    setTasks,
    trashedTasks,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterAssignee,
    setFilterAssignee,
    uniqueAssignees,
    tasksByStatus,

    // configs
    statusConfig,
    priorityConfig,

    // CRUD
    createTask,
    updateTaskStatus,
    deleteTask,
    restoreTask,
    permanentlyDeleteTask,
    emptyTrash,
  }
}
