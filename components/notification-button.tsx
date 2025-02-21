"use client"

import { Button } from "@/components/ui/button"
import { Bell, BellOff } from "lucide-react"
import { useNotification } from "@/hooks/use-notification"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function NotificationButton() {
  const { enabled, permission, requestPermission } = useNotification()

  const getTooltipContent = () => {
    switch (permission) {
      case "denied":
        return "Notifications are blocked. Please enable them in your browser settings."
      case "granted":
        return "Notifications are enabled"
      default:
        return "Enable notifications for timer updates"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={requestPermission}
            disabled={permission === "denied"}
          >
            {enabled ? (
              <Bell className="h-4 w-4 text-primary" />
            ) : (
              <BellOff className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
