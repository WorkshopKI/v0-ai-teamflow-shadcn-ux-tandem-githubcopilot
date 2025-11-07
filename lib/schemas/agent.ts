import { z } from "zod"

export const agentSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().min(5).max(240),
  type: z.enum(["conversational", "analytical", "creative", "task-automation"]),
  model: z.string().min(2),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().int().min(1).max(16000),
  systemPrompt: z.string().min(10).max(4000),
  tools: z.array(z.string()).default([]),
})

export type AgentFormData = z.infer<typeof agentSchema>
