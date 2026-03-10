import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

interface CalEvent {
  id: number;
  title: string;
  time: string;
  date: number;
  month: number;
  year: number;
  color: string;
  type: string;
}

const events: CalEvent[] = [
  { id: 1, title: "Team Standup", time: "09:00 AM", date: 3, month: 2, year: 2026, color: "bg-[#465FFF]", type: "Meeting" },
  { id: 2, title: "Campaign Review", time: "11:00 AM", date: 5, month: 2, year: 2026, color: "bg-emerald-500", type: "Review" },
  { id: 3, title: "Product Launch", time: "02:00 PM", date: 10, month: 2, year: 2026, color: "bg-amber-500", type: "Launch" },
  { id: 4, title: "Q1 Planning", time: "10:00 AM", date: 12, month: 2, year: 2026, color: "bg-purple-500", type: "Planning" },
  { id: 5, title: "Design Sprint", time: "09:30 AM", date: 15, month: 2, year: 2026, color: "bg-pink-500", type: "Sprint" },
  { id: 6, title: "Client Meeting", time: "03:00 PM", date: 18, month: 2, year: 2026, color: "bg-[#465FFF]", type: "Meeting" },
  { id: 7, title: "Marketing Sync", time: "11:30 AM", date: 20, month: 2, year: 2026, color: "bg-emerald-500", type: "Meeting" },
  { id: 8, title: "Budget Review", time: "02:00 PM", date: 22, month: 2, year: 2026, color: "bg-amber-500", type: "Review" },
  { id: 9, title: "Sprint Demo", time: "04:00 PM", date: 25, month: 2, year: 2026, color: "bg-purple-500", type: "Demo" },
  { id: 10, title: "Team Offsite", time: "10:00 AM", date: 28, month: 2, year: 2026, color: "bg-pink-500", type: "Event" },
];

const upcomingEvents = [
  { title: "Team Standup", time: "09:00 - 09:30 AM", location: "Google Meet", attendees: 8, color: "bg-[#465FFF]" },
  { title: "Campaign Review", time: "11:00 - 12:00 PM", location: "Conference Room A", attendees: 5, color: "bg-emerald-500" },
  { title: "Product Launch Planning", time: "02:00 - 03:30 PM", location: "Main Hall", attendees: 15, color: "bg-amber-500" },
  { title: "Design Sprint Kickoff", time: "09:30 - 11:00 AM", location: "Design Lab", attendees: 6, color: "bg-purple-500" },
  { title: "Client Presentation", time: "03:00 - 04:00 PM", location: "Zoom Call", attendees: 4, color: "bg-pink-500" },
];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(2);
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const prevMonthDays = getDaysInMonth(currentMonth - 1 < 0 ? 11 : currentMonth - 1, currentMonth - 1 < 0 ? currentYear - 1 : currentYear);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const getEventsForDate = (date: number) => events.filter(e => e.date === date && e.month === currentMonth && e.year === currentYear);

  const calendarDays: (number | null)[] = [];
  for (let i = firstDay - 1; i >= 0; i--) calendarDays.push(-(prevMonthDays - i));
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);
  const remaining = 42 - calendarDays.length;
  for (let i = 1; i <= remaining; i++) calendarDays.push(null);

  const today = new Date();
  const isToday = (day: number) => day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#1C2434]">Calendar</h2>
        <button className="flex items-center gap-2 bg-[#465FFF] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#3A50E0] transition-colors" data-testid="button-add-event">
          <Plus className="w-4 h-4" />
          Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-calendar">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-[#1C2434]">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={prevMonth} className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9]" data-testid="button-prev-month">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} className="w-8 h-8 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9]" data-testid="button-next-month">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-[#E2E8F0] rounded-xl overflow-hidden border border-[#E2E8F0]">
            {DAYS.map((day) => (
              <div key={day} className="bg-[#F8FAFC] py-3 text-center text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                {day}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              const isPrevMonth = day !== null && day < 0;
              const isNextMonth = day === null;
              const actualDay = isPrevMonth ? Math.abs(day!) : day;
              const dayEvents = !isPrevMonth && !isNextMonth && day ? getEventsForDate(day) : [];

              return (
                <div
                  key={i}
                  onClick={() => day && day > 0 && setSelectedDate(day)}
                  className={`bg-white min-h-[80px] p-2 cursor-pointer transition-colors hover:bg-[#F8FAFC] ${
                    selectedDate === day ? "ring-2 ring-[#465FFF] ring-inset" : ""
                  }`}
                  data-testid={day && day > 0 ? `calendar-day-${day}` : undefined}
                >
                  <span className={`text-sm font-medium inline-flex items-center justify-center w-7 h-7 rounded-full ${
                    isPrevMonth || isNextMonth
                      ? "text-[#CBD5E1]"
                      : isToday(day!)
                        ? "bg-[#465FFF] text-white"
                        : selectedDate === day
                          ? "text-[#465FFF] font-semibold"
                          : "text-[#1C2434]"
                  }`}>
                    {isPrevMonth ? prevMonthDays + (day! + 1) : isNextMonth ? i - firstDay - daysInMonth + 1 : day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div key={ev.id} className={`${ev.color} text-white text-[10px] font-medium px-1.5 py-0.5 rounded truncate`}>
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-[#94A3B8] font-medium">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0]" data-testid="card-upcoming-events">
          <h3 className="text-lg font-semibold text-[#1C2434] mb-1">Upcoming Events</h3>
          <p className="text-sm text-[#64748B] mb-5">Your schedule for this week</p>
          <div className="space-y-4">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.title}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-3 p-3 rounded-xl hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                data-testid={`event-${event.title.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div className={`w-1 rounded-full flex-shrink-0 ${event.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C2434] truncate">{event.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Clock className="w-3 h-3 text-[#94A3B8]" />
                    <span className="text-xs text-[#64748B]">{event.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#94A3B8]" />
                    <span className="text-xs text-[#64748B]">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Users className="w-3 h-3 text-[#94A3B8]" />
                    <span className="text-xs text-[#64748B]">{event.attendees} attendees</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
