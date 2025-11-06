"use client"

import { useState } from "react"
import {
  Plus,
  Play,
  Save,
  Settings,
  Trash2,
  Copy,
  GitBranch,
  Zap,
  Mail,
  Database,
  Code,
  MessageSquare,
  Clock,
  CheckCircle,
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

type NodeType = "trigger" | "action" | "condition" | "delay"

interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  icon: any
  config: Record<string, any>
  position: { x: number; y: number }
}

interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  status: "active" | "draft" | "paused"
  lastRun?: string
  runs: number
}

const nodeTypes = [
  {
    type: "trigger" as NodeType,
    label: "Webhook Trigger",
    icon: Zap,
    description: "Start workflow from HTTP request",
    color: "bg-purple-500",
  },
  {
    type: "trigger" as NodeType,
    label: "Schedule Trigger",
    icon: Clock,
    description: "Run workflow on schedule",
    color: "bg-blue-500",
  },
  {
    type: "action" as NodeType,
    label: "Send Email",
    icon: Mail,
    description: "Send email notification",
    color: "bg-green-500",
  },
  {
    type: "action" as NodeType,
    label: "Database Query",
    icon: Database,
    description: "Query or update database",
    color: "bg-orange-500",
  },
  {
    type: "action" as NodeType,
    label: "Run Code",
    icon: Code,
    description: "Execute custom code",
    color: "bg-yellow-500",
  },
  {
    type: "action" as NodeType,
    label: "AI Agent",
    icon: MessageSquare,
    description: "Process with AI agent",
    color: "bg-pink-500",
  },
  {
    type: "condition" as NodeType,
    label: "Condition",
    icon: GitBranch,
    description: "Branch based on condition",
    color: "bg-indigo-500",
  },
  {
    type: "delay" as NodeType,
    label: "Delay",
    icon: Clock,
    description: "Wait before continuing",
    color: "bg-gray-500",
  },
]

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Customer Onboarding",
    description: "Automated workflow for new customer setup",
    nodes: [
      { id: "n1", type: "trigger", label: "Webhook Trigger", icon: Zap, config: {}, position: { x: 50, y: 50 } },
      { id: "n2", type: "action", label: "Send Email", icon: Mail, config: {}, position: { x: 50, y: 150 } },
      { id: "n3", type: "action", label: "Database Query", icon: Database, config: {}, position: { x: 50, y: 250 } },
    ],
    status: "active",
    lastRun: "2025-02-02T10:30:00",
    runs: 1247,
  },
  {
    id: "2",
    name: "Daily Report Generator",
    description: "Generate and send daily analytics reports",
    nodes: [
      { id: "n1", type: "trigger", label: "Schedule Trigger", icon: Clock, config: {}, position: { x: 50, y: 50 } },
      { id: "n2", type: "action", label: "Database Query", icon: Database, config: {}, position: { x: 50, y: 150 } },
      { id: "n3", type: "action", label: "AI Agent", icon: MessageSquare, config: {}, position: { x: 50, y: 250 } },
      { id: "n4", type: "action", label: "Send Email", icon: Mail, config: {}, position: { x: 50, y: 350 } },
    ],
    status: "active",
    lastRun: "2025-02-02T08:00:00",
    runs: 45,
  },
]

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isNodePanelOpen, setIsNodePanelOpen] = useState(false)
  const [newWorkflow, setNewWorkflow] = useState({
    name: "",
    description: "",
  })

  const handleCreateWorkflow = () => {
    const workflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflow.name,
      description: newWorkflow.description,
      nodes: [],
      status: "draft",
      runs: 0,
    }
    setWorkflows([...workflows, workflow])
    setSelectedWorkflow(workflow)
    setIsCreateDialogOpen(false)
    setNewWorkflow({ name: "", description: "" })
  }

  const handleAddNode = (nodeType: (typeof nodeTypes)[0]) => {
    if (!selectedWorkflow) return

    const newNode: WorkflowNode = {
      id: `n${Date.now()}`,
      type: nodeType.type,
      label: nodeType.label,
      icon: nodeType.icon,
      config: {},
      position: { x: 50, y: selectedWorkflow.nodes.length * 100 + 50 },
    }

    const updatedWorkflow = {
      ...selectedWorkflow,
      nodes: [...selectedWorkflow.nodes, newNode],
    }

    setSelectedWorkflow(updatedWorkflow)
    setWorkflows(workflows.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
    setIsNodePanelOpen(false)
  }

  const handleDeleteNode = (nodeId: string) => {
    if (!selectedWorkflow) return

    const updatedWorkflow = {
      ...selectedWorkflow,
      nodes: selectedWorkflow.nodes.filter((n) => n.id !== nodeId),
    }

    setSelectedWorkflow(updatedWorkflow)
    setWorkflows(workflows.map((w) => (w.id === updatedWorkflow.id ? updatedWorkflow : w)))
  }

  const handleToggleStatus = (workflowId: string) => {
    setWorkflows(
      workflows.map((w) => {
        if (w.id === workflowId) {
          return { ...w, status: w.status === "active" ? "paused" : ("active" as "active" | "paused") }
        }
        return w
      }),
    )
  }

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflows(workflows.filter((w) => w.id !== workflowId))
    if (selectedWorkflow?.id === workflowId) {
      setSelectedWorkflow(null)
    }
  }

  const handleDuplicateWorkflow = (workflow: Workflow) => {
    const { lastRun, ...workflowData } = workflow
    const duplicated: Workflow = {
      ...workflowData,
      id: Date.now().toString(),
      name: `${workflow.name} (Copy)`,
      status: "draft",
      runs: 0,
    }
    setWorkflows([...workflows, duplicated])
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-balance">Workflow Builder</h1>
          <p className="text-muted-foreground text-lg">Create and manage automated workflows with visual builder</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflows List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Workflows</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    New
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Workflow</DialogTitle>
                    <DialogDescription>Start building a new automated workflow</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Workflow Name</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Customer Onboarding"
                        value={newWorkflow.name}
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what this workflow does"
                        value={newWorkflow.description}
                        onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateWorkflow} disabled={!newWorkflow.name}>
                      Create Workflow
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-3 pr-4">
                {workflows.map((workflow) => (
                  <Card
                    key={workflow.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedWorkflow?.id === workflow.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedWorkflow(workflow)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-semibold line-clamp-1">{workflow.name}</CardTitle>
                          <CardDescription className="text-sm mt-1 line-clamp-2">
                            {workflow.description}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            workflow.status === "active"
                              ? "default"
                              : workflow.status === "paused"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {workflow.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{workflow.nodes.length} nodes</span>
                        <span>{workflow.runs} runs</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Workflow Canvas */}
          <div className="lg:col-span-2">
            {selectedWorkflow ? (
              <Card className="h-[calc(100vh-200px)]">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedWorkflow.name}</CardTitle>
                      <CardDescription>{selectedWorkflow.description}</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggleStatus(selectedWorkflow.id)}>
                        {selectedWorkflow.status === "active" ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Active
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDuplicateWorkflow(selectedWorkflow)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteWorkflow(selectedWorkflow.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <Tabs defaultValue="canvas" className="h-full">
                    <TabsList>
                      <TabsTrigger value="canvas">Canvas</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>

                    <TabsContent value="canvas" className="mt-4 space-y-4">
                      {/* Node Palette */}
                      <div className="flex items-center gap-2 mb-4">
                        <Dialog open={isNodePanelOpen} onOpenChange={setIsNodePanelOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-2" />
                              Add Node
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Add Node to Workflow</DialogTitle>
                              <DialogDescription>Choose a node type to add to your workflow</DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-3 py-4">
                              {nodeTypes.map((nodeType) => {
                                const Icon = nodeType.icon
                                return (
                                  <Card
                                    key={`${nodeType.type}-${nodeType.label}`}
                                    className="cursor-pointer hover:shadow-md transition-all"
                                    onClick={() => handleAddNode(nodeType)}
                                  >
                                    <CardHeader>
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${nodeType.color}`}>
                                          <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                          <CardTitle className="text-sm">{nodeType.label}</CardTitle>
                                          <CardDescription className="text-xs">{nodeType.description}</CardDescription>
                                        </div>
                                      </div>
                                    </CardHeader>
                                  </Card>
                                )
                              })}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Workflow Nodes */}
                      <ScrollArea className="h-[calc(100vh-450px)] border rounded-lg p-4 bg-muted/20">
                        {selectedWorkflow.nodes.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-full text-center py-12">
                            <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No nodes yet</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              Add nodes to start building your workflow
                            </p>
                            <Button onClick={() => setIsNodePanelOpen(true)}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add First Node
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {selectedWorkflow.nodes.map((node, index) => {
                              const Icon = node.icon
                              const nodeTypeConfig = nodeTypes.find((nt) => nt.label === node.label)
                              return (
                                <div key={node.id} className="relative">
                                  {index > 0 && (
                                    <div className="absolute left-1/2 -top-4 w-0.5 h-4 bg-border -translate-x-1/2" />
                                  )}
                                  <Card className="relative">
                                    <CardHeader className="pb-3">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${nodeTypeConfig?.color || "bg-gray-500"}`}>
                                          <Icon className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1">
                                          <CardTitle className="text-sm">{node.label}</CardTitle>
                                          <CardDescription className="text-xs">
                                            {nodeTypeConfig?.description}
                                          </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-1">
                                          <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Settings className="h-4 w-4" />
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8"
                                            onClick={() => handleDeleteNode(node.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                    </CardHeader>
                                  </Card>
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Workflow Settings</CardTitle>
                          <CardDescription>Configure workflow behavior and triggers</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label>Workflow Name</Label>
                            <Input value={selectedWorkflow.name} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea value={selectedWorkflow.description} readOnly rows={3} />
                          </div>
                          <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={selectedWorkflow.status}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="paused">Paused</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-2">Statistics</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Total Runs</p>
                                <p className="text-2xl font-bold">{selectedWorkflow.runs}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Last Run</p>
                                <p className="text-sm">
                                  {selectedWorkflow.lastRun
                                    ? new Date(selectedWorkflow.lastRun).toLocaleString()
                                    : "Never"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-[calc(100vh-200px)] flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <GitBranch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No workflow selected</h3>
                  <p className="text-muted-foreground mb-4">Select a workflow from the list or create a new one</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workflow
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
