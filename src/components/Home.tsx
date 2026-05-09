"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Home as HomeIcon
} from 'lucide-react';
import { auth } from '@/lib/auth';
import { scriptures } from '@/lib/scriptures';
import { getDatabase, type GospelDatabase } from '@/lib/offline-db';
import type { Models } from 'appwrite';

import type { 
  IConferenceTalk, 
  IMusic, 
  IGospelPrinciple, 
  IComeFollowMe, 
  ISundayAgenda,
  LibTab,
  IVolume,
  IBook,
  IChapter
} from '@/types/gospel';

import { AuthSection } from '@/components/Auth/AuthSection';
import { LibraryBrowser } from '@/components/Dashboard/LibraryBrowser';
import { AgendaManager } from '@/components/Dashboard/AgendaManager';
import { GlobalSearchOverlay } from '@/components/Dashboard/GlobalSearchOverlay';
import { SundayAgendaSheet } from '@/components/Dashboard/SundayAgendaSheet';

type Step = "login" | "otp" | "dashboard";
type Timeframe = "1month" | "6months" | "1year";
type AgendaView = "general" | "sunday";

interface AgendaItem {
  id: string;
  $id?: string;
  title: string;
  description?: string;
  scheduledDate: string;
  timeframe: Timeframe;
  createdBy: string;
}

function getWeekOfMonth(date: Date): number {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayOfWeek = firstDayOfMonth.getDay();
  const offsetDate = date.getDate() + firstDayOfWeek - 1;
  return Math.floor(offsetDate / 7) + 1;
}

