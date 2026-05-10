import { motion } from "framer-motion";
import { Users, Check, Search, Calendar } from "lucide-react";
import { useState } from "react";

const classes = [
  { id: 1, name: "Gospel Doctrine", count: 42 },
  { id: 2, name: "Elder's Quorum", count: 28 },
  { id: 3, name: "Relief Society", count: 35 },
  { id: 4, name: "Primary", count: 18 },
];

export function AttendanceTracker() {
  return (
    <div className="space-y-8 pb-32">
      <div>
        <h1 className="text-3xl font-bold text-primary">Attendance</h1>
        <p className="text-on-surface-variant mt-1">Track participation for Sunday classes.</p>
      </div>

      <div className="bg-primary rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Total Attendance</span>
          <Calendar className="h-4 w-4 text-blue-200" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">123</span>
          <span className="text-sm text-blue-200">Members Present</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {classes.map((cls, i) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-3xl flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-primary">{cls.name}</h3>
                <p className="text-xs text-on-surface-variant">{cls.count} Registered</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-surface px-4 py-2 rounded-xl border border-outline-variant/30 font-bold text-primary">
                {Math.floor(cls.count * 0.8)}
              </div>
              <button className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20">
                <Check className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
