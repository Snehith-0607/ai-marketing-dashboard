import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Mic,
  BookOpen,
  Sparkles,
  Plus,
  Loader2,
  MoreHorizontal,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import DashboardPreview from "@/components/dashboard/DashboardPreview";
import { queryAI } from "@/lib/api";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  showDashboard?: boolean;
  loading?: boolean;
  isError?: boolean;
}

interface Project {
  id: number;
  title: string;
  description: string;
  color: string;
}

const suggestedActions = [
  { label: "Show revenue by campaign type", icon: "📊", color: "bg-blue-50 border-blue-100" },
  { label: "Which channel has highest ROI?", icon: "📈", color: "bg-purple-50 border-purple-100" },
  { label: "Compare conversions by region", icon: "🌍", color: "bg-green-50 border-green-100" },
  { label: "Top performing campaigns", icon: "🏆", color: "bg-amber-50 border-amber-100" },
];

const projects: Project[] = [
  { id: 1, title: "New Project", description: "...", color: "bg-white" },
  { id: 2, title: "Learning From 100 Years o...", description: "For athletes, high altitude prod...", color: "bg-amber-100" },
  { id: 3, title: "Research officiants", description: "Maxwell's equations—the foun...", color: "bg-rose-100" },
  { id: 4, title: "What does a senior lead de...", description: "Physiological respiration involv...", color: "bg-amber-100" },
  { id: 5, title: "Write a sweet note to your...", description: "In the eighteenth century the G...", color: "bg-green-100" },
  { id: 6, title: "Meet with cake bakers", description: "Physical space is often conceiv...", color: "bg-blue-100" },
  { id: 7, title: "Meet with cake bakers", description: "Physical space is often conceiv...", color: "bg-blue-100" },
];

