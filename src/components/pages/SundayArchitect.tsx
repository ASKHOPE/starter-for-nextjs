import { motion } from "framer-motion";
import { Music, Users, Book, Save, Plus, Clock, MapPin, Sparkles } from "lucide-react";
import { useState } from "react";

export function SundayArchitect() {
  const [activeTab, setActiveTab] = useState("sacrament");

  return (
    <div className="pb-32 space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Agenda Architect
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">Sunday Service</h1>
          <p className="text-on-surface-variant font-medium">Oak Hills 4th Ward • May 17, 2026</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 md:flex-none bg-surface-container-low border border-outline-variant/30 px-6 py-3 rounded-2xl font-bold text-primary hover:bg-surface-variant transition-all">
            Preview
          </button>
          <button className="flex-1 md:flex-none bg-secondary text-on-secondary px-8 py-3 rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
            <Save className="h-5 w-5" />
            Save Program
          </button>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="bg-surface-container-lowest p-1.5 rounded-[2rem] border border-outline-variant/20 shadow-sm flex max-w-md mx-auto md:mx-0">
        {[
          { id: "sacrament", label: "Sacrament", icon: ChurchIcon },
          { id: "second-hour", label: "2nd Hour", icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-1 items-center justify-center gap-2 py-4 rounded-[1.75rem] text-sm font-black transition-all ${
              activeTab === tab.id
                ? "bg-primary text-white shadow-lg"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {activeTab === "sacrament" ? <SacramentFlow /> : <SecondHourFlow />}
        </div>

        {/* Sticky Sidebar / Quick Info */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/20 space-y-6">
            <h3 className="font-bold text-primary flex items-center gap-2">
              <Clock className="h-4 w-4 text-secondary" />
              Service Timing
            </h3>
            <div className="space-y-4">
              <TimeItem label="Prelude" time="9:50 AM" />
              <TimeItem label="Start" time="10:00 AM" />
              <TimeItem label="End" time="11:00 AM" />
            </div>
            <hr className="border-outline-variant/20" />
            <div className="flex items-center gap-3 text-sm text-on-surface-variant">
              <MapPin className="h-4 w-4" />
              <span>Main Chapel • East Wing</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimeItem({ label, time }: any) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/10">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
      <span className="font-black text-primary">{time}</span>
    </div>
  );
}

function ChurchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2" /><path d="M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" /><path d="M18 22V5l-6-3-6 3v17" /><path d="M12 7v5" /><path d="M10 9h4" /></svg>
  );
}

function SacramentFlow() {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <Section title="Leadership & Music" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput label="Presiding" placeholder="Bishop Smith" />
          <ModernInput label="Conducting" placeholder="Brother Jones" />
          <ModernInput label="Organist" placeholder="Sister Miller" />
          <ModernInput label="Chorister" placeholder="Brother Wilson" />
        </div>
      </Section>

      <Section title="Sacred Program" icon={Music}>
        <div className="space-y-6">
          <ModernInput label="Opening Hymn" placeholder="Hymn # and Title" icon={Sparkles} />
          <ModernInput label="Sacrament Hymn" placeholder="Hymn # and Title" />
          <div className="bg-secondary/5 p-6 rounded-3xl border border-secondary/20 border-dashed">
            <button className="flex items-center gap-2 text-secondary font-bold w-full justify-center">
              <Plus className="h-5 w-5" />
              Add Program Item (Talk, Musical Number)
            </button>
          </div>
          <ModernInput label="Closing Hymn" placeholder="Hymn # and Title" />
        </div>
      </Section>
    </motion.div>
  );
}

function SecondHourFlow() {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <Section title="Class Coordination" icon={Book}>
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
              <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><Sparkles className="h-4 w-4" /></div>
              <h4 className="font-bold text-primary">Adult Gospel Doctrine</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernInput label="Teacher" placeholder="Sister Adams" />
              <ModernInput label="Topic" placeholder="Mosiah 1-3" />
            </div>
          </div>
        </div>
      </Section>
    </motion.div>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-xl shadow-slate-200/30">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary p-3 rounded-2xl text-white shadow-lg">
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-black text-primary tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ModernInput({ label, placeholder, icon: Icon }: any) {
  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full bg-surface border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-primary placeholder:text-on-surface-variant/50"
        />
        {Icon && <Icon className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary opacity-50 group-focus-within:opacity-100 transition-opacity" />}
      </div>
    </div>
  );
}
