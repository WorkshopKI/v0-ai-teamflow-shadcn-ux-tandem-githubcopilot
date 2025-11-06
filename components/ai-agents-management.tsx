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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type AgentStatus = "active" | "paused" | "training" | "error"
type AgentType = "conversational" | "analytical" | "creative" | "task-automation"

interface Agent {
  id: string
  name: string
  description: string
  type: AgentType
  status: AgentStatus
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
  tools: string[]
  interactions: number
  successRate: number
  avgResponseTime: number
  createdAt: string
  lastActive?: string
}

const agentTypes = [
  { value: "conversational", label: "Conversational", icon: MessageSquare, description: "Chat and customer support" },
  { value: "analytical", label: "Analytical", icon: Brain, description: "Data analysis and insights" },
  { value: "creative", label: "Creative", icon: Zap, description: "Content generation" },
  { value: "task-automation", label: "Task Automation", icon: Activity, description: "Workflow automation" },
]

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

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    type: "conversational",
    status: "active",
    model: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt:
      "You are a helpful customer support agent. Be friendly, professional, and solve customer issues efficiently.",
    tools: ["web_search", "email_sending"],
    interactions: 15234,
    successRate: 94.5,
    avgResponseTime: 1.2,
    createdAt: "2025-01-15",
    lastActive: "2025-02-02T14:30:00",
  },
  {
    id: "2",
    name: "Data Analyst",
    description: "Analyzes business data and generates insights",
    type: "analytical",
    status: "active",
    model: "gpt-4",
    temperature: 0.3,
    maxTokens: 4000,
    systemPrompt: "You are a data analyst. Provide clear, actionable insights from data.",
    tools: ["data_analysis", "code_execution"],
    interactions: 3421,
    successRate: 97.2,
    avgResponseTime: 2.8,
    createdAt: "2025-01-20",
    lastActive: "2025-02-02T12:15:00",
  },
  {
    id: "3",
    name: "Content Creator",
    description: "Generates marketing content and social media posts",
    type: "creative",
    status: "paused",
    model: "claude-3-opus",
    temperature: 0.9,
    maxTokens: 3000,
    systemPrompt: "You are a creative content writer. Generate engaging, original content.",
    tools: ["image_generation", "web_search"],
    interactions: 892,
    successRate: 91.8,
    avgResponseTime: 3.5,
    createdAt: "2025-01-25",
    lastActive: "2025-02-01T09:00:00",
  },
]

export function AIAgentsManagement() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAgent, setNewAgent] = useState({
    name: "",
    description: "",
    type: "conversational" as AgentType,
    model: "gpt-4-turbo",
    temperature: 0.7,
    maxTokens: 2000,
    systemPrompt: "",
    tools: [] as string[],
  })

  const handleCreateAgent = () => {
    const agent: Agent = {
      id: Date.now().toString(),
      name: newAgent.name,
      description: newAgent.description,
      type: newAgent.type,
      status: "paused",
      model: newAgent.model,
      temperature: newAgent.temperature,
      maxTokens: newAgent.maxTokens,
      systemPrompt: newAgent.systemPrompt,
      tools: newAgent.tools,
      interactions: 0,
      successRate: 0,
      avgResponseTime: 0,
      createdAt: new Date().toISOString(),
    }
    setAgents([...agents, agent])
    setIsCreateDialogOpen(false)
    setNewAgent({
      name: "",
      description: "",
      type: "conversational",
      model: "gpt-4-turbo",
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: "",
      tools: [],
    })
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

  const toggleTool = (tool: string) => {
    setNewAgent({
      ...newAgent,
      tools: newAgent.tools.includes(tool) ? newAgent.tools.filter((t) => t !== tool) : [...newAgent.tools, tool],
    })
  }

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-gray-500"
      case "training":
        return "bg-blue-500"
      case "error":
        return "bg-red-500"
    }
  }

  const getTypeIcon = (type: AgentType) => {
    const typeConfig = agentTypes.find((t) => t.value === type)
    return typeConfig?.icon || Bot
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-balance">AI Agents</h1>
          <p className="text-muted-foreground text-lg">Create and manage intelligent AI agents for automation</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Agents</CardDescription>
              <CardTitle className="text-3xl">{agents.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Agents</CardDescription>
              <CardTitle className="text-3xl">{agents.filter((a) => a.status === "active").length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Interactions</CardDescription>
              <CardTitle className="text-3xl">
                {agents.reduce((sum, a) => sum + a.interactions, 0).toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Avg Success Rate</CardDescription>
              <CardTitle className="text-3xl">
                {(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length).toFixed(1)}%
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

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
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="agent-name">Agent Name</Label>
                      <Input
                        id="agent-name"
                        placeholder="e.g., Customer Support Bot"
                        value={newAgent.name}
                        onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agent-description">Description</Label>
                      <Textarea
                        id="agent-description"
                        placeholder="Describe what this agent does"
                        value={newAgent.description}
                        onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Agent Type</Label>
                      <Select
                        value={newAgent.type}
                        onValueChange={(value) => setNewAgent({ ...newAgent, type: value as AgentType })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {agentTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label} - {type.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>AI Model</Label>
                      <Select
                        value={newAgent.model}
                        onValueChange={(value) => setNewAgent({ ...newAgent, model: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {availableModels.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Temperature: {newAgent.temperature}</Label>
                      <Slider
                        value={[newAgent.temperature]}
                        onValueChange={([value]) => setNewAgent({ ...newAgent, temperature: value ?? 0.7 })}
                        min={0}
                        max={1}
                        step={0.1}
                      />
                      <p className="text-xs text-muted-foreground">Lower = more focused, Higher = more creative</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-tokens">Max Tokens</Label>
                      <Input
                        id="max-tokens"
                        type="number"
                        value={newAgent.maxTokens}
                        onChange={(e) => setNewAgent({ ...newAgent, maxTokens: Number.parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="system-prompt">System Prompt</Label>
                      <Textarea
                        id="system-prompt"
                        placeholder="Define the agent's behavior and personality"
                        value={newAgent.systemPrompt}
                        onChange={(e) => setNewAgent({ ...newAgent, systemPrompt: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tools & Capabilities</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableTools.map((tool) => (
                          <div key={tool} className="flex items-center space-x-2">
                            <Switch checked={newAgent.tools.includes(tool)} onCheckedChange={() => toggleTool(tool)} />
                            <Label className="text-sm cursor-pointer" onClick={() => toggleTool(tool)}>
                              {tool.replace("_", " ")}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateAgent} disabled={!newAgent.name || !newAgent.systemPrompt}>
                      Create Agent
                    </Button>
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
