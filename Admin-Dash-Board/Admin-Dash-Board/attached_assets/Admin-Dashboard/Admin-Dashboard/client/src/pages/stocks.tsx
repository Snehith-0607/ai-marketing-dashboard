import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, MoreVertical, TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const stockKpis = [
  { title: "Portfolio Value", value: "$284,750", change: 5.4, icon: TrendingUp, bg: "bg-[#465FFF]/10", color: "text-[#465FFF]" },
  { title: "Today's P&L", value: "+$3,245", change: 1.2, icon: Activity, bg: "bg-emerald-50", color: "text-emerald-500" },
  { title: "Total Invested", value: "$245,000", change: 0, icon: BarChart3, bg: "bg-amber-50", color: "text-amber-500" },
  { title: "Total Returns", value: "$39,750", change: 16.2, icon: TrendingUp, bg: "bg-purple-50", color: "text-purple-500" },
];

const portfolioTrend = [
  { month: "Jan", value: 245000 },
  { month: "Feb", value: 248500 },
  { month: "Mar", value: 252000 },
  { month: "Apr", value: 247800 },
  { month: "May", value: 258000 },
  { month: "Jun", value: 262500 },
  { month: "Jul", value: 255000 },
  { month: "Aug", value: 268000 },
  { month: "Sep", value: 272000 },
  { month: "Oct", value: 276500 },
  { month: "Nov", value: 280000 },
  { month: "Dec", value: 284750 },
];

const holdings = [
  { symbol: "NYKAA", name: "FSN E-Commerce", qty: 500, avg: 165.50, ltp: 189.75, change: 3.2, value: "$94,875", pnl: "+$12,125", pnlPercent: 14.65 },
  { symbol: "RELIANCE", name: "Reliance Industries", qty: 200, avg: 2450.00, ltp: 2680.50, change: -0.8, value: "$53,610", pnl: "+$4,610", pnlPercent: 9.40 },
  { symbol: "TCS", name: "Tata Consultancy", qty: 150, avg: 3200.00, ltp: 3520.00, change: 1.5, value: "$52,800", pnl: "+$4,800", pnlPercent: 10.0 },
  { symbol: "INFY", name: "Infosys Limited", qty: 300, avg: 1450.00, ltp: 1580.25, change: 2.1, value: "$47,407", pnl: "+$3,907", pnlPercent: 8.98 },
  { symbol: "HDFC", name: "HDFC Bank", qty: 250, avg: 1520.00, ltp: 1442.56, change: -1.2, value: "$36,064", pnl: "-$1,936", pnlPercent: -5.09 },
];

const miniChartData = [
  [4, 6, 5, 8, 7, 9, 8, 10, 9, 12],
  [8, 7, 9, 6, 5, 7, 6, 4, 5, 3],
  [3, 5, 4, 6, 7, 6, 8, 9, 8, 10],
  [5, 7, 8, 6, 9, 8, 10, 9, 11, 12],
  [9, 8, 7, 6, 7, 5, 4, 5, 3, 4],
];

const sectorAllocation = [
  { sector: "Technology", weight: 35, color: "#465FFF" },
  { sector: "E-Commerce", weight: 25, color: "#10B981" },
  { sector: "Banking", weight: 20, color: "#F59E0B" },
  { sector: "Energy", weight: 12, color: "#8B5CF6" },
  { sector: "FMCG", weight: 8, color: "#EC4899" },
];

export default function StocksDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stockKpis.map((kpi, i) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-5 border border-[#E2E8F0]" data-testid={`card-stock-kpi-${i}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${kpi.bg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-xs text-[#94A3B8] mb-1">{kpi.title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-[#1C2434]">{kpi.value}</h3>
              {kpi.change !== 0 && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {kpi.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(kpi.change)}%
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-portfolio-chart">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#1C2434]">Portfolio Performance</h3>
            <p className="text-sm text-[#64748B]">12 month portfolio value trend</p>
          </div>
          <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]"><MoreVertical className="w-5 h-5" /></button>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={portfolioTrend}>
            <defs>
              <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#465FFF" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#465FFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} formatter={(value: number) => [`$${value.toLocaleString()}`, "Value"]} />
            <Area type="monotone" dataKey="value" stroke="#465FFF" strokeWidth={2.5} fill="url(#colorPortfolio)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-holdings">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1C2434]">Holdings</h3>
            <button className="text-sm text-[#465FFF] font-medium" data-testid="link-view-all-holdings">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                  <th className="pb-3 pr-3">Stock</th>
                  <th className="pb-3 pr-3">LTP</th>
                  <th className="pb-3 pr-3">Change</th>
                  <th className="pb-3 pr-3">Trend</th>
                  <th className="pb-3 pr-3">Value</th>
                  <th className="pb-3">P&L</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h, idx) => (
                  <tr key={h.symbol} className="border-t border-[#F1F5F9]" data-testid={`row-holding-${h.symbol.toLowerCase()}`}>
                    <td className="py-3 pr-3">
                      <p className="text-sm font-semibold text-[#1C2434]">{h.symbol}</p>
                      <p className="text-xs text-[#94A3B8]">{h.name}</p>
                    </td>
                    <td className="py-3 pr-3 text-sm font-medium text-[#1C2434]">${h.ltp.toFixed(2)}</td>
                    <td className="py-3 pr-3">
                      <span className={`flex items-center gap-0.5 text-xs font-medium ${h.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {h.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                        {Math.abs(h.change)}%
                      </span>
                    </td>
                    <td className="py-3 pr-3">
                      <div className="w-16 h-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={miniChartData[idx].map((v, i) => ({ v }))}>
                            <Line type="monotone" dataKey="v" stroke={h.change >= 0 ? "#10B981" : "#EF4444"} strokeWidth={1.5} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="py-3 pr-3 text-sm text-[#64748B]">{h.value}</td>
                    <td className="py-3">
                      <span className={`text-sm font-semibold ${h.pnlPercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>{h.pnl}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-sector-allocation">
          <h3 className="text-lg font-semibold text-[#1C2434] mb-1">Sector Allocation</h3>
          <p className="text-sm text-[#64748B] mb-6">Portfolio distribution by sector</p>
          <div className="space-y-4">
            {sectorAllocation.map((s) => (
              <div key={s.sector}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-[#1C2434]">{s.sector}</span>
                  <span className="text-sm font-semibold text-[#1C2434]">{s.weight}%</span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.weight}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-2 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
