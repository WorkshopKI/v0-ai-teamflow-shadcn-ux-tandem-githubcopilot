"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { useSettings } from "@/lib/settings"
import { useEffect, type ReactNode } from "react"

export function LayoutContent({ children }: { children: ReactNode }) {
  const { settings } = useSettings()

  useEffect(() => {
    console.log("[LayoutContent] Sidebar position:", settings.sidebarPosition)
  }, [settings.sidebarPosition])

  return (
    <div className="flex h-screen overflow-hidden">
      {settings.sidebarPosition === "left" && <AppSidebar position="left" />}
      <main className="flex-1 overflow-y-auto font-dynamic">{children}</main>
      {settings.sidebarPosition === "right" && <AppSidebar position="right" />}
    </div>
  )
}
