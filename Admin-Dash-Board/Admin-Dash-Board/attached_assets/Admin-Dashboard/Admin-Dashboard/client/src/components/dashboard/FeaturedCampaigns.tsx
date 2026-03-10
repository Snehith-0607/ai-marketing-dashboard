import { MoreVertical } from "lucide-react";
import { useState } from "react";

const tabs = ["Google", "Facebook", "Instagram", "Seranking"];

const campaigns = [
  { title: "Best Headsets Giveaway", status: "In Queue", conversion: "0%", count: "(0)" },
  { title: "iPhone 14 Plus Giveaway", status: "Sent", conversion: "37%", count: "(247)" },
  { title: "Macbook Pro M1 Giveaway", status: "Sent", conversion: "18%", count: "(6.4k)" },
  { title: "Affiliation Program", status: "Sent", conversion: "12%", count: "(2.6K)" },
  { title: "Google AdSense", status: "In Draft", conversion: "0.01%", count: "(1)" },
];

const statusStyles: Record<string, string> = {
  "In Queue": "bg-amber-50 text-amber-600",
  Sent: "bg-emerald-50 text-emerald-600",
  "In Draft": "bg-[#F1F5F9] text-[#64748B]",
};

export default function FeaturedCampaigns() {
  const [activeTab, setActiveTab] = useState("Google");

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-featured-campaigns">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1C2434]">Featured Campaigns</h3>
          <p className="text-sm text-[#64748B]">75% activity growth</p>
        </div>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            data-testid={`button-campaign-${tab.toLowerCase()}`}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#465FFF] text-white"
                : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" data-testid="table-campaigns">
          <thead>
            <tr className="text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
              <th className="pb-3 pr-4">Email Title</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.title} className="border-t border-[#F1F5F9]" data-testid={`row-campaign-${c.title.toLowerCase().replace(/\s/g, "-")}`}>
                <td className="py-3 pr-4 text-sm font-medium text-[#1C2434]">{c.title}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="py-3 text-sm text-[#64748B]">
                  {c.conversion} <span className="text-[#94A3B8]">{c.count}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
