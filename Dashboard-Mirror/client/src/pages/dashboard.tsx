import { useState, useEffect, useRef } from "react";
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
  Bell, Facebook, Globe, Instagram, Menu, Download, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

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

const useCountUp = (target: number, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
};

function Sidebar({ activePage, onNavigate, mobileOpen, onCloseMobile }: {
  activePage: string;
  onNavigate: (page: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const [sidebarData, setSidebarData] = useState<any | null>(null);
  const [sidebarAnalytics, setSidebarAnalytics] = useState<any | null>(null);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const [analysisRes, summaryRes] = await Promise.all([
          fetch("http://localhost:8000/analysis?t=" + Date.now(), {
            cache: "no-store",
          }),
          fetch("http://localhost:8000/summary?t=" + Date.now(), {
            cache: "no-store",
          }),
        ]);
        const analysis = await analysisRes.json();
        const summary = await summaryRes.json();
        setSidebarAnalytics(analysis);
        setSidebarData(summary);
      } catch {
        // keep fallbacks
      }
    };
    fetchSidebarData();
  }, []);

  const uploadedFile =
    typeof window !== "undefined"
      ? localStorage.getItem("uploadedFile")
      : null;
  const projectName = uploadedFile
    ? uploadedFile.replace(/\.csv$/i, "")
    : "Artha Project";

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
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.open("http://localhost:3000", "_blank")}
            title="Go to Artha Lens"
          >
            <img
              src="/artha-nav-logo.png"
              alt="Artha"
              className="w-10 h-10 rounded-xl object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <div>
              <p className="text-sm font-semibold text-gray-900" data-testid="text-company-name">
                Artha
              </p>
              <p className="text-xs text-gray-400">
                {sidebarData?.column_names
                  ? `${(sidebarData.rows ?? 0).toLocaleString()} records`
                  : "Find Meaning in Data"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-1">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-3 py-2">MAIN</p>
            <div className="space-y-0.5">
              {/* Fixed Overview & Analytics */}
              {mainNavItems
                .filter((item) => item.page === "overview" || item.page === "analytics")
                .map((item) => (
                  <button
                    key={item.page}
                    onClick={() => {
                      onNavigate(item.page);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activePage === item.page
                        ? "bg-orange-50 text-orange-600"
                        : "text-gray-600"
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

              {/* Dynamic columns from dataset */}
              {sidebarData?.column_names
                ?.filter((col: string) => !["Campaign_ID", "Date"].includes(col))
                ?.slice(0, 5)
                ?.map((col: string, i: number) => (
                  <button
                    key={`${col}-${i}`}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600"
                  >
                    <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                      {col[0] || "C"}
                    </span>
                    {col.replace(/_/g, " ")}
                  </button>
                ))}

              {!sidebarData &&
                mainNavItems
                  .filter(
                    (item) =>
                      item.page !== "overview" && item.page !== "analytics"
                  )
                  .map((item) => (
                    <button
                      key={item.page}
                      onClick={() => {
                        onNavigate(item.page);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activePage === item.page
                          ? "bg-orange-50 text-orange-600"
                          : "text-gray-600"
                      }`}
                      data-testid={`button-nav-${item.page}`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
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
              {sidebarAnalytics?.charts?.impressions_by_channel
                ?.slice(0, 4)
                ?.map((channel: any, i: number) => (
                  <button
                    key={`${channel.name}-${i}`}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 font-medium"
                    data-testid={`button-channel-${channel.name.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                      {channel.name[0] || "C"}
                    </span>
                    {channel.name}
                  </button>
                ))}

              {!sidebarAnalytics &&
                channelItems.map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 font-medium"
                    data-testid={`button-channel-${item.label
                      .toLowerCase()
                      .replace(" ", "-")}`}
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
              IU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate" data-testid="text-user-name">
                Artha User
              </p>
              <p className="text-xs text-gray-400 truncate">
                {projectName}
              </p>
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
            AU
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900" data-testid="text-welcome">Artha User</h1>
            <p className="text-xs text-gray-400">Welcome back</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.open("http://localhost:3000", "_blank")}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-transparent border border-gray-200 rounded-lg cursor-pointer text-xs text-gray-500 font-medium hover:bg-gray-50 transition-colors"
          >
            ← Back to Artha Lens
          </button>
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
            <Download className="w-3 h-3 mr-1" /> Export PDF
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

// ─── World Map Component ────────────────────────────────────────────────────
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const mapMarkers = [
  { name: "United States", coordinates: [-95.7, 37.1] as [number, number], value: "$42.5K", flag: "🇺🇸" },
  { name: "United Kingdom", coordinates: [-1.2, 52.2] as [number, number], value: "$18.3K", flag: "🇬🇧" },
  { name: "India", coordinates: [78.9, 20.6] as [number, number], value: "$15.8K", flag: "🇮🇳" },
  { name: "Germany", coordinates: [10.4, 51.2] as [number, number], value: "$12.1K", flag: "🇩🇪" },
  { name: "Brazil", coordinates: [-51.9, -14.2] as [number, number], value: "$9.4K", flag: "🇧🇷" },
];

function WorldMapCard() {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  return (
    <Card className="p-4 bg-white border-gray-100" data-testid="card-world-map">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-gray-900">Global Campaign Distribution</p>
          <p className="text-xs text-gray-400 mt-0.5">Campaign reach across countries</p>
        </div>
        <span className="text-xs text-gray-400 cursor-pointer">Details</span>
      </div>

      <div className="flex gap-6">
        {/* Stats Panel */}
        <div className="flex flex-col justify-center gap-4 min-w-[120px]">
          <div>
            <p className="text-xs text-gray-400">Campaign Reach</p>
            <p className="text-xl font-bold text-gray-900">32 <span className="text-xs font-normal text-gray-400">countries</span></p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Users Reached</p>
            <p className="text-xl font-bold text-gray-900">1.2M</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Period</p>
            <p className="text-xl font-bold text-gray-900">6 <span className="text-xs font-normal text-gray-400">months</span></p>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative" style={{ minHeight: 260 }}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 120, center: [10, 30] }}
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              <pattern id="dots-mirror" patternUnits="userSpaceOnUse" width="6" height="6">
                <circle cx="1.5" cy="1.5" r="1" fill="#D1D5DB" />
              </pattern>
            </defs>
            <Geographies geography={GEO_URL}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="url(#dots-mirror)"
                    stroke="#E5E7EB"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#F3F4F6" },
                      pressed: { outline: "none" },
                    }}
                  />
                ))
              }
            </Geographies>
            {mapMarkers.map((marker) => (
              <Marker
                key={marker.name}
                coordinates={marker.coordinates}
                onMouseEnter={() => setHoveredMarker(marker.name)}
                onMouseLeave={() => setHoveredMarker(null)}
              >
                <circle r={5} fill="#F97316" stroke="#fff" strokeWidth={2} />
                <circle r={10} fill="#F97316" fillOpacity={0.2}>
                  <animate attributeName="r" from="5" to="12" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </Marker>
            ))}
          </ComposableMap>

          {/* Tooltip */}
          {hoveredMarker && (
            <div className="absolute top-2 right-2 bg-gray-900 text-white rounded-lg px-3 py-2 text-xs shadow-lg z-10">
              {mapMarkers.find(m => m.name === hoveredMarker)?.flag}{" "}
              <span className="font-medium">{hoveredMarker}</span>{" — "}
              <span className="text-orange-300 font-bold">{mapMarkers.find(m => m.name === hoveredMarker)?.value}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Overview Page ──────────────────────────────────────────────────────────

function OverviewPage() {
  const [salesPeriod, setSalesPeriod] = useState("1Y");
  const periods = ["1D", "1W", "1M", "3M", "1Y"];

  // ─── Fetch real data from backend ─────────────────────────────────
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          "http://localhost:8000/analysis?t=" + Date.now(),
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("offline");
        const data = await res.json();
        console.log("✅ OVERVIEW DATA:", data.kpis);
        setAnalyticsData(data);
        setIsOffline(false);
      } catch (e) {
        console.error("❌ FETCH FAILED:", e);
        setIsOffline(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // ─── Derive display values ────────────────────────────────────────
  const kpis = analyticsData?.kpis || {};

  const animatedRevenue = useCountUp(kpis.total_revenue || 0);
  const animatedImpressions = useCountUp(
    kpis.total_impressions || 0
  );
  const animatedRoi = useCountUp(kpis.avg_roi || 0, 1000);

  const totalRevenue =
    animatedRevenue > 0
      ? "₹" + (animatedRevenue / 10000000).toFixed(1) + "Cr"
      : "Loading...";

  const totalImpressions =
    animatedImpressions > 0
      ? (animatedImpressions / 1000000).toFixed(1) + "M"
      : "Loading...";

  const avgRoi =
    animatedRoi > 0 ? animatedRoi.toFixed(2) + "x ROI" : "Loading...";

  // Use real monthly revenue for the bar chart if available
  const realMonthlyRevenue = analyticsData?.charts?.monthly_revenue
    ? analyticsData.charts.monthly_revenue.map((d: any) => ({
        month: d.month.replace(/^\d{4}-/, ""),  // "2024-07" → "07"
        value: Math.round(d.revenue / 1000),     // Scale down for chart
      }))
    : revenueMonthly;

  // Use real channel data for the sales chart if available
  const realSalesData = analyticsData?.charts?.monthly_revenue
    ? analyticsData.charts.monthly_revenue.map((d: any) => ({
        month: d.month.replace(/^\d{4}-/, ""),
        sales: Math.round(d.revenue / 10000),
        visitors: Math.round((d.revenue / 10000) * (0.7 + Math.random() * 0.6)),
      }))
    : salesData;

  // Channel breakdown from real data
  const realChannelBreakdown = analyticsData?.charts?.revenue_by_campaign
    ? analyticsData.charts.revenue_by_campaign.slice(0, 3).map((d: any) => ({
        name: d.name,
        value: "₹" + (d.value / 10000000).toFixed(1) + "Cr",
        change: "+3.2%",
        positive: true,
      }))
    : [
        { name: "Online Store", value: "$52.12", change: "+4.5%", positive: true },
        { name: "Facebook", value: "$38.45", change: "-2.8%", positive: false },
        { name: "Instagram", value: "$37.75", change: "+3.2%", positive: true },
      ];

  return (
    <div className="space-y-4">
      {/* Live Data Indicator */}
      <div className="flex items-center justify-end mb-1">
        {isLoading && (
          <span style={{fontSize: 12, color: "gray"}} className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Loading live data...
          </span>
        )}
        {!isLoading && analyticsData && !isOffline && (
          <span style={{
            fontSize: "11px",
            background: "#dcfce7",
            color: "#16a34a",
            padding: "2px 8px",
            borderRadius: "999px",
          }} className="flex items-center gap-1.5">
            ● Live — {analyticsData.rows?.toLocaleString()} rows
          </span>
        )}
        {!isLoading && isOffline && (
          <span style={{
            fontSize: "11px",
            background: "#fef3c7",
            color: "#d97706",
            padding: "2px 8px",
            borderRadius: "999px",
          }} className="flex items-center gap-1.5">
            ● Showing Sample Data
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <KPICard title="Total Sales" value={totalRevenue} change="+2%" positive={true} action="Report">
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
              <LineChart data={realSalesData}>
                <Line type="monotone" dataKey="sales" stroke="#F97316" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="visitors" stroke="#E5E7EB" strokeWidth={1.5} dot={false} />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 space-y-1.5">
            {realChannelBreakdown.map((ch: any) => (
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

        <KPICard title="Total Visitors" value={totalImpressions} change="-1.4%" positive={false} action="Report">
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
              <BarChart data={realMonthlyRevenue}>
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Bar dataKey="value" fill="#F97316" radius={[3, 3, 0, 0]} barSize={20} />
                <Tooltip />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </KPICard>

        <KPICard title="Conversion Rate" value={avgRoi} change="+2.1%" positive={true} action="Details">
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

      {analyticsData && (
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "16px 20px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background:
                "conic-gradient(#10b981 " +
                Math.min(
                  Math.round((kpis.avg_roi || 0) * 10),
                  100
                ) +
                "%, #f1f5f9 0%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 700,
                color: "#10b981",
              }}
            >
              {Math.min(
                Math.round((kpis.avg_roi || 0) * 10),
                99
              )}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#1e293b",
                marginBottom: "2px",
              }}
            >
              Dataset Health Score
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "#64748b",
              }}
            >
              {analyticsData.rows?.toLocaleString()} rows ·{" "}
              {analyticsData.columns} columns · Avg ROI{" "}
              {kpis.avg_roi}x · Top: {kpis.top_channel}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            {[
              analyticsData.rows > 1000
                ? "✅ Large Dataset"
                : "⚠️ Small Dataset",
              kpis.avg_roi > 3 ? "✅ High ROI" : "⚠️ Low ROI",
              analyticsData.columns > 10
                ? "✅ Rich Data"
                : "⚠️ Limited Columns",
              "✅ Live Connected",
            ].map((badge, i) => (
              <span
                key={i}
                style={{
                  fontSize: "10px",
                  padding: "3px 8px",
                  borderRadius: "20px",
                  background: badge.startsWith("✅")
                    ? "#f0fdf4"
                    : "#fefce8",
                  color: badge.startsWith("✅")
                    ? "#15803d"
                    : "#854d0e",
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

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
            {(analyticsData?.charts?.impressions_by_channel || channelsData).map(
              (ch: any) => {
                const name = ch.name ?? ch.name;
                const total =
                  ch.value ??
                  ch.total ??
                  0;
                const sum =
                  analyticsData?.charts?.impressions_by_channel?.reduce(
                    (acc: number, item: any) => acc + (item.value ?? 0),
                    0
                  ) || 0;
                const percent =
                  sum > 0 && ch.value
                    ? Math.round((ch.value / sum) * 100)
                    : ch.percent ?? 0;

                const IconComp = ch.icon || Globe;

                return (
                  <div
                    key={name}
                    className="grid grid-cols-3 items-center py-2 text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <IconComp
                        className="w-4 h-4"
                        style={{ color: ch.color || "#9CA3AF" }}
                      />
                      <span className="text-gray-700 text-xs">{name}</span>
                    </div>
                    <span className="text-right text-gray-600 text-xs">
                      {percent}%
                    </span>
                    <span className="text-right text-gray-900 font-medium text-xs">
                      {total.toLocaleString()}
                    </span>
                  </div>
                );
              }
            )}
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

      {/* Global Campaign Distribution - World Map */}
      <WorldMapCard />
    </div>
  );
}

function AnalyticsPage() {
  // ─── Real data from /analysis endpoint ─────────────────────────────────
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    // Step 1: Check localStorage first
    try {
      const stored = localStorage.getItem("Artha_dashboard_data");
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log("Found localStorage data:", parsed);
      }
    } catch (e) {
      console.warn("localStorage read error:", e);
    }

    // Step 2: Fetch real analytics from backend
    console.log("Dashboard fetching real data...");
    fetch("http://localhost:8000/analysis?t=" + Date.now(), { cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error("Backend error");
        return r.json();
      })
      .then((data) => {
        setAnalyticsData(data);
        setIsLoadingAnalytics(false);
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString());
        console.log("Got data:", data?.kpis?.total_revenue);
      })
      .catch((e) => {
        console.warn("Could not fetch /analysis:", e);
        setIsLoadingAnalytics(false);
      });
  }, []);

  // ─── Fallback data ────────────────────────────────────────────────────
  const fallbackMonthlyRevenue = [
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 38000 },
    { month: "Mar", revenue: 51000 },
    { month: "Apr", revenue: 46000 },
    { month: "May", revenue: 54000 },
    { month: "Jun", revenue: 72000 },
    { month: "Jul", revenue: 68000 },
    { month: "Aug", revenue: 76000 },
  ];

  const CHART_COLORS = ["#F97316", "#3B82F6", "#22C55E", "#8B5CF6", "#EC4899", "#EF4444"];

  // ─── Derive display values from real data or fallback ─────────────────
  const kpis = analyticsData?.kpis || {};
  const charts = analyticsData?.charts || {};

  const fmtCurrency = (val: number | null) => {
    if (val === null || val === undefined) return "₹0";
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val.toFixed(0)}`;
  };

  const fmtNumber = (val: number | null) => {
    if (val === null || val === undefined) return "0";
    return val.toLocaleString();
  };

  const defaultStats = [
    {
      label: "Total Revenue",
      value: kpis.total_revenue !== null ? fmtCurrency(kpis.total_revenue) : "$824,550",
      change: "+12.5%", positive: true,
    },
    {
      label: "Total Impressions",
      value: kpis.total_impressions !== null ? fmtNumber(kpis.total_impressions) : "237,456",
      change: "+8.3%", positive: true,
    },
    {
      label: "Avg ROI",
      value: kpis.avg_roi !== null ? `${kpis.avg_roi}%` : "5.2%",
      change: "+2.1%", positive: true,
    },
    {
      label: "Top Channel",
      value: kpis.top_channel || "Google",
      change: "Best performer", positive: true,
    },
  ];

  // Monthly revenue chart data
  const monthlyRevenueData = charts.monthly_revenue && charts.monthly_revenue.length > 0
    ? charts.monthly_revenue.map((d: any) => ({ month: d.month, revenue: d.revenue }))
    : fallbackMonthlyRevenue;

  // Revenue by campaign (pie/bar chart)
  const revenueByCampaign = charts.revenue_by_campaign && charts.revenue_by_campaign.length > 0
    ? charts.revenue_by_campaign.map((d: any, i: number) => ({ ...d, color: CHART_COLORS[i % CHART_COLORS.length] }))
    : [
        { name: "Influencer", value: 35, color: "#F97316" },
        { name: "Social Media", value: 25, color: "#3B82F6" },
        { name: "Paid Ads", value: 20, color: "#22C55E" },
        { name: "SEO", value: 12, color: "#8B5CF6" },
        { name: "Email", value: 8, color: "#EC4899" },
      ];

  // ROI by channel
  const roiByChannel = charts.roi_by_channel && charts.roi_by_channel.length > 0
    ? charts.roi_by_channel
    : null;

  // Impressions by channel
  const impressionsByChannel = charts.impressions_by_channel && charts.impressions_by_channel.length > 0
    ? charts.impressions_by_channel
    : null;

  // Engagement by segment
  const engagementBySegment = charts.engagement_by_segment && charts.engagement_by_segment.length > 0
    ? charts.engagement_by_segment
    : null;

  return (
    <div className="space-y-4">
      {/* Live Data Status */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        {isLoadingAnalytics ? (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            Loading analytics data...
          </span>
        ) : analyticsData ? (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Live Data — Last updated {lastUpdated}
          </span>
        ) : (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-yellow-400 rounded-full" />
            Sample Data — Backend offline
          </span>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {defaultStats.map((stat) => (
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

      {/* Revenue Trend + Campaign Breakdown */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-gray-100 xl:col-span-2" data-testid="card-revenue-chart">
          <p className="text-sm font-semibold text-gray-900 mb-4">Monthly Revenue Trend</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="revGradAnalytics" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F97316" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#F97316" fill="url(#revGradAnalytics)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-4 bg-white border-gray-100" data-testid="card-campaign-breakdown">
          <p className="text-sm font-semibold text-gray-900 mb-4">Revenue by Campaign Type</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueByCampaign}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {revenueByCampaign.map((entry: any, index: number) => (
                    <Cell key={index} fill={entry.color || CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [analyticsData ? `$${value.toLocaleString()}` : `${value}%`, "Revenue"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {revenueByCampaign.map((cat: any, i: number) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color || CHART_COLORS[i % CHART_COLORS.length] }} />
                  <span className="text-gray-600">{cat.name}</span>
                </div>
                <span className="text-gray-900 font-medium">
                  {analyticsData ? fmtCurrency(cat.value) : `${cat.value}%`}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ROI by Channel + Impressions by Channel */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {roiByChannel && (
          <Card className="p-4 bg-white border-gray-100" data-testid="card-roi-channel">
            <p className="text-sm font-semibold text-gray-900 mb-4">ROI by Channel</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roiByChannel} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "ROI"]} />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {impressionsByChannel && (
          <Card className="p-4 bg-white border-gray-100" data-testid="card-impressions-channel">
            <p className="text-sm font-semibold text-gray-900 mb-4">Impressions by Channel</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impressionsByChannel}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1_000_000 ? `${(v / 1_000_000).toFixed(0)}M` : v >= 1_000 ? `${(v / 1_000).toFixed(0)}K` : v} />
                  <Tooltip formatter={(value: number) => [value.toLocaleString(), "Impressions"]} />
                  <Bar dataKey="value" fill="#F97316" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Engagement by Segment */}
      {engagementBySegment && (
        <Card className="p-4 bg-white border-gray-100" data-testid="card-engagement-segment">
          <p className="text-sm font-semibold text-gray-900 mb-4">Engagement Score by Customer Segment</p>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementBySegment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value: number) => [value.toFixed(2), "Engagement Score"]} />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      {/* Top Campaigns Table — replaces e-commerce "Top Products" */}
      {analyticsData && (
        <Card className="p-4 bg-white border-gray-100" data-testid="card-top-campaigns">
          <p className="text-sm font-semibold text-gray-900 mb-4">
            Dataset Overview: {analyticsData.rows?.toLocaleString()} rows, {analyticsData.columns} columns
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-400 border-b border-gray-50">
                  <th className="pb-2 font-medium">Column Name</th>
                  <th className="pb-2 font-medium">Type</th>
                </tr>
              </thead>
              <tbody>
                {(analyticsData.column_names || []).map((col: string, i: number) => (
                  <tr key={i} className="border-b border-gray-50 last:border-0">
                    <td className="py-2.5 text-gray-800 font-medium">{col}</td>
                    <td className="py-2.5 text-gray-500 text-xs">
                      {["Revenue", "Impressions", "Clicks", "Leads", "Conversions", "ROI", "Engagement_Score", "Acquisition_Cost", "Duration"].includes(col) ? "Numeric" : col === "Date" ? "Date" : "Text"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
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
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Health check state
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Health check on mount
  useEffect(() => {
    fetch("http://localhost:8000/health")
      .then((r) => r.ok ? true : false)
      .then((online) => {
        setBackendOnline(online);
        setShowBanner(true);
        if (online) {
          setTimeout(() => setShowBanner(false), 3000);
        }
      })
      .catch(() => {
        setBackendOnline(false);
        setShowBanner(true);
      });
  }, []);

  // Export PDF
  const handleExportPDF = async () => {
    if (!dashboardRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1.5,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let yPos = 10;
      pdf.addImage(imgData, "PNG", 10, yPos, imgWidth, imgHeight);
      // If content is taller than one page, add more pages
      let remainingHeight = imgHeight - (pageHeight - 20);
      while (remainingHeight > 0) {
        pdf.addPage();
        yPos = yPos - (pageHeight - 20);
        pdf.addImage(imgData, "PNG", 10, yPos, imgWidth, imgHeight);
        remainingHeight -= (pageHeight - 20);
      }
      pdf.save("Artha-dashboard.pdf");
    } catch (e) {
      console.error("PDF export failed:", e);
    } finally {
      setExporting(false);
    }
  };

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
          <span className="text-sm font-semibold text-gray-900">Artha</span>
        </div>
        <DashboardHeader />

        {/* Health Check Banner */}
        {showBanner && backendOnline !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mx-4 lg:mx-6 mt-2"
          >
            {backendOnline ? (
              <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
                ✅ Connected to Artha Backend
              </div>
            ) : (
              <div className="px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-700 flex items-center gap-2">
                ⚠️ Backend offline — showing sample data
              </div>
            )}
          </motion.div>
        )}

        {/* Export PDF Button */}
        <div className="flex justify-end px-4 lg:px-6 pt-3">
          <Button
            size="sm"
            variant="outline"
            className="text-xs gap-1.5"
            onClick={handleExportPDF}
            disabled={exporting}
            data-testid="button-export-pdf"
          >
            <Download className="w-3.5 h-3.5" />
            {exporting ? "Exporting..." : "Export PDF"}
          </Button>
        </div>

        <main ref={dashboardRef} className="flex-1 overflow-y-auto p-4 lg:p-6">
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
