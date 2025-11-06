"use client"

import type { ReactNode } from "react"
import { GripVertical } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useResizableDialog, type UseResizableDialogOptions } from "./use-resizable-dialog"

export interface ResizableDialogProps extends Omit<UseResizableDialogOptions, "onResize"> {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    hideTitle?: boolean
    children: ReactNode
    className?: string
    showResizeHandles?: {
        top?: boolean
        bottom?: boolean
        left?: boolean
        right?: boolean
    }
}

/**
 * A dialog with built-in resize handles and viewport constraints.
 * Automatically centers and ensures content stays within viewport bounds.
 */
export function ResizableDialog({
    open,
    onOpenChange,
    title,
    hideTitle = false,
    children,
    className,
    initialWidth,
    initialHeight,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    viewportMargin,
    showResizeHandles = { top: true, bottom: true, left: true, right: true },
}: ResizableDialogProps) {
    const { width, height, handleMouseDown } = useResizableDialog({
        initialWidth,
        initialHeight,
        ...(minWidth !== undefined && { minWidth }),
        ...(minHeight !== undefined && { minHeight }),
        ...(maxWidth !== undefined && { maxWidth }),
        ...(maxHeight !== undefined && { maxHeight }),
        ...(viewportMargin !== undefined && { viewportMargin }),
    })

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn("p-0 gap-0 overflow-hidden", className)}
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    maxWidth: `min(${width}px, calc(100vw - ${viewportMargin ?? 120}px))`,
                    maxHeight: `min(${height}px, calc(100vh - ${viewportMargin ?? 120}px))`,
                }}
            >
                <DialogTitle className={hideTitle ? "sr-only" : undefined}>{title}</DialogTitle>

                {/* Top resize handle */}
                {showResizeHandles.top && (
                    <div
                        onMouseDown={handleMouseDown("top")}
                        className="absolute left-0 top-0 z-50 h-2 w-full cursor-row-resize transition-colors hover:bg-primary/20"
                        style={{ marginTop: "-4px" }}
                    >
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1 opacity-0 transition-opacity hover:opacity-100">
                            <GripVertical className="h-4 w-4 rotate-90 text-muted-foreground" />
                        </div>
                    </div>
                )}

                {/* Bottom resize handle */}
                {showResizeHandles.bottom && (
                    <div
                        onMouseDown={handleMouseDown("bottom")}
                        className="absolute bottom-0 left-0 z-50 h-2 w-full cursor-row-resize transition-colors hover:bg-primary/20"
                        style={{ marginBottom: "-4px" }}
                    >
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1 opacity-0 transition-opacity hover:opacity-100">
                            <GripVertical className="h-4 w-4 rotate-90 text-muted-foreground" />
                        </div>
                    </div>
                )}

                {/* Left resize handle */}
                {showResizeHandles.left && (
                    <div
                        onMouseDown={handleMouseDown("left")}
                        className="absolute left-0 top-0 z-50 h-full w-3 cursor-col-resize transition-colors hover:bg-primary/30"
                        style={{ marginLeft: "-6px" }}
                    >
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1.5 opacity-50 shadow-sm transition-opacity hover:opacity-100">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                )}

                {/* Right resize handle */}
                {showResizeHandles.right && (
                    <div
                        onMouseDown={handleMouseDown("right")}
                        className="absolute right-0 top-0 z-50 h-full w-3 cursor-col-resize transition-colors hover:bg-primary/30"
                        style={{ marginRight: "-6px" }}
                    >
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1.5 opacity-50 shadow-sm transition-opacity hover:opacity-100">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                )}

                {children}
            </DialogContent>
        </Dialog>
    )
}
