"use client"

import { useState, type ComponentType } from "react"
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Copy,
  Sparkles,
  Zap,
  Bot,
  CheckSquare,
  GitBranch,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatsGrid } from "@/components/stats-grid"
import { StatsCard } from "@/components/stats-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type TemplateCategory = "workflow" | "agent" | "task" | "all"
type TemplateDifficulty = "beginner" | "intermediate" | "advanced"

interface Template {
  id: string
  name: string
  description: string
  category: Exclude<TemplateCategory, "all">
  difficulty: TemplateDifficulty
  icon: ComponentType<{ className?: string }>
  tags: string[]
  rating: number
  downloads: number
  author: string
  preview: string
  config: Record<string, unknown>
}

const templates: Template[] = [
  {
    id: "1",
    name: "Customer Support Automation",
    description: "Automated workflow for handling customer support tickets with AI-powered responses and escalation",
    category: "workflow",
    difficulty: "intermediate",
    icon: Zap,
    tags: ["customer-service", "automation", "ai"],
    rating: 4.8,
    downloads: 1247,
    author: "Vercel Team",
    preview: "Webhook Trigger → AI Agent → Condition → Send Email",
    config: {
      nodes: ["webhook", "ai-agent", "condition", "email"],
      estimatedTime: "5 minutes",
    },
  },
  {
    id: "2",
    name: "Data Analysis Agent",
    description: "AI agent configured for analyzing business data and generating actionable insights",
    category: "agent",
    difficulty: "advanced",
    icon: Bot,
    tags: ["analytics", "data", "insights"],
    rating: 4.9,
    downloads: 892,
    author: "AI Labs",
    preview: "GPT-4 with data analysis tools and custom prompts",
    config: {
      model: "gpt-4",
      tools: ["data_analysis", "code_execution"],
      temperature: 0.3,
    },
  },
  {
    id: "3",
    name: "Sprint Planning Template",
    description: "Complete task management setup for agile sprint planning with predefined categories",
    category: "task",
    difficulty: "beginner",
    icon: CheckSquare,
    tags: ["agile", "project-management", "planning"],
    rating: 4.6,
    downloads: 2103,
    author: "ProductivityPro",
    preview: "Pre-configured task board with sprint workflow",
    config: {
      columns: ["backlog", "todo", "in-progress", "review", "done"],
      labels: ["bug", "feature", "enhancement"],
    },
  },
  {
    id: "4",
    name: "Content Generation Pipeline",
    description: "End-to-end workflow for generating, reviewing, and publishing content using AI",
    category: "workflow",
    difficulty: "intermediate",
    icon: Sparkles,
    tags: ["content", "marketing", "ai"],
    rating: 4.7,
    downloads: 756,
    author: "ContentCraft",
    preview: "Schedule → AI Content Gen → Human Review → Publish",
    config: {
      nodes: ["schedule", "ai-agent", "approval", "publish"],
      estimatedTime: "10 minutes",
    },
  },
  {
    id: "5",
    name: "Sales Lead Qualifier",
    description: "AI agent that qualifies sales leads based on custom criteria and engagement",
    category: "agent",
    difficulty: "intermediate",
    icon: TrendingUp,
    tags: ["sales", "crm", "qualification"],
    rating: 4.5,
    downloads: 634,
    author: "SalesForce AI",
    preview: "Claude 3 with CRM integration and scoring logic",
    config: {
      model: "claude-3-sonnet",
      tools: ["web_search", "data_analysis"],
      temperature: 0.5,
    },
  },
  {
    id: "6",
    name: "Bug Tracking System",
    description: "Comprehensive task management template for software bug tracking and resolution",
    category: "task",
    difficulty: "beginner",
    icon: CheckSquare,
    tags: ["development", "bugs", "tracking"],
    rating: 4.8,
    downloads: 1521,
    author: "DevTools Inc",
    preview: "Bug board with priority levels and assignment",
    config: {
      columns: ["reported", "triaged", "in-progress", "testing", "resolved"],
      priorities: ["critical", "high", "medium", "low"],
    },
  },
  {
    id: "7",
    name: "Email Campaign Automation",
    description: "Automated workflow for creating, scheduling, and tracking email marketing campaigns",
    category: "workflow",
    difficulty: "advanced",
    icon: GitBranch,
    tags: ["marketing", "email", "automation"],
    rating: 4.9,
    downloads: 1089,
    author: "MarketingHub",
    preview: "Trigger → Segment → Personalize → Send → Track",
    config: {
      nodes: ["trigger", "condition", "ai-agent", "email", "analytics"],
      estimatedTime: "15 minutes",
    },
  },
  {
    id: "8",
    name: "Code Review Assistant",
    description: "AI agent specialized in reviewing code, suggesting improvements, and catching bugs",
    category: "agent",
    difficulty: "advanced",
    icon: Bot,
    tags: ["development", "code-review", "quality"],
    rating: 4.7,
    downloads: 923,
    author: "CodeQuality AI",
    preview: "GPT-4 Turbo with code execution and analysis tools",
    config: {
      model: "gpt-4-turbo",
      tools: ["code_execution", "web_search"],
      temperature: 0.2,
    },
  },
]

