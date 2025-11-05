"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CheckSquare,
  Workflow,
  Bot,
  FileText,
  Settings,
  Users,
  PanelLeftClose,
  PanelLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  Monitor,
  Megaphone,
  ClipboardList,
  Building2,
  Sparkles,
  ArrowLeft,
  Pencil,
  Check,
  X,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { SettingsDialog } from "@/components/settings-dialog"

const teamNavigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    name: "AI Agents",
    href: "/agents",
    icon: Bot,
  },
]

const teamTemplates = [
  {
    id: "agile",
    name: "Agile Software Team",
    description:
      "Perfect for development teams using Agile methodologies with sprint planning and code review workflows",
    icon: Monitor,
    iconColor: "text-blue-500",
  },
  {
    id: "marketing",
    name: "Marketing Team",
    description: "Organize campaigns, content calendars, and creative workflows with AI-powered copywriting assistance",
    icon: Megaphone,
    iconColor: "text-pink-500",
  },
  {
    id: "blank",
    name: "General / Blank",
    description: "Start from scratch with a minimal setup - perfect for any team or workflow",
    icon: ClipboardList,
    iconColor: "text-gray-500",
  },
  {
    id: "government",
    name: "Government Processing",
    description: "For processing citizen and business applications with 10 specialized AI assistants",
    icon: Building2,
    iconColor: "text-purple-500",
  },
]

interface Team {
  id: string
  name: string
  template: string
}

