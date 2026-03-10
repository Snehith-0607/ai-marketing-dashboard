import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Calendar } from "lucide-react";

const data = [
  { month: "Jan", value: 165 },
  { month: "Feb", value: 148 },
  { month: "Mar", value: 190 },
  { month: "Apr", value: 155 },
  { month: "May", value: 172 },
  { month: "Jun", value: 140 },
  { month: "Jul", value: 185 },
  { month: "Aug", value: 162 },
  { month: "Sep", value: 195 },
  { month: "Oct", value: 210 },
  { month: "Nov", value: 175 },
  { month: "Dec", value: 230 },
];

export default function StatisticsChart() {
  const [activeTab, setActiveTab] = useState("Monthly");
  const tabs = ["Monthly", "Quarterly", "Annually"];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-statistics">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#1C2434]">Statistics</h3>
          <p className="text-sm text-[#64748B]">Target you've set for each month</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#F1F5F9] rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                data-testid={`button-tab-${tab.toLowerCase()}`}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === tab
                    ? "bg-white text-[#1C2434] shadow-sm"
                    : "text-[#64748B] hover:text-[#1C2434]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#64748B] bg-[#F1F5F9] rounded-lg hover:bg-[#E2E8F0]"
            data-testid="button-date-range"
          >
            <Calendar className="w-3.5 h-3.5" />
            Mar 04 to Mar 10
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
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
            dataKey="value"
            stroke="#465FFF"
            strokeWidth={2.5}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
