import { motion } from "framer-motion";
import { Search, User, Phone, Mail, ChevronRight, Filter } from "lucide-react";

const members = [
  { name: "Bishop Smith", role: "Bishopric", phone: "555-0101", initial: "BS" },
  { name: "Sister Jones", role: "Relief Society", phone: "555-0102", initial: "SJ" },
  { name: "Brother Miller", role: "Elder's Quorum", phone: "555-0103", initial: "BM" },
  { name: "Sister Wilson", role: "Primary", phone: "555-0104", initial: "SW" },
];

export function MemberDirectory() {
  return (
    <div className="space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Member Directory</h1>
          <p className="text-on-surface-variant mt-1">Ward leadership and organization.</p>
        </div>
        <button className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/30 text-primary transition-colors hover:bg-surface-variant">
          <Filter className="h-5 w-5" />
        </button>
      </div>

      <div className="bg-surface-container-low flex items-center px-4 py-3 rounded-2xl border border-outline-variant/30">
        <Search className="h-5 w-5 text-outline" />
        <input type="text" placeholder="Search members by name or calling..." className="bg-transparent border-none focus:ring-0 w-full ml-2 text-sm" />
      </div>

      <div className="space-y-3">
        {members.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-3xl flex items-center justify-between group hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-sm border border-outline-variant/20">
                {member.initial}
              </div>
              <div>
                <h3 className="font-bold text-primary">{member.name}</h3>
                <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{member.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-xl text-secondary hover:bg-secondary/10"><Phone className="h-4 w-4" /></button>
              <button className="p-2 rounded-xl text-secondary hover:bg-secondary/10"><Mail className="h-4 w-4" /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
