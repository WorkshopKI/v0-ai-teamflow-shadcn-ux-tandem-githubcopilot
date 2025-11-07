"use client"

import { useState, useEffect, useCallback } from "react"
import { storage } from "./storage-adapter"

/**
 * Hook for syncing state with localStorage
 * Automatically loads from storage on mount and saves on change
 *
 * @param key - Storage key
 * @param defaultValue - Default value if key doesn't exist
 * @returns [value, setValue, isLoaded] tuple
 *
 * @example
 * ```tsx
 * const [theme, setTheme, isLoaded] = useStorage('theme', 'light')
 * ```
 */
export function useStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from storage on mount
  useEffect(() => {
    const stored = storage.get(key, defaultValue)
    setValue(stored)
    setIsLoaded(true)
    // Note: defaultValue is intentionally omitted from deps to avoid endless
    // loops when callers pass inline literals (e.g., []). defaultValue only
    // matters for the initial load when nothing is in storage.
  }, [key])

  // Update both state and storage
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const updated = typeof newValue === "function" ? (newValue as (prev: T) => T)(prev) : newValue
        storage.set(key, updated)
        return updated
      })
    },
    [key],
  )

  return [value, updateValue, isLoaded] as const
}
