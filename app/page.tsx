"use client"

import { useState } from "react"
import { AgentCreationForm } from "@/components/agent-creation-form"
import { AgentPreview } from "@/components/agent-preview"
import { Header } from "@/components/header"
import { generateAgent } from "@/lib/agent-generator"
import { useSettings } from "@/contexts/settings-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
// Import the Footer component
import { Footer } from "@/components/footer"

export default function Home() {
  const { apiKeys } = useSettings()
  const [agentCode, setAgentCode] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Add state for the selected model
  const [selectedModel, setSelectedModel] = useState<"gemini" | "mistral" | null>(null)

  // Update the handleGenerateAgent function
  const handleGenerateAgent = async (description: string, model: "gemini" | "mistral", tools: string[]) => {
    try {
      setIsGenerating(true)
      setError(null)
      setSelectedModel(model)

      const apiKey = model === "gemini" ? apiKeys.gemini : apiKeys.mistral

      if (!apiKey) {
        throw new Error(`No API key provided for ${model}. Please add your API key in settings.`)
      }

      console.log(`Generating agent with model: ${model}, tools: ${tools.join(", ")}`)
      const code = await generateAgent(description, model, apiKey, tools)
      setAgentCode(code)
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Failed to generate agent. Please try again.")
      }
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const showApiKeyWarning = !apiKeys.gemini && !apiKeys.mistral

  // Update the return statement to include the Footer
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {showApiKeyWarning && (
          <Alert className="mb-6 bg-amber-900/20 border-amber-700 text-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Keys Required</AlertTitle>
            <AlertDescription>
              Please add your API keys in the settings (gear icon) to generate agents.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AgentCreationForm onSubmit={handleGenerateAgent} isGenerating={isGenerating} apiKeys={apiKeys} />
          </div>
          <div>
            <AgentPreview
              code={agentCode}
              isGenerating={isGenerating}
              error={error}
              model={selectedModel}
              apiKey={selectedModel ? apiKeys[selectedModel] : ""}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

