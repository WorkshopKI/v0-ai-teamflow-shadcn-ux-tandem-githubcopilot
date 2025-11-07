/**
 * Centralized storage keys for localStorage
 * This ensures consistency and prevents typos
 */
export const STORAGE_KEYS = {
  APP_SETTINGS: "appSettings",
  TEAMS: "teams",
  ACTIVE_TEAM_ID: "activeTeamId",
  TASKS: "tasks",
  TRASHED_TASKS: "trashedTasks",
  SIDEBAR_WIDTH: "sidebarWidth",
  THEME: "theme",
  KANBAN_LIGHT_COLORS: "kanban-light-colors",
  KANBAN_DARK_COLORS: "kanban-dark-colors",
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]
