import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SettingsProvider } from "@/contexts/settings-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LangGen Agent Generator - Build LangChain AI Agents",
  description: "Create AI agents with LangChain TS/JS using a manager-worker topology with Gemini and Mistral models",
  keywords: ["LangChain", "AI", "Agent", "Gemini", "Mistral", "TypeScript", "JavaScript", "React", "Next.js"],
  authors: [{ name: "BlueLotus", url: "https://lotuschain.org" }],
  creator: "BlueLotus",
  publisher: "BlueLotus",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://github.com/blue-lotus-org/LangGen",
    title: "LangGen Agent Generator - Build LangChain AI Agents",
    description: "Create AI agents with LangChain TS/JS using a manager-worker topology with Gemini and Mistral models",
    siteName: "Agent Generator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agent Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LangGen Agent Generator - Build LangChain AI Agents",
    description: "Create AI agents with LangChain TS/JS using a manager-worker topology with Gemini and Mistral models",
    images: ["/og-image.png"],
    creator: "@BlueLotus",
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#1e293b",
  manifest: "/manifest.json",
    generator: 'lotuschain.org'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SettingsProvider>{children}</SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'