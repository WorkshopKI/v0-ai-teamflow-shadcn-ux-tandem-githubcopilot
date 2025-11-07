import { Bot, MessageSquare, Brain, Zap, Activity } from "lucide-react"
import type { AgentType, AgentStatus } from "@/lib/types/agent"

export const agentTypeConfig: Record<AgentType, { label: string; icon: any; description: string }> = {
  conversational: {
    label: "Conversational",
    icon: MessageSquare,
    description: "Chat and customer support",
  },
  analytical: {
    label: "Analytical",
    icon: Brain,
    description: "Data analysis and insights",
  },
  creative: {
    label: "Creative",
    icon: Zap,
    description: "Content generation",
  },
  "task-automation": {
    label: "Task Automation",
    icon: Activity,
    description: "Workflow automation",
  },
}

export const agentStatusConfig: Record<AgentStatus, { label: string; dotClass: string }> = {
  active: { label: "Active", dotClass: "bg-green-500" },
  paused: { label: "Paused", dotClass: "bg-gray-500" },
  training: { label: "Training", dotClass: "bg-blue-500" },
  error: { label: "Error", dotClass: "bg-red-500" },
}

export function getAgentTypeIcon(type: AgentType) {
  return agentTypeConfig[type]?.icon || Bot
}
