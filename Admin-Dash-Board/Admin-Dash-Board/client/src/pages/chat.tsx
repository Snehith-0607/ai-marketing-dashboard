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

const TypingDots = () => (
  <div
    style={{
      display: "flex",
      gap: "4px",
      padding: "12px 16px",
      background: "white",
      borderRadius: "12px",
      width: "fit-content",
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    }}
  >
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#465FFF",
          animation: "bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
    <style>{`
      @keyframes bounce {
        0%,60%,100%{transform:translateY(0)}
        30%{transform:translateY(-6px)}
      }
    `}</style>
  </div>
);

const getDatasetKeywords = () => {
  const baseKeywords = [
    "top",
    "best",
    "worst",
    "highest",
    "lowest",
    "compare",
    "vs",
    "versus",
    "show",
    "analyze",
    "give",
    "what",
    "which",
    "how",
    "average",
    "total",
    "count",
    "trend",
    "chart",
    "graph",
    "report",
    "data",
    "analytics",
    "dashboard",
    "overview",
    "summary",
    "breakdown",
    "filter",
    "distribution",
    "correlation",
    "performance",
  ];

  try {
    const stored = localStorage.getItem("uploadedColumnNames");
    if (stored) {
      const cols: string[] = JSON.parse(stored);
      const colKeywords = cols.flatMap((col) => [
        col.toLowerCase(),
        col.toLowerCase().replace(/_/g, " "),
        col.toLowerCase().replace(/_/g, ""),
        col.toLowerCase().split("_")[0],
      ]);
      return [...baseKeywords, ...colKeywords];
    }
  } catch {
    // ignore
  }

  return [
    ...baseKeywords,
    "campaign",
    "channel",
    "revenue",
    "roi",
    "impression",
    "click",
    "lead",
    "conversion",
    "engagement",
    "language",
    "segment",
    "audience",
    "cost",
    "acquisition",
    "duration",
    "date",
    "influencer",
    "social",
    "email",
    "whatsapp",
    "youtube",
    "facebook",
    "google",
    "instagram",
    "nykaa",
    "marketing",
    "hindi",
    "english",
    "tamil",
    "telugu",
    "paid ads",
    "seo",
  ];
};

const isRelatedToDataset = (question: string) => {
  const q = question.toLowerCase();
  const keywords = getDatasetKeywords();
  return keywords.some((k) => q.includes(k));
};

const getDatasetName = () => {
  const file = localStorage.getItem("uploadedFile");
  return file
    ? file.replace(".csv", "").replace(/_/g, " ")
    : "Nykaa Marketing";
};

const getColumnList = () => {
  try {
    const stored = localStorage.getItem("uploadedColumnNames");
    if (stored) {
      const cols: string[] = JSON.parse(stored);
      return cols.slice(0, 8).join(", ");
    }
  } catch {
    // ignore
  }
  return "Campaign Type, Channel, Revenue, ROI, Impressions, Conversions, Language, Segment";
};

const isMultiChartQuery = (q: string) => {
  return [
    "full analysis",
    "complete analysis",
    "complete dashboard",
    "full dashboard",
    "all metrics",
    "full report",
    "everything",
    "overview",
    "summary report",
    "all channels",
    "all campaigns",
    "total analysis",
  ].some((k) => q.toLowerCase().includes(k));
};

const isReportQuery = (q: string) => {
  return [
    "generate report",
    "create report",
    "make report",
    "executive report",
    "full report",
    "write report",
    "generate a report",
    "create a report",
    "give me a report",
    "report on",
    "summarize everything",
    "overall report",
  ].some((k) => q.toLowerCase().includes(k));
};

const isWhatIfQuery = (q: string) => {
  return [
    "what if",
    "if we",
    "if i",
    "predict",
    "forecast",
    "increase",
    "decrease",
    "double",
    "reduce",
    "boost",
    "cut",
    "add more",
    "what would happen",
    "should we",
    "recommend",
    "optimize",
    "improve",
    "what happens if",
  ].some((k) => q.toLowerCase().includes(k));
};

const isFilterQuery = (q: string) => {
  return [
    "filter",
    "only show",
    "just show",
    "exclude",
    "remove",
    "hide",
    "without",
    "focus on",
    "drill down",
    "only",
    "now show",
    "update",
    "change to",
    "what about only",
    "narrow",
  ].some((k) => q.toLowerCase().includes(k));
};

const runAnomalyDetection = async (
  setScanningFn: (v: boolean) => void,
  setScanCompleteFn: (v: boolean) => void,
  setAnomaliesFn: (v: any[]) => void
) => {
  setScanningFn(true);
  try {
    const analysisRes = await fetch("http://localhost:8000/analysis");
    const analysis = await analysisRes.json();
    const kpis = analysis?.kpis || {};
    const charts = analysis?.charts || {};

    let datasetName = "dataset";
    let uploadedCols: string[] = [];
    try {
      const file = localStorage.getItem("uploadedFile");
      if (file) datasetName = file.replace(".csv", "");
      const stored = localStorage.getItem("uploadedColumnNames");
      if (stored) uploadedCols = JSON.parse(stored);
    } catch {}

    const kpiText = Object.entries(kpis)
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");

    const chartText = Object.entries(charts)
      .slice(0, 5)
      .map(([k, v]) => {
        const arr = v as any[];
        if (!arr?.length) return "";
        const sorted = [...arr].sort((a, b) => (b.value || 0) - (a.value || 0));
        const top = sorted[0];
        const bottom = sorted[sorted.length - 1];
        const avg =
          arr.reduce((s, i) => s + (i.value || 0), 0) / (arr.length || 1);
        const gap =
          top.value > 0
            ? (((top.value - (bottom.value || 0)) / top.value) * 100).toFixed(0)
            : 0;
        return `${k}: top="${top.name}"(${top.value}), bottom="${bottom.name}"(${bottom.value}), avg=${avg.toFixed(
          0
        )}, gap=${gap}%`;
      })
      .filter(Boolean)
      .join("\n");

    const anomalyPrompt = `
You are an expert data scientist doing automated anomaly detection on a business dataset.
Find the most important insights.

DATASET: ${datasetName}
COLUMNS: ${uploadedCols.join(", ")}
KPI DATA:
${kpiText}

CHART DATA ANALYSIS:
${chartText}

TOTAL RECORDS: ${analysis.rows}

Find exactly 3 insights from this data. Each insight must be ONE of these types:
- ANOMALY: Something unusual or unexpected
- OPPORTUNITY: An underutilized advantage
- ALERT: Something that needs attention
- WINNER: The top performer worth doubling down

For each insight use REAL numbers from above.
Respond ONLY with this exact JSON array, nothing else, no markdown:
[
  {
    "type": "ANOMALY or OPPORTUNITY or ALERT or WINNER",
    "emoji": "single relevant emoji",
    "title": "short punchy title under 8 words",
    "description": "1 sentence with real numbers from data",
    "metric": "the specific column this refers to",
    "value": "the key number as formatted string",
    "action": "one word action: Investigate/Capitalize/Fix/Scale",
    "severity": "high or medium or low",
    "color": "#ef4444 or #10b981 or #f59e0b"
  }
]
Use ONLY real numbers. Be specific. Return ONLY the JSON array.`;

    const aiResponse = await puter.ai.chat(anomalyPrompt);
    const responseText =
      typeof aiResponse === "string"
        ? aiResponse
        : (aiResponse as any)?.message?.content || "[]";
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON");
    const detected = JSON.parse(jsonMatch[0]);
    setAnomaliesFn(detected);
    setScanCompleteFn(true);
  } catch (e) {
    console.error("Anomaly scan failed:", e);
  } finally {
    setScanningFn(false);
  }
};

const mdToHtml = (md: string) => {
  return md
    .replace(
      /^# (.*)/gm,
      '<h1 style="font-size:20px;font-weight:800;color:#1e293b;margin:0 0 12px">$1</h1>'
    )
    .replace(
      /^## (.*)/gm,
      '<h2 style="font-size:15px;font-weight:700;color:#334155;margin:16px 0 8px">$1</h2>'
    )
    .replace(
      /^\d\. (.*)/gm,
      '<div style="margin:6px 0;color:#475569;font-size:13px">$&</div>'
    )
    .replace(
      /^[•\-\*] (.*)/gm,
      '<div style="margin:5px 0;padding-left:16px;color:#475569;font-size:13px">● $1</div>'
    )
    .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#1e293b">$1</strong>')
    .replace(/\n\n/g, '<div style="margin:8px 0"></div>');
};

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  showDashboard?: boolean;
  loading?: boolean;
  isError?: boolean;
   type?: "text" | "dashboard" | "multi-dashboard" | "whatif";
   chartType?: string;
   chartData?: any[];
   chartTitle?: string;
   insight?: string;
   suggestions?: string[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  color: string;
}

const suggestedActions = [
  {
    label: "Show revenue by campaign type",
    icon: "📊",
    color: "bg-blue-50 border-blue-100",
  },
  {
    label: "Which channel has highest ROI?",
    icon: "📈",
    color: "bg-purple-50 border-purple-100",
  },
  {
    label: "Compare conversions by language",
    icon: "🌍",
    color: "bg-green-50 border-green-100",
  },
  {
    label: "Show top performing campaigns",
    icon: "🏆",
    color: "bg-amber-50 border-amber-100",
  },
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
  const [queryHistory, setQueryHistory] = useState<string[]>(() => {
    try {
      const h = localStorage.getItem("queryHistory");
      return h ? JSON.parse(h) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("chat");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [kpiData, setKpiData] = useState<any | null>(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [lastChartData, setLastChartData] = useState<any[]>([]);
  const [lastChartTitle, setLastChartTitle] = useState("");
  const [lastChartType, setLastChartType] = useState("bar");
  const [shareCard, setShareCard] = useState<any | null>(null);
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [scanComplete, setScanComplete] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportContent, setReportContent] = useState("");
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    document.title = "Artha Lens - Artha";
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    fetch("http://localhost:8000/analysis")
      .then((r) => r.json())
      .then((d) => setKpiData(d))
      .catch(() => {});
  }, []);

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice not supported in this browser");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => {
        void handleSendMessage(transcript);
      }, 500);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoice = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  useEffect(() => {
    // Pre-initialize Puter.js silently to avoid login popup
    const initPuter = async () => {
      try {
        await window.puter?.ai?.chat("ready", {
          model: "gpt-4o",
          max_tokens: 1,
        });
      } catch {
        // silent fail is fine
      }
    };
    initPuter();
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    const question = userMessage;
    // ── STEP B: Detect if greeting or data question ───
    const greetingWords = [
      "hi",
      "hello",
      "hey",
      "thanks",
      "thank you",
      "ok",
      "okay",
      "bye",
      "good morning",
      "good evening",
      "good afternoon",
      "how are you",
      "what are you",
      "who are you",
      "what can you do",
      "help",
    ];

    const normalized = userMessage.toLowerCase().trim();
    const isGreeting = greetingWords.some(
      (word) =>
        normalized === word ||
        normalized.startsWith(word + " ") ||
        normalized.endsWith(" " + word)
    );

    // ── STEP C: Handle greeting with Puter.js only ────
    if (isGreeting) {
      try {
        const greetingPrompt = `You are Artha, an AI marketing analytics assistant. The user said: "${userMessage}". Reply in exactly ONE friendly sentence. Mention you can analyze marketing data like revenue, ROI, campaigns, and channels. Do not use bullet points. Be warm and brief.`;

        let greetingReply =
          "Hi! I'm Artha. Ask me about your marketing data — revenue, ROI, campaigns, and more!";

        try {
          const puterResponse = await window.puter.ai.chat(greetingPrompt, {
            model: "gpt-4o",
            max_tokens: 100,
          });
          if (puterResponse) {
            greetingReply = puterResponse.toString();
          }
        } catch (puterError) {
          console.log("Puter fallback:", puterError);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "assistant",
            content: greetingReply,
            type: "text",
            loading: false,
            isError: false,
          },
        ]);
      } catch (error) {
        console.error("Greeting error:", error);
      }
      return;
    }

    // Dataset scope check: if not related, refuse with guided message
    if (!isRelatedToDataset(question)) {
      const oosMessage = {
        id: Date.now(),
        type: "text" as const,
        role: "assistant" as const,
        content:
          `⚠️ I can only answer questions about the ${getDatasetName()} dataset.\n\n` +
          `This dataset contains:\n- ${getColumnList()}\n\n` +
          `Try asking things like:\n` +
          `- "Show me the top performing categories"\n` +
          `- "Which channel has the highest value?"\n` +
          `- "Compare performance by type"\n` +
          `- "Show trend over time"\n` +
          `- "Analyze by segment"`,
      };
      setMessages((prev) => [...prev, oosMessage]);
      return;
    }

    // What-if / predictive scenario handling
    if (isWhatIfQuery(question)) {
      setIsLoading(true);
      try {
        const analysisRes = await fetch("http://localhost:8000/analysis");
        const analysis = await analysisRes.json();
        const kpis = analysis?.kpis || {};
        const charts = analysis?.charts || {};

        let uploadedCols: string[] = [];
        let datasetName = "the dataset";
        try {
          const stored = localStorage.getItem("uploadedColumnNames");
          if (stored) uploadedCols = JSON.parse(stored);
          const file = localStorage.getItem("uploadedFile");
          if (file) datasetName = file.replace(".csv", "");
        } catch {
          // ignore localStorage errors
        }

        const kpiLines = Object.entries(kpis)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n      ");

        const chartLines = Object.entries(charts)
          .slice(0, 4)
          .map(
            ([k, v]) =>
              `${k}: ${JSON.stringify((v as any[])?.slice(0, 4))}`
          )
          .join("\n      ");

        const colLine =
          uploadedCols.length > 0
            ? `Dataset columns: ${uploadedCols.join(", ")}`
            : "Dataset: marketing campaign data";

        const whatIfPrompt = `
      You are an expert data analyst.
      
      DATASET: ${datasetName}
      ${colLine}
      
      REAL CURRENT DATA FROM DATABASE:
      ${kpiLines}
      
      CHART DATA:
      ${chartLines}
      
      User scenario: "${question}"
      
      Using ONLY the real numbers above,
      calculate predicted outcomes for this 
      scenario. Do NOT make up data.
      Use actual column names from this dataset.
      
      Find the most relevant metric from the 
      KPIs above that matches what user is asking.
      
      Respond ONLY with this exact JSON, 
      nothing else:
      
      {
        "scenario": "brief restatement",
        "currentState": {
          "metric": "actual column name from data",
          "value": actual_number_from_kpis,
          "label": "formatted string eg ₹124Cr or 4.2x"
        },
        "predictedState": {
          "metric": "same column name",
          "value": calculated_predicted_number,
          "label": "formatted predicted string"
        },
        "percentageChange": number,
        "confidence": "High or Medium or Low",
        "reasoning": "2 sentences using real numbers from the data above",
        "recommendation": "1 specific actionable recommendation",
        "risks": "1 sentence about risks or limitations",
        "breakdownData": [
          {
            "name": "actual category from chart data",
            "current": number,
            "predicted": number
          }
        ]
      }
      
      For breakdownData use the actual category 
      names from the chart data above.
      Generate 3 to 5 breakdown items.
      All numbers must be derived from real data.
      Return ONLY JSON. No markdown. No explanation.
    `;

        const aiResponse = await window.puter.ai.chat(whatIfPrompt);
        const responseText =
          typeof aiResponse === "string"
            ? aiResponse
            : (aiResponse as any)?.message?.content || "";

        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found");

        const prediction = JSON.parse(jsonMatch[0]);

        const whatIfMsg: any = {
          id: Date.now(),
          type: "whatif",
          role: "assistant",
          content: prediction?.reasoning || "",
          prediction,
          question,
        };

        setMessages((prev) => [...prev, whatIfMsg]);
        setIsLoading(false);
        return;
      } catch (e) {
        console.error("What-if failed:", e);
        setIsLoading(false);
        // fall through to normal query
      }
    }

    // Filter follow-up on last chart
    if (isFilterQuery(question) && lastChartData.length > 0) {
      setIsLoading(true);
      try {
        const filterPrompt = `
      You are a data filter assistant.
      
      Current chart data:
      ${JSON.stringify(lastChartData)}
      
      Chart title: ${lastChartTitle}
      
      User request: "${question}"
      
      Filter or transform this data based on 
      what the user asked.
      
      Rules:
      - If user says "only show X", keep only 
        items where name contains X
      - If user says "exclude X" or "remove X", 
        remove items where name contains X
      - If user says "top 3" or "top 5", 
        keep only that many items sorted by value
      - If user says "sort by value", 
        sort descending by value
      
      Return ONLY a valid JSON array like:
      [{"name": "...", "value": 123}]
      
      No explanation. Just the JSON array.
    `;

        const aiResponse = await window.puter.ai.chat(filterPrompt);
        const responseText =
          typeof aiResponse === "string"
            ? aiResponse
            : (aiResponse as any)?.message?.content || "[]";

        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("No JSON found");

        const filtered = JSON.parse(jsonMatch[0]);

        if (!Array.isArray(filtered) || filtered.length === 0) {
          throw new Error("Empty filter result");
        }

        const insight = await window.puter.ai.chat(
          `Chart "${lastChartTitle}" was filtered: 
      "${question}". 
      New data: ${JSON.stringify(filtered.slice(0, 3))}
      Give ONE sentence insight about this 
      filtered view. Be specific with numbers.`
        );

        const insightText =
          typeof insight === "string"
            ? insight
            : (insight as any)?.message?.content || "Filtered view applied.";

        setLastChartData(filtered);
        setLastChartTitle("Filtered: " + lastChartTitle);

        const filterMsg: Message = {
          id: Date.now(),
          type: "dashboard",
          role: "assistant",
          chartType: lastChartType,
          chartData: filtered,
          chartTitle: "🔍 Filtered: " + lastChartTitle,
          insight: insightText,
          content: insightText,
        };

        setMessages((prev) => [...prev, filterMsg]);

        const updatedHistory = [
          question,
          ...queryHistory.filter((q: string) => q !== question),
        ].slice(0, 6);
        setQueryHistory(updatedHistory);
        try {
          localStorage.setItem("queryHistory", JSON.stringify(updatedHistory));
        } catch {}

        setIsLoading(false);
        return;
      } catch (e) {
        console.error("Filter failed:", e);
        setIsLoading(false);
        // Fall through to normal query
      }
    }

    if (isReportQuery(question)) {
      generateExecutiveReport();
      return;
    }

    // Multi-chart dashboard query
    if (isMultiChartQuery(question)) {
      setIsLoading(true);

      let q1 = "show revenue by campaign type";
      let q2 = "ROI by channel";
      let q3 = "conversions by language";

      try {
        const stored = localStorage.getItem("uploadedColumnNames");
        if (stored) {
          const cols: string[] = JSON.parse(stored);
          const textCols = cols.filter((c: string) =>
            ![
              "id",
              "date",
              "score",
              "cost",
              "roi",
              "revenue",
              "clicks",
              "leads",
              "impressions",
              "conversions",
            ].some((k) => c.toLowerCase().includes(k))
          );
          const numCols = cols.filter((c: string) =>
            [
              "revenue",
              "roi",
              "conversion",
              "impression",
              "click",
              "engagement",
            ].some((k) => c.toLowerCase().includes(k))
          );
          if (textCols[0] && numCols[0])
            q1 = `show ${numCols[0]} by ${textCols[0]}`;
          if (textCols[1] && numCols[1])
            q2 = `${numCols[1]} by ${textCols[1]}`;
          if (textCols[2] && numCols[0])
            q3 = `compare ${textCols[2]} by ${numCols[0]}`;
        }
      } catch {
        // ignore and keep defaults
      }

      try {
        const [res1, res2, res3] = await Promise.all([
          fetch("http://localhost:8000/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: q1 }),
          }),
          fetch("http://localhost:8000/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: q2 }),
          }),
          fetch("http://localhost:8000/query", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: q3 }),
          }),
        ]);

        const [d1, d2, d3] = await Promise.all([
          res1.json(),
          res2.json(),
          res3.json(),
        ]);

        const overallInsight = await window.puter.ai.chat(
          `Given these 3 marketing charts:
      Chart 1 - ${d1.title}: ${JSON.stringify(d1.data?.slice(0, 3))}
      Chart 2 - ${d2.title}: ${JSON.stringify(d2.data?.slice(0, 3))}
      Chart 3 - ${d3.title}: ${JSON.stringify(d3.data?.slice(0, 3))}
      Give ONE sentence executive summary 
      of overall marketing performance.`
        );

        const overallText =
          typeof overallInsight === "string"
            ? overallInsight
            : (overallInsight as any)?.message?.content ||
              "Full analysis complete.";

        const multiMsg: any = {
          id: Date.now(),
          type: "multi-dashboard",
          role: "assistant",
          content: overallText,
          charts: [d1, d2, d3],
          insight: overallText,
        };

        setMessages((prev) => [...prev, multiMsg]);

        const updatedHistory = [
          question,
          ...queryHistory.filter((q: string) => q !== question),
        ].slice(0, 6);
        setQueryHistory(updatedHistory);
        try {
          localStorage.setItem("queryHistory", JSON.stringify(updatedHistory));
        } catch {}

        setIsLoading(false);
        return;
      } catch (e) {
        console.error("Multi-chart failed:", e);
        setIsLoading(false);
        // fall through to normal flow
      }
    }

    // ── STEP A: Show thinking animation for data questions ──────────────
    setIsLoading(true);
    setLoadingStep(0);

    const loadingId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        role: "assistant",
        content: "",
        loading: true,
        type: "dashboard",
      },
    ]);

    for (let i = 0; i < loadingSteps.length; i++) {
      setLoadingStep(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    // ── STEP D: Handle data question ──────────────────
    try {
      // Get dataset context from localStorage
      const storedColumns = localStorage.getItem("uploadedColumnNames");
      const storedRows = localStorage.getItem("uploadedRows");
      const columns = storedColumns
        ? JSON.parse(storedColumns)
        : [
            "Campaign_Type",
            "Target_Audience",
            "Duration",
            "Channel_Used",
            "Impressions",
            "Clicks",
            "Leads",
            "Conversions",
            "Revenue",
            "Acquisition_Cost",
            "ROI",
            "Language",
            "Engagement_Score",
            "Customer_Segment",
            "Date",
          ];
      const totalRows = storedRows || "55555";

      // Call backend for real data
      let queryResult: any = null;
      try {
        const backendRes = await fetch("http://localhost:8000/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: userMessage }),
        });
        if (backendRes.ok) {
          queryResult = await backendRes.json();
      }
      } catch (backendError) {
        console.log("Backend error:", backendError);
      }

      const result = queryResult;

      if (result?.empty || !result?.data || result.data.length === 0) {
        try {
          const helpText = await window.puter.ai.chat(
            `The user asked: "${question}"
    The database returned no results.
    Backend message: "${result?.insight || ""}"
    
    Give a helpful 2 sentence response explaining:
    1. Why there might be no data
    2. What they should try instead
    
    Be friendly and specific.`
          );

          const helpMsg =
            typeof helpText === "string"
              ? helpText
              : (helpText as any)?.message?.content || result?.insight;

          const emptyMsg: Message = {
            id: Date.now(),
            type: "text",
            role: "assistant",
            content:
              `🔍 No data found for that query.\n\n${helpMsg}\n\n` +
              `Try these instead:\n- ${
                result?.suggestions?.join("\n- ") ||
                "Show revenue by campaign type"
              }`,
          };

          setMessages((prev) => [...prev, emptyMsg]);
          setIsLoading(false);
          return;
        } catch (e) {
          console.error("Empty-result helper failed:", e);
          setIsLoading(false);
          return;
        }
      }

      // Build data summary for Puter.js
      const dataSummary =
        queryResult?.data?.length > 0
          ? `Query results (first 10 rows): ${JSON.stringify(
              queryResult.data.slice(0, 10)
            )}`
          : `No specific query results available.`;

      // Call Puter.js for smart insight
      const insightPrompt = `You are Artha, an expert 
data analyst. 

The user asked: "${userMessage}"

Dataset has ${totalRows} rows.
Available columns: ${columns.join(", ")}

Query result data:
${JSON.stringify(queryResult?.data?.slice(0, 15) ?? [])}

Write exactly 2 sentences of insight.
Rules:
- Be specific with numbers from the data
- Mention the highest and lowest values
- Use appropriate units (₹Crores for large revenue, 
  % for rates, K/M for large counts)
- Sound like a professional data analyst
- If data is empty, suggest what the user can ask
- Do not use bullet points or markdown
- Do not repeat the question`;

      let aiInsight =
        queryResult?.insight ||
        "Based on the dataset analysis, here are the key findings for your query.";

      try {
        const puterInsight = await window.puter.ai.chat(insightPrompt, {
          model: "gpt-4o",
          max_tokens: 150,
          temperature: 0.3,
        });
        if (puterInsight) {
          aiInsight = puterInsight.toString();
        }
      } catch (puterError) {
        console.log("Puter insight fallback:", puterError);
      }

      // Build smart suggestions based on question
      const suggestionPrompt = `User asked: "${userMessage}"
Dataset columns: ${columns.join(", ")}

Generate 4 follow-up questions using ONLY 
the actual column names from the dataset above.
Questions should be specific and analytical.

Return ONLY a JSON array of 4 strings.
No explanation. No markdown. Just the array.
Example format: ["Q1", "Q2", "Q3", "Q4"]`;

      let suggestions =
        queryResult?.suggestions || [
          "Which channel has highest ROI?",
          "Compare conversions by language",
          "Show top performing campaigns",
          "Revenue trend by month",
        ];

      try {
        const puterSuggestions = await window.puter.ai.chat(
          suggestionPrompt,
          {
            model: "gpt-4o",
            max_tokens: 100,
            temperature: 0.5,
          }
        );
        if (puterSuggestions) {
          const cleaned = puterSuggestions
            .toString()
            .replace(/```json|```/g, "")
            .trim();
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed) && parsed.length > 0) {
            suggestions = parsed;
          }
        }
      } catch {
        // keep default suggestions
      }

      // Build final response
      const finalResponse = {
        chart: result?.chart || "bar",
        title: userMessage,
        data: result?.data || [],
        insight: aiInsight,
        suggestions: suggestions,
      };

      // Show AI response with DashboardPreview
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content: finalResponse.insight,
                loading: false,
                showDashboard: true,
                isError: false,
                type: "dashboard",
                chartType: finalResponse.chart,
                chartData: finalResponse.data,
                chartTitle: finalResponse.title,
                insight: finalResponse.insight,
                suggestions: finalResponse.suggestions,
              }
            : m
        )
      );

      const updatedHistory = [
        question,
        ...queryHistory.filter((q: string) => q !== question),
      ].slice(0, 6);
      setQueryHistory(updatedHistory);
      try {
        localStorage.setItem("queryHistory", JSON.stringify(updatedHistory));
      } catch {}

      setLastChartData(finalResponse.data || []);
      setLastChartTitle(finalResponse.title || "");
      setLastChartType(finalResponse.chart || "bar");
    } catch (error) {
      console.error("Data question error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === loadingId
            ? {
                ...m,
                content:
                  "I had trouble analyzing that. Please make sure the backend is running at localhost:8000 and try again.",
                loading: false,
                showDashboard: false,
                isError: true,
                type: "text",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
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

  const handleSuggestionClick = (suggestion: string) => {
    if (!suggestion.trim() || isLoading) return;
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: suggestion,
      type: "text",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    void handleSendMessage(suggestion);
  };

  const hasMessages = messages.length > 0;
  const lastAssistantMessage = messages
    .filter((m) => m.role === "assistant" && !m.loading)
    .slice(-1)[0];
  const lastAssistantMessageId = lastAssistantMessage?.id;

  const generateExecutiveReport = async () => {
    setGeneratingReport(true);
    setShowReport(true);
    try {
      const analysisRes = await fetch("http://localhost:8000/analysis");
      const analysis = await analysisRes.json();
      const kpis = analysis?.kpis || {};
      const charts = analysis?.charts || {};

      let datasetName = "Marketing Dataset";
      let uploadedCols: string[] = [];
      try {
        const file = localStorage.getItem("uploadedFile");
        if (file) datasetName = file.replace(".csv", "");
        const stored = localStorage.getItem("uploadedColumnNames");
        if (stored) uploadedCols = JSON.parse(stored);
      } catch {}

      const kpiSummary = Object.entries(kpis)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");

      const chartSummary = Object.entries(charts)
        .slice(0, 4)
        .map(([k, v]) => {
          const top = (v as any[])?.[0];
          return `${k}: top is ${top?.name} with ${top?.value}`;
        })
        .join(". ");

      const reportPrompt = `
You are a senior marketing analyst writing an executive report for C-suite stakeholders.

Dataset: ${datasetName}
Columns: ${uploadedCols.join(", ")}
KPIs: ${kpiSummary}
Top insights: ${chartSummary}
Total records: ${analysis.rows}

Write a professional executive report with these exact sections using markdown:

# Executive Summary
2-3 sentences on overall performance.

## Key Performance Highlights
3 bullet points with REAL numbers.

## Top Performing Segments
2-3 bullet points from actual chart data.

## Areas of Concern
2 bullet points about what needs attention.

## Strategic Recommendations
3 numbered actionable recommendations based on the real data.

## Conclusion
1 paragraph closing statement.

Use ONLY real numbers from the data above. Be specific. Be concise. Sound executive. Use markdown formatting.`;

      const aiResponse = await puter.ai.chat(reportPrompt);
      const report =
        typeof aiResponse === "string"
          ? aiResponse
          : (aiResponse as any)?.message?.content || "";
      setReportContent(report);
    } catch (e) {
      setReportContent(
        "Failed to generate report. Please try again."
      );
    } finally {
      setGeneratingReport(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      runAnomalyDetection(setScanning, setScanComplete, setAnomalies);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout title="Artha Lens">
      {shareCard && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShareCard(null)}
        >
          <div
            id="share-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "28px",
              width: "360px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#465FFF",
                }}
              >
                ⚡ Artha
              </div>
              <div
                style={{ fontSize: "10px", color: "#94a3b8" }}
              >
                AI-Generated Insight
              </div>
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#1e293b",
                marginBottom: "8px",
              }}
            >
              {shareCard.title}
            </div>

            {shareCard.data?.[0] && (
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #465FFF22, #7B8AFF22)",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    color: "#465FFF",
                  }}
                >
                  {typeof shareCard.data[0].value === "number"
                    ? shareCard.data[0].value > 1000000
                      ? "₹" +
                        (shareCard.data[0].value / 10000000).toFixed(
                          1
                        ) +
                        "Cr"
                      : shareCard.data[0].value > 1000
                      ? (
                          shareCard.data[0].value / 1000
                        ).toFixed(1) + "K"
                      : shareCard.data[0].value.toFixed(1)
                    : shareCard.data[0].value}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                  }}
                >
                  {shareCard.data[0].name}
                </div>
              </div>
            )}

            <div
              style={{
                fontSize: "12px",
                color: "#475569",
                lineHeight: 1.6,
                marginBottom: "16px",
                padding: "10px",
                background: "#f8fafc",
                borderRadius: "8px",
              }}
            >
              🧠 {shareCard.insight}
            </div>

            <div
              style={{
                fontSize: "10px",
                color: "#cbd5e1",
                textAlign: "center",
              }}
            >
              Generated by Artha •{" "}
              {new Date().toLocaleDateString()}
            </div>

            <button
              onClick={() => setShareCard(null)}
              style={{
                width: "100%",
                marginTop: "12px",
                padding: "10px",
                background: "#465FFF",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div
        className="h-[calc(100vh-112px)]"
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: sidebarOpen ? "220px" : "48px",
            flexShrink: 0,
            background: "white",
            borderRight: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.25s ease",
            overflow: "hidden",
            height: "100vh",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              padding: "14px 12px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              flexShrink: 0,
            }}
          >
            {sidebarOpen && (
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #465FFF, #7B8AFF)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "-0.3px",
                }}
              >
                Artha
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "transparent",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                flexShrink: 0,
                color: "#94a3b8",
              }}
            >
              {sidebarOpen ? "‹‹" : "››"}
            </button>
          </div>

          <div
            style={{
              padding: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "2px",
              flexShrink: 0,
            }}
          >
            {sidebarOpen && (
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#cbd5e1",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  padding: "4px 8px 6px",
                }}
              >
                Navigation
              </div>
            )}
            {[
              {
                id: "chat",
                icon: "▣",
                label: "Chat",
                action: () => setActiveSection("chat"),
              },
              {
                id: "report",
                icon: "▤",
                label: "Generate Report",
                action: () => generateExecutiveReport(),
              },
              {
                id: "whatif",
                icon: "◈",
                label: "What-If Simulator",
                action: () => {
                  setActiveSection("chat");
                  setInput("What if we double the top channel budget?");
                },
              },
              {
                id: "anomaly",
                icon: "◎",
                label: "Anomaly Scan",
                action: () => {
                  setActiveSection("chat");
                  setMessages([]);
                  setScanComplete(false);
                  runAnomalyDetection(setScanning, setScanComplete, setAnomalies);
                },
              },
              {
                id: "fullanalysis",
                icon: "▦",
                label: "Full Analysis",
                action: () => void handleSendMessage("give me full analysis"),
              },
              {
                id: "dashboard",
                icon: "▢",
                label: "Full Dashboard",
                action: () => window.open("http://localhost:5000", "_blank"),
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  item.action();
                }}
                title={!sidebarOpen ? item.label : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 10px",
                  borderRadius: "8px",
                  border: "none",
                  background: activeSection === item.id ? "#465FFF" : "transparent",
                  color: activeSection === item.id ? "white" : "#475569",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: activeSection === item.id ? 600 : 500,
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== item.id)
                    (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== item.id)
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    flexShrink: 0,
                    opacity: 0.7,
                    fontFamily: "monospace",
                  }}
                >
                  {item.icon}
                </span>
                {sidebarOpen && (
                  <span
                    style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "12px",
                    }}
                  >
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </div>

          {sidebarOpen && (
            <div
              style={{
                margin: "4px 8px 0",
                padding: "10px 12px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #f1f5f9",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#cbd5e1",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "6px",
                }}
              >
                Active Dataset
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#1e293b",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginBottom: "2px",
                }}
              >
                {(localStorage.getItem("uploadedFile") || "Nykaa Marketing").replace(
                  ".csv",
                  ""
                )}
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#465FFF",
                  fontWeight: 500,
                }}
              >
                {Number(localStorage.getItem("uploadedRows") || 55555).toLocaleString()} records
              </div>
            </div>
          )}

          {sidebarOpen && kpiData && (
            <div
              style={{
                margin: "6px 8px 0",
                padding: "10px 12px",
                background: "#f8fafc",
                borderRadius: "8px",
                border: "1px solid #f1f5f9",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#cbd5e1",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: "8px",
                }}
              >
                Live KPIs
              </div>
              {[
                {
                  label: "Revenue",
                  value: kpiData?.kpis?.total_revenue
                    ? "₹" + (kpiData.kpis.total_revenue / 10000000).toFixed(1) + "Cr"
                    : "—",
                },
                {
                  label: "Avg ROI",
                  value: kpiData?.kpis?.avg_roi ? kpiData.kpis.avg_roi + "x" : "—",
                },
                {
                  label: "Top Channel",
                  value: kpiData?.kpis?.top_channel || "—",
                },
                {
                  label: "Conversions",
                  value: kpiData?.kpis?.total_conversions
                    ? Number(kpiData.kpis.total_conversions).toLocaleString()
                    : "—",
                },
              ].map((kpi, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <span style={{ fontSize: "10px", color: "#94a3b8" }}>{kpi.label}</span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#1e293b" }}>
                    {kpi.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div style={{ flex: 1 }} />

          {sidebarOpen && (
            <div
              style={{
                padding: "8px",
                borderTop: "1px solid #f1f5f9",
                flexShrink: 0,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  color: "#cbd5e1",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  padding: "2px 8px 8px",
                }}
              >
                Recent Queries
              </div>
              {queryHistory.length === 0 && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "#cbd5e1",
                    textAlign: "center",
                    padding: "8px 0",
                  }}
                >
                  No history yet
                </div>
              )}
              {queryHistory.map((q: string, i: number) => (
                <button
                  key={i}
                  onClick={() => void handleSendMessage(q)}
                  title={q}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 8px",
                    borderRadius: "6px",
                    border: "none",
                    background: "transparent",
                    color: "#94a3b8",
                    cursor: "pointer",
                    fontSize: "11px",
                    textAlign: "left",
                    width: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc";
                    (e.currentTarget as HTMLButtonElement).style.color = "#475569";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
                  }}
                >
                  <span style={{ fontSize: "9px", flexShrink: 0, opacity: 0.5 }}>↺</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{q}</span>
                </button>
              ))}
              {queryHistory.length > 0 && (
                <button
                  onClick={() => {
                    setQueryHistory([]);
                    localStorage.removeItem("queryHistory");
                  }}
                  style={{
                    fontSize: "9px",
                    color: "#e2e8f0",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px 8px",
                    width: "100%",
                    textAlign: "left",
                  }}
                >
                  Clear history
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {!hasMessages ? (
            <div className="flex-1 flex flex-col items-center justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-2xl"
              >
                <h1
                  className="text-4xl sm:text-5xl font-bold text-[#1C2434] mb-4"
                  data-testid="text-welcome-title"
                >
                  Welcome to Artha
                </h1>
                <p className="text-gray-500 mb-6 text-base">
                  Get started by asking a task and Chat can do the rest. Not
                  sure where to start?
                </p>

                <button
                  onClick={generateExecutiveReport}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "10px 20px",
                    background:
                      "linear-gradient(135deg, #465FFF, #7B8AFF)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    marginBottom: "16px",
                    boxShadow:
                      "0 4px 12px rgba(70,95,255,0.3)",
                  }}
                >
                  📄 Generate Executive Report
                </button>

                {scanning && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "10px 16px",
                      background:
                        "linear-gradient(135deg, #465FFF11, #7B8AFF11)",
                      borderRadius: "12px",
                      marginBottom: "16px",
                      border: "1px solid #465FFF33",
                      width: "100%",
                      maxWidth: "640px",
                      marginInline: "auto",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#465FFF",
                        animation: "pulse 1s infinite",
                      }}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#465FFF",
                        fontWeight: 500,
                      }}
                    >
                      🔍 AI scanning your dataset for insights...
                    </span>
                  </div>
                )}

                {scanComplete && anomalies.length > 0 && (
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "640px",
                      marginBottom: "20px",
                      marginInline: "auto",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#94a3b8",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        ⚡ AI Auto-Detected Insights
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          background: "#f1f5f9",
                          padding: "2px 8px",
                          borderRadius: "20px",
                        }}
                      >
                        {anomalies.length} found
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {anomalies.map((anomaly, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            const autoQ = `Analyze ${anomaly.metric} in detail`;
                            handleSendMessage(autoQ);
                          }}
                          style={{
                            background: "white",
                            borderRadius: "12px",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            boxShadow:
                              "0 1px 4px rgba(0,0,0,0.06)",
                            border: `1px solid ${anomaly.color}33`,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            borderLeft: `4px solid ${anomaly.color}`,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLDivElement).style.transform =
                              "translateX(4px)";
                            (e.currentTarget as HTMLDivElement).style.boxShadow =
                              "0 4px 12px rgba(0,0,0,0.1)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLDivElement).style.transform =
                              "translateX(0)";
                            (e.currentTarget as HTMLDivElement).style.boxShadow =
                              "0 1px 4px rgba(0,0,0,0.06)";
                          }}
                        >
                          <div style={{ fontSize: "20px" }}>
                            {anomaly.emoji}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                marginBottom: "2px",
                              }}
                            >
                              <span
                                style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: anomaly.color,
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {anomaly.type}
                              </span>
                              <span
                                style={{
                                  fontSize: "10px",
                                  background:
                                    anomaly.color + "22",
                                  color: anomaly.color,
                                  padding: "1px 6px",
                                  borderRadius: "10px",
                                  fontWeight: 600,
                                }}
                              >
                                {anomaly.severity}
                              </span>
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#1e293b",
                                marginBottom: "2px",
                              }}
                            >
                              {anomaly.title}
                            </div>
                            <div
                              style={{
                                fontSize: "11px",
                                color: "#64748b",
                                lineHeight: 1.4,
                              }}
                            >
                              {anomaly.description}
                            </div>
                          </div>
                          <div
                            style={{
                              textAlign: "right",
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                fontSize: "15px",
                                fontWeight: 700,
                                color: anomaly.color,
                                marginBottom: "4px",
                              }}
                            >
                              {anomaly.value}
                            </div>
                            <div
                              style={{
                                fontSize: "10px",
                                background: anomaly.color,
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "20px",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              {anomaly.action} →
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "8px",
                      }}
                    >
                      <button
                        onClick={() =>
                          runAnomalyDetection(
                            setScanning,
                            setScanComplete,
                            setAnomalies
                          )
                        }
                        style={{
                          fontSize: "11px",
                          background: "transparent",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "4px 12px",
                          cursor: "pointer",
                          color: "#94a3b8",
                        }}
                      >
                        ↺ Rescan Dataset
                      </button>
                    </div>
                  </div>
                )}

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "12px",
                    marginBottom: "24px",
                    width: "100%",
                    maxWidth: "640px",
                    marginInline: "auto",
                  }}
                >
                  {[
                    {
                      label: "Total Revenue",
                      value: kpiData?.kpis?.total_revenue
                        ? "₹" +
                          (kpiData.kpis.total_revenue / 10000000).toFixed(1) +
                          "Cr"
                        : "...",
                      color: "#465FFF",
                    },
                    {
                      label: "Impressions",
                      value: kpiData?.kpis?.total_impressions
                        ? (
                            kpiData.kpis.total_impressions / 1000000
                          ).toFixed(1) + "M"
                        : "...",
                      color: "#7B8AFF",
                    },
                    {
                      label: "Avg ROI",
                      value: kpiData?.kpis?.avg_roi
                        ? kpiData.kpis.avg_roi + "x"
                        : "...",
                      color: "#10b981",
                    },
                    {
                      label: "Top Channel",
                      value: kpiData?.kpis?.top_channel || "...",
                      color: "#f59e0b",
                    },
                  ].map((kpi, i) => (
                    <div
                      key={i}
                      style={{
                        background: "white",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                        borderTop: `3px solid ${kpi.color}`,
                      }}
                    >
                      <div
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          marginBottom: "4px",
                        }}
                      >
                        {kpi.label}
                      </div>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          color: "#1e293b",
                        }}
                      >
                        {kpi.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto mb-12">
                  {suggestedActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(action.label)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${action.color} hover:shadow-md transition-all duration-200 text-left`}
                      data-testid={`button-action-${action.label
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      <span className="text-xl">{action.icon}</span>
                      <span className="text-sm font-medium text-[#1C2434]">
                        {action.label}
                      </span>
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
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-3xl ${
                        msg.role === "user" ? "order-2" : "order-1"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] rounded-lg flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-[#1C2434]">Artha</span>
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
                          {msg.type === "whatif" ? (
                            (() => {
                              const p: any = (msg as any).prediction;
                              if (!p) {
                                return (
                                  <div
                                    className={`rounded-2xl px-5 py-3 ${
                                      msg.role === "user"
                                        ? "bg-[#465FFF] text-white"
                                        : "bg-[#F8FAFC] text-[#1C2434] border border-[#E2E8F0]"
                                    }`}
                                  >
                                    <p className="text-sm leading-relaxed">
                                      {msg.content}
                                    </p>
                                  </div>
                                );
                              }
                              const isPositive =
                                typeof p.percentageChange === "number" &&
                                p.percentageChange > 0;
                              return (
                                <div
                                  style={{
                                    maxWidth: "540px",
                                    marginBottom: "16px",
                                  }}
                                >
                                  <div
                                    style={{
                                      background:
                                        "linear-gradient(135deg,#1e293b,#334155)",
                                      borderRadius: "16px 16px 0 0",
                                      padding: "14px 16px",
                                      color: "white",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "10px",
                                        color: "#94a3b8",
                                        textTransform: "uppercase",
                                        letterSpacing: "1px",
                                        marginBottom: "4px",
                                      }}
                                    >
                                      🔮 AI Prediction
                                    </div>
                                    <div
                                      style={{
                                        fontSize: "13px",
                                        fontWeight: 600,
                                      }}
                                    >
                                      {p.scenario}
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      display: "grid",
                                      gridTemplateColumns: "1fr auto 1fr",
                                      background: "white",
                                      padding: "20px 16px",
                                      alignItems: "center",
                                      gap: "8px",
                                      border: "1px solid #f1f5f9",
                                    }}
                                  >
                                    <div style={{ textAlign: "center" }}>
                                      <div
                                        style={{
                                          fontSize: "10px",
                                          color: "#94a3b8",
                                          marginBottom: "4px",
                                        }}
                                      >
                                        CURRENT
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "22px",
                                          fontWeight: 800,
                                          color: "#1e293b",
                                        }}
                                      >
                                        {p.currentState?.label}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "10px",
                                          color: "#64748b",
                                        }}
                                      >
                                        {p.currentState?.metric}
                                      </div>
                                    </div>

                                    <div
                                      style={{
                                        fontSize: "24px",
                                        color: isPositive ? "#10b981" : "#ef4444",
                                      }}
                                    >
                                      →
                                    </div>

                                    <div style={{ textAlign: "center" }}>
                                      <div
                                        style={{
                                          fontSize: "10px",
                                          color: "#94a3b8",
                                          marginBottom: "4px",
                                        }}
                                      >
                                        PREDICTED
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "22px",
                                          fontWeight: 800,
                                          color: isPositive
                                            ? "#10b981"
                                            : "#ef4444",
                                        }}
                                      >
                                        {p.predictedState?.label}
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          fontWeight: 600,
                                          color: isPositive
                                            ? "#10b981"
                                            : "#ef4444",
                                        }}
                                      >
                                        {isPositive ? "▲" : "▼"}{" "}
                                        {Math.abs(
                                          p.percentageChange || 0
                                        )}
                                        %
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      background: "white",
                                      padding: "12px 16px",
                                      border: "1px solid #f1f5f9",
                                      borderTop: "none",
                                    }}
                                  >
                                    {p.breakdownData?.map(
                                      (item: any, i: number) => (
                                        <div key={i} style={{ marginBottom: 8 }}>
                                          <div
                                            style={{
                                              fontSize: "11px",
                                              color: "#64748b",
                                              marginBottom: "3px",
                                            }}
                                          >
                                            {item.name}
                                          </div>
                                          <div
                                            style={{
                                              display: "flex",
                                              gap: "4px",
                                              alignItems: "center",
                                            }}
                                          >
                                            <div
                                              style={{
                                                height: "8px",
                                                width: `${Math.min(
                                                  ((item.current ||
                                                    0) /
                                                    (p.currentState?.value ||
                                                      1)) *
                                                    120,
                                                  120
                                                )}px`,
                                                background: "#e2e8f0",
                                                borderRadius: "4px",
                                                minWidth: "4px",
                                              }}
                                            />
                                            <div
                                              style={{
                                                height: "8px",
                                                width: `${Math.min(
                                                  ((item.predicted ||
                                                    0) /
                                                    (p.currentState?.value ||
                                                      1)) *
                                                    120,
                                                  120
                                                )}px`,
                                                background: isPositive
                                                  ? "#10b981"
                                                  : "#ef4444",
                                                borderRadius: "4px",
                                                minWidth: "4px",
                                              }}
                                            />
                                          </div>
                                        </div>
                                      )
                                    )}
                                    <div
                                      style={{
                                        display: "flex",
                                        gap: "12px",
                                        marginTop: "6px",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          color: "#94a3b8",
                                        }}
                                      >
                                        ▪ Current
                                      </span>
                                      <span
                                        style={{
                                          fontSize: "10px",
                                          color: isPositive
                                            ? "#10b981"
                                            : "#ef4444",
                                        }}
                                      >
                                        ▪ Predicted
                                      </span>
                                    </div>
                                  </div>

                                  <div
                                    style={{
                                      background: "#f8fafc",
                                      padding: "14px 16px",
                                      borderRadius: "0 0 16px 16px",
                                      border: "1px solid #f1f5f9",
                                      borderTop: "none",
                                    }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "#475569",
                                        lineHeight: 1.6,
                                        marginBottom: "10px",
                                      }}
                                    >
                                      📊 {p.reasoning}
                                    </div>
                                    <div
                                      style={{
                                        background: isPositive
                                          ? "#f0fdf4"
                                          : "#fef2f2",
                                        border: `1px solid ${
                                          isPositive ? "#bbf7d0" : "#fecaca"
                                        }`,
                                        borderRadius: "8px",
                                        padding: "10px 12px",
                                        marginBottom: "8px",
                                      }}
                                    >
                                      <div
                                        style={{
                                          fontSize: "11px",
                                          fontWeight: 600,
                                          color: isPositive
                                            ? "#15803d"
                                            : "#dc2626",
                                          marginBottom: "2px",
                                        }}
                                      >
                                        💡 Recommendation
                                      </div>
                                      <div
                                        style={{
                                          fontSize: "12px",
                                          color: isPositive
                                            ? "#166534"
                                            : "#991b1b",
                                        }}
                                      >
                                        {p.recommendation}
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                      }}
                                    >
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          color: "#94a3b8",
                                        }}
                                      >
                                        ⚠️ {p.risks}
                                      </span>
                                      <span
                                        style={{
                                          background:
                                            p.confidence === "High"
                                              ? "#dcfce7"
                                              : p.confidence === "Medium"
                                              ? "#fef9c3"
                                              : "#fee2e2",
                                          color:
                                            p.confidence === "High"
                                              ? "#15803d"
                                              : p.confidence === "Medium"
                                              ? "#854d0e"
                                              : "#dc2626",
                                          padding: "2px 8px",
                                          borderRadius: "20px",
                                          fontSize: "10px",
                                          fontWeight: 600,
                                        }}
                                      >
                                        {p.confidence} Confidence
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()
                          ) : msg.type === "text" || !msg.type ? (
                            <div
                              className={`rounded-2xl px-5 py-3 ${
                                msg.role === "user"
                                  ? "bg-[#465FFF] text-white"
                                  : "bg-[#F8FAFC] text-[#1C2434] border border-[#E2E8F0]"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">
                                {msg.content}
                              </p>
                            </div>
                          ) : (
                            <>
                              <div
                                className={`rounded-2xl px-5 py-3 ${
                                  msg.role === "user"
                                    ? "bg-[#465FFF] text-white"
                                    : "bg-[#F8FAFC] text-[#1C2434] border border-[#E2E8F0]"
                                }`}
                              >
                                <p className="text-sm leading-relaxed">
                                  {msg.content}
                                </p>
                              </div>

                              {msg.role === "assistant" &&
                                !msg.loading &&
                                lastAssistantMessageId === msg.id && (
                                  <div className="mt-4">
                                    <DashboardPreview
                                      chartType={msg.chartType || "bar"}
                                      chartData={msg.chartData || []}
                                      chartTitle={
                                        msg.chartTitle || "Analysis Result"
                                      }
                                      insight={msg.insight || msg.content}
                                    />
                                  </div>
                                )}

                              {msg.role === "assistant" &&
                                !msg.loading &&
                                lastAssistantMessageId === msg.id &&
                                msg.suggestions &&
                                msg.suggestions.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {msg.suggestions.map((s, index) => (
                                      <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(s)}
                                        className="px-3 py-1.5 rounded-full bg-[#EFF4FF] text-xs text-[#465FFF] font-medium hover:bg-[#E0E7FF] transition-colors"
                                      >
                                        {s}
                                      </button>
                                    ))}
                                  </div>
                                )}

                          {msg.role === "assistant" &&
                            msg.type === "dashboard" &&
                            !msg.loading && (
                              <button
                                onClick={() =>
                                  setShareCard({
                                    title: msg.chartTitle,
                                    insight: msg.insight,
                                    data: msg.chartData,
                                    type: msg.chartType,
                                  })
                                }
                                style={{
                                  fontSize: "11px",
                                  background: "transparent",
                                  border: "1px solid #e2e8f0",
                                  borderRadius: "6px",
                                  padding: "4px 12px",
                                  cursor: "pointer",
                                  color: "#64748b",
                                  marginTop: "8px",
                                }}
                              >
                                ↗ Share Insight
                              </button>
                            )}
                            </>
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
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-3xl order-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] rounded-lg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-[#1C2434]">
                          Artha
                        </span>
                      </div>
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
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
                    onClick={isListening ? stopVoice : startVoice}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      border: "none",
                      background: isListening ? "#ef4444" : "#f1f5f9",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.2s",
                      flexShrink: 0,
                      animation: isListening ? "pulse 1s infinite" : "none",
                    }}
                    title={isListening ? "Stop" : "Voice input"}
                  >
                    {isListening ? "🔴" : "🎤"}
                  </button>
                  <style>{`
                    @keyframes pulse {
                      0%,100%{transform:scale(1)}
                      50%{transform:scale(1.1)}
                    }
                  `}</style>
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
                    "Show top performing campaigns",
                  ].map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(q)}
                      className="text-xs text-[#465FFF] hover:text-[#3A50E0] font-medium transition-colors"
                      data-testid={`button-suggestion-${i}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-center text-[10px] text-[#94A3B8] mt-3">
                Artha may generate inaccurate information about people, places, or facts. Model: Artha v1.0
              </p>
            </div>
          </div>
        </div>

        <div className="hidden xl:block w-72 border-l border-[#E2E8F0] bg-white rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#1C2434]">
                Recent Chats <span className="text-[#94A3B8]">({queryHistory.length})</span>
              </h3>
              <button className="p-1 rounded hover:bg-[#F1F5F9]" data-testid="button-projects-menu">
                <MoreHorizontal className="w-4 h-4 text-[#94A3B8]" />
              </button>
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-56px)]">
            {queryHistory.map((q, index) => (
              <div
                key={`${q}-${index}`}
                className="px-4 py-3 border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                data-testid={`card-recent-${index}`}
                onClick={() => handleSendMessage(q)}
              >
                <p className="text-sm font-medium text-[#1C2434] truncate">{q}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5 truncate">Saved query</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showReport && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              width: "100%",
              maxWidth: "680px",
              maxHeight: "85vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                padding: "20px 24px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background:
                  "linear-gradient(135deg, #465FFF, #7B8AFF)",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  📄 AI Executive Report
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "rgba(255,255,255,0.7)",
                    marginTop: "2px",
                  }}
                >
                  Generated by Artha •{" "}
                  {new Date().toLocaleDateString()}
                </div>
              </div>
              <button
                onClick={() => setShowReport(false)}
                style={{
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  padding: "6px 12px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                ✕ Close
              </button>
            </div>

            <div
              style={{
                padding: "24px",
                overflowY: "auto",
                flex: 1,
              }}
            >
              {generatingReport ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 0",
                  }}
                >
                  <div
                    style={{
                      fontSize: "32px",
                      marginBottom: "12px",
                    }}
                  >
                    ⚡
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#475569",
                      fontWeight: 500,
                    }}
                  >
                    AI is analyzing your data...
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      marginTop: "6px",
                    }}
                  >
                    Generating executive insights
                  </div>
                </div>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: mdToHtml(reportContent),
                  }}
                />
              )}
            </div>

            {!generatingReport && (
              <div
                style={{
                  padding: "16px 24px",
                  borderTop: "1px solid #f1f5f9",
                  display: "flex",
                  gap: "8px",
                }}
              >
                <button
                  onClick={() => {
                    const el = document.createElement("a");
                    const blob = new Blob([reportContent], {
                      type: "text/plain",
                    });
                    el.href = URL.createObjectURL(blob);
                    el.download = "Artha-Report.txt";
                    el.click();
                  }}
                  style={{
                    padding: "8px 16px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "#475569",
                    fontWeight: 500,
                  }}
                >
                  ⬇ Download Report
                </button>
                <button
                  onClick={generateExecutiveReport}
                  style={{
                    padding: "8px 16px",
                    background: "#465FFF",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontSize: "12px",
                    color: "white",
                    fontWeight: 500,
                  }}
                >
                  ↺ Regenerate
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
