import { MoreVertical, ExternalLink, BarChart3 } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";

const links = [
  { name: "Google Analytics", icon: BarChart3, color: "text-amber-500", bg: "bg-amber-50" },
  { name: "Facebook Ads", icon: SiFacebook, color: "text-[#1877F2]", bg: "bg-blue-50" },
  { name: "Seranking", icon: BarChart3, color: "text-[#465FFF]", bg: "bg-[#465FFF]/10" },
  { name: "Instagram Ads", icon: SiInstagram, color: "text-pink-500", bg: "bg-pink-50" },
];

export default function ExternalLinks() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-external-links">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[#1C2434]">External Links</h3>
          <p className="text-sm text-[#64748B]">Most used resources</p>
        </div>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.name}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
            data-testid={`link-external-${link.name.toLowerCase().replace(/\s/g, "-")}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${link.bg}`}>
                <link.icon className={`w-5 h-5 ${link.color}`} />
              </div>
              <span className="text-sm font-medium text-[#1C2434]">{link.name}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
