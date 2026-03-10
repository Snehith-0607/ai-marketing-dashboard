import { Search, Menu, Bell, MessageSquare, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({ onMenuToggle, title }: { onMenuToggle: () => void; title?: string }) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-[#E2E8F0] px-4 lg:px-6">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-[#F1F5F9] text-[#64748B]"
            data-testid="button-menu-toggle"
          >
            <Menu className="w-5 h-5" />
          </button>

          {title && (
            <h2 className="text-lg font-semibold text-[#1C2434]" data-testid="text-page-title">{title}</h2>
          )}

          <div className="hidden sm:flex items-center gap-2 bg-[#F1F5F9] rounded-xl px-4 py-2.5 min-w-[300px]">
            <Search className="w-4 h-4 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search or type command..."
              className="bg-transparent border-none outline-none text-sm text-[#64748B] w-full placeholder:text-[#94A3B8]"
              data-testid="input-header-search"
            />
            <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-[#94A3B8] bg-white rounded-md border border-[#E2E8F0]">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="bg-gradient-to-r from-[#465FFF] to-[#7B8AFF] text-white rounded-full px-4 text-xs font-medium hidden sm:flex items-center gap-1.5"
            data-testid="button-upgrade"
          >
            <Zap className="w-3.5 h-3.5" />
            Upgrade
          </Button>

          <button
            className="relative p-2.5 rounded-xl hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
            data-testid="button-notifications"
            onClick={() => alert("No new notifications at this time.")}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <button
            className="relative p-2.5 rounded-xl hover:bg-[#F1F5F9] text-[#64748B] transition-colors"
            data-testid="button-messages"
            onClick={() => alert("No new messages. Start a conversation in AI Chat!")}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#465FFF] rounded-full" />
          </button>

          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-[#E2E8F0] cursor-pointer hover:opacity-80 transition-opacity" onClick={() => alert("Profile Settings\n\nUser: InsightAI User\nEmail: user@insightai.com\nPlan: Pro")}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#465FFF] to-[#7B8AFF] flex items-center justify-center text-white text-sm font-semibold">
              A
            </div>
            <ChevronDown className="w-4 h-4 text-[#64748B] hidden md:block" />
          </div>
        </div>
      </div>
    </header>
  );
}
