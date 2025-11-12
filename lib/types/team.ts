/**
 * Team type definitions
 */

export type TeamMemberType = "human" | "ai"

export interface TeamMember {
  id: string
  name: string
  role: string
  type: TeamMemberType
}

export interface Team {
  id: string
  name: string
  template: string
  description?: string
  features?: string[]
  members?: string[]
  aiAgents?: string[]
}
