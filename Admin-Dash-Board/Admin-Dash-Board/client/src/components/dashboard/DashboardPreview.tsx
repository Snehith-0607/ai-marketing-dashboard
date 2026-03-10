import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { ExternalLink, Pin, Download } from "lucide-react";
import { useLocation } from "wouter";

const barData = [
  { region: "East", revenue: 4200 },
  { region: "West", revenue: 3800 },
  { region: "North", revenue: 3100 },
  { region: "South", revenue: 2900 },
  { region: "Central", revenue: 2200 },
];

const lineData = [
  { month: "Jan", value: 2100 },
  { month: "Feb", value: 2400 },
  { month: "Mar", value: 2200 },
  { month: "Apr", value: 2800 },
  { month: "May", value: 3200 },
  { month: "Jun", value: 3600 },
];

const pieData = [
  { name: "Product A", value: 40 },
  { name: "Product B", value: 30 },
  { name: "Product C", value: 20 },
  { name: "Product D", value: 10 },
];

const COLORS = ["#465FFF", "#10B981", "#F59E0B", "#EF4444"];

interface DashboardPreviewProps {
  chartType?: string;
  chartData?: any[];
  chartTitle?: string;
  insight?: string;
}

export default function DashboardPreview({
  chartType,
  chartData,
  chartTitle,
  insight,
}: DashboardPreviewProps) {
  const [, navigate] = useLocation();

  const hasChartData = Array.isArray(chartData) && chartData.length > 0;
  const barChartData = hasChartData ? chartData : barData;
  const lineChartData = hasChartData ? chartData : lineData;
  const pieChartData = hasChartData ? chartData : pieData;
  const effectiveTitle = chartTitle || "Dashboard Preview";
  const effectiveInsight =
    insight ||
    "Revenue increased by 24% in Q3. The East region is the top-performing region with $4,200 in revenue. Product A dominates with 40% market share.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden"
      data-testid="card-dashboard-preview"
    >
      <div className="p-5 border-b border-[#E2E8F0] bg-gradient-to-r from-[#F8FAFC] to-white">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[#1C2434]">
            {effectiveTitle}
          </h4>
          <div className="flex items-center gap-2">
            <button className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]" data-testid="button-pin-dashboard">
              <Pin className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#94A3B8]" data-testid="button-download-dashboard">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#F8FAFC] rounded-xl p-4">
          <p className="text-xs text-[#94A3B8] mb-2">Revenue by Region</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={barChartData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "11px" }}
              />
              <Bar dataKey="revenue" fill="#465FFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#F8FAFC] rounded-xl p-4">
          <p className="text-xs text-[#94A3B8] mb-2">Revenue Growth</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "11px" }}
              />
              <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-[#F8FAFC] rounded-xl p-4">
          <p className="text-xs text-[#94A3B8] mb-2">Product Distribution</p>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3} dataKey="value" strokeWidth={0}>
                {pieChartData.map((_: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "11px" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="px-5 pb-4">
        <div className="bg-gradient-to-r from-[#EFF4FF] to-[#F8FAFC] rounded-xl p-4">
          <p className="text-xs font-medium text-[#465FFF] mb-1">AI Insight</p>
          <p className="text-sm text-[#64748B] leading-relaxed">
            {effectiveInsight}
          </p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <button
          className="w-full py-2.5 rounded-xl bg-[#465FFF] text-white text-sm font-medium hover:bg-[#3A50E0] transition-colors flex items-center justify-center gap-2"
          data-testid="button-open-full-dashboard"
          onClick={() => {
            // Save AI response data to localStorage for Dashboard-Mirror to consume
            try {
              const dashboardPayload = {
                chart: chartType || "bar",
                title: chartTitle || "Dashboard Preview",
                data: chartData || [],
                insight: insight || "",
              };
              localStorage.setItem("insightai_dashboard_data", JSON.stringify(dashboardPayload));
            } catch (e) {
              console.warn("Failed to save dashboard data to localStorage:", e);
            }
            // Open Dashboard-Mirror running on port 5000
            window.open("http://localhost:5000/dashboard", "_blank");
          }}
        >
          Open Full Dashboard
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
