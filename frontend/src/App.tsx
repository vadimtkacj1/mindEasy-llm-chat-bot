import React, { useState, useEffect } from "react";
import { Send, HeartPulse, MessageSquare, Bot, Settings } from "lucide-react";
import { sendMessage, getModels, updateModel } from "./services/api";

interface Message {
  content: string;
  isUser: boolean;
  timestamp: Date;
  model?: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello, I'm MindEase, your compassionate AI companion. How can I support you today?",
      isUser: false,
      timestamp: new Date(),
      model: 'llama3-8b-8192'
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [currentModel, setCurrentModel] = useState("llama3-8b-8192");
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [modelChangeStatus, setModelChangeStatus] = useState<{loading: boolean, error: string | null}>({loading: false, error: null});

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const response = await getModels();
      setAvailableModels(response.available_models);
      setCurrentModel(response.current_model);
    } catch (error) {
      console.error("Error fetching models:", error);
    }
  };

  const handleModelChange = async (model: string) => {
    if (model === currentModel) {
      setShowModelSelector(false);
      return;
    }

    try {
      setModelChangeStatus({loading: true, error: null});
      const response = await updateModel(model);
      setCurrentModel(response.current_model);
      
      // Add system message about model change
      const systemMessage: Message = {
        content: `AI model has been switched to ${model}. How can I assist you now?`,
        isUser: false,
        timestamp: new Date(),
        model
      };
      
      setMessages(prev => [...prev, systemMessage]);
      setShowModelSelector(false);
    } catch (error) {
      console.error("Error changing model:", error);
      setModelChangeStatus({loading: false, error: "Failed to switch model. Please try again."});
    } finally {
      setModelChangeStatus({loading: false, error: null});
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      isUser: true,
      timestamp: new Date(),
      model: currentModel
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await sendMessage({ message: input, model_name: currentModel });
      const aiResponse: Message = {
        content: response.response,
        isUser: false,
        timestamp: new Date(),
        model: response.current_model
      };

      // Update current model if it changed during the conversation
      if (response.current_model !== currentModel) {
        setCurrentModel(response.current_model);
      }
      
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error communicating with the backend:", error);
      const errorMessage: Message = {
        content: "I'm experiencing technical difficulties. Please try again later.",
        isUser: false,
        timestamp: new Date(),
        model: currentModel
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center gap-3">
          <HeartPulse className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">MindEase</h1>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 bg-white/20 text-white/90 text-sm px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
                disabled={modelChangeStatus.loading}
              >
                {modelChangeStatus.loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border-2 border-white/80 border-t-transparent rounded-full animate-spin"></div>
                    <span>Switching...</span>
                  </div>
                ) : (
                  <>
                    <Settings className="w-4 h-4" />
                    <span>{currentModel}</span>
                  </>
                )}
              </button>
              
              {showModelSelector && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10 overflow-hidden">
                  <div className="p-2 bg-gray-50 border-b">
                    <h3 className="text-sm font-medium text-gray-700">Select AI Model</h3>
                  </div>
                  <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
                    {availableModels.map((model) => (
                      <button
                        key={model}
                        onClick={() => handleModelChange(model)}
                        disabled={modelChangeStatus.loading}
                        className={`w-full text-left px-4 py-2 text-sm ${model === currentModel ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'} disabled:opacity-50`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{model}</span>
                          {model === currentModel && (
                            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">Current</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  {modelChangeStatus.error && (
                    <div className="p-2 bg-red-50 border-t border-red-100">
                      <p className="text-xs text-red-600">{modelChangeStatus.error}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl min-h-[600px] flex flex-col border border-white/20 overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-5 ${
                    message.isUser
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                      : "bg-gray-50 text-gray-800 border border-gray-100 shadow-sm"
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bot className="w-5 h-5 text-purple-600" />
                        <span className="font-medium text-purple-600">MindEase</span>
                      </div>
                      <span className="text-xs text-gray-500">{message.model}</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-2 block text-right">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 text-gray-800 rounded-2xl p-5 border border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                    <p className="text-sm">MindEase is thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-gray-100 p-5 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your thoughts..."
                className="flex-1 rounded-xl border border-gray-200 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-white shadow-sm"
                disabled={loading || modelChangeStatus.loading}
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl px-6 py-3 hover:from-indigo-600 hover:to-purple-600 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-80"
                disabled={loading || modelChangeStatus.loading || !input.trim()}
              >
                <Send className="w-5 h-5" />
                <span>Send</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              MindEase provides supportive listening but is not a substitute for professional help.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default App;