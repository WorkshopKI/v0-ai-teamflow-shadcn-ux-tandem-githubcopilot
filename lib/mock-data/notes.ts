import type { Note } from "@/lib/types/note"

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to TeamFlow",
    content: "This is your first note. Try adding more!",
    createdAt: new Date().toISOString(),
  },
]
