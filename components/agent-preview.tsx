"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface AgentPreviewProps {
  code: string
  isGenerating: boolean
  error: string | null
  model: "gemini" | "mistral" | null
  apiKey: string
}

export function AgentPreview({ code, isGenerating, error, model, apiKey }: AgentPreviewProps) {
  const [activeTab, setActiveTab] = useState("code")
  const [testInput, setTestInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState<Array<{ role: "user" | "agent"; content: string }>>([])
  const [testError, setTestError] = useState<string | null>(null)
  const conversationEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of conversation when it updates
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [conversation])

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "langchain-agent.ts"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code)
  }

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!testInput.trim() || !model || !apiKey) return

    // Add user message to conversation
    setConversation((prev) => [...prev, { role: "user", content: testInput }])

    // Clear input and error
    setTestInput("")
    setTestError(null)

    // Set processing state
    setIsProcessing(true)

    try {
      // Call the API to execute the agent
      const response = await fetch("/api/execute-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: testInput,
          model,
          apiKey,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to execute agent")
      }

      const data = await response.json()

      // Add agent response to conversation
      setConversation((prev) => [...prev, { role: "agent", content: data.response }])
    } catch (error) {
      console.error("Error testing agent:", error)
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
      setTestError(errorMessage)
      setConversation((prev) => [
        ...prev,
        {
          role: "agent",
          content: `Error: ${errorMessage}. Please check your API key and try again.`,
        },
      ])
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 h-full">
      <CardHeader>
        <CardTitle>Generated Agent</CardTitle>
        <CardDescription className="text-gray-400">
          Preview, test, and download your LangChain agent code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="test" disabled={!code || isGenerating}>
              Test
            </TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="mt-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-80 bg-gray-900 rounded-md p-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400">Generating your agent...</p>
              </div>
            ) : error ? (
              <div className="bg-red-900/20 border border-red-700 rounded-md p-4 text-red-400">{error}</div>
            ) : code ? (
              <pre className="bg-gray-900 p-4 rounded-md overflow-auto h-80 text-sm">
                <code className="text-gray-300">{code}</code>
              </pre>
            ) : (
              <div className="flex items-center justify-center h-80 bg-gray-900 rounded-md p-4">
                <p className="text-gray-500">Your agent code will appear here</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center h-80 bg-gray-900 rounded-md p-4">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                <p className="text-gray-400">Generating your agent...</p>
              </div>
            ) : code ? (
              <div className="bg-gray-900 p-4 rounded-md h-80 overflow-auto">
                <h3 className="text-lg font-medium mb-2">Agent Structure</h3>
                <p className="text-gray-400 mb-4">This agent uses a manager-worker topology with LangChain.</p>

                <div className="mb-6">
                  <h4 className="text-md font-medium text-blue-400 mb-2">Architecture</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">
                    <li>Manager agent coordinates tasks and breaks down complex requests</li>
                    <li>Worker agents process individual subtasks in parallel</li>
                    <li>Results are aggregated for comprehensive final output</li>
                    {model && <li>Powered by {model === "gemini" ? "Google Gemini" : "Mistral AI"} models</li>}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-md font-medium text-blue-400 mb-2">Included Tools</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 pl-2">
                    {code.includes("search_tool") && <li>Search Tool: Enables web search capabilities</li>}
                    {code.includes("analyze_tool") && (
                      <li>Analyze Tool: Enables data analysis and insight extraction</li>
                    )}
                    {code.includes("math_tool") && (
                      <li>Math Tool: Enables mathematical calculations and problem-solving</li>
                    )}
                    {code.includes("code_tool") && <li>Code Tool: Enables code generation, analysis, and debugging</li>}
                  </ul>
                </div>

                <div>
                  <h4 className="text-md font-medium text-blue-400 mb-2">Usage</h4>
                  <p className="text-gray-300 text-sm">
                    This agent can be integrated into any Node.js application using the LangChain framework. Simply
                    import the agent, provide your API key, and start making requests.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-80 bg-gray-900 rounded-md p-4">
                <p className="text-gray-500">Generate an agent to see the preview</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="test" className="mt-4">
            {!code ? (
              <div className="flex items-center justify-center h-80 bg-gray-900 rounded-md p-4">
                <p className="text-gray-500">Generate an agent first to test it</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-md h-80 flex flex-col">
                <div className="flex-1 overflow-auto p-4">
                  {conversation.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Start a conversation with your agent</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {conversation.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={conversationEndRef} />
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-gray-700">
                  <form onSubmit={handleTestSubmit} className="flex space-x-2">
                    <Textarea
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Ask your agent something..."
                      className="min-h-[40px] resize-none bg-gray-800 border-gray-700"
                      disabled={isProcessing}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={isProcessing || !testInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </form>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {code && !isGenerating && (
          <div className="flex space-x-4">
            <Button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
              Download Agent
            </Button>
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

