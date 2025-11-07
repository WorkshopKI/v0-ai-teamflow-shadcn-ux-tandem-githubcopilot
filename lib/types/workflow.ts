/**
 * Workflow type definitions
 */

export type NodeType = "trigger" | "action" | "condition" | "delay"

export interface WorkflowNode {
  id: string
  type: NodeType
  label: string
  icon: any
  config: Record<string, any>
  position: { x: number; y: number }
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: WorkflowNode[]
  status: "active" | "draft" | "paused"
  lastRun?: string
  runs: number
}
