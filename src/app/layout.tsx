import type { Metadata } from 'next'

import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"

import '@/app/globals.css'

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})
 
export const metadata: Metadata = {
  title: 'Next.js + Mongodb Auth',
  description: 'Seed project for Next.js + Mongodb Auth',
}

export default function RootLayout({
  children,
} : {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>{children}</body>
    </html>
  )
}
