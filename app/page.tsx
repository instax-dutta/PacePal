import { Timer } from "@/components/timer"
import { WelcomeModal } from "@/components/welcome-modal"
import { NotificationButton } from "@/components/notification-button"

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="fixed top-4 right-4 z-50">
        <NotificationButton />
      </div>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground/90">PacePal</h1>
        </div>
        <Timer />
      </div>
      <WelcomeModal />
    </main>
  )
}

