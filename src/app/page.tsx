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
  Filter
} from "lucide-react";

type Step = "login" | "otp" | "dashboard";
type Timeframe = "1month" | "6months" | "1year";

// Custom Cubic Bezier from High-End Visual Design skill
const fluidBezier = [0.32, 0.72, 0, 1];
const modalOverlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};
const modalContentVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 }
};

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
  
  // Auth State
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("dashboard");
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // App Data
  const [timeframe, setTimeframe] = useState<Timeframe>("1month");
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [talks, setTalks] = useState<Talk[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [showAddAgenda, setShowAddAgenda] = useState(false);
  const [showAddTalk, setShowAddTalk] = useState(false);

  // Init Auth
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

  // Fetch Data when in dashboard
  useEffect(() => {
    if (user && step === "dashboard") {
      fetchDashboardData(user.$id);
    }
  }, [user, step, timeframe]);

  async function fetchDashboardData(uid: string) {
    const generateAgenda = (count: number, label: string) => {
      return Array.from({ length: count }).map((_, i) => ({
        $id: `a-${label}-${i}`,
        title: `${label} Meeting ${i + 1}`,
        description: "Focusing on spiritual growth and community service.",
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
        { $id: 't1', title: 'The Miracle of Forgiveness', speaker: 'Spencer W. Kimball' } as Talk,
        { $id: 't2', title: 'Be Not Afraid, Only Believe', speaker: 'Jeffrey R. Holland' } as Talk,
        { $id: 't3', title: 'The Windows of Heaven', speaker: 'David A. Bednar' } as Talk,
        { $id: 't4', title: 'Stand in Holy Places', speaker: 'Thomas S. Monson' } as Talk,
        { $id: 't5', title: 'The Weight of Glory', speaker: 'C.S. Lewis' } as Talk,
      ]);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  // Memoized filtered and grouped data
  const filteredTalks = useMemo(() => {
    return talks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.speaker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [talks, searchQuery]);

  const groupedAgenda = useMemo(() => {
    const groups: { [key: string]: AgendaItem[] } = {};
    agenda.forEach(item => {
      const month = new Date(item.scheduledDate).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!groups[month]) groups[month] = [];
      groups[month].push(item);
    });
    return Object.entries(groups);
  }, [agenda]);

  // --- Auth Handlers ---
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const result = await auth.sendOtp(phoneNumber);
      setUserId(result.userId);
      setStep("otp");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setAuthLoading(false);
    }
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
    } catch (err: any) {
      alert("Invalid Code: " + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  if (loading) return (
    <div className="flex h-[100dvh] items-center justify-center bg-white">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="h-12 w-12 rounded-2xl bg-sky-100"
      />
    </div>
  );

  return (
    <div className="mx-auto min-h-[100dvh] max-w-md bg-[#f8fafc] pwa-hide-scrollbar overflow-x-hidden selection:bg-sky-100 font-['Plus_Jakarta_Sans']">
      
      <AnimatePresence mode="wait">
        {/* --- LOGIN STEP --- */}
        {step === "login" && (
          <motion.div 
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: fluidBezier }}
            className="flex h-[100dvh] flex-col items-center justify-center px-10 text-center"
          >
            <div className="mb-10 group cursor-default">
              <div className="h-24 w-24 rounded-[2.5rem] bg-white shadow-[0_20px_50px_rgba(14,165,233,0.1)] border border-sky-50 flex items-center justify-center p-5 transition-transform group-hover:scale-105 duration-500">
                <Image src="/icon.png" alt="Logo" width={64} height={64} className="opacity-90" />
              </div>
            </div>
            
            <h1 className="mb-3 text-4xl font-[800] tracking-tight text-slate-900">
              Gospel<span className="text-primary">.</span>
            </h1>
            <p className="mb-12 text-slate-400 text-[15px] font-medium leading-relaxed px-4">
              A sacred space for your spiritual schedule and inspired talks.
            </p>
            
            <form onSubmit={handleSendOtp} className="w-full space-y-5">
              <div className="group relative">
                <input 
                  type="tel" 
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-3xl border-none bg-white p-5 text-center text-[17px] font-bold shadow-[0_10px_30px_rgba(0,0,0,0.02)] outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 transition-all"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={authLoading}
                className="premium-button group relative w-full rounded-3xl py-5 font-bold text-white transition-all disabled:opacity-50 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {authLoading ? "Synchronizing..." : "Continue with Phone"}
                  <ArrowRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </form>
          </motion.div>
        )}

        {/* --- OTP STEP --- */}
        {step === "otp" && (
          <motion.div 
            key="otp"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: fluidBezier }}
            className="flex h-[100dvh] flex-col items-center justify-center px-10 text-center"
          >
            <h2 className="mb-2 text-3xl font-[800] text-slate-900">Security Code</h2>
            <p className="mb-12 text-slate-400 text-sm">Verify the code sent to {phoneNumber}</p>
            
            <form onSubmit={handleVerifyOtp} className="w-full space-y-6">
              <input 
                type="text" 
                placeholder="000 000"
                className="w-full rounded-3xl border-none bg-white p-6 text-center text-3xl font-[800] tracking-[0.3em] shadow-[0_10px_30px_rgba(0,0,0,0.02)] outline-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 transition-all"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
              <button 
                type="submit" 
                disabled={authLoading}
                className="premium-button w-full rounded-3xl py-5 font-bold text-white transition-all disabled:opacity-50"
              >
                {authLoading ? "Validating..." : "Join Dashboard"}
              </button>
              <button 
                type="button" 
                onClick={() => setStep("login")}
                className="text-sm font-bold text-slate-400 hover:text-primary transition-colors"
              >
                Re-enter phone number
              </button>
            </form>
          </motion.div>
        )}

        {/* --- DASHBOARD --- */}
        {step === "dashboard" && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="pb-32"
          >
            {/* Header: High-End Floating Pill */}
            <header className="sticky top-6 z-30 mx-6">
              <div className="glass-card flex items-center justify-between rounded-[2rem] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center p-2">
                    <Image src="/icon.png" alt="L" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="text-sm font-[800] text-slate-900 leading-none">Gospel</h3>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary mt-1">Inspired</p>
                  </div>
                </div>
                <button 
                  onClick={() => auth.logout().then(() => setStep("login"))}
                  className="rounded-full bg-slate-50 p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                >
                  <LogOut size={18} strokeWidth={2} />
                </button>
              </div>
            </header>

            <main className="mt-12 px-7">
              {/* Massive Hero Typography */}
              <div className="mb-12">
                <span className="mb-4 inline-block rounded-full bg-sky-100 px-4 py-1.5 text-[10px] font-[800] uppercase tracking-[0.2em] text-primary">
                  {timeframe === '1month' ? 'Upcoming Month' : timeframe === '6months' ? 'Half Year Vision' : 'Annual Plan'}
                </span>
                <h1 className="text-4xl font-[800] tracking-tight text-slate-900 leading-[1.1]">
                  Your Spiritual <br /> <span className="text-primary/40">Itinerary.</span>
                </h1>
              </div>

              {/* Timeframe Selector: High-End Group */}
              <div className="mb-10 flex gap-2 rounded-[2rem] bg-slate-100/50 p-1.5">
                {[
                  { id: "1month" as Timeframe, label: "1M" },
                  { id: "6months" as Timeframe, label: "6M" },
                  { id: "1year" as Timeframe, label: "1Y" }
                ].map((tf) => (
                  <button
                    key={tf.id}
                    onClick={() => setTimeframe(tf.id)}
                    className={`flex-1 rounded-[1.5rem] py-3 text-[11px] font-[800] uppercase tracking-widest transition-all ${timeframe === tf.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Agenda Section */}
              <section className="mb-16">
                <div className="mb-8 flex items-center justify-between">
                  <h4 className="text-xs font-[900] uppercase tracking-[0.3em] text-slate-400/60">The Agenda</h4>
                  <div className="h-[1px] flex-1 bg-slate-100/60 mx-4" />
                  <button onClick={() => setShowAddAgenda(true)} className="flex items-center gap-1.5 text-[10px] font-[900] uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">
                    <Plus size={14} strokeWidth={3} /> Add
                  </button>
                </div>
                
                <div className="space-y-12">
                  {groupedAgenda.map(([month, items], groupIdx) => (
                    <div key={month} className="space-y-6">
                      <h5 className="text-[11px] font-[900] uppercase tracking-[0.2em] text-slate-300 pl-2">{month}</h5>
                      <div className="space-y-5">
                        {items.map((item, i) => (
                          <motion.div 
                            key={item.$id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: fluidBezier }}
                            className="group relative"
                          >
                            <div className="rounded-[2.4rem] bg-slate-100/40 p-1.5 transition-all hover:bg-sky-100/30">
                              <div className="flex items-center gap-6 rounded-[calc(2.4rem-0.375rem)] bg-white p-6 shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-transform group-hover:translate-x-1 duration-500">
                                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-[1.6rem] bg-slate-50 text-primary group-hover:bg-white group-hover:shadow-lg group-hover:shadow-sky-500/10 transition-all duration-500">
                                  <span className="text-[10px] font-[900] uppercase tracking-tighter text-slate-400">{new Date(item.scheduledDate).toLocaleString('default', { month: 'short' })}</span>
                                  <span className="text-2xl font-[900] tracking-tighter">{new Date(item.scheduledDate).getDate()}</span>
                                </div>
                                <div className="flex-1">
                                  <h5 className="text-[15px] font-[800] text-slate-900 tracking-tight mb-1">{item.title}</h5>
                                  <div className="flex items-center gap-4 text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                      <Calendar size={12} strokeWidth={2.5} className="text-primary/40" />
                                      <span className="text-[10px] font-[800] uppercase tracking-widest">{new Date(item.scheduledDate).toLocaleDateString(undefined, { weekday: 'long' })}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <Clock size={12} strokeWidth={2.5} className="text-primary/40" />
                                      <span className="text-[10px] font-[800] uppercase tracking-widest">10:00 AM</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Talks Library Section */}
              <section className="mb-20">
                <div className="mb-8 flex items-center justify-between">
                  <h4 className="text-xs font-[900] uppercase tracking-[0.3em] text-slate-400/60">Inspired Library</h4>
                  <div className="h-[1px] flex-1 bg-slate-100/60 mx-4" />
                </div>

                {/* Search Bar: Floating Micro-UI */}
                <div className="mb-8 relative group">
                  <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-300 group-focus-within:text-primary transition-colors">
                    <Search size={18} strokeWidth={2.5} />
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search talks or speakers..."
                    className="w-full rounded-[1.8rem] bg-white p-5 pl-14 text-[13px] font-bold text-slate-900 shadow-[0_10px_30px_rgba(0,0,0,0.02)] border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-6 flex items-center">
                    <Filter size={16} strokeWidth={2.5} className="text-slate-200" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  {filteredTalks.map((talk, i) => (
                    <motion.div 
                      key={talk.$id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: (i % 2) * 0.1, duration: 0.5 }}
                      className={`group relative flex flex-col justify-between rounded-[2.4rem] bg-white p-7 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-2xl hover:shadow-sky-500/5 transition-all duration-500 cursor-pointer ${i % 3 === 0 ? 'col-span-2 aspect-[16/8]' : 'col-span-1 aspect-square'}`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-[1.6rem] bg-slate-50 text-primary transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                        <BookOpen size={24} strokeWidth={1.5} />
                      </div>
                      <div className="mt-6">
                        <h5 className={`font-[900] text-slate-900 leading-tight tracking-tight group-hover:text-primary transition-colors ${i % 3 === 0 ? 'text-2xl' : 'text-[15px]'}`}>{talk.title}</h5>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                            <UserIcon size={10} strokeWidth={3} className="text-slate-400" />
                          </div>
                          <p className="text-[10px] font-[900] uppercase tracking-widest text-slate-400">{talk.speaker}</p>
                        </div>
                      </div>
                      
                      {/* Decorative elements for high-end feel */}
                      <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight size={20} className="text-primary/20" />
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Add Talk Card */}
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddTalk(true)}
                    className="col-span-1 aspect-square rounded-[2.4rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-slate-300 hover:border-primary/30 hover:text-primary/40 hover:bg-sky-50/30 transition-all cursor-pointer group"
                  >
                    <div className="h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
                      <Plus size={32} strokeWidth={1} />
                    </div>
                    <span className="mt-4 text-[9px] font-[900] uppercase tracking-[0.3em]">New Entry</span>
                  </motion.div>
                </div>
              </section>
            </main>

            {/* Navigation Island: Sticky Bottom */}
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-4rem)] max-w-[360px]">
              <div className="flex items-center justify-between rounded-full bg-slate-900/95 backdrop-blur-2xl p-2.5 px-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/5">
                 <button className="p-4 text-white hover:text-sky-400 transition-all active:scale-90">
                    <HomeIcon size={20} strokeWidth={1.5} />
                 </button>
                 <div className="h-8 w-[1px] bg-white/10" />
                 <button className="group relative h-16 w-16 -mt-2 -mb-2 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-sky-500/40 active:scale-90 transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Plus size={32} strokeWidth={2.5} className="relative z-10 group-hover:rotate-90 transition-transform duration-500" />
                 </button>
                 <div className="h-8 w-[1px] bg-white/10" />
                 <button className="p-4 text-white/40 hover:text-sky-400 transition-all active:scale-90">
                    <Search size={20} strokeWidth={1.5} />
                 </button>
              </div>
            </nav>

            {/* Modals Implementation */}
            <AnimatePresence>
              {(showAddAgenda || showAddTalk) && (
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={modalOverlayVariants}
                  className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4 pb-12"
                  onClick={() => { setShowAddAgenda(false); setShowAddTalk(false); }}
                >
                  <motion.div 
                    variants={modalContentVariants}
                    transition={{ duration: 0.5, ease: fluidBezier }}
                    className="w-full max-w-sm rounded-[3rem] bg-white p-8 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="mb-8 flex items-center justify-between">
                      <h3 className="text-xl font-[900] text-slate-900 tracking-tight">
                        {showAddAgenda ? "Schedule Meeting" : "Add Inspired Talk"}
                      </h3>
                      <button 
                        onClick={() => { setShowAddAgenda(false); setShowAddTalk(false); }}
                        className="rounded-full bg-slate-100 p-2 text-slate-400 hover:bg-slate-200 transition-colors"
                      >
                        <X size={18} strokeWidth={2.5} />
                      </button>
                    </div>

                    <form className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">Title</label>
                        <input 
                          type="text" 
                          placeholder={showAddAgenda ? "Stake Conference..." : "The Power of One..."}
                          className="w-full rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-900 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">
                          {showAddAgenda ? "Date" : "Speaker"}
                        </label>
                        <input 
                          type={showAddAgenda ? "date" : "text"}
                          placeholder={showAddTalk ? "Elder Holland..." : ""}
                          className="w-full rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-900 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>

                      <button 
                        type="button"
                        className="premium-button w-full rounded-[2rem] py-5 font-bold text-white shadow-xl shadow-sky-500/20 active:scale-[0.98] transition-all mt-4"
                      >
                        Complete Entry
                      </button>
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
