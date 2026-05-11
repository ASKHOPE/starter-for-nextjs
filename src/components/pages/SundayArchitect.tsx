import { motion } from "framer-motion";
import { Church, Music, Users, Book, Save, Clock, MapPin, Sparkles, Loader2, Calendar, X, MessageSquare, ChevronLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { actions } from "astro:actions";

const NEW_SCHEDULE_DATE = new Date("2026-09-06");

const isNewSchedule = (dateStr: string) => {
  return new Date(dateStr) >= NEW_SCHEDULE_DATE;
};

export function SundayArchitect() {
  const [activeTab, setActiveTab] = useState("sacrament");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [agenda, setAgenda] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const isNew = isNewSchedule(today);
    
    return {
      id: "",
      title: "Sunday Sacrament Service",
      date: today,
      type: "sacrament" as const,
      status: "draft" as const,
      data: {
        leadership: { presiding: "", conducting: "", organist: "", chorister: "", acknowledgeLeader: "" },
        program: { 
          announcements: "",
          blocks: [
            { id: 'openingHymn', type: 'hymn', label: 'Opening Hymn', value: '' },
            { id: 'invocation', type: 'prayer', label: 'Invocation', value: 'By Invitation' },
            { id: 'business', type: 'business', label: 'Ward Business', value: 'As Directed' },
            { id: 'sacramentHymn', type: 'hymn', label: 'Sacrament Hymn', value: '' },
            { id: 'sacrament', type: 'sacrament', label: 'Administration of the Sacrament', value: '' },
            { id: 'speaker1', type: 'speaker', label: '1st Speaker', value: '' },
            { id: 'speaker2', type: 'speaker', label: '2nd Speaker', value: '' },
            { id: 'speaker3', type: 'speaker', label: '3rd Speaker', value: '' },
            { id: 'closingHymn', type: 'hymn', label: 'Closing Hymn', value: '' },
            { id: 'benediction', type: 'prayer', label: 'Benediction', value: 'By Invitation' }
          ]
        },
        secondHour: {
          block1: [
            { name: "Adult Sunday School", teacher: "", topic: "" },
            { name: "Youth Sunday School", teacher: "", topic: "" }
          ],
          block2: [
            { name: "Relief Society", teacher: "", topic: "" },
            { name: "Elders Quorum", teacher: "", topic: "" },
            { name: "Aaronic Priesthood", teacher: "", topic: "" },
            { name: "Young Women", teacher: "", topic: "" }
          ],
          primary: { teacher: "Primary Presidency", topic: "Singing Time & Classes" },
          override: "auto" as "auto" | "legacy" | "new"
        },
        classes: [
          { name: "Relief Society / Elders Quorum", teacher: "", topic: "" },
          { name: "Sunday School", teacher: "", topic: "" }
        ],
        attendance: { beforeSacrament: "", afterSacrament: "" },
        timing: { start: "10:00 AM", end: "12:00 PM" }
      }
    };

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
        // Migration helper: Ensure both structures exist for cross-compatibility
        const migratedData = { ...found.data };
        
        // 1. If old 'classes' exists, ensure 'secondHour' is populated
        if (migratedData.classes && !migratedData.secondHour) {
          migratedData.secondHour = {
            block1: migratedData.classes.slice(0, 2),
            block2: [],
            primary: { teacher: "Primary Presidency", topic: "Singing Time & Classes" }
          };
        }

        // 2. If new 'secondHour' exists, ensure 'classes' is populated for legacy view support
        if (migratedData.secondHour && !migratedData.classes) {
          migratedData.classes = [
            ...(migratedData.secondHour.block1 || []),
            ...(migratedData.secondHour.block2 || [])
          ].slice(0, 4); // Limit for legacy view
          
          if (migratedData.classes.length === 0) {
            migratedData.classes = [
              { name: "Relief Society / Elders Quorum", teacher: "", topic: "" },
              { name: "Sunday School", teacher: "", topic: "" }
            ];
          }
        }

        // 0. Ensure 'blocks' exists
        if (!migratedData.program.blocks) {
          migratedData.program.blocks = [
            { id: 'openingHymn', type: 'hymn', label: 'Opening Hymn', value: migratedData.program.openingHymn || '' },
            { id: 'invocation', type: 'prayer', label: 'Invocation', value: 'By Invitation' },
            { id: 'business', type: 'business', label: 'Ward Business', value: 'As Directed' },
            { id: 'sacramentHymn', type: 'hymn', label: 'Sacrament Hymn', value: migratedData.program.sacramentHymn || '' },
            { id: 'sacrament', type: 'sacrament', label: 'Administration of the Sacrament', value: '' }
          ];
          
          if (migratedData.program.items && Array.isArray(migratedData.program.items)) {
             migratedData.program.items.forEach((item: any, i: number) => {
               migratedData.program.blocks.push({ id: `custom_${i}`, type: 'custom', label: item.type, value: item.label });
             });
          }

          if (migratedData.program.intermediateHymn) {
             migratedData.program.blocks.push({ id: 'intermediateHymn', type: 'hymn', label: 'Intermediate Hymn / Special Music', value: migratedData.program.intermediateHymn });
          }

          migratedData.program.blocks.push(
            { id: 'speaker1', type: 'speaker', label: '1st Speaker', value: migratedData.program.speaker1 || '' },
            { id: 'speaker2', type: 'speaker', label: '2nd Speaker', value: migratedData.program.speaker2 || '' },
            { id: 'speaker3', type: 'speaker', label: '3rd Speaker', value: migratedData.program.speaker3 || '' },
            { id: 'closingHymn', type: 'hymn', label: 'Closing Hymn', value: migratedData.program.closingHymn || '' },
            { id: 'benediction', type: 'prayer', label: 'Benediction', value: 'By Invitation' }
          );
        }

        // 3. Ensure 'attendance' exists
        if (!migratedData.attendance) {
          migratedData.attendance = { beforeSacrament: "", afterSacrament: "" };
        }

        // 4. Ensure 'timing' exists
        if (!migratedData.timing) {
          migratedData.timing = { start: "10:00 AM", end: "12:00 PM" };
        }

        setAgenda({

          id: found.$id,
          title: found.title,
          date: found.date,
          type: found.type,
          status: found.status,
          data: migratedData
        });
      }
    }
    setLoading(false);
  }

  const [hymnSuggestions, setHymnSuggestions] = useState<any[]>([]);
  const [activeSearchField, setActiveSearchField] = useState<string | null>(null);
  const [activeBook, setActiveBook] = useState('hymns');

  const updateClass = (block: string, index: number | null, field: string, value: string) => {
    setAgenda(prev => {
      const newData = { ...prev.data } as any;
      if (block === 'legacy') {
        newData.classes[index!] = { ...newData.classes[index!], [field]: value };
      } else if (block === 'config') {
        newData.secondHour[field] = value;
      } else if (index !== null) {
        newData.secondHour[block][index] = { 
          ...newData.secondHour[block][index], 
          [field]: value 
        };
      } else {
        newData.secondHour[block] = { 
          ...newData.secondHour[block], 
          [field]: value 
        };
      }
      return {
        ...prev,
        data: newData
      };
    });
  };

  const updateData = (section: string, field: string, value: string) => {
    setAgenda(prev => {
      const sectionData = (prev.data as any)[section] || {};
      return {
        ...prev,
        data: {
          ...prev.data,
          [section]: {
            ...sectionData,
            [field]: value
          }
        }
      };
    });
  };

  const searchHymns = async (query: string, field: string) => {
    setActiveSearchField(field);
    const { data } = await actions.getLibraryItems({ 
      collection: activeBook as any, 
      search: query 
    });
    if (data?.success) {
      setHymnSuggestions(data.items);
    }
  };

  const selectHymn = (hymn: any, section: string, field: string) => {
    const value = `${hymn.number ? `#${hymn.number} ` : ""}${hymn.title}`;
    if (section === 'block') {
      updateBlock(field, value);
    } else {
      updateData(section, field, value);
    }
    setHymnSuggestions([]);
    setActiveSearchField(null);
  };

  const updateBlock = (id: string, value: string) => {
    setAgenda(prev => ({
      ...prev,
      data: {
        ...prev.data,
        program: {
          ...prev.data.program,
          blocks: prev.data.program.blocks.map((b: any) => b.id === id ? { ...b, value } : b)
        }
      }
    }));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setAgenda(prev => {
      const newBlocks = [...prev.data.program.blocks];
      if (direction === 'up' && index > 0) {
        [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index + 1], newBlocks[index]] = [newBlocks[index], newBlocks[index + 1]];
      }
      return { ...prev, data: { ...prev.data, program: { ...prev.data.program, blocks: newBlocks } } };
    });
  };

  const removeBlock = (index: number) => {
    setAgenda(prev => ({
      ...prev,
      data: {
        ...prev.data,
        program: {
          ...prev.data.program,
          blocks: prev.data.program.blocks.filter((_: any, i: number) => i !== index)
        }
      }
    }));
  };

  const addBlock = (type: string, label: string) => {
    setAgenda(prev => ({
      ...prev,
      data: {
        ...prev.data,
        program: {
          ...prev.data.program,
          blocks: [
            ...prev.data.program.blocks,
            { id: Math.random().toString(36).substring(7), type, label, value: '' }
          ]
        }
      }
    }));
  };

  const applyTemplate = (templateName: string) => {
    let blocks: any[] = [];
    if (templateName === 'standard') {
      blocks = [
        { id: 'openingHymn', type: 'hymn', label: 'Opening Hymn', value: '' },
        { id: 'invocation', type: 'prayer', label: 'Invocation', value: 'By Invitation' },
        { id: 'business', type: 'business', label: 'Ward Business', value: 'As Directed' },
        { id: 'sacramentHymn', type: 'hymn', label: 'Sacrament Hymn', value: '' },
        { id: 'sacrament', type: 'sacrament', label: 'Administration of the Sacrament', value: '' },
        { id: 'speaker1', type: 'speaker', label: '1st Speaker', value: '' },
        { id: 'speaker2', type: 'speaker', label: '2nd Speaker', value: '' },
        { id: 'speaker3', type: 'speaker', label: '3rd Speaker', value: '' },
        { id: 'closingHymn', type: 'hymn', label: 'Closing Hymn', value: '' },
        { id: 'benediction', type: 'prayer', label: 'Benediction', value: 'By Invitation' }
      ];
    } else if (templateName === 'fast') {
      blocks = [
        { id: 'openingHymn', type: 'hymn', label: 'Opening Hymn', value: '' },
        { id: 'invocation', type: 'prayer', label: 'Invocation', value: 'By Invitation' },
        { id: 'business', type: 'business', label: 'Ward Business', value: 'As Directed' },
        { id: 'sacramentHymn', type: 'hymn', label: 'Sacrament Hymn', value: '' },
        { id: 'sacrament', type: 'sacrament', label: 'Administration of the Sacrament', value: '' },
        { id: 'testimony', type: 'custom', label: 'Bearing of Testimonies', value: 'Members of the Ward' },
        { id: 'closingHymn', type: 'hymn', label: 'Closing Hymn', value: '' },
        { id: 'benediction', type: 'prayer', label: 'Benediction', value: 'By Invitation' }
      ];
    }
    setAgenda(prev => ({
      ...prev,
      data: { ...prev.data, program: { ...prev.data.program, blocks } }
    }));
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-on-surface-variant font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <div className="pb-32 space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col items-center text-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-primary tracking-tight">
            <input 
              type="text" 
              value={agenda.title} 
              onChange={(e) => setAgenda(prev => ({ ...prev, title: e.target.value }))}
              className="bg-transparent border-none outline-none focus:ring-0 w-full text-center"
            />
          </h1>
          <p className="text-on-surface-variant font-medium flex items-center justify-center gap-2">
            <Calendar className="h-4 w-4" />
            <input 
              type="date" 
              value={agenda.date} 
              onChange={(e) => setAgenda(prev => ({ ...prev, date: e.target.value }))}
              className="bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-center"
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
              updateBlock={updateBlock}
              moveBlock={moveBlock}
              removeBlock={removeBlock}
              addBlock={addBlock}
              applyTemplate={applyTemplate}
              searchHymns={searchHymns} 
              hymnSuggestions={hymnSuggestions} 
              activeSearchField={activeSearchField} 
              selectHymn={selectHymn} 
              activeBook={activeBook} 
              setActiveBook={setActiveBook} 
              setActiveSearchField={setActiveSearchField} 
            />
          ) : (
            <SecondHourFlow agenda={agenda} updateClass={updateClass} />
          )}
        </div>

        {/* Sticky Sidebar / Quick Info */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          <div className="bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/20 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-primary uppercase tracking-widest text-xs">
                Service Timing
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-tighter">Live Preview</span>
              </div>
            </div>
            <div className="space-y-4">
              <TimeItem label="Start Service" time="10:00 AM" />
              
              {(agenda.data.secondHour?.override === 'new' || (agenda.data.secondHour?.override === 'auto' && isNewSchedule(agenda.date))) ? (
                <>
                  <div className="flex items-center gap-2 px-4 py-1 bg-secondary/5 border border-secondary/10 border-dashed rounded-xl">
                    <Clock className="h-3 w-3 text-secondary" />
                    <span className="text-[10px] font-black text-secondary uppercase tracking-widest">Transitions Included</span>
                  </div>
                </>
              ) : null}

              <TimeItem label="End Service" time="12:00 PM" />
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

function SacramentFlow({ agenda, updateData, searchHymns, hymnSuggestions, activeSearchField, selectHymn, activeBook, setActiveBook, setActiveSearchField, updateBlock, moveBlock, removeBlock, addBlock, applyTemplate }: any) {
  const [newCustomLabel, setNewCustomLabel] = useState("");

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      <div className="flex justify-between items-center bg-surface-container-low p-4 rounded-2xl border border-outline-variant/30">
        <div>
          <h3 className="font-black text-primary text-sm uppercase tracking-widest">Template Engine</h3>
          <p className="text-xs text-on-surface-variant">Switch program layout</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => applyTemplate('standard')} className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-primary border border-outline-variant/30 hover:bg-surface-variant">Standard</button>
          <button onClick={() => applyTemplate('fast')} className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-primary border border-outline-variant/30 hover:bg-surface-variant">Fast Sunday</button>
        </div>
      </div>

      <Section title="Leadership & Music" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput label="Presiding" placeholder="Bishop Smith" value={agenda.data.leadership.presiding} onChange={(val: string) => updateData('leadership', 'presiding', val)} />
          <ModernInput label="Conducting" placeholder="Brother Jones" value={agenda.data.leadership.conducting} onChange={(val: string) => updateData('leadership', 'conducting', val)} />
          <ModernInput label="Organist" placeholder="Sister Miller" value={agenda.data.leadership.organist} onChange={(val: string) => updateData('leadership', 'organist', val)} />
          <ModernInput label="Chorister" placeholder="Brother Wilson" value={agenda.data.leadership.chorister} onChange={(val: string) => updateData('leadership', 'chorister', val)} />
          <ModernInput label="Acknowledge Leader" placeholder="Visiting Authority (Optional)" value={agenda.data.leadership.acknowledgeLeader} onChange={(val: string) => updateData('leadership', 'acknowledgeLeader', val)} />
        </div>
      </Section>

      <Section title="Announcements" icon={MessageSquare}>
        <div className="space-y-4">
          <p className="text-xs text-on-surface-variant font-medium">Add important ward or branch announcements for the beginning of the service.</p>
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
              Weekly Announcements
            </label>
            <textarea
              value={agenda.data.program.announcements || ""}
              onChange={(e) => updateData('program', 'announcements', e.target.value)}
              placeholder="Enter announcements here..."
              className="w-full bg-surface border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-primary placeholder:text-on-surface-variant/50 min-h-[120px]"
            />
          </div>
        </div>
      </Section>

      <Section title="Sacred Program" icon={Music}>
        <div className="space-y-6">
          {agenda.data.program.blocks?.map((block: any, i: number) => (
            <div key={block.id} className="relative flex items-end gap-3 bg-white p-3 rounded-2xl border border-outline-variant/20 shadow-sm">
              <div className="flex-1">
                {block.type === 'hymn' ? (
                  <div className="relative">
                    <ModernInput 
                      label={block.label} 
                      placeholder="Search..." 
                      icon={Sparkles} 
                      value={block.value} 
                      onFocus={() => setActiveSearchField(block.id)}
                      onChange={(val: string) => { updateBlock(block.id, val); searchHymns(val, block.id); }} 
                    />
                    {activeSearchField === block.id && (
                      <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
                        <div className="flex items-center justify-between p-3 bg-primary text-white">
                          <span className="text-[10px] font-black uppercase tracking-widest">Select Book</span>
                          <button onClick={() => setActiveSearchField(null)}><X className="h-4 w-4" /></button>
                        </div>
                        <div className="flex flex-wrap gap-1 p-2 bg-surface-container-low border-b border-outline-variant/10">
                          {[
                            { id: 'hymns', label: 'Hymns' },
                            { id: 'childrens_songbook', label: 'Children\'s Hymns' },
                            { id: 'new_hymns', label: 'New Hymns' },
                            { id: 'youth_music', label: 'Music' }
                          ].map((book) => (
                            <button
                              key={book.id}
                              onClick={(e) => { e.stopPropagation(); setActiveBook(book.id); }}
                              className={`flex-1 px-2 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                                activeBook === book.id ? "bg-primary text-white" : "text-on-surface-variant hover:bg-white"
                              }`}
                            >
                              {book.label}
                            </button>
                          ))}
                        </div>
                        {hymnSuggestions.map((h: any) => (
                          <button key={h.$id} onClick={() => selectHymn(h, 'block', block.id)} className="w-full px-6 py-4 text-left hover:bg-secondary/10 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between">
                            <span>{h.title}</span>
                            <span className="text-secondary font-black">#{h.number}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : block.type === 'sacrament' ? (
                  <div className="py-4 text-center italic text-on-surface-variant text-sm font-medium">
                    The Administration of the Sacrament
                  </div>
                ) : (
                  <ModernInput 
                    label={block.label} 
                    placeholder="Enter details..." 
                    value={block.value} 
                    onChange={(val: string) => updateBlock(block.id, val)} 
                  />
                )}
              </div>
              <div className="flex flex-col gap-1 pb-1">
                <button onClick={() => moveBlock(i, 'up')} disabled={i === 0} className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-md disabled:opacity-30"><ChevronLeft className="h-4 w-4 rotate-90" /></button>
                <button onClick={() => removeBlock(i)} className="p-1.5 text-error hover:bg-error/10 rounded-md"><X className="h-4 w-4" /></button>
                <button onClick={() => moveBlock(i, 'down')} disabled={i === agenda.data.program.blocks.length - 1} className="p-1.5 text-on-surface-variant hover:bg-surface-variant rounded-md disabled:opacity-30"><ChevronLeft className="h-4 w-4 -rotate-90" /></button>
              </div>
            </div>
          ))}

          <div className="pt-6 border-t border-outline-variant/10 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-primary/60">Add Custom Item</h4>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="e.g. Youth Speaker, Special Musical Number" 
                className="flex-1 bg-surface border border-outline-variant/40 px-4 py-2 rounded-xl text-sm outline-none focus:border-primary"
                value={newCustomLabel}
                onChange={(e) => setNewCustomLabel(e.target.value)}
              />
              <button 
                onClick={() => { if (newCustomLabel) { addBlock('custom', newCustomLabel); setNewCustomLabel(''); } }}
                className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Attendance Tracker" icon={Users}>
        <div className="bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 space-y-6">
          <p className="text-xs text-on-surface-variant font-medium">Track attendance at two points during the first hour.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModernInput 
              label="Before Sacrament" 
              placeholder="0" 
              type="number"
              value={agenda.data.attendance?.beforeSacrament} 
              onChange={(val: string) => updateData('attendance', 'beforeSacrament', val)} 
            />
            <ModernInput 
              label="After Sacrament" 
              placeholder="0" 
              type="number"
              value={agenda.data.attendance?.afterSacrament} 
              onChange={(val: string) => updateData('attendance', 'afterSacrament', val)} 
            />
          </div>
          <div className="pt-4 border-t border-outline-variant/10 text-right">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary/60 mr-4">Total :</span>
            <span className="text-2xl font-black text-primary">
              {Math.max(
                parseInt(agenda.data.attendance?.beforeSacrament || "0") || 0,
                parseInt(agenda.data.attendance?.afterSacrament || "0") || 0
              )}
            </span>
          </div>
        </div>
      </Section>

      <Section title="Service Timing" icon={Clock}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModernInput 
            label="Start Service" 
            placeholder="10:00 AM" 
            value={agenda.data.timing?.start} 
            onChange={(val: string) => updateData('timing', 'start', val)} 
          />
          <ModernInput 
            label="End Service" 
            placeholder="12:00 PM" 
            value={agenda.data.timing?.end} 
            onChange={(val: string) => updateData('timing', 'end', val)} 
          />
        </div>
      </Section>

    </motion.div>
  );
}

function SecondHourFlow({ agenda, updateClass }: any) {
  const isAuto = agenda.data.secondHour?.override === 'auto' || !agenda.data.secondHour?.override;
  const isNew = agenda.data.secondHour?.override === 'new' || (isAuto && isNewSchedule(agenda.date));

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
      {/* Schedule Mode Selector */}
      <div className="bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold text-primary">Schedule Format</h4>
          <p className="text-xs text-on-surface-variant">Choose the Sunday schedule structure for this agenda.</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl border border-outline-variant/20 shadow-inner">
          {[
            { id: 'auto', label: 'Auto (Date)' },
            { id: 'legacy', label: 'Legacy' },
            { id: 'new', label: '2026 Format' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => updateClass('config', null, 'override', mode.id)}
              className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                agenda.data.secondHour?.override === mode.id || (!agenda.data.secondHour?.override && mode.id === 'auto')
                  ? "bg-secondary text-on-secondary shadow-md"
                  : "text-on-surface-variant hover:text-secondary"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {!isNew ? (
        <Section title="Second Hour Classes" icon={Users}>
          <div className="space-y-6">
            {agenda.data.classes?.map((cls: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4">
                <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/10">
                  <h4 className="font-bold text-primary">{cls.name}</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModernInput label="Teacher" placeholder="Instructor Name" value={cls.teacher} onChange={(val: string) => updateClass('legacy', i, 'teacher', val)} />
                  <ModernInput label="Topic" placeholder="Lesson Topic" value={cls.topic} onChange={(val: string) => updateClass('legacy', i, 'topic', val)} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : (
        <>
          {/* Block 1: Sunday School */}
          <Section title="Block 1: Sunday School (25 min)" icon={Book}>
            <div className="space-y-6">
              {agenda.data.secondHour.block1.map((cls: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/10">
                    <h4 className="font-bold text-primary">{cls.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModernInput label="Teacher" placeholder="Instructor Name" value={cls.teacher} onChange={(val: string) => updateClass('block1', i, 'teacher', val)} />
                    <ModernInput label="Topic" placeholder="Lesson Topic" value={cls.topic} onChange={(val: string) => updateClass('block1', i, 'topic', val)} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Block 2: Quorums & Classes */}
          <Section title="Block 2: Quorums & Classes (25 min)" icon={Users}>
            <div className="space-y-6">
              {agenda.data.secondHour.block2.map((cls: any, i: number) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/10">
                    <h4 className="font-bold text-primary">{cls.name}</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ModernInput label="Teacher" placeholder="Instructor Name" value={cls.teacher} onChange={(val: string) => updateClass('block2', i, 'teacher', val)} />
                    <ModernInput label="Topic" placeholder="Lesson Topic" value={cls.topic} onChange={(val: string) => updateClass('block2', i, 'topic', val)} />
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Parallel: Primary */}
          <Section title="Primary (55 min)" icon={Sparkles}>
            <div className="bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-outline-variant/10">
                <h4 className="font-bold text-primary text-sm uppercase tracking-widest">Held parallel to both blocks</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModernInput label="Presidency/Lead" placeholder="Primary Presidency" value={agenda.data.secondHour.primary.teacher} onChange={(val: string) => updateClass('primary', null, 'teacher', val)} />
                <ModernInput label="Special Focus" placeholder="Singing Time / Theme" value={agenda.data.secondHour.primary.topic} onChange={(val: string) => updateClass('primary', null, 'topic', val)} />
              </div>
            </div>
          </Section>
        </>
      )}
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

function ModernInput({ label, placeholder, icon: Icon, value, onChange, onFocus, type = "text" }: any) {
  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          placeholder={placeholder}
          className="w-full bg-surface border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-primary placeholder:text-on-surface-variant/50"
        />
        {Icon && <Icon className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary opacity-50 group-focus-within:opacity-100 transition-opacity" />}
      </div>
    </div>
  );
}
