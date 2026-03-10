import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MoreVertical } from "lucide-react";

const defaultData = [
  { month: "Jan", sales: 180 },
  { month: "Feb", sales: 250 },
  { month: "Mar", sales: 310 },
  { month: "Apr", sales: 150 },
  { month: "May", sales: 200 },
  { month: "Jun", sales: 170 },
  { month: "Jul", sales: 120 },
  { month: "Aug", sales: 280 },
  { month: "Sep", sales: 350 },
  { month: "Oct", sales: 220 },
  { month: "Nov", sales: 190 },
  { month: "Dec", sales: 290 },
];

interface MonthlySalesChartProps {
  externalData?: Array<Record<string, any>>;
  title?: string;
}

export default function MonthlySalesChart({ externalData, title }: MonthlySalesChartProps = {}) {
  const data = externalData && externalData.length > 0 ? externalData : defaultData;
  const chartTitle = title || "Monthly Sales";
  const dataKey = externalData && externalData.length > 0
    ? Object.keys(externalData[0]).find(k => typeof externalData[0][k] === "number") || "sales"
    : "sales";
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-monthly-sales">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#1C2434]">{chartTitle}</h3>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]" data-testid="button-sales-menu">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }}
            cursor={{ fill: "rgba(70, 95, 255, 0.05)" }}
          />
          <Bar dataKey={dataKey} fill="#465FFF" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
