/**
 * Layout settings tab
 * Handles sidebar position and spacing settings
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { type AppSettings } from "@/lib/settings"

interface LayoutTabProps {
  pendingSettings: AppSettings
  updatePendingSettings: (settings: Partial<AppSettings>) => void
}

export function LayoutTab({ pendingSettings, updatePendingSettings }: LayoutTabProps) {
  return (
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
            onValueChange={(value) => updatePendingSettings({ sidebarPosition: value as AppSettings["sidebarPosition"] })}
            className="grid grid-cols-2 gap-2"
          >
            {(["left", "right"] as const).map((position) => (
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
                  <span className="text-xs font-dynamic capitalize">{position}</span>
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
            onValueChange={(value) => updatePendingSettings({ spacing: value as AppSettings["spacing"] })}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { value: "ultra-compact" as const, label: "Ultra Compact" },
              { value: "compact" as const, label: "Compact" },
              { value: "comfortable" as const, label: "Comfortable" },
            ].map((spacing) => (
              <div key={spacing.value}>
                <RadioGroupItem value={spacing.value} id={`spacing-${spacing.value}`} className="peer sr-only" />
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
                            spacing.value === "ultra-compact" ? "1px" : spacing.value === "compact" ? "2px" : "4px",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-dynamic text-center leading-tight">{spacing.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
