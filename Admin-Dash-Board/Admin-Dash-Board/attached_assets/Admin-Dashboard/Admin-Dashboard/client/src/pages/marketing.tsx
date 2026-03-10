import { motion } from "framer-motion";
import HighlightsCard from "@/components/dashboard/HighlightsCard";
import ExternalLinks from "@/components/dashboard/ExternalLinks";
import CampaignVisitorsChart from "@/components/charts/CampaignVisitorsChart";
import TopChannels from "@/components/dashboard/TopChannels";
import CampaignCostChart from "@/components/charts/CampaignCostChart";
import FeaturedCampaigns from "@/components/dashboard/FeaturedCampaigns";
import FeedbackCard from "@/components/dashboard/FeedbackCard";

export default function MarketingDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <HighlightsCard />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ExternalLinks />
        <CampaignVisitorsChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TopChannels />
        <CampaignCostChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <FeaturedCampaigns />
        <FeedbackCard />
      </div>
    </motion.div>
  );
}
