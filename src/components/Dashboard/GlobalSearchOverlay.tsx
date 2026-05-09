"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, BookOpen, RefreshCw, Tag, Link as LinkIcon } from 'lucide-react';

interface GlobalSearchOverlayProps {
  show: boolean;
  onClose: () => void;
  query: string;
  setQuery: (q: string) => void;
  results: any[];
}

export const GlobalSearchOverlay: React.FC<GlobalSearchOverlayProps> = ({
  show,
  onClose,
  query,
  setQuery,
  results
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] flex flex-col bg-slate-900/95 backdrop-blur-2xl" 
          onClick={onClose}
        >
          <div className="flex-none px-8 pt-12 pb-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-[900] text-white tracking-tight">Global Discovery</h3>
              <button 
                onClick={onClose} 
                className="rounded-full bg-white/10 p-3 text-white/60 hover:text-white transition-colors"
              >
                <X size={24} strokeWidth={2.5} />
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-white/20 group-focus-within:text-sky-400 transition-colors">
                <Search size={22} strokeWidth={3} />
              </div>
              <input 
                autoFocus 
                type="text" 
                placeholder="Search across all sacred collections..." 
                className="w-full rounded-[2rem] bg-white/5 p-6 pl-16 text-lg font-bold text-white shadow-2xl ring-1 ring-white/10 focus:ring-4 focus:ring-sky-500/20 outline-none transition-all placeholder:text-white/10" 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 pb-12 no-scrollbar" onClick={(e) => e.stopPropagation()}>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((item, i) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      if (item.url) window.open(item.url, '_blank');
                      onClose();
                    }}
                    className="group flex items-center gap-5 rounded-[2rem] bg-white/5 p-5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                  >
                    <div className="h-12 w-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:bg-sky-500 group-hover:text-white transition-all shadow-inner">
                      {item.type === "General Conference" ? <BookOpen size={20} /> : (item.type.includes("Hymn") || item.type.includes("Music")) ? <RefreshCw size={20} /> : <Tag size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-[900] uppercase tracking-widest text-sky-400/60">{item.type}</span>
                        {'number' in item && item.number && <span className="text-[9px] font-[900] uppercase tracking-widest text-white/20">#{item.number}</span>}
                      </div>
                      <h4 className="text-[15px] font-bold text-white truncate">{item.title}</h4>
                      {'speaker' in item && item.speaker && <p className="text-[11px] text-white/40 font-medium">{item.speaker}</p>}
                    </div>
                    <LinkIcon size={16} className="text-white/10 group-hover:text-sky-400 transition-colors" />
                  </motion.div>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-12">
                <div className="h-20 w-20 rounded-[2.5rem] bg-white/5 flex items-center justify-center text-white/10 mb-6"><Search size={40} /></div>
                <h3 className="text-xl font-bold text-white mb-2">No references found</h3>
                <p className="text-sm text-white/40 leading-relaxed">We couldn't find any sacred materials matching your search. Try a different topic or name.</p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-12">
                <div className="h-20 w-20 rounded-[2.5rem] bg-sky-500/10 flex items-center justify-center text-sky-400/20 mb-6"><RefreshCw size={40} className="animate-spin-slow" /></div>
                <h3 className="text-xl font-bold text-white mb-2">Search the Entire Library</h3>
                <p className="text-sm text-white/40 leading-relaxed">Enter a topic, speaker, or hymn number to find it instantly across all collections.</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
