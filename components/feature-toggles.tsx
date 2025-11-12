"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useFeatures } from "@/lib/features"

export function FeatureToggles() {
  const { features, isEnabled, toggle } = useFeatures()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Features</CardTitle>
        <CardDescription>Enable or disable feature modules</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {features.map((feature) => (
          <div key={feature.id} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor={`feature-${feature.id}`} className="flex items-center gap-2">
                <feature.icon className="h-4 w-4" />
                {feature.name}
              </Label>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
            <Switch
              id={`feature-${feature.id}`}
              checked={isEnabled(feature.id)}
              onCheckedChange={() => toggle(feature.id)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
