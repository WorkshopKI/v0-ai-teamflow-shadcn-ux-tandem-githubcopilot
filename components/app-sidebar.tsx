"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  CheckSquare,
  Workflow,
  Bot,
  FileText,
  Settings,
  Users,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const navigation = [
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
    name: "AI Agents",
    href: "/agents",
    icon: Bot,
  },
  {
    name: "Templates",
    href: "/templates",
    icon: FileText,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-sidebar text-sidebar-foreground transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-3">
        {!isCollapsed && (
          <Link href="/welcome" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Users className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">TeamFlow</span>
              <span className="text-xs text-sidebar-foreground/60">{""}</span>
            </div>
          </Link>
        )}
        {isCollapsed && (
          <Link href="/welcome" className="flex items-center justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Users className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
          </Link>
        )}
        <div className={cn("flex items-center gap-1", isCollapsed && "ml-auto")}>
          {!isCollapsed && <ThemeToggle />}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "relative h-10 w-10 shrink-0 transition-all duration-200",
              "hover:bg-sidebar-accent hover:scale-110",
              "active:scale-95",
              "focus-visible:ring-2 focus-visible:ring-sidebar-primary focus-visible:ring-offset-2",
              // Ensure button is always interactive with proper z-index
              "z-10 cursor-pointer",
            )}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ pointerEvents: "auto" }}
          >
            {isCollapsed ? (
              <PanelLeft className="h-[18px] w-[18px] transition-transform duration-200" />
            ) : (
              <PanelLeftClose className="h-[18px] w-[18px] transition-transform duration-200" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          title={isCollapsed ? "Settings" : undefined}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!isCollapsed && "Settings"}
        </Link>
        {!isCollapsed && (
          <div className="mt-4 rounded-lg bg-sidebar-accent p-3">
            <div className="flex items-center gap-2 text-xs text-sidebar-foreground/70">
              <div className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
              <span>Local mode active</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
