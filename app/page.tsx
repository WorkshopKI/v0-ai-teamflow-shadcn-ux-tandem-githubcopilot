import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { CheckSquare, Workflow, Bot, Users, Zap, ArrowRight } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2 text-balance">Welcome back!</h1>
        <p className="text-muted-foreground text-lg">Here's what's happening with your team today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workflows</CardTitle>
            <Workflow className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">3 active</span> automations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Agents</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">4 online</span> right now
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-primary font-medium">8 active</span> today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2 my-0 py-0">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your team and AI agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Code Review Agent completed review</p>
                <p className="text-xs text-muted-foreground">Reviewed PR #234 and suggested 3 improvements</p>
                <p className="text-xs text-muted-foreground">2 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-chart-2/10">
                <CheckSquare className="h-4 w-4 text-chart-2" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Sarah completed "API Integration"</p>
                <p className="text-xs text-muted-foreground">Task moved to Done</p>
                <p className="text-xs text-muted-foreground">15 minutes ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-chart-3/10">
                <Workflow className="h-4 w-4 text-chart-3" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Workflow "Daily Standup" executed</p>
                <p className="text-xs text-muted-foreground">Sent summary to #general channel</p>
                <p className="text-xs text-muted-foreground">1 hour ago</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-chart-4/10">
                <Users className="h-4 w-4 text-chart-4" />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Mike joined the team</p>
                <p className="text-xs text-muted-foreground">Added to Development team</p>
                <p className="text-xs text-muted-foreground">3 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Workflows */}
        <Card>
          <CardHeader>
            <CardTitle>Active Workflows</CardTitle>
            <CardDescription>Automations running in your workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Development</Badge>
                  <span className="text-sm font-medium">Code Review Pipeline</span>
                </div>
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">12 PRs reviewed today • 3 pending</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Marketing</Badge>
                  <span className="text-sm font-medium">Content Distribution</span>
                </div>
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              </div>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-muted-foreground">8 posts scheduled • 2 published</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Research</Badge>
                  <span className="text-sm font-medium">Data Analysis</span>
                </div>
                <Badge className="bg-primary text-primary-foreground">Active</Badge>
              </div>
              <Progress value={90} className="h-2" />
              <p className="text-xs text-muted-foreground">5 reports generated • 1 in progress</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <Link href="/tasks">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CheckSquare className="h-8 w-8 text-primary" />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">Manage Tasks</CardTitle>
              <CardDescription>View and organize your team's tasks</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <Link href="/workflows">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Workflow className="h-8 w-8 text-chart-3" />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">Build Workflows</CardTitle>
              <CardDescription>Create and automate your processes</CardDescription>
            </CardHeader>
          </Link>
        </Card>

        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <Link href="/agents">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Bot className="h-8 w-8 text-chart-4" />
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="mt-4">Configure AI Agents</CardTitle>
              <CardDescription>Set up and manage your AI team members</CardDescription>
            </CardHeader>
          </Link>
        </Card>
      </div>
    </div>
  )
}
