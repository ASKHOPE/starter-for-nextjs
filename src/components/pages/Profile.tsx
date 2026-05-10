import { motion } from "framer-motion";
import { User, Mail, Shield, Bell, LogOut, ChevronRight, Sparkles, Camera, MapPin, Calendar, Clock } from "lucide-react";
import { actions } from "astro:actions";

export function Profile() {
  const handleLogout = async () => {
    await actions.logout();
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-32">
      {/* Premium Header Card */}
      <section className="bg-primary rounded-[3rem] p-8 md:p-14 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="relative">
            <div className="h-40 w-40 rounded-[2.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border-2 border-white/20 shadow-2xl">
              <User className="h-20 w-20" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-secondary text-white p-3 rounded-2xl shadow-xl border-4 border-primary hover:scale-110 transition-transform">
              <Camera className="h-5 w-5" />
            </button>
          </div>
          
          <div className="text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-blue-200 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="h-3 w-3" />
                Active Calling
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Bishop David Smith</h1>
              <p className="text-blue-100/80 text-xl font-medium italic">Oak Hills 4th Ward • Stake of Zion</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                <MapPin className="h-3 w-3" /> Chapel West
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                <Calendar className="h-3 w-3" /> Setting Apart: 2024
              </span>
            </div>
          </div>
        </div>

        {/* Abstract Shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Account Settings Column */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-xl shadow-slate-200/40 space-y-8">
            <h2 className="text-2xl font-black text-primary tracking-tight">Security & Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileCard icon={Mail} label="Contact Email" value="bishop.smith@ward.org" />
              <ProfileCard icon={Shield} label="Access Level" value="Stake Administrator" />
              <ProfileCard icon={Clock} label="Session Expiry" value="In 4 Hours" />
              <ProfileCard icon={Bell} label="Notification Mode" value="Critical Alerts Only" />
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/20">
            <h2 className="text-xl font-bold text-primary mb-6">Recent Activity</h2>
            <div className="space-y-3">
              <ActivityItem label="Sacrament Agenda Finalized" time="2h ago" type="Agenda" />
              <ActivityItem label="Attendance Exported" time="Yesterday" type="Data" />
              <ActivityItem label="System Backup Completed" time="3 days ago" type="System" />
            </div>
          </section>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-lg space-y-6 text-center">
            <h3 className="font-black text-primary">Need Help?</h3>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
              Contact your Stake Technology Specialist for help with permissions or data sync issues.
            </p>
            <button className="w-full bg-surface-container-low py-4 rounded-2xl font-bold text-primary border border-outline-variant/20 hover:bg-surface-variant transition-colors">
              Request Support
            </button>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full bg-rose-50 text-rose-600 py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 border border-rose-100 hover:bg-rose-100 transition-all shadow-xl shadow-rose-900/5 active:scale-95"
          >
            <LogOut className="h-6 w-6" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-outline-variant/10 group cursor-pointer hover:border-secondary/30 transition-all">
      <div className="bg-secondary/5 h-10 w-10 rounded-xl flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-[10px] font-black text-outline uppercase tracking-widest leading-none mb-2">{label}</p>
      <p className="text-sm font-black text-primary">{value}</p>
    </div>
  );
}

function ActivityItem({ label, time, type }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <span className="text-xs font-black text-secondary bg-secondary/10 px-2 py-1 rounded-lg uppercase tracking-tighter">{type}</span>
        <span className="text-sm font-medium text-primary">{label}</span>
      </div>
      <span className="text-[10px] font-bold text-on-surface-variant">{time}</span>
    </div>
  );
}
