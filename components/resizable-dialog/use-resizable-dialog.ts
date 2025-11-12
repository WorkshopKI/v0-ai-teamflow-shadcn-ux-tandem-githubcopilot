"use client"

import { useEffect, useState, useCallback } from "react"

export interface ResizableDialogDimensions {
    width: number
    height: number
}

export interface UseResizableDialogOptions {
    initialWidth: number
    initialHeight: number
    minWidth?: number
    minHeight?: number
    maxWidth?: number
    maxHeight?: number
    viewportMargin?: number
    onResize?: (dimensions: ResizableDialogDimensions) => void
}

export type ResizeDirection = "left" | "right" | "top" | "bottom" | null

export interface UseResizableDialogResult {
    width: number
    height: number
    isResizing: ResizeDirection
    startResize: (direction: ResizeDirection) => void
    handleMouseDown: (direction: ResizeDirection) => () => void
}

/**
 * Hook for managing resizable dialog dimensions with viewport constraints
 * @param options Configuration for resize behavior
 * @returns Current dimensions and resize handlers
 */
export function useResizableDialog({
    initialWidth,
    initialHeight,
    minWidth = 600,
    minHeight = 400,
    maxWidth,
    maxHeight,
    viewportMargin = 120,
    onResize,
}: UseResizableDialogOptions): UseResizableDialogResult {
    const [width, setWidth] = useState(initialWidth)
    const [height, setHeight] = useState(initialHeight)
    const [isResizing, setIsResizing] = useState<ResizeDirection>(null)
    const [dialogElement, setDialogElement] = useState<HTMLElement | null>(null)

    // Clamp dimensions to viewport on mount and when viewport changes
    useEffect(() => {
        if (typeof window === "undefined") return

        const clampDimensions = () => {
            const maxW = maxWidth ?? window.innerWidth - viewportMargin
            const maxH = maxHeight ?? window.innerHeight - viewportMargin

            const clampedWidth = Math.max(minWidth, Math.min(initialWidth, maxW))
            const clampedHeight = Math.max(minHeight, Math.min(initialHeight, maxH))

            setWidth(clampedWidth)
            setHeight(clampedHeight)
        }

        clampDimensions()
        window.addEventListener("resize", clampDimensions)
        return () => window.removeEventListener("resize", clampDimensions)
    }, [initialWidth, initialHeight, minWidth, minHeight, maxWidth, maxHeight, viewportMargin])

    // Find dialog element on first resize
    useEffect(() => {
        if (isResizing && !dialogElement) {
            const element = document.querySelector('[role="dialog"]') as HTMLElement
            if (element) setDialogElement(element)
        }
    }, [isResizing, dialogElement])

    useEffect(() => {
        if (!isResizing || !dialogElement) return

        const handleMouseMove = (e: MouseEvent) => {
            const rect = dialogElement.getBoundingClientRect()
            const maxW = maxWidth ?? window.innerWidth - viewportMargin
            const maxH = maxHeight ?? window.innerHeight - viewportMargin

            let newWidth = width
            let newHeight = height

            switch (isResizing) {
                case "left":
                    newWidth = rect.right - e.clientX
                    break
                case "right":
                    newWidth = e.clientX - rect.left
                    break
                case "top":
                    newHeight = rect.bottom - e.clientY
                    break
                case "bottom":
                    newHeight = e.clientY - rect.top
                    break
            }

            if (isResizing === "left" || isResizing === "right") {
                const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxW))
                setWidth(clampedWidth)
                onResize?.({ width: clampedWidth, height })
            }

            if (isResizing === "top" || isResizing === "bottom") {
                const clampedHeight = Math.max(minHeight, Math.min(newHeight, maxH))
                setHeight(clampedHeight)
                onResize?.({ width, height: clampedHeight })
            }
        }

        const handleMouseUp = () => {
            setIsResizing(null)
            document.body.style.cursor = ""
            document.body.style.userSelect = ""
        }

        document.addEventListener("mousemove", handleMouseMove)
        document.addEventListener("mouseup", handleMouseUp)

        const cursor = isResizing === "top" || isResizing === "bottom" ? "row-resize" : "col-resize"
        document.body.style.cursor = cursor
        document.body.style.userSelect = "none"

        return () => {
            document.removeEventListener("mousemove", handleMouseMove)
            document.removeEventListener("mouseup", handleMouseUp)
            document.body.style.cursor = ""
            document.body.style.userSelect = ""
        }
    }, [isResizing, width, height, minWidth, minHeight, maxWidth, maxHeight, viewportMargin, dialogElement, onResize])

    const startResize = useCallback((direction: ResizeDirection) => {
        setIsResizing(direction)
    }, [])

    const handleMouseDown = useCallback(
        (direction: ResizeDirection) => () => {
            startResize(direction)
        },
        [startResize],
    )

    return {
        width,
        height,
        isResizing,
        startResize,
        handleMouseDown,
    }
}
