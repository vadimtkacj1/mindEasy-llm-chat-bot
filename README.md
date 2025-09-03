# MindEasy - AI Therapy Chatbot

MindEasy is a full-stack web application that provides AI-powered therapeutic conversations. Built with React (frontend) and Python FastAPI (backend), it offers a clean, intuitive interface for users to interact with an AI therapist powered by multiple AI models with the ability to switch between different models during conversations.

## 🏗️ Project Structure

```
mindeasy/
├── backend/
│   ├── __pycache__/
│   ├── app.py                 # FastAPI application entry point
│   ├── main.py                # Core chatbot processing logic
│   ├── README.md
│   ├── requirements.txt       # Python dependencies
│   ├── template.py           # Prompt template handling
│   ├── tools.yaml           # Configuration for AI tools
│   ├── venv/                # Python virtual environment
│   └── yaml_utils.py        # YAML utility functions
└── frontend/
    ├── eslint.config.js
    ├── index.html
    ├── node_modules/
    ├── package-lock.json
    ├── package.json
    ├── pnpm-lock.yaml
    ├── postcss.config.js
    ├── public/
    ├── src/
    │   ├── tailwind.config.js
    │   ├── tsconfig.app.json
    │   ├── tsconfig.json
    │   └── tsconfig.node.json
    └── vite.config.ts
```

## 📸 Screenshots

### Application Interface

![MindEasy Main Interface](./screenshots/main-interface.png)
_Main chat interface with AI therapist_

![Conversation Example](./screenshots/conversation-example.png)
_Example therapeutic conversation_

## 🚀 Features

-   **Real-time AI Conversations**: Engage in therapeutic conversations with AI powered by multiple model providers
-   **Dynamic Model Selection**: Switch between different AI models (LLaMA, GPT, Claude, etc.) from a dropdown menu during conversations
-   **Memory Management**: The AI maintains conversation context with a configurable memory buffer
-   **Modern UI**: Clean, responsive React interface with Tailwind CSS styling
-   **TypeScript Support**: Full TypeScript implementation for better development experience
-   **Error Handling**: Comprehensive error handling on both frontend and backend
-   **Conversation History**: Messages are timestamped and stored during the session
-   **Multi-Provider Support**: Compatible with Groq, OpenAI, Anthropic, and other AI providers

## 🛠️ Installation & Setup

### Prerequisites

-   Node.js (v16 or higher)
-   Python (v3.8 or higher)
-   npm, yarn, or pnpm package manager
-   API Keys for your chosen AI providers (Groq, OpenAI, Anthropic, etc.)

### Backend Setup

1. **Navigate to the backend directory:**

    ```bash
    cd backend
    ```

2. **Create and activate a virtual environment:**

    ```bash
    python -m venv venv

    # On Windows
    venv\Scripts\activate

    # On macOS/Linux
    source venv/bin/activate
    ```

3. **Install Python dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

4. **Set up environment variables:**
   Create a `.env` file in the backend directory:

    ```env
    # Groq Configuration
    GROQ_API_KEY=your_groq_api_key_here
    ```

5. **Configure available models:**
   Modify `constants.py` to customize available AI models and their configurations:
    ```yaml
    available_models:
        - llama3-8b-8192
        - llama3-70b-8192
        - mixtral-8x7b-32768
    ```

### Frontend Setup

1. **Navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2. **Install dependencies:**

    ```bash
    # Using npm
    npm install

    # Using yarn
    yarn install

    # Using pnpm
    pnpm install
    ```

## 🏃‍♂️ Running the Application

### Start the Backend Server

1. **Make sure you're in the backend directory with the virtual environment activated:**

    ```bash
    cd backend
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

2. **Run the FastAPI server:**

    ```bash
    python app.py
    ```

    The backend server will start on `http://localhost:8000`

### Start the Frontend Development Server

1. **Open a new terminal and navigate to the frontend directory:**

    ```bash
    cd frontend
    ```

