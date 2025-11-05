"use client"

import { useState, useRef, useEffect } from "react"
import { useSettings } from "@/lib/settings-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
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

export default function SettingsPage() {
  const { pendingSettings, updatePendingSettings, applySettings, resetSettings, hasChanges } = useSettings()
  const [activeTab, setActiveTab] = useState("appearance")
  const [previewWidth, setPreviewWidth] = useState(400)
  const [isResizing, setIsResizing] = useState(false)
  const resizeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = window.innerWidth - e.clientX
      setPreviewWidth(Math.max(300, Math.min(800, newWidth)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing])

  const getSpacingValue = () => {
    const spacingMap = {
      "ultra-compact": "0.25rem",
      compact: "0.5rem",
      comfortable: "1rem",
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
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Customize your TeamFlow experience with personalized appearance and layout options
            </p>
          </div>

          {/* Settings Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-2">
                <Type className="h-4 w-4" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-2">
                <Layout className="h-4 w-4" />
                Layout
              </TabsTrigger>
            </TabsList>

            {/* Appearance Tab */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Color Theme</CardTitle>
                  <CardDescription>Choose a color scheme that matches your style</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Color Presets */}
                  <div className="space-y-4">
                    <Label>Color Presets</Label>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          onClick={() =>
                            updatePendingSettings({
                              primaryColor: preset.primary,
                              accentColor: preset.accent,
                            })
                          }
                          className="group relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all hover:border-primary"
                          style={{
                            borderColor:
                              pendingSettings.primaryColor === preset.primary ? preset.primary : "var(--border)",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <div className="h-8 w-8 rounded" style={{ backgroundColor: preset.primary }} />
                              <div className="h-8 w-8 rounded" style={{ backgroundColor: preset.accent }} />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{preset.name}</div>
                            </div>
                          </div>
                          {pendingSettings.primaryColor === preset.primary && (
                            <div className="absolute right-2 top-2">
                              <Sparkles className="h-4 w-4" style={{ color: preset.primary }} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Colors */}
                  <div className="space-y-4">
                    <Label>Custom Colors</Label>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="primary-color">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="primary-color"
                            type="color"
                            value={pendingSettings.primaryColor}
                            onChange={(e) => updatePendingSettings({ primaryColor: e.target.value })}
                            className="h-10 w-20 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={pendingSettings.primaryColor}
                            onChange={(e) => updatePendingSettings({ primaryColor: e.target.value })}
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accent-color">Accent Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="accent-color"
                            type="color"
                            value={pendingSettings.accentColor}
                            onChange={(e) => updatePendingSettings({ accentColor: e.target.value })}
                            className="h-10 w-20 cursor-pointer"
                          />
                          <Input
                            type="text"
                            value={pendingSettings.accentColor}
                            onChange={(e) => updatePendingSettings({ accentColor: e.target.value })}
                            className="flex-1 font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Border Radius */}
                  <div className="space-y-4">
                    <Label>Border Radius</Label>
                    <RadioGroup
                      value={pendingSettings.borderRadius}
                      onValueChange={(value: any) => updatePendingSettings({ borderRadius: value })}
                      className="grid grid-cols-4 gap-3"
                    >
                      {["none", "small", "medium", "large"].map((radius) => (
                        <div key={radius}>
                          <RadioGroupItem value={radius} id={`radius-${radius}`} className="peer sr-only" />
                          <Label
                            htmlFor={`radius-${radius}`}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div
                              className="mb-2 h-12 w-12 border-2 bg-primary/10"
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
                            <span className="text-sm font-medium capitalize">{radius}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Font Settings</CardTitle>
                  <CardDescription>Customize typography for better readability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Font Family */}
                  <div className="space-y-4">
                    <Label>Font Family</Label>
                    <RadioGroup
                      value={pendingSettings.fontFamily}
                      onValueChange={(value: any) => updatePendingSettings({ fontFamily: value })}
                      className="grid gap-3"
                    >
                      {fontPresets.map((font) => (
                        <div key={font.id}>
                          <RadioGroupItem value={font.id} id={`font-${font.id}`} className="peer sr-only" />
                          <Label
                            htmlFor={`font-${font.id}`}
                            className="flex cursor-pointer items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="space-y-1">
                              <div className="font-medium">{font.name}</div>
                              <div className="text-sm text-muted-foreground">{font.description}</div>
                            </div>
                            <div className="text-2xl" style={{ fontFamily: `var(--font-${font.id})` }}>
                              {font.example}
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Font Size */}
                  <div className="space-y-4">
                    <Label>Font Size</Label>
                    <RadioGroup
                      value={pendingSettings.fontSize}
                      onValueChange={(value: any) => updatePendingSettings({ fontSize: value })}
                      className="grid grid-cols-3 gap-3"
                    >
                      {["small", "medium", "large"].map((size) => (
                        <div key={size}>
                          <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                          <Label
                            htmlFor={`size-${size}`}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <span
                              className="mb-2 font-medium"
                              style={{
                                fontSize: size === "small" ? "14px" : size === "medium" ? "16px" : "18px",
                              }}
                            >
                              Aa
                            </span>
                            <span className="text-sm capitalize">{size}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Configuration</CardTitle>
                  <CardDescription>Adjust spacing and component arrangement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sidebar Position */}
                  <div className="space-y-4">
                    <Label>Sidebar Position</Label>
                    <RadioGroup
                      value={pendingSettings.sidebarPosition}
                      onValueChange={(value: any) => updatePendingSettings({ sidebarPosition: value })}
                      className="grid grid-cols-2 gap-3"
                    >
                      {["left", "right"].map((position) => (
                        <div key={position}>
                          <RadioGroupItem value={position} id={`position-${position}`} className="peer sr-only" />
                          <Label
                            htmlFor={`position-${position}`}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="mb-2 flex h-12 w-16 items-center gap-1 rounded border">
                              {position === "left" ? (
                                <>
                                  <div className="h-full w-4 bg-primary/20" />
                                  <div className="flex-1 bg-muted" />
                                </>
                              ) : (
                                <>
                                  <div className="flex-1 bg-muted" />
                                  <div className="h-full w-4 bg-primary/20" />
                                </>
                              )}
                            </div>
                            <span className="text-sm font-medium capitalize">{position}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Spacing */}
                  <div className="space-y-4">
                    <Label>Space Density</Label>
                    <RadioGroup
                      value={pendingSettings.spacing}
                      onValueChange={(value: any) => updatePendingSettings({ spacing: value })}
                      className="grid grid-cols-3 gap-3"
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
                            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                          >
                            <div className="mb-2 flex flex-col gap-1">
                              {[1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className="h-2 w-12 rounded bg-primary/20"
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
                            <span className="text-sm font-medium">{spacing.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {hasChanges && <span className="text-amber-600">You have unsaved changes</span>}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={resetSettings} className="flex items-center gap-2 bg-transparent">
                <RotateCcw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button
                onClick={applySettings}
                disabled={!hasChanges}
                className="flex items-center gap-2"
                style={{
                  backgroundColor: hasChanges ? pendingSettings.primaryColor : undefined,
                }}
              >
                <Check className="h-4 w-4" />
                Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative hidden border-l bg-muted/30 lg:block"
        style={{ width: `${previewWidth}px`, minWidth: "300px", maxWidth: "800px" }}
      >
        {/* Resize Handle */}
        <div
          ref={resizeRef}
          onMouseDown={() => setIsResizing(true)}
          className="absolute left-0 top-0 z-10 h-full w-1 cursor-col-resize bg-border transition-colors hover:bg-primary"
          style={{ marginLeft: "-2px" }}
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-border p-1">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="h-full overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Live Preview</h3>
              <p className="text-sm text-muted-foreground">See your changes in real-time</p>
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
                  className="w-16 border-r bg-card"
                  style={{
                    backgroundColor: pendingSettings.primaryColor,
                    borderRadius:
                      pendingSettings.sidebarPosition === "left"
                        ? `${getRadiusValue()} 0 0 ${getRadiusValue()}`
                        : `0 ${getRadiusValue()} ${getRadiusValue()} 0`,
                  }}
                >
                  <div className="flex flex-col items-center gap-2 p-2" style={{ gap: getSpacingValue() }}>
                    {[Home, CheckSquare, Workflow, FileText, Bot].map((Icon, i) => (
                      <div
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-white/10"
                        style={{
                          borderRadius: getRadiusValue(),
                          backgroundColor: i === 0 ? "rgba(255,255,255,0.2)" : "transparent",
                        }}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mini Content */}
                <div className="flex-1 p-3" style={{ padding: getSpacingValue() }}>
                  <div className="space-y-2" style={{ gap: getSpacingValue() }}>
                    <div
                      className="h-4 w-24 rounded bg-muted"
                      style={{
                        borderRadius: getRadiusValue(),
                        fontFamily: `var(--font-${pendingSettings.fontFamily})`,
                      }}
                    />
                    <div className="h-2 w-full rounded bg-muted/50" style={{ borderRadius: getRadiusValue() }} />
                    <div className="h-2 w-3/4 rounded bg-muted/50" style={{ borderRadius: getRadiusValue() }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Sample */}
            <Card style={{ borderRadius: getRadiusValue() }}>
              <CardHeader style={{ padding: getSpacingValue() }}>
                <CardTitle style={{ fontFamily: `var(--font-${pendingSettings.fontFamily})` }}>
                  Typography Sample
                </CardTitle>
                <CardDescription>Preview of your selected font</CardDescription>
              </CardHeader>
              <CardContent style={{ padding: getSpacingValue() }}>
                <div className="space-y-3" style={{ gap: getSpacingValue() }}>
                  <p
                    className="text-sm"
                    style={{
                      fontFamily: `var(--font-${pendingSettings.fontFamily})`,
                      fontSize:
                        pendingSettings.fontSize === "small"
                          ? "14px"
                          : pendingSettings.fontSize === "medium"
                            ? "16px"
                            : "18px",
                    }}
                  >
                    The quick brown fox jumps over the lazy dog. This preview updates as you change settings.
                  </p>
                  <div className="flex gap-2" style={{ gap: getSpacingValue() }}>
                    <Button
                      size="sm"
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
              className="rounded-lg border bg-card p-4"
              style={{ borderRadius: getRadiusValue(), padding: getSpacingValue() }}
            >
              <h4 className="mb-3 text-sm font-semibold">Color Palette</h4>
              <div className="grid grid-cols-2 gap-3" style={{ gap: getSpacingValue() }}>
                <div>
                  <div
                    className="mb-2 h-12 w-full rounded"
                    style={{ backgroundColor: pendingSettings.primaryColor, borderRadius: getRadiusValue() }}
                  />
                  <p className="text-xs text-muted-foreground">Primary</p>
                </div>
                <div>
                  <div
                    className="mb-2 h-12 w-full rounded"
                    style={{ backgroundColor: pendingSettings.accentColor, borderRadius: getRadiusValue() }}
                  />
                  <p className="text-xs text-muted-foreground">Accent</p>
                </div>
              </div>
            </div>

            {/* Settings Summary */}
            <div
              className="rounded-lg border bg-card p-4"
              style={{ borderRadius: getRadiusValue(), padding: getSpacingValue() }}
            >
              <h4 className="mb-3 text-sm font-semibold">Current Settings</h4>
              <div className="space-y-2 text-sm" style={{ gap: getSpacingValue() }}>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Font:</span>
                  <span className="font-medium capitalize">{pendingSettings.fontFamily}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Size:</span>
                  <span className="font-medium capitalize">{pendingSettings.fontSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Spacing:</span>
                  <span className="font-medium capitalize">{pendingSettings.spacing}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Radius:</span>
                  <span className="font-medium capitalize">{pendingSettings.borderRadius}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sidebar:</span>
                  <span className="font-medium capitalize">{pendingSettings.sidebarPosition}</span>
                </div>
              </div>
            </div>

            {/* Spacing Example */}
            <div
              className="rounded-lg border bg-card p-4"
              style={{ borderRadius: getRadiusValue(), padding: getSpacingValue() }}
            >
              <h4 className="mb-3 text-sm font-semibold">Spacing Example</h4>
              <div className="space-y-2" style={{ gap: getSpacingValue() }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded bg-muted p-2"
                    style={{ borderRadius: getRadiusValue(), padding: getSpacingValue() }}
                  >
                    <div className="text-xs">Item {i}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
