import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  iconBg: string;
  isLoading?: boolean;
}

export default function MetricCard({ title, value, change, icon, iconBg, isLoading }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-[#E2E8F0]"
      data-testid={`card-metric-${title.toLowerCase().replace(/\s/g, "-")}`}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconBg}`}>
        {icon}
      </div>
      <p className="text-sm text-[#64748B] mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <h3
          className={`text-3xl font-bold text-[#1C2434] ${
            isLoading ? "animate-pulse" : ""
          }`}
        >
          {value}
        </h3>
        <span
          className={`flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full ${
            isPositive ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
          }`}
          data-testid={`text-change-${title.toLowerCase().replace(/\s/g, "-")}`}
        >
          {isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </span>
      </div>
    </motion.div>
  );
}
