"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Search, BookOpen, RefreshCw, Tag, 
  Link as LinkIcon, ChevronDown, ChevronUp, User as UserIcon 
} from 'lucide-react';

interface LibraryBrowserProps {
  activeTab: any;
  setActiveTab: (t: any) => void;
  searchQuery: string;
  setSearchQuery: (s: string) => void;
  selectedConference: string;
  setSelectedConference: (c: string) => void;
  filteredLibrary: any[];
  volumes: any[];
  selectedVolume: any;
  handleSelectVolume: (v: any) => void;
  selectedBook: any;
  handleSelectBook: (b: any) => void;
  selectedChapter: any;
  handleSelectChapter: (vId: string, bId: string, ch: number) => void;
  chapterContent: any;
  isSyncing: boolean;
  handleSyncLibrary: () => void;
}

const tabs = ["General Conference", "Hymns", "Children's Songbook", "New Hymns", "Youth Music", "Gospel Principles", "Come Follow Me", "Scriptures"];

export const LibraryBrowser: React.FC<LibraryBrowserProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  selectedConference,
  setSelectedConference,
  filteredLibrary,
  volumes,
  selectedVolume,
  handleSelectVolume,
  selectedBook,
  handleSelectBook,
  selectedChapter,
  handleSelectChapter,
  chapterContent,
  isSyncing,
  handleSyncLibrary
}) => {
  return (
    <section className="px-8 pb-32">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">Sacred Library</h3>
        <button onClick={handleSyncLibrary} disabled={isSyncing} className="rounded-2xl bg-white p-4 text-primary hover:bg-sky-50 transition-all shadow-sm border border-slate-100 active:scale-90 disabled:opacity-50">
          <RefreshCw size={20} className={isSyncing ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="mb-8 overflow-x-auto no-scrollbar flex gap-3 pb-4 -mx-8 px-8">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap rounded-2xl px-6 py-3.5 text-xs font-[900] uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-primary text-white shadow-xl shadow-sky-500/30 ring-4 ring-sky-500/10' : 'bg-white text-slate-400 hover:text-slate-600 shadow-sm border border-slate-100'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Scriptures" ? (
        <div className="space-y-6">
          <div className="flex flex-col gap-4">
            {volumes.map((v: any) => (
              <div key={v.id} className="glass-card rounded-[2.5rem] overflow-hidden">
                <button onClick={() => handleSelectVolume(v)} className="w-full flex items-center justify-between p-7 hover:bg-white/50 transition-all text-left">
                  <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 shadow-inner"><BookOpen size={24} /></div>
                    <div><h4 className="text-lg font-[900] text-slate-900 tracking-tight">{v.title}</h4><p className="text-[10px] font-[900] uppercase tracking-widest text-slate-400 mt-1">{v.id.replace('_', ' ')}</p></div>
                  </div>
                  {selectedVolume?.id === v.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>
                {selectedVolume?.id === v.id && v.books && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-slate-50/50 p-7 pt-0 grid grid-cols-2 gap-3">
                    {v.books.map((b: any) => (
                      <button key={b.id} onClick={() => handleSelectBook(b)} className={`rounded-2xl p-4 text-xs font-bold text-center transition-all ${selectedBook?.id === b.id ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-600 hover:border-primary/20 border border-slate-100'}`}>{b.title}</button>
                    ))}
                  </motion.div>
                )}
                {selectedVolume?.id === v.id && selectedBook && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-7 pt-0 border-t border-slate-100/50">
                    <div className="mb-4 text-[10px] font-[900] uppercase tracking-widest text-slate-400">{selectedBook.title} Chapters</div>
                    <div className="grid grid-cols-5 gap-2">
                      {Array.from({ length: selectedBook.chapters }).map((_, i) => (
                        <button key={i + 1} onClick={() => handleSelectChapter(v.id, selectedBook.id, i + 1)} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-[900] transition-all ${selectedChapter === i + 1 ? 'bg-secondary text-white shadow-lg' : 'bg-white text-slate-400 hover:text-primary border border-slate-100'}`}>{i + 1}</button>
                      ))}
                    </div>
                  </motion.div>
                )}
                {selectedVolume?.id === v.id && chapterContent && chapterContent.verses && selectedChapter && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-7 bg-white/80 backdrop-blur-xl border-t border-slate-100">
                    <div className="prose prose-slate max-w-none">
                      {chapterContent.verses.map((verse: any) => (
                        <div key={verse.verse} className="mb-4 flex gap-4">
                          <span className="text-[10px] font-[900] text-primary mt-1.5">{verse.verse}</span>
                          <p className="text-[15px] leading-relaxed text-slate-700 font-medium">{verse.text}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors"><Search size={18} strokeWidth={2.5} /></div>
            <input type="text" placeholder={`Search ${activeTab}...`} className="w-full rounded-[2rem] bg-white p-5 pl-14 text-sm font-bold text-slate-900 shadow-sm border border-slate-100 ring-4 ring-transparent focus:ring-primary/5 outline-none transition-all placeholder:text-slate-300" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          {activeTab === "General Conference" && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-8 px-8 mb-6">
              {["All", "April 2024", "October 2023", "April 2023"].map(conf => (
                <button key={conf} onClick={() => setSelectedConference(conf)} className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-[900] uppercase tracking-widest transition-all ${selectedConference === conf ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-100'}`}>{conf}</button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-5">
            {filteredLibrary.map((item, i) => (
              <motion.div key={item.id || item.$id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => item.url && window.open(item.url, '_blank')} className="group glass-card relative overflow-hidden rounded-[2.5rem] p-7 transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-sky-500/10 cursor-pointer">
                <div className="absolute top-0 right-0 h-32 w-32 translate-x-12 translate-y-[-12px] rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  {activeTab === "General Conference" ? <BookOpen size={20} strokeWidth={2} /> : (activeTab === "Hymns" || activeTab === "Children's Songbook" || activeTab === "New Hymns" || activeTab === "Youth Music") ? <RefreshCw size={20} strokeWidth={2} /> : activeTab === "Gospel Principles" ? <Tag size={20} strokeWidth={2} /> : <BookOpen size={20} strokeWidth={2} />}
                </div>
                <div className="mt-4">
                  <div className="mb-2 text-[9px] font-[900] uppercase tracking-widest text-primary/40">
                    {activeTab === "General Conference" ? (
                      item.conference || "General Conference"
                    ) : activeTab === "Hymns" ? (
                      item.number ? `Hymn #${item.number}` : "Hymn"
                    ) : activeTab === "Children's Songbook" ? (
                      item.number ? `Song #${item.number}` : "Children's Songbook"
                    ) : activeTab === "New Hymns" ? (
                      item.number ? `New Hymn #${item.number}` : "Hymns for Home & Church"
                    ) : activeTab === "Youth Music" ? (
                      "Youth Music"
                    ) : activeTab === "Gospel Principles" ? (
                      "Gospel Principle"
                    ) : (
                      "Come Follow Me 2026"
                    )}
                  </div>
                  <h5 className={`font-[900] text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors ${i % 3 === 0 ? 'text-xl' : 'text-[14px]'}`}>{item.title}</h5>
                  {item.speaker && (
                    <div className="mt-3 flex items-center gap-2"><div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center"><UserIcon size={10} strokeWidth={3} className="text-slate-400" /></div><p className="text-[10px] font-[900] uppercase tracking-widest text-slate-400">{item.speaker}</p></div>
                  )}
                  {!item.speaker && item.description && (
                    <p className="mt-2 text-[10px] text-slate-400 font-medium line-clamp-2">{item.description}</p>
                  )}
                </div>
                {item.url && (
                  <div className="absolute top-7 right-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <LinkIcon size={14} className="text-primary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
