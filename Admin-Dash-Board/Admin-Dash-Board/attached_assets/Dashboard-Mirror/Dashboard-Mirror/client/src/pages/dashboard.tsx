import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell
} from "recharts";
import {
  LayoutDashboard, BarChart3, Package, ShoppingCart,
  Percent, AppWindow, Plus, Search, Filter,
  Settings, HelpCircle, ChevronRight,
  ArrowUpRight, ArrowDownRight, ChevronDown,
  Bell, Facebook, Globe, Instagram, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const salesData = [
  { month: "Jan", sales: 4200, visitors: 3800 },
  { month: "Feb", sales: 3800, visitors: 4200 },
  { month: "Mar", sales: 5100, visitors: 3600 },
  { month: "Apr", sales: 4600, visitors: 4800 },
  { month: "May", sales: 5400, visitors: 5200 },
  { month: "Jun", sales: 7200, visitors: 6100 },
  { month: "Jul", sales: 6800, visitors: 5800 },
  { month: "Aug", sales: 7600, visitors: 6400 },
  { month: "Sep", sales: 8200, visitors: 7100 },
  { month: "Oct", sales: 7400, visitors: 6800 },
  { month: "Nov", sales: 9100, visitors: 7900 },
  { month: "Dec", sales: 8600, visitors: 8200 },
];

const conversionData = [
  { name: "Added to Cart", value: 3842, change: "+1.8%" },
  { name: "Reached Checkout", value: 1256, change: "-1.2%" },
  { name: "Purchased", value: 649, change: "+2.4%" },
];

const channelsData = [
  { name: "Facebook", icon: Facebook, percent: 28, total: 6958, color: "#1877F2" },
  { name: "Instagram", icon: Instagram, percent: 23, total: 5716, color: "#E4405F" },
  { name: "Google", icon: Globe, percent: 32, total: 7952, color: "#4285F4" },
];

const retentionData = Array.from({ length: 12 }, (_, i) =>
  Array.from({ length: 7 }, (_, j) => ({
    week: i + 1,
    day: j,
    value: Math.floor(Math.random() * 100),
  }))
).flat();

const radarData = [
  { emotion: "Happiness", A: 85, B: 70 },
  { emotion: "Excitement", A: 65, B: 60 },
  { emotion: "Love", A: 70, B: 55 },
  { emotion: "Disgust", A: 25, B: 30 },
  { emotion: "Anger", A: 20, B: 35 },
  { emotion: "Fear", A: 15, B: 25 },
  { emotion: "Surprise", A: 50, B: 45 },
  { emotion: "Sadness", A: 30, B: 40 },
];

const revenueMonthly = [
  { month: "Feb", value: 68000 },
  { month: "Mar", value: 72000 },
  { month: "Apr", value: 65000 },
  { month: "May", value: 80000 },
  { month: "Jun", value: 95000 },
  { month: "Jul", value: 88000 },
];

const mainNavItems = [
  { icon: LayoutDashboard, label: "Overview", page: "overview" },
  { icon: BarChart3, label: "Analytics", page: "analytics" },
  { icon: Package, label: "Products", page: "products" },
  { icon: ShoppingCart, label: "Orders", page: "orders" },
  { icon: Percent, label: "Discounts", page: "discounts" },
  { icon: AppWindow, label: "Apps", page: "apps" },
];

const channelItems = [
  { icon: Facebook, label: "Facebook" },
  { icon: Globe, label: "Online Store" },
  { icon: Instagram, label: "Instagram" },
];

function Sidebar({ activePage, onNavigate, mobileOpen, onCloseMobile }: {
  activePage: string;
  onNavigate: (page: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/30 z-40 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100
        transform transition-transform duration-200 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-screen
      `}>
        <div className="p-4 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-sm font-bold">
              C
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900" data-testid="text-company-name">Catalyst</p>
              <p className="text-xs text-gray-400">Marketing & Sales</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">MAIN</p>
            <div className="space-y-0.5">
              {mainNavItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => { onNavigate(item.page); onCloseMobile(); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activePage === item.page
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600'
                  }`}
                  data-testid={`button-nav-${item.page}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.page === "overview" && (
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">SALES CHANNELS</p>
              <Plus className="w-3 h-3 text-gray-400 cursor-pointer" />
            </div>
            <div className="space-y-0.5">
              {channelItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 font-medium"
                  data-testid={`button-channel-${item.label.toLowerCase().replace(' ', '-')}`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 font-medium" data-testid="button-settings">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 font-medium" data-testid="button-support">
            <HelpCircle className="w-4 h-4" /> Support
          </button>
        </div>

        <div className="p-4 border-t border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">
              JB
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate" data-testid="text-user-name">James Brown</p>
              <p className="text-xs text-gray-400 truncate">james@alignui.com</p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </aside>
    </>
  );
}

function DashboardHeader() {
  return (
    <header className="border-b border-gray-100 bg-white px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-sm font-bold">
            JB
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900" data-testid="text-welcome">James Brown</h1>
            <p className="text-xs text-gray-400">Welcome back to Catalyst</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" data-testid="button-search">
            <Search className="w-4 h-4 text-gray-500" />
          </Button>
          <Button size="icon" variant="ghost" data-testid="button-notifications">
            <Bell className="w-4 h-4 text-gray-500" />
          </Button>
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5 border border-gray-100">
            <span className="text-xs text-gray-500">Last month</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
          <Button size="sm" variant="ghost" className="hidden sm:flex text-xs text-gray-500" data-testid="button-filter">
            <Filter className="w-3 h-3 mr-1" /> Filter by
          </Button>
          <Button className="bg-orange-500 text-white text-xs rounded-lg hidden sm:flex" data-testid="button-new-product">
            <Plus className="w-3 h-3 mr-1" /> New Products
          </Button>
        </div>
      </div>
    </header>
  );
}

function KPICard({ title, value, change, positive, action, children }: {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  action?: string;
  children?: any;
}) {
  return (
    <Card className="p-4 bg-white border-gray-100" data-testid={`card-kpi-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between gap-1 mb-3">
        <p className="text-sm text-gray-500">{title}</p>
        {action && <span className="text-xs text-gray-400 cursor-pointer">{action}</span>}
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
          positive ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'
        }`}>
          {change}
        </span>
      </div>
      {children}
    </Card>
  );
}

function OverviewPage() {
  const [salesPeriod, setSalesPeriod] = useState("1Y");
  const periods = ["1D", "1W", "1M", "3M", "1Y"];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <KPICard title="Total Sales" value="$128.32" change="+2%" positive={true} action="Report">
          <div className="flex gap-1 mt-2 mb-3">
            {periods.map(p => (
              <button
                key={p}
                className={`px-2 py-1 rounded text-[10px] font-medium ${
                  salesPeriod === p ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500'
                }`}
                onClick={() => setSalesPeriod(p)}
                data-testid={`button-period-${p}`}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <Line type="monotone" dataKey="sales" stroke="#F97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="visitors" stroke="#E5E7EB" strokeWidth={1.5} dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1.5">
            {[
              { name: "Online Store", value: "$52.12", change: "+4.5%", positive: true },
              { name: "Facebook", value: "$38.45", change: "-2.8%", positive: false },
              { name: "Instagram", value: "$37.75", change: "+3.2%", positive: true },
            ].map((ch) => (
              <div key={ch.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
                    <Globe className="w-2.5 h-2.5 text-gray-500" />
                  </div>
                  <span className="text-gray-600">{ch.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-900 font-medium">{ch.value}</span>
                  <span className={ch.positive ? 'text-green-500' : 'text-red-500'}>
                    {ch.positive ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                    {ch.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </KPICard>

        <KPICard title="Total Visitors" value="237,456" change="-1.4%" positive={false} action="Report">
          <div className="grid grid-cols-3 gap-2 mt-3 mb-3">
            {[
              { label: "Desktop", value: "27%" },
              { label: "Tablet", value: "12%" },
              { label: "Mobile", value: "61%" },
            ].map(d => (
              <div key={d.label} className="text-center">
                <p className="text-xs text-gray-400">{d.label}</p>
                <p className="text-lg font-bold text-gray-900">{d.value}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-1 mt-3">
            {[
              { color: "bg-orange-400", value: "-3.2%", width: "w-1/4" },
              { color: "bg-orange-300", value: "-6.4%", width: "w-1/3" },
              { color: "bg-blue-400", value: "+0.8%", width: "w-1/4" },
            ].map((bar, i) => (
              <div key={i} className={`${bar.width}`}>
                <div className={`${bar.color} h-2 rounded-full mb-1`} />
                <p className="text-[10px] text-gray-400 text-center">{bar.value}</p>
              </div>
            ))}
          </div>
          <div className="h-24 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueMonthly}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#F97316" radius={[3, 3, 0, 0]} barSize={20} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </KPICard>

        <KPICard title="Conversion Rate" value="16.9%" change="+2.1%" positive={true} action="Details">
          <div className="mt-3 space-y-3">
            {conversionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="text-gray-600">{item.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-900 font-semibold">{item.value.toLocaleString()}</span>
                  <span className={`flex items-center gap-0.5 ${
                    item.change.startsWith('+') ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {item.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </KPICard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-gray-100" data-testid="card-visitors-channels">
          <div className="flex items-center justify-between gap-1 mb-3">
            <p className="text-sm font-semibold text-gray-900">Visitors Channels</p>
            <span className="text-xs text-gray-400 cursor-pointer">Details</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-gray-900">78%</span>
            <span className="text-xs font-medium text-red-500 bg-red-50 px-1.5 py-0.5 rounded-full">-0.4%</span>
          </div>
          <div className="flex gap-1 mb-4">
            <div className="h-2 bg-orange-400 rounded-full" style={{ width: "40%" }} />
            <div className="h-2 bg-orange-300 rounded-full" style={{ width: "35%" }} />
            <div className="h-2 bg-blue-400 rounded-full" style={{ width: "25%" }} />
          </div>
          <div className="flex gap-4 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full" /> Organic</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-300 rounded-full" /> Referral</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full" /> Direct</span>
          </div>
          <div className="border-t border-gray-50 pt-3">
            <div className="grid grid-cols-3 text-xs text-gray-400 mb-2 px-1">
              <span>Channels</span>
              <span className="text-right">Percent</span>
              <span className="text-right">Total</span>
            </div>
            {channelsData.map((ch) => (
              <div key={ch.name} className="grid grid-cols-3 items-center py-2 text-sm">
                <div className="flex items-center gap-2">
                  <ch.icon className="w-4 h-4" style={{ color: ch.color }} />
                  <span className="text-gray-700 text-xs">{ch.name}</span>
                </div>
                <span className="text-right text-gray-600 text-xs">{ch.percent}%</span>
                <span className="text-right text-gray-900 font-medium text-xs">{ch.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <button className="w-full text-center text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50" data-testid="button-view-reports">
            View reports
          </button>
        </Card>

        <Card className="p-4 bg-white border-gray-100" data-testid="card-user-retention">
          <div className="flex items-center justify-between gap-1 mb-3">
            <p className="text-sm font-semibold text-gray-900">User Retention</p>
            <span className="text-xs text-gray-400 cursor-pointer">Details</span>
          </div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-bold text-gray-900">24%</span>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">+2.0%</span>
          </div>
          <div className="grid grid-cols-12 gap-0.5">
            {Array.from({ length: 12 }, (_, weekIdx) =>
              Array.from({ length: 7 }, (_, dayIdx) => {
                const val = Math.floor(Math.random() * 100);
                const opacity = val > 80 ? 1 : val > 60 ? 0.7 : val > 40 ? 0.5 : val > 20 ? 0.3 : 0.1;
                return (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    className="aspect-square rounded-sm"
                    style={{ backgroundColor: `rgba(249, 115, 22, ${opacity})` }}
                    title={`Week ${weekIdx + 1}, Day ${dayIdx + 1}: ${val}%`}
                  />
                );
              })
            )}
          </div>
          <div className="flex justify-between text-[9px] text-gray-400 mt-2">
            {Array.from({ length: 12 }, (_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-3 flex items-center gap-1">
            Last 12 months data updated at 1:51 PM.
          </p>
        </Card>

        <Card className="p-4 bg-white border-gray-100" data-testid="card-weekly-visitors">
          <div className="flex items-center justify-between gap-1 mb-3">
            <p className="text-sm font-semibold text-gray-900">Weekly Visitors</p>
            <span className="text-xs text-gray-400 cursor-pointer">Details</span>
          </div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl font-bold text-gray-900">16,008</span>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">+1.1%</span>
          </div>
          <div className="flex gap-4 mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-orange-400 rounded-full" /> New visitors</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full" /> Returning visitors</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#f0f0f0" />
                <PolarAngleAxis dataKey="emotion" tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                <Radar name="New" dataKey="A" stroke="#F97316" fill="#F97316" fillOpacity={0.15} strokeWidth={2} />
                <Radar name="Returning" dataKey="B" stroke="#22C55E" fill="#22C55E" fillOpacity={0.1} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  const monthlyRevenue = [
    { month: "Jan", revenue: 42000, expenses: 28000 },
    { month: "Feb", revenue: 38000, expenses: 32000 },
    { month: "Mar", revenue: 51000, expenses: 29000 },
    { month: "Apr", revenue: 46000, expenses: 35000 },
    { month: "May", revenue: 54000, expenses: 31000 },
    { month: "Jun", revenue: 72000, expenses: 38000 },
    { month: "Jul", revenue: 68000, expenses: 42000 },
    { month: "Aug", revenue: 76000, expenses: 39000 },
  ];

  const categoryData = [
    { name: "Electronics", value: 35, color: "#F97316" },
    { name: "Clothing", value: 25, color: "#3B82F6" },
    { name: "Home & Garden", value: 20, color: "#22C55E" },
    { name: "Sports", value: 12, color: "#8B5CF6" },
    { name: "Other", value: 8, color: "#EC4899" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "$824,550", change: "+12.5%", positive: true },
          { label: "Total Orders", value: "4,352", change: "+8.3%", positive: true },
          { label: "Avg Order Value", value: "$189.40", change: "-2.1%", positive: false },
          { label: "Refund Rate", value: "3.2%", change: "-0.5%", positive: true },
        ].map((stat) => (
          <Card key={stat.label} className="p-4 bg-white border-gray-100" data-testid={`card-stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">{stat.value}</span>
              <span className={`text-xs ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-gray-100 xl:col-span-2" data-testid="card-revenue-chart">
          <p className="text-sm font-semibold text-gray-900 mb-4">Revenue vs Expenses</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#F97316" fill="url(#revGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expenses" stroke="#3B82F6" fill="url(#expGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-white border-gray-100" data-testid="card-categories">
          <p className="text-sm font-semibold text-gray-900 mb-4">Product Categories</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="text-gray-900 font-medium">{cat.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-white border-gray-100" data-testid="card-top-products">
        <p className="text-sm font-semibold text-gray-900 mb-4">Top Products</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-50">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Sales</th>
                <th className="pb-2 font-medium">Revenue</th>
                <th className="pb-2 font-medium">Growth</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Wireless Earbuds Pro", sales: "1,284", revenue: "$45,940", growth: "+18.2%" },
                { name: "Smart Watch Ultra", sales: "982", revenue: "$392,800", growth: "+12.5%" },
                { name: "Laptop Stand Pro", sales: "756", revenue: "$22,680", growth: "+8.7%" },
                { name: "USB-C Hub Adapter", sales: "654", revenue: "$19,620", growth: "+5.3%" },
                { name: "Portable Charger 20K", sales: "543", revenue: "$21,720", growth: "+3.1%" },
              ].map((product, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0" data-testid={`row-product-${i}`}>
                  <td className="py-3 text-gray-800 font-medium">{product.name}</td>
                  <td className="py-3 text-gray-600">{product.sales}</td>
                  <td className="py-3 text-gray-600">{product.revenue}</td>
                  <td className="py-3 text-green-500">{product.growth}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function ProductsPage() {
  const products = [
    { name: "Wireless Earbuds Pro", category: "Electronics", price: "$35.99", stock: 284, status: "Active" },
    { name: "Smart Watch Ultra", category: "Electronics", price: "$399.99", stock: 156, status: "Active" },
    { name: "Laptop Stand Pro", category: "Accessories", price: "$29.99", stock: 432, status: "Active" },
    { name: "USB-C Hub Adapter", category: "Electronics", price: "$49.99", stock: 0, status: "Out of Stock" },
    { name: "Portable Charger 20K", category: "Electronics", price: "$39.99", stock: 89, status: "Low Stock" },
    { name: "Ergonomic Mouse", category: "Accessories", price: "$59.99", stock: 212, status: "Active" },
    { name: "Noise Canceling Headphones", category: "Electronics", price: "$249.99", stock: 67, status: "Active" },
    { name: "Webcam HD Pro", category: "Electronics", price: "$79.99", stock: 145, status: "Active" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-900" data-testid="text-products-title">Products</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-300"
              data-testid="input-search-products"
            />
          </div>
          <Button className="bg-orange-500 text-white text-xs rounded-lg" data-testid="button-add-product">
            <Plus className="w-3 h-3 mr-1" /> Add Product
          </Button>
        </div>
      </div>
      <Card className="bg-white border-gray-100" data-testid="card-products-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0" data-testid={`row-product-list-${i}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-gray-800 font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{product.category}</td>
                  <td className="p-4 text-gray-900 font-medium">{product.price}</td>
                  <td className="p-4 text-gray-600">{product.stock}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      product.status === "Active" ? 'bg-green-50 text-green-600' :
                      product.status === "Low Stock" ? 'bg-yellow-50 text-yellow-600' :
                      'bg-red-50 text-red-500'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function OrdersPage() {
  const orders = [
    { id: "#ORD-7291", customer: "Sarah Johnson", items: 3, total: "$285.50", date: "Mar 10, 2026", status: "Delivered" },
    { id: "#ORD-7290", customer: "Mike Chen", items: 1, total: "$399.99", date: "Mar 10, 2026", status: "Processing" },
    { id: "#ORD-7289", customer: "Emily Davis", items: 5, total: "$142.45", date: "Mar 9, 2026", status: "Shipped" },
    { id: "#ORD-7288", customer: "Alex Wilson", items: 2, total: "$89.98", date: "Mar 9, 2026", status: "Delivered" },
    { id: "#ORD-7287", customer: "Lisa Brown", items: 4, total: "$567.96", date: "Mar 8, 2026", status: "Cancelled" },
    { id: "#ORD-7286", customer: "Tom Harris", items: 1, total: "$79.99", date: "Mar 8, 2026", status: "Processing" },
    { id: "#ORD-7285", customer: "Anna Lee", items: 2, total: "$159.98", date: "Mar 7, 2026", status: "Delivered" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-900" data-testid="text-orders-title">Orders</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-300"
              data-testid="input-search-orders"
            />
          </div>
        </div>
      </div>
      <Card className="bg-white border-gray-100" data-testid="card-orders-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0" data-testid={`row-order-${i}`}>
                  <td className="p-4 text-gray-900 font-medium">{order.id}</td>
                  <td className="p-4 text-gray-600">{order.customer}</td>
                  <td className="p-4 text-gray-600">{order.items}</td>
                  <td className="p-4 text-gray-900 font-medium">{order.total}</td>
                  <td className="p-4 text-gray-500">{order.date}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      order.status === "Delivered" ? 'bg-green-50 text-green-600' :
                      order.status === "Processing" ? 'bg-blue-50 text-blue-600' :
                      order.status === "Shipped" ? 'bg-orange-50 text-orange-600' :
                      'bg-red-50 text-red-500'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function DiscountsPage() {
  const discounts = [
    { code: "SUMMER25", type: "Percentage", value: "25%", uses: 1284, maxUses: 5000, status: "Active", expires: "Jun 30, 2026" },
    { code: "WELCOME10", type: "Percentage", value: "10%", uses: 3456, maxUses: null, status: "Active", expires: "No expiry" },
    { code: "FLASH50", type: "Fixed", value: "$50", uses: 500, maxUses: 500, status: "Expired", expires: "Mar 1, 2026" },
    { code: "FREESHIP", type: "Free Shipping", value: "-", uses: 2100, maxUses: null, status: "Active", expires: "Dec 31, 2026" },
    { code: "VIP30", type: "Percentage", value: "30%", uses: 89, maxUses: 200, status: "Active", expires: "Apr 15, 2026" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-900" data-testid="text-discounts-title">Discounts</h2>
        <Button className="bg-orange-500 text-white text-xs rounded-lg" data-testid="button-create-discount">
          <Plus className="w-3 h-3 mr-1" /> Create Discount
        </Button>
      </div>
      <Card className="bg-white border-gray-100" data-testid="card-discounts-table">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
                <th className="p-4 font-medium">Code</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Value</th>
                <th className="p-4 font-medium">Uses</th>
                <th className="p-4 font-medium">Expires</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((disc, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0" data-testid={`row-discount-${i}`}>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">{disc.code}</span>
                  </td>
                  <td className="p-4 text-gray-600">{disc.type}</td>
                  <td className="p-4 text-gray-900 font-medium">{disc.value}</td>
                  <td className="p-4 text-gray-600">
                    {disc.uses.toLocaleString()}{disc.maxUses ? ` / ${disc.maxUses.toLocaleString()}` : ''}
                  </td>
                  <td className="p-4 text-gray-500">{disc.expires}</td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      disc.status === "Active" ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {disc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function AppsPage() {
  const apps = [
    { name: "Email Marketing", desc: "Automated email campaigns and newsletters", icon: "M", connected: true, color: "bg-blue-500" },
    { name: "Social Media Manager", desc: "Schedule and manage social media posts", icon: "S", connected: true, color: "bg-purple-500" },
    { name: "Customer Support", desc: "Live chat and ticket management", icon: "C", connected: false, color: "bg-green-500" },
    { name: "Accounting", desc: "Financial tracking and invoicing", icon: "A", connected: true, color: "bg-orange-500" },
    { name: "Inventory Sync", desc: "Real-time inventory synchronization", icon: "I", connected: false, color: "bg-red-500" },
    { name: "Analytics Pro", desc: "Advanced data analytics and insights", icon: "A", connected: true, color: "bg-indigo-500" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-semibold text-gray-900" data-testid="text-apps-title">Apps</h2>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search apps..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-orange-300"
            data-testid="input-search-apps"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {apps.map((app, i) => (
          <Card key={i} className="p-5 bg-white border-gray-100" data-testid={`card-app-${i}`}>
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-10 h-10 ${app.color} rounded-xl flex items-center justify-center text-white text-sm font-bold`}>
                {app.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">{app.name}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{app.desc}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${app.connected ? 'text-green-500' : 'text-gray-400'}`}>
                {app.connected ? 'Connected' : 'Not connected'}
              </span>
              <Button
                variant={app.connected ? "outline" : "default"}
                size="sm"
                className={`text-xs rounded-lg ${!app.connected ? 'bg-orange-500 text-white' : ''}`}
              >
                {app.connected ? 'Manage' : 'Connect'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const params = useParams<{ page?: string }>();
  const [, navigate] = useLocation();
  const activePage = params?.page || "overview";
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page: string) => {
    if (page === "overview") {
      navigate("/dashboard");
    } else {
      navigate(`/dashboard/${page}`);
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "overview": return <OverviewPage />;
      case "analytics": return <AnalyticsPage />;
      case "products": return <ProductsPage />;
      case "orders": return <OrdersPage />;
      case "discounts": return <DiscountsPage />;
      case "apps": return <AppsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <div className="lg:hidden flex items-center gap-2 p-3 border-b border-gray-100 bg-white">
          <button onClick={() => setMobileOpen(true)} data-testid="button-mobile-sidebar" aria-label="Open sidebar">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="text-sm font-semibold text-gray-900">Catalyst</span>
        </div>
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
