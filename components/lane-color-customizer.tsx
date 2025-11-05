"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { Palette, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LaneColors {
  bg: string
  border: string
  accent: string
  header: string
  text: string
}

interface ColorScheme {
  todo: LaneColors
  progress: LaneColors
  completed: LaneColors
  blocked: LaneColors
}

interface ColorPreset {
  name: string
  description: string
  light: ColorScheme
  dark: ColorScheme
}

const colorPresets: ColorPreset[] = [
  {
    name: "Default",
    description: "Soft, muted tones for reduced visual fatigue",
    light: {
      todo: { bg: "#f5f7fa", border: "#d4dce6", accent: "#6b8cae", header: "#ebeef3", text: "#3d4f5f" },
      progress: { bg: "#faf6f0", border: "#e8dcc8", accent: "#c89b6f", header: "#f5ede1", text: "#6b5842" },
      completed: { bg: "#f2f8f5", border: "#d0e5db", accent: "#7db89a", header: "#e6f2ec", text: "#3d5f4e" },
      blocked: { bg: "#faf4f5", border: "#e8d5d9", accent: "#c88a95", header: "#f5e9ec", text: "#6b4449" },
    },
    dark: {
      todo: { bg: "#1a2332", border: "#2d3a4d", accent: "#7a9bc4", header: "#131b28", text: "#c5d4e6" },
      progress: { bg: "#2a2318", border: "#4a3d2a", accent: "#d4a574", header: "#1a1510", text: "#e8dcc8" },
      completed: { bg: "#1a2d24", border: "#2d4a3a", accent: "#8bc4a6", header: "#12201a", text: "#d0e5db" },
      blocked: { bg: "#2d1a1f", border: "#4a2d34", accent: "#d49aa5", header: "#1f1216", text: "#e8d5d9" },
    },
  },
  {
    name: "Ocean",
    description: "Cool blues and teals for a calm, professional look",
    light: {
      todo: { bg: "#f0f4f8", border: "#d0dce8", accent: "#5b8fb9", header: "#e6ecf2", text: "#2d4a5f" },
      progress: { bg: "#f0f8fa", border: "#d0e8ed", accent: "#5ba3b9", header: "#e6f2f5", text: "#2d5a5f" },
      completed: { bg: "#f0faf8", border: "#d0ede8", accent: "#5bb9a3", header: "#e6f5f2", text: "#2d5f5a" },
      blocked: { bg: "#f8f4f6", border: "#e8dce2", accent: "#b97b8f", header: "#f2ece6", text: "#5f3d49" },
    },
    dark: {
      todo: { bg: "#1a2832", border: "#2d3f4d", accent: "#6b9fc4", header: "#131f28", text: "#c5d9e6" },
      progress: { bg: "#1a3238", border: "#2d4d54", accent: "#6bb3c4", header: "#132328", text: "#c5e6ed" },
      completed: { bg: "#1a3832", border: "#2d544d", accent: "#6bc4b3", header: "#132d28", text: "#c5ede6" },
      blocked: { bg: "#321a28", border: "#4d2d3f", accent: "#c46b9f", header: "#231318", text: "#edc5d9" },
    },
  },
  {
    name: "Forest",
    description: "Earthy greens and browns for a natural feel",
    light: {
      todo: { bg: "#f5f7f4", border: "#dce6d4", accent: "#7a9b6b", header: "#ecf2e6", text: "#3d5f2d" },
      progress: { bg: "#faf8f0", border: "#ede8d0", accent: "#b9a35b", header: "#f5f2e6", text: "#5f5a2d" },
      completed: { bg: "#f4faf0", border: "#d8edd0", accent: "#6bb95b", header: "#e9f5e6", text: "#2d5f2d" },
      blocked: { bg: "#faf4f0", border: "#ede8d0", accent: "#b9835b", header: "#f5efe6", text: "#5f4a2d" },
    },
    dark: {
      todo: { bg: "#1f2d1a", border: "#3a4d2d", accent: "#8ab36b", header: "#172318", text: "#d4e6c5" },
      progress: { bg: "#2d281a", border: "#4d442d", accent: "#c4b36b", header: "#231f13", text: "#e6e0c5" },
      completed: { bg: "#1a2d1f", border: "#2d4d3a", accent: "#6bc48a", header: "#132317", text: "#c5e6d4" },
      blocked: { bg: "#2d1f1a", border: "#4d3a2d", accent: "#c4936b", header: "#231713", text: "#e6d4c5" },
    },
  },
  {
    name: "Sunset",
    description: "Warm oranges and purples for vibrant energy",
    light: {
      todo: { bg: "#f8f5f7", border: "#e8dce6", accent: "#9b7ba3", header: "#f2ecf0", text: "#5f3d5a" },
      progress: { bg: "#faf6f0", border: "#ede0d0", accent: "#c49b5b", header: "#f5f0e6", text: "#5f4a2d" },
      completed: { bg: "#f0faf5", border: "#d0ede0", accent: "#5bb98a", header: "#e6f5ef", text: "#2d5f4a" },
      blocked: { bg: "#faf4f0", border: "#edd8d0", accent: "#c4735b", header: "#f5ebe6", text: "#5f3a2d" },
    },
    dark: {
      todo: { bg: "#2d1a32", border: "#4d2d4d", accent: "#ab8bb3", header: "#23131f", text: "#e6c5ed" },
      progress: { bg: "#322d1a", border: "#544d2d", accent: "#d4ab6b", header: "#282313", text: "#ede0c5" },
      completed: { bg: "#1a322d", border: "#2d544d", accent: "#6bc49a", header: "#13281f", text: "#c5ede0" },
      blocked: { bg: "#321f1a", border: "#543a2d", accent: "#d4836b", header: "#281713", text: "#edc5b8" },
    },
  },
  {
    name: "Monochrome",
    description: "Grayscale palette for minimal distraction",
    light: {
      todo: { bg: "#f8f9fa", border: "#dee2e6", accent: "#6c757d", header: "#f1f3f5", text: "#495057" },
      progress: { bg: "#f6f7f8", border: "#dce0e4", accent: "#868e96", header: "#eff1f3", text: "#343a40" },
      completed: { bg: "#f4f6f8", border: "#d8dde2", accent: "#495057", header: "#edf0f3", text: "#212529" },
      blocked: { bg: "#faf8f8", border: "#e8e4e4", accent: "#adb5bd", header: "#f5f3f3", text: "#6c757d" },
    },
    dark: {
      todo: { bg: "#212529", border: "#343a40", accent: "#adb5bd", header: "#1a1d20", text: "#dee2e6" },
      progress: { bg: "#1f2326", border: "#323639", accent: "#ced4da", header: "#181b1d", text: "#e9ecef" },
      completed: { bg: "#1d2428", border: "#303538", accent: "#f8f9fa", header: "#161a1d", text: "#f1f3f5" },
      blocked: { bg: "#282326", border: "#3a3639", accent: "#868e96", header: "#1f1b1d", text: "#ced4da" },
    },
  },
]

