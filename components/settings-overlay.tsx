"use client"

import { useState, useEffect } from "react"
import { useSettings } from "@/lib/settings-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  RotateCcw,
  Palette,
  Type,
  Layout,
  Sparkles,
  Check,
  Home,
  CheckSquare,
  Workflow,
  FileText,
  Bot,
  GripVertical,
} from "lucide-react"

const fontPresets = [
  { id: "sans", name: "Sans Serif", description: "Clean and modern", example: "Inter" },
  { id: "serif", name: "Serif", description: "Classic and elegant", example: "Lora" },
  { id: "mono", name: "Monospace", description: "Code-friendly", example: "JetBrains Mono" },
]

const colorPresets = [
  { name: "Professional Blue", primary: "#0a3874", accent: "#306bb3" },
  { name: "Forest Green", primary: "#1e5631", accent: "#4a9d5f" },
  { name: "Royal Purple", primary: "#5b21b6", accent: "#8b5cf6" },
  { name: "Sunset Orange", primary: "#c2410c", accent: "#f97316" },
  { name: "Deep Teal", primary: "#0f766e", accent: "#14b8a6" },
]

interface SettingsOverlayProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsOverlay({ open, onOpenChange }: SettingsOverlayProps) {
  const { pendingSettings, updatePendingSettings, applySettings, resetSettings, hasChanges } = useSettings()
  const [activeTab, setActiveTab] = useState("appearance")
  const [previewWidth, setPreviewWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [dialogWidth, setDialogWidth] = useState(1100)
  const [dialogHeight, setDialogHeight] = useState(800)
  const [isResizingDialog, setIsResizingDialog] = useState<"left" | "right" | "top" | "bottom" | null>(null)

  useEffect(() => {
    if (open) {
      setDialogWidth(1100)
      setDialogHeight(800)
      setPreviewWidth(320)
    }
  }, [open])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const dialogElement = document.querySelector('[role="dialog"]')
        if (!dialogElement) return
        const dialogRect = dialogElement.getBoundingClientRect()
        const newWidth = dialogRect.right - e.clientX
        setPreviewWidth(Math.max(300, Math.min(600, newWidth)))
      }

