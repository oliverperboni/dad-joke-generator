import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Dad Joke Generator",
  description: "A fun app that generates dad jokes",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <div className="relative">
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}
