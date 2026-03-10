import { MoreVertical } from "lucide-react";

const feedbacks = [
  {
    name: "Timothy Smith",
    action: "Commented on CloudKillan James",
    time: "1 hour ago",
    message: "It's an Affiliate commissions SaaS application that allows you to track your affiliate revenue.",
    initials: "TS",
    gradient: "from-purple-400 to-pink-400",
  },
  {
    name: "Nancy Martino",
    action: "Commented on CloudMatney",
    time: "2 hours ago",
    message: "There are many variations of passages of Lorem Ipsum available, but the majority have suffered.",
    initials: "NM",
    gradient: "from-amber-400 to-orange-400",
  },
  {
    name: "Michael Morris",
    action: "Commented on CloudWilliams Son",
    time: "3 hours ago",
    message: "It's an Affiliate commissions SaaS application that allows you to track your affiliate revenue.",
    initials: "MM",
    gradient: "from-emerald-400 to-teal-400",
  },
];

export default function FeedbackCard() {
  return (
    <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-feedback">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[#1C2434]">Feedback</h3>
        <button className="p-1 rounded hover:bg-[#F1F5F9] text-[#94A3B8]">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-5">
        {feedbacks.map((fb) => (
          <div key={fb.name} className="flex gap-3" data-testid={`feedback-${fb.name.toLowerCase().replace(/\s/g, "-")}`}>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${fb.gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
              {fb.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium text-[#1C2434]">
                    {fb.name}
                    <span className="text-[#94A3B8] font-normal"> {fb.action}</span>
                  </p>
                </div>
                <span className="text-xs text-[#94A3B8] whitespace-nowrap">{fb.time}</span>
              </div>
              <p className="text-sm text-[#64748B] mt-1">{fb.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
