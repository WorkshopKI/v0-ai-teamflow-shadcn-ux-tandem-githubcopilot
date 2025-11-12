"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCRUD } from "@/lib/hooks"
import { STORAGE_KEYS } from "@/lib/storage"
import { mockNotes } from "@/lib/mock-data"
import type { Note } from "@/lib/types"
import { Trash2 } from "lucide-react"

/**
 * Minimal Example Feature
 *
 * Demonstrates:
 * - Feature registration pattern
 * - Storage abstraction via useCRUD
 * - Component composition from UI primitives
 * - TypeScript strict mode handling
 */
export default function MinimalExamplePage() {
  const { items: notes, create, remove } = useCRUD<Note>(mockNotes, STORAGE_KEYS.NOTES)

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string

    if (!title.trim()) return

    create({
      id: Date.now().toString(),
      title: title.trim(),
      content: "",
      createdAt: new Date().toISOString(),
    })

    e.currentTarget.reset()
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Minimal Example</h1>
        <p className="text-muted-foreground">
          A reference implementation showing core patterns (storage, CRUD, composition)
        </p>
      </div>

      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Note</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-2">
            <Input
              name="title"
              placeholder="Enter note title..."
              className="flex-1"
              autoComplete="off"
            />
            <Button type="submit">Add</Button>
          </form>
        </CardContent>
      </Card>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No notes yet. Add one above!</p>
            </CardContent>
          </Card>
        ) : (
          notes.map((note) => (
            <Card key={note.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-base">{note.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(note.id)}
                  aria-label={`Delete ${note.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
            </Card>
          ))
        )}
      </div>

      {/* Pattern Reference */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30">
        <CardHeader>
          <CardTitle className="text-sm">Pattern Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div>
            <strong>Storage:</strong> <code className="rounded bg-muted px-1">useCRUD</code> with{" "}
            <code className="rounded bg-muted px-1">STORAGE_KEYS.NOTES</code>
          </div>
          <div>
            <strong>Components:</strong> Composed from{" "}
            <code className="rounded bg-muted px-1">components/ui/</code>
          </div>
          <div>
            <strong>Types:</strong> <code className="rounded bg-muted px-1">Note</code> from{" "}
            <code className="rounded bg-muted px-1">lib/types/</code>
          </div>
          <div>
            <strong>Mock Data:</strong> <code className="rounded bg-muted px-1">mockNotes</code>{" "}
            from <code className="rounded bg-muted px-1">lib/mock-data/</code>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
