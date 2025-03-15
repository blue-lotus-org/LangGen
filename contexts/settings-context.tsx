"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type SettingsContextType = {
  apiKeys: {
    gemini: string
    mistral: string
  }
  updateApiKey: (provider: "gemini" | "mistral", key: string) => void
  isSettingsOpen: boolean
  setIsSettingsOpen: (open: boolean) => void
}

const defaultSettings: SettingsContextType = {
  apiKeys: {
    gemini: "",
    mistral: "",
  },
  updateApiKey: () => {},
  isSettingsOpen: false,
  setIsSettingsOpen: () => {},
}

const SettingsContext = createContext<SettingsContextType>(defaultSettings)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [apiKeys, setApiKeys] = useState<{ gemini: string; mistral: string }>({
    gemini: "",
    mistral: "",
  })
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const storedGeminiKey = localStorage.getItem("gemini_api_key")
    const storedMistralKey = localStorage.getItem("mistral_api_key")

    setApiKeys({
      gemini: storedGeminiKey || "",
      mistral: storedMistralKey || "",
    })

    setIsLoaded(true)
  }, [])

  const updateApiKey = (provider: "gemini" | "mistral", key: string) => {
    setApiKeys((prev) => ({
      ...prev,
      [provider]: key,
    }))

    // Save to localStorage
    localStorage.setItem(`${provider}_api_key`, key)
  }

  // Only render children after settings are loaded from localStorage
  if (!isLoaded) {
    return null
  }

  return (
    <SettingsContext.Provider
      value={{
        apiKeys,
        updateApiKey,
        isSettingsOpen,
        setIsSettingsOpen,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext)

