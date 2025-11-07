"use client"

import { useCallback } from "react"
import { useStorage } from "@/lib/storage"

/**
 * Hook for CRUD operations with localStorage persistence
 * Provides create, update, and remove operations for array-based data
 *
 * @param initialItems - Default items if storage is empty
 * @param storageKey - localStorage key for persistence (optional)
 * @returns CRUD operations and current items
 *
 * @example
 * ```tsx
 * const { items, create, update, remove } = useCRUD<Task>(
 *   mockTasks,
 *   'tasks'
 * )
 * ```
 */
export function useCRUD<T extends { id: string }>(initialItems: T[], storageKey?: string) {
  const [items, setItems, isLoaded] = useStorage(storageKey || `crud-${Date.now()}`, initialItems)

  const create = useCallback(
    (item: T) => {
      setItems((prev: T[]) => [...prev, item])
    },
    [setItems],
  )

  const update = useCallback(
    (id: string, updates: Partial<T>) => {
      setItems((prev: T[]) => prev.map((item: T) => (item.id === id ? { ...item, ...updates } : item)))
    },
    [setItems],
  )

  const remove = useCallback(
    (id: string) => {
      setItems((prev: T[]) => prev.filter((item: T) => item.id !== id))
    },
    [setItems],
  )

  const clear = useCallback(() => {
    setItems([])
  }, [setItems])

  const bulkUpdate = useCallback(
    (updates: T[]) => {
      setItems(updates)
    },
    [setItems],
  )

  return {
    items,
    create,
    update,
    remove,
    clear,
    bulkUpdate,
    setItems,
    isLoaded,
  }
}
