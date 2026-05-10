import { motion } from "framer-motion";
import { Database, Download, FileJson, FileSpreadsheet, FileText, ChevronRight } from "lucide-react";

const exportOptions = [
  { title: "Agenda Records", type: "PDF / Word", icon: FileText, color: "text-blue-600" },
  { title: "Attendance Logs", type: "Excel / CSV", icon: FileSpreadsheet, color: "text-emerald-600" },
  { title: "Member Lists", type: "JSON / CSV", icon: FileJson, color: "text-amber-600" },
];

export function DataExport() {
  return (
    <div className="space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-bold text-primary">Data Export</h1>
        <p className="text-on-surface-variant mt-1">Download and backup your platform data.</p>
      </div>

      <div className="space-y-4">
        {exportOptions.map((option, i) => (
          <motion.div
            key={option.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-5">
              <div className={`${option.color} bg-surface p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform`}>
                <option.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-primary">{option.title}</h3>
                <p className="text-xs text-on-surface-variant">Available formats: {option.type}</p>
              </div>
            </div>
            <div className="bg-secondary/10 p-3 rounded-full text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
              <Download className="h-5 w-5" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4 text-slate-400">
          <Database className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Full System Backup</span>
        </div>
        <h2 className="text-xl font-bold mb-4">Complete Archive</h2>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Generate a comprehensive encrypted backup of all agendas, attendance records, and member metadata.
        </p>
        <button className="w-full bg-white text-slate-900 py-4 rounded-2xl font-bold shadow-xl shadow-white/10 active:scale-[0.98] transition-transform">
          Generate Full Export
        </button>
      </div>
    </div>
  );
}
