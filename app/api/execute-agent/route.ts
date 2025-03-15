import { type NextRequest, NextResponse } from "next/server"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { ChatMistralAI } from "@langchain/mistralai"
import { PromptTemplate } from "@langchain/core/prompts"
import { RunnableSequence } from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"

export async function POST(request: NextRequest) {
  try {
    const { input, model, apiKey, tools = ["search_tool", "analyze_tool"] } = await request.json()

    if (!input || !model || !apiKey) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Initialize the appropriate models
    let managerModel, workerModel
    if (model === "gemini") {
      managerModel = new ChatGoogleGenerativeAI({
        apiKey,
        modelName: "gemini-pro",
        temperature: 0.3,
      })

      workerModel = new ChatGoogleGenerativeAI({
        apiKey,
        modelName: "gemini-pro",
        temperature: 0.7,
      })
    } else if (model === "mistral") {
      managerModel = new ChatMistralAI({
        apiKey,
        modelName: "mistral-large-latest",
        temperature: 0.3,
      })

      workerModel = new ChatMistralAI({
        apiKey,
        modelName: "mistral-large-latest",
        temperature: 0.7,
      })
    } else {
      return NextResponse.json({ error: "Invalid model specified" }, { status: 400 })
    }

    // Define the manager agent prompt
    const managerPrompt = PromptTemplate.fromTemplate(`
      You are a manager agent responsible for breaking down complex tasks into subtasks.
      
      User request: {input}
      
      Break this request down into 2-3 subtasks that can be delegated to worker agents.
      Return a JSON array of subtasks, each with a "task" field describing what needs to be done.
      
      Example output:
      [
        {"task": "Research information about X"},
        {"task": "Analyze data from Y"},
        {"task": "Generate recommendations based on findings"}
      ]
    `)

    // Create the manager chain
    const managerChain = RunnableSequence.from([
      managerPrompt,
      managerModel,
      new StringOutputParser(),
      async (subtasksStr) => {
        try {
          // Parse the subtasks from the manager
          const subtasks = JSON.parse(subtasksStr)

          // Process each subtask with a worker agent
          const results = await Promise.all(
            subtasks.map(async (subtask: { task: string }) => {
              const result = await workerAgent(subtask.task, workerModel)
              return { task: subtask.task, result }
            }),
          )

          // Return the results to be aggregated
          return results
        } catch (error) {
          console.error("Error processing subtasks:", error)
          return [{ task: "Error", result: "Failed to process subtasks" }]
        }
      },
      // Aggregate the results
      async (results) => {
        const aggregationPrompt = PromptTemplate.fromTemplate(`
          You are responsible for aggregating the results of multiple subtasks into a coherent response.
          
          Original request: {originalRequest}
          
          Results from subtasks:
          {results}
          
          Provide a comprehensive response that addresses the original request based on these results.
        `)

        const resultsStr = results
          .map((r: { task: string; result: string }) => `Task: ${r.task}\nResult: ${r.result}`)
          .join("\n\n")

        const aggregationChain = RunnableSequence.from([aggregationPrompt, managerModel, new StringOutputParser()])

        return aggregationChain.invoke({
          originalRequest: input,
          results: resultsStr,
        })
      },
    ])

    // Execute the chain
    const response = await managerChain.invoke({ input })

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error executing agent:", error)
    return NextResponse.json({ error: "Failed to execute agent" }, { status: 500 })
  }
}

// Helper function for worker agent
async function workerAgent(task: string, model: any) {
  // Create the worker agent prompt
  const workerPrompt = PromptTemplate.fromTemplate(`
    You are a worker agent tasked with completing a specific subtask.
    
    Your task: {task}
    
    Use your knowledge and capabilities to complete this task effectively.
    Provide a detailed response that addresses the task.
  `)

  // Create the worker agent
  const workerChain = RunnableSequence.from([workerPrompt, model, new StringOutputParser()])

  // Execute the worker agent
  return workerChain.invoke({ task })
}