export function AppSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTeamExpanded, setIsTeamExpanded] = useState(true)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)

  const [sidebarWidth, setSidebarWidth] = useState(256) // Default 256px (w-64)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const [teams, setTeams] = useState<Team[]>([{ id: "default", name: "My Team", template: "blank" }])
  const [activeTeamId, setActiveTeamId] = useState<string>("default")
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editingTeamName, setEditingTeamName] = useState<string>("")

  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set(["default"]))

  const activeTeam = teams.find((team) => team.id === activeTeamId)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const newWidth = e.clientX
      const minWidth = 200
      const maxWidth = 400

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSidebarWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
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
  }, [isResizing])

  useEffect(() => {
    const savedTeams = localStorage.getItem("teams")
    const savedActiveTeamId = localStorage.getItem("activeTeamId")

    if (savedTeams) {
      try {
        const parsedTeams = JSON.parse(savedTeams)
        if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
          setTeams(parsedTeams)

          // Set active team ID if it exists in saved teams
          if (savedActiveTeamId && parsedTeams.some((team: Team) => team.id === savedActiveTeamId)) {
            setActiveTeamId(savedActiveTeamId)
          } else {
            // Default to first team if saved active team doesn't exist
            setActiveTeamId(parsedTeams[0].id)
          }
        }
      } catch (error) {
        console.error("[v0] Failed to load teams from localStorage:", error)
        // Keep default initialization if parsing fails
      }
    }
  }, [])

  useEffect(() => {
    if (teams.length > 0) {
      localStorage.setItem("teams", JSON.stringify(teams))
    }
  }, [teams])

  useEffect(() => {
    if (activeTeamId) {
      localStorage.setItem("activeTeamId", activeTeamId)
    }
  }, [activeTeamId])

  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth")
    if (savedWidth) {
      const width = Number.parseInt(savedWidth, 10)
      if (width >= 200 && width <= 400) {
        setSidebarWidth(width)
      }
    }
  }, [])

  useEffect(() => {
    if (!isCollapsed) {
      localStorage.setItem("sidebarWidth", sidebarWidth.toString())
    }
  }, [sidebarWidth, isCollapsed])

  const handleCreateWorkspace = () => {
    if (selectedTemplate) {
      const templateData = teamTemplates.find((t) => t.id === selectedTemplate)
      const baseName = templateData?.name || "New Team"

      // Find existing teams with similar names to generate unique name
      const existingTeamsWithSameName = teams.filter(
        (team) => team.name === baseName || team.name.startsWith(`${baseName} `),
      )

      let uniqueName = baseName
      if (existingTeamsWithSameName.length > 0) {
        // Find the highest number suffix
        const numbers = existingTeamsWithSameName.map((team) => {
          const match = team.name.match(new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s+(\\d+)$`))
          return match ? Number.parseInt(match[1], 10) : 1
        })
        const maxNumber = Math.max(...numbers)
        uniqueName = `${baseName} ${maxNumber + 1}`
      }

      const newTeam: Team = {
        id: `team-${Date.now()}`,
        name: uniqueName,
        template: selectedTemplate,
      }

      const updatedTeams = [...teams, newTeam]
      setTeams(updatedTeams)
      setActiveTeamId(newTeam.id)
      setIsTemplateDialogOpen(false)
      setSelectedTemplate(null)

      console.log("[v0] Created new team:", newTeam)
      console.log("[v0] Updated teams list:", updatedTeams)
      console.log("[v0] New team will have full navigation hierarchy:", teamNavigation)
    }
  }

  const handleStartRename = (teamId: string, currentName: string) => {
    setEditingTeamId(teamId)
    setEditingTeamName(currentName)
  }

  const handleSaveRename = () => {
    if (editingTeamId && editingTeamName.trim()) {
      setTeams(teams.map((team) => (team.id === editingTeamId ? { ...team, name: editingTeamName.trim() } : team)))
      setEditingTeamId(null)
      setEditingTeamName("")
    }
  }

  const handleCancelRename = () => {
    setEditingTeamId(null)
    setEditingTeamName("")
  }

  const toggleTeamExpansion = (teamId: string) => {
    setExpandedTeams((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(teamId)) {
        newSet.delete(teamId)
      } else {
        newSet.add(teamId)
      }
      return newSet
    })
  }

  const handleSetActiveTeam = (teamId: string) => {
    setActiveTeamId(teamId)
    setExpandedTeams((prev) => new Set(prev).add(teamId))
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300 relative",
        )}
        style={{
          width: isCollapsed ? "64px" : `${sidebarWidth}px`,
        }}
      >
        {!isCollapsed && (
          <div
            className={cn(
              "absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-50",
              isResizing && "bg-primary",
            )}
            onMouseDown={(e) => {
              e.preventDefault()
              setIsResizing(true)
            }}
            title="Drag to resize sidebar"
          />
        )}

        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
          {!isCollapsed && (
            <Link href="/welcome" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Users className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">TeamFlow</span>
                <span className="text-xs text-sidebar-foreground/60">{""}</span>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/welcome" className="flex items-center justify-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
                <Users className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
            </Link>
          )}
          <div className={cn("flex items-center gap-1", isCollapsed && "ml-auto")}>
            {!isCollapsed && <ThemeToggle />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "relative h-10 w-10 shrink-0 transition-all duration-200",
                "hover:bg-sidebar-accent hover:scale-110",
                "active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-sidebar-primary focus-visible:ring-offset-2",
                "z-10 cursor-pointer",
              )}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              style={{ pointerEvents: "auto" }}
            >
              {isCollapsed ? (
                <PanelLeft className="h-[18px] w-[18px] transition-transform duration-200" />
              ) : (
                <PanelLeftClose className="h-[18px] w-[18px] transition-transform duration-200" />
              )}
            </Button>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          <Collapsible open={isTeamExpanded} onOpenChange={setIsTeamExpanded}>
            <div className="flex items-center justify-between">
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                  title={isCollapsed ? "Team" : undefined}
                >
                  <Users className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">Teams</span>
                      {isTeamExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      )}
                    </>
                  )}
                </button>
              </CollapsibleTrigger>
              {!isCollapsed && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 shrink-0"
                  onClick={() => setIsTemplateDialogOpen(true)}
                  title="Add new team"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <CollapsibleContent className="space-y-1">
              {!isCollapsed && (
                <>
                  <div className="ml-4 space-y-2 border-l border-sidebar-border pl-4">
                    {teams.map((team) => (
                      <div key={team.id} className="space-y-1">
                        {/* Team header with expand/collapse and rename */}
                        <div
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors group",
                            activeTeamId === team.id
                              ? "bg-sidebar-accent text-sidebar-foreground"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                          )}
                        >
                          {editingTeamId === team.id ? (
                            <>
                              <Input
                                value={editingTeamName}
                                onChange={(e) => setEditingTeamName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleSaveRename()
                                  if (e.key === "Escape") handleCancelRename()
                                }}
                                onBlur={handleSaveRename}
                                className="h-7 flex-1 text-sm"
                                autoFocus
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={handleSaveRename}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={handleCancelRename}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => toggleTeamExpansion(team.id)}
                                className="shrink-0"
                                title={expandedTeams.has(team.id) ? "Collapse team" : "Expand team"}
                              >
                                {expandedTeams.has(team.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleSetActiveTeam(team.id)}
                                className="flex-1 text-left font-medium"
                              >
                                {team.name}
                              </button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleStartRename(team.id, team.name)}
                                title="Rename team"
                              >
                                <Pencil className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>

                        {/* Nested navigation hierarchy for this team */}
                        {expandedTeams.has(team.id) && (
                          <div className="ml-6 space-y-1 border-l border-sidebar-border pl-4">
                            {teamNavigation.map((item) => {
                              const isActive = activeTeamId === team.id && pathname === item.href
                              return (
                                <Link
                                  key={item.name}
                                  href={item.href}
                                  onClick={() => handleSetActiveTeam(team.id)}
                                  className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                                  )}
                                >
                                  <item.icon className="h-4 w-4 shrink-0" />
                                  {item.name}
                                </Link>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CollapsibleContent>
          </Collapsible>
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={() => setIsSettingsDialogOpen(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            title={isCollapsed ? "Settings" : undefined}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!isCollapsed && "Settings"}
          </button>
          {!isCollapsed && (
            <div className="mt-4 rounded-lg bg-sidebar-accent p-3">
              <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
                <div className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <span>Local mode active</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="h-1 w-16 bg-primary" />
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="h-1 w-16 bg-muted" />
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted text-muted-foreground font-semibold">
              3
            </div>
          </div>

          <DialogHeader>
            <DialogTitle className="text-3xl">Choose a Template</DialogTitle>
            <DialogDescription className="text-lg">Start with a pre-configured template</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {teamTemplates.map((template) => (
              <Card
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-primary",
                  selectedTemplate === template.id && "border-primary border-2 bg-accent",
                )}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted",
                        template.iconColor,
                      )}
                    >
                      <template.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{template.name}</CardTitle>
                        {selectedTemplate === template.id && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <CardDescription className="mt-2 text-base">{template.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <DialogFooter className="flex-row gap-3 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsTemplateDialogOpen(false)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={!selectedTemplate} className="flex items-center gap-2">
              Create Workspace
              <Sparkles className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SettingsDialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen} />
    </>
  )
}
