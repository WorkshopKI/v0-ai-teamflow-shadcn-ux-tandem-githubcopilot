"use client"

import { useState } from "react"
import {
  Bot,
  Plus,
  Settings,
  Trash2,
  Play,
  Pause,
  MessageSquare,
  Brain,
  Zap,
  TrendingUp,
  Activity,
  Copy,
  Edit,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Agent, AgentStatus, AgentType } from "@/lib/types"
import { mockAgents } from "@/lib/mock-data/agents"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsGrid } from "@/components/stats-grid"
import { StatsCard } from "@/components/stats-card"
import { AgentForm } from "@/components/agents/agent-form"
import { agentStatusConfig, getAgentTypeIcon } from "@/lib/config/agent"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// Removed inline form field components in favor of AgentForm abstraction
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
// Removed Switch/Slider imports (handled inside AgentForm)
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"


// Agent type config now centralized in lib/config/agent

const availableModels = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-opus", label: "Claude 3 Opus" },
  { value: "claude-3-sonnet", label: "Claude 3 Sonnet" },
]

const availableTools = [
  "web_search",
  "code_execution",
  "image_generation",
  "data_analysis",
  "email_sending",
  "calendar_management",
]

// Using centralized mock data and types from lib

export function AIAgentsManagement() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateAgent = (agent: Agent) => {
    setAgents((prev) => [...prev, agent])
  }

  const handleToggleStatus = (agentId: string) => {
    setAgents(
      agents.map((agent) => {
        if (agent.id === agentId) {
          return {
            ...agent,
            status: agent.status === "active" ? "paused" : ("active" as AgentStatus),
          }
        }
        return agent
      }),
    )
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter((a) => a.id !== agentId))
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null)
    }
  }

  const handleDuplicateAgent = (agent: Agent) => {
    const { lastActive, ...agentData } = agent
    const duplicated: Agent = {
      ...agentData,
      id: Date.now().toString(),
      name: `${agent.name} (Copy)`,
      status: "paused",
      interactions: 0,
      successRate: 0,
      avgResponseTime: 0,
      createdAt: new Date().toISOString(),
    }
    setAgents([...agents, duplicated])
  }

  // Tool toggling handled internally by AgentForm

  const getStatusColor = (status: AgentStatus) => agentStatusConfig[status].dotClass
  const getTypeIcon = (type: AgentType) => getAgentTypeIcon(type)

  // Aggregated metrics for stats cards
  const totalAgents = agents.length
  const activeAgents = agents.filter((a) => a.status === "active").length
  const totalInteractions = agents.reduce((sum, a) => sum + a.interactions, 0)
  const avgSuccess = totalAgents ? agents.reduce((sum, a) => sum + a.successRate, 0) / totalAgents : 0

  // Placeholder trend data (in a real app derive from time-series)
  const successTrend = "+3.2%"
  const interactionTrend = "+5% week"

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-balance">AI Agents</h1>
          <p className="text-muted-foreground text-lg">Create and manage intelligent AI agents for automation</p>
        </div>

        {/* Stats Overview (Dashboard style) */}
        <StatsGrid className="mb-6">
          <StatsCard
            title="Total Agents"
            icon={Bot}
            value={totalAgents}
            highlight={`${activeAgents} online`}
            subtext="right now"
          />
          <StatsCard
            title="Active Agents"
            icon={Users}
            value={activeAgents}
            highlight={`${Math.round((activeAgents / Math.max(1, totalAgents)) * 100)}%`}
            subtext="of all agents"
          />
            <StatsCard
              title="Total Interactions"
              icon={Activity}
              value={totalInteractions.toLocaleString()}
              highlight={interactionTrend}
              subtext="vs last week"
            />
            <StatsCard
              title="Avg Success Rate"
              icon={TrendingUp}
              value={`${avgSuccess.toFixed(1)}%`}
              highlight={successTrend}
              subtext="performance delta"
            />
        </StatsGrid>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Agents List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Agents</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create New AI Agent</DialogTitle>
                    <DialogDescription>Configure your AI agent with custom settings and capabilities</DialogDescription>
                  </DialogHeader>
                  <AgentForm
                    onCreate={(agent) => {
                      handleCreateAgent(agent)
                      setIsCreateDialogOpen(false)
                    }}
                    availableModels={availableModels}
                    availableTools={availableTools}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[calc(100vh-400px)]">
              <div className="space-y-3 pr-4">
                {agents.map((agent) => {
                  const TypeIcon = getTypeIcon(agent.type)
                  return (
                    <Card
                      key={agent.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedAgent?.id === agent.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedAgent(agent)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                              <TypeIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base font-semibold line-clamp-1">{agent.name}</CardTitle>
                              <CardDescription className="text-sm mt-1 line-clamp-2">
                                {agent.description}
                              </CardDescription>
                            </div>
                          </div>
                          <div className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(agent.status)}`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-sm">
                          <Badge variant="outline">{agent.model}</Badge>
                          <span className="text-muted-foreground">{agent.interactions.toLocaleString()} runs</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Agent Details */}
          <div className="lg:col-span-2">
            {selectedAgent ? (
              <Card className="h-[calc(100vh-320px)]">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        {(() => {
                          const TypeIcon = getTypeIcon(selectedAgent.type)
                          return <TypeIcon className="h-6 w-6 text-primary" />
                        })()}
                      </div>
                      <div>
                        <CardTitle>{selectedAgent.name}</CardTitle>
                        <CardDescription>{selectedAgent.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggleStatus(selectedAgent.id)}>
                        {selectedAgent.status === "active" ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Agent
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateAgent(selectedAgent)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteAgent(selectedAgent.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="overview" className="h-full">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="configuration">Configuration</TabsTrigger>
                      <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Status</CardDescription>
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedAgent.status)}`} />
                              <CardTitle className="text-lg capitalize">{selectedAgent.status}</CardTitle>
                            </div>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Type</CardDescription>
                            <CardTitle className="text-lg capitalize">{selectedAgent.type.replace("-", " ")}</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Interactions</CardDescription>
                            <CardTitle className="text-lg">{selectedAgent.interactions.toLocaleString()}</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Success Rate</CardDescription>
                            <CardTitle className="text-lg">{selectedAgent.successRate}%</CardTitle>
                          </CardHeader>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Performance Metrics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Avg Response Time</span>
                            <span className="font-semibold">{selectedAgent.avgResponseTime}s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Last Active</span>
                            <span className="font-semibold">
                              {selectedAgent.lastActive ? new Date(selectedAgent.lastActive).toLocaleString() : "Never"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Created</span>
                            <span className="font-semibold">
                              {new Date(selectedAgent.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="configuration" className="mt-4 space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Model Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Model</span>
                            <Badge>{selectedAgent.model}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Temperature</span>
                            <span className="font-semibold">{selectedAgent.temperature}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Max Tokens</span>
                            <span className="font-semibold">{selectedAgent.maxTokens}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">System Prompt</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-32">
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {selectedAgent.systemPrompt}
                            </p>
                          </ScrollArea>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Enabled Tools</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {selectedAgent.tools.map((tool) => (
                              <Badge key={tool} variant="secondary">
                                {tool.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="analytics" className="mt-4 space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <TrendingUp className="h-4 w-4" />
                              <CardDescription>Success Rate</CardDescription>
                            </div>
                            <CardTitle className="text-2xl">{selectedAgent.successRate}%</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Activity className="h-4 w-4" />
                              <CardDescription>Total Runs</CardDescription>
                            </div>
                            <CardTitle className="text-2xl">{selectedAgent.interactions.toLocaleString()}</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Zap className="h-4 w-4" />
                              <CardDescription>Avg Time</CardDescription>
                            </div>
                            <CardTitle className="text-2xl">{selectedAgent.avgResponseTime}s</CardTitle>
                          </CardHeader>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Usage Over Time</CardTitle>
                          <CardDescription>Agent interaction history</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48 flex items-center justify-center text-muted-foreground">
                            Chart visualization would go here
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[calc(100vh-320px)] flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Bot className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No agent selected</h3>
                  <p className="text-muted-foreground mb-4">Select an agent from the list or create a new one</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agent
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
