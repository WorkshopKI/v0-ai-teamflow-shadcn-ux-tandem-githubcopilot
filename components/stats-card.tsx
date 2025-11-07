import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>

interface StatsCardProps {
  title: string
  value: React.ReactNode
  icon: IconType
  subtext?: string
  highlight?: string
  className?: string
  loading?: boolean
}

export function StatsCard({ title, value, icon: Icon, subtext, highlight, className, loading }: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-32 bg-muted rounded animate-pulse" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{value}</div>
            {(subtext || highlight) && (
              <p className="text-xs text-muted-foreground">
                {highlight ? <span className="text-primary font-medium">{highlight}</span> : null}
                {subtext ? (highlight ? ` ${subtext}` : subtext) : null}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
