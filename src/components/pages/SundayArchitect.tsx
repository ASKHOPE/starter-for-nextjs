import { motion, AnimatePresence } from "framer-motion";
import { Church, Music, Users, Book, Save, Clock, MapPin, Sparkles, Loader2, Calendar, X, MessageSquare, ChevronLeft, Zap, ChevronDown, Printer, ClipboardList, Trash2, Plus, ArrowRight, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import { actions } from "astro:actions";

const NEW_SCHEDULE_DATE = new Date("2026-09-06");

const isNewSchedule = (dateStr: string) => {
  return new Date(dateStr) >= NEW_SCHEDULE_DATE;
};

const snapToSunday = (dateStr: string) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  if (day === 0) return dateStr;
  const diff = 7 - day;
  date.setDate(date.getDate() + (day === 6 ? 1 : diff === 7 ? 0 : diff));
  return date.toISOString().split('T')[0];
};

const addMinutes = (timeStr: string, mins: number) => {
  try {
    if (!timeStr) return "";
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + (mins || 0));
    
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const mod = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${mod}`;
  } catch (e) {
    return timeStr;
  }
};

const formatTime = (t: string) => {
  try {
    if (!t) return "";
    const [h, m] = t.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  } catch (e) {
    return t;
  }
};

const ACTIVITY_TEMPLATES = [
  {
    id: 'youth_activity',
    name: 'Youth Activity',
    description: 'Standard combined youth activity structure',
    blocks: [
      { id: 'opening', type: 'text', label: 'Opening Prayer/Thought', value: '', duration: 10, time: '07:00 PM' },
      { id: 'activity', type: 'text', label: 'Main Activity', value: '', duration: 60, time: '07:10 PM' },
      { id: 'closing', type: 'text', label: 'Closing & Refreshments', value: '', duration: 20, time: '08:10 PM' }
    ]
  },
  {
    id: 'workshop',
    name: 'Workshop/Seminar',
    description: 'Structured workshop with segments',
    blocks: [
      { id: 'intro', type: 'text', label: 'Introduction', value: '', duration: 15, time: '07:00 PM' },
      { id: 'session1', type: 'text', label: 'Session 1', value: '', duration: 45, time: '07:15 PM' },
      { id: 'break', type: 'text', label: 'Break', value: '', duration: 15, time: '08:00 PM' },
      { id: 'session2', type: 'text', label: 'Session 2', value: '', duration: 45, time: '08:15 PM' },
      { id: 'qa', type: 'text', label: 'Q&A', value: '', duration: 20, time: '09:00 PM' }
    ]
  }
];

const initialAgendaState = {
  id: null,
  title: "",
  date: snapToSunday(new Date().toISOString().split('T')[0]),
  type: "sacrament",
  status: "draft",
  data: {
    leadership: {
      presiding: "",
      conducting: "",
      organist: "",
      chorister: "",
      acknowledgeLeader: ""
    },
    program: {
      blocks: [
        { id: 'openingHymn', type: 'hymn', label: 'Opening Hymn', value: '', duration: 5 },
        { id: 'invocation', type: 'prayer', label: 'Invocation', value: 'By Invitation', duration: 2 },
        { id: 'business', type: 'business', label: 'Ward Business', value: 'As Directed', duration: 5 },
        { id: 'sacramentHymn', type: 'hymn', label: 'Sacrament Hymn', value: '', duration: 5 },
        { id: 'sacrament', type: 'sacrament', label: 'Administration of the Sacrament', value: '', duration: 15 },
        { id: 'speaker1', type: 'speaker', label: '1st Speaker', value: '', duration: 10 },
        { id: 'speaker2', type: 'speaker', label: '2nd Speaker', value: '', duration: 10 },
        { id: 'speaker3', type: 'speaker', label: '3rd Speaker', value: '', duration: 10 },
        { id: 'closingHymn', type: 'hymn', label: 'Closing Hymn', value: '', duration: 5 },
        { id: 'benediction', type: 'prayer', label: 'Benediction', value: 'By Invitation', duration: 2 }
      ],
      announcements: ""
    },
    secondHour: {
      override: 'auto',
      block1: [
        { name: "Sunday School (Adult)", teacher: "", topic: "" },
        { name: "Sunday School (Youth)", teacher: "", topic: "" }
      ],
      block2: [
        { name: "Relief Society", teacher: "", topic: "" },
        { name: "Elders Quorum", teacher: "", topic: "" },
        { name: "Aaronic Priesthood", teacher: "", topic: "" },
        { name: "Young Women", teacher: "", topic: "" }
      ],
      primary: { teacher: "Primary Presidency", topic: "Singing Time & Classes" }
    },
    attendance: { beforeSacrament: "", afterSacrament: "" },
    timing: { start: "10:00 AM", end: "12:00 PM" },
    activity: {
      name: "",
      location: "",
      description: "",
      time: "19:00",
      endTime: "21:00",
      program: {
        blocks: [
          { id: 'opening', type: 'text', label: 'Opening Prayer/Thought', value: '', duration: 10, time: '7:00 PM', endTime: '7:10 PM' },
          { id: 'activity', type: 'text', label: 'Main Activity', value: '', duration: 60, time: '7:10 PM', endTime: '8:10 PM' },
          { id: 'closing', type: 'text', label: 'Closing & Refreshments', value: '', duration: 20, time: '8:10 PM', endTime: '8:30 PM' }
        ]
      },
      assignments: []
    }
  }
};

export function SundayArchitect() {
  const [agenda, setAgenda] = useState<any>(initialAgendaState);
  const [activeTab, setActiveTab] = useState("sacrament");
  const [planningMode, setPlanningMode] = useState<"sunday" | "activity">("sunday");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTiming, setEditingTiming] = useState(false);
  const [lastDeletedBlock, setLastDeletedBlock] = useState<any>(null);
  const [showUndo, setShowUndo] = useState(false);

  const calculateActivityTiming = () => {
    if (planningMode !== 'activity') return { total: 0, end: "", start: "" };
    const blocks = agenda.data.activity?.program?.blocks || [];
    const total = blocks.reduce((acc: number, b: any) => acc + (parseInt(b.duration) || 0), 0);
    const start = agenda.data.activity?.time || "19:00";
    const startFormatted = formatTime(start);
    const end = addMinutes(startFormatted, total);
    return { total, end, start: startFormatted };
  };

  const { total: totalDuration, end: finalEndTime, start: startTimeFormatted } = calculateActivityTiming();

  // Auto-link times for activity blocks
  useEffect(() => {
    if (planningMode === 'activity') {
      const start = agenda.data.activity?.time || "19:00";
      let currentTime = formatTime(start);
      
      const newBlocks = agenda.data.activity.program.blocks.map((block: any) => {
        const blockStartTime = currentTime;
        const blockEndTime = addMinutes(blockStartTime, block.duration || 0);
        currentTime = blockEndTime;
        return { ...block, time: blockStartTime, endTime: blockEndTime };
      });

      // Only update if changed to avoid infinite loop
      const hasChanged = JSON.stringify(newBlocks) !== JSON.stringify(agenda.data.activity.program.blocks);
      if (hasChanged) {
        setAgenda((prev: any) => ({
          ...prev,
          data: {
            ...prev.data,
            activity: {
              ...prev.data.activity,
              program: { ...prev.data.activity.program, blocks: newBlocks }
            }
          }
        }));
      }
    }
  }, [agenda.data.activity?.time, JSON.stringify(agenda.data.activity?.program?.blocks), planningMode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      loadAgenda(id);
    }
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    const { data } = await actions.getTemplates({});
    if (data?.success) {
      setTemplates(data.templates);
    }
  }

  async function loadAgenda(id: string) {
    setLoading(true);
    const { data } = await actions.getAgendas();
    if (data?.success) {
      const found = data.agendas.find((a: any) => a.$id === id);
      if (found) {
        const migratedData = { ...found.data };
        if (migratedData.classes && !migratedData.secondHour) {
          migratedData.secondHour = {
            block1: migratedData.classes.slice(0, 2),
            block2: [],
            primary: { teacher: "Primary Presidency", topic: "Singing Time & Classes" }
          };
        }
        if (migratedData.secondHour && !migratedData.classes) {
          migratedData.classes = [
            ...(migratedData.secondHour.block1 || []),
            ...(migratedData.secondHour.block2 || [])
          ].slice(0, 4);
        }
        if (!migratedData.program.blocks) {
          migratedData.program.blocks = [
            { id: 'openingHymn', type: 'hymn', label: 'Opening Hymn', value: migratedData.program.openingHymn || '', duration: 5 },
            { id: 'invocation', type: 'prayer', label: 'Invocation', value: 'By Invitation', duration: 2 },
            { id: 'business', type: 'business', label: 'Ward Business', value: 'As Directed', duration: 5 },
            { id: 'sacramentHymn', type: 'hymn', label: 'Sacrament Hymn', value: migratedData.program.sacramentHymn || '', duration: 5 },
            { id: 'sacrament', type: 'sacrament', label: 'Administration of the Sacrament', value: '', duration: 15 }
          ];
        }
        if (!migratedData.attendance) migratedData.attendance = { beforeSacrament: "", afterSacrament: "" };
        if (!migratedData.timing) migratedData.timing = { start: "10:00 AM", end: "12:00 PM" };
        if (!migratedData.activity) migratedData.activity = initialAgendaState.data.activity;

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
    setAgenda((prev: any) => {
      const newData = { ...prev.data };
      if (block === 'legacy') {
        newData.classes[index!] = { ...newData.classes[index!], [field]: value };
      } else if (block === 'config') {
        newData.secondHour[field] = value;
      } else if (index !== null) {
        newData.secondHour[block][index] = { ...newData.secondHour[block][index], [field]: value };
      } else {
        newData.secondHour[block] = { ...newData.secondHour[block], [field]: value };
      }
      return { ...prev, data: newData };
    });
  };

  const updateData = (section: string, field: string, value: string) => {
    setAgenda((prev: any) => {
      const sectionData = prev.data[section] || {};
      return {
        ...prev,
        data: {
          ...prev.data,
          [section]: { ...sectionData, [field]: value }
        }
      };
    });
  };

  const searchHymns = async (query: string, field: string, bookOverride?: string) => {
    setActiveSearchField(field);
    const book = bookOverride ?? activeBook;
    if (bookOverride) setActiveBook(bookOverride);
    const { data } = await actions.getLibraryItems({
      collection: book as any,
      search: query
    });
    if (data?.success) setHymnSuggestions(data.items);
    else setHymnSuggestions([]);
  };


  const updateBlock = (id: string, value: any, field: string = 'value') => {
    setAgenda((prev: any) => {
      const isActivity = planningMode === 'activity';
      const blocks = isActivity 
        ? [...(prev.data.activity?.program?.blocks || [])]
        : [...prev.data.program.blocks];
      
      const newBlocks = blocks.map(b => b.id === id ? { ...b, [field]: value } : b);
      
      if (isActivity) {
        return {
          ...prev,
          data: {
            ...prev.data,
            activity: {
              ...prev.data.activity,
              program: { ...prev.data.activity.program, blocks: newBlocks }
            }
          }
        };
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          program: { ...prev.data.program, blocks: newBlocks }
        }
      };
    });
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setAgenda((prev: any) => {
      const isActivity = planningMode === 'activity';
      const blocks = isActivity 
        ? [...(prev.data.activity?.program?.blocks || [])]
        : [...prev.data.program.blocks];

      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return prev;
      
      const temp = blocks[index];
      blocks[index] = blocks[newIndex];
      blocks[newIndex] = temp;
      
      if (isActivity) {
        return {
          ...prev,
          data: {
            ...prev.data,
            activity: {
              ...prev.data.activity,
              program: { ...prev.data.activity.program, blocks }
            }
          }
        };
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          program: { ...prev.data.program, blocks }
        }
      };
    });
  };

  const removeBlock = (index: number) => {
    setAgenda((prev: any) => {
      const isActivity = planningMode === 'activity';
      const blocks = isActivity 
        ? (prev.data.activity?.program?.blocks || [])
        : prev.data.program.blocks;

      const blockToRemove = blocks[index];
      const newBlocks = blocks.filter((_: any, i: number) => i !== index);
      
      setLastDeletedBlock({ index, block: blockToRemove });
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 5000);

      if (isActivity) {
        return {
          ...prev,
          data: {
            ...prev.data,
            activity: {
              ...prev.data.activity,
              program: { ...prev.data.activity.program, blocks: newBlocks }
            }
          }
        };
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          program: { ...prev.data.program, blocks: newBlocks }
        }
      };
    });
  };

  const undoDelete = () => {
    if (!lastDeletedBlock) return;
    setAgenda((prev: any) => {
      const isActivity = planningMode === 'activity';
      const blocks = isActivity 
        ? [...(prev.data.activity?.program?.blocks || [])]
        : [...prev.data.program.blocks];
      blocks.splice(lastDeletedBlock.index, 0, lastDeletedBlock.block);
      
      if (isActivity) {
        return {
          ...prev,
          data: {
            ...prev.data,
            activity: {
              ...prev.data.activity,
              program: { ...prev.data.activity.program, blocks }
            }
          }
        };
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          program: { ...prev.data.program, blocks }
        }
      };
    });
    setShowUndo(false);
    setLastDeletedBlock(null);
  };

  const addBlock = (type: string, label: string) => {
    setAgenda((prev: any) => {
      const isActivity = planningMode === 'activity';
      const currentBlocks = isActivity 
        ? (prev.data.activity?.program?.blocks || [])
        : prev.data.program.blocks;

      const newBlock = { 
        id: Math.random().toString(36).substring(7), 
        type, 
        label, 
        value: '',
        duration: 15,
        time: isActivity ? '07:00 PM' : undefined
      };

      if (isActivity) {
        return {
          ...prev,
          data: {
            ...prev.data,
            activity: {
              ...prev.data.activity,
              program: { ...prev.data.activity.program, blocks: [...currentBlocks, newBlock] }
            }
          }
        };
      }
      return {
        ...prev,
        data: {
          ...prev.data,
          program: { ...prev.data.program, blocks: [...currentBlocks, newBlock] }
        }
      };
    });
  };

  const applyTemplate = (template: any) => {
    let blocks = typeof template.blocks === 'string' ? JSON.parse(template.blocks) : template.blocks;
    setAgenda((prev: any) => {
      if (planningMode === 'activity') {
        return {
          ...prev,
          data: {
            ...prev.data,
            activity: { ...prev.data.activity, program: { ...prev.data.activity.program, blocks } }
          }
        };
      }
      return { ...prev, data: { ...prev.data, program: { ...prev.data.program, blocks } } };
    });
    setShowTemplates(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await actions.saveAgenda(agenda);
    if (data?.success) {
      alert("Agenda saved!");
      if (!agenda.id) {
        window.history.replaceState({}, "", `/plan/sunday?id=${data.agenda.$id}`);
        setAgenda((prev: any) => ({ ...prev, id: data.agenda.$id }));
      }
    } else alert("Error: " + error?.message);
    setSaving(false);
  };

  const addAssignment = () => {
    setAgenda((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        activity: {
          ...prev.data.activity,
          assignments: [...(prev.data.activity.assignments || []), { id: Math.random().toString(36).substring(7), task: "", person: "", status: "pending" }]
        }
      }
    }));
  };

  const updateAssignment = (id: string, field: string, value: string) => {
    setAgenda((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        activity: {
          ...prev.data.activity,
          assignments: prev.data.activity.assignments.map((a: any) => a.id === id ? { ...a, [field]: value } : a)
        }
      }
    }));
  };

  const removeAssignment = (id: string) => {
    setAgenda((prev: any) => ({
      ...prev,
      data: {
        ...prev.data,
        activity: {
          ...prev.data.activity,
          assignments: prev.data.activity.assignments.filter((a: any) => a.id !== id)
        }
      }
    }));
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;

  const activityTemplatesFromDB = templates.filter((t: any) => t.type === 'activity');
  const activeActivityTemplates = activityTemplatesFromDB.length > 0 ? activityTemplatesFromDB : ACTIVITY_TEMPLATES;

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">

      {/* Ã¢â€â‚¬Ã¢â€â‚¬ Top Command Bar Ã¢â€â‚¬Ã¢â€â‚¬ */}
      <div className="flex-shrink-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm z-[100]">
        {/* Row 1 */}
        <div className="flex items-center gap-3 px-5 py-2.5 border-b border-slate-100">
          <div className={`p-2 rounded-xl ${planningMode === 'sunday' ? 'bg-primary' : 'bg-secondary'}`}>
            {planningMode === 'sunday' ? <Church className="h-4 w-4 text-white" /> : <Zap className="h-4 w-4 text-white" />}
          </div>
          <input
            type="text"
            value={planningMode === 'sunday' ? agenda.title : (agenda.data.activity?.name || '')}
            onChange={(e) => planningMode === 'sunday' ? setAgenda((p: any) => ({ ...p, title: e.target.value })) : updateData('activity', 'name', e.target.value)}
            className="bg-transparent border-none outline-none text-lg font-black text-primary flex-1 placeholder:text-slate-300"
            placeholder="Unit / Activity Name..."
          />
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 hidden xl:block">Gospel Agenda Architect</span>
          <div className="flex items-center gap-2 ml-4">
            <button onClick={() => window.open(`/preview/agenda?id=${agenda.id}`, '_blank')} className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white border border-slate-200 transition-all">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-5 py-2 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:brightness-110 disabled:opacity-60">
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} Save
            </button>
          </div>
        </div>
        {/* Row 2 */}
        <div className="flex items-center gap-3 px-5 py-2">
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {[{ id: 'sunday', icon: Church, label: 'Sunday' }, { id: 'activity', icon: Zap, label: 'Activity' }].map((m) => (
              <button key={m.id} onClick={() => { setPlanningMode(m.id as any); setActiveTab(m.id === 'sunday' ? 'sacrament' : 'activity'); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${planningMode === m.id ? 'bg-primary text-white shadow-sm' : 'text-slate-400 hover:text-primary'}`}>
                <m.icon className="h-3 w-3" /> {m.label}
              </button>
            ))}
          </div>
          {planningMode === 'sunday' && (
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {['sacrament', 'second-hour'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-slate-400'}`}>
                  {tab === 'sacrament' ? 'Sacrament' : '2nd Hour'}
                </button>
              ))}
            </div>
          )}
          {planningMode === 'activity' && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 rounded-lg border border-secondary/20">
              <Sparkles className="h-3 w-3 text-secondary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-secondary">Activity Engine</span>
            </div>
          )}
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 group relative">
              <Calendar className={`h-3.5 w-3.5 ${planningMode === 'sunday' ? 'text-primary' : 'text-slate-400'}`} />
              <input type="date" value={agenda.date}
                onChange={(e) => setAgenda((p: any) => ({ ...p, date: planningMode === 'sunday' ? snapToSunday(e.target.value) : e.target.value }))}
                className="bg-transparent border-none outline-none text-[10px] font-black text-slate-600 p-0" />
              {planningMode === 'sunday' && <div className="absolute top-full left-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"><div className="bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow whitespace-nowrap">Sundays Only</div></div>}
            </div>
            {planningMode === 'activity' && (<>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span className="text-[9px] font-black uppercase text-slate-400">Start</span>
                <input type="time" value={agenda.data.activity?.time || '19:00'} onChange={(e) => updateData('activity', 'time', e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-black text-slate-600 p-0" />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                <Clock className="h-3.5 w-3.5 text-secondary" />
                <span className="text-[9px] font-black uppercase text-slate-400">End</span>
                <input type="time" value={agenda.data.activity?.endTime || '21:00'} onChange={(e) => updateData('activity', 'endTime', e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-black text-slate-600 p-0" />
              </div>
            </>)}
             <div className="relative">
              <button onClick={() => setShowTemplates(!showTemplates)} className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20">
                <LayoutGrid className="h-3.5 w-3.5" /> Templates
              </button>
              {showTemplates && (
                <div className="absolute top-full right-0 mt-2 w-68 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-[110] min-w-[260px]">
                  <div className="space-y-1.5">
                    {(planningMode === 'sunday' ? templates : activeActivityTemplates).map((t: any) => (
                      <button key={t.$id || t.id} onClick={() => applyTemplate(t)}
                        className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-primary/40 hover:bg-primary/5 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary block">{t.name}</span>
                        <span className="text-[9px] text-slate-400 line-clamp-1">{t.description}</span>
                      </button>
                    ))}
                    {(planningMode === 'sunday' ? templates : activeActivityTemplates).length === 0 && (
                      <p className="text-[10px] text-slate-400 text-center py-3">No templates found</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* â”€â”€ Undo Toast â”€â”€ */}
      <AnimatePresence>
        {showUndo && (
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-primary text-white px-6 py-3.5 rounded-2xl shadow-2xl">
            <span className="text-sm font-bold">Removed: {lastDeletedBlock?.block?.label}</span>
            <button onClick={undoDelete} className="bg-white text-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase">Undo</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* â”€â”€ Full-Width Content â”€â”€ */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-5xl mx-auto px-6 py-6">
          {activeTab === 'sacrament' ? (
            <SacramentFlow
              agenda={agenda} updateData={updateData} updateBlock={updateBlock}
              moveBlock={moveBlock} removeBlock={removeBlock} addBlock={addBlock}
              searchHymns={searchHymns} hymnSuggestions={hymnSuggestions}
              activeSearchField={activeSearchField} activeBook={activeBook}
              setActiveSearchField={setActiveSearchField}
              editingTiming={editingTiming} setEditingTiming={setEditingTiming}
            />
          ) : activeTab === 'second-hour' ? (
            <SecondHourFlow agenda={agenda} updateClass={updateClass} />
          ) : (
            <ActivityFlow
              agenda={agenda} updateData={updateData} updateBlock={updateBlock}
              removeBlock={removeBlock} moveBlock={moveBlock} addBlock={addBlock}
              addAssignment={addAssignment} updateAssignment={updateAssignment}
              removeAssignment={removeAssignment}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }: any) {
  return (
    <div className="bg-white/40 p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-primary p-3 rounded-2xl text-white"><Icon className="h-6 w-6" /></div>
        <h3 className="text-2xl font-black text-primary tracking-tight">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ModernInput({ label, placeholder, icon: Icon, value, onChange, onFocus, type = "text" }: any) {
  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">{label}</label>
      <div className="relative group">
        <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} onFocus={onFocus} placeholder={placeholder} className="w-full bg-white/50 border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium text-primary" />
        {Icon && <Icon className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary opacity-50" />}
      </div>
    </div>
  );
}

function SacramentFlow({ agenda, updateData, searchHymns, hymnSuggestions, activeSearchField, selectHymn, activeBook, setActiveBook, setActiveSearchField, updateBlock, moveBlock, removeBlock, addBlock }: any) {
  const [newCustomLabel, setNewCustomLabel] = useState("");
  return (
    <div className="space-y-10">
      <Section title="Leadership & Music" icon={Users}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ModernInput label="Presiding" value={agenda.data.leadership.presiding} onChange={(val: string) => updateData('leadership', 'presiding', val)} />
          <ModernInput label="Conducting" value={agenda.data.leadership.conducting} onChange={(val: string) => updateData('leadership', 'conducting', val)} />
          <ModernInput label="Organist" value={agenda.data.leadership.organist} onChange={(val: string) => updateData('leadership', 'organist', val)} />
          <ModernInput label="Chorister" value={agenda.data.leadership.chorister} onChange={(val: string) => updateData('leadership', 'chorister', val)} />
        </div>
      </Section>
      <Section title="Meeting Program" icon={Book}>
        <div className="space-y-6">
          <div className="space-y-2.5"><label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Announcements</label><textarea className="w-full bg-white/50 border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all min-h-[120px]" value={agenda.data.program.announcements || ""} onChange={(e) => updateData('program', 'announcements', e.target.value)} /></div>
          {agenda.data.program.blocks.map((block: any, i: number) => (
            <div key={block.id} className="group relative flex items-start gap-4 bg-white p-6 rounded-[2rem] border border-outline-variant/20 shadow-sm">
              <div className="flex-1 space-y-4">
                {block.type === 'hymn' ? (
                  <div className="relative">
                    <ModernInput label={block.label} value={block.value} onFocus={() => setActiveSearchField(block.id)} onChange={(val: string) => { updateBlock(block.id, val); searchHymns(val, block.id); }} icon={Sparkles} />
                    {activeSearchField === block.id && hymnSuggestions.length > 0 && (
                      <div className="absolute z-[120] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
                        <div className="flex p-2 bg-surface-container-low border-b border-outline-variant/10">
                          {['hymns', 'childrens_songbook', 'new_hymns'].map(book => (
                            <button key={book} onClick={() => setActiveBook(book)} className={`flex-1 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeBook === book ? "bg-primary text-white" : "text-on-surface-variant"}`}>{book.replace('_', ' ')}</button>
                          ))}
                        </div>
                        {hymnSuggestions.map((h: any) => (
                          <button key={h.$id} onClick={() => selectHymn(h, 'block', block.id)} className="w-full px-6 py-4 text-left hover:bg-primary/5 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between"><span>{h.title}</span><span className="text-secondary font-black">#{h.number}</span></button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : block.type === 'sacrament' ? (
                  <div className="py-8 text-center bg-primary/5 rounded-2xl border border-dashed border-primary/20"><p className="text-sm font-black text-primary uppercase tracking-widest">Administration of the Sacrament</p></div>
                ) : (
                  <ModernInput label={block.label} value={block.value} onChange={(val: string) => updateBlock(block.id, val)} />
                )}
                <div className="flex items-center gap-4 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10">
                  <Clock className="h-4 w-4 text-primary/40" /><span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60">Duration (min):</span>
                  <div className="flex items-center gap-2">{[5, 10, 15].map(mins => (
                    <button key={mins} onClick={() => updateBlock(block.id, mins, 'duration')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black ${block.duration === mins ? "bg-primary text-white shadow-lg" : "bg-white text-on-surface-variant/40"}`}>{mins}m</button>
                  ))}<input type="number" value={block.duration || ""} onChange={(e) => updateBlock(block.id, parseInt(e.target.value) || 0, 'duration')} className="w-16 bg-white rounded-lg border border-outline-variant/10 text-center text-[10px] font-black text-primary outline-none px-2 py-1" /></div>
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => moveBlock(i, 'up')} disabled={i === 0} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl disabled:opacity-20"><ChevronLeft className="h-4 w-4 rotate-90" /></button>
                <button onClick={() => removeBlock(i)} className="p-2 text-error hover:bg-error/10 rounded-xl"><Trash2 className="h-4 w-4" /></button>
                <button onClick={() => moveBlock(i, 'down')} disabled={i === agenda.data.program.blocks.length - 1} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl disabled:opacity-20"><ChevronLeft className="h-4 w-4 -rotate-90" /></button>
              </div>
            </div>
          ))}
          <div className="pt-8 border-t border-outline-variant/10 flex gap-4">
            <div className="flex-1"><ModernInput label="Add Program Item" value={newCustomLabel} onChange={setNewCustomLabel} /></div>
            <button onClick={() => { if (newCustomLabel) { addBlock('custom', newCustomLabel); setNewCustomLabel(''); } }} className="bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-6">Add Block</button>
          </div>
        </div>
      </Section>
      <Section title="Attendance Tracker" icon={Users}>
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <ModernInput label="Before Sacrament" type="number" value={agenda.data.attendance.beforeSacrament} onChange={(val: string) => updateData('attendance', 'beforeSacrament', val)} />
          <ModernInput label="After Sacrament" type="number" value={agenda.data.attendance.afterSacrament} onChange={(val: string) => updateData('attendance', 'afterSacrament', val)} />
        </div>
      </Section>
    </div>
  );
}

function SecondHourFlow({ agenda, updateClass }: any) {
  const isAuto = agenda.data.secondHour?.override === 'auto' || !agenda.data.secondHour?.override;
  const isNew = agenda.data.secondHour?.override === 'new' || (isAuto && isNewSchedule(agenda.date));
  return (
    <div className="space-y-8">
      <div className="bg-white/50 p-6 rounded-[2rem] border border-outline-variant/30 flex justify-between items-center">
        <h4 className="font-bold text-primary">Schedule Format</h4>
        <div className="flex bg-white p-1 rounded-xl border border-outline-variant/20">
          {['auto', 'legacy', 'new'].map(mode => (
            <button key={mode} onClick={() => updateClass('config', null, 'override', mode)} className={`px-4 py-2 rounded-lg text-xs font-black ${agenda.data.secondHour?.override === mode || (!agenda.data.secondHour?.override && mode === 'auto') ? "bg-secondary text-on-secondary shadow-md" : "text-on-surface-variant"}`}>{mode === 'auto' ? 'Auto' : mode === 'legacy' ? 'Legacy' : '2026 Format'}</button>
          ))}
        </div>
      </div>
      {!isNew ? (
        <Section title="Second Hour Classes" icon={Users}>
          <div className="space-y-6">
            {agenda.data.classes?.map((cls: any, i: number) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4">
                <h4 className="font-bold text-primary">{cls.name}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModernInput label="Teacher" value={cls.teacher} onChange={(val: string) => updateClass('legacy', i, 'teacher', val)} />
                  <ModernInput label="Topic" value={cls.topic} onChange={(val: string) => updateClass('legacy', i, 'topic', val)} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      ) : (
        <div className="space-y-8">
          <Section title="Block 1: Sunday School" icon={Book}><div className="space-y-6">{agenda.data.secondHour.block1.map((cls: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4"><h4 className="font-bold text-primary">{cls.name}</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><ModernInput label="Teacher" value={cls.teacher} onChange={(val: string) => updateClass('block1', i, 'teacher', val)} /><ModernInput label="Topic" value={cls.topic} onChange={(val: string) => updateClass('block1', i, 'topic', val)} /></div></div>
          ))}</div></Section>
          <Section title="Block 2: Quorums & Relief Society" icon={Users}><div className="space-y-6">{agenda.data.secondHour.block2.map((cls: any, i: number) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4"><h4 className="font-bold text-primary">{cls.name}</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><ModernInput label="Teacher" value={cls.teacher} onChange={(val: string) => updateClass('block2', i, 'teacher', val)} /><ModernInput label="Topic" value={cls.topic} onChange={(val: string) => updateClass('block2', i, 'topic', val)} /></div></div>
          ))}</div></Section>
          <Section title="Primary" icon={Sparkles}><div className="bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"><ModernInput label="Lead" value={agenda.data.secondHour.primary.teacher} onChange={(val: string) => updateClass('primary', null, 'teacher', val)} /><ModernInput label="Focus" value={agenda.data.secondHour.primary.topic} onChange={(val: string) => updateClass('primary', null, 'topic', val)} /></div></Section>
        </div>
      )}
    </div>
  );
}

function ActivityFlow({ agenda, updateData, updateBlock, removeBlock, moveBlock, addBlock, addAssignment, updateAssignment, removeAssignment }: any) {
  const [newCustomLabel, setNewCustomLabel] = useState("");
  const blocks = agenda.data.activity?.program?.blocks || [];
  const activityStartTime = agenda.data.activity?.time || "19:00";
  const startTimeFormatted = formatTime(activityStartTime);
  const totalDuration = blocks.reduce((acc: number, b: any) => acc + (b.duration || 0), 0);
  const finalEndTime = addMinutes(startTimeFormatted, totalDuration);

  return (
    <div className="space-y-10">
      <Section title="Ward Activity Details" icon={Calendar}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ModernInput label="Activity Name" value={agenda.data.activity?.name || ""} onChange={(val: string) => updateData('activity', 'name', val)} />
          <ModernInput label="Location" value={agenda.data.activity?.location || ""} onChange={(val: string) => updateData('activity', 'location', val)} />
          <div className="md:col-span-2 space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1">Description</label>
            <textarea className="w-full bg-white/50 border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all min-h-[120px]" value={agenda.data.activity?.description || ""} onChange={(e) => updateData('activity', 'description', e.target.value)} />
          </div>
        </div>
      </Section>
      <Section title="Activity Program" icon={Clock}>
        <div className="space-y-6">
          <div className="flex items-center justify-between px-8 py-5 bg-primary/5 rounded-[2rem] border border-primary/10 mb-4">
            <div className="flex items-center gap-6">
              <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-primary/40">Duration</span><span className="text-lg font-black text-primary">{totalDuration} min</span></div>
              <div className="flex flex-col"><span className="text-[9px] font-black uppercase tracking-widest text-primary/40">Expected End</span><span className="text-lg font-black text-primary">{finalEndTime}</span></div>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl border border-primary/10 text-[10px] font-black uppercase text-primary/60">Starts at {startTimeFormatted}</div>
          </div>
          {blocks.map((block: any, i: number) => (
            <div key={block.id} className="relative flex flex-col gap-4 bg-white p-6 rounded-[2.5rem] border border-outline-variant/20 shadow-sm group">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex items-center gap-4 bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10 shrink-0">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest">Time</span>
                    <span className="text-xs font-black text-primary whitespace-nowrap">{block.time} - {block.endTime}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <ModernInput label={block.label} value={block.value} onChange={(val: string) => updateBlock(block.id, val)} />
                </div>

                <div className="flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveBlock(i, 'up')} disabled={i === 0} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl disabled:opacity-20"><ChevronLeft className="h-4 w-4 rotate-90" /></button>
                  <button onClick={() => removeBlock(i)} className="p-2 text-error hover:bg-error/10 rounded-xl"><Trash2 className="h-4 w-4" /></button>
                  <button onClick={() => moveBlock(i, 'down')} disabled={i === blocks.length - 1} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl disabled:opacity-20"><ChevronLeft className="h-4 w-4 -rotate-90" /></button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-outline-variant/5">
                <Clock className="h-3.5 w-3.5 text-on-surface-variant/20" />
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 mr-2">Set Duration:</span>
                {[5, 10, 15, 30, 45, 60].map(mins => (
                  <button 
                    key={mins} 
                    onClick={() => updateBlock(block.id, mins, 'duration')}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${block.duration === mins ? "bg-secondary text-white shadow-lg" : "bg-surface-container-low text-on-surface-variant/40 hover:bg-white"}`}
                  >
                    {mins}m
                  </button>
                ))}
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-[9px] font-black uppercase text-on-surface-variant/20">Custom:</span>
                  <input 
                    type="number" 
                    value={block.duration || ""} 
                    onChange={(e) => updateBlock(block.id, parseInt(e.target.value) || 0, 'duration')}
                    className="w-16 bg-surface-container-low border border-outline-variant/10 rounded-lg px-2 py-1 text-[10px] font-black text-center text-primary"
                  />
                </div>
              </div>
            </div>
          ))}
          <div className="pt-6 border-t border-outline-variant/10 flex gap-4">
            <div className="flex-1"><ModernInput label="Add Stage" value={newCustomLabel} onChange={setNewCustomLabel} /></div>
            <button onClick={() => { if (newCustomLabel) { addBlock('activity_item', newCustomLabel); setNewCustomLabel(''); } }} className="bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-6">Add</button>
          </div>
        </div>
      </Section>
      <Section title="Activity Assignments" icon={ClipboardList}>
        <div className="space-y-4">
          {agenda.data.activity.assignments.map((a: any) => (
            <div key={a.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white p-4 rounded-2xl border border-outline-variant/10 shadow-sm">
              <div className="md:col-span-5"><ModernInput label="Task" value={a.task} onChange={(val: string) => updateAssignment(a.id, 'task', val)} /></div>
              <div className="md:col-span-4"><ModernInput label="Person" value={a.person} onChange={(val: string) => updateAssignment(a.id, 'person', val)} /></div>
              <div className="md:col-span-2"><select value={a.status} onChange={(e) => updateAssignment(a.id, 'status', e.target.value)} className="w-full bg-white border border-outline-variant/40 px-4 py-4 rounded-2xl text-xs font-bold text-primary appearance-none"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="completed">Completed</option></select></div>
              <div className="md:col-span-1 flex justify-end pb-1"><button onClick={() => removeAssignment(a.id)} className="p-3 text-error hover:bg-error/10 rounded-xl"><Trash2 className="h-4 w-4" /></button></div>
            </div>
          ))}
          <button onClick={addAssignment} className="w-full py-4 border-2 border-dashed border-outline-variant/40 rounded-2xl text-on-surface-variant/40 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-2"><Plus className="h-4 w-4" /><span className="text-[10px] font-black uppercase tracking-widest">Add Assignment</span></button>
        </div>
      </Section>
    </div>
  );
}
