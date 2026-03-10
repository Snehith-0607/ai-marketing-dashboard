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

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"]);
  const [darkMode, setDarkMode] = useState(false);
  const [recentChats, setRecentChats] = useState<string[]>([]);

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

  useEffect(() => {
    const stored = localStorage.getItem("queryHistory");
    if (stored) {
      try {
        const queries = JSON.parse(stored);
        if (Array.isArray(queries)) {
          setRecentChats(queries);
        }
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  const isActive = (path?: string) => path === location;
  const isChildActive = (children?: { path: string }[]) =>
    children?.some((c) => c.path === location);

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

          <div className="mt-6">
            <div className="flex items-center justify-between px-4 mb-2">
              <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Recent Chats
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
                    <Link
                      href="/chat"
                      data-testid={`link-chat-${i}`}
                      className="flex items-center justify-between px-4 py-2 rounded-lg text-sm text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1C2434] transition-colors"
                    >
                      <span className="truncate">{chat}</span>
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="mt-6">
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
