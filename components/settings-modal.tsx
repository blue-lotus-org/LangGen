"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useSettings } from "@/contexts/settings-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SettingsModal() {
  const { apiKeys, updateApiKey, isSettingsOpen, setIsSettingsOpen } = useSettings()

  const [geminiKey, setGeminiKey] = useState(apiKeys.gemini)
  const [mistralKey, setMistralKey] = useState(apiKeys.mistral)

  const handleSave = () => {
    updateApiKey("gemini", geminiKey)
    updateApiKey("mistral", mistralKey)
    setIsSettingsOpen(false)
  }

  return (
    <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription className="text-gray-400">
            Configure your API keys and application settings. Save on your localstorage.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-1 bg-gray-900">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-api-key">Google Gemini API Key</Label>
              <Input
                id="gemini-api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                className="bg-gray-900 border-gray-700"
              />
              <p className="text-xs text-gray-400">
                Get your API key from the{" "}
                <a
                  href="https://ai.google.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mistral-api-key">Mistral AI API Key</Label>
              <Input
                id="mistral-api-key"
                type="password"
                placeholder="Enter your Mistral API key"
                value={mistralKey}
                onChange={(e) => setMistralKey(e.target.value)}
                className="bg-gray-900 border-gray-700"
              />
              <p className="text-xs text-gray-400">
                Get your API key from the{" "}
                <a
                  href="https://console.mistral.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  Mistral AI Platform
                </a>
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

