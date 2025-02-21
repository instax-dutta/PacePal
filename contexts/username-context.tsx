"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface UsernameContextType {
  username: string
  setUsername: (name: string) => void
  isLoading: boolean
}

const UsernameContext = createContext<UsernameContextType | undefined>(undefined)

export function UsernameProvider({ children }: { children: ReactNode }) {
  const [username, setUsernameState] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initial load
    const savedUsername = localStorage.getItem("pacepal_username")
    setUsernameState(savedUsername || "")
    setIsLoading(false)

    // Listen for changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "pacepal_username") {
        setUsernameState(e.newValue || "")
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const setUsername = (name: string) => {
    const trimmedName = name.trim()
    localStorage.setItem("pacepal_username", trimmedName)
    setUsernameState(trimmedName)
    // Dispatch storage event for other tabs
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "pacepal_username",
        newValue: trimmedName,
      }),
    )
  }

  return <UsernameContext.Provider value={{ username, setUsername, isLoading }}>{children}</UsernameContext.Provider>
}

export function useUsername() {
  const context = useContext(UsernameContext)
  if (context === undefined) {
    throw new Error("useUsername must be used within a UsernameProvider")
  }
  return context
}