const difficultyColors = {
  beginner: "bg-green-500/10 text-green-700 dark:text-green-400",
  intermediate: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
  advanced: "bg-red-500/10 text-red-700 dark:text-red-400",
}

export function TemplatesLibrary() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState<TemplateDifficulty | "all">("all")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const templatesByCategory = {
    workflow: filteredTemplates.filter((t) => t.category === "workflow"),
    agent: filteredTemplates.filter((t) => t.category === "agent"),
    task: filteredTemplates.filter((t) => t.category === "task"),
  }

  // Aggregated metrics for stats cards (based on unfiltered templates for overall totals)
  const totalTemplates = templates.length
  const workflowCount = templates.filter((t) => t.category === "workflow").length
  const agentCount = templates.filter((t) => t.category === "agent").length
  const taskCount = templates.filter((t) => t.category === "task").length
  const totalUses = templates.reduce((sum, t) => sum + t.downloads, 0)
  const avgRating = templates.length ? (templates.reduce((s, t) => s + t.rating, 0) / templates.length).toFixed(1) : "0.0"
  const usageTrend = "+4%"
  const ratingTrend = "+0.2"

  const handleUseTemplate = (template: Template) => {
    // In a real app, this would create a new workflow/agent/task from the template
    console.log("Using template:", template)
    setIsPreviewOpen(false)
  }

  const TemplateCard = ({ template }: { template: Template }) => {
    const Icon = template.icon

    return (
      <Card className="hover:shadow-lg transition-all cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-dynamic">{template.rating}</span>
            </div>
          </div>
          <CardTitle className="text-base font-semibold line-clamp-1">{template.name}</CardTitle>
          <CardDescription className="text-sm line-clamp-2">{template.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2">
              <Badge className={difficultyColors[template.difficulty]}>{template.difficulty}</Badge>
              <span className="text-xs text-muted-foreground">{template.downloads.toLocaleString()} uses</span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedTemplate(template)
                  setIsPreviewOpen(true)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUseTemplate(template)
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2 text-balance">Templates Library</h1>
          <p className="text-muted-foreground text-lg">Browse and use pre-built templates to get started quickly</p>
        </div>

        {/* Stats (Dashboard style) */}
        <StatsGrid className="mb-6">
          <StatsCard
            title="Total Templates"
            icon={Copy}
            value={totalTemplates}
            highlight={usageTrend}
            subtext={`${totalUses.toLocaleString()} uses`}
          />
          <StatsCard
            title="Workflows"
            icon={GitBranch}
            value={workflowCount}
            subtext="workflow templates"
          />
          <StatsCard
            title="AI Agents"
            icon={Bot}
            value={agentCount}
            subtext="agent templates"
          />
          <StatsCard
            title="Task Templates"
            icon={CheckSquare}
            value={taskCount}
            highlight={ratingTrend}
            subtext={`avg rating ${avgRating}`}
          />
        </StatsGrid>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as TemplateCategory)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="workflow">Workflows</SelectItem>
              <SelectItem value="agent">AI Agents</SelectItem>
              <SelectItem value="task">Tasks</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedDifficulty}
            onValueChange={(value) => setSelectedDifficulty(value as TemplateDifficulty | "all")}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Templates */}
        <Tabs
          value={selectedCategory}
          onValueChange={(value) => setSelectedCategory(value as TemplateCategory)}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Templates</TabsTrigger>
            <TabsTrigger value="workflow">Workflows</TabsTrigger>
            <TabsTrigger value="agent">AI Agents</TabsTrigger>
            <TabsTrigger value="task">Tasks</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredTemplates.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No templates found matching your criteria</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="workflow" className="space-y-4">
            {templatesByCategory.workflow.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No workflow templates found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.workflow.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="agent" className="space-y-4">
            {templatesByCategory.agent.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No agent templates found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.agent.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="task" className="space-y-4">
            {templatesByCategory.task.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No task templates found</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templatesByCategory.task.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-2xl">
            {selectedTemplate && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      {(() => {
                        const Icon = selectedTemplate.icon
                        return <Icon className="h-6 w-6 text-primary" />
                      })()}
                    </div>
                    <div className="flex-1">
                      <DialogTitle>{selectedTemplate.name}</DialogTitle>
                      <DialogDescription>by {selectedTemplate.author}</DialogDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{selectedTemplate.rating}</span>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Preview</h4>
                    <Card>
                      <CardContent className="py-4">
                        <p className="text-sm font-mono">{selectedTemplate.preview}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Category</h4>
                      <Badge variant="outline" className="capitalize">
                        {selectedTemplate.category}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Difficulty</h4>
                      <Badge className={difficultyColors[selectedTemplate.difficulty]}>
                        {selectedTemplate.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Stats</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Downloads</CardDescription>
                          <CardTitle className="text-xl">{selectedTemplate.downloads.toLocaleString()}</CardTitle>
                        </CardHeader>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardDescription>Rating</CardDescription>
                          <CardTitle className="text-xl">{selectedTemplate.rating}/5.0</CardTitle>
                        </CardHeader>
                      </Card>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => handleUseTemplate(selectedTemplate)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Use Template
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
