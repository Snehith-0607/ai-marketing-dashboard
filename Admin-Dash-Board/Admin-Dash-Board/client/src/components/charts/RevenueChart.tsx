import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MoreVertical } from "lucide-react";

const defaultData = [
  { month: "Jan", revenue: 4200, expenses: 2800 },
  { month: "Feb", revenue: 3800, expenses: 2600 },
  { month: "Mar", revenue: 5100, expenses: 3200 },
  { month: "Apr", revenue: 4600, expenses: 2900 },
  { month: "May", revenue: 5800, expenses: 3100 },
  { month: "Jun", revenue: 4900, expenses: 3400 },
  { month: "Jul", revenue: 6200, expenses: 3000 },
  { month: "Aug", revenue: 5500, expenses: 3300 },
  { month: "Sep", revenue: 7100, expenses: 3500 },
  { month: "Oct", revenue: 6800, expenses: 3200 },
  { month: "Nov", revenue: 7500, expenses: 3800 },
  { month: "Dec", revenue: 8200, expenses: 4000 },
];

interface RevenueChartProps {
  externalData?: Array<Record<string, any>>;
  title?: string;
}

export default function RevenueChart({ externalData, title }: RevenueChartProps = {}) {
  const data = externalData && externalData.length > 0 ? externalData : defaultData;
  const chartTitle = title || "Revenue vs Expenses";
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-revenue-chart">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1C2434]">{chartTitle}</h3>
          <p className="text-sm text-[#64748B]">Monthly comparison for this year</p>
        </div>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]" data-testid="button-revenue-menu">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#465FFF" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#465FFF" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "12px", color: "white", fontSize: "13px" }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
          />
          <Area type="monotone" dataKey="revenue" stroke="#465FFF" strokeWidth={2.5} fill="url(#colorRevenue)" name="Revenue" />
          <Area type="monotone" dataKey="expenses" stroke="#F97316" strokeWidth={2.5} fill="url(#colorExpenses)" name="Expenses" />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#465FFF]" />
          <span className="text-xs text-[#64748B]">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#F97316]" />
          <span className="text-xs text-[#64748B]">Expenses</span>
        </div>
      </div>
    </div>
  );
}
