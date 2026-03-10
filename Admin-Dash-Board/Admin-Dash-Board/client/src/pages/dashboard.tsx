import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, ShoppingCart, Users, TrendingUp, Calendar } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import RevenueChart from "@/components/charts/RevenueChart";
import MonthlySalesChart from "@/components/charts/MonthlySalesChart";
import CategoryChart from "@/components/charts/CategoryChart";
import TargetChart from "@/components/charts/TargetChart";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getDatasetSummary, checkBackendHealth } from "@/lib/api";
import WorldMapCard from "@/components/dashboard/WorldMapCard";

// Default fallback data (used when no real data is available)
const defaultCustomerGrowthData = [
  { month: "Jan", customers: 1200 },
  { month: "Feb", customers: 1450 },
  { month: "Mar", customers: 1300 },
  { month: "Apr", customers: 1680 },
  { month: "May", customers: 1900 },
  { month: "Jun", customers: 2100 },
  { month: "Jul", customers: 1950 },
  { month: "Aug", customers: 2400 },
  { month: "Sep", customers: 2800 },
  { month: "Oct", customers: 2600 },
  { month: "Nov", customers: 3100 },
  { month: "Dec", customers: 3500 },
];

const defaultTrafficData = [
  { channel: "Organic", visits: 45 },
  { channel: "Direct", visits: 25 },
  { channel: "Social", visits: 18 },
  { channel: "Referral", visits: 12 },
];

const defaultRetentionData = [
  { week: "W1", rate: 100 },
  { week: "W2", rate: 85 },
  { week: "W3", rate: 72 },
  { week: "W4", rate: 65 },
  { week: "W5", rate: 58 },
  { week: "W6", rate: 52 },
  { week: "W7", rate: 48 },
  { week: "W8", rate: 45 },
];

interface DashboardData {
  chart?: string;
  title?: string;
  data?: Array<Record<string, any>>;
  insight?: string;
  // API response fields
  summary?: any;
  charts?: Array<{ chart: string; title: string; data: Array<Record<string, any>>; insight?: string }>;
  rows?: Array<Record<string, any>>;
}

// Helper: compute metrics from raw data rows
function computeMetrics(rows: Array<Record<string, any>>) {
  let totalRevenue = 0;
  let totalConversions = 0;
  let totalROI = 0;
  let roiCount = 0;
  const channelCounts: Record<string, number> = {};

  for (const row of rows) {
    // Sum Revenue
    const rev = parseFloat(row.Revenue || row.revenue || 0);
    if (!isNaN(rev)) totalRevenue += rev;

    // Sum Conversions
    const conv = parseFloat(row.Conversions || row.conversions || 0);
    if (!isNaN(conv)) totalConversions += conv;

    // Average ROI
    const roi = parseFloat(row.ROI || row.roi || 0);
    if (!isNaN(roi) && roi !== 0) {
      totalROI += roi;
      roiCount++;
    }

    // Top Channel
    const channel = row.Channel_Used || row.channel_used || row.Channel || row.channel || "";
    if (channel) {
      channelCounts[channel] = (channelCounts[channel] || 0) + 1;
    }
  }

  const avgROI = roiCount > 0 ? totalROI / roiCount : 0;
  const topChannel = Object.entries(channelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

  return { totalRevenue, totalConversions, avgROI, topChannel };
}

// Helper: format currency
function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

// Helper: format number with commas
function formatNumber(value: number): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Health check state
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  // Metrics state
  const [totalRevenue, setTotalRevenue] = useState("$45,231");
  const [totalConversions, setTotalConversions] = useState("2,350");
  const [avgROI, setAvgROI] = useState("24.5%");
  const [topChannel, setTopChannel] = useState("Organic");

  // Chart data state
  const [revenueChartData, setRevenueChartData] = useState<Array<Record<string, any>> | undefined>(undefined);
  const [revenueChartTitle, setRevenueChartTitle] = useState<string | undefined>(undefined);
  const [salesChartData, setSalesChartData] = useState<Array<Record<string, any>> | undefined>(undefined);
  const [salesChartTitle, setSalesChartTitle] = useState<string | undefined>(undefined);
  const [categoryChartData, setCategoryChartData] = useState<Array<Record<string, any>> | undefined>(undefined);
  const [categoryChartTitle, setCategoryChartTitle] = useState<string | undefined>(undefined);

  // Bottom row data
  const [customerGrowthData, setCustomerGrowthData] = useState(defaultCustomerGrowthData);
  const [trafficData, setTrafficData] = useState(defaultTrafficData);
  const [retentionData, setRetentionData] = useState(defaultRetentionData);

  // Health check on mount
  useEffect(() => {
    checkBackendHealth().then((online) => {
      setBackendOnline(online);
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    });
  }, []);

  // Export CSV function
  const exportCSV = () => {
    const data = dashboardData?.data || dashboardData?.rows;
    if (!data?.length) return;
    const headers = Object.keys(data[0]).join(",");
    const rows = data.map((row: any) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Artha-dashboard.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const processData = useCallback((data: DashboardData) => {
    // If we have raw rows, compute metrics
    const rows = data.rows || data.data || [];
    if (rows.length > 0) {
      const metrics = computeMetrics(rows);
      setTotalRevenue(formatCurrency(metrics.totalRevenue));
      setTotalConversions(formatNumber(metrics.totalConversions));
      setAvgROI(`${metrics.avgROI.toFixed(1)}%`);
      setTopChannel(metrics.topChannel);

      // Build channel distribution for traffic card from rows
      const channelMap: Record<string, number> = {};
      for (const row of rows) {
        const ch = row.Channel_Used || row.channel_used || row.Channel || row.channel || "";
        if (ch) channelMap[ch] = (channelMap[ch] || 0) + 1;
      }
      const trafficFromData = Object.entries(channelMap)
        .map(([channel, visits]) => ({ channel, visits }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 6);
      if (trafficFromData.length > 0) setTrafficData(trafficFromData);
    }

    // If we have charts array from API (multiple charts)
    if (data.charts && Array.isArray(data.charts)) {
      for (const chartItem of data.charts) {
        mapChartToComponent(chartItem);
      }
    }
    // If this is a single chart object (from sessionStorage via DashboardPreview)
    else if (data.chart && data.data) {
      mapChartToComponent(data as { chart: string; title?: string; data: Array<Record<string, any>>; insight?: string });
    }
  }, []);

  const mapChartToComponent = (chartItem: { chart: string; title?: string; data: Array<Record<string, any>>; insight?: string }) => {
    const { chart, title, data: chartData } = chartItem;
    if (!chartData || chartData.length === 0) return;

    switch (chart) {
      case "bar":
        setRevenueChartData(chartData);
        setRevenueChartTitle(title || "Revenue Analysis");
        break;
      case "line":
        setSalesChartData(chartData);
        setSalesChartTitle(title || "Trend Analysis");
        break;
      case "pie":
        setCategoryChartData(chartData);
        setCategoryChartTitle(title || "Distribution");
        break;
      default:
        // For any other chart type, put in revenue chart as fallback
        setRevenueChartData(chartData);
        setRevenueChartTitle(title || "Data Analysis");
        break;
    }
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    // Step 1: Check sessionStorage
    try {
      const stored = sessionStorage.getItem("dashboardData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setDashboardData(parsed);
        processData(parsed);
        setIsLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Failed to parse sessionStorage dashboardData:", e);
    }

    // Step 2: Fetch from API
    try {
      const apiData = await getDatasetSummary();
      if (apiData) {
        setDashboardData(apiData);
        processData(apiData);
        // Cache in sessionStorage for future visits
        try {
          sessionStorage.setItem("dashboardData", JSON.stringify(apiData));
        } catch (e) {
          // sessionStorage might be full, ignore
        }
      }
    } catch (e) {
      console.warn("Failed to fetch from API:", e);
    }

    setIsLoading(false);
  }, [processData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    document.title = "Dashboard - Artha";
  }, []);

  return (
    <AppLayout title="Dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Health Check Banner */}
        {showBanner && backendOnline !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
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

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2434]" data-testid="text-dashboard-title">Analytics Overview</h1>
            <p className="text-sm text-[#64748B]">Monitor your key business metrics at a glance</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E8F0] rounded-xl text-sm text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
              data-testid="button-export-csv"
            >
              ↓ Export CSV
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm text-[#64748B] bg-white rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
              data-testid="button-date-range"
            >
              <Calendar className="w-4 h-4" />
              Last 30 days
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <MetricCard
            title="Total Revenue"
            value={dashboardData ? totalRevenue : "Loading..."}
            change={20.1}
            icon={<DollarSign className="w-6 h-6 text-[#465FFF]" />}
            iconBg="bg-[#465FFF]/10"
            isLoading={isLoading && !dashboardData}
          />
          <MetricCard
            title="Total Conversions"
            value={dashboardData ? totalConversions : "Loading..."}
            change={-5.4}
            icon={<ShoppingCart className="w-6 h-6 text-emerald-500" />}
            iconBg="bg-emerald-50"
            isLoading={isLoading && !dashboardData}
          />
          <MetricCard
            title="Average ROI"
            value={dashboardData ? avgROI : "Loading..."}
            change={11.01}
            icon={<Users className="w-6 h-6 text-amber-500" />}
            iconBg="bg-amber-50"
            isLoading={isLoading && !dashboardData}
          />
          <MetricCard
            title="Top Channel"
            value={dashboardData ? topChannel : "Loading..."}
            change={8.2}
            icon={<TrendingUp className="w-6 h-6 text-rose-500" />}
            iconBg="bg-rose-50"
            isLoading={isLoading && !dashboardData}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <RevenueChart externalData={revenueChartData} title={revenueChartTitle} />
          </div>
          <TargetChart />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <MonthlySalesChart externalData={salesChartData} title={salesChartTitle} />
          <CategoryChart externalData={categoryChartData} title={categoryChartTitle} />
        </div>

        {/* Global Campaign Distribution - World Map */}
        <WorldMapCard onRefresh={fetchData} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-customer-growth">
            <h3 className="text-lg font-semibold text-[#1C2434] mb-1">Customer Growth</h3>
            <p className="text-sm text-[#64748B] mb-6">New customers acquired per month</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={customerGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} />
                <Line type="monotone" dataKey="customers" stroke="#465FFF" strokeWidth={2.5} dot={{ fill: "#465FFF", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-traffic-channels">
            <h3 className="text-lg font-semibold text-[#1C2434] mb-1">Traffic Channels</h3>
            <p className="text-sm text-[#64748B] mb-6">Distribution of traffic sources</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trafficData} barSize={32} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis type="category" dataKey="channel" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} width={70} />
                <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} />
                <Bar dataKey="visits" fill="#465FFF" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-user-retention">
            <h3 className="text-lg font-semibold text-[#1C2434] mb-1">User Retention</h3>
            <p className="text-sm text-[#64748B] mb-6">Weekly retention cohort analysis</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={retentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} formatter={(v: number) => [`${v}%`, "Retention"]} />
                <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}
