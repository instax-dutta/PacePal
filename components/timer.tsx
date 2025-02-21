"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw, Trophy, Flame, Sparkles, Coffee, Moon } from "lucide-react"
import { useSound } from "@/hooks/use-sound"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useStats } from "@/hooks/use-stats"
import { StatsDisplay } from "@/components/stats-display"
import { useUsername } from "@/hooks/use-username"
import { useNotification } from "@/hooks/use-notification"

type TimerMode = "work" | "shortBreak" | "longBreak"

interface TimerSettings {
  work: number
  shortBreak: number
  longBreak: number
}

const DEFAULT_SETTINGS: TimerSettings = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

export function Timer() {
  const [mode, setMode] = useState<TimerMode>("work")
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.work)
  const [isRunning, setIsRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [streak, setStreak] = useState(0)
  const { playSound } = useSound()
  const { addSession, getTodayStats, formatTime } = useStats()
  const username = useUsername()
  const { sendNotification } = useNotification()

  const totalTime = DEFAULT_SETTINGS[mode]
  const progress = ((totalTime - timeLeft) / totalTime) * 100

  const handleModeChange = useCallback((newMode: TimerMode) => {
    setMode(newMode)
    setTimeLeft(DEFAULT_SETTINGS[newMode])
    setIsRunning(false)
  }, [])

  const handleTimerComplete = useCallback(() => {
    playSound()

    if (mode === "work") {
      sendNotification("Break Time! 🎉", {
        body: "Great job! Time for a refreshing break.",
      })

      addSession({
        date: new Date().toISOString(),
        duration: DEFAULT_SETTINGS.work / 60,
        type: "work",
        completed: true,
      })

      const newSessions = sessions + 1
      setSessions(newSessions)
      setStreak(streak + 1)
      if (newSessions % 4 === 0) {
        handleModeChange("longBreak")
      } else {
        handleModeChange("shortBreak")
      }
    } else {
      sendNotification("Focus Time! 💪", {
        body: "Break's over! Let's get back to work.",
      })
      handleModeChange("work")
    }
  }, [mode, sessions, streak, handleModeChange, playSound, addSession, sendNotification])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleTimerComplete()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, handleTimerComplete])

  const toggleTimer = () => setIsRunning(!isRunning)

  const resetTimer = () => {
    if (isRunning && mode === "work") {
      addSession({
        date: new Date().toISOString(),
        duration: (DEFAULT_SETTINGS.work - timeLeft) / 60, // Convert to minutes
        type: "work",
        completed: false,
      })
    }
    setIsRunning(false)
    setTimeLeft(DEFAULT_SETTINGS[mode])
  }

  return (
    <div className="space-y-6">
      <Card className="w-full backdrop-blur-sm bg-card/95 shadow-sm border-border/50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 mb-6 sm:mb-8">
            <TooltipProvider>
              {[
                { mode: "work" as const, label: "Focus Time", icon: <Sparkles className="w-4 h-4" /> },
                { mode: "shortBreak" as const, label: "Short Break", icon: <Coffee className="w-4 h-4" /> },
                { mode: "longBreak" as const, label: "Long Break", icon: <Moon className="w-4 h-4" /> },
              ].map((item) => (
                <Tooltip key={item.mode}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={mode === item.mode ? "default" : "outline"}
                      onClick={() => handleModeChange(item.mode)}
                      className={cn(
                        "flex-1 rounded-full transition-colors duration-300",
                        mode === item.mode && "bg-primary/90 text-primary-foreground",
                        "hover:scale-[1.02] active:scale-[0.98]",
                        mode !== item.mode && "bg-background hover:bg-background/80",
                      )}
                    >
                      <span className="flex items-center gap-2">
                        {item.icon}
                        {item.mode === "work" ? "Focus" : item.mode === "shortBreak" ? "Break" : "Rest"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>

          <motion.div
            className="relative flex items-center justify-center mb-8"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-8 border-muted" />

              {/* Progress circle */}
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="transition-all duration-300"
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={`${progress * 2.89}, 289`}
                  strokeLinecap="round"
                  style={{
                    color:
                      mode === "work"
                        ? "hsl(var(--primary))"
                        : mode === "shortBreak"
                          ? "hsl(var(--secondary))"
                          : "hsl(var(--accent))",
                  }}
                />
              </svg>

              {/* Timer display */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-bold tabular-nums tracking-tight">
                  {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
                </span>
                <span className="text-sm text-muted-foreground mt-2">
                  {mode === "work" ? "Focus Time" : mode === "shortBreak" ? "Short Break" : "Long Break"}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center space-x-3 sm:space-x-4">
            <Button
              size="lg"
              onClick={toggleTimer}
              className={cn(
                "rounded-full px-6 sm:px-8 transition-colors duration-300",
                isRunning
                  ? "bg-secondary/90 text-secondary-foreground hover:bg-secondary"
                  : "bg-primary/90 text-primary-foreground hover:bg-primary",
                "hover:scale-[1.02] active:scale-[0.98]",
              )}
            >
              {isRunning ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isRunning ? "Pause" : "Start"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={resetTimer}
              className="rounded-full px-6 sm:px-8 hover:scale-[1.02] active:scale-[0.98] transition-colors duration-300 bg-background hover:bg-background/80"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background hover:bg-background/80 transition-colors duration-300">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-sm">{sessions} Sessions</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total focus sessions completed</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-background hover:bg-background/80 transition-colors duration-300">
                    <Flame className="h-4 w-4 text-accent" />
                    <span className="text-sm">{streak} Streak</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Consecutive sessions completed</p>
                </TooltipContent>
              </Tooltip>

              {streak >= 3 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 hover:bg-primary/10 transition-colors duration-300">
                      <Sparkles className="h-4 w-4 text-primary" />
                      <span className="text-sm">On Fire!</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>You're on a roll! Keep it up!</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          </div>
        </CardContent>
      </Card>
      <StatsDisplay stats={getTodayStats()} formatTime={formatTime} username={username} />
    </div>
  )
}

