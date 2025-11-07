"use client"

import { useState, useEffect, useCallback } from "react"

/**
 * Clamp a number between min and max values
 */
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

/**
 * Hook for managing resizable element dimensions
 * Handles mouse events and constrains size within min/max bounds
 *
 * @param initialSize - Initial size in pixels
 * @param minSize - Minimum allowed size
 * @param maxSize - Maximum allowed size
 * @param storageKey - Optional localStorage key to persist size
 * @returns Size state and resize controls
 *
 * @example
 * ```tsx
 * const { size, isResizing, startResize } = useResizeHandle(256, 200, 400)
 * return (
 *   <div style={{ width: size }}>
 *     <div onMouseDown={startResize} />
 *   </div>
 * )
 * ```
 */
export function useResizeHandle(initialSize: number, minSize: number, maxSize: number, storageKey?: string) {
  const [size, setSize] = useState(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const [startPosition, setStartPosition] = useState(0)
  const [startSize, setStartSize] = useState(initialSize)

  // Load from storage on mount
  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = Number.parseInt(saved, 10)
        if (!Number.isNaN(parsed) && parsed >= minSize && parsed <= maxSize) {
          setSize(parsed)
        }
      }
    }
  }, [storageKey, minSize, maxSize])

  // Save to storage when size changes
  useEffect(() => {
    if (storageKey && !isResizing) {
      localStorage.setItem(storageKey, size.toString())
    }
  }, [size, storageKey, isResizing])

  // Handle mouse move and up events
  useEffect(() => {
    if (!isResizing) return

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startPosition
      const newSize = clamp(startSize + delta, minSize, maxSize)
      setSize(newSize)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.body.style.cursor = "col-resize"
    document.body.style.userSelect = "none"

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, startPosition, startSize, minSize, maxSize])

  const startResize = useCallback((e: any) => {
    e.preventDefault()
    setIsResizing(true)
    setStartPosition(e.clientX)
    setStartSize(size)
  }, [size])

  return {
    size,
    isResizing,
    startResize,
    setSize,
  }
}
