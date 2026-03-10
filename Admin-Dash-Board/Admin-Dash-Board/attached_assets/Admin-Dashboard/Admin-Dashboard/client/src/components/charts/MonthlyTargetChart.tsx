import { motion } from "framer-motion";
import { MoreVertical, ArrowDown, ArrowUp } from "lucide-react";

export default function MonthlyTargetChart() {
  const percentage = 75.55;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-monthly-target">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-[#1C2434]">Monthly Target</h3>
          <p className="text-sm text-[#64748B]">Target you've set for each month</p>
        </div>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]" data-testid="button-target-menu">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center py-4">
        <div className="relative w-48 h-48">
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="12"
            />
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#465FFF" />
                <stop offset="100%" stopColor="#7B8AFF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-[#1C2434]" data-testid="text-target-percentage">{percentage}%</span>
            <span className="text-sm font-medium text-emerald-500">+10%</span>
          </div>
        </div>

        <p className="text-center text-sm text-[#64748B] mt-4 max-w-[250px]">
          You earn $3287 today, it's higher than last month. Keep up your good work!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0]">
        {[
          { label: "Target", value: "$20K", icon: ArrowDown, color: "text-red-500" },
          { label: "Revenue", value: "$20K", icon: ArrowUp, color: "text-emerald-500" },
          { label: "Today", value: "$20K", icon: ArrowUp, color: "text-emerald-500" },
        ].map((item) => (
          <div key={item.label} className="text-center">
            <p className="text-xs text-[#94A3B8] mb-1">{item.label}</p>
            <p className="text-lg font-bold text-[#1C2434]">{item.value}</p>
            <item.icon className={`w-4 h-4 mx-auto mt-1 ${item.color}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
