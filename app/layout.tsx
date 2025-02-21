import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { UsernameProvider } from "@/contexts/username-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "PacePal - Focus Timer",
  description: "A beautiful and peaceful Pomodoro timer to help you stay focused and productive",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <UsernameProvider>{children}</UsernameProvider>
      </body>
    </html>
  )
}



import './globals.css'