const loadingSteps = [
  "Analyzing dataset...",
  "Generating SQL query...",
  "Selecting chart types...",
  "Rendering dashboard...",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [dashboardData, setDashboardData] = useState<{
    chartType: string;
    chartData: any[];
    chartTitle: string;
    insight: string;
  } | null>(null);
  const [currentSuggestions, setCurrentSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = "AI Chat - InsightAI";
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("queryHistory");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentQueries(parsed);
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    setIsLoading(true);
    setLoadingStep(0);

    const loadingId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      { id: loadingId, role: "assistant", content: "", loading: true },
    ]);

    // Detect greetings — reply with a greeting, don't call backend
    const greetings = ["hi", "hello", "hey", "hii", "hiii", "good morning", "good evening", "good afternoon", "sup", "what's up", "howdy"];
    const isGreeting = greetings.some(g => userMessage.toLowerCase().trim() === g || userMessage.toLowerCase().trim().startsWith(g + " ") || userMessage.toLowerCase().trim().startsWith(g + "!"));

    if (isGreeting) {
      // Skip loading animation for greetings
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: `Hey there! 👋 I'm InsightAI — your data analytics assistant. Ask me anything about your uploaded dataset! For example:\n\n• "Show revenue by campaign type"\n• "Which channel has the highest ROI?"\n• "Compare conversions by region"`,
                loading: false,
                showDashboard: false,
                isError: false,
              }
            : m
        )
      );
      setCurrentSuggestions([
        "Show revenue by campaign type",
        "Which channel has highest ROI?",
        "Compare conversions by region",
        "Top performing campaigns",
      ]);
      setIsLoading(false);
      return;
    }

    for (let i = 0; i < loadingSteps.length; i++) {
      setLoadingStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    let response: any;
    try {
      // Build context from localStorage (set during file upload)
      const storedColumns = localStorage.getItem("uploadedColumnNames");
      const storedRows = localStorage.getItem("uploadedRows");
      const context = {
        columns: storedColumns ? JSON.parse(storedColumns) : [],
        rows: storedRows ? parseInt(storedRows) : 0,
        dataset: "Marketing Campaign Data",
      };
      response = await queryAI(userMessage, context);
    } catch {
      response = { error: "Backend not reachable. Please start the backend server." };
    }

    try {
      const history = JSON.parse(localStorage.getItem("queryHistory") || "[]");
      if (Array.isArray(history)) {
        history.unshift(userMessage);
        const trimmed = history.slice(0, 5);
        localStorage.setItem("queryHistory", JSON.stringify(trimmed));
        setRecentQueries(trimmed);
      } else {
        localStorage.setItem("queryHistory", JSON.stringify([userMessage]));
        setRecentQueries([userMessage]);
      }
    } catch {
      // ignore storage errors
    }

    if (response?.error) {
      const errorText =
        "Backend not reachable. Please start the backend server.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: errorText,
                loading: false,
                showDashboard: false,
                isError: true,
              }
            : m
        )
      );
      setDashboardData(null);
      setCurrentSuggestions([]);
      setIsLoading(false);
      return;
    }

    const chartType = response.chart;
    const chartData = response.data || [];
    const chartTitle = response.title || "Analysis Result";
    const insight = response.insight || "";
    const suggestions: string[] = Array.isArray(response.suggestions)
      ? response.suggestions
      : [];

    setDashboardData({
      chartType,
      chartData,
      chartTitle,
      insight,
    });
    setCurrentSuggestions(suggestions);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === loadingId
          ? {
              ...m,
              content: insight || "Here are the insights from your data.",
              loading: false,
              showDashboard: true,
              isError: false,
            }
          : m
      )
    );
    setIsLoading(false);
  };

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const text = input;
    const userMsg: Message = { id: Date.now(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    void handleSendMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    inputRef.current?.focus();
    if (!isLoading) {
      const userMsg: Message = { id: Date.now(), role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      void handleSendMessage(text);
    }
  };

  const hasMessages = messages.length > 0;
  const lastAssistantMessageId =
    messages.filter((m) => m.role === "assistant").slice(-1)[0]?.id;

  return (
    <AppLayout title="AI Chat">
      <div className="flex gap-6 h-[calc(100vh-112px)]">
        <div className="flex-1 flex flex-col">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
              >
                <h1 className="text-4xl sm:text-5xl font-bold text-[#1C2434] mb-4" data-testid="text-welcome-title">
                  Welcome to InsightAI
                </h1>
                <p className="text-gray-500 mb-10 text-base">
                  Get started by asking a task and Chat can do the rest. Not sure where to start?
                </p>

                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto mb-12">
                  {suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(action.label)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${action.color} hover:shadow-md transition-all duration-200 text-left`}
                      data-testid={`button-action-${action.label.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <span className="text-xl">{action.icon}</span>
                      <span className="text-sm font-medium text-[#1C2434]">{action.label}</span>
                      <Plus className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`max-w-3xl ${msg.role === "user" ? "order-2" : "order-1"}`}>
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-[#1C2434]">InsightAI</span>
                        </div>
                      )}

                      {msg.loading ? (
                        <div className="bg-[#F8FAFC] rounded-2xl p-5 border border-[#E2E8F0]">
                          <div className="space-y-3">
                            {loadingSteps.map((step, i) => (
                              <div key={i} className="flex items-center gap-3">
                                {i <= loadingStep ? (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                      i < loadingStep
                                        ? "bg-emerald-500"
                                        : "bg-[#465FFF]"
                                    }`}
                                  >
                                    {i < loadingStep ? (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <Loader2 className="w-3 h-3 text-white animate-spin" />
                                    )}
                                  </motion.div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                                )}
                                <span className={`text-sm ${i <= loadingStep ? "text-[#1C2434]" : "text-gray-400"}`}>
                                  {step}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div
                            className={`rounded-2xl px-5 py-3 ${
                              msg.role === "user"
                                ? "bg-[#465FFF] text-white"
                                : "bg-[#F8FAFC] text-[#1C2434] border border-[#E2E8F0]"
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                          </div>

                          {msg.role === "assistant" &&
                            !msg.loading &&
                            lastAssistantMessageId === msg.id &&
                            currentSuggestions.length > 0 && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {currentSuggestions.map((s, index) => (
                                  <button
                                    key={index}
                                    onClick={() => handleSuggestion(s)}
                                    className="px-3 py-1.5 rounded-full bg-[#EFF4FF] text-xs text-[#465FFF] font-medium hover:bg-[#E0E7FF] transition-colors"
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}

                          {msg.showDashboard &&
                            dashboardData &&
                            lastAssistantMessageId === msg.id && (
                              <div className="mt-4">
                                <DashboardPreview
                                  chartType={dashboardData.chartType}
                                  chartData={dashboardData.chartData}
                                  chartTitle={dashboardData.chartTitle}
                                  insight={dashboardData.insight}
                                />
                              </div>
                            )}

                          {msg.role === "assistant" && !msg.loading && (
                            <div className="flex items-center gap-1 mt-2">
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" data-testid="button-copy">
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" data-testid="button-thumbs-up">
                                <ThumbsUp className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" data-testid="button-thumbs-down">
                                <ThumbsDown className="w-3.5 h-3.5" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400" data-testid="button-regenerate">
                                <RefreshCw className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>
          )}

          <div className="px-4 pb-4">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm">
                <div className="flex items-center gap-2 px-4 py-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask a question about your data..."
                    className="flex-1 text-sm text-[#1C2434] placeholder:text-[#94A3B8] outline-none bg-transparent"
                    data-testid="input-chat-message"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-lg bg-[#465FFF] text-white disabled:opacity-40 hover:bg-[#3A50E0] transition-colors"
                    data-testid="button-send-message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-4 px-4 pb-3 border-t border-[#F1F5F9]">
                  <button className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1C2434] transition-colors py-1.5" data-testid="button-attach">
                    <Paperclip className="w-3.5 h-3.5" />
                    Attach
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1C2434] transition-colors py-1.5" data-testid="button-voice">
                    <Mic className="w-3.5 h-3.5" />
                    Voice Message
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#1C2434] transition-colors py-1.5" data-testid="button-prompts">
                    <BookOpen className="w-3.5 h-3.5" />
                    Browse Prompts
                  </button>
                  <span className="ml-auto text-[10px] text-[#94A3B8]">{input.length} / 3,000</span>
                </div>
              </div>

              {!hasMessages && (
                <div className="flex items-center justify-center gap-4 mt-4">
                  <p className="text-xs text-[#94A3B8]">Try asking:</p>
                  {[
                    "Show revenue by campaign type",
                    "Which channel has highest ROI?",
                    "Compare conversions by language",
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestion(q)}
                      className="text-xs text-[#465FFF] hover:text-[#3A50E0] font-medium transition-colors"
                      data-testid={`button-suggestion-${i}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-center text-[10px] text-[#94A3B8] mt-3">
                InsightAI may generate inaccurate information about people, places, or facts. Model: InsightAI v1.0
              </p>
            </div>
          </div>
        </div>

        <div className="hidden xl:block w-72 border-l border-[#E2E8F0] bg-white rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1C2434]">
                Recent Chats <span className="text-[#94A3B8]">({recentQueries.length})</span>
              </h3>
              <button className="p-1 rounded hover:bg-[#F1F5F9]" data-testid="button-projects-menu">
                <MoreHorizontal className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-56px)]">
            {recentQueries.map((q, index) => (
              <div
                key={`${q}-${index}`}
                className="px-4 py-3 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                data-testid={`card-recent-${index}`}
              >
                <p className="text-sm font-medium text-[#1C2434] truncate">{q}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5 truncate">Saved query</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
