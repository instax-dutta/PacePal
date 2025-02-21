"use client"

import { useCallback } from "react"

export function useSound() {
  const playSound = useCallback(() => {
    const audio = new Audio("/notification.mp3")
    audio.play().catch((error) => {
      console.error("Error playing sound:", error)
    })
  }, [])

  return { playSound }
}

