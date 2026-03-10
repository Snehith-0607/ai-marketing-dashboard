import { MoreVertical } from "lucide-react";
import { SiGoogle, SiFacebook, SiGithub, SiVimeo } from "react-icons/si";
import { RiTwitterXFill } from "react-icons/ri";

const channels = [
  { name: "Google", icon: SiGoogle, iconColor: "#4285F4", visitors: "3.5K", revenue: "$4,220.00", sales: "3456", conversion: "2.59%" },
  { name: "X.com", icon: RiTwitterXFill, iconColor: "#000", visitors: "3.5K", revenue: "$4,220.00", sales: "3456", conversion: "2.59%" },
  { name: "Github", icon: SiGithub, iconColor: "#333", visitors: "3.5K", revenue: "$4,220.00", sales: "3456", conversion: "2.59%" },
  { name: "Vimeo", icon: SiVimeo, iconColor: "#1AB7EA", visitors: "3.5K", revenue: "$4,220.00", sales: "3456", conversion: "2.59%" },
  { name: "Facebook", icon: SiFacebook, iconColor: "#1877F2", visitors: "3.5K", revenue: "$4,220.00", sales: "3456", conversion: "2.59%" },
];

export default function TopChannels() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-top-channels">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#1C2434]">Top Channels</h3>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" data-testid="table-channels">
          <thead>
            <tr className="text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
              <th className="pb-3 pr-4">Source</th>
              <th className="pb-3 pr-4">Visitors</th>
              <th className="pb-3 pr-4">Revenues</th>
              <th className="pb-3 pr-4">Sales</th>
              <th className="pb-3">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => (
              <tr key={ch.name} className="border-t border-[#F1F5F9]" data-testid={`row-channel-${ch.name.toLowerCase()}`}>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <ch.icon className="w-5 h-5" style={{ color: ch.iconColor }} />
                    <span className="text-sm font-medium text-[#1C2434]">{ch.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-sm text-[#64748B]">{ch.visitors}</td>
                <td className="py-3 pr-4 text-sm font-medium text-emerald-500">{ch.revenue}</td>
                <td className="py-3 pr-4 text-sm text-[#64748B]">{ch.sales}</td>
                <td className="py-3 text-sm text-[#64748B]">{ch.conversion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
