"use client"

import { useState, useEffect, useCallback } from "react"

interface NotificationSettings {
  enabled: boolean
  permission: NotificationPermission
  requestPermission: () => Promise<void>
  sendNotification: (title: string, options?: NotificationOptions) => void
}

export function useNotification(): NotificationSettings {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    // Get initial permission state
    setPermission(Notification.permission)
    setEnabled(Notification.permission === "granted")

    // Listen for visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden && Notification.permission === "granted") {
        setEnabled(true)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange)
  }, [])

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications")
      return
    }

    try {
      const permission = await Notification.requestPermission()
      setPermission(permission)
      setEnabled(permission === "granted")
    } catch (error) {
      console.error("Error requesting notification permission:", error)
    }
  }, [])

  const sendNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (!("Notification" in window) || !enabled) return

      try {
        const notification = new Notification(title, {
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          ...options,
        })

        // Auto close after 5 seconds
        setTimeout(() => notification.close(), 5000)
      } catch (error) {
        console.error("Error sending notification:", error)
      }
    },
    [enabled],
  )

  return {
    enabled,
    permission,
    requestPermission,
    sendNotification,
  }
}

