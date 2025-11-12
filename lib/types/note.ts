/**
 * Note entity for minimal example feature
 */
export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
}

export type NoteFormData = Omit<Note, "id" | "createdAt">
