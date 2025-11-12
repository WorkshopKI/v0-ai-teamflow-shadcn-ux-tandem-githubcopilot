"use client"

import "./settings-overlay.css"
import { useState, useEffect } from "react"
import { useSettings } from "@/lib/settings"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { RotateCcw, Palette, Type, Layout, Check, GripVertical } from "lucide-react"
import { AppearanceTab, TypographyTab, LayoutTab, SettingsPreview } from "@/components/settings"

interface SettingsOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsOverlay({ open, onOpenChange }: SettingsOverlayProps) {
  const { pendingSettings, updatePendingSettings, applySettings, resetSettings, hasChanges } = useSettings()
  const [activeTab, setActiveTab] = useState("appearance")
  const [previewWidth, setPreviewWidth] = useState(370)
  const [isResizing, setIsResizing] = useState(false)
  const [dialogWidth, setDialogWidth] = useState(1100)
  const [dialogHeight, setDialogHeight] = useState(900)
  const [isResizingDialog, setIsResizingDialog] = useState<"left" | "right" | "top" | "bottom" | null>(null)

  useEffect(() => {
    if (!open) return

    if (typeof window !== "undefined") {
      const maxWidth = Math.max(600, window.innerWidth - 120)
      const maxHeight = Math.max(700, window.innerHeight - 100)

      setDialogWidth(Math.min(1100, maxWidth))
      setDialogHeight(Math.min(900, maxHeight))
    } else {
      setDialogWidth(1100)
      setDialogHeight(900)
    }

    setPreviewWidth(370)
  }, [open])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const dialogElement = document.querySelector('[role="dialog"]')
        if (!dialogElement) return
        const dialogRect = dialogElement.getBoundingClientRect()
        const newWidth = dialogRect.right - e.clientX
        setPreviewWidth(Math.max(330, Math.min(550, newWidth)))
      }

      if (isResizingDialog) {
        const dialogElement = document.querySelector('[role="dialog"]')
        if (!dialogElement) return
        const dialogRect = dialogElement.getBoundingClientRect()
        const maxWidth = Math.max(600, window.innerWidth - 120)
        const maxHeight = Math.max(600, window.innerHeight - 120)

        if (isResizingDialog === "left") {
          const newWidth = dialogRect.right - e.clientX
          setDialogWidth(Math.max(600, Math.min(maxWidth, newWidth)))
        } else if (isResizingDialog === "right") {
          const newWidth = e.clientX - dialogRect.left
          setDialogWidth(Math.max(600, Math.min(maxWidth, newWidth)))
        } else if (isResizingDialog === "top") {
          const newHeight = dialogRect.bottom - e.clientY
          setDialogHeight(Math.max(600, Math.min(maxHeight, newHeight)))
        } else if (isResizingDialog === "bottom") {
          const newHeight = e.clientY - dialogRect.top
          setDialogHeight(Math.max(600, Math.min(maxHeight, newHeight)))
        }
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      setIsResizingDialog(null)
    }

    if (isResizing || isResizingDialog) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor =
        isResizingDialog === "top" || isResizingDialog === "bottom" ? "row-resize" : "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, isResizingDialog])



  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="settings-dialog-content p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-md"
        style={{
          ['--dialog-width' as string]: `${dialogWidth}px`,
          ['--dialog-height' as string]: `${dialogHeight}px`,
        }}
      >
        <DialogTitle className="sr-only">Settings</DialogTitle>
        <div
          onMouseDown={() => setIsResizingDialog("top")}
          className="absolute left-0 top-0 z-50 w-full h-2 cursor-row-resize hover:bg-primary/20 transition-colors"
          style={{ marginTop: "-4px" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1 opacity-0 hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground rotate-90" />
          </div>
        </div>

        <div
          onMouseDown={() => setIsResizingDialog("bottom")}
          className="absolute left-0 bottom-0 z-50 w-full h-2 cursor-row-resize hover:bg-primary/20 transition-colors"
          style={{ marginBottom: "-4px" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1 opacity-0 hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground rotate-90" />
          </div>
        </div>

        <div
          onMouseDown={() => setIsResizingDialog("left")}
          className="absolute left-0 top-0 z-50 h-full w-3 cursor-col-resize hover:bg-primary/30 transition-colors"
          style={{ marginLeft: "-6px" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1.5 opacity-50 hover:opacity-100 transition-opacity shadow-sm">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div
          onMouseDown={() => setIsResizingDialog("right")}
          className="absolute right-0 top-0 z-50 h-full w-3 cursor-col-resize hover:bg-primary/30 transition-colors"
          style={{ marginRight: "-6px" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1.5 opacity-50 hover:opacity-100 transition-opacity shadow-sm">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5">
              <div className="mb-4">
                <DialogTitle className="font-bold tracking-tight text-2xl">Settings</DialogTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Customize your TeamFlow experience with personalized appearance and layout options
                </p>
              </div>

              {/* Settings Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 h-9">
                  <TabsTrigger value="appearance" className="flex items-center gap-1.5 text-sm">
                    <Palette className="h-3.5 w-3.5" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="flex items-center gap-1.5 text-sm">
                    <Type className="h-3.5 w-3.5" />
                    Typography
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="flex items-center gap-1.5 text-sm">
                    <Layout className="h-3.5 w-3.5" />
                    Layout
                  </TabsTrigger>
                </TabsList>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-4">
                  <AppearanceTab pendingSettings={pendingSettings} updatePendingSettings={updatePendingSettings} />
                </TabsContent>

                {/* Typography Tab */}
                <TabsContent value="typography" className="space-y-4">
                  <TypographyTab pendingSettings={pendingSettings} updatePendingSettings={updatePendingSettings} />
                </TabsContent>

                {/* Layout Tab */}
                <TabsContent value="layout" className="space-y-4">
                  <LayoutTab pendingSettings={pendingSettings} updatePendingSettings={updatePendingSettings} />
                </TabsContent>
              </Tabs>

              <div className="mt-5 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {hasChanges && <span className="text-amber-600">You have unsaved changes</span>}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetSettings}
                    className="flex items-center gap-1.5 bg-transparent"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span className="text-xs">Reset to Defaults</span>
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      applySettings()
                      onOpenChange(false)
                    }}
                    disabled={!hasChanges}
                    className="flex items-center gap-1.5"
                    style={{
                      backgroundColor: hasChanges ? pendingSettings.primaryColor : undefined,
                    }}
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span className="text-xs">Apply Changes</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview Panel */}
          <SettingsPreview
            pendingSettings={pendingSettings}
            previewWidth={previewWidth}
            setPreviewWidth={setPreviewWidth}
            isResizing={isResizing}
            setIsResizing={setIsResizing}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
