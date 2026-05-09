"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, RefreshCw, Printer, ChevronDown, ChevronUp } from 'lucide-react';

interface AgendaManagerProps {
  timeframe: any;
  setTimeframe: (t: any) => void;
  agendaView: any;
  setAgendaView: (v: any) => void;
  agendaSearchQuery: string;
  setAgendaSearchQuery: (s: string) => void;
  filteredAgenda: any[];
  expandedAgendaId: string | null;
  setExpandedAgendaId: (id: string | null) => void;
  isSyncing: boolean;
  generateSundayAgendas: () => void;
}

export const AgendaManager: React.FC<AgendaManagerProps> = ({
  timeframe,
  setTimeframe,
  agendaView,
  setAgendaView,
  agendaSearchQuery,
  setAgendaSearchQuery,
  filteredAgenda,
  expandedAgendaId,
  setExpandedAgendaId,
  isSyncing,
  generateSundayAgendas
}) => {
  return (
    <section className="px-8 mb-12">
      <div className="mb-8 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">Focus & Vision</h3>
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            {['1month', '6months', '1year'].map(t => (
              <button key={t} onClick={() => setTimeframe(t as any)} className={`px-4 py-2 rounded-xl text-[10px] font-[900] uppercase tracking-widest transition-all ${timeframe === t ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>{t.replace('month', ' Month').replace('year', ' Year')}</button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={() => setAgendaView('general')} className={`flex-1 py-4 rounded-2xl text-xs font-[900] uppercase tracking-widest transition-all ${agendaView === 'general' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}>Agenda</button>
          <button onClick={() => setAgendaView('sunday')} className={`flex-1 py-4 rounded-2xl text-xs font-[900] uppercase tracking-widest transition-all ${agendaView === 'sunday' ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100'}`}>Sabbath Plans</button>
        </div>

        <div className="relative group">
          <input type="text" placeholder="Filter itineraries..." className="w-full rounded-[2rem] bg-white p-5 pl-8 text-sm font-bold text-slate-900 shadow-sm border border-slate-100 outline-none" value={agendaSearchQuery} onChange={(e) => setAgendaSearchQuery(e.target.value)} />
          {agendaView === 'sunday' && (
            <button onClick={generateSundayAgendas} disabled={isSyncing} className="absolute right-3 top-2 bottom-2 rounded-xl bg-sky-50 px-4 text-[10px] font-[900] uppercase tracking-widest text-primary flex items-center gap-2 hover:bg-sky-100 transition-all disabled:opacity-50">
              <RefreshCw size={12} className={isSyncing ? "animate-spin" : ""} /> Auto-Gen
            </button>
          )}
        </div>
      </div>

      {filteredAgenda.length === 0 ? (
        <div className="rounded-[2.5rem] bg-white border-2 border-dashed border-slate-100 p-12 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 mx-auto mb-4"><Calendar size={32} /></div>
          <p className="text-sm font-bold text-slate-400">No scheduled items for this vision.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAgenda.map((item: any) => (
            <div key={item.$id || item.id} className="glass-card rounded-[2.5rem] overflow-hidden">
              <div onClick={() => setExpandedAgendaId(expandedAgendaId === item.id ? null : item.id)} className="p-7 flex items-center justify-between cursor-pointer hover:bg-white/50 transition-all">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-primary shadow-inner"><Clock size={24} /></div>
                  <div>
                    <h4 className="text-lg font-[900] text-slate-900 tracking-tight">{item.title}</h4>
                    <p className="text-[10px] font-[900] uppercase tracking-widest text-slate-400 mt-1">{new Date(item.scheduledDate || item.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
                {expandedAgendaId === item.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
              </div>
              {expandedAgendaId === item.id && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-7 pb-7">
                  <div className="bg-slate-50/50 rounded-[2rem] p-6 mb-4">
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{item.description || "Divine planning in progress..."}</p>
                    {item.sacrament && (
                      <div className="mt-4 space-y-3 pt-4 border-t border-slate-200/50">
                        <div className="flex justify-between items-center"><span className="text-[10px] font-[900] uppercase text-slate-400">Sacrament Conducted by</span><span className="text-xs font-bold text-slate-900">{item.sacrament.conducting}</span></div>
                        <div className="flex justify-between items-center"><span className="text-[10px] font-[900] uppercase text-slate-400">Opening Hymn</span><span className="text-xs font-bold text-primary">{item.sacrament.hymns?.opening}</span></div>
                      </div>
                    )}
                  </div>
                  <button onClick={() => window.print()} className="flex items-center gap-2 text-[10px] font-[900] uppercase tracking-widest text-primary hover:text-sky-600 transition-colors ml-4"><Printer size={12} /> Print Itinerary</button>
                </motion.div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