const quickColorPresets = {
  bg: ["#f5f7fa", "#faf6f0", "#f2f8f5"],
  border: ["#d4dce6", "#e8dcc8", "#d0e5db"],
  accent: ["#6b8cae", "#c89b6f", "#7db89a"],
  header: ["#ebeef3", "#f5ede1", "#e6f2ec"],
  text: ["#3d4f5f", "#6b5842", "#3d5f4e"],
}

const defaultLightColors: ColorScheme = colorPresets[0].light
const defaultDarkColors: ColorScheme = colorPresets[0].dark

export function LaneColorCustomizer({ iconOnly = false }: { iconOnly?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [lightColors, setLightColors] = useState<ColorScheme>(defaultLightColors)
  const [darkColors, setDarkColors] = useState<ColorScheme>(defaultDarkColors)
  const [activeTab, setActiveTab] = useState<"light" | "dark">("light")
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const detectTheme = () => {
      const isDark = document.documentElement.classList.contains("dark")
      const theme = isDark ? "dark" : "light"
      setCurrentTheme(theme)
      setActiveTab(theme)
      return theme
    }

    const initialTheme = detectTheme()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const newTheme = detectTheme()
          const colors = newTheme === "dark" ? darkColors : lightColors
          applyColors(colors, newTheme)
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        detectTheme()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      observer.disconnect()
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [darkColors, lightColors])

  useEffect(() => {
    const savedLightColors = localStorage.getItem("kanban-light-colors")
    const savedDarkColors = localStorage.getItem("kanban-dark-colors")

    if (savedLightColors) {
      const parsed = JSON.parse(savedLightColors)
      setLightColors(parsed)
      if (currentTheme === "light") {
        applyColors(parsed, "light")
      }
    }

    if (savedDarkColors) {
      const parsed = JSON.parse(savedDarkColors)
      setDarkColors(parsed)
      if (currentTheme === "dark") {
        applyColors(parsed, "dark")
      }
    }
  }, [currentTheme])

  const applyColors = (colors: ColorScheme, mode: "light" | "dark") => {
    const root = document.documentElement
    const isDark = mode === "dark"

    Object.entries(colors).forEach(([lane, laneColors]) => {
      const prefix = lane === "progress" ? "progress" : lane
      Object.entries(laneColors).forEach(([property, value]) => {
        const varName = `--lane-${prefix}-${property}`
        if (isDark) {
          root.style.setProperty(`${varName}-dark`, value)
        } else {
          root.style.setProperty(varName, value)
        }
      })
    })

    if (isDark && root.classList.contains("dark")) {
      Object.entries(colors).forEach(([lane, laneColors]) => {
        const prefix = lane === "progress" ? "progress" : lane
        Object.entries(laneColors).forEach(([property, value]) => {
          const varName = `--lane-${prefix}-${property}`
          root.style.setProperty(varName, value)
        })
      })
    } else if (!isDark && !root.classList.contains("dark")) {
      Object.entries(colors).forEach(([lane, laneColors]) => {
        const prefix = lane === "progress" ? "progress" : lane
        Object.entries(laneColors).forEach(([property, value]) => {
          const varName = `--lane-${prefix}-${property}`
          root.style.setProperty(varName, value)
        })
      })
    }
  }

  const handleColorChange = (lane: keyof ColorScheme, property: keyof LaneColors, value: string) => {
    const colors = activeTab === "light" ? lightColors : darkColors
    const setColors = activeTab === "light" ? setLightColors : setDarkColors

    const newColors = {
      ...colors,
      [lane]: {
        ...colors[lane],
        [property]: value,
      },
    }

    setColors(newColors)
    applyColors(newColors, activeTab)
  }

  const handleApplyPreset = (preset: ColorPreset) => {
    setLightColors(preset.light)
    setDarkColors(preset.dark)
    applyColors(preset.light, "light")
    applyColors(preset.dark, "dark")
    const currentColors = currentTheme === "dark" ? preset.dark : preset.light
    applyColors(currentColors, currentTheme)
  }

  const handleSave = () => {
    localStorage.setItem("kanban-light-colors", JSON.stringify(lightColors))
    localStorage.setItem("kanban-dark-colors", JSON.stringify(darkColors))
    setIsOpen(false)
  }

  const handleReset = () => {
    const defaults = activeTab === "light" ? defaultLightColors : defaultDarkColors
    const setColors = activeTab === "light" ? setLightColors : setDarkColors

    setColors(defaults)
    applyColors(defaults, activeTab)
    localStorage.removeItem(`kanban-${activeTab}-colors`)
  }

  const ColorPicker = ({
    label,
    value,
    onChange,
    presets,
  }: {
    label: string
    value: string
    onChange: (value: string) => void
    presets?: string[]
  }) => (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-16 rounded border border-border cursor-pointer"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-xs h-8"
          placeholder="#000000"
        />
      </div>
      {presets && presets.length > 0 && (
        <div className="flex gap-1.5">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => onChange(preset)}
              className="h-6 w-6 rounded border border-border hover:border-primary hover:scale-110 transition-all cursor-pointer"
              style={{ backgroundColor: preset }}
              title={`Preset ${index + 1}: ${preset}`}
            />
          ))}
        </div>
      )}
    </div>
  )

  const LaneColorSection = ({ lane, label }: { lane: keyof ColorScheme; label: string }) => {
    const colors = activeTab === "light" ? lightColors : darkColors

    return (
      <div className="space-y-3 p-3 rounded-lg border bg-card/50">
        <h4 className="font-semibold text-xs uppercase tracking-wide text-muted-foreground">{label}</h4>
        <div className="grid gap-3">
          <ColorPicker
            label="Background"
            value={colors[lane].bg}
            onChange={(value) => handleColorChange(lane, "bg", value)}
            presets={quickColorPresets.bg}
          />
          <ColorPicker
            label="Border"
            value={colors[lane].border}
            onChange={(value) => handleColorChange(lane, "border", value)}
            presets={quickColorPresets.border}
          />
          <ColorPicker
            label="Accent"
            value={colors[lane].accent}
            onChange={(value) => handleColorChange(lane, "accent", value)}
            presets={quickColorPresets.accent}
          />
          <ColorPicker
            label="Header Background"
            value={colors[lane].header}
            onChange={(value) => handleColorChange(lane, "header", value)}
            presets={quickColorPresets.header}
          />
          <ColorPicker
            label="Text Color"
            value={colors[lane].text}
            onChange={(value) => handleColorChange(lane, "text", value)}
            presets={quickColorPresets.text}
          />
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {iconOnly ? (
          <Button variant="outline" size="icon" className="shrink-0 bg-transparent" title="Customize lane colors">
            <Palette className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="outline" className="w-full sm:w-auto bg-transparent">
            <Palette className="h-4 w-4 mr-2" />
            Customize Colors
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Customize Lane Colors</DialogTitle>
          <DialogDescription>
            Choose a preset or personalize colors for each workflow state. Changes apply instantly and persist across
            sessions.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="font-semibold text-sm">Color Scheme Presets</h3>
              </div>
              <p className="text-xs text-muted-foreground">Quickly apply a harmonized color palette to all lanes</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {colorPresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handleApplyPreset(preset)}
                    className="p-3 rounded-lg border-2 border-border hover:border-primary transition-all hover:shadow-md text-left group bg-card"
                  >
                    <div className="flex gap-1 mb-2">
                      {Object.values(currentTheme === "light" ? preset.light : preset.dark).map((colors, index) => (
                        <div
                          key={index}
                          className="h-5 flex-1 rounded-sm border border-border/50"
                          style={{ backgroundColor: colors.accent }}
                        />
                      ))}
                    </div>
                    <div className="font-semibold text-xs group-hover:text-primary transition-colors">
                      {preset.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                      {preset.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "light" | "dark")} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="light">Light Mode</TabsTrigger>
                  <TabsTrigger value="dark">Dark Mode</TabsTrigger>
                </TabsList>

                <TabsContent value="light" className="space-y-3 mt-0">
                  <div className="grid gap-3 md:grid-cols-2">
                    <LaneColorSection lane="todo" label="To Do Lane" />
                    <LaneColorSection lane="progress" label="In Progress Lane" />
                    <LaneColorSection lane="completed" label="Completed Lane" />
                    <LaneColorSection lane="blocked" label="Blocked Lane" />
                  </div>
                </TabsContent>

                <TabsContent value="dark" className="space-y-3 mt-0">
                  <div className="grid gap-3 md:grid-cols-2">
                    <LaneColorSection lane="todo" label="To Do Lane" />
                    <LaneColorSection lane="progress" label="In Progress Lane" />
                    <LaneColorSection lane="completed" label="Completed Lane" />
                    <LaneColorSection lane="blocked" label="Blocked Lane" />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex-col sm:flex-row gap-2 px-6 py-4 border-t bg-muted/30">
          <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto bg-transparent">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <div className="flex gap-2 w-full sm:w-auto sm:ml-auto">
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 sm:flex-none">
              Save Changes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
