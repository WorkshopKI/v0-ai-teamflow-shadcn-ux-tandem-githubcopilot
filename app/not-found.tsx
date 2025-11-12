import Link from "next/link"
import { ArrowLeft, Home, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <Card className="w-full max-w-xl text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Page not found</CardTitle>
          <CardDescription>The page you’re looking for doesn’t exist or was moved.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href="/">
              <Button>
                <Home className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4 rotate-180" />
                Browse Templates
              </Button>
            </Link>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">Or jump to:</div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Link href="/tasks">
              <Button variant="ghost" size="sm">
                Tasks
              </Button>
            </Link>
            <Link href="/workflows">
              <Button variant="ghost" size="sm">
                Workflows
              </Button>
            </Link>
            <Link href="/agents">
              <Button variant="ghost" size="sm">
                AI Agents
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
