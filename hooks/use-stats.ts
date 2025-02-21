"use client"

import { useState, useEffect, useCallback } from "react"
import type { SessionStats, DailyStats, WeeklyStats } from "@/lib/types"

const STATS_KEY = "pacepal_stats"

export function useStats() {
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({})

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem(STATS_KEY)
    if (savedStats) {
      setWeeklyStats(JSON.parse(savedStats))
    }
  }, [])

  // Save stats to localStorage
  const saveStats = useCallback((stats: WeeklyStats) => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
    setWeeklyStats(stats)
  }, [])

  // Add a new session
  const addSession = useCallback((session: SessionStats) => {
    const today = new Date().toISOString().split("T")[0]

    setWeeklyStats((prev) => {
      const newStats = { ...prev }

      if (!newStats[today]) {
        newStats[today] = {
          totalSessions: 0,
          totalFocusTime: 0,
          completedSessions: 0,
          longestStreak: 0,
        }
      }

      newStats[today] = {
        ...newStats[today],
        totalSessions: newStats[today].totalSessions + 1,
        totalFocusTime: newStats[today].totalFocusTime + session.duration,
        completedSessions: session.completed
          ? newStats[today].completedSessions + 1
          : newStats[today].completedSessions,
        longestStreak: Math.max(
          newStats[today].longestStreak,
          session.completed ? newStats[today].longestStreak + 1 : 0,
        ),
      }

      // Keep only last 7 days
      const last7Days = Object.entries(newStats)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .slice(0, 7)
        .reduce(
          (acc, [date, stats]) => ({
            ...acc,
            [date]: stats,
          }),
          {},
        )

      localStorage.setItem(STATS_KEY, JSON.stringify(last7Days))
      return last7Days
    })
  }, [])

  // Get today's stats
  const getTodayStats = useCallback((): DailyStats => {
    const today = new Date().toISOString().split("T")[0]
    return (
      weeklyStats[today] || {
        totalSessions: 0,
        totalFocusTime: 0,
        completedSessions: 0,
        longestStreak: 0,
      }
    )
  }, [weeklyStats])

  // Format minutes to hours and minutes
  const formatTime = useCallback((minutes: number): string => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }, [])

  return {
    weeklyStats,
    addSession,
    getTodayStats,
    formatTime,
  }
}

