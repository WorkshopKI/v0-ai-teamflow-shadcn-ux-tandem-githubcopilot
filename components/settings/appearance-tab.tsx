/**
 * Appearance settings tab
 * Handles color themes and border radius settings
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import { colorPresets, getRadiusValue, type AppSettings } from "@/lib/settings"

interface AppearanceTabProps {
  pendingSettings: AppSettings
  updatePendingSettings: (settings: Partial<AppSettings>) => void
}

export function AppearanceTab({ pendingSettings, updatePendingSettings }: AppearanceTabProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Color Theme</CardTitle>
        <CardDescription className="text-xs">Choose a color scheme that matches your style</CardDescription>
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
                    <div className="text-sm font-dynamic">{preset.name}</div>
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
            onValueChange={(value) => updatePendingSettings({ borderRadius: value as AppSettings["borderRadius"] })}
            className="grid grid-cols-4 gap-2"
          >
            {(["none", "small", "medium", "large"] as const).map((radius) => (
              <div key={radius}>
                <RadioGroupItem value={radius} id={`radius-${radius}`} className="peer sr-only" />
                <Label
                  htmlFor={`radius-${radius}`}
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  <div
                    className="mb-1.5 h-10 w-10 border-2 bg-primary/10"
                    style={{ borderRadius: getRadiusValue(radius) }}
                  />
                  <span className="text-xs font-dynamic capitalize">{radius}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