2. **Start the development server:**

    ```bash
    # Using npm
    npm run dev

    # Using yarn
    yarn dev

    # Using pnpm
    pnpm dev
    ```

    The frontend application will be available at `http://localhost:5173` (or another port if 5173 is occupied)

### Testing the Backend Standalone

You can also test the chatbot logic directly from the command line:

```bash
cd backend
python main.py
```

This will start a simple command-line interface where you can chat with the AI directly and test different models.

## 📡 API Endpoints

The backend provides the following API endpoints:

-   `POST /chat` - Send a message to the AI therapist

    -   Request body: `{ "message": "your message here", "model": "optional_model_name" }`
    -   Response: `{ "response": "AI response", "model_used": "model_name" }`

-   `GET /models` - Get list of available AI models

    -   Response: `{ "models": [{"provider": "groq", "name": "llama3-8b-8192", "display_name": "LLaMA 3 8B"}] }`

-   `POST /switch-model` - Switch the active AI model
    -   Request body: `{ "provider": "groq", "model": "llama3-70b-8192" }`
    -   Response: `{ "status": "success", "current_model": "llama3-70b-8192" }`

## 🔧 Configuration

### Backend Configuration

-   **Model Selection**: Users can switch between models using the dropdown in the frontend interface
-   **Memory Length**: Modify `conversational_memory_length` in `main.py` to adjust conversation context length
-   **System Prompt**: Update the `system_prompt` in `main.py` to change the AI's personality and role
-   **Provider Settings**: Configure different AI providers in the `.env` file and `tools.yaml`

### Frontend Configuration

-   **API Endpoint**: Update the API service URL in `src/services/api.ts` if your backend runs on a different port
-   **Styling**: Modify Tailwind classes in the React components to customize the UI
-   **Model Display**: Customize model names and descriptions in the model selection dropdown component

## 🎨 Tech Stack

### Frontend

-   **React 18** with TypeScript
-   **Vite** for fast development and building
-   **Tailwind CSS** for styling
-   **Lucide React** for icons
-   **Model Selection UI** with dropdown component for switching AI models

### Backend

-   **Python** with FastAPI
-   **LangChain** for AI conversation management
-   **YAML** for configuration management
-   **Dynamic Model Switching** capability

## 🤖 Supported AI Models

MindEasy supports multiple AI model providers:

### Groq Models

-   LLaMA 3 8B (Fast, efficient)
-   LLaMA 3 70B (More capable, slower)
-   Mixtral 8x7B (Good balance)

### OpenAI Models

-   GPT-3.5 Turbo (Fast, cost-effective)
-   GPT-4 (Most capable)
-   GPT-4 Turbo (Latest version)

### Anthropic Models

-   Claude 3 Sonnet (Balanced performance)
-   Claude 3 Opus (Most capable)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## ⚠️ Important Notes

-   **API Keys**: Never commit your `.env` file or expose your AI provider API keys
-   **Development Only**: This setup is configured for development. For production, ensure proper security measures, HTTPS, and environment-specific configurations
-   **Rate Limits**: Be aware of different AI providers' rate limits and implement appropriate throttling if needed
-   **Model Costs**: Different models have different pricing structures. Monitor usage to control costs

## 🐛 Troubleshooting

### Common Issues

1. **Backend won't start**: Ensure your virtual environment is activated and all dependencies are installed
2. **Frontend can't connect to backend**: Check that the backend is running on the expected port and CORS is properly configured
3. **API errors**: Verify your AI provider API keys are valid and have sufficient credits
4. **Model switching fails**: Ensure the selected model is available and properly configured in your environment
5. **Missing models in dropdown**: Check that the models are properly defined in `tools.yaml` and corresponding API keys are set

### Getting Help

If you encounter any issues, please check the console logs (both browser and terminal) for detailed error messages and create an issue in the repository with the relevant error information.

## 🆕 Recent Updates

-   Added support for multiple AI model providers
-   Implemented dynamic model switching during conversations
-   Enhanced UI with model selection dropdown
-   Improved error handling for different AI providers
-   Added model performance and cost information display
