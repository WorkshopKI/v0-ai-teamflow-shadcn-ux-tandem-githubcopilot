"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Settings,
  Users,
  Bot,
  PanelLeftClose,
  PanelLeft,
  Plus,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Check,
  X,
  Pencil,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { storage, STORAGE_KEYS } from "@/lib/storage"
import { mockTeamMembers, mockAgents } from "@/lib/mock-data"
import type { Team } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { SettingsOverlay } from "@/components/settings-overlay"
import { teamTemplates, teamNavigation } from "@/data/templates"

interface AppSidebarProps {
  position?: "left" | "right"
}

type TemplateStep = 1 | 2 | 3

const TEMPLATE_STEPS: Array<{ id: TemplateStep; label: string; title: string; description: string }> = [
  {
    id: 1,
    label: "Template",
    title: "Choose a Template",
    description: "Start with a pre-configured template",
  },
  {
    id: 2,
    label: "Details",
    title: "Workspace Details",
    description: "Name and describe your workspace",
  },
  {
    id: 3,
    label: "Modules",
    title: "Select Modules",
    description: "Choose which tools to include at launch",
  },
]

const MODULE_DESCRIPTIONS: Record<string, string> = {
  "/": "Overview dashboards tailored to your template",
  "/tasks": "Plan, prioritize, and track team tasks",
  "/workflows": "Automate repeatable processes",
  "/templates": "Store reusable playbooks and documents",
  "/agents": "Manage AI assistants that support your team",
}

const DEFAULT_HUMAN_MEMBER_IDS = mockTeamMembers.map((member) => member.id)

