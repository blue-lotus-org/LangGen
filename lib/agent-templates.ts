export interface AgentTemplate {
  id: string
  name: string
  description: string
  template: string
  defaultTools: string[]
}

// 20 agent templates: general, expert, edge niches, and more
export const agentTemplates: AgentTemplate[] = [
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "An agent that helps with research tasks",
    template:
      "Create a research assistant agent that can search for information online, analyze articles, extract key insights, and provide comprehensive summaries. The agent should be able to handle complex research queries, cite sources, and organize information in a structured format.",
    defaultTools: ["search_tool", "analyze_tool"],
  },
  {
    id: "code-assistant",
    name: "Code Assistant",
    description: "An agent that helps with coding tasks",
    template:
      "Create a coding assistant agent that can help write, debug, and explain code. The agent should be able to generate code snippets in multiple languages, explain complex programming concepts, review existing code for improvements, and suggest best practices.",
    defaultTools: ["code_tool", "analyze_tool"],
  },
  {
    id: "data-analyst",
    name: "Data Analyst",
    description: "An agent that analyzes data and provides insights",
    template:
      "Create a data analysis agent that can process datasets, perform statistical analysis, identify trends, and generate visualizations. The agent should be able to interpret numerical data, provide insights, and answer questions about the data in a clear, understandable way.",
    defaultTools: ["analyze_tool", "math_tool"],
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "An agent that helps create various types of content",
    template:
      "Create a content creation agent that can generate blog posts, social media content, marketing copy, and other written materials. The agent should be able to adapt its writing style for different audiences, incorporate SEO best practices, and create engaging, original content.",
    defaultTools: ["search_tool", "analyze_tool"],
  },
  {
    id: "learning-assistant",
    name: "Learning Assistant",
    description: "An agent that helps with learning and education",
    template:
      "Create a learning assistant agent that can explain complex concepts, create study materials, quiz users on topics, and provide educational resources. The agent should be able to adapt to different learning styles, break down difficult subjects, and provide step-by-step explanations.",
    defaultTools: ["search_tool", "math_tool", "analyze_tool"],
  },
  {
    id: "personal-finance-advisor",
    name: "Personal Finance Advisor",
    description: "An agent that helps with personal finance management.",
    template:
      "Create a personal finance advisor agent that can analyze spending habits, provide budget recommendations, calculate investment returns, and offer financial planning advice. The agent should be able to process financial data, perform calculations, and offer personalized insights based on user goals.",
    defaultTools: ["search_tool", "math_tool", "analyze_tool"]
  },
  {
    id: "travel-planner",
    name: "Travel Planner",
    description: "An agent that helps with travel planning.",
    template:
      "Create a travel planner agent that can search for flights, hotels, and attractions, create itineraries, and provide travel tips. The agent should be able to handle complex travel queries, organize information in a clear format, and adapt to user preferences.",
    defaultTools: ["search_tool", "analyze_tool"]
  },
  {
    id: "recipe-generator",
    name: "Recipe Generator",
    description: "An agent that generates recipes based on user preferences.",
    template:
      "Create a recipe generator agent that can generate recipes based on ingredients, dietary restrictions, and cooking preferences. The agent should be able to search for recipes online, analyze ingredient combinations, and provide clear instructions.",
    defaultTools: ["search_tool", "analyze_tool"]
  },
  {
    id: "language-tutor",
    name: "Language Tutor",
    description: "An agent that helps with language learning.",
    template:
      "Create a language tutor agent that can provide vocabulary explanations, grammar exercises, and conversational practice. The agent should be able to adapt to different learning styles, provide step-by-step explanations, and offer personalized feedback.",
    defaultTools: ["search_tool", "analyze_tool"]
  },
  {
    id: "project-manager",
    name: "Project Manager",
    description: "An agent that helps with project management tasks.",
    template:
      "Create a project manager agent that can create task lists, set deadlines, track progress, and provide project updates. The agent should be able to organize information, analyze project data, and provide clear reports.",
    defaultTools: ["search_tool", "analyze_tool"]
  },
  {
    id: "legal-document-assistant",
    name: "Legal Document Assistant",
    description: "An agent that helps with legal document tasks.",
    template:
      "Create a legal document assistant agent that can help with drafting, reviewing, and summarizing legal documents. The agent should be able to analyze legal text, identify key clauses, and provide summaries of complex legal information.",
    defaultTools: ["analyze_tool", "search_tool"]
  },
  {
    id: "medical-information-assistant",
    name: "Medical Information Assistant",
    description: "An agent that provides medical information.",
    template:
      "Create a medical information assistant agent that can provide information about medical conditions, treatments, and medications. The agent should be able to search medical databases, analyze medical articles, and provide summaries of medical information. Note: This agent is not a substitute for professional medical advice.",
    defaultTools: ["search_tool", "analyze_tool"]
  },
  {
    id: "environmental-impact-analyzer",
    name: "Environmental Impact Analyzer",
    description: "An agent that analyzes environmental impact.",
    template:
      "Create an environmental impact analyzer agent that can assess the environmental impact of projects, products, or activities. The agent should be able to process environmental data, analyze scientific studies, and provide reports on environmental impact.",
    defaultTools: ["analyze_tool", "search_tool", "math_tool"]
  },
  {
    id: "social-media-manager",
    name: "Social Media Manager",
    description: "An agent that helps manage social media accounts.",
    template:
      "Create a social media manager agent that can schedule posts, analyze social media trends, and provide engagement reports. The agent should be able to search for relevant content, analyze social media data, and generate reports on social media performance.",
    defaultTools: ["search_tool", "analyze_tool"]
  },
  {
    id: "scientific-literature-summarizer",
    name: "Scientific Literature Summarizer",
    description: "An agent that summarizes scientific literature.",
    template:
      "Create a scientific literature summarizer agent that can read and summarize scientific papers, extract key findings, and provide concise summaries. The agent should be able to analyze scientific text, identify key concepts, and provide summaries of complex scientific information.",
    defaultTools: ["analyze_tool", "search_tool"]
  },
  {
    id: "patent-researcher",
    name: "Patent Researcher",
    description: "An agent specializing in patent research and analysis.",
    template:
      "Create a patent research agent that can search patent databases, analyze patent claims, and provide insights into patent landscapes. The agent should be able to understand complex patent terminology, identify prior art, and generate reports on patent trends and validity.",
    defaultTools: ["search_tool", "analyze_tool"]
  },
  {
    id: "financial-modeling-expert",
    name: "Financial Modeling Expert",
    description: "An agent that builds and analyzes complex financial models.",
    template:
      "Create a financial modeling expert agent that can build and analyze complex financial models, including discounted cash flow (DCF) models, leveraged buyout (LBO) models, and valuation models. The agent should be able to process financial data, perform advanced calculations, and generate detailed reports.",
    defaultTools: ["search_tool", "math_tool", "analyze_tool"]
  },
  {
    id: "clinical-trial-analyzer",
    name: "Clinical Trial Analyzer",
    description: "An agent that analyzes clinical trial data and literature.",
    template:
      "Create a clinical trial analyzer agent that can process clinical trial data, analyze study designs, and summarize key findings from clinical trials. The agent should be able to understand medical terminology, analyze statistical data, and provide insights into the efficacy and safety of medical interventions.",
    defaultTools: ["analyze_tool", "search_tool", "math_tool"]
  },
  {
    id: "cybersecurity-threat-analyst",
    name: "Cybersecurity Threat Analyst",
    description: "An agent that analyzes cybersecurity threats and vulnerabilities.",
    template:
      "Create a cybersecurity threat analyst agent that can analyze network traffic, identify malware signatures, and assess cybersecurity vulnerabilities. The agent should be able to process security logs, analyze threat intelligence feeds, and generate reports on potential security risks.",
    defaultTools: ["analyze_tool", "search_tool"]
  },
  {
    id: "supply-chain-optimization-expert",
    name: "Supply Chain Optimization Expert",
    description: "An agent that optimizes supply chain logistics and efficiency.",
    template:
      "Create a supply chain optimization expert agent that can analyze supply chain data, identify bottlenecks, and recommend strategies for improving efficiency and reducing costs. The agent should be able to process logistics data, analyze inventory levels, and generate reports on supply chain performance.",
    defaultTools: ["search_tool", "analyze_tool", "math_tool"]
  },
]

