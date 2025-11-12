/**
 * Typography settings tab
 * Handles font family and size settings
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { fontPresets, fontFacePresets, type AppSettings } from "@/lib/settings"

interface TypographyTabProps {
  pendingSettings: AppSettings
  updatePendingSettings: (settings: Partial<AppSettings>) => void
}

export function TypographyTab({ pendingSettings, updatePendingSettings }: TypographyTabProps) {
  const activeFontFamily =
    pendingSettings.fontFamily === "system"
      ? "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      : `var(--font-${pendingSettings.fontFamily})`

  return (
    <Card>
      <CardHeader className="pb-1.5">
        <CardTitle className="text-lg">Font Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Font Family */}
        <div className="space-y-1.5">
          <Label className="text-sm">Font Family</Label>
          <RadioGroup
            value={pendingSettings.fontFamily}
            onValueChange={(value) => updatePendingSettings({ fontFamily: value as AppSettings["fontFamily"] })}
            className="grid gap-1"
          >
            {fontPresets.map((font) => (
              <div key={font.id}>
                <RadioGroupItem value={font.id} id={`font-${font.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`font-${font.id}`}
                  className="flex cursor-pointer items-center justify-between rounded-lg border border-muted bg-popover px-3 py-1.5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary transition-colors"
                >
                  <div className="space-y-0">
                    <div className="text-sm font-dynamic">{font.name}</div>
                    <div className="text-xs text-muted-foreground">{font.description}</div>
                  </div>
                  <div 
                    className="text-base font-dynamic" 
                    style={{ fontFamily: font.id === "system" ? "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" : `var(--font-${font.id})` }}
                  >
                    Aa
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
            onValueChange={(value) => updatePendingSettings({ fontSize: value as AppSettings["fontSize"] })}
            className="grid grid-cols-3 gap-1.5 text-sm"
          >
            {(["small", "medium", "large"] as const).map((size) => (
              <div key={size}>
                <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                <Label
                  htmlFor={`size-${size}`}
                  className="flex cursor-pointer flex-col items-center gap-0.5 rounded-md border border-muted bg-popover px-2 py-1.5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <span
                    className="font-dynamic"
                    style={{
                      fontSize: size === "small" ? "14px" : size === "medium" ? "16px" : "18px",
                    }}
                  >
                    Aa
                  </span>
                  <span className="text-[0.65rem] uppercase tracking-wide">{size}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Font Face */}
        <div className="space-y-2">
          <Label className="text-sm">Font Face</Label>
          <RadioGroup
            value={pendingSettings.fontFace}
            onValueChange={(value) => updatePendingSettings({ fontFace: value as AppSettings["fontFace"] })}
            className="grid grid-cols-4 gap-1.5 text-xs"
          >
            {fontFacePresets.map((face) => (
              <div key={face.id}>
                <RadioGroupItem value={face.id} id={`face-${face.id}`} className="peer sr-only" />
                <Label
                  htmlFor={`face-${face.id}`}
                  className="flex cursor-pointer flex-col items-center gap-0.5 rounded-md border border-muted bg-popover px-2 py-1.5 text-xs font-dynamic hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary"
                >
                  <div className="flex w-full items-baseline justify-center gap-1">
                    <span>{face.name}</span>
                    <span className="text-[0.6rem] text-muted-foreground">{face.weight}</span>
                  </div>
                  <span className="text-base" style={{ fontWeight: face.weight, fontFamily: activeFontFamily }}>
                    Aa
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
