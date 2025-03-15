"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSettings } from "@/contexts/settings-context"
import { SettingsModal } from "./settings-modal"

export function Header() {
  const { setIsSettingsOpen } = useSettings()

  return (
    <header className="bg-gray-800 border-b border-gray-700">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">LangGen Agent Generator</h1>
            <p className="text-gray-400 mt-1">Build AI agents with LangChain in TS</p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://js.langchain.com/docs/introduction/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              LangChain Docs
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(true)}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <SettingsModal />
    </header>
  )
}

