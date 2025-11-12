/**
 * Settings preview panel
 * Live preview of settings changes
 */

"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, CheckSquare, Workflow, FileText, Bot, GripVertical } from "lucide-react"
import { getSpacingValue, getRadiusValue, getFontFaceWeight, type AppSettings } from "@/lib/settings"

interface SettingsPreviewProps {
  pendingSettings: AppSettings
  previewWidth: number
  setPreviewWidth: (width: number) => void
  isResizing: boolean
  setIsResizing: (resizing: boolean) => void
}

export function SettingsPreview({
  pendingSettings,
  previewWidth,
  setPreviewWidth,
  isResizing,
  setIsResizing,
}: SettingsPreviewProps) {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const dialogElement = document.querySelector('[role="dialog"]')
      if (!dialogElement) return
      const dialogRect = dialogElement.getBoundingClientRect()
      const newWidth = dialogRect.right - e.clientX
      setPreviewWidth(Math.max(330, Math.min(550, newWidth)))
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, setPreviewWidth, setIsResizing])

  const spacingValue = getSpacingValue(pendingSettings.spacing)
  const radiusValue = getRadiusValue(pendingSettings.borderRadius)
  const previewFontFamily =
    pendingSettings.fontFamily === "system"
      ? "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
      : `var(--font-${pendingSettings.fontFamily})`
  const previewFontWeight = getFontFaceWeight(pendingSettings.fontFace)

  return (
    <div
      className="relative hidden border-l bg-muted/30 lg:block"
      style={{ width: `${previewWidth}px`, minWidth: "330px", maxWidth: "550px" }}
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
          <div className="overflow-hidden rounded-lg border bg-background shadow-lg" style={{ borderRadius: radiusValue }}>
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
                      ? `${radiusValue} 0 0 ${radiusValue}`
                      : `0 ${radiusValue} ${radiusValue} 0`,
                }}
              >
                <div className="flex flex-col items-center gap-1.5 p-1.5" style={{ gap: spacingValue }}>
                  {[Home, CheckSquare, Workflow, FileText, Bot].map((Icon, i) => (
                    <div
                      key={i}
                      className="flex h-8 w-8 items-center justify-center rounded transition-colors hover:bg-white/10"
                      style={{
                        borderRadius: radiusValue,
                        backgroundColor: i === 0 ? "rgba(255,255,255,0.2)" : "transparent",
                      }}
                    >
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Content */}
              <div className="flex-1 p-2" style={{ padding: spacingValue }}>
                <div className="space-y-1.5" style={{ gap: spacingValue }}>
                  <div
                    className="h-3 w-20 rounded bg-muted"
                    style={{
                      borderRadius: radiusValue,
                      fontFamily: previewFontFamily,
                      fontWeight: previewFontWeight,
                    }}
                  />
                  <div className="h-1.5 w-full rounded bg-muted/50" style={{ borderRadius: radiusValue }} />
                  <div className="h-1.5 w-3/4 rounded bg-muted/50" style={{ borderRadius: radiusValue }} />
                </div>
              </div>
            </div>
          </div>

          {/* Typography Sample */}
          <Card style={{ borderRadius: radiusValue }}>
            <CardHeader className="pb-2 pt-3 px-3" style={{ padding: spacingValue }}>
              <CardTitle className="text-sm" style={{ fontFamily: previewFontFamily, fontWeight: previewFontWeight }}>
                Typography Sample
              </CardTitle>
              <CardDescription className="text-xs">Preview of your selected font</CardDescription>
            </CardHeader>
            <CardContent className="px-3 pb-3" style={{ padding: spacingValue }}>
              <div className="space-y-2" style={{ gap: spacingValue }}>
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    fontFamily: previewFontFamily,
                    fontWeight: previewFontWeight,
                    fontSize:
                      pendingSettings.fontSize === "small" ? "11px" : pendingSettings.fontSize === "medium" ? "12px" : "13px",
                  }}
                >
                  The quick brown fox jumps over the lazy dog. This preview updates as you change settings.
                </p>
                <div className="flex gap-1.5" style={{ gap: spacingValue }}>
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs"
                    style={{
                      backgroundColor: pendingSettings.primaryColor,
                      borderRadius: radiusValue,
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
                      borderRadius: radiusValue,
                    }}
                  >
                    Accent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Swatches */}
          <div className="rounded-lg border bg-card p-3" style={{ borderRadius: radiusValue, padding: spacingValue }}>
            <h4 className="mb-2 text-xs font-semibold">Color Palette</h4>
            <div className="grid grid-cols-2 gap-2" style={{ gap: spacingValue }}>
              <div>
                <div
                  className="mb-1.5 h-10 w-full rounded"
                  style={{ backgroundColor: pendingSettings.primaryColor, borderRadius: radiusValue }}
                />
                <p className="text-xs text-muted-foreground">Primary</p>
              </div>
              <div>
                <div
                  className="mb-1.5 h-10 w-full rounded"
                  style={{ backgroundColor: pendingSettings.accentColor, borderRadius: radiusValue }}
                />
                <p className="text-xs text-muted-foreground">Accent</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
