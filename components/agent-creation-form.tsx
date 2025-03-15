"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, AlertCircle } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { agentTemplates } from "@/lib/agent-templates"

interface AgentCreationFormProps {
  onSubmit: (description: string, model: "gemini" | "mistral", tools: string[]) => Promise<void>
  isGenerating: boolean
  apiKeys: {
    gemini: string
    mistral: string
  }
}

export function AgentCreationForm({ onSubmit, isGenerating, apiKeys }: AgentCreationFormProps) {
  const [description, setDescription] = useState("")
  const [model, setModel] = useState<"gemini" | "mistral">("gemini")
  const { setIsSettingsOpen } = useSettings()
  const [selectedTools, setSelectedTools] = useState<string[]>(["search_tool", "analyze_tool"])
  const [activeTab, setActiveTab] = useState("create")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (description.trim()) {
      onSubmit(description, model, selectedTools)
    }
  }

  const handleToolChange = (tool: string, checked: boolean) => {
    if (checked) {
      setSelectedTools((prev) => [...prev, tool])
    } else {
      setSelectedTools((prev) => prev.filter((t) => t !== tool))
    }
  }

  const handleTemplateSelect = (template: (typeof agentTemplates)[0]) => {
    setDescription(template.template)
    setSelectedTools(template.defaultTools)
    setActiveTab("create")
  }

  const isModelKeyMissing = (selectedModel: "gemini" | "mistral") => {
    return !apiKeys[selectedModel]
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle>Create Your AI Agent</CardTitle>
        <CardDescription className="text-gray-400">
          Describe the functionality of your agent and we'll generate the LangChain code for you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="bg-gray-900 border-gray-700 w-full grid grid-cols-2">
            <TabsTrigger value="create">Create Custom</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Agent Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what you want your agent to do. For example: 'Create an agent that can search the web, summarize articles, and answer questions about the content.'"
                  className="h-40 bg-gray-900 border-gray-700 text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Select Model</Label>
                <RadioGroup
                  value={model}
                  onValueChange={(value) => setModel(value as "gemini" | "mistral")}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="gemini" id="gemini" />
                    <Label htmlFor="gemini" className="cursor-pointer">
                      Gemini
                    </Label>
                    {isModelKeyMissing("gemini") && (
                      <span className="text-xs text-amber-400 ml-2">API key missing</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mistral" id="mistral" />
                    <Label htmlFor="mistral" className="cursor-pointer">
                      Mistral
                    </Label>
                    {isModelKeyMissing("mistral") && (
                      <span className="text-xs text-amber-400 ml-2">API key missing</span>
                    )}
                  </div>
                </RadioGroup>
              </div>

              {isModelKeyMissing(model) && (
                <div className="bg-gray-900 p-3 rounded-md border border-gray-700 text-sm">
                  <div className="flex items-center text-amber-400 mb-2">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>API key required</span>
                  </div>
                  <p className="text-gray-400 mb-2">
                    You need to add an API key for {model === "gemini" ? "Google Gemini" : "Mistral AI"} to generate an
                    agent. API key save on your localstorage, We don't have access to it.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Open Settings
                  </Button>
                </div>
              )}

              <div className="space-y-3">
                <Label>Select AI Tools</Label>
                <div className="bg-gray-900 p-4 rounded-md border border-gray-700 space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="search_tool"
                      checked={selectedTools.includes("search_tool")}
                      onCheckedChange={(checked) => handleToolChange("search_tool", checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="search_tool" className="cursor-pointer">
                        Search Tool
                      </Label>
                      <p className="text-sm text-gray-400">Enables the agent to search for information on the web</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="analyze_tool"
                      checked={selectedTools.includes("analyze_tool")}
                      onCheckedChange={(checked) => handleToolChange("analyze_tool", checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="analyze_tool" className="cursor-pointer">
                        Analyze Tool
                      </Label>
                      <p className="text-sm text-gray-400">Enables the agent to analyze data and extract insights</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="math_tool"
                      checked={selectedTools.includes("math_tool")}
                      onCheckedChange={(checked) => handleToolChange("math_tool", checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="math_tool" className="cursor-pointer">
                        Math Tool
                      </Label>
                      <p className="text-sm text-gray-400">Enables the agent to perform mathematical calculations</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="code_tool"
                      checked={selectedTools.includes("code_tool")}
                      onCheckedChange={(checked) => handleToolChange("code_tool", checked as boolean)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor="code_tool" className="cursor-pointer">
                        Code Tool
                      </Label>
                      <p className="text-sm text-gray-400">Enables the agent to write and execute code</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isGenerating || !description.trim() || isModelKeyMissing(model)}
              >
                {isGenerating ? "Generating Agent..." : "Generate Agent"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="templates" className="mt-4">
            <div className="space-y-4">
              <p className="text-gray-400 text-sm">
                Select a pre-built template to quickly create an agent with specific capabilities.
              </p>

              <div className="grid gap-4">
                {agentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="bg-gray-900 border border-gray-700 rounded-md p-4 hover:border-blue-500 transition-colors cursor-pointer"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <h3 className="font-medium text-white mb-1">{template.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.defaultTools.map((tool) => (
                        <span key={tool} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">
                          {tool.replace("_tool", "")}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

