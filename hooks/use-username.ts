"use client"

import { useState, useEffect } from "react"

export function useUsername() {
  const [username, setUsername] = useState<string>("")

  useEffect(() => {
    // Immediately try to get username when component mounts
    const savedUsername = localStorage.getItem("pacepal_username")
    if (savedUsername) {
      setUsername(savedUsername)
    }

    // Also listen for storage events to update in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "pacepal_username") {
        setUsername(e.newValue || "")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return username
}

