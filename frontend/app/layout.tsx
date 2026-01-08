import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { GoogleAuthProvider } from "@/components/providers/google-auth-provider"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pro Methods | Transform Your Body, Elevate Your Life",
  description: "Premium fitness training with personalized workout tracking, expert trainers, and nutrition planning.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <GoogleAuthProvider>
          <AuthProvider>
            {children}
            <Analytics />
          </AuthProvider>
        </GoogleAuthProvider>
      </body>
    </html>
  )
}
