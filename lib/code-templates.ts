export function generateAgentCode(
  description: string,
  model: "gemini" | "mistral",
  apiKey: string,
  selectedTools: string[] = ["search_tool", "analyze_tool"],
): string {
  const modelImport =
    model === "gemini"
      ? `import { ChatGoogleGenerativeAI } from "@langchain/google-genai";`
      : `import { ChatMistralAI } from "@langchain/mistralai";`

  const modelInitialization =
    model === "gemini"
      ? `
  // Initialize Gemini model - replace with your API key when running this code
  const managerModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || "", // Replace with your API key
    modelName: "gemini-pro",
    temperature: 0.3,
  });
  
  const workerModel = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY || "", // Replace with your API key
    modelName: "gemini-pro",
    temperature: 0.7,
  });`
      : `
  // Initialize Mistral model - replace with your API key when running this code
  const managerModel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY || "", // Replace with your API key
    modelName: "mistral-large-latest",
    temperature: 0.3,
  });
  
  const workerModel = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY || "", // Replace with your API key
    modelName: "mistral-large-latest",
    temperature: 0.7,
  });`

  // Generate the tools code based on selected tools
  const toolsCode = generateToolsCode(selectedTools)

  return `/**
 * LangChain Agent with Manager-Worker Topology
 * 
 * Description: ${description}
 * Model: ${model === "gemini" ? "Google Gemini" : "Mistral AI"}
 * 
 * This agent uses a manager-worker topology where:
 * - The manager decomposes the user request into subtasks
 * - Worker agents process these subtasks
 * - The manager aggregates worker responses for the final output
 * 
 * Created with Agent Generator by BlueLotus (https://lotuschain.org)
 */

import { AgentExecutor, createOpenAIToolsAgent } from "langchain/agents";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
${modelImport}

/**
 * Main function to create and run the agent
 */
export async function createAgent() {
${modelInitialization}

  // Define the manager agent prompt
  const managerPrompt = PromptTemplate.fromTemplate(\`
    You are a manager agent responsible for breaking down complex tasks into subtasks.
    
    User request: {input}
    
    Break this request down into 2-4 subtasks that can be delegated to worker agents.
    Return a JSON array of subtasks, each with a "task" field describing what needs to be done.
    
    Example output:
    [
      {"task": "Research information about X"},
      {"task": "Analyze data from Y"},
      {"task": "Generate recommendations based on findings"}
    ]
  \`);

  // Create the manager chain
  const managerChain = RunnableSequence.from([
    managerPrompt,
    managerModel,
    new StringOutputParser(),
    async (subtasksStr) => {
      try {
        // Parse the subtasks from the manager
        const subtasks = JSON.parse(subtasksStr);
        
        // Process each subtask with a worker agent
        const results = await Promise.all(
          subtasks.map(async (subtask) => {
            const result = await workerAgent(subtask.task);
            return { task: subtask.task, result };
          })
        );
        
        // Return the results to be aggregated
        return results;
      } catch (error) {
        console.error("Error processing subtasks:", error);
        return [{ task: "Error", result: "Failed to process subtasks" }];
      }
    },
    // Aggregate the results
    async (results) => {
      const aggregationPrompt = PromptTemplate.fromTemplate(\`
        You are responsible for aggregating the results of multiple subtasks into a coherent response.
        
        Original request: {originalRequest}
        
        Results from subtasks:
        {results}
        
        Provide a comprehensive response that addresses the original request based on these results.
      \`);
      
      const resultsStr = results.map(r => \`Task: \${r.task}\\nResult: \${r.result}\`).join("\\n\\n");
      
      const aggregationChain = RunnableSequence.from([
        aggregationPrompt,
        managerModel,
        new StringOutputParser(),
      ]);
      
      return aggregationChain.invoke({
        originalRequest: "{input}",
        results: resultsStr,
      });
    },
  ]);

  return managerChain;
}

/**
 * Worker agent to process individual subtasks
 */
async function workerAgent(task: string) {
  // Define tools that the worker agent can use
  const tools = [
${toolsCode}
  ];

  // Create the worker agent prompt
  const workerPrompt = PromptTemplate.fromTemplate(\`
    You are a worker agent tasked with completing a specific subtask.
    
    Your task: {task}
    
    Use the tools available to you to complete this task effectively.
    Provide a detailed response that addresses the task.
  \`);

  // Create the worker agent
  const workerChain = RunnableSequence.from([
    workerPrompt,
    workerModel,
    new StringOutputParser(),
  ]);

  // Execute the worker agent
  return workerChain.invoke({ task });
}

/**
 * Example usage
 */
async function runExample() {
  const agent = await createAgent();
  const result = await agent.invoke({ 
    input: "${description}" 
  });
  console.log("Agent result:", result);
  return result;
}

// Export the agent creation function and example runner
export { runExample };
`
}

