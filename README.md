#   Bluelotus LangChain Agent Generator (LangGen)

##   Presentation

Welcome to the **LangGen** Agent Generator! This application is a user-friendly tool designed to simplify the creation of AI agents, top on LangChain. It allows you to define agent functionality through simple requests, which the application then translates into functional LangChain agents.

##   Key Features

* **AI Agent Generation:** Create custom AI agents using natural language requests.
* **LangChain Integration:** Leverages LangChain TS/JS for robust agent development.
* **Powerful AI Models:** Utilizes "Gemini" and "Mistral" as the underlying AI models for enhanced agent capabilities.
* **Manager-Worker Architecture:** Employs a manager-worker topology for efficient task processing:
    * The manager decomposes user requests into subtasks.
    * Worker agents process these subtasks.
    * The manager aggregates worker responses to generate the final agent output.
* **TypeScript Output:** Generates standard TypeScript LangChain agent code.
* **User-Friendly Interface:**
    * Built with Tailwind CSS for a modern and clean design.
    * Intuitive and easy-to-use interface.
    * Dark mode theme for comfortable use.
    * Functionality to save and download generated agent code.
    * Test agent functionality with a simple sandbox interface.

##   Getting Started

1.  **Install Dependencies:**
    * Ensure you have Node.js and npm, yarn, or pnpm installed.
    * Navigate to the project directory in your terminal.
    * Run one of the following commands to install dependencies:

        ```bash
        npm install
        # or
        yarn install
        # or
        pnpm install
        ```
2.  **Run the App:**
    * Start the development server using one of the following commands:

        ```bash
        npm run dev
        # or if you are using yarn
        yarn dev
        # or if you are using pnpm
        pnpm dev
        ```
3.  **Open in Browser:**
    * Open your web browser and navigate to `http://localhost:3000` to access the application.

##   Technical Details

###   Project Structure

The project is organized as follows:

* **app/**: Contains the main application components and pages.
* **components/**: Reusable UI components.
* **contexts/**: React context providers.
* **hooks/**: Custom React hooks.
* **lib/**: Utility functions and agent-related logic.
* **public/**: Static assets such as images.
* **styles/**: Global CSS styles.

###   Key Files

* **app/layout.tsx**: The main layout component for the application.
* **app/page.tsx**: The main page component.
* **components/agent-creation-form.tsx**:  Form for creating new agents.
* **components/agent-preview.tsx**: Preview component for displaying agents.
* **lib/agent-generator.ts**: Logic for generating agents.
* **lib/agent-templates.ts**: Templates for different types of agents.

###   Technologies Used

* **Next.js:** A React framework for building server-side rendered applications.
* **TypeScript:** A statically typed superset of JavaScript.
* **Tailwind CSS:** A utility-first CSS framework for styling.
* **PostCSS:** A tool for transforming CSS with JavaScript.
* **LangChain JS:** For agent development in TS.
* **Gemini and Mistral:** AI models used for agentic systems.

###   LangChain Resources

* LangChain JS Documentation: [https://js.langchain.com/docs/introduction/](https://js.langchain.com/docs/introduction/)
* LangChain JS Tutorials: [https://js.langchain.com/docs/tutorials/](https://js.langchain.com/docs/tutorials/)
* LangChain JS Agents tutorials: [https://js.langchain.com/docs/tutorials/](https://js.langchain.com/docs/tutorials/)
* LangChain JS GitHub Repository: [https://github.com/langchain-ai/langchainjs](https://github.com/langchain-ai/langchainjs)
* Langchain core github: [https://github.com/langchain-ai/langchainjs/tree/main/langchain-core](https://github.com/langchain-ai/langchainjs/tree/main/langchain-core)
* Langchain js github: [https://github.com/langchain-ai/langchainjs/tree/main/langchain](https://github.com/langchain-ai/langchainjs/tree/main/langchain)
* Langchain examples: [https://github.com/langchain-ai/langchainjs/tree/main/examples](https://github.com/langchain-ai/langchainjs/tree/main/examples)
* Langchain v3 api: [https://v03.api.js.langchain.com/index.html](https://v03.api.js.langchain.com/index.html)

##   Development

To contribute to this project:

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/blue-lotus-org/LangGen.git](https://github.com/blue-lotus-org/LangGen.git)
    ```
2.  **Install Dependencies:**

    ```bash
    npm install # or yarn install or pnpm install
    ```
3.  **Run the Development Server:**

    ```bash
    npm run dev # or yarn dev or pnpm dev
    ```
4.  **Make Changes:** Implement new features, resolve bugs, or enhance existing code.
5.  **Test Your Changes:** Verify that your changes function as expected and do not introduce regressions.
6.  **Submit a Pull Request:** Share your contributions with the project community by submitting a pull request.

## License

This project is licensed under the MIT License.

## Credits
- UI by `v0.dev`
- App about `langchain` agentic platform
- Creator `blue lotus` aka `lotus chain`

##   Contact

For questions, support, or further information, please contact our team.

---

## Topology
```
█████████████████████
█  User Request     █
█████████████████████
          █
          ▼
██████████████████████
█   Manager Agent    █
█(Subtask Generation)█
██████████████████████
          █
          ▼
████████████████████████████████████████
█ Distribute Subtasks to Worker Agents █
████████████████████████████████████████
          █
  ███████████████████   ██████████████████████
  █Worker Agent 1   █   █   Worker Agent N   █
  █(Process Subtask)█   █   (Process Subtask)█
  ███████████████████   ██████████████████████
          █                   █
          ▼                   ▼
  ███████████████   ███████████████
  █   Answer 1  █   █ Answer N    █
  ███████████████   ███████████████
          █
███████████████████████████████████████
█ Collect Answers from Worker Agents  █
███████████████████████████████████████
          █
          ▼
█████████████████████
█   Compile Answers █
█████████████████████
          █
          ▼
█████████████████████████████
█     TS Standard Agent     █
█       (Output Result)     █
█████████████████████████████
```