export default function Home() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [step, setStep] = useState<Step>("dashboard");
  const [timeframe, setTimeframe] = useState<Timeframe>("1month");
  const [agendaView, setAgendaView] = useState<AgendaView>("general");

  // Library States
  const [activeTab, setActiveTab] = useState<LibTab>("General Conference");
  const [general_conference_talks, setGeneralConferenceTalks] = useState<IConferenceTalk[]>([]);
  const [hymns, setHymns] = useState<IMusic[]>([]);
  const [childrens_songbook, setChildrensSongbook] = useState<IMusic[]>([]);
  const [new_hymns, setNewHymns] = useState<IMusic[]>([]);
  const [youth_music, setYouthMusic] = useState<IMusic[]>([]);
  const [gospel_principles, setGospelPrinciples] = useState<IGospelPrinciple[]>([]);
  const [come_follow_me, setComeFollowMe] = useState<IComeFollowMe[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [sundayAgendas, setSundayAgendas] = useState<ISundayAgenda[]>([]);

  // Scripture States
  const [volumes, setVolumes] = useState<IVolume[]>([]);
  const [selectedVolume, setSelectedVolume] = useState<IVolume | null>(null);
  const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapterContent, setChapterContent] = useState<IChapter | null>(null);

  // Auth States
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [agendaSearchQuery, setAgendaSearchQuery] = useState("");
  const [selectedConference, setSelectedConference] = useState<string>("All");

  const [showAddAgenda, setShowAddAgenda] = useState(false);
  const [showAddSunday, setShowAddSunday] = useState(false);
  const [expandedAgendaId, setExpandedAgendaId] = useState<string | null>(null);

  // Global Search State
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // RxDB instance
  const [rxdb, setRxdb] = useState<GospelDatabase | null>(null);

  useEffect(() => {
    // Initial Dev User for simulation
    setUser({
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

    const initDB = async () => {
      const db = await getDatabase();
      setRxdb(db);

      db.general_conference_talks.find().$.subscribe((docs: any[]) => setGeneralConferenceTalks(docs.map(d => d.toJSON())));
      db.sundayAgendas.find().$.subscribe((docs: any[]) => setSundayAgendas(docs.map(d => d.toJSON())));
      db.hymns.find().$.subscribe((docs: any[]) => setHymns(docs.map(d => d.toJSON())));
      db.childrens_songbook.find().$.subscribe((docs: any[]) => setChildrensSongbook(docs.map(d => d.toJSON())));
      db.new_hymns.find().$.subscribe((docs: any[]) => setNewHymns(docs.map(d => d.toJSON())));
      db.youth_music.find().$.subscribe((docs: any[]) => setYouthMusic(docs.map(d => d.toJSON())));
      db.gospel_principles.find().$.subscribe((docs: any[]) => setGospelPrinciples(docs.map(d => d.toJSON())));
      db.come_follow_me.find().$.subscribe((docs: any[]) => setComeFollowMe(docs.map(d => d.toJSON())));
    };
    initDB();

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
    if (user && step === "dashboard") {
      fetchDashboardData(user.$id);
    }
  }, [user, step, timeframe]);

  useEffect(() => {
    if (activeTab === "Scriptures" && volumes.length === 0) {
      fetchScriptureVolumes();
    }
  }, [activeTab]);

  async function fetchScriptureVolumes() {
    setIsSyncing(true);
    try {
      const v = await scriptures.getVolumes();
      setVolumes(v as any);
    } catch (err) { console.error(err); } finally { setIsSyncing(false); }
  }

  async function handleSelectVolume(v: any) {
    setIsSyncing(true);
    setSelectedVolume(v);
    setSelectedBook(null);
    setSelectedChapter(null);
    try {
      const books = await scriptures.getBooks(v.id);
      setSelectedVolume({ ...v, books });
    } catch (err) { console.error(err); } finally { setIsSyncing(false); }
  }

  async function handleSelectBook(b: any) {
    setSelectedBook(b);
    setSelectedChapter(null);
  }

  async function handleSelectChapter(vId: string, bId: string, ch: number) {
    setIsSyncing(true);
    setSelectedChapter(ch);
    try {
      const content = await scriptures.getChapter(vId, bId, ch);
      setChapterContent(content as any);
    } catch (err) { console.error(err); } finally { setIsSyncing(false); }
  }

  async function fetchDashboardData(uid: string) {
    setIsSyncing(true);
    setTimeout(async () => {
      const generateAgenda = (count: number, label: string) => {
        return Array.from({ length: count }).map((_, i) => ({
          id: `a-${label}-${i}`,
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
      } catch (err) { console.error(err); } finally { setIsSyncing(false); }
    }, 800);
  }

  async function handleSyncLibrary() {
    if (!rxdb) return;
    setIsSyncing(true);
    try {
      const res = await fetch('/api/sync-library');
      const result = await res.json();
      if (result.type === 'success') {
        const { syncToRxDB } = await import('@/lib/offline-db');
        await syncToRxDB(result.data);
        alert("Sacred Library Mirrored Reactively Offline!");
      } else { alert(result.error); }
    } catch (err) { alert("Failed to reach sync service."); } finally { setIsSyncing(false); }
  }

  async function generateSundayAgendas() {
    if (!rxdb) return;
    setIsSyncing(true);
    const Sundays: any[] = [];
    const now = new Date();
    const end = new Date();
    if (timeframe === '1month') end.setMonth(now.getMonth() + 1);
    else if (timeframe === '6months') end.setMonth(now.getMonth() + 6);
    else end.setFullYear(now.getFullYear() + 1);

    let current = new Date(now);
    while (current <= end) {
      if (current.getDay() === 0) {
        const week = getWeekOfMonth(current);
        const meetingType = (week === 1 || week === 3) ? 'SundaySchool' : (week === 2 || week === 4) ? 'PriesthoodRS' : 'Combined';

        Sundays.push({
          id: `sunday-${current.getTime()}`,
          date: current.toISOString(),
          weekOfMonth: week,
          eventType: 'Standard',
          title: "Sabbath Services",
          sacrament: {
            conducting: "Bishopric",
            organist: "TBD",
            chorister: "TBD",
            hymns: { opening: "TBD", sacrament: "TBD", intermediate: "TBD", closing: "TBD" },
            prayers: { opening: "TBD", closing: "TBD" },
            business: "TBD",
            talks: [
              { speaker: "TBD", type: 'Adult', topicReference: "" },
              { speaker: "TBD", type: 'Adult', talkReference: "" },
              { speaker: "Bishopric Member", type: 'Concluding', customTopic: "Ward Focus" }
            ]
          },
          secondHour: {
            meetingType: meetingType,
            teacher: "TBD",
            topicReference: "",
            hymns: { opening: "TBD" },
            prayers: { opening: "TBD", closing: "TBD" },
            announcements: "TBD"
          },
          syncedAt: Date.now()
        });
      }
      current.setDate(current.getDate() + 1);
    }

    try {
      await Promise.all(Sundays.map(s => rxdb.sundayAgendas.upsert(s)));
      alert(`Generated ${Sundays.length} Sabbath itineraries for your ${timeframe} vision.`);
    } catch (err) { console.error(err); } finally { setIsSyncing(false); }
  }

  // Sabbath Form State
  const [sundayForm, setSundayForm] = useState({
    date: "",
    eventType: "Standard" as any,
    title: "",
    conducting: "",
    organist: "",
    sacramentOpeningHymn: "",
    sacramentOpeningPrayer: "",
    sacramentBusiness: "",
    sacramentHymn: "",
    sacramentIntermediateHymn: "",
    sacramentClosingHymn: "",
    sacramentClosingPrayer: "",
    talk1Speaker: "", talk1Ref: "",
    talk2Speaker: "", talk2Ref: "",
    talk3Speaker: "", talk3Ref: "",
    secondHourOpeningHymn: "",
    secondHourOpeningPrayer: "",
    secondHourAnnouncements: "",
    secondHourTeacher: "",
    secondHourRef: "",
    secondHourClosingPrayer: "",
  });

  const hymnOptions = useMemo(() => hymns.map(h => `${h.number ? '#' + h.number + ' ' : ''}${h.title}`), [hymns]);
  const talkOptions = useMemo(() => general_conference_talks.map(t => `${t.title} (${t.speaker})`), [general_conference_talks]);
  const gospelPrincipleOptions = useMemo(() => gospel_principles.map(p => p.title), [gospel_principles]);

  const handleSaveSunday = async () => {
    if (!rxdb) return;
    setIsSyncing(true);
    try {
      const id = `sunday-manual-${new Date(sundayForm.date).getTime()}`;
      const payload: ISundayAgenda = {
        id,
        date: sundayForm.date,
        weekOfMonth: getWeekOfMonth(new Date(sundayForm.date)),
        eventType: sundayForm.eventType,
        title: sundayForm.title || "Sabbath Services",
        sacrament: {
          conducting: sundayForm.conducting,
          organist: sundayForm.organist,
          hymns: {
            opening: sundayForm.sacramentOpeningHymn,
            sacrament: sundayForm.sacramentHymn,
            intermediate: sundayForm.sacramentIntermediateHymn,
            closing: sundayForm.sacramentClosingHymn
          },
          prayers: {
            opening: sundayForm.sacramentOpeningPrayer,
            closing: sundayForm.sacramentClosingPrayer
          },
          business: sundayForm.sacramentBusiness,
          talks: [
            { speaker: sundayForm.talk1Speaker, type: 'Adult', topicReference: sundayForm.talk1Ref },
            { speaker: sundayForm.talk2Speaker, type: 'Adult', talkReference: sundayForm.talk2Ref },
            { speaker: sundayForm.talk3Speaker, type: 'Concluding', customTopic: sundayForm.talk3Ref }
          ]
        },
        secondHour: {
          meetingType: getWeekOfMonth(new Date(sundayForm.date)) % 2 === 0 ? 'PriesthoodRS' : 'SundaySchool',
          teacher: sundayForm.secondHourTeacher,
          topicReference: sundayForm.secondHourRef,
          hymns: { opening: sundayForm.secondHourOpeningHymn },
          prayers: {
            opening: sundayForm.secondHourOpeningPrayer,
            closing: sundayForm.secondHourClosingPrayer
          },
          announcements: sundayForm.secondHourAnnouncements
        },
        syncedAt: Date.now()
      };
      await rxdb.sundayAgendas.upsert(payload);
      setShowAddSunday(false);
    } catch (err) { console.error(err); } finally { setIsSyncing(false); }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await auth.sendOtp(email);
      setStep("otp");
    } catch (err) { alert("Failed to send OTP."); } finally { setIsSyncing(false); }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSyncing(true);
    try {
      await auth.verifyOtp(email, otp);
      const userDoc = await auth.getCurrentUser();
      setUser(userDoc);
      setStep("dashboard");
    } catch (err) { alert("Invalid code."); } finally { setIsSyncing(false); }
  };

  const handleLogout = async () => {
    await auth.logout();
    setUser(null);
    setStep("login");
  };

  const filteredLibrary = useMemo(() => {
    if (activeTab === "General Conference") {
      return general_conference_talks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || (t.speaker || "").toLowerCase().includes(searchQuery.toLowerCase());
        const matchesConf = selectedConference === "All" || t.conference === selectedConference;
        return matchesSearch && matchesConf;
      });
    } else if (activeTab === "Hymns") {
      return hymns.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()) || (h.number || "").includes(searchQuery));
    } else if (activeTab === "Children's Songbook") {
      return childrens_songbook.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()) || (h.number || "").includes(searchQuery));
    } else if (activeTab === "New Hymns") {
      return new_hymns.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()) || (h.number || "").includes(searchQuery));
    } else if (activeTab === "Youth Music") {
      return youth_music.filter(h => h.title.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (activeTab === "Gospel Principles") {
      return gospel_principles.filter(top => top.title.toLowerCase().includes(searchQuery.toLowerCase()));
    } else if (activeTab === "Come Follow Me") {
      return come_follow_me.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    } else {
      return [];
    }
  }, [activeTab, general_conference_talks, hymns, childrens_songbook, new_hymns, youth_music, gospel_principles, come_follow_me, searchQuery, selectedConference]);

  const globalResults = useMemo(() => {
    if (!globalSearchQuery || globalSearchQuery.length < 2) return [];
    const q = globalSearchQuery.toLowerCase();
    
    const results = [
      ...general_conference_talks.map(t => ({ ...t, type: 'General Conference' as const })),
      ...hymns.map(h => ({ ...h, type: 'Hymns' as const })),
      ...childrens_songbook.map(h => ({ ...h, type: "Children's Songbook" as const })),
      ...new_hymns.map(h => ({ ...h, type: 'New Hymns' as const })),
      ...youth_music.map(h => ({ ...h, type: 'Youth Music' as const })),
      ...gospel_principles.map(top => ({ ...top, type: 'Gospel Principles' as const })),
      ...come_follow_me.map(m => ({ ...m, type: 'Come Follow Me' as const })),
    ];

    return results.filter(r => 
      r.title.toLowerCase().includes(q) || 
      ('speaker' in r && r.speaker?.toLowerCase().includes(q)) ||
      ('number' in r && r.number?.includes(q))
    ).slice(0, 50);
  }, [globalSearchQuery, general_conference_talks, hymns, childrens_songbook, new_hymns, youth_music, gospel_principles, come_follow_me]);

  const filteredAgenda = useMemo(() => {
    const items = agendaView === 'general' ? agenda : sundayAgendas;
    return items.filter((a: any) => (a.title || 'Sunday Meeting').toLowerCase().includes(agendaSearchQuery.toLowerCase()));
  }, [agendaView, agenda, sundayAgendas, agendaSearchQuery]);

  if (step !== "dashboard") {
    return (
      <AuthSection 
        step={step} email={email} setEmail={setEmail} otp={otp} setOtp={setOtp}
        isSyncing={isSyncing} isOnline={isOnline} handleSendOTP={handleSendOTP}
        handleVerifyOTP={handleVerifyOTP} handleLogout={handleLogout} user={user}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-outfit">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-md bg-white shadow-2xl min-h-screen relative overflow-hidden">
        
        <AuthSection 
          step={step} email={email} setEmail={setEmail} otp={otp} setOtp={setOtp}
          isSyncing={isSyncing} isOnline={isOnline} handleSendOTP={handleSendOTP}
          handleVerifyOTP={handleVerifyOTP} handleLogout={handleLogout} user={user}
        />

        <main className="relative z-10">
          <AgendaManager 
            timeframe={timeframe} setTimeframe={setTimeframe} agendaView={agendaView}
            setAgendaView={setAgendaView} agendaSearchQuery={agendaSearchQuery}
            setAgendaSearchQuery={setAgendaSearchQuery} filteredAgenda={filteredAgenda}
            expandedAgendaId={expandedAgendaId} setExpandedAgendaId={setExpandedAgendaId}
            isSyncing={isSyncing} generateSundayAgendas={generateSundayAgendas}
          />

          <LibraryBrowser 
            activeTab={activeTab} setActiveTab={setActiveTab} searchQuery={searchQuery}
            setSearchQuery={setSearchQuery} selectedConference={selectedConference}
            setSelectedConference={setSelectedConference} filteredLibrary={filteredLibrary}
            volumes={volumes} selectedVolume={selectedVolume} handleSelectVolume={handleSelectVolume}
            selectedBook={selectedBook} handleSelectBook={handleSelectBook}
            selectedChapter={selectedChapter} handleSelectChapter={handleSelectChapter}
            chapterContent={chapterContent as any} isSyncing={isSyncing} handleSyncLibrary={handleSyncLibrary}
          />
        </main>

        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-4rem)] max-w-[360px]">
          <div className="flex items-center justify-between rounded-full bg-slate-900/95 backdrop-blur-2xl p-2.5 px-8 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/5">
            <button className="p-4 text-white hover:text-sky-400 transition-all active:scale-90"><HomeIcon size={20} /></button>
            <div className="h-8 w-[1px] bg-white/10" />
            <button onClick={() => agendaView === "general" ? setShowAddAgenda(true) : setShowAddSunday(true)} className="group relative h-16 w-16 -mt-2 -mb-2 rounded-full bg-primary flex items-center justify-center text-white shadow-2xl shadow-sky-500/40 active:scale-90 transition-all overflow-hidden"><div className="absolute inset-0 bg-gradient-to-tr from-sky-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" /><Plus size={32} strokeWidth={2.5} className="relative z-10 group-hover:rotate-90 transition-all duration-500" /></button>
            <div className="h-8 w-[1px] bg-white/10" />
            <button onClick={() => setShowGlobalSearch(true)} className="p-4 text-white/40 hover:text-sky-400 transition-all active:scale-90"><Search size={20} /></button>
          </div>
        </nav>

        <SundayAgendaSheet 
          show={showAddAgenda || showAddSunday} 
          onClose={() => { setShowAddAgenda(false); setShowAddSunday(false); }}
          showAddAgenda={showAddAgenda}
          showAddSunday={showAddSunday}
          sundayForm={sundayForm}
          setSundayForm={setSundayForm}
          hymnOptions={hymnOptions}
          talkOptions={talkOptions}
          gospelPrincipleOptions={gospelPrincipleOptions}
          handleSaveSunday={handleSaveSunday}
          getWeekOfMonth={getWeekOfMonth}
        />

        <GlobalSearchOverlay 
          show={showGlobalSearch}
          onClose={() => setShowGlobalSearch(false)}
          query={globalSearchQuery}
          setQuery={setGlobalSearchQuery}
          results={globalResults}
        />

      </motion.div>
    </div>
  );
}
