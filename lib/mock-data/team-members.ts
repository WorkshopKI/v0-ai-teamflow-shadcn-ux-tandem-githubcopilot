import type { TeamMember } from "@/lib/types"

/**
 * Mock human team members available for selection during workspace creation.
 */
export const mockTeamMembers: TeamMember[] = [
  {
    id: "anna-morales",
    name: "Anna Morales",
    role: "Product Manager",
    type: "human",
  },
  {
    id: "li-wei",
    name: "Li Wei",
    role: "Engineering Lead",
    type: "human",
  },
  {
    id: "sophia-ramirez",
    name: "Sophia Ramirez",
    role: "UX Researcher",
    type: "human",
  },
  {
    id: "omar-hassan",
    name: "Omar Hassan",
    role: "Operations Specialist",
    type: "human",
  },
]
