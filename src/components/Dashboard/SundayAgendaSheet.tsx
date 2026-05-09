"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AutocompleteInput } from '@/components/AutocompleteInput';

interface SundayAgendaSheetProps {
  show: boolean;
  onClose: () => void;
  showAddAgenda: boolean;
  showAddSunday: boolean;
  sundayForm: any;
  setSundayForm: (f: any) => void;
  hymnOptions: any[];
  talkOptions: any[];
  gospelPrincipleOptions: any[];
  handleSaveSunday: () => void;
  getWeekOfMonth: (date: Date) => number;
}

const modalOverlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalContentVariants = { 
  hidden: { y: "100%", transition: { duration: 0.4, ease: [0.32, 0.72, 0, 1] } }, 
  visible: { y: 0, transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] } } 
} as any;

export const SundayAgendaSheet: React.FC<SundayAgendaSheetProps> = ({
  show,
  onClose,
  showAddAgenda,
  showAddSunday,
  sundayForm,
  setSundayForm,
  hymnOptions,
  talkOptions,
  gospelPrincipleOptions,
  handleSaveSunday,
  getWeekOfMonth
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          exit="hidden" 
          variants={modalOverlayVariants} 
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm" 
          onClick={onClose}
        >
          <motion.div 
            variants={modalContentVariants}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) {
                onClose();
              }
            }}
            className="w-full max-w-sm rounded-t-[3rem] bg-white p-8 pt-4 shadow-2xl max-h-[92vh] overflow-y-auto no-scrollbar relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-6">
              <div className="w-12 h-1.5 rounded-full bg-slate-200" />
            </div>
            <div className="mb-8 flex items-center justify-between">
              <h3 className="text-2xl font-[900] text-slate-900 tracking-tight">{showAddAgenda ? "Schedule Meeting" : "Sabbath Plan"}</h3>
              <button onClick={onClose} className="rounded-full bg-slate-100 p-2.5 text-slate-400 hover:bg-slate-200 transition-colors">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>
            <form className="space-y-6">
              {showAddAgenda ? (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Title</label>
                    <input type="text" placeholder="Stake Conference..." className="w-full rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-900 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Date</label>
                    <input type="date" className="w-full rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-900 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Event Type</label>
                    <select 
                      value={sundayForm.eventType} 
                      onChange={(e) => setSundayForm({ ...sundayForm, eventType: e.target.value })} 
                      className="w-full rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-900 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    >
                      <option value="Standard">Standard Sunday Block</option>
                      <option value="GeneralConference">General Conference</option>
                      <option value="StakeConference">Stake Conference</option>
                      <option value="WardConference">Ward Conference</option>
                      <option value="AsiaAreaDevotional">Asia Area Devotional</option>
                      <option value="SpecialDevotional">Special Devotional</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Sabbath Date</label>
                    <input 
                      type="date" 
                      value={sundayForm.date} 
                      onChange={(e) => setSundayForm({ ...sundayForm, date: e.target.value })} 
                      className="w-full rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-900 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all" 
                    />
                  </div>

                  {sundayForm.eventType === 'Standard' && (
                    <div className="space-y-6 mt-6 border-t border-slate-100 pt-6">
                      <h4 className="text-[11px] font-[900] uppercase tracking-[0.2em] text-slate-400">Sacrament Meeting</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Conducting</label>
                          <input type="text" placeholder="Bishop..." value={sundayForm.conducting} onChange={(e) => setSundayForm({ ...sundayForm, conducting: e.target.value })} className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Ward Business</label>
                          <input type="text" placeholder="None" value={sundayForm.sacramentBusiness} onChange={(e) => setSundayForm({ ...sundayForm, sacramentBusiness: e.target.value })} className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <AutocompleteInput label="Opening Hymn" placeholder="Hymn..." value={sundayForm.sacramentOpeningHymn} onChange={(v: string) => setSundayForm({ ...sundayForm, sacramentOpeningHymn: v })} options={hymnOptions} />
                        <div className="space-y-2">
                          <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Opening Prayer</label>
                          <input type="text" placeholder="Name..." value={sundayForm.sacramentOpeningPrayer} onChange={(e) => setSundayForm({ ...sundayForm, sacramentOpeningPrayer: e.target.value })} className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none" />
                        </div>
                      </div>

                      <AutocompleteInput label="Sacrament Hymn" placeholder="Hymn..." value={sundayForm.sacramentHymn} onChange={(v: string) => setSundayForm({ ...sundayForm, sacramentHymn: v })} options={hymnOptions} />

                      <div className="space-y-3 rounded-[2rem] bg-slate-50 p-6 border border-slate-100">
                        <span className="text-[10px] font-[900] uppercase tracking-widest text-primary mb-2 block">1. Gospel Principle</span>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Speaker..." value={sundayForm.talk1Speaker} onChange={(e) => setSundayForm({ ...sundayForm, talk1Speaker: e.target.value })} className="w-full rounded-xl bg-white p-4 text-xs font-bold text-slate-900 border border-slate-100 outline-none shadow-sm" />
                          <AutocompleteInput label="" placeholder="Topic Ref..." value={sundayForm.talk1Ref} onChange={(v: string) => setSundayForm({ ...sundayForm, talk1Ref: v })} options={gospelPrincipleOptions} />
                        </div>
                        <span className="text-[10px] font-[900] uppercase tracking-widest text-primary mb-2 mt-4 block">2. General Conference</span>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Speaker..." value={sundayForm.talk2Speaker} onChange={(e) => setSundayForm({ ...sundayForm, talk2Speaker: e.target.value })} className="w-full rounded-xl bg-white p-4 text-xs font-bold text-slate-900 border border-slate-100 outline-none shadow-sm" />
                          <AutocompleteInput label="" placeholder="Talk Ref..." value={sundayForm.talk2Ref} onChange={(v: string) => setSundayForm({ ...sundayForm, talk2Ref: v })} options={talkOptions} />
                        </div>
                        <div className="mt-4">
                          <AutocompleteInput label="Intermediate Hymn (Optional)" placeholder="Hymn..." value={sundayForm.sacramentIntermediateHymn} onChange={(v: string) => setSundayForm({ ...sundayForm, sacramentIntermediateHymn: v })} options={hymnOptions} />
                        </div>
                        <span className="text-[10px] font-[900] uppercase tracking-widest text-primary mb-2 mt-4 block">3. Bishopric Message</span>
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Speaker..." value={sundayForm.talk3Speaker} onChange={(e) => setSundayForm({ ...sundayForm, talk3Speaker: e.target.value })} className="w-full rounded-xl bg-white p-4 text-xs font-bold text-slate-900 border border-slate-100 outline-none shadow-sm" />
                          <input type="text" placeholder="Custom Topic..." value={sundayForm.talk3Ref} onChange={(e) => setSundayForm({ ...sundayForm, talk3Ref: e.target.value })} className="w-full rounded-xl bg-white p-4 text-xs font-bold text-slate-900 border border-slate-100 outline-none shadow-sm" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <AutocompleteInput label="Closing Hymn" placeholder="Hymn..." value={sundayForm.sacramentClosingHymn} onChange={(v: string) => setSundayForm({ ...sundayForm, sacramentClosingHymn: v })} options={hymnOptions} />
                        <div className="space-y-2">
                          <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Closing Prayer</label>
                          <input type="text" placeholder="Name..." value={sundayForm.sacramentClosingPrayer} onChange={(e) => setSundayForm({ ...sundayForm, sacramentClosingPrayer: e.target.value })} className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none" />
                        </div>
                      </div>

                      {sundayForm.date && (
                        <div className="space-y-4 pt-4 border-t border-slate-100">
                          <h4 className="text-[11px] font-[900] uppercase tracking-[0.2em] text-slate-400">
                            {(() => {
                              const w = getWeekOfMonth(new Date(sundayForm.date));
                              return (w === 1 || w === 3) ? 'Sunday School (Week ' + w + ')' : (w === 2 || w === 4) ? 'Priesthood / RS (Week ' + w + ')' : 'Combined Meeting (Week ' + w + ')';
                            })()}
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <AutocompleteInput label="Opening Hymn" placeholder="Opening Hymn..." value={sundayForm.secondHourOpeningHymn} onChange={(v: string) => setSundayForm({ ...sundayForm, secondHourOpeningHymn: v })} options={hymnOptions} />
                            <div className="space-y-2">
                              <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Opening Prayer</label>
                              <input type="text" placeholder="Opening Prayer..." value={sundayForm.secondHourOpeningPrayer} onChange={(e) => setSundayForm({ ...sundayForm, secondHourOpeningPrayer: e.target.value })} className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none" />
                            </div>
                          </div>
                          <input type="text" placeholder="Announcements..." value={sundayForm.secondHourAnnouncements} onChange={(e) => setSundayForm({ ...sundayForm, secondHourAnnouncements: e.target.value })} className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none" />
                          <div className="grid grid-cols-2 gap-3">
                            <input type="text" placeholder="Teacher..." value={sundayForm.secondHourTeacher} onChange={(e) => setSundayForm({ ...sundayForm, secondHourTeacher: e.target.value })} className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none" />
                            <AutocompleteInput label="" placeholder="Lesson/Talk Ref..." value={sundayForm.secondHourRef} onChange={(v: string) => setSundayForm({ ...sundayForm, secondHourRef: v })} options={gospelPrincipleOptions} />
                          </div>
                          <input type="text" placeholder="Closing Prayer..." value={sundayForm.secondHourClosingPrayer} onChange={(e) => setSundayForm({ ...sundayForm, secondHourClosingPrayer: e.target.value })} className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none" />
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
              <button 
                type="button" 
                onClick={showAddSunday ? handleSaveSunday : undefined} 
                className="premium-button w-full rounded-[2rem] py-5 font-bold text-white shadow-xl shadow-sky-500/20 active:scale-[0.98] transition-all mt-4"
              >
                Save Sacred Plan
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
