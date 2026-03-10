import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MoreVertical, ArrowUp } from "lucide-react";

const data = [
  { month: "Jan", cost: 120 },
  { month: "Feb", cost: 90 },
  { month: "Mar", cost: 140 },
  { month: "Apr", cost: 110 },
  { month: "May", cost: 160 },
  { month: "Jun", cost: 130 },
  { month: "Jul", cost: 95 },
  { month: "Aug", cost: 175 },
  { month: "Sep", cost: 150 },
  { month: "Oct", cost: 200 },
  { month: "Nov", cost: 180 },
  { month: "Dec", cost: 240 },
];

export default function CampaignCostChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-campaign-cost">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-semibold text-[#1C2434]">Campaign Visitors</h3>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-[#1C2434]" data-testid="text-avg-cost">$560.93</span>
        <span className="flex items-center gap-1 text-sm text-emerald-500 font-medium">
          <ArrowUp className="w-3 h-3" /> +2.5%
        </span>
      </div>
      <p className="text-sm text-[#64748B] mb-4">Average cost per interaction</p>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#465FFF" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#465FFF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1C2434",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "13px",
            }}
          />
          <Area
            type="monotone"
            dataKey="cost"
            stroke="#465FFF"
            strokeWidth={2}
            fill="url(#colorCost)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
