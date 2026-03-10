import { motion } from "framer-motion";
import { Users, ShoppingCart } from "lucide-react";
import MetricCard from "@/components/dashboard/MetricCard";
import MonthlySalesChart from "@/components/charts/MonthlySalesChart";
import MonthlyTargetChart from "@/components/charts/MonthlyTargetChart";
import StatisticsChart from "@/components/charts/StatisticsChart";
import WorldMap from "@/components/charts/WorldMap";
import CustomerDemographic from "@/components/dashboard/CustomerDemographic";
import RecentOrders from "@/components/dashboard/RecentOrders";

export default function EcommerceDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <MetricCard
          title="Customers"
          value="3,782"
          change={11.01}
          icon={<Users className="w-6 h-6 text-[#465FFF]" />}
          iconBg="bg-[#465FFF]/10"
        />
        <MetricCard
          title="Orders"
          value="5,359"
          change={-9.05}
          icon={<ShoppingCart className="w-6 h-6 text-emerald-500" />}
          iconBg="bg-emerald-50"
        />
        <div className="md:col-span-2 xl:col-span-1 xl:row-span-2">
          <MonthlyTargetChart />
        </div>
        <div className="md:col-span-2">
          <MonthlySalesChart />
        </div>
      </div>

      <StatisticsChart />

      <WorldMap />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CustomerDemographic />
        <RecentOrders />
      </div>
    </motion.div>
  );
}
