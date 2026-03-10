import { useState, useEffect } from "react";
import { Search, Menu, Bell, MessageSquare, Sun, Moon, ChevronDown } from "lucide-react";

export default function Header({ onMenuToggle }: { onMenuToggle: () => void }) {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E2E8F0] px-4 lg:px-6">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
            data-testid="button-menu-toggle"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-[#F1F5F9] rounded-lg px-4 py-2.5 min-w-[300px]">
            <Search className="w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search or type command..."
              className="bg-transparent border-none outline-none text-sm text-[#64748B] w-full placeholder:text-[#94A3B8]"
              data-testid="input-search"
            />
            <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-[#94A3B8] bg-white rounded border border-[#E2E8F0]">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
            data-testid="button-theme-toggle"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            className="relative p-2.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            className="relative p-2.5 rounded-lg hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
            data-testid="button-messages"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#465FFF] rounded-full" />
          </button>

          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-[#E2E8F0]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] flex items-center justify-center text-white text-sm font-semibold">
              M
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-[#1C2434]" data-testid="text-username">Musharof</p>
              <p className="text-xs text-[#64748B]">Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-[#64748B] hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