export function AppSidebar({ position = "left" }: AppSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [isTeamSheetOpen, setIsTeamSheetOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [templateStep, setTemplateStep] = useState<TemplateStep>(1)
  const [teamName, setTeamName] = useState("")
  const [teamDescription, setTeamDescription] = useState("")
  const [teamNameDirty, setTeamNameDirty] = useState(false)
  const [teamDescriptionDirty, setTeamDescriptionDirty] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(() => teamNavigation.map((item) => item.href))
  const [selectedHumanMembers, setSelectedHumanMembers] = useState<string[]>(DEFAULT_HUMAN_MEMBER_IDS)
  const [selectedAiAgents, setSelectedAiAgents] = useState<string[]>([])
  const [sidebarWidth, setSidebarWidth] = useState(274) // Default 274px (w-68.5)
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)

  const [teams, setTeams] = useState<Team[]>([{ id: "default", name: "My Team", template: "blank" }])
  const [activeTeamId, setActiveTeamId] = useState<string>("default")
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [editingTeamName, setEditingTeamName] = useState<string>("")

  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set(["default"]))

  useEffect(() => {
    if (isTemplateDialogOpen) {
      setTemplateStep(1)
      setSelectedTemplate(null)
      setTeamName("")
      setTeamDescription("")
      setTeamNameDirty(false)
      setTeamDescriptionDirty(false)
      setSelectedFeatures(teamNavigation.map((item) => item.href))
      setSelectedHumanMembers(DEFAULT_HUMAN_MEMBER_IDS)
      setSelectedAiAgents([])
    }
  }, [isTemplateDialogOpen, teamNavigation])

  const computeUniqueTeamName = useCallback(
    (baseName: string) => {
      const normalized = baseName.trim() || "New Team"
      const existingNames = teams.map((team) => team.name.toLowerCase())
      if (!existingNames.includes(normalized.toLowerCase())) {
        return normalized
      }

      let suffix = 2
      while (existingNames.includes(`${normalized} ${suffix}`.toLowerCase())) {
        suffix += 1
      }

      return `${normalized} ${suffix}`
    },
    [teams],
  )

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId)
    const templateData = teamTemplates.find((template) => template.id === templateId)
    const recommendedAgents = templateData?.recommendedAgentIds ?? []
    setSelectedAiAgents(recommendedAgents.length > 0 ? [...recommendedAgents] : [])

    if (!teamNameDirty) {
      setTeamName(computeUniqueTeamName(templateData?.name ?? "New Team"))
    }

    if (!teamDescriptionDirty) {
      setTeamDescription(templateData?.description ?? "")
    }
  }

  const handleToggleHumanMember = (memberId: string, enabled: boolean) => {
    setSelectedHumanMembers((prev) => {
      if (enabled) {
        if (prev.includes(memberId)) {
          return prev
        }
        return [...prev, memberId]
      }

      return prev.filter((id) => id !== memberId)
    })
  }

  const handleToggleAiAgent = (agentId: string, enabled: boolean) => {
    setSelectedAiAgents((prev) => {
      if (enabled) {
        if (prev.includes(agentId)) {
          return prev
        }
        return [...prev, agentId]
      }

      return prev.filter((id) => id !== agentId)
    })
  }

  const handleToggleFeature = (featureId: string, enabled: boolean) => {
    setSelectedFeatures((prev) => {
      if (enabled) {
        if (prev.includes(featureId)) {
          return prev
        }
        return [...prev, featureId]
      }

      return prev.filter((item) => item !== featureId)
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      const minWidth = 230
      const maxWidth = 410
      let newWidth: number

      if (position === "left") {
        newWidth = e.clientX
      } else {
        // For right sidebar, calculate from right edge
        newWidth = window.innerWidth - e.clientX
      }

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
  }, [isResizing, position])

  useEffect(() => {
    const savedTeams = storage.get(STORAGE_KEYS.TEAMS, null)
    const savedActiveTeamId = storage.get(STORAGE_KEYS.ACTIVE_TEAM_ID, null)

    if (savedTeams) {
      try {
        const parsedTeams = Array.isArray(savedTeams) ? savedTeams : JSON.parse(String(savedTeams))
        if (Array.isArray(parsedTeams) && parsedTeams.length > 0) {
          setTeams(parsedTeams)

          // Set active team ID if it exists in saved teams
          if (savedActiveTeamId && parsedTeams.some((team: Team) => team.id === savedActiveTeamId)) {
            setActiveTeamId(String(savedActiveTeamId))
          } else {
            // Default to first team if saved active team doesn't exist
            setActiveTeamId(parsedTeams[0].id)
          }
        }
      } catch (error) {
        console.error("[Sidebar] Failed to load teams:", error)
        // Keep default initialization if parsing fails
      }
    }
  }, [])

  useEffect(() => {
    if (teams.length > 0) {
      storage.set(STORAGE_KEYS.TEAMS, teams)
    }
  }, [teams])

  useEffect(() => {
    if (activeTeamId) {
      storage.set(STORAGE_KEYS.ACTIVE_TEAM_ID, activeTeamId)
    }
  }, [activeTeamId])

  useEffect(() => {
    const savedWidth = storage.get(STORAGE_KEYS.SIDEBAR_WIDTH, null) as number | null
    if (typeof savedWidth === "number" && savedWidth >= 230 && savedWidth <= 410) {
      setSidebarWidth(savedWidth)
    }
  }, [])

  useEffect(() => {
    if (!isCollapsed) {
      storage.set(STORAGE_KEYS.SIDEBAR_WIDTH, sidebarWidth)
    }
  }, [sidebarWidth, isCollapsed])

  const handleCreateWorkspace = () => {
    if (!selectedTemplate) {
      return
    }

    const templateData = teamTemplates.find((template) => template.id === selectedTemplate)
    const desiredName = teamName.trim() || templateData?.name || "New Team"
    const uniqueName = computeUniqueTeamName(desiredName)

    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: uniqueName,
      template: selectedTemplate,
      description: teamDescription.trim() || templateData?.description || "",
      ...(selectedHumanMembers.length > 0 ? { members: [...selectedHumanMembers] } : {}),
      ...(selectedAiAgents.length > 0 ? { aiAgents: [...selectedAiAgents] } : {}),
      ...(selectedFeatures.length > 0 ? { features: selectedFeatures } : {}),
    }

    const updatedTeams = [...teams, newTeam]
    setTeams(updatedTeams)
    setActiveTeamId(newTeam.id)
    setExpandedTeams((prev) => {
      const next = new Set(prev)
      next.add(newTeam.id)
      return next
    })
    setIsTemplateDialogOpen(false)
    setSelectedTemplate(null)
    setTemplateStep(1)

    console.log("[v0] Created new team:", newTeam)
    console.log("[v0] Updated teams list:", updatedTeams)
    console.log("[v0] Selected human members:", selectedHumanMembers)
    console.log("[v0] Selected AI agents:", selectedAiAgents)
    console.log("[v0] Selected modules:", selectedFeatures)
  }

  const selectedTemplateData = selectedTemplate
    ? teamTemplates.find((template) => template.id === selectedTemplate)
    : undefined

  const currentStepConfig = (TEMPLATE_STEPS[templateStep - 1] ?? TEMPLATE_STEPS[0])!

  const canAdvance = templateStep === 1
    ? Boolean(selectedTemplate)
    : templateStep === 2
      ? teamName.trim().length > 0
      : selectedFeatures.length > 0

  const handleNextStep = () => {
    if (templateStep === 1) {
      setTemplateStep(2)
    } else if (templateStep === 2) {
      setTemplateStep(3)
    } else {
      handleCreateWorkspace()
    }
  }

  const handlePreviousStep = () => {
    if (templateStep === 1) {
      setIsTemplateDialogOpen(false)
    } else {
      setTemplateStep((prev) => (prev - 1) as TemplateStep)
    }
  }

  const activeTeam = teams.find((team) => team.id === activeTeamId) ?? teams[0]
  const activeTeamFeatures = activeTeam?.features ?? teamNavigation.map((item) => item.href)
  const activeTeamHumanCount = activeTeam?.members?.length ?? 0
  const activeTeamAiCount = activeTeam?.aiAgents?.length ?? 0
  const quickFeatureIds = new Set(["tasks", "workflows", "templates"])
  const quickFeatures = teamNavigation.filter((item) => {
    const featureId = item.href.replace("/", "") || "dashboard"
    if (featureId === "dashboard") {
      return false
    }
    return quickFeatureIds.has(featureId) && activeTeamFeatures.includes(item.href)
  })

  const handleQuickFeatureNavigate = (href: string) => {
    if (!activeTeamId) return
    handleSetActiveTeam(activeTeamId, href)
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

  const handleSetActiveTeam = (teamId: string, route?: string) => {
    setActiveTeamId(teamId)
    setExpandedTeams((prev) => new Set(prev).add(teamId))
    router.push(route ?? "/")
  }

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          "flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 relative",
          position === "right" ? "border-l" : "border-r",
        )}
        style={{
          width: isCollapsed ? "64px" : `${sidebarWidth}px`,
        }}
      >
        {!isCollapsed && (
          <div
            className={cn(
              "absolute top-0 bottom-0 w-1 cursor-col-resize hover:bg-primary/50 transition-colors z-50",
              position === "right" ? "left-0" : "right-0",
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

        <nav className="flex-1 p-4">
          {isCollapsed ? (
            <div className="flex h-full flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setIsTeamSheetOpen(true)}
                className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-foreground transition-colors hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                aria-label="Manage teams"
              >
                <Users className="h-5 w-5" />
              </button>
              <div className="flex flex-col items-center gap-2">
                {quickFeatures.map((feature) => {
                  const isActive = pathname === feature.href
                  return (
                    <button
                      key={feature.href}
                      type="button"
                      onClick={() => handleQuickFeatureNavigate(feature.href)}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg border text-sidebar-foreground transition-colors",
                        isActive
                          ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
                          : "border-sidebar-border bg-sidebar hover:border-sidebar-primary/60 hover:bg-sidebar-accent",
                      )}
                      aria-label={`Open ${feature.name}`}
                    >
                      <feature.icon className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsTemplateDialogOpen(true)}
                aria-label="Create new team"
                className="mt-auto"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-3">
              <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wide text-sidebar-foreground/60">Active team</p>
                      <p className="text-base font-semibold text-sidebar-foreground">{activeTeam?.name ?? "My Team"}</p>
                    </div>
                    <div className="flex flex-col gap-1 text-[11px] text-sidebar-foreground/70">
                      <span className="inline-flex w-fit items-center gap-1 rounded-full border border-sidebar-border/60 bg-sidebar px-2 py-0.5 font-medium">
                        Template
                        <span className="text-sidebar-foreground">{activeTeam?.template ?? "—"}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 rounded-full border border-sidebar-border/60 bg-sidebar px-2 py-0.5">
                          <Users className="h-3.5 w-3.5" />
                          {activeTeamHumanCount}
                          <span className="text-sidebar-foreground/60">members</span>
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-sidebar-border/60 bg-sidebar px-2 py-0.5">
                          <Bot className="h-3.5 w-3.5" />
                          {activeTeamAiCount}
                          <span className="text-sidebar-foreground/60">agents</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:-translate-x-5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsTeamSheetOpen(true)}
                      className="px-3"
                      title="Open Manage to review every workspace module and adjust team details."
                    >
                      Manage
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsTemplateDialogOpen(true)}
                      aria-label="Create new team"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {quickFeatures.length > 0 && (
                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-sidebar-foreground/60">Quick modules</p>
                  <div className="grid grid-cols-3 gap-2">
                    {quickFeatures.map((feature) => {
                      const isActive = pathname === feature.href
                      return (
                        <button
                          key={feature.href}
                          type="button"
                          onClick={() => handleQuickFeatureNavigate(feature.href)}
                          className={cn(
                            "flex flex-col items-center gap-1 rounded-lg border px-3 py-2 text-center text-xs font-medium transition-colors",
                            isActive
                              ? "border-sidebar-primary bg-sidebar-primary text-sidebar-primary-foreground"
                              : "border-sidebar-border bg-sidebar hover:border-sidebar-primary/60 hover:bg-sidebar-accent",
                          )}
                          aria-label={`Open ${feature.name}`}
                        >
                          <feature.icon className="h-4 w-4" />
                          <span>{feature.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

            </div>
          )}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
              "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
            )}
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

      <SettingsOverlay open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />

      <Dialog open={isTeamSheetOpen} onOpenChange={setIsTeamSheetOpen}>
        <DialogContent
          showCloseButton
          className="flex h-screen max-h-screen w-full max-w-full flex-col gap-0 overflow-hidden border-none bg-sidebar text-sidebar-foreground p-0 shadow-2xl sm:left-0 sm:top-0 sm:h-screen sm:max-w-[360px] sm:translate-x-0 sm:translate-y-0 sm:rounded-none sm:border-r sm:border-sidebar-border"
        >
          <DialogHeader className="border-b border-sidebar-border px-4 py-4 text-left">
            <DialogTitle className="text-base">Teams & modules</DialogTitle>
            <DialogDescription className="text-xs">
              Switch between teams, rename them, and open any workspace module.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsTeamSheetOpen(false)
                  setIsTemplateDialogOpen(true)
                }}
                className="w-full justify-center"
              >
                <Plus className="mr-2 h-4 w-4" /> Create new team
              </Button>

              {teams.map((team) => {
                const isActiveTeam = activeTeamId === team.id
                const isExpanded = expandedTeams.has(team.id)
                const teamFeatureSet = new Set(team.features ?? teamNavigation.map((item) => item.href))

                return (
                  <div
                    key={team.id}
                    className={cn(
                      "rounded-lg border px-3 py-3 transition-colors",
                      isActiveTeam
                        ? "border-sidebar-primary bg-sidebar-accent"
                        : "border-sidebar-border/60 bg-sidebar/50 hover:border-sidebar-border",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleTeamExpansion(team.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-sidebar-border/70 bg-sidebar/60"
                        aria-label={isExpanded ? "Collapse team" : "Expand team"}
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </button>

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
                            className="h-8 flex-1 text-sm"
                            autoFocus
                          />
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={handleSaveRename}
                              aria-label="Save team name"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={handleCancelRename}
                              aria-label="Cancel rename"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSetActiveTeam(team.id)}
                            className="flex-1 truncate text-left text-sm font-semibold"
                          >
                            {team.name}
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleStartRename(team.id, team.name)}
                            aria-label="Rename team"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>

                    {isExpanded && (
                      <div className="mt-3 space-y-1 pl-8">
                        {teamNavigation.map((module) => {
                          const Icon = module.icon
                          const enabled = teamFeatureSet.has(module.href)
                          const isActiveModule = isActiveTeam && pathname === module.href

                          return (
                            <button
                              key={`${team.id}-${module.href}`}
                              type="button"
                              onClick={() => {
                                if (!enabled) return
                                handleSetActiveTeam(team.id, module.href)
                                setIsTeamSheetOpen(false)
                              }}
                              disabled={!enabled}
                              className={cn(
                                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                                enabled
                                  ? isActiveModule
                                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                                  : "cursor-not-allowed opacity-40",
                              )}
                              aria-label={enabled ? `Open ${module.name}` : `${module.name} disabled`}
                            >
                              <Icon className="h-4 w-4 shrink-0" />
                              <span className="flex-1 text-left">{module.name}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
        <DialogContent className="flex w-full max-w-[860px] flex-col gap-6 overflow-hidden p-6 sm:max-h-[90vh] sm:min-h-[560px] sm:max-w-none md:min-w-[780px] md:max-w-[920px]">
          <div className="rounded-xl border border-primary/40 bg-primary/10 p-4 shadow-sm">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {TEMPLATE_STEPS.map((step, index) => {
                const status = templateStep > step.id ? "complete" : templateStep === step.id ? "current" : "upcoming"

                return (
                  <div key={step.id} className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div
                        className={cn(
                          "grid h-12 w-12 place-items-center rounded-full border-2 text-base font-semibold transition-all",
                          status === "complete" && "border-primary bg-primary text-primary-foreground shadow-lg",
                          status === "current" && "border-primary bg-background text-primary shadow-sm",
                          status === "upcoming" && "border-border bg-background text-muted-foreground",
                        )}
                      >
                        {status === "complete" ? <Check className="h-5 w-5" /> : step.id}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-semibold uppercase tracking-wide",
                          status === "current" ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index !== TEMPLATE_STEPS.length - 1 && (
                      <div
                        className={cn(
                          "h-1 w-16 rounded-full transition-colors sm:w-20",
                          templateStep > step.id ? "bg-primary" : "bg-border/60",
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-6">
            <DialogHeader className="space-y-1">
              <DialogTitle>{currentStepConfig.title}</DialogTitle>
              <DialogDescription>{currentStepConfig.description}</DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto pr-1">
              {templateStep === 1 && (
                <fieldset className="grid gap-3" role="radiogroup" aria-label="Template options">
                  {teamTemplates.map((template) => {
                    const Icon = template.icon
                    const isSelected = selectedTemplate === template.id

                    return (
                      <label
                        key={template.id}
                        className={cn(
                          "relative flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all",
                          "hover:border-primary/40 hover:bg-primary/5",
                          isSelected ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-background",
                        )}
                      >
                        <input
                          type="radio"
                          name="team-template"
                          value={template.id}
                          className="sr-only"
                          checked={isSelected}
                          onChange={() => handleTemplateChange(template.id)}
                        />
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          <Icon className={cn("h-6 w-6", template.iconColor)} />
                        </div>
                        <div className="flex-1">
                          <p
                            className="font-dynamic"
                            style={{ fontSize: "calc(var(--base-font-size, 16px) * 1.05)" }}
                          >
                            {template.name}
                          </p>
                          <p
                            className="mt-2 font-dynamic text-muted-foreground"
                            style={{ fontSize: "calc(var(--base-font-size, 16px) * 0.9)" }}
                          >
                            {template.description}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "mt-1 flex h-6 w-6 items-center justify-center rounded-full border transition",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground",
                          )}
                          aria-hidden="true"
                        >
                          <span
                            className={cn(
                              "h-2.5 w-2.5 rounded-full transition",
                              isSelected ? "bg-primary-foreground" : "bg-transparent",
                            )}
                          />
                        </span>
                      </label>
                    )
                  })}
                </fieldset>
              )}

              {templateStep === 2 && (
                <div className="flex flex-col gap-5 pb-1">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="workspace-name">Workspace name</Label>
                      <Input
                        id="workspace-name"
                        placeholder="Name your workspace"
                        value={teamName}
                        onChange={(event) => {
                          if (!teamNameDirty) {
                            setTeamNameDirty(true)
                          }
                          setTeamName(event.target.value)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workspace-description">Description</Label>
                      <Textarea
                        id="workspace-description"
                        placeholder="Describe the purpose of this workspace"
                        value={teamDescription}
                        onChange={(event) => {
                          if (!teamDescriptionDirty) {
                            setTeamDescriptionDirty(true)
                          }
                          setTeamDescription(event.target.value)
                        }}
                        rows={4}
                      />
                    </div>
                  </div>

                  {selectedTemplateData && (
                    <div className="rounded-lg border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground shadow-inner">
                      <p>
                        <span className="font-medium text-foreground">{selectedTemplateData.name}</span> provides a curated
                        structure tailored to your team. You can adjust anything later from the workspace settings.
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-3 rounded-lg border bg-background p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 font-semibold text-foreground">
                            <Users className="h-4 w-4 text-primary" />
                            Human teammates
                          </div>
                          <p className="text-sm text-muted-foreground">Invite teammates who will collaborate here.</p>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {selectedHumanMembers.length}/{mockTeamMembers.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {mockTeamMembers.map((member) => {
                          const enabled = selectedHumanMembers.includes(member.id)

                          return (
                            <div
                              key={member.id}
                              className={cn(
                                "flex items-start justify-between gap-3 rounded-md border border-transparent bg-muted/20 px-3 py-2 transition-colors",
                                enabled ? "border-primary/40 bg-primary/10" : "hover:border-primary/30 hover:bg-primary/5",
                              )}
                            >
                              <div>
                                <p className="text-sm font-medium text-foreground">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.role}</p>
                              </div>
                              <Switch
                                checked={enabled}
                                onCheckedChange={(checked) => handleToggleHumanMember(member.id, checked)}
                                aria-label={`Toggle ${member.name}`}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 rounded-lg border bg-background p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 font-semibold text-foreground">
                            <Bot className="h-4 w-4 text-primary" />
                            AI agents
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {selectedTemplateData
                              ? `Preselected for ${selectedTemplateData.name}.`
                              : "Choose assistants to automate work."}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {selectedAiAgents.length}/{mockAgents.length}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {mockAgents.map((agent) => {
                          const enabled = selectedAiAgents.includes(agent.id)
                          const recommended = selectedTemplateData?.recommendedAgentIds?.includes(agent.id)

                          return (
                            <div
                              key={agent.id}
                              className={cn(
                                "flex items-start justify-between gap-3 rounded-md border border-transparent bg-muted/20 px-3 py-2 transition-colors",
                                enabled ? "border-primary/40 bg-primary/10" : "hover:border-primary/30 hover:bg-primary/5",
                              )}
                            >
                              <div className="max-w-[70%]">
                                <p className="text-sm font-medium text-foreground">{agent.name}</p>
                                <p className="text-xs text-muted-foreground">{agent.description}</p>
                                {recommended && (
                                  <span className="mt-2 inline-flex items-center rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-primary">
                                    Recommended
                                  </span>
                                )}
                              </div>
                              <Switch
                                checked={enabled}
                                onCheckedChange={(checked) => handleToggleAiAgent(agent.id, checked)}
                                aria-label={`Toggle ${agent.name}`}
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {templateStep === 3 && (
                <div className="space-y-4 pb-1">
                  {teamNavigation.map((module) => {
                    const Icon = module.icon
                    const enabled = selectedFeatures.includes(module.href)

                    return (
                      <div
                        key={module.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg border p-3 transition-all",
                          "hover:border-primary/40 hover:bg-primary/5",
                          enabled ? "border-primary bg-primary/10 shadow-sm" : "border-border bg-background",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{module.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {MODULE_DESCRIPTIONS[module.href] ?? "Optional module for your workspace"}
                            </p>
                          </div>
                        </div>
                        <div className="ml-auto">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(checked) => handleToggleFeature(module.href, checked)}
                            aria-label={`Toggle ${module.name}`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="mt-auto flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button variant="outline" onClick={handlePreviousStep} className="flex items-center gap-2">
              {templateStep === 1 ? (
                <>
                  <X className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </>
              )}
            </Button>
            <Button onClick={handleNextStep} disabled={!canAdvance} className="flex items-center gap-2">
              {templateStep === 3 ? (
                <>
                  Create Workspace
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
