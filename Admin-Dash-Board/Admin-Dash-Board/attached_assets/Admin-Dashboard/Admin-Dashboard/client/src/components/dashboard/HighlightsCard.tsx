import { motion } from "framer-motion";
import { MoreVertical, ArrowUp, ArrowDown, BarChart3, Users, DollarSign } from "lucide-react";

const highlights = [
  {
    title: "Avg. Client Rating",
    value: "7.8/10",
    change: 2.5,
    period: "than last Week",
    icon: BarChart3,
    iconBg: "bg-[#465FFF]/10",
    iconColor: "text-[#465FFF]",
  },
  {
    title: "Instagram Followers",
    value: "522K",
    change: -1.5,
    period: "than last Week",
    icon: Users,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
  },
  {
    title: "Google Ads CPC",
    value: "5.03",
    change: 2.6,
    period: "than last Week",
    icon: DollarSign,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
];

export default function HighlightsCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-highlights">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1C2434]">Highlights</h3>
          <p className="text-sm text-[#64748B]">Latest social statistics</p>
        </div>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {highlights.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#F8FAFC] rounded-xl p-4 border border-[#E2E8F0]"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${item.iconBg}`}>
              <item.icon className={`w-5 h-5 ${item.iconColor}`} />
            </div>
            <p className="text-xs text-[#94A3B8] mb-1">{item.title}</p>
            <p className="text-xl font-bold text-[#1C2434] mb-2">{item.value}</p>
            <div className="flex items-center gap-1">
              {item.change >= 0 ? (
                <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-500">
                  <ArrowUp className="w-3 h-3" /> +{item.change}%
                </span>
              ) : (
                <span className="flex items-center gap-0.5 text-xs font-medium text-red-500">
                  <ArrowDown className="w-3 h-3" /> {item.change}%
                </span>
              )}
              <span className="text-xs text-[#94A3B8]">{item.period}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
