export interface SessionStats {
  date: string
  duration: number
  type: "work" | "shortBreak" | "longBreak"
  completed: boolean
}

export interface DailyStats {
  totalSessions: number
  totalFocusTime: number
  completedSessions: number
  longestStreak: number
}

export interface WeeklyStats {
  [date: string]: DailyStats
}

