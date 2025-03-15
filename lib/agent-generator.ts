import { generateAgentCode } from "./code-templates"

export async function generateAgent(
  description: string,
  model: "gemini" | "mistral",
  apiKey: string,
  tools: string[] = ["search_tool", "analyze_tool"],
): Promise<string> {
  if (!apiKey) {
    throw new Error(`No API key provided for ${model}. Please add your API key in settings.`)
  }

  // Generate the agent code with the selected tools
  const code = generateAgentCode(description, model, apiKey, tools)
  return code
}

