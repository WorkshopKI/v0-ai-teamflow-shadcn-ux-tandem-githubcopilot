import {
  LayoutDashboard,
  CheckSquare,
  Workflow,
  Bot,
  FileText,
  Monitor,
  Megaphone,
  ClipboardList,
  Building2,
} from "lucide-react"

export const teamNavigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    name: "Workflows",
    href: "/workflows",
    icon: Workflow,
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
  },
  {
    name: "AI Agents",
    href: "/agents",
    icon: Bot,
  },
]

export const teamTemplates = [
  {
    id: "agile",
    name: "Agile Software Team",
    description:
      "Perfect for development teams using Agile methodologies with sprint planning and code review workflows",
    icon: Monitor,
    iconColor: "text-blue-500",
    recommendedAgentIds: ["1", "2"],
  },
  {
    id: "marketing",
    name: "Marketing Team",
    description: "Organize campaigns, content calendars, and creative workflows with AI-powered copywriting assistance",
    icon: Megaphone,
    iconColor: "text-pink-500",
    recommendedAgentIds: ["3"],
  },
  {
    id: "blank",
    name: "General / Blank",
    description: "Start from scratch with a minimal setup - perfect for any team or workflow",
    icon: ClipboardList,
    iconColor: "text-gray-500",
    recommendedAgentIds: [],
  },
  {
    id: "government",
    name: "Government Processing",
    description: "For processing citizen and business applications with 10 specialized AI assistants",
    icon: Building2,
    iconColor: "text-purple-500",
    recommendedAgentIds: ["1", "2", "3"],
  },
]
