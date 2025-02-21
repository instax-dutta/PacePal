import type { DailyStats } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Target, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUsername } from "@/contexts/username-context"
import { Skeleton } from "@/components/ui/skeleton"

interface StatsDisplayProps {
  stats: DailyStats
  formatTime: (minutes: number) => string
}

export function StatsDisplay({ stats, formatTime }: StatsDisplayProps) {
  const { username, isLoading } = useUsername()

  const items = [
    {
      label: "Focus Time",
      value: formatTime(stats.totalFocusTime),
      icon: Clock,
      className: "bg-primary/10 text-primary",
    },
    {
      label: "Sessions",
      value: `${stats.completedSessions}/${stats.totalSessions}`,
      icon: Brain,
      className: "bg-secondary/10 text-secondary-foreground",
    },
    {
      label: "Completion",
      value: stats.totalSessions > 0 ? `${Math.round((stats.completedSessions / stats.totalSessions) * 100)}%` : "0%",
      icon: Target,
      className: "bg-muted/10 text-muted-foreground",
    },
    {
      label: "Best Streak",
      value: stats.longestStreak.toString(),
      icon: Trophy,
      className: "bg-accent/10 text-accent-foreground",
    },
  ]

  return (
    <Card className="w-full backdrop-blur-sm bg-card/95 shadow-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          {isLoading ? (
            <Skeleton className="h-6 w-48" />
          ) : (
            <span className="bg-gradient-to-r from-primary/90 to-secondary/90 bg-clip-text text-transparent">
              {username ? `${username}'s Progress` : "Today's Progress"}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {items.map((item) => (
            <div key={item.label} className="flex flex-col items-center justify-center p-4 rounded-lg bg-background/50">
              <div className={cn("p-2 rounded-full", item.className)}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="mt-2 text-center">
                <div className="text-lg font-semibold tabular-nums">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

