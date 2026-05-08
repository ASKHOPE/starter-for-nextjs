"use client";

import "./app.css";
import React, { useState, useEffect, useMemo } from "react";
import { auth } from "@/lib/auth";
import { db, Talk, AgendaItem } from "@/lib/db";
import Image from "next/image";
import { Models } from "appwrite";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  LogOut, 
  Calendar, 
  BookOpen, 
  Plus, 
  Search, 
  Home as HomeIcon,
  X,
  Clock,
  User as UserIcon,
  Filter,
  ChevronDown,
  ChevronUp,
  Tag,
  Link as LinkIcon,
  Wifi,
  WifiOff,
  CloudCheck
} from "lucide-react";

type Step = "login" | "otp" | "dashboard";
type Timeframe = "1month" | "6months" | "1year";
type Category = "All" | "Sacrament" | "Stake" | "Personal" | "Study";

const fluidBezier = [0.32, 0.72, 0, 1];
const modalOverlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const modalContentVariants = { hidden: { opacity: 0, scale: 0.9, y: 20 }, visible: { opacity: 1, scale: 1, y: 0 } };

export default function Home() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>({
    $id: "dev_user",
    name: "Faithful User",
    registration: new Date().toISOString(),
    status: true,
    passwordUpdate: "",
    email: "dev@gospel.app",
    phone: "+1234567890",
    emailVerification: true,
    phoneVerification: true,
    prefs: {},
    accessedAt: new Date().toISOString(),
    $createdAt: new Date().toISOString(),
    $updatedAt: new Date().toISOString(),
  } as Models.User<Models.Preferences>);
  
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("dashboard");
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const [timeframe, setTimeframe] = useState<Timeframe>("1month");
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [talks, setTalks] = useState<(Talk & { category?: string })[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [agendaSearchQuery, setAgendaSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  
  const [showAddAgenda, setShowAddAgenda] = useState(false);
  const [showAddTalk, setShowAddTalk] = useState(false);
  const [expandedAgendaId, setExpandedAgendaId] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    async function checkUser() {
      const currentUser = await auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setStep("dashboard");
      }
      setLoading(false);
    }
    checkUser();
  }, []);

  useEffect(() => {
    if (user && step === "dashboard") {
      fetchDashboardData(user.$id);
    }
  }, [user, step, timeframe]);

  async function fetchDashboardData(uid: string) {
    setIsSyncing(true);
    // Simulate sync delay for visual feedback
    setTimeout(async () => {
      const generateAgenda = (count: number, label: string) => {
        return Array.from({ length: count }).map((_, i) => ({
          $id: `a-${label}-${i}`,
          title: `${label} Meeting ${i + 1}`,
          description: "Focusing on spiritual growth and community service. Discussing how to better support local families.",
          scheduledDate: new Date(Date.now() + (i + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
          timeframe: timeframe,
          createdBy: uid
        } as AgendaItem));
      };

      try {
        let agendaItems: AgendaItem[] = [];
        if (timeframe === '1month') agendaItems = generateAgenda(4, "Monthly");
        else if (timeframe === '6months') agendaItems = generateAgenda(12, "Semi-Annual");
        else agendaItems = generateAgenda(24, "Annual");

        setAgenda(agendaItems);
        
        setTalks([
          { $id: 't1', title: 'The Miracle of Forgiveness', speaker: 'Spencer W. Kimball', category: 'Study' } as any,
          { $id: 't2', title: 'Be Not Afraid, Only Believe', speaker: 'Jeffrey R. Holland', category: 'Sacrament' } as any,
          { $id: 't3', title: 'The Windows of Heaven', speaker: 'David A. Bednar', category: 'Stake' } as any,
          { $id: 't4', title: 'Stand in Holy Places', speaker: 'Thomas S. Monson', category: 'Personal' } as any,
          { $id: 't5', title: 'The Weight of Glory', speaker: 'C.S. Lewis', category: 'Study' } as any,
        ]);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsSyncing(false);
      }
    }, 800);
  }

  const filteredTalks = useMemo(() => {
    return talks.filter(t => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.speaker.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [talks, searchQuery, activeCategory]);

  const filteredAgenda = useMemo(() => {
    return agenda.filter(a => 
      a.title.toLowerCase().includes(agendaSearchQuery.toLowerCase()) || 
      a.description?.toLowerCase().includes(agendaSearchQuery.toLowerCase())
    );
  }, [agenda, agendaSearchQuery]);

  const groupedAgenda = useMemo(() => {
    const groups: { [key: string]: AgendaItem[] } = {};
    filteredAgenda.forEach(item => {
      const month = new Date(item.scheduledDate).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[month]) groups[month] = [];
      groups[month].push(item);
    });
    return Object.entries(groups);
  }, [filteredAgenda]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const result = await auth.sendOtp(phoneNumber);
      setUserId(result.userId);
      setStep("otp");
    } catch (err: any) { alert(err.message); } finally { setAuthLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    setAuthLoading(true);
    try {
      await auth.verifyOtp(userId, otp);
      const currentUser = await auth.getCurrentUser();
      setUser(currentUser);
      setStep("dashboard");
    } catch (err: any) { alert(err.message); } finally { setAuthLoading(false); }
  };

  if (loading) return (
    <div className="flex h-[100dvh] items-center justify-center bg-white font-['Plus_Jakarta_Sans']">
      <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="h-12 w-12 rounded-2xl bg-sky-100" />
    </div>
  );

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-[#f8fafc] pwa-hide-scrollbar overflow-x-hidden selection:bg-sky-100 font-['Plus_Jakarta_Sans']">
      
      {/* Offline/Sync Indicator */}
      <AnimatePresence>
        {(!isOnline || isSyncing) && (
          <motion.div initial={{ y: -100 }} animate={{ y: 0 }} exit={{ y: -100 }} className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-center py-3 px-6 shadow-lg ${isOnline ? 'bg-sky-500 text-white' : 'bg-rose-500 text-white'}`}>
             <div className="flex items-center gap-3 text-[11px] font-[900] uppercase tracking-widest">
                {isOnline ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}><CloudCheck size={16} /></motion.div>
                    <span>Syncing Sacred Data...</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={16} />
                    <span>Viewing Offline Content</span>
                  </>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {step === "login" && (
          <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.8, ease: fluidBezier }} className="flex h-[100dvh] flex-col items-center justify-center px-10 text-center">
            <div className="mb-10 group"><div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(14,165,233,0.1)] border border-sky-50 flex items-center justify-center p-5 transition-transform group-hover:scale-105 duration-500"><Image src="/icon.png" alt="L" width={64} height={64} /></div></div>
            <h1 className="mb-3 text-4xl font-[800] tracking-tight text-slate-900">Gospel<span className="text-primary">.</span></h1>
            <p className="mb-12 text-slate-400 text-[15px] font-medium leading-relaxed px-4">A sacred space for your spiritual schedule and inspired talks.</p>
            <form onSubmit={handleSendOtp} className="w-full space-y-5">
              <input type="tel" placeholder="+1 (555) 000-0000" className="w-full rounded-3xl border-none bg-white p-5 text-center text-[17px] font-bold shadow-[0_10px_30px_rgba(0,0,0,0.02)] outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 transition-all" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
              <button type="submit" disabled={authLoading} className="premium-button w-full rounded-3xl py-5 font-bold text-white transition-all disabled:opacity-50">Continue with Phone</button>
            </form>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div key="otp" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.6, ease: fluidBezier }} className="flex h-[100dvh] flex-col items-center justify-center px-10 text-center">
            <h2 className="mb-2 text-3xl font-[800] text-slate-900">Security Code</h2>
            <p className="mb-12 text-slate-400 text-sm">Verify the code sent to {phoneNumber}</p>
            <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
              <input type="text" placeholder="000 000" className="w-full rounded-3xl border-none bg-white p-6 text-center text-3xl font-[800] tracking-[0.3em] shadow-[0_10px_30px_rgba(0,0,0,0.02)] outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 transition-all" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
              <button type="submit" disabled={authLoading} className="premium-button w-full rounded-3xl py-5 font-bold text-white transition-all">Join Dashboard</button>
              <button type="button" onClick={() => setStep("login")} className="text-sm font-bold text-slate-400">Re-enter phone number</button>
            </form>
          </motion.div>
        )}

        {step === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="pb-32">
            <header className="sticky top-6 z-30 mx-6">
              <div className="glass-card flex items-center justify-between rounded-[2rem] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2"><Image src="/icon.png" alt="L" width={24} height={24} /></div>
                  <div><h3 className="text-sm font-[800] text-slate-900 leading-none">Gospel</h3><p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Inspired</p></div>
                </div>
                <button onClick={() => auth.logout().then(() => setStep("login"))} className="rounded-full bg-slate-50 p-2.5 text-slate-400"><LogOut size={18} /></button>
              </div>
            </header>

            <main className="mt-12 px-7">
              <div className="mb-12">
                <span className="mb-4 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-[10px] font-[800] uppercase tracking-[0.2em] text-primary">{timeframe === '1month' ? 'Upcoming Month' : timeframe === '6months' ? 'Half Year Vision' : 'Annual Plan'}</span>
                <h1 className="text-4xl font-[800] tracking-tight text-slate-900 leading-[1.1]">Your Spiritual <br /> <span className="text-primary/40">Itinerary.</span></h1>
              </div>

              <div className="mb-10 flex gap-2 rounded-[2rem] bg-slate-100/50 p-1.5">
                {["1month", "6months", "1year"].map((tf) => (
                  <button key={tf} onClick={() => setTimeframe(tf as Timeframe)} className={`flex-1 rounded-[1.5rem] py-3 text-[11px] font-[800] uppercase tracking-widest transition-all ${timeframe === tf ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"}`}>{tf.replace('month', 'M').replace('year', 'Y')}</button>
                ))}
              </div>

              {/* Agenda Section */}
              <section className="mb-16">
                <div className="mb-8 flex items-center justify-between">
                  <h4 className="text-xs font-[900] uppercase tracking-[0.3em] text-slate-400/60">The Agenda</h4>
                  <div className="h-[1px] flex-1 bg-slate-100/60 mx-4" />
                  <button onClick={() => setShowAddAgenda(true)} className="flex items-center gap-1.5 text-[10px] font-[900] uppercase tracking-widest text-primary"><Plus size={14} strokeWidth={3} /> Add</button>
                </div>

                <div className="mb-8 relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors"><Search size={16} strokeWidth={2.5} /></div>
                  <input type="text" placeholder="Search meeting titles..." className="w-full rounded-[1.5rem] bg-white p-4 pl-12 text-[12px] font-bold text-slate-900 shadow-[0_5px_20px_rgba(0,0,0,0.02)] ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/10 outline-none transition-all" value={agendaSearchQuery} onChange={(e) => setAgendaSearchQuery(e.target.value)} />
                </div>
                
                <div className="space-y-12">
                  {groupedAgenda.map(([month, items]) => (
                    <div key={month} className="space-y-6">
                      <h5 className="text-[11px] font-[900] uppercase tracking-[0.2em] text-slate-300 pl-2">{month}</h5>
                      <div className="space-y-5">
                        {items.map((item, i) => (
                          <motion.div key={item.$id} layout initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group relative">
                            <div className="rounded-[2.4rem] bg-slate-100/40 p-1.5 transition-all">
                              <div 
                                className={`rounded-[calc(2.4rem-0.375rem)] bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all cursor-pointer ${expandedAgendaId === item.$id ? 'ring-2 ring-primary/10 shadow-lg' : ''}`}
                                onClick={() => setExpandedAgendaId(expandedAgendaId === item.$id ? null : item.$id)}
                              >
                                <div className="flex items-center gap-6">
                                  <div className="flex h-16 w-16 flex-col items-center justify-center rounded-[1.6rem] bg-slate-50 text-primary transition-all duration-500">
                                    <span className="text-[10px] font-[900] uppercase tracking-tighter text-slate-400">{new Date(item.scheduledDate).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-[900] tracking-tighter">{new Date(item.scheduledDate).getDate()}</span>
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-[15px] font-[800] text-slate-900 tracking-tight mb-1">{item.title}</h5>
                                    <div className="flex items-center gap-4 text-slate-400 text-[10px] font-[800] uppercase tracking-widest">
                                      <div className="flex items-center gap-1.5"><Calendar size={12} className="text-primary/40" /> {new Date(item.scheduledDate).toLocaleDateString(undefined, { weekday: 'long' })}</div>
                                      <div className="flex items-center gap-1.5"><Clock size={12} className="text-primary/40" /> 10:00 AM</div>
                                    </div>
                                  </div>
                                  <div className="text-slate-200">
                                    {expandedAgendaId === item.$id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                  </div>
                                </div>
                                <AnimatePresence>
                                  {expandedAgendaId === item.$id && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                      <div className="mt-6 pt-6 border-t border-slate-50 space-y-4">
                                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{item.description}</p>
                                        <div className="flex gap-2">
                                          <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-[10px] font-[800] uppercase tracking-widest text-slate-400 border border-slate-100"><Tag size={12} className="text-primary/40" /> Preparation</div>
                                          <div className="flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-[10px] font-[800] uppercase tracking-widest text-primary/60 border border-sky-100"><LinkIcon size={12} /> View Talk</div>
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Talks Section */}
              <section className="mb-20">
                <div className="mb-8 flex items-center justify-between">
                  <h4 className="text-xs font-[900] uppercase tracking-[0.3em] text-slate-400/60">Inspired Library</h4>
                  <div className="h-[1px] flex-1 bg-slate-100/60 mx-4" />
                </div>
                <div className="mb-8 relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors"><Search size={18} strokeWidth={2.5} /></div>
                  <input type="text" placeholder="Search talks or speakers..." className="w-full rounded-[1.8rem] bg-white p-5 pl-14 text-[13px] font-bold text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.02)] ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
                <div className="mb-8 flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                  {["All", "Sacrament", "Stake", "Personal", "Study"].map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat as Category)} className={`whitespace-nowrap rounded-full px-6 py-3 text-[10px] font-[900] uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "bg-white text-slate-400 border border-slate-100"}`}>{cat}</button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {filteredTalks.map((talk, i) => (
                    <motion.div key={talk.$id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: (i % 2) * 0.1 }} className={`group relative flex flex-col justify-between rounded-[2.4rem] bg-white p-7 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-2xl transition-all duration-500 cursor-pointer ${i % 3 === 0 ? 'col-span-2 aspect-[16/8]' : 'col-span-1 aspect-square'}`}>
                      <div className="flex h-14 w-14 items-center justify-center rounded-[1.6rem] bg-slate-50 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white shadow-inner"><BookOpen size={24} strokeWidth={1.5} /></div>
                      <div className="mt-6">
                        <div className="mb-2 text-[9px] font-[900] uppercase tracking-widest text-primary/40">{talk.category || 'Sacrament'}</div>
                        <h5 className={`font-[900] text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors ${i % 3 === 0 ? 'text-2xl' : 'text-[15px]'}`}>{talk.title}</h5>
                        <div className="mt-3 flex items-center gap-2"><div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center"><UserIcon size={10} strokeWidth={3} className="text-slate-400" /></div><p className="text-[10px] font-[900] uppercase tracking-widest text-slate-400">{talk.speaker}</p></div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </main>

            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-4rem)] max-w-[360px]">
              <div className="flex items-center justify-between rounded-full bg-slate-900/95 backdrop-blur-2xl p-2.5 px-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/5">
                 <button className="p-4 text-white hover:text-sky-400 transition-all active:scale-90"><HomeIcon size={20} /></button>
                 <div className="h-8 w-[1px] bg-white/10" />
                 <button onClick={() => setShowAddAgenda(true)} className="group relative h-16 w-16 -mt-2 -mb-2 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-sky-500/40 active:scale-90 transition-all overflow-hidden"><div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" /><Plus size={32} strokeWidth={2.5} className="relative z-10 group-hover:rotate-90 transition-all duration-500" /></button>
                 <div className="h-8 w-[1px] bg-white/10" />
                 <button className="p-4 text-white/40 hover:text-sky-400 transition-all active:scale-90"><Search size={20} /></button>
              </div>
            </nav>

            <AnimatePresence>
              {(showAddAgenda || showAddTalk) && (
                <motion.div initial="hidden" animate="visible" exit="hidden" variants={modalOverlayVariants} className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4 pb-12" onClick={() => { setShowAddAgenda(false); setShowAddTalk(false); }}>
                  <motion.div variants={modalContentVariants} transition={{ duration: 0.5, ease: fluidBezier }} className="w-full max-w-sm rounded-[3rem] bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                    <div className="mb-8 flex items-center justify-between">
                      <h3 className="text-xl font-[900] text-slate-900 tracking-tight">{showAddAgenda ? "Schedule Meeting" : "Add Inspired Talk"}</h3>
                      <button onClick={() => { setShowAddAgenda(false); setShowAddTalk(false); }} className="rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 transition-colors"><X size={18} strokeWidth={2.5} /></button>
                    </div>
                    <form className="space-y-6">
                      <div className="space-y-2"><label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Title</label><input type="text" placeholder={showAddAgenda ? "Stake Conference..." : "The Power of One..."} className="w-full rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-900 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">{showAddAgenda ? "Date" : "Speaker"}</label><input type={showAddAgenda ? "date" : "text"} placeholder={showAddTalk ? "Elder Holland..." : ""} className="w-full rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-900 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all" /></div>
                      <button type="button" className="premium-button w-full rounded-[2rem] py-5 font-bold text-white shadow-xl shadow-sky-500/20 active:scale-[0.98] transition-all mt-4">Complete Entry</button>
                    </form>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