      if (isResizingDialog) {
        const dialogElement = document.querySelector('[role="dialog"]')
        if (!dialogElement) return
        const dialogRect = dialogElement.getBoundingClientRect()

        if (isResizingDialog === "left") {
          const newWidth = dialogRect.right - e.clientX
          setDialogWidth(Math.max(800, Math.min(window.innerWidth - 100, newWidth)))
        } else if (isResizingDialog === "right") {
          const newWidth = e.clientX - dialogRect.left
          setDialogWidth(Math.max(800, Math.min(window.innerWidth - 100, newWidth)))
        } else if (isResizingDialog === "top") {
          const newHeight = dialogRect.bottom - e.clientY
          setDialogHeight(Math.max(600, Math.min(window.innerHeight - 100, newHeight)))
        } else if (isResizingDialog === "bottom") {
          const newHeight = e.clientY - dialogRect.top
          setDialogHeight(Math.max(600, Math.min(window.innerHeight - 100, newHeight)))
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

  const getSpacingValue = () => {
    const spacingMap = {
      "ultra-compact": "0.1875rem", // 3px - increased from 0.25rem for better balance
      compact: "0.5rem", // 8px
      comfortable: "0.75rem", // reduced from 1rem (16px) to 0.75rem (12px) for preview consistency
    }
    return spacingMap[pendingSettings.spacing]
  }

  const getRadiusValue = () => {
    const radiusMap = {
      none: "0",
      small: "0.25rem",
      medium: "0.5rem",
      large: "1rem",
    }
    return radiusMap[pendingSettings.borderRadius]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] p-0 gap-0 overflow-hidden relative bg-background/95 backdrop-blur-md"
        style={{
          width: `${dialogWidth}px`,
          height: `${dialogHeight}px`,
          maxWidth: "none",
          maxHeight: "none",
        }}
      >
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
          className="absolute left-0 top-0 z-50 h-full w-2 cursor-col-resize hover:bg-primary/20 transition-colors"
          style={{ marginLeft: "-4px" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1 opacity-0 hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div
          onMouseDown={() => setIsResizingDialog("right")}
          className="absolute right-0 top-0 z-50 h-full w-2 cursor-col-resize hover:bg-primary/20 transition-colors"
          style={{ marginRight: "-4px" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="flex h-full">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-5">
              <div className="mb-4">
                <h1 className="font-bold tracking-tight text-2xl">Settings</h1>
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
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Color Theme</CardTitle>
                      <CardDescription className="text-xs">
                        Choose a color scheme that matches your style
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Color Presets */}
                      <div className="space-y-2">
                        <Label className="text-sm">Color Presets</Label>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.name}
                              onClick={() =>
                                updatePendingSettings({
                                  primaryColor: preset.primary,
                                  accentColor: preset.accent,
                                })
                              }
                              className="group relative overflow-hidden rounded-lg border-2 p-3 text-left transition-all hover:border-primary"
                              style={{
                                borderColor:
                                  pendingSettings.primaryColor === preset.primary ? preset.primary : "var(--border)",
                              }}
                            >
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <div className="h-6 w-6 rounded" style={{ backgroundColor: preset.primary }} />
                                  <div className="h-6 w-6 rounded" style={{ backgroundColor: preset.accent }} />
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium">{preset.name}</div>
                                </div>
                              </div>
                              {pendingSettings.primaryColor === preset.primary && (
                                <div className="absolute right-2 top-2">
                                  <Sparkles className="h-3.5 w-3.5" style={{ color: preset.primary }} />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Colors */}
                      <div className="space-y-2">
                        <Label className="text-sm">Custom Colors</Label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label htmlFor="primary-color" className="text-xs">
                              Primary Color
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="primary-color"
                                type="color"
                                value={pendingSettings.primaryColor}
                                onChange={(e) => updatePendingSettings({ primaryColor: e.target.value })}
                                className="h-9 w-16 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={pendingSettings.primaryColor}
                                onChange={(e) => updatePendingSettings({ primaryColor: e.target.value })}
                                className="flex-1 font-mono text-xs h-9"
                              />
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="accent-color" className="text-xs">
                              Accent Color
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="accent-color"
                                type="color"
                                value={pendingSettings.accentColor}
                                onChange={(e) => updatePendingSettings({ accentColor: e.target.value })}
                                className="h-9 w-16 cursor-pointer"
                              />
                              <Input
                                type="text"
                                value={pendingSettings.accentColor}
                                onChange={(e) => updatePendingSettings({ accentColor: e.target.value })}
                                className="flex-1 font-mono text-xs h-9"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Border Radius */}
                      <div className="space-y-2">
                        <Label className="text-sm">Border Radius</Label>
                        <RadioGroup
                          value={pendingSettings.borderRadius}
                          onValueChange={(value: any) => updatePendingSettings({ borderRadius: value })}
                          className="grid grid-cols-4 gap-2"
                        >
                          {["none", "small", "medium", "large"].map((radius) => (
                            <div key={radius}>
                              <RadioGroupItem value={radius} id={`radius-${radius}`} className="peer sr-only" />
                              <Label
                                htmlFor={`radius-${radius}`}
                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div
                                  className="mb-1.5 h-10 w-10 border-2 bg-primary/10"
                                  style={{
                                    borderRadius:
                                      radius === "none"
                                        ? "0"
                                        : radius === "small"
                                          ? "0.25rem"
                                          : radius === "medium"
                                            ? "0.5rem"
                                            : "1rem",
                                  }}
                                />
                                <span className="text-xs font-medium capitalize">{radius}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Typography Tab */}
                <TabsContent value="typography" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Font Settings</CardTitle>
                      <CardDescription className="text-xs">Customize typography for better readability</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Font Family */}
                      <div className="space-y-2">
                        <Label className="text-sm">Font Family</Label>
                        <RadioGroup
                          value={pendingSettings.fontFamily}
                          onValueChange={(value: any) => updatePendingSettings({ fontFamily: value })}
                          className="grid gap-2"
                        >
                          {fontPresets.map((font) => (
                            <div key={font.id}>
                              <RadioGroupItem value={font.id} id={`font-${font.id}`} className="peer sr-only" />
                              <Label
                                htmlFor={`font-${font.id}`}
                                className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className="space-y-0.5">
                                  <div className="text-sm font-medium">{font.name}</div>
                                  <div className="text-xs text-muted-foreground">{font.description}</div>
                                </div>
                                <div className="text-xl" style={{ fontFamily: `var(--font-${font.id})` }}>
                                  {font.example}
                                </div>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Font Size */}
                      <div className="space-y-2">
                        <Label className="text-sm">Font Size</Label>
                        <RadioGroup
                          value={pendingSettings.fontSize}
                          onValueChange={(value: any) => updatePendingSettings({ fontSize: value })}
                          className="grid grid-cols-3 gap-2"
                        >
                          {["small", "medium", "large"].map((size) => (
                            <div key={size}>
                              <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                              <Label
                                htmlFor={`size-${size}`}
                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <span
                                  className="mb-1 font-medium"
                                  style={{
                                    fontSize: size === "small" ? "14px" : size === "medium" ? "16px" : "18px",
                                  }}
                                >
                                  Aa
                                </span>
                                <span className="text-xs capitalize">{size}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Layout Tab */}
                <TabsContent value="layout" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Layout Configuration</CardTitle>
                      <CardDescription className="text-xs">Adjust spacing and component arrangement</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Sidebar Position */}
                      <div className="space-y-2">
                        <Label className="text-sm">Sidebar Position</Label>
                        <RadioGroup
                          value={pendingSettings.sidebarPosition}
                          onValueChange={(value: any) => updatePendingSettings({ sidebarPosition: value })}
                          className="grid grid-cols-2 gap-2"
                        >
                          {["left", "right"].map((position) => (
                            <div key={position}>
                              <RadioGroupItem value={position} id={`position-${position}`} className="peer sr-only" />
                              <Label
                                htmlFor={`position-${position}`}
                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className="mb-1.5 flex h-10 w-14 items-center gap-1 rounded border">
                                  {position === "left" ? (
                                    <>
                                      <div className="h-full w-3 bg-primary/20" />
                                      <div className="flex-1 bg-muted" />
                                    </>
                                  ) : (
                                    <>
                                      <div className="flex-1 bg-muted" />
                                      <div className="h-full w-3 bg-primary/20" />
                                    </>
                                  )}
                                </div>
                                <span className="text-xs font-medium capitalize">{position}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>

                      {/* Spacing */}
                      <div className="space-y-2">
                        <Label className="text-sm">Space Density</Label>
                        <RadioGroup
                          value={pendingSettings.spacing}
                          onValueChange={(value: any) => updatePendingSettings({ spacing: value })}
                          className="grid grid-cols-3 gap-2"
                        >
                          {[
                            { value: "ultra-compact", label: "Ultra Compact" },
                            { value: "compact", label: "Compact" },
                            { value: "comfortable", label: "Comfortable" },
                          ].map((spacing) => (
                            <div key={spacing.value}>
                              <RadioGroupItem
                                value={spacing.value}
                                id={`spacing-${spacing.value}`}
                                className="peer sr-only"
                              />
                              <Label
                                htmlFor={`spacing-${spacing.value}`}
                                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              >
                                <div className="mb-1.5 flex flex-col gap-0.5">
                                  {[1, 2, 3].map((i) => (
                                    <div
                                      key={i}
                                      className="h-1.5 w-10 rounded bg-primary/20"
                                      style={{
                                        marginBottom:
                                          spacing.value === "ultra-compact"
                                            ? "1px"
                                            : spacing.value === "compact"
                                              ? "2px"
                                              : "4px",
                                      }}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs font-medium text-center leading-tight">{spacing.label}</span>
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
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
          <div
            className="relative hidden border-l bg-muted/30 lg:block"
            style={{ width: `${previewWidth}px`, minWidth: "280px", maxWidth: "500px" }}
          >
            <div
              onMouseDown={() => setIsResizing(true)}
              className="absolute left-0 top-0 z-10 h-full w-1 cursor-col-resize bg-border transition-colors hover:bg-primary"
              style={{ marginLeft: "-2px" }}
            >
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-lg">Live Preview</h3>
                  <p className="text-xs text-muted-foreground">See your changes in real-time</p>
                </div>

                {/* Mini App Preview */}
                <div
                  className="overflow-hidden rounded-lg border bg-background shadow-lg"
                  style={{ borderRadius: getRadiusValue() }}
                >
                  <div
                    className="flex"
                    style={{
                      flexDirection: pendingSettings.sidebarPosition === "right" ? "row-reverse" : "row",
                    }}
                  >
                    {/* Mini Sidebar */}
                    <div
                      className="w-12 border-r bg-card"
                      style={{
                        backgroundColor: pendingSettings.primaryColor,
                        borderRadius:
                          pendingSettings.sidebarPosition === "left"
                            ? `${getRadiusValue()} 0 0 ${getRadiusValue()}`
                            : `0 ${getRadiusValue()} ${getRadiusValue()} 0`,
                      }}
                    >
                      <div className="flex flex-col items-center gap-1.5 p-1.5" style={{ gap: getSpacingValue() }}>
                        {[Home, CheckSquare, Workflow, FileText, Bot].map((Icon, i) => (
                          <div
                            key={i}
                            className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-white/10"
                            style={{
                              borderRadius: getRadiusValue(),
                              backgroundColor: i === 0 ? "rgba(255,255,255,0.2)" : "transparent",
                            }}
                          >
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mini Content */}
                    <div className="flex-1 p-2" style={{ padding: getSpacingValue() }}>
                      <div className="space-y-1.5" style={{ gap: getSpacingValue() }}>
                        <div
                          className="h-3 w-20 rounded bg-muted"
                          style={{
                            borderRadius: getRadiusValue(),
                            fontFamily: `var(--font-${pendingSettings.fontFamily})`,
                          }}
                        />
                        <div className="h-1.5 w-full rounded bg-muted/50" style={{ borderRadius: getRadiusValue() }} />
                        <div className="h-1.5 w-3/4 rounded bg-muted/50" style={{ borderRadius: getRadiusValue() }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Typography Sample */}
                <Card style={{ borderRadius: getRadiusValue() }}>
                  <CardHeader className="pb-2 pt-3 px-3" style={{ padding: getSpacingValue() }}>
                    <CardTitle className="text-sm" style={{ fontFamily: `var(--font-${pendingSettings.fontFamily})` }}>
                      Typography Sample
                    </CardTitle>
                    <CardDescription className="text-xs">Preview of your selected font</CardDescription>
                  </CardHeader>
                  <CardContent className="px-3 pb-3" style={{ padding: getSpacingValue() }}>
                    <div className="space-y-2" style={{ gap: getSpacingValue() }}>
                      <p
                        className="text-xs leading-relaxed"
                        style={{
                          fontFamily: `var(--font-${pendingSettings.fontFamily})`,
                          fontSize:
                            pendingSettings.fontSize === "small"
                              ? "11px"
                              : pendingSettings.fontSize === "medium"
                                ? "12px"
                                : "13px",
                        }}
                      >
                        The quick brown fox jumps over the lazy dog. This preview updates as you change settings.
                      </p>
                      <div className="flex gap-1.5" style={{ gap: getSpacingValue() }}>
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs"
                          style={{
                            backgroundColor: pendingSettings.primaryColor,
                            borderRadius: getRadiusValue(),
                          }}
                        >
                          Primary
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs bg-transparent"
                          style={{
                            borderColor: pendingSettings.accentColor,
                            color: pendingSettings.accentColor,
                            borderRadius: getRadiusValue(),
                          }}
                        >
                          Accent
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Color Swatches */}
                <div
                  className="rounded-lg border bg-card p-3"
                  style={{ borderRadius: getRadiusValue(), padding: getSpacingValue() }}
                >
                  <h4 className="mb-2 text-xs font-semibold">Color Palette</h4>
                  <div className="grid grid-cols-2 gap-2" style={{ gap: getSpacingValue() }}>
                    <div>
                      <div
                        className="mb-1.5 h-10 w-full rounded"
                        style={{ backgroundColor: pendingSettings.primaryColor, borderRadius: getRadiusValue() }}
                      />
                      <p className="text-xs text-muted-foreground">Primary</p>
                    </div>
                    <div>
                      <div
                        className="mb-1.5 h-10 w-full rounded"
                        style={{ backgroundColor: pendingSettings.accentColor, borderRadius: getRadiusValue() }}
                      />
                      <p className="text-xs text-muted-foreground">Accent</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
