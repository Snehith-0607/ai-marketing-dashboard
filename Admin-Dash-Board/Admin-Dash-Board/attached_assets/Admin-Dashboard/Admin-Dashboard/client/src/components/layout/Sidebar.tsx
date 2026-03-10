import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  BarChart3,
  TrendingUp,
  Users,
  Package,
  Zap,
  Truck,
  Bot,
  Store,
  Calendar,
  User,
  ClipboardList,
  FileText,
  Table2,
  FileStack,
  MessageSquare,
  HelpCircle,
  Mail,
  ChevronDown,
  ChevronUp,
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
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    children: [
      { label: "Ecommerce", path: "/" },
      { label: "Analytics", path: "/analytics" },
      { label: "Marketing", path: "/marketing" },
      { label: "CRM", path: "/crm" },
      { label: "Stocks", path: "/stocks" },
    ],
  },
  { label: "Calendar", icon: Calendar, path: "/calendar" },
  { label: "User Profile", icon: User, path: "/profile" },
  {
    label: "Task",
    icon: ClipboardList,
    children: [
      { label: "Task List", path: "/tasks" },
      { label: "Task Kanban", path: "/tasks/kanban" },
    ],
  },
  {
    label: "Forms",
    icon: FileText,
    children: [
      { label: "Form Elements", path: "/forms/elements" },
      { label: "Form Layout", path: "/forms/layout" },
    ],
  },
  {
    label: "Tables",
    icon: Table2,
    children: [
      { label: "Basic Table", path: "/tables/basic" },
      { label: "Data Table", path: "/tables/data" },
    ],
  },
  {
    label: "Pages",
    icon: FileStack,
    children: [
      { label: "Settings", path: "/settings" },
      { label: "404 Error", path: "/404" },
    ],
  },
];

const supportItems: NavItem[] = [
  { label: "Chat", icon: MessageSquare, path: "/chat" },
  { label: "Support", icon: HelpCircle, path: "/support", badge: "NEW", badgeColor: "bg-emerald-500" },
  { label: "Email", icon: Mail, path: "/email" },
];

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [location] = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Dashboard"]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((i) => i !== label) : [...prev, label]
    );
  };

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
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
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
                        className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                          isActive(child.path)
                            ? "text-[#465FFF] font-medium bg-[#EFF4FF]"
                            : "text-[#64748B] hover:text-[#1C2434] hover:bg-[#F8FAFC]"
                        }`}
                      >
                        {child.label}
                        {child.badge && (
                          <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-emerald-500 text-white">
                            {child.badge}
                          </span>
                        )}
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
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
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
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#E2E8F0]">
          <div className="w-8 h-8 bg-[#465FFF] rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#1C2434]" data-testid="text-brand">NykaaAdmin</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3 px-4">
            Menu
          </p>
          <ul className="space-y-1">{menuItems.map(renderNavItem)}</ul>

          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mt-8 mb-3 px-4">
            Support
          </p>
          <ul className="space-y-1">{supportItems.map(renderNavItem)}</ul>
        </div>
      </aside>
    </>
  );
}
