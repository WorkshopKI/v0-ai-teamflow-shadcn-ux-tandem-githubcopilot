"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Sparkles, Zap, Users, ArrowRight } from "lucide-react"

const features = [
  {
    icon: Lock,
    title: "Local & Private",
    description: "Your data stays on your device. Work offline, sync optionally.",
  },
  {
    icon: Sparkles,
    title: "AI Team Members",
    description: "Integrated AI assistants that help with tasks, ideas and automation.",
  },
  {
    icon: Zap,
    title: "Zero Configuration",
    description: "Start in under 5 minutes. No servers, no complex setup.",
  },
]

export default function WelcomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 p-8">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted">
          <Users className="h-12 w-12 text-foreground" />
        </div>
        <div className="space-y-3">
          <h1 className="text-balance text-5xl font-bold tracking-tight text-primary">Welcome to TeamFlow</h1>
          <p className="text-pretty text-xl text-muted-foreground">
            Local collaboration with AI team members. No registration required, ready in 5 minutes.
          </p>
        </div>
      </div>

      {/* Features Carousel */}
      <Card className="w-full max-w-4xl">
        <CardContent className="p-8">
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon
              const isActive = activeFeature === index
              return (
                <button
                  key={feature.title}
                  onClick={() => setActiveFeature(index)}
                  className={`flex flex-col items-center gap-4 rounded-lg p-6 text-center transition-all ${
                    isActive ? "bg-muted" : "opacity-50 hover:opacity-75"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
          {/* Carousel Dots */}
          <div className="mt-6 flex justify-center gap-2">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveFeature(index)}
                className={`h-2 rounded-full transition-all ${
                  activeFeature === index ? "w-8 bg-foreground" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid w-full max-w-4xl gap-4 md:grid-cols-2">
        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Create New Team</CardTitle>
            <CardDescription>Set up a new workspace with templates and AI support</CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer transition-all hover:shadow-lg">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">Join Existing Team</CardTitle>
            <CardDescription>Use an invitation code to join your team's workspace</CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Local Environment Banner */}
      <div className="flex items-center gap-2 rounded-full bg-muted px-6 py-3 text-sm">
        <Lock className="h-4 w-4" />
        <Sparkles className="h-4 w-4" />
        <span className="font-medium">Local environment ready – no server required!</span>
        <Sparkles className="h-4 w-4" />
      </div>
    </div>
  )
}
