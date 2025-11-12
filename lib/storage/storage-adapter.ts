/**
 * Storage adapter interface for abstracting storage operations
 * Allows easy swapping between localStorage, sessionStorage, IndexedDB, etc.
 */
export interface StorageAdapter {
  /**
   * Get a value from storage
   * @param key - Storage key
   * @param defaultValue - Default value if key doesn't exist
   * @returns The stored value or default value
   */
  get<T>(key: string, defaultValue: T): T

  /**
   * Set a value in storage
   * @param key - Storage key
   * @param value - Value to store
   */
  set<T>(key: string, value: T): void

  /**
   * Remove a value from storage
   * @param key - Storage key
   */
  remove(key: string): void

  /**
   * Clear all storage
   */
  clear(): void
}

/**
 * localStorage implementation of StorageAdapter
 * Includes error handling and JSON serialization
 */
export class LocalStorageAdapter implements StorageAdapter {
  get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key)
      if (item === null) {
        return defaultValue
      }
      // Try to parse as JSON, if it fails, return the raw string value
      try {
        return JSON.parse(item) as T
      } catch {
        // If JSON parsing fails, return the raw value (for backwards compatibility)
        return item as T
      }
    } catch (error) {
      console.error(`[Storage] Failed to read "${key}":`, error)
      return defaultValue
    }
  }

  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`[Storage] Failed to write "${key}":`, error)
      // Handle quota exceeded errors
      if (error instanceof Error && error.name === "QuotaExceededError") {
        console.warn("[Storage] localStorage quota exceeded. Consider clearing old data.")
      }
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`[Storage] Failed to remove "${key}":`, error)
    }
  }

  clear(): void {
    try {
      localStorage.clear()
    } catch (error) {
      console.error("[Storage] Failed to clear storage:", error)
    }
  }
}

/**
 * Default storage instance
 * Can be replaced with a different adapter if needed
 */
export const storage = new LocalStorageAdapter()
