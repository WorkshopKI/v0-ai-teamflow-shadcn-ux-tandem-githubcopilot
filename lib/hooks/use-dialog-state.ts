"use client"

import { useState, useCallback } from "react"

/**
 * Hook for managing dialog/modal open/close state
 * Provides convenient methods for common dialog operations
 *
 * @param initialOpen - Initial open state (default: false)
 * @returns Dialog state and control methods
 *
 * @example
 * ```tsx
 * const dialog = useDialogState()
 * return (
 *   <>
 *     <Button onClick={dialog.open}>Open</Button>
 *     <Dialog open={dialog.isOpen} onOpenChange={dialog.setIsOpen}>
 *       <DialogContent>...</DialogContent>
 *     </Dialog>
 *   </>
 * )
 * ```
 */
export function useDialogState(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}
