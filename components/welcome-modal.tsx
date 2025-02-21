"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Brain, Clock, Coffee, Sparkles } from "lucide-react"
import { useUsername } from "@/contexts/username-context"

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const { setUsername } = useUsername()

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome")
    if (!hasSeenWelcome) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    if (!inputValue.trim()) {
      setError("Please enter your name")
      return
    }
    setUsername(inputValue)
    localStorage.setItem("hasSeenWelcome", "true")
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            Welcome to PacePal <Sparkles className="h-5 w-5 text-primary" />
          </DialogTitle>
          <DialogDescription className="text-base">
            Level up your productivity with the Pomodoro Technique
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                What should we call you?
              </label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value)
                  setError("")
                }}
                className="rounded-lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClose()
                  }
                }}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <div className="grid gap-4">
              {[
                {
                  icon: Clock,
                  title: "Work in Focused Sprints",
                  description: "25 minutes of deep, focused work",
                },
                {
                  icon: Coffee,
                  title: "Take Regular Breaks",
                  description: "5-minute breaks to stay fresh and energized",
                },
                {
                  icon: Brain,
                  title: "Build Better Habits",
                  description: "Track your progress and earn achievements",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-0.5">
                    <div className="rounded-full bg-primary/10 p-2">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} className="w-full">
            Let&apos;s Begin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

