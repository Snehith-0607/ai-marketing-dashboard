import { motion } from "framer-motion";
import { Construction } from "lucide-react";
import { useLocation } from "wouter";

export default function PlaceholderPage() {
  const [location] = useLocation();
  const pageName = location.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" > ") || "Page";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20"
    >
      <div className="w-16 h-16 rounded-full bg-[#465FFF]/10 flex items-center justify-center mb-6">
        <Construction className="w-8 h-8 text-[#465FFF]" />
      </div>
      <h2 className="text-2xl font-bold text-[#1C2434] mb-2">{pageName}</h2>
      <p className="text-sm text-[#64748B] text-center max-w-sm">
        This section is under development. Check back soon for updates.
      </p>
    </motion.div>
  );
}
