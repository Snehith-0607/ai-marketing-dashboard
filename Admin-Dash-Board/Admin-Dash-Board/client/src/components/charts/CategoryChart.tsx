import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { MoreVertical } from "lucide-react";

const defaultData = [
  { name: "Electronics", value: 35 },
  { name: "Clothing", value: 25 },
  { name: "Food & Beverage", value: 20 },
  { name: "Home & Garden", value: 12 },
  { name: "Others", value: 8 },
];

const COLORS = ["#465FFF", "#7B8AFF", "#10B981", "#F59E0B", "#EF4444"];

interface CategoryChartProps {
  externalData?: Array<Record<string, any>>;
  title?: string;
}

export default function CategoryChart({ externalData, title }: CategoryChartProps = {}) {
  const data = externalData && externalData.length > 0 ? externalData : defaultData;
  const chartTitle = title || "Product Categories";
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-category-chart">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1C2434]">{chartTitle}</h3>
          <p className="text-sm text-[#64748B]">Sales distribution by category</p>
        </div>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]" data-testid="button-category-menu">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-8">
        <ResponsiveContainer width={200} height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }}
              formatter={(value: number) => [`${value}%`, ""]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-3">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                <span className="text-sm text-[#64748B]">{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-[#1C2434]">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