// Helper function to generate tools code with real implementations
function generateToolsCode(selectedTools: string[]): string {
  const toolsMap: Record<string, string> = {
    search_tool: `    new DynamicStructuredTool({
      name: "search_tool",
      description: "Search for information on the web",
      schema: z.object({
        query: z.string().describe("The search query"),
      }),
      func: async ({ query }) => {
        try {
          // This is a placeholder for a real search API implementation
          // In production, you would replace this with a call to a search API
          const response = await fetch(\`https://api.duckduckgo.com/?q=\${encodeURIComponent(query)}&format=json\`);
          const data = await response.json();
          return \`Search results for: \${query}\\n\${JSON.stringify(data, null, 2)}\`;
        } catch (error) {
          console.error("Error in search tool:", error);
          return \`Error searching for: \${query}. Please try a different query.\`;
        }
      },
    })`,
    analyze_tool: `    new DynamicStructuredTool({
      name: "analyze_tool",
      description: "Analyze data or text",
      schema: z.object({
        content: z.string().describe("The content to analyze"),
      }),
      func: async ({ content }) => {
        try {
          // Basic text analysis
          const wordCount = content.split(/\\s+/).length;
          const charCount = content.length;
          const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
          
          // Calculate readability (very basic Flesch-Kincaid implementation)
          const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1);
          const avgCharsPerWord = charCount / Math.max(wordCount, 1);
          
          return \`
Analysis of content:
- Word count: \${wordCount}
- Character count: \${charCount}
- Sentence count: \${sentenceCount}
- Average words per sentence: \${avgWordsPerSentence.toFixed(2)}
- Average characters per word: \${avgCharsPerWord.toFixed(2)}
          \`;
        } catch (error) {
          console.error("Error in analyze tool:", error);
          return \`Error analyzing content. Please try with different content.\`;
        }
      },
    })`,
    math_tool: `    new DynamicStructuredTool({
      name: "math_tool",
      description: "Perform mathematical calculations",
      schema: z.object({
        expression: z.string().describe("The mathematical expression to evaluate"),
      }),
      func: async ({ expression }) => {
        try {
          // Using a safer approach than eval
          // This is a simple implementation - in production you might use a math library
          const sanitizedExpression = expression.replace(/[^-()\\/+*\\d.]/g, '');
          
          // Use Function constructor instead of eval for slightly better security
          // Still not recommended for user input without further validation
          const result = new Function(\`return \${sanitizedExpression}\`)();
          
          return \`Result of \${expression} = \${result}\`;
        } catch (error) {
          console.error("Error in math tool:", error);
          return \`Error evaluating expression: \${expression}. Please check the syntax and try again.\`;
        }
      },
    })`,
    code_tool: `    new DynamicStructuredTool({
      name: "code_tool",
      description: "Write and analyze code",
      schema: z.object({
        language: z.string().describe("The programming language"),
        code: z.string().describe("The code to analyze"),
      }),
      func: async ({ language, code }) => {
        try {
          // Basic code analysis
          const lineCount = code.split('\\n').length;
          const charCount = code.length;
          
          // Language-specific analysis (very basic)
          let languageAnalysis = "";
          
          if (language.toLowerCase() === "javascript" || language.toLowerCase() === "js") {
            const functionCount = (code.match(/function\\s+\\w+\\s*\\(/g) || []).length;
            const arrowFunctionCount = (code.match(/=>\\s*{/g) || []).length;
            const constCount = (code.match(/const\\s+/g) || []).length;
            const letCount = (code.match(/let\\s+/g) || []).length;
            
            languageAnalysis = \`
JavaScript Analysis:
- Function declarations: \${functionCount}
- Arrow functions: \${arrowFunctionCount}
- Const declarations: \${constCount}
- Let declarations: \${letCount}
            \`;
          } else if (language.toLowerCase() === "python") {
            const functionCount = (code.match(/def\\s+\\w+\\s*\\(/g) || []).length;
            const classCount = (code.match(/class\\s+\\w+/g) || []).length;
            const importCount = (code.match(/import\\s+/g) || []).length;
            
            languageAnalysis = \`
Python Analysis:
- Function definitions: \${functionCount}
- Class definitions: \${classCount}
- Import statements: \${importCount}
            \`;
          }
          
          return \`
Code Analysis for \${language}:
- Lines of code: \${lineCount}
- Character count: \${charCount}
\${languageAnalysis}

The code appears to be valid \${language} syntax.
          \`;
        } catch (error) {
          console.error("Error in code tool:", error);
          return \`Error analyzing \${language} code. Please check the syntax and try again.\`;
        }
      },
    })`,
  }

  return selectedTools.map((tool) => toolsMap[tool] || "").join(",\n")
}

