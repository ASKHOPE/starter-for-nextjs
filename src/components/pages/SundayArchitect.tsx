import { motion } from "framer-motion";
import { Church, Music, Users, Book, Save, Plus, Clock, MapPin, Sparkles, Loader2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { actions } from "astro:actions";

export function SundayArchitect() {
  const [activeTab, setActiveTab] = useState("sacrament");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [agenda, setAgenda] = useState({
    id: "",
    title: "Sunday Sacrament Service",
    date: new Date().toISOString().split('T')[0],
    type: "sacrament" as const,
    status: "draft" as const,
    data: {
      leadership: { presiding: "", conducting: "", organist: "", chorister: "" },
      program: { openingHymn: "", sacramentHymn: "", closingHymn: "", items: [] as any[] },
      classes: [
        { name: "Adult Gospel Doctrine", teacher: "", topic: "" },
        { name: "Youth Sunday School", teacher: "", topic: "" }
      ]
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      loadAgenda(id);
    }
  }, []);

  async function loadAgenda(id: string) {
    setLoading(true);
    const { data } = await actions.getAgendas();
    if (data?.success) {
      const found = data.agendas.find((a: any) => a.$id === id);
      if (found) {
        setAgenda({
          id: found.$id,
          title: found.title,
          date: found.date,
          type: found.type,
          status: found.status,
          data: found.data
        });
      }
    }
    setLoading(false);
  }

  const [hymnSuggestions, setHymnSuggestions] = useState<any[]>([]);
  const [activeSearchField, setActiveSearchField] = useState<string | null>(null);

  const searchHymns = async (query: string, field: string) => {
    setActiveSearchField(field);
    if (query.length < 2) {
      setHymnSuggestions([]);
      return;
    }
    const { data } = await actions.getLibraryItems({ collection: 'hymns', search: query });
    if (data?.success) {
      setHymnSuggestions(data.items);
    }
  };

  const selectHymn = (hymn: any, section: string, field: string) => {
    const value = `${hymn.number ? `#${hymn.number} ` : ""}${hymn.title}`;
    updateData(section, field, value);
    setHymnSuggestions([]);
    setActiveSearchField(null);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await actions.saveAgenda(agenda);
    if (data?.success) {
      alert("Agenda saved successfully!");
      if (!agenda.id) {
        window.history.replaceState({}, "", `/plan/sunday?id=${data.agenda.$id}`);
        setAgenda(prev => ({ ...prev, id: data.agenda.$id }));
      }
    } else {
      alert("Failed to save agenda: " + (error?.message || "Unknown error"));
    }
    setSaving(false);
  };

  const updateData = (section: string, field: string, value: string) => {
    setAgenda(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [section]: {
          ...(prev.data as any)[section],
          [field]: value
        }
      }
    }));
  };

  const updateClass = (index: number, field: string, value: string) => {
    setAgenda(prev => {
      const newClasses = [...prev.data.classes];
      newClasses[index] = { ...newClasses[index], [field]: value };
      return {
        ...prev,
        data: { ...prev.data, classes: newClasses }
      };
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-on-surface-variant font-bold">Loading Agenda Architect...</p>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
            <Sparkles className="h-3 w-3" />
            Agenda Architect
          </div>
          <h1 className="text-4xl font-black text-primary tracking-tight">
            <input 
              type="text" 
              value={agenda.title} 
              onChange={(e) => setAgenda(prev => ({ ...prev, title: e.target.value }))}
              className="bg-transparent border-none outline-none focus:ring-0 w-full"
            />
          </h1>
          <p className="text-on-surface-variant font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <input 
              type="date" 
              value={agenda.date} 
              onChange={(e) => setAgenda(prev => ({ ...prev, date: e.target.value }))}
              className="bg-transparent border-none outline-none focus:ring-0 text-sm font-bold"
            />
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => window.open(`/preview/agenda?id=${agenda.id}`, '_blank')}
            className="flex-1 md:flex-none bg-surface-container-low border border-outline-variant/30 px-6 py-3 rounded-2xl font-bold text-primary hover:bg-surface-variant transition-all"
          >
            Preview
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex-1 md:flex-none bg-secondary text-on-secondary px-8 py-3 rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            {saving ? "Saving..." : "Save Program"}
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
        <div className="lg:col-span-8 space-y-8">
          {activeTab === "sacrament" ? (
            <SacramentFlow 
              agenda={agenda} 
              updateData={updateData} 
              searchHymns={searchHymns}
              hymnSuggestions={hymnSuggestions}
              activeSearchField={activeSearchField}
              selectHymn={selectHymn}
            />
          ) : (
            <SecondHourFlow agenda={agenda} updateClass={updateClass} />
          )}
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

function SacramentFlow({ agenda, updateData, searchHymns, hymnSuggestions, activeSearchField, selectHymn }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <Section title="Leadership & Music" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput label="Presiding" placeholder="Bishop Smith" value={agenda.data.leadership.presiding} onChange={(val: string) => updateData('leadership', 'presiding', val)} />
          <ModernInput label="Conducting" placeholder="Brother Jones" value={agenda.data.leadership.conducting} onChange={(val: string) => updateData('leadership', 'conducting', val)} />
          <ModernInput label="Organist" placeholder="Sister Miller" value={agenda.data.leadership.organist} onChange={(val: string) => updateData('leadership', 'organist', val)} />
          <ModernInput label="Chorister" placeholder="Brother Wilson" value={agenda.data.leadership.chorister} onChange={(val: string) => updateData('leadership', 'chorister', val)} />
        </div>
      </Section>

      <Section title="Sacred Program" icon={Music}>
        <div className="space-y-6">
          <div className="relative">
            <ModernInput label="Opening Hymn" placeholder="Search Hymn..." icon={Sparkles} value={agenda.data.program.openingHymn} onChange={(val: string) => { updateData('program', 'openingHymn', val); searchHymns(val, 'openingHymn'); }} />
            {activeSearchField === 'openingHymn' && hymnSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
                {hymnSuggestions.map((h: any) => (
                  <button key={h.$id} onClick={() => selectHymn(h, 'program', 'openingHymn')} className="w-full px-6 py-4 text-left hover:bg-secondary/10 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between">
                    <span>{h.title}</span>
                    <span className="text-secondary font-black">#{h.number}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <ModernInput label="Sacrament Hymn" placeholder="Search Hymn..." value={agenda.data.program.sacramentHymn} onChange={(val: string) => { updateData('program', 'sacramentHymn', val); searchHymns(val, 'sacramentHymn'); }} />
            {activeSearchField === 'sacramentHymn' && hymnSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
                {hymnSuggestions.map((h: any) => (
                  <button key={h.$id} onClick={() => selectHymn(h, 'program', 'sacramentHymn')} className="w-full px-6 py-4 text-left hover:bg-secondary/10 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between">
                    <span>{h.title}</span>
                    <span className="text-secondary font-black">#{h.number}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-secondary/5 p-6 rounded-3xl border border-secondary/20 border-dashed">
            <button className="flex items-center gap-2 text-secondary font-bold w-full justify-center">
              <Plus className="h-5 w-5" />
              Add Program Item (Talk, Musical Number)
            </button>
          </div>

          <div className="relative">
            <ModernInput label="Closing Hymn" placeholder="Search Hymn..." value={agenda.data.program.closingHymn} onChange={(val: string) => { updateData('program', 'closingHymn', val); searchHymns(val, 'closingHymn'); }} />
            {activeSearchField === 'closingHymn' && hymnSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
                {hymnSuggestions.map((h: any) => (
                  <button key={h.$id} onClick={() => selectHymn(h, 'program', 'closingHymn')} className="w-full px-6 py-4 text-left hover:bg-secondary/10 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between">
                    <span>{h.title}</span>
                    <span className="text-secondary font-black">#{h.number}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    </motion.div>
  );
}

function SecondHourFlow({ agenda, updateClass }: any) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <Section title="Class Coordination" icon={Book}>
        <div className="space-y-6">
          {agenda.data.classes.map((cls: any, i: number) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-outline-variant/10">
                <div className="bg-amber-100 p-2 rounded-xl text-amber-600"><Sparkles className="h-4 w-4" /></div>
                <h4 className="font-bold text-primary">{cls.name}</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModernInput label="Teacher" placeholder="Instructor Name" value={cls.teacher} onChange={(val: string) => updateClass(i, 'teacher', val)} />
                <ModernInput label="Topic" placeholder="Lesson Topic" value={cls.topic} onChange={(val: string) => updateClass(i, 'topic', val)} />
              </div>
            </div>
          ))}
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

function ModernInput({ label, placeholder, icon: Icon, value, onChange }: any) {
  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-surface border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-primary placeholder:text-on-surface-variant/50"
        />
        {Icon && <Icon className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary opacity-50 group-focus-within:opacity-100 transition-opacity" />}
      </div>
    </div>
  );
}
