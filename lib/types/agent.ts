/**
 * Agent type definitions
 */

export type AgentStatus = "active" | "paused" | "training" | "error"
export type AgentType = "conversational" | "analytical" | "creative" | "task-automation"

export interface Agent {
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
