import { motion } from "framer-motion";
import { Wrench, Calculator, Settings, UserCheck, ShieldCheck, Database, LayoutTemplate, Sparkles, ArrowRight, RefreshCw } from "lucide-react";

const tools = [
  {
    title: "Agenda Builder",
    description: "Create and manage sacred service programs.",
    icon: LayoutTemplate,
    color: "bg-blue-600",
    href: "/tools/agenda",
  },
  {
    title: "Member Directory",
    description: "Quick access to ward and stake leadership.",
    icon: UserCheck,
    color: "bg-emerald-600",
    href: "/tools/directory",
  },
  {
    title: "Attendance Tracker",
    description: "Monitor participation across auxiliaries.",
    icon: Calculator,
    color: "bg-amber-600",
    href: "/tools/attendance",
  },
  {
    title: "Document Vault",
    description: "Securely store and share organizational docs.",
    icon: ShieldCheck,
    color: "bg-indigo-600",
    href: "/tools/vault",
  },
  {
    title: "Data Export",
    description: "Download agenda and attendance records.",
    icon: Database,
    color: "bg-slate-600",
    href: "/tools/export",
  },
  {
    title: "App Settings",
    description: "Configure your platform experience.",
    icon: Settings,
    color: "bg-rose-600",
    href: "/tools/settings",
  },
];

export function ToolsHub() {
  return (
    <div className="space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest mb-1">
            <Wrench className="h-3 w-3" />
            System Control
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">Admin Tools</h1>
          <p className="text-on-surface-variant mt-2 font-medium">Powerful utilities for ward organizational management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, i) => (
          <motion.a
            key={tool.title}
            href={tool.href}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-container-lowest group flex flex-col items-start p-8 rounded-[2.5rem] border border-outline-variant/30 transition-all hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1"
          >
            <div className={`${tool.color} mb-8 rounded-2xl p-5 text-white shadow-xl shadow-current/20 transition-transform group-hover:scale-110 group-hover:rotate-6`}>
              <tool.icon className="h-8 w-8" />
            </div>
            <div className="space-y-2 flex-1">
              <h3 className="font-black text-xl text-primary tracking-tight group-hover:text-secondary transition-colors">{tool.title}</h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed">{tool.description}</p>
            </div>
            <div className="mt-8 flex items-center gap-2 text-xs font-black text-secondary uppercase tracking-widest group-hover:gap-4 transition-all">
              Launch Tool <ArrowRight className="h-4 w-4" />
            </div>
          </motion.a>
        ))}
      </div>

      {/* Advanced System Operations */}
      <section className="bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest">
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
              Backend Sync
            </div>
            <h2 className="text-3xl font-black tracking-tight">Cloud Content Synchronization</h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
              Refresh the sacred library, update hymn numbers, and sync the latest General Conference talks from the central repository.
            </p>
            <button className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-black shadow-xl shadow-white/10 active:scale-95 transition-transform flex items-center gap-3">
              Sync All Data
            </button>
          </div>
          
          <div className="hidden lg:block">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 space-y-6">
              <h3 className="text-sm font-bold text-blue-400 uppercase">System Health</h3>
              <div className="space-y-4">
                <StatusRow label="Appwrite Database" status="Connected" color="text-emerald-400" />
                <StatusRow label="Scraper Service" status="Idle" color="text-blue-400" />
                <StatusRow label="Last Sync" status="2h ago" color="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] translate-y-1/2" />
      </section>
    </div>
  );
}

function StatusRow({ label, status, color }: any) {
  return (
    <div className="flex justify-between items-center text-sm font-medium">
      <span className="text-slate-400">{label}</span>
      <span className={`${color} font-black`}>{status}</span>
    </div>
  );
}
