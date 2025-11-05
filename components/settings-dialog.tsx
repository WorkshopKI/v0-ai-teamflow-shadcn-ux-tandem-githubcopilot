"use client"

import { useState } from "react"
import { useSettings } from "@/lib/settings-context"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Palette, Type, Layout } from "lucide-react"
import { cn } from "@/lib/utils"

const fontPresets = [
  { id: "sans", name: "Sans Serif", description: "Inter" },
  { id: "serif", name: "Serif", description: "Lora" },
  { id: "mono", name: "Monospace", description: "JetBrains Mono" },
]

const colorPresets = [
  { name: "Professional Blue", primary: "#0a3874", accent: "#306bb3" },
  { name: "Forest Green", primary: "#1e5631", accent: "#4a9d5f" },
  { name: "Royal Purple", primary: "#5b21b6", accent: "#8b5cf6" },
  { name: "Sunset Orange", primary: "#c2410c", accent: "#f97316" },
  { name: "Deep Teal", primary: "#0f766e", accent: "#14b8a6" },
]

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { pendingSettings, updatePendingSettings, applySettings, resetSettings, hasChanges } = useSettings()
  const [activeSection, setActiveSection] = useState("appearance")

  const handleApply = () => {
    applySettings()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const sections = [
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "typography", label: "Typography", icon: Type },
    { id: "layout", label: "Layout", icon: Layout },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] max-w-[1400px] h-[85vh] p-0 gap-0 overflow-hidden">
        <DialogDescription className="sr-only">
          Customize your TeamFlow application appearance, typography, and layout settings
        </DialogDescription>
        <div className="flex h-full">
          {/* Left Sidebar Navigation */}
          <div className="w-64 border-r bg-muted/30 flex flex-col">
            {/* Navigation Items */}
            <nav className="flex-1 px-3 py-6">
              <div className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                        activeSection === section.id
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {section.label}
                    </button>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="px-8 py-6 border-b">
              <h2 className="text-2xl font-semibold">{sections.find((s) => s.id === activeSection)?.label}</h2>
            </div>

            {/* Settings Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="space-y-8">
                {/* Appearance Section */}
                {activeSection === "appearance" && (
                  <>
                    {/* Theme Mode */}
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Theme Mode</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                      </div>
                      <Select defaultValue="system">
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* ColorPreset */}
                    <div className="space-y-4">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Color Scheme</Label>
                        <p className="text-sm text-muted-foreground">Select a color preset for your interface</p>
                      </div>
                      <RadioGroup
                        value={pendingSettings.primaryColor}
                        onValueChange={(value) => {
                          const preset = colorPresets.find((p) => p.primary === value)
                          if (preset) {
                            updatePendingSettings({
                              primaryColor: preset.primary,
                              accentColor: preset.accent,
                            })
                          }
                        }}
                        className="grid gap-3"
                      >
                        {colorPresets.map((preset) => (
                          <div key={preset.name} className="flex items-center space-x-3">
                            <RadioGroupItem value={preset.primary} id={preset.name} />
                            <Label
                              htmlFor={preset.name}
                              className="flex items-center gap-3 cursor-pointer flex-1 font-normal"
                            >
                              <div className="flex gap-1.5">
                                <div className="h-6 w-6 rounded border" style={{ backgroundColor: preset.primary }} />
                                <div className="h-6 w-6 rounded border" style={{ backgroundColor: preset.accent }} />
                              </div>
                              <span>{preset.name}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* Custom Colors */}
                    <div className="space-y-4">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Custom Colors</Label>
                        <p className="text-sm text-muted-foreground">Fine-tune your color palette</p>
                      </div>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="primary-color" className="text-sm font-normal">
                            Primary Color
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="primary-color"
                              type="color"
                              value={pendingSettings.primaryColor}
                              onChange={(e) => updatePendingSettings({ primaryColor: e.target.value })}
                              className="h-10 w-16 cursor-pointer p-1 flex-shrink-0"
                            />
                            <Input
                              type="text"
                              value={pendingSettings.primaryColor}
                              onChange={(e) => updatePendingSettings({ primaryColor: e.target.value })}
                              className="flex-1 font-mono text-sm min-w-[120px]"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accent-color" className="text-sm font-normal">
                            Accent Color
                          </Label>
                          <div className="flex gap-2">
                            <Input
                              id="accent-color"
                              type="color"
                              value={pendingSettings.accentColor}
                              onChange={(e) => updatePendingSettings({ accentColor: e.target.value })}
                              className="h-10 w-16 cursor-pointer p-1 flex-shrink-0"
                            />
                            <Input
                              type="text"
                              value={pendingSettings.accentColor}
                              onChange={(e) => updatePendingSettings({ accentColor: e.target.value })}
                              className="flex-1 font-mono text-sm min-w-[120px]"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Border Radius */}
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Border Radius</Label>
                        <p className="text-sm text-muted-foreground">Adjust corner roundness</p>
                      </div>
                      <Select
                        value={pendingSettings.borderRadius}
                        onValueChange={(value: any) => updatePendingSettings({ borderRadius: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Typography Section */}
                {activeSection === "typography" && (
                  <>
                    {/* Font Family */}
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Font Family</Label>
                        <p className="text-sm text-muted-foreground">Choose your preferred typeface</p>
                      </div>
                      <Select
                        value={pendingSettings.fontFamily}
                        onValueChange={(value: any) => updatePendingSettings({ fontFamily: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontPresets.map((font) => (
                            <SelectItem key={font.id} value={font.id}>
                              {font.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Font Size */}
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Font Size</Label>
                        <p className="text-sm text-muted-foreground">Adjust text size for readability</p>
                      </div>
                      <Select
                        value={pendingSettings.fontSize}
                        onValueChange={(value: any) => updatePendingSettings({ fontSize: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Typography Preview */}
                    <div className="space-y-4">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Preview</Label>
                        <p className="text-sm text-muted-foreground">See how your text will look</p>
                      </div>
                      <div
                        className="rounded-lg border bg-muted/30 p-6 space-y-3"
                        style={{ fontFamily: `var(--font-${pendingSettings.fontFamily})` }}
                      >
                        <h3
                          className="text-2xl font-semibold"
                          style={{
                            fontSize:
                              pendingSettings.fontSize === "small"
                                ? "20px"
                                : pendingSettings.fontSize === "medium"
                                  ? "24px"
                                  : "28px",
                          }}
                        >
                          The quick brown fox
                        </h3>
                        <p
                          className="text-muted-foreground"
                          style={{
                            fontSize:
                              pendingSettings.fontSize === "small"
                                ? "14px"
                                : pendingSettings.fontSize === "medium"
                                  ? "16px"
                                  : "18px",
                          }}
                        >
                          jumps over the lazy dog. This is a preview of how your selected typography settings will
                          appear throughout the application.
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Layout Section */}
                {activeSection === "layout" && (
                  <>
                    {/* Sidebar Position */}
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Sidebar Position</Label>
                        <p className="text-sm text-muted-foreground">Choose where the sidebar appears</p>
                      </div>
                      <Select
                        value={pendingSettings.sidebarPosition}
                        onValueChange={(value: any) => updatePendingSettings({ sidebarPosition: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Space Density */}
                    <div className="flex items-center justify-between py-3">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Space Density</Label>
                        <p className="text-sm text-muted-foreground">Control spacing between elements</p>
                      </div>
                      <Select
                        value={pendingSettings.spacing}
                        onValueChange={(value: any) => updatePendingSettings({ spacing: value })}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ultra-compact">Ultra Compact</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="comfortable">Comfortable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Layout Preview */}
                    <div className="space-y-4">
                      <div className="space-y-0.5">
                        <Label className="text-base font-normal">Preview</Label>
                        <p className="text-sm text-muted-foreground">See how your layout will look</p>
                      </div>
                      <div className="rounded-lg border bg-muted/30 p-4">
                        <div
                          className="flex gap-2 rounded-lg border bg-background overflow-hidden"
                          style={{
                            flexDirection: pendingSettings.sidebarPosition === "right" ? "row-reverse" : "row",
                          }}
                        >
                          {/* Mini Sidebar */}
                          <div
                            className="w-12 flex flex-col items-center gap-1 py-2"
                            style={{
                              backgroundColor: pendingSettings.primaryColor,
                              gap:
                                pendingSettings.spacing === "ultra-compact"
                                  ? "0.125rem"
                                  : pendingSettings.spacing === "compact"
                                    ? "0.25rem"
                                    : "0.5rem",
                            }}
                          >
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="h-8 w-8 rounded bg-white/20"
                                style={{
                                  backgroundColor: i === 1 ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                                }}
                              />
                            ))}
                          </div>
                          {/* Mini Content */}
                          <div
                            className="flex-1 p-3 space-y-2"
                            style={{
                              gap:
                                pendingSettings.spacing === "ultra-compact"
                                  ? "0.125rem"
                                  : pendingSettings.spacing === "compact"
                                    ? "0.25rem"
                                    : "0.5rem",
                            }}
                          >
                            <div className="h-3 w-24 bg-muted rounded" />
                            <div className="h-2 w-full bg-muted/50 rounded" />
                            <div className="h-2 w-3/4 bg-muted/50 rounded" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer with Action Buttons */}
            <div className="border-t px-8 py-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {hasChanges && (
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      Unsaved changes
                    </span>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetSettings}>
                    Reset to Defaults
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={!hasChanges}
                    style={{
                      backgroundColor: hasChanges ? pendingSettings.primaryColor : undefined,
                    }}
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
