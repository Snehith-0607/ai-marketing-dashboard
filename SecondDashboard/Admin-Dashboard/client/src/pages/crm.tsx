import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, MoreVertical, Mail, Phone, MapPin, Star, Users, UserCheck, UserPlus, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const kpis = [
  { title: "Total Leads", value: "2,847", change: 8.2, icon: Users, bg: "bg-[#465FFF]/10", color: "text-[#465FFF]" },
  { title: "Qualified Leads", value: "1,235", change: 12.5, icon: UserCheck, bg: "bg-emerald-50", color: "text-emerald-500" },
  { title: "New Contacts", value: "648", change: -3.1, icon: UserPlus, bg: "bg-amber-50", color: "text-amber-500" },
  { title: "Deal Value", value: "$4.2M", change: 15.7, icon: DollarSign, bg: "bg-purple-50", color: "text-purple-500" },
];

const pipelineData = [
  { stage: "Prospect", count: 45, value: "$890K" },
  { stage: "Qualified", count: 32, value: "$1.2M" },
  { stage: "Proposal", count: 18, value: "$780K" },
  { stage: "Negotiation", count: 12, value: "$560K" },
  { stage: "Closed Won", count: 8, value: "$420K" },
];

const dealsByMonth = [
  { month: "Jan", won: 12, lost: 4 },
  { month: "Feb", won: 18, lost: 6 },
  { month: "Mar", won: 15, lost: 3 },
  { month: "Apr", won: 22, lost: 5 },
  { month: "May", won: 19, lost: 7 },
  { month: "Jun", won: 25, lost: 4 },
];

const leadSources = [
  { name: "Website", value: 35, color: "#465FFF" },
  { name: "Referral", value: 25, color: "#10B981" },
  { name: "Social Media", value: 20, color: "#F59E0B" },
  { name: "Email", value: 12, color: "#8B5CF6" },
  { name: "Direct", value: 8, color: "#EC4899" },
];

const recentContacts = [
  { name: "Priya Sharma", email: "priya@nykaa.com", company: "Nykaa Beauty", status: "Active", deal: "$45K", initials: "PS", gradient: "from-pink-400 to-rose-400" },
  { name: "Rahul Verma", email: "rahul@flipkart.com", company: "Flipkart", status: "New", deal: "$120K", initials: "RV", gradient: "from-blue-400 to-indigo-400" },
  { name: "Anita Desai", email: "anita@amazon.in", company: "Amazon India", status: "Active", deal: "$85K", initials: "AD", gradient: "from-emerald-400 to-teal-400" },
  { name: "Vikram Singh", email: "vikram@myntra.com", company: "Myntra", status: "Pending", deal: "$67K", initials: "VS", gradient: "from-amber-400 to-orange-400" },
  { name: "Sneha Patel", email: "sneha@purplle.com", company: "Purplle", status: "Active", deal: "$38K", initials: "SP", gradient: "from-purple-400 to-violet-400" },
];

const statusStyles: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  New: "bg-[#465FFF]/10 text-[#465FFF]",
  Pending: "bg-amber-50 text-amber-600",
};

export default function CRMDashboard() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-5 border border-[#E2E8F0]" data-testid={`card-crm-kpi-${i}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${kpi.bg}`}>
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <p className="text-xs text-[#94A3B8] mb-1">{kpi.title}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-bold text-[#1C2434]">{kpi.value}</h3>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${kpi.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                {kpi.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(kpi.change)}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-deals-chart">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-[#1C2434]">Deals Overview</h3>
              <p className="text-sm text-[#64748B]">Won vs Lost deals by month</p>
            </div>
            <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={dealsByMonth} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} />
              <Bar dataKey="won" fill="#465FFF" radius={[4, 4, 0, 0]} barSize={20} name="Won" />
              <Bar dataKey="lost" fill="#F87171" radius={[4, 4, 0, 0]} barSize={20} name="Lost" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-lead-sources">
          <h3 className="text-lg font-semibold text-[#1C2434] mb-1">Lead Sources</h3>
          <p className="text-sm text-[#64748B] mb-4">Where your leads come from</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={leadSources} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {leadSources.map((entry) => (<Cell key={entry.name} fill={entry.color} />))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "#1C2434", border: "none", borderRadius: "8px", color: "white", fontSize: "13px" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {leadSources.map((src) => (
              <div key={src.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                  <span className="text-[#64748B]">{src.name}</span>
                </div>
                <span className="font-medium text-[#1C2434]">{src.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-pipeline">
        <h3 className="text-lg font-semibold text-[#1C2434] mb-4">Sales Pipeline</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {pipelineData.map((stage, i) => (
            <motion.div key={stage.stage} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="relative text-center p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
              <p className="text-xs text-[#94A3B8] font-medium uppercase tracking-wider">{stage.stage}</p>
              <p className="text-2xl font-bold text-[#1C2434] mt-1">{stage.count}</p>
              <p className="text-sm font-semibold text-[#465FFF] mt-0.5">{stage.value}</p>
              {i < pipelineData.length - 1 && (
                <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-5 h-5 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-[#94A3B8] text-xs">→</div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-recent-contacts">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#1C2434]">Recent Contacts</h3>
          <button className="text-sm text-[#465FFF] font-medium" data-testid="link-view-all-contacts">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-[#94A3B8] uppercase tracking-wider">
                <th className="pb-3 pr-4">Contact</th>
                <th className="pb-3 pr-4">Company</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3">Deal Value</th>
              </tr>
            </thead>
            <tbody>
              {recentContacts.map((contact) => (
                <tr key={contact.name} className="border-t border-[#F1F5F9]" data-testid={`row-contact-${contact.name.toLowerCase().replace(/\s/g, "-")}`}>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${contact.gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{contact.initials}</div>
                      <div>
                        <p className="text-sm font-medium text-[#1C2434]">{contact.name}</p>
                        <p className="text-xs text-[#94A3B8]">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-sm text-[#64748B]">{contact.company}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[contact.status]}`}>{contact.status}</span>
                  </td>
                  <td className="py-3 text-sm font-semibold text-[#1C2434]">{contact.deal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
