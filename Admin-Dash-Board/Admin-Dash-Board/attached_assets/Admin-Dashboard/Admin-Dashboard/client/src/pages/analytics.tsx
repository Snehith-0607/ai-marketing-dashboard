import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Eye, MousePointer, Target, ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from "recharts";

const kpis = [
  { title: "Total Impressions", value: "2.4M", change: 12.5, icon: Eye, iconBg: "bg-[#465FFF]/10", iconColor: "text-[#465FFF]" },
  { title: "Total Clicks", value: "148K", change: -3.2, icon: MousePointer, iconBg: "bg-emerald-50", iconColor: "text-emerald-500" },
  { title: "Conversions", value: "12,845", change: 8.7, icon: Target, iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  { title: "Revenue", value: "$1.2M", change: 15.3, icon: TrendingUp, iconBg: "bg-purple-50", iconColor: "text-purple-500" },
];

const roiData = [
  { campaign: "Social Media", roi: 6.14 },
  { campaign: "Paid Ads", roi: 4.82 },
  { campaign: "Email", roi: 3.56 },
  { campaign: "Influencer", roi: 5.21 },
  { campaign: "Content", roi: 3.98 },
  { campaign: "WhatsApp", roi: 4.45 },
];

const channelData = [
  { name: "YouTube", value: 35, color: "#FF0000" },
  { name: "WhatsApp", value: 25, color: "#25D366" },
  { name: "Instagram", value: 20, color: "#E4405F" },
  { name: "Facebook", value: 12, color: "#1877F2" },
  { name: "Email", value: 8, color: "#465FFF" },
];

const monthlyTrend = [
  { month: "Jan", impressions: 180000, clicks: 12000, conversions: 800 },
  { month: "Feb", impressions: 220000, clicks: 15000, conversions: 950 },
  { month: "Mar", impressions: 195000, clicks: 13500, conversions: 870 },
  { month: "Apr", impressions: 240000, clicks: 18000, conversions: 1100 },
  { month: "May", impressions: 280000, clicks: 20000, conversions: 1350 },
  { month: "Jun", impressions: 260000, clicks: 17500, conversions: 1200 },
  { month: "Jul", impressions: 310000, clicks: 22000, conversions: 1450 },
  { month: "Aug", impressions: 295000, clicks: 19500, conversions: 1300 },
  { month: "Sep", impressions: 340000, clicks: 24000, conversions: 1600 },
  { month: "Oct", impressions: 320000, clicks: 21000, conversions: 1500 },
  { month: "Nov", impressions: 360000, clicks: 26000, conversions: 1750 },
  { month: "Dec", impressions: 400000, clicks: 28000, conversions: 1900 },
];

const audienceData = [
  { segment: "College Students", conversions: 2355, revenue: "$1.87M", cac: "$111.03", engagement: 20.98 },
  { segment: "Working Women", conversions: 1357, revenue: "$1.05M", cac: "$180.83", engagement: 7.24 },
  { segment: "Tier 2 City", conversions: 1890, revenue: "$1.42M", cac: "$95.50", engagement: 15.60 },
  { segment: "Premium Users", conversions: 980, revenue: "$890K", cac: "$220.15", engagement: 12.30 },
];

export default function AnalyticsDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="bg-white rounded-2xl p-5 border border-[#E2E8F0]"
            data-testid={`card-kpi-${i}`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${kpi.iconBg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
            </div>
            <p className="text-xs text-[#94A3B8] mb-1">{kpi.title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-[#1C2434]">{kpi.value}</h3>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {kpi.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(kpi.change)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-monthly-trend">
          <h3 className="text-lg font-semibold text-[#1C2434] mb-1">Monthly Performance Trend</h3>
          <p className="text-sm text-[#64748B] mb-4">Impressions, clicks & conversions over time</p>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} />
              <Line type="monotone" dataKey="impressions" stroke="#465FFF" strokeWidth={2} dot={false} name="Impressions" />
              <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} dot={false} name="Clicks" />
              <Line type="monotone" dataKey="conversions" stroke="#F59E0B" strokeWidth={2} dot={false} name="Conversions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-channel-distribution">
          <h3 className="text-lg font-semibold text-[#1C2434] mb-1">Channel Distribution</h3>
          <p className="text-sm text-[#64748B] mb-4">Campaign reach by channel</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={channelData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {channelData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {channelData.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ch.color }} />
                  <span className="text-[#64748B]">{ch.name}</span>
                </div>
                <span className="font-medium text-[#1C2434]">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-roi-comparison">
          <h3 className="text-lg font-semibold text-[#1C2434] mb-1">ROI by Campaign Type</h3>
          <p className="text-sm text-[#64748B] mb-4">Return on investment comparison</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={roiData} layout="vertical" barSize={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
              <YAxis dataKey="campaign" type="category" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12 }} width={90} />
              <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} />
              <Bar dataKey="roi" fill="#465FFF" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-audience-segments">
          <h3 className="text-lg font-semibold text-[#1C2434] mb-1">Audience Segments</h3>
          <p className="text-sm text-[#64748B] mb-4">Performance by target audience</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                  <th className="pb-3 pr-3">Segment</th>
                  <th className="pb-3 pr-3">Conversions</th>
                  <th className="pb-3 pr-3">Revenue</th>
                  <th className="pb-3">CAC</th>
                </tr>
              </thead>
              <tbody>
                {audienceData.map((a) => (
                  <tr key={a.segment} className="border-t border-[#F1F5F9]">
                    <td className="py-3 pr-3 text-sm font-medium text-[#1C2434]">{a.segment}</td>
                    <td className="py-3 pr-3 text-sm text-[#64748B]">{a.conversions.toLocaleString()}</td>
                    <td className="py-3 pr-3 text-sm font-medium text-emerald-500">{a.revenue}</td>
                    <td className="py-3 text-sm text-[#64748B]">{a.cac}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
