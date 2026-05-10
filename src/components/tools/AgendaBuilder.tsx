import { motion } from "framer-motion";
import { Plus, Search, Calendar, ChevronRight, Clock, FileText } from "lucide-react";

const agendas = [
  { id: 1, title: "Sacrament Meeting", date: "May 17, 2026", status: "Draft" },
  { id: 2, title: "Stake Conference", date: "June 24, 2026", status: "Planned" },
  { id: 3, title: "Youth Activity", date: "May 20, 2026", status: "Draft" },
];

export function AgendaBuilder() {
  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Agenda Builder</h1>
          <p className="text-on-surface-variant mt-1">Manage and create service programs.</p>
        </div>
        <a href="/plan/sunday" className="bg-secondary text-on-secondary p-4 rounded-2xl shadow-lg shadow-secondary/20 transition-transform active:scale-95">
          <Plus className="h-6 w-6" />
        </a>
      </div>

      <div className="bg-surface-container-low flex items-center px-4 py-3 rounded-2xl border border-outline-variant/30">
        <Search className="h-5 w-5 text-outline" />
        <input type="text" placeholder="Search agendas..." className="bg-transparent border-none focus:ring-0 w-full ml-2 text-sm" />
      </div>

      <div className="space-y-4">
        {agendas.map((agenda, i) => (
          <motion.div
            key={agenda.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="bg-secondary/10 p-3 rounded-2xl text-secondary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary">{agenda.title}</h3>
                <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {agenda.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {agenda.status}</span>
                </div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-outline group-hover:translate-x-1 transition-transform" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
