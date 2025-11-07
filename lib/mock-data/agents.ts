import type { Agent } from "@/lib/types"

/**
 * Mock agents for development and testing
 */
export const mockAgents: Agent[] = [
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
