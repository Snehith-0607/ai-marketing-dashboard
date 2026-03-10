import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowDown } from "lucide-react";

const data = [
  { day: "S", value: 280 },
  { day: "S", value: 350 },
  { day: "M", value: 200 },
  { day: "T", value: 420 },
  { day: "W", value: 150 },
  { day: "T", value: 300 },
  { day: "F", value: 380 },
];

export default function CampaignVisitorsChart() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-campaign-visitors">
      <div className="flex items-start justify-between mb-1">
        <h3 className="text-lg font-semibold text-[#1C2434]">Campaign Visitors</h3>
        <span className="text-2xl font-bold text-[#1C2434]" data-testid="text-visitors-count">784K</span>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <p className="text-sm text-[#64748B]">Last Campaign Performance</p>
        <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
          <ArrowDown className="w-3 h-3" /> -1.5%
        </span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={28}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="day"
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
          <Bar dataKey="value" fill="#465FFF" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
