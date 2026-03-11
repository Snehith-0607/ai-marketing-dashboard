import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Upload,
  History,
  Pin,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  Sun,
  Moon,
  Sparkles,
  FileText,
  Zap,
  AlertCircle,
  LineChart,
  ExternalLink,
  Database,
  TrendingUp,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: any;
  path?: string;
  badge?: string;
  badgeColor?: string;
  children?: { label: string; path: string; badge?: string }[];
}

const menuItems: NavItem[] = [
  { label: "Artha Lens", icon: MessageSquare, path: "/chat" },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { label: "Overview", path: "/dashboard" },
      { label: "Analytics", path: "/dashboard/analytics" },
    ],
  },
  { label: "Upload Dataset", icon: Upload, path: "/upload" },
  { label: "History", icon: History, path: "/chat" },
];

const pinnedDashboards = [
  { id: 1, title: "Q3 Revenue Dashboard" },
  { id: 2, title: "Sales Performance" },
];

// Quick tool items for Artha Lens
const quickTools = [
  {
    id: "report",
    icon: FileText,
    label: "Generate Report",
    action: "report",
  },
  {
    id: "whatif",
    icon: Zap,
    label: "What-If Simulator",
    action: "whatif",
  },
  {
    id: "anomaly",
    icon: AlertCircle,
    label: "Anomaly Scan",
    action: "anomaly",
  },
  {
    id: "fullanalysis",
    icon: LineChart,
    label: "Full Analysis",
    action: "fullanalysis",
  },
  {
    id: "dashboard",
    icon: ExternalLink,
    label: "Full Dashboard",
    action: "dashboard",
  },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location, setLocation] = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"]);
  const [darkMode, setDarkMode] = useState(false);
  const [recentChats, setRecentChats] = useState<{ query: string; timestamp: number; sessionId: string }[]>([]);
  const [kpiData, setKpiData] = useState<any>(null);
  const [showQuickTools, setShowQuickTools] = useState(true);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", darkMode ? "light" : "dark");
  };

  // Load recent chats from localStorage
  useEffect(() => {
    const loadChats = () => {
      const stored = localStorage.getItem("queryHistory");
      if (stored) {
        try {
          const queries = JSON.parse(stored);
          if (Array.isArray(queries)) {
            const normalized = queries.map((item: any) =>
              typeof item === "string"
                ? { query: item, timestamp: Date.now(), sessionId: "" }
                : { query: item.query || "", timestamp: item.timestamp || Date.now(), sessionId: item.sessionId || "" }
            ).filter((h: any) => h.query);
            setRecentChats(normalized);
          }
        } catch {
          // ignore parse errors
        }
      }
    };

    loadChats();
    // Re-check every 2 seconds to stay in sync with chat.tsx
    const interval = setInterval(loadChats, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch KPI data (same endpoint as chat.tsx)
  useEffect(() => {
    fetch("http://localhost:8000/analysis")
      .then((r) => r.json())
      .then((data) => setKpiData(data))
      .catch(() => {});
  }, []);

  const isActive = (path?: string) => path === location;
  const isChildActive = (children?: { path: string }[]) =>
    children?.some((c) => c.path === location);

  const handleQuickToolClick = (action: string) => {
    if (action === "dashboard") {
      window.open("http://localhost:5000/dashboard/analytics", "_blank");
      return;
    }
    // Navigate to chat and dispatch a custom event so chat.tsx can handle the action
    if (location !== "/chat") {
      setLocation("/chat");
    }
    // Dispatch custom event for chat.tsx to pick up
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("artha-quick-action", { detail: { action } }));
    }, 100);
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all chat history?")) {
      setRecentChats([]);
      localStorage.removeItem("queryHistory");
      localStorage.removeItem("chatSessions");
      window.dispatchEvent(new CustomEvent("artha-quick-action", { detail: { action: "clearHistory" } }));
    }
  };

  const datasetName = (localStorage.getItem("uploadedFile") || "Nykaa Marketing").replace(".csv", "");
  const datasetRows = Number(localStorage.getItem("uploadedRows") || 55555).toLocaleString();

  const renderNavItem = (item: NavItem) => {
    const hasChildren = item.children && item.children.length > 0;
    const expanded = expandedItems.includes(item.label);
    const active = isActive(item.path) || isChildActive(item.children);

    return (
      <li key={item.label}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpand(item.label)}
              data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#465FFF] text-white"
                  : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1C2434]"
              }`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-5 h-5" />
                {item.label}
              </span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden ml-5 mt-1 space-y-0.5 border-l-2 border-[#E2E8F0] pl-4"
                >
                  {item.children!.map((child) => (
                    <li key={child.path}>
                      <Link
                        href={child.path}
                        data-testid={`nav-${child.label.toLowerCase().replace(/\s/g, "-")}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          isActive(child.path)
                            ? "text-[#465FFF] font-medium bg-[#EFF4FF]"
                            : "text-[#64748B] hover:text-[#1C2434] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </>
        ) : (
          <Link
            href={item.path || "/"}
            data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-[#465FFF] text-white"
                : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#1C2434]"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
            {item.badge && (
              <span className={`ml-auto text-xs px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                {item.badge}
              </span>
            )}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[280px] bg-white border-r border-[#E2E8F0] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 px-6 py-5 border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
          <div className="w-9 h-9 bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#1C2434]" data-testid="text-brand">Artha</h1>
        </Link>

        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 bg-[#F1F5F9] rounded-xl px-3 py-2.5">
            <Search className="w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-[#64748B] w-full placeholder:text-[#94A3B8]"
              data-testid="input-sidebar-search"
            />
            <kbd className="text-[10px] text-[#94A3B8] bg-white rounded px-1.5 py-0.5 border border-[#E2E8F0]">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          <ul className="space-y-1">{menuItems.map(renderNavItem)}</ul>

          {/* ─── Quick Tools (from inner sidebar) ─── */}
          <div className="mt-5">
            <button
              onClick={() => setShowQuickTools(!showQuickTools)}
              className="flex items-center justify-between w-full px-4 mb-1"
            >
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Quick Tools
              </p>
              {showQuickTools ? (
                <ChevronUp className="w-3.5 h-3.5 text-[#94A3B8]" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
              )}
            </button>
            <AnimatePresence>
              {showQuickTools && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-0.5 overflow-hidden"
                >
                  {quickTools.map((tool) => (
                    <li key={tool.id}>
                      <button
                        onClick={() => handleQuickToolClick(tool.action)}
                        data-testid={`quick-tool-${tool.id}`}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1C2434] transition-colors w-full text-left"
                      >
                        <tool.icon className="w-4 h-4" />
                        <span>{tool.label}</span>
                        {tool.action === "dashboard" && (
                          <ExternalLink className="w-3 h-3 ml-auto text-[#CBD5E1]" />
                        )}
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* ─── Active Dataset ─── */}
          <div className="mt-5 mx-1">
            <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#F1F5F9]">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-3.5 h-3.5 text-[#94A3B8]" />
                <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                  Active Dataset
                </p>
              </div>
              <p className="text-sm font-semibold text-[#1C2434] truncate">{datasetName}</p>
              <p className="text-xs text-[#465FFF] font-medium mt-0.5">{datasetRows} records</p>
            </div>
          </div>

          {/* ─── Live KPIs ─── */}
          {kpiData && (
            <div className="mt-3 mx-1">
              <div className="bg-[#F8FAFC] rounded-xl p-3 border border-[#F1F5F9]">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <p className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Live KPIs
                  </p>
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
                    className="flex justify-between items-center py-1"
                  >
                    <span className="text-xs text-[#94A3B8]">{kpi.label}</span>
                    <span className="text-xs font-bold text-[#1C2434]">{kpi.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── Recent Chats ─── */}
          <div className="mt-5">
            <div className="flex items-center justify-between px-4 mb-2">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Recent Chats
                {recentChats.length > 0 && (
                  <span className="ml-2 bg-[#465FFF] text-white text-[9px] px-1.5 py-0.5 rounded-full">
                    {recentChats.length}
                  </span>
                )}
              </p>
              <button className="p-1 rounded hover:bg-[#F1F5F9]" data-testid="button-new-chat">
                <Plus className="w-3.5 h-3.5 text-[#94A3B8]" />
              </button>
            </div>
            <ul className="space-y-0.5">
              {recentChats.length === 0 ? (
                <li>
                  <p className="text-xs text-gray-400 px-4 py-2">
                    No recent chats yet
                  </p>
                </li>
              ) : (
                recentChats.map((chat, i) => (
                  <li key={i}>
                    <button
                      onClick={() => {
                        if (location !== "/chat") {
                          setLocation("/chat");
                        }
                        if (chat.sessionId) {
                          setTimeout(() => {
                            window.dispatchEvent(new CustomEvent("artha-quick-action", {
                              detail: { action: "restoreSession", sessionId: chat.sessionId }
                            }));
                          }, 150);
                        }
                      }}
                      data-testid={`link-chat-${i}`}
                      className="flex flex-col gap-0.5 w-full text-left px-4 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1C2434] transition-colors"
                    >
                      <span className="truncate text-sm">{chat.query}</span>
                      <span className="text-[10px] text-[#CBD5E1]">
                        {new Date(chat.timestamp).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            {recentChats.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-[10px] text-[#CBD5E1] hover:text-[#EF4444] px-4 py-1 transition-colors"
              >
                Clear history
              </button>
            )}
          </div>

          {/* ─── Pinned ─── */}
          <div className="mt-5">
            <div className="flex items-center justify-between px-4 mb-2">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Pinned
              </p>
            </div>
            <ul className="space-y-0.5">
              {pinnedDashboards.map((d) => (
                <li key={d.id}>
                  <Link
                    href="/dashboard"
                    data-testid={`link-pinned-${d.id}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1C2434] transition-colors"
                  >
                    <Pin className="w-3.5 h-3.5" />
                    <span className="truncate">{d.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="px-4 py-4 border-t border-[#E2E8F0]">
          <div className="flex items-center justify-center bg-[#F1F5F9] rounded-xl p-1">
            <button
              onClick={() => !darkMode && toggleDarkMode()}
              data-testid="button-light-mode"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${
                !darkMode ? "bg-white text-[#1C2434] shadow-sm" : "text-[#64748B]"
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Light
            </button>
            <button
              onClick={() => darkMode && toggleDarkMode()}
              data-testid="button-dark-mode"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center ${
                darkMode ? "bg-white text-[#1C2434] shadow-sm" : "text-[#64748B]"
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              Dark
            </button>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1C2434]" data-testid="text-user-name">Artha User</p>
              <p className="text-xs text-[#64748B]">user@Artha.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
