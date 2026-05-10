import { Search, Church, Users, Edit, UserPlus, StickyNote, Ellipsis, BookOpenText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function Dashboard() {
  return (
    <div className="space-y-12 pb-24">
      {/* Search Section - Responsive Width */}
      <section className="relative max-w-2xl mx-auto md:mx-0">
        <div className="bg-surface-container-lowest flex items-center rounded-3xl border border-outline-variant/30 px-6 py-5 shadow-xl shadow-slate-200/40 transition-all focus-within:ring-4 focus-within:ring-secondary/10 focus-within:border-secondary">
          <Search className="text-outline h-5 w-5" />
          <input
            type="text"
            placeholder="Search agendas, members, or lessons..."
            className="font-medium text-body-lg placeholder:text-on-surface-variant ml-4 w-full border-none bg-transparent outline-none focus:ring-0"
          />
        </div>
      </section>

      {/* Hero Section: Today's Agenda */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary overflow-hidden rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-slate-900/30 relative"
      >
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]">Live Session</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Sunday Sacrament Service</h2>
            </div>
            <p className="text-blue-100/80 text-lg max-w-md font-medium leading-relaxed">
              Managing Oak Hills 4th Ward. Join the live stream or edit the program in real-time.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="/plan/sunday" className="bg-white text-primary px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                <Edit className="h-5 w-5" />
                Edit Program
              </a>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all">
                <Users className="h-5 w-5" />
                Attendance
              </button>
            </div>
          </div>
          
          <div className="hidden lg:grid grid-cols-1 gap-4">
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10">
              <h3 className="text-sm font-bold text-blue-200 uppercase mb-4">Current Progress</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-xs">
                  <span>Opening Hymn</span>
                  <span className="text-emerald-400 font-bold">Done</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-1/3 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />
      </motion.section>

      {/* Grid Section: Activities & Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Schedule */}
        <section className="xl:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-primary">Sunday Schedule</h2>
            <button className="text-secondary font-bold text-sm flex items-center gap-1 group">
              Full Calendar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Sacrament Meeting", time: "10:00 AM", location: "Chapel", icon: Church, color: "text-blue-600", bg: "bg-blue-50" },
              { title: "Sunday School", time: "11:15 AM", location: "Room 204", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
              { title: "Priesthood / RS", time: "12:15 PM", location: "Main Hall", icon: BookOpenText, color: "text-emerald-600", bg: "bg-emerald-50" },
              { title: "Youth Mtg", time: "12:15 PM", location: "Room 102", icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 flex items-start gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group"
              >
                <div className={`${item.bg} ${item.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-primary">{item.title}</h3>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">{item.time} • {item.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Actions - Vertical Column on Large, Row on Small */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-primary">Admin Access</h2>
          <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
            {[
              { icon: UserPlus, label: "Manage Visitors", color: "bg-blue-50 text-blue-600" },
              { icon: Users, label: "Mark Attendance", color: "bg-purple-50 text-purple-600" },
              { icon: StickyNote, label: "Take Notes", color: "bg-amber-50 text-amber-600" },
              { icon: Ellipsis, label: "More Tools", color: "bg-slate-50 text-slate-600" },
            ].map((action) => (
              <div key={action.label} className="bg-surface-container-lowest p-5 rounded-[2rem] border border-outline-variant/30 flex items-center gap-4 group cursor-pointer hover:bg-surface-variant/20 transition-all">
                <div className={`${action.color} p-3 rounded-xl group-hover:rotate-12 transition-transform`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="font-bold text-sm text-primary">{action.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
