import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_BwkHfUgm.mjs';
import { $ as $$Layout } from './Layout_CWEyc26O.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2, Church, Zap, Printer, Save, Sparkles, Calendar, Clock, LayoutGrid, Users, Trash2, Book, ChevronLeft, ClipboardList, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { a as actions } from './server_Bk0GM6sU.mjs';

const NEW_SCHEDULE_DATE = /* @__PURE__ */ new Date("2026-09-06");
const isNewSchedule = (dateStr) => {
  return new Date(dateStr) >= NEW_SCHEDULE_DATE;
};
const snapToSunday = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDay();
  if (day === 0) return dateStr;
  const diff = 7 - day;
  date.setDate(date.getDate() + (day === 6 ? 1 : diff === 7 ? 0 : diff));
  return date.toISOString().split("T")[0];
};
const addMinutes = (timeStr, mins) => {
  try {
    if (!timeStr) return "";
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const date = /* @__PURE__ */ new Date();
    date.setHours(hours);
    date.setMinutes(minutes + (mins || 0));
    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, "0");
    const mod = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${mod}`;
  } catch (e) {
    return timeStr;
  }
};
const formatTime = (t) => {
  try {
    if (!t) return "";
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  } catch (e) {
    return t;
  }
};
const ACTIVITY_TEMPLATES = [
  {
    id: "youth_activity",
    name: "Youth Activity",
    description: "Standard combined youth activity structure",
    blocks: [
      { id: "opening", type: "text", label: "Opening Prayer/Thought", value: "", duration: 10, time: "07:00 PM" },
      { id: "activity", type: "text", label: "Main Activity", value: "", duration: 60, time: "07:10 PM" },
      { id: "closing", type: "text", label: "Closing & Refreshments", value: "", duration: 20, time: "08:10 PM" }
    ]
  },
  {
    id: "workshop",
    name: "Workshop/Seminar",
    description: "Structured workshop with segments",
    blocks: [
      { id: "intro", type: "text", label: "Introduction", value: "", duration: 15, time: "07:00 PM" },
      { id: "session1", type: "text", label: "Session 1", value: "", duration: 45, time: "07:15 PM" },
      { id: "break", type: "text", label: "Break", value: "", duration: 15, time: "08:00 PM" },
      { id: "session2", type: "text", label: "Session 2", value: "", duration: 45, time: "08:15 PM" },
      { id: "qa", type: "text", label: "Q&A", value: "", duration: 20, time: "09:00 PM" }
    ]
  }
];
const initialAgendaState = {
  id: null,
  title: "",
  date: snapToSunday((/* @__PURE__ */ new Date()).toISOString().split("T")[0]),
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
        { id: "openingHymn", type: "hymn", label: "Opening Hymn", value: "", duration: 5 },
        { id: "invocation", type: "prayer", label: "Invocation", value: "By Invitation", duration: 2 },
        { id: "business", type: "business", label: "Ward Business", value: "As Directed", duration: 5 },
        { id: "sacramentHymn", type: "hymn", label: "Sacrament Hymn", value: "", duration: 5 },
        { id: "sacrament", type: "sacrament", label: "Administration of the Sacrament", value: "", duration: 15 },
        { id: "speaker1", type: "speaker", label: "1st Speaker", value: "", duration: 10 },
        { id: "speaker2", type: "speaker", label: "2nd Speaker", value: "", duration: 10 },
        { id: "speaker3", type: "speaker", label: "3rd Speaker", value: "", duration: 10 },
        { id: "closingHymn", type: "hymn", label: "Closing Hymn", value: "", duration: 5 },
        { id: "benediction", type: "prayer", label: "Benediction", value: "By Invitation", duration: 2 }
      ],
      announcements: ""
    },
    secondHour: {
      override: "auto",
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
          { id: "opening", type: "text", label: "Opening Prayer/Thought", value: "", duration: 10, time: "7:00 PM", endTime: "7:10 PM" },
          { id: "activity", type: "text", label: "Main Activity", value: "", duration: 60, time: "7:10 PM", endTime: "8:10 PM" },
          { id: "closing", type: "text", label: "Closing & Refreshments", value: "", duration: 20, time: "8:10 PM", endTime: "8:30 PM" }
        ]
      },
      assignments: []
    }
  }
};
function SundayArchitect() {
  const [agenda, setAgenda] = useState(initialAgendaState);
  const [activeTab, setActiveTab] = useState("sacrament");
  const [planningMode, setPlanningMode] = useState("sunday");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [editingTiming, setEditingTiming] = useState(false);
  const [lastDeletedBlock, setLastDeletedBlock] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const calculateActivityTiming = () => {
    if (planningMode !== "activity") return { total: 0, end: "", start: "" };
    const blocks = agenda.data.activity?.program?.blocks || [];
    const total = blocks.reduce((acc, b) => acc + (parseInt(b.duration) || 0), 0);
    const start = agenda.data.activity?.time || "19:00";
    const startFormatted = formatTime(start);
    const end = addMinutes(startFormatted, total);
    return { total, end, start: startFormatted };
  };
  const { total: totalDuration, end: finalEndTime, start: startTimeFormatted } = calculateActivityTiming();
  useEffect(() => {
    if (planningMode === "activity") {
      const start = agenda.data.activity?.time || "19:00";
      let currentTime = formatTime(start);
      const newBlocks = agenda.data.activity.program.blocks.map((block) => {
        const blockStartTime = currentTime;
        const blockEndTime = addMinutes(blockStartTime, block.duration || 0);
        currentTime = blockEndTime;
        return { ...block, time: blockStartTime, endTime: blockEndTime };
      });
      const hasChanged = JSON.stringify(newBlocks) !== JSON.stringify(agenda.data.activity.program.blocks);
      if (hasChanged) {
        setAgenda((prev) => ({
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
  async function loadAgenda(id) {
    setLoading(true);
    const { data } = await actions.getAgendas();
    if (data?.success) {
      const found = data.agendas.find((a) => a.$id === id);
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
            ...migratedData.secondHour.block1 || [],
            ...migratedData.secondHour.block2 || []
          ].slice(0, 4);
        }
        if (!migratedData.program.blocks) {
          migratedData.program.blocks = [
            { id: "openingHymn", type: "hymn", label: "Opening Hymn", value: migratedData.program.openingHymn || "", duration: 5 },
            { id: "invocation", type: "prayer", label: "Invocation", value: "By Invitation", duration: 2 },
            { id: "business", type: "business", label: "Ward Business", value: "As Directed", duration: 5 },
            { id: "sacramentHymn", type: "hymn", label: "Sacrament Hymn", value: migratedData.program.sacramentHymn || "", duration: 5 },
            { id: "sacrament", type: "sacrament", label: "Administration of the Sacrament", value: "", duration: 15 }
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
  const [hymnSuggestions, setHymnSuggestions] = useState([]);
  const [activeSearchField, setActiveSearchField] = useState(null);
  const [activeBook, setActiveBook] = useState("hymns");
  const updateClass = (block, index, field, value) => {
    setAgenda((prev) => {
      const newData = { ...prev.data };
      if (block === "legacy") {
        newData.classes[index] = { ...newData.classes[index], [field]: value };
      } else if (block === "config") {
        newData.secondHour[field] = value;
      } else if (index !== null) {
        newData.secondHour[block][index] = { ...newData.secondHour[block][index], [field]: value };
      } else {
        newData.secondHour[block] = { ...newData.secondHour[block], [field]: value };
      }
      return { ...prev, data: newData };
    });
  };
  const updateData = (section, field, value) => {
    setAgenda((prev) => {
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
  const searchHymns = async (query, field) => {
    setActiveSearchField(field);
    const { data } = await actions.getLibraryItems({
      collection: activeBook,
      search: query
    });
    if (data?.success) setHymnSuggestions(data.items);
  };
  const selectHymn = (hymn, section, field) => {
    const value = `${hymn.number ? `#${hymn.number} ` : ""}${hymn.title}`;
    if (section === "block") updateBlock(field, value);
    else updateData(section, field, value);
    setHymnSuggestions([]);
    setActiveSearchField(null);
  };
  const updateBlock = (id, value, field = "value") => {
    setAgenda((prev) => {
      const isActivity = planningMode === "activity";
      const blocks = isActivity ? [...prev.data.activity?.program?.blocks || []] : [...prev.data.program.blocks];
      const newBlocks = blocks.map((b) => b.id === id ? { ...b, [field]: value } : b);
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
  const moveBlock = (index, direction) => {
    setAgenda((prev) => {
      const isActivity = planningMode === "activity";
      const blocks = isActivity ? [...prev.data.activity?.program?.blocks || []] : [...prev.data.program.blocks];
      const newIndex = direction === "up" ? index - 1 : index + 1;
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
  const removeBlock = (index) => {
    setAgenda((prev) => {
      const isActivity = planningMode === "activity";
      const blocks = isActivity ? prev.data.activity?.program?.blocks || [] : prev.data.program.blocks;
      const blockToRemove = blocks[index];
      const newBlocks = blocks.filter((_, i) => i !== index);
      setLastDeletedBlock({ index, block: blockToRemove });
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 5e3);
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
    setAgenda((prev) => {
      const isActivity = planningMode === "activity";
      const blocks = isActivity ? [...prev.data.activity?.program?.blocks || []] : [...prev.data.program.blocks];
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
  const addBlock = (type, label) => {
    setAgenda((prev) => {
      const isActivity = planningMode === "activity";
      const currentBlocks = isActivity ? prev.data.activity?.program?.blocks || [] : prev.data.program.blocks;
      const newBlock = {
        id: Math.random().toString(36).substring(7),
        type,
        label,
        value: "",
        duration: 15,
        time: isActivity ? "07:00 PM" : void 0
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
  const applyTemplate = (template) => {
    let blocks = typeof template.blocks === "string" ? JSON.parse(template.blocks) : template.blocks;
    setAgenda((prev) => {
      if (planningMode === "activity") {
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
        setAgenda((prev) => ({ ...prev, id: data.agenda.$id }));
      }
    } else alert("Error: " + error?.message);
    setSaving(false);
  };
  const addAssignment = () => {
    setAgenda((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        activity: {
          ...prev.data.activity,
          assignments: [...prev.data.activity.assignments || [], { id: Math.random().toString(36).substring(7), task: "", person: "", status: "pending" }]
        }
      }
    }));
  };
  const updateAssignment = (id, field, value) => {
    setAgenda((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        activity: {
          ...prev.data.activity,
          assignments: prev.data.activity.assignments.map((a) => a.id === id ? { ...a, [field]: value } : a)
        }
      }
    }));
  };
  const removeAssignment = (id) => {
    setAgenda((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        activity: {
          ...prev.data.activity,
          assignments: prev.data.activity.assignments.filter((a) => a.id !== id)
        }
      }
    }));
  };
  if (loading) return /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-screen", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin h-12 w-12 text-primary" }) });
  const activityTemplatesFromDB = templates.filter((t) => t.type === "activity");
  const activeActivityTemplates = activityTemplatesFromDB.length > 0 ? activityTemplatesFromDB : ACTIVITY_TEMPLATES;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex-shrink-0 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-sm z-[100]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-2.5 border-b border-slate-100", children: [
        /* @__PURE__ */ jsx("div", { className: `p-2 rounded-xl ${planningMode === "sunday" ? "bg-primary" : "bg-secondary"}`, children: planningMode === "sunday" ? /* @__PURE__ */ jsx(Church, { className: "h-4 w-4 text-white" }) : /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4 text-white" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: planningMode === "sunday" ? agenda.title : agenda.data.activity?.name || "",
            onChange: (e) => planningMode === "sunday" ? setAgenda((p) => ({ ...p, title: e.target.value })) : updateData("activity", "name", e.target.value),
            className: "bg-transparent border-none outline-none text-lg font-black text-primary flex-1 placeholder:text-slate-300",
            placeholder: "Unit / Activity Name..."
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-slate-300 hidden xl:block", children: "Gospel Agenda Architect" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-4", children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => window.open(`/preview/agenda?id=${agenda.id}`, "_blank"), className: "flex items-center gap-1.5 px-4 py-2 bg-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white border border-slate-200 transition-all", children: [
            /* @__PURE__ */ jsx(Printer, { className: "h-3.5 w-3.5" }),
            " Print"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: handleSave, disabled: saving, className: "flex items-center gap-1.5 px-5 py-2 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md hover:brightness-110 disabled:opacity-60", children: [
            saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-3.5 w-3.5" }),
            " Save"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 px-5 py-2", children: [
        /* @__PURE__ */ jsx("div", { className: "flex bg-slate-100 p-0.5 rounded-lg border border-slate-200", children: [{ id: "sunday", icon: Church, label: "Sunday" }, { id: "activity", icon: Zap, label: "Activity" }].map((m) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              setPlanningMode(m.id);
              setActiveTab(m.id === "sunday" ? "sacrament" : "activity");
            },
            className: `flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${planningMode === m.id ? "bg-primary text-white shadow-sm" : "text-slate-400 hover:text-primary"}`,
            children: [
              /* @__PURE__ */ jsx(m.icon, { className: "h-3 w-3" }),
              " ",
              m.label
            ]
          },
          m.id
        )) }),
        planningMode === "sunday" && /* @__PURE__ */ jsx("div", { className: "flex bg-slate-100 p-0.5 rounded-lg border border-slate-200", children: ["sacrament", "second-hour"].map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setActiveTab(tab),
            className: `px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-white text-primary shadow-sm" : "text-slate-400"}`,
            children: tab === "sacrament" ? "Sacrament" : "2nd Hour"
          },
          tab
        )) }),
        planningMode === "activity" && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 bg-secondary/10 rounded-lg border border-secondary/20", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3 text-secondary" }),
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-secondary", children: "Activity Engine" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200 group relative", children: [
            /* @__PURE__ */ jsx(Calendar, { className: `h-3.5 w-3.5 ${planningMode === "sunday" ? "text-primary" : "text-slate-400"}` }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "date",
                value: agenda.date,
                onChange: (e) => setAgenda((p) => ({ ...p, date: planningMode === "sunday" ? snapToSunday(e.target.value) : e.target.value })),
                className: "bg-transparent border-none outline-none text-[10px] font-black text-slate-600 p-0"
              }
            ),
            planningMode === "sunday" && /* @__PURE__ */ jsx("div", { className: "absolute top-full left-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10", children: /* @__PURE__ */ jsx("div", { className: "bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow whitespace-nowrap", children: "Sundays Only" }) })
          ] }),
          planningMode === "activity" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-primary" }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-slate-400", children: "Start" }),
              /* @__PURE__ */ jsx("input", { type: "time", value: agenda.data.activity?.time || "19:00", onChange: (e) => updateData("activity", "time", e.target.value), className: "bg-transparent border-none outline-none text-[10px] font-black text-slate-600 p-0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200", children: [
              /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-secondary" }),
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-slate-400", children: "End" }),
              /* @__PURE__ */ jsx("input", { type: "time", value: agenda.data.activity?.endTime || "21:00", onChange: (e) => updateData("activity", "endTime", e.target.value), className: "bg-transparent border-none outline-none text-[10px] font-black text-slate-600 p-0" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxs("button", { onClick: () => setShowTemplates(!showTemplates), className: "flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-widest border border-primary/20", children: [
              /* @__PURE__ */ jsx(LayoutGrid, { className: "h-3.5 w-3.5" }),
              " Templates"
            ] }),
            showTemplates && /* @__PURE__ */ jsx("div", { className: "absolute top-full right-0 mt-2 w-68 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-[110] min-w-[260px]", children: /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
              (planningMode === "sunday" ? templates : activeActivityTemplates).map((t) => /* @__PURE__ */ jsxs(
                "button",
                {
                  onClick: () => applyTemplate(t),
                  className: "w-full p-3 bg-slate-50 rounded-xl border border-slate-200 text-left hover:border-primary/40 hover:bg-primary/5 transition-all",
                  children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-primary block", children: t.name }),
                    /* @__PURE__ */ jsx("span", { className: "text-[9px] text-slate-400 line-clamp-1", children: t.description })
                  ]
                },
                t.$id || t.id
              )),
              (planningMode === "sunday" ? templates : activeActivityTemplates).length === 0 && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 text-center py-3", children: "No templates found" })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(AnimatePresence, { children: showUndo && /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 40 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 40 },
        className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 bg-primary text-white px-6 py-3.5 rounded-2xl shadow-2xl",
        children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm font-bold", children: [
            "Removed: ",
            lastDeletedBlock?.block?.label
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: undoDelete, className: "bg-white text-primary px-4 py-1.5 rounded-xl text-[10px] font-black uppercase", children: "Undo" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "w-52 flex-shrink-0 border-r border-slate-200 bg-white/60 overflow-y-auto flex flex-col p-3 gap-1", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase tracking-widest text-slate-400 px-2 pt-1 pb-2", children: "Navigation" }),
        planningMode === "sunday" ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("sacrament"), className: `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${activeTab === "sacrament" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`, children: [
            /* @__PURE__ */ jsx(Church, { className: "h-4 w-4 flex-shrink-0" }),
            " Sacrament"
          ] }),
          /* @__PURE__ */ jsxs("button", { onClick: () => setActiveTab("second-hour"), className: `w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all ${activeTab === "second-hour" ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"}`, children: [
            /* @__PURE__ */ jsx(Users, { className: "h-4 w-4 flex-shrink-0" }),
            " 2nd Hour"
          ] })
        ] }) : /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[11px] font-bold bg-secondary text-white", children: [
          /* @__PURE__ */ jsx(Zap, { className: "h-4 w-4 flex-shrink-0" }),
          " Activity"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-200 mt-3 pt-3 space-y-1.5", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase tracking-widest text-slate-400 px-2 pb-1", children: "Quick Stats" }),
          planningMode === "sunday" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-white rounded-xl border border-slate-200 space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase text-slate-400", children: "Start / End" }),
              /* @__PURE__ */ jsxs("p", { className: "font-black text-primary text-sm", children: [
                agenda.data.timing?.start || "10:00 AM",
                " â€“ ",
                agenda.data.timing?.end || "12:00 PM"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-white rounded-xl border border-slate-200 space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase text-slate-400", children: "Program Blocks" }),
              /* @__PURE__ */ jsxs("p", { className: "font-black text-primary text-sm", children: [
                agenda.data.program.blocks.length,
                " items"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-white rounded-xl border border-slate-200 space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase text-slate-400", children: "Est. Duration" }),
              /* @__PURE__ */ jsxs("p", { className: "font-black text-primary text-sm", children: [
                agenda.data.program.blocks.reduce((a, b) => a + (b.duration || 0), 0),
                " min"
              ] })
            ] })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-white rounded-xl border border-slate-200 space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase text-slate-400", children: "Total Duration" }),
              /* @__PURE__ */ jsxs("p", { className: "font-black text-secondary text-sm", children: [
                agenda.data.activity?.program?.blocks?.reduce((a, b) => a + (b.duration || 0), 0),
                " min"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-white rounded-xl border border-slate-200 space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase text-slate-400", children: "Stages" }),
              /* @__PURE__ */ jsxs("p", { className: "font-black text-secondary text-sm", children: [
                agenda.data.activity?.program?.blocks?.length || 0,
                " items"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "px-3 py-2 bg-white rounded-xl border border-slate-200 space-y-0.5", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase text-slate-400", children: "Assignments" }),
              /* @__PURE__ */ jsxs("p", { className: "font-black text-secondary text-sm", children: [
                agenda.data.activity?.assignments?.length || 0,
                " tasks"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "mt-auto pt-3 border-t border-slate-200", children: /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => setAgenda(initialAgendaState),
            className: "w-full flex items-center justify-center gap-2 py-2 text-red-300 hover:text-red-500 transition-all rounded-xl hover:bg-red-50 text-[9px] font-black uppercase tracking-widest",
            children: [
              /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }),
              " Reset"
            ]
          }
        ) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto", children: /* @__PURE__ */ jsx("div", { className: "p-6 max-w-5xl", children: activeTab === "sacrament" ? /* @__PURE__ */ jsx(SacramentFlow, { agenda, updateData, updateBlock, moveBlock, removeBlock, addBlock, searchHymns, hymnSuggestions, activeSearchField, selectHymn, activeBook, setActiveBook, setActiveSearchField }) : activeTab === "second-hour" ? /* @__PURE__ */ jsx(SecondHourFlow, { agenda, updateClass }) : /* @__PURE__ */ jsx(ActivityFlow, { agenda, updateData, updateBlock, removeBlock, moveBlock, addBlock, addAssignment, updateAssignment, removeAssignment }) }) }),
      /* @__PURE__ */ jsx("div", { className: "w-64 flex-shrink-0 border-l border-slate-200 bg-white/60 overflow-y-auto p-4 space-y-4", children: planningMode === "sunday" ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase tracking-widest text-slate-400", children: "Meeting Times" }),
            /* @__PURE__ */ jsx("button", { onClick: () => setEditingTiming(!editingTiming), className: "text-[9px] font-black uppercase text-primary px-2 py-0.5 rounded-lg border border-primary/20 hover:bg-primary/5", children: editingTiming ? "Done" : "Edit" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2.5 rounded-xl border border-slate-200", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[7px] font-black uppercase text-slate-400 mb-1", children: "Start" }),
              editingTiming ? /* @__PURE__ */ jsx("input", { type: "text", value: agenda.data.timing?.start, onChange: (e) => updateData("timing", "start", e.target.value), className: "w-full bg-transparent border-none p-0 font-black text-primary text-sm focus:ring-0" }) : /* @__PURE__ */ jsx("p", { className: "font-black text-primary text-sm", children: agenda.data.timing?.start || "10:00 AM" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2.5 rounded-xl border border-slate-200", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[7px] font-black uppercase text-slate-400 mb-1", children: "End" }),
              editingTiming ? /* @__PURE__ */ jsx("input", { type: "text", value: agenda.data.timing?.end, onChange: (e) => updateData("timing", "end", e.target.value), className: "w-full bg-transparent border-none p-0 font-black text-primary text-sm focus:ring-0" }) : /* @__PURE__ */ jsx("p", { className: "font-black text-primary text-sm", children: agenda.data.timing?.end || "12:00 PM" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2", children: "Program Timeline" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-0.5", children: [
            agenda.data.program.blocks.map((block) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-white/80 transition-all", children: [
              /* @__PURE__ */ jsx("div", { className: `h-2 w-2 rounded-full flex-shrink-0 ${block.type === "hymn" ? "bg-primary" : block.type === "sacrament" ? "bg-secondary" : block.type === "prayer" ? "bg-emerald-500" : "bg-slate-300"}` }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-600 font-medium flex-1 truncate", children: block.label }),
              /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-black text-slate-400", children: [
                block.duration,
                "m"
              ] })
            ] }, block.id)),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 pt-2 border-t border-slate-200 flex justify-between px-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-slate-400", children: "Total" }),
              /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-black text-primary", children: [
                agenda.data.program.blocks.reduce((a, b) => a + (b.duration || 0), 0),
                " min"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-slate-200 pt-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2", children: "Attendance" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2.5 rounded-xl border border-slate-200", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[7px] font-black uppercase text-slate-400 mb-1", children: "Before" }),
              /* @__PURE__ */ jsx("input", { type: "number", value: agenda.data.attendance?.beforeSacrament || "", onChange: (e) => updateData("attendance", "beforeSacrament", e.target.value), className: "w-full bg-transparent border-none p-0 font-black text-primary text-xl focus:ring-0", placeholder: "0" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "bg-white p-2.5 rounded-xl border border-slate-200", children: [
              /* @__PURE__ */ jsx("p", { className: "text-[7px] font-black uppercase text-slate-400 mb-1", children: "After" }),
              /* @__PURE__ */ jsx("input", { type: "number", value: agenda.data.attendance?.afterSacrament || "", onChange: (e) => updateData("attendance", "afterSacrament", e.target.value), className: "w-full bg-transparent border-none p-0 font-black text-primary text-xl focus:ring-0", placeholder: "0" })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("p", { className: "text-[8px] font-black uppercase tracking-widest text-slate-400", children: "Activity Timeline" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-1.5", children: [
          (agenda.data.activity?.program?.blocks || []).map((block) => /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 py-2 px-2.5 bg-white rounded-xl border border-slate-200", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col flex-shrink-0 w-16", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black text-secondary leading-tight", children: block.time }),
              /* @__PURE__ */ jsxs("span", { className: "text-[7px] text-slate-400", children: [
                "â†’ ",
                block.endTime
              ] })
            ] }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-600 font-medium flex-1 truncate leading-tight", children: block.label }),
            /* @__PURE__ */ jsxs("span", { className: "text-[9px] font-black text-slate-400 flex-shrink-0", children: [
              block.duration,
              "m"
            ] })
          ] }, block.id)),
          (agenda.data.activity?.program?.blocks || []).length === 0 && /* @__PURE__ */ jsx("p", { className: "text-[10px] text-slate-400 text-center py-4", children: "No stages added yet" })
        ] })
      ] }) })
    ] })
  ] });
}
function Section({ title, icon: Icon, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white/40 p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-primary p-3 rounded-2xl text-white", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-primary tracking-tight", children: title })
    ] }),
    children
  ] });
}
function ModernInput({ label, placeholder, icon: Icon, value, onChange, onFocus, type = "text" }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsx("input", { type, value: value || "", onChange: (e) => onChange(e.target.value), onFocus, placeholder, className: "w-full bg-white/50 border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all font-medium text-primary" }),
      Icon && /* @__PURE__ */ jsx(Icon, { className: "absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary opacity-50" })
    ] })
  ] });
}
function SacramentFlow({ agenda, updateData, searchHymns, hymnSuggestions, activeSearchField, selectHymn, activeBook, setActiveBook, setActiveSearchField, updateBlock, moveBlock, removeBlock, addBlock }) {
  const [newCustomLabel, setNewCustomLabel] = useState("");
  return /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
    /* @__PURE__ */ jsx(Section, { title: "Leadership & Music", icon: Users, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsx(ModernInput, { label: "Presiding", value: agenda.data.leadership.presiding, onChange: (val) => updateData("leadership", "presiding", val) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Conducting", value: agenda.data.leadership.conducting, onChange: (val) => updateData("leadership", "conducting", val) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Organist", value: agenda.data.leadership.organist, onChange: (val) => updateData("leadership", "organist", val) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Chorister", value: agenda.data.leadership.chorister, onChange: (val) => updateData("leadership", "chorister", val) })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Meeting Program", icon: Book, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1", children: "Announcements" }),
        /* @__PURE__ */ jsx("textarea", { className: "w-full bg-white/50 border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all min-h-[120px]", value: agenda.data.program.announcements || "", onChange: (e) => updateData("program", "announcements", e.target.value) })
      ] }),
      agenda.data.program.blocks.map((block, i) => /* @__PURE__ */ jsxs("div", { className: "group relative flex items-start gap-4 bg-white p-6 rounded-[2rem] border border-outline-variant/20 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 space-y-4", children: [
          block.type === "hymn" ? /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(ModernInput, { label: block.label, value: block.value, onFocus: () => setActiveSearchField(block.id), onChange: (val) => {
              updateBlock(block.id, val);
              searchHymns(val, block.id);
            }, icon: Sparkles }),
            activeSearchField === block.id && hymnSuggestions.length > 0 && /* @__PURE__ */ jsxs("div", { className: "absolute z-[120] w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden", children: [
              /* @__PURE__ */ jsx("div", { className: "flex p-2 bg-surface-container-low border-b border-outline-variant/10", children: ["hymns", "childrens_songbook", "new_hymns"].map((book) => /* @__PURE__ */ jsx("button", { onClick: () => setActiveBook(book), className: `flex-1 px-3 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest ${activeBook === book ? "bg-primary text-white" : "text-on-surface-variant"}`, children: book.replace("_", " ") }, book)) }),
              hymnSuggestions.map((h) => /* @__PURE__ */ jsxs("button", { onClick: () => selectHymn(h, "block", block.id), className: "w-full px-6 py-4 text-left hover:bg-primary/5 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between", children: [
                /* @__PURE__ */ jsx("span", { children: h.title }),
                /* @__PURE__ */ jsxs("span", { className: "text-secondary font-black", children: [
                  "#",
                  h.number
                ] })
              ] }, h.$id))
            ] })
          ] }) : block.type === "sacrament" ? /* @__PURE__ */ jsx("div", { className: "py-8 text-center bg-primary/5 rounded-2xl border border-dashed border-primary/20", children: /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-primary uppercase tracking-widest", children: "Administration of the Sacrament" }) }) : /* @__PURE__ */ jsx(ModernInput, { label: block.label, value: block.value, onChange: (val) => updateBlock(block.id, val) }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 bg-surface-container-low/50 p-4 rounded-xl border border-outline-variant/10", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-primary/40" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60", children: "Duration (min):" }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              [5, 10, 15].map((mins) => /* @__PURE__ */ jsxs("button", { onClick: () => updateBlock(block.id, mins, "duration"), className: `px-4 py-1.5 rounded-lg text-[10px] font-black ${block.duration === mins ? "bg-primary text-white shadow-lg" : "bg-white text-on-surface-variant/40"}`, children: [
                mins,
                "m"
              ] }, mins)),
              /* @__PURE__ */ jsx("input", { type: "number", value: block.duration || "", onChange: (e) => updateBlock(block.id, parseInt(e.target.value) || 0, "duration"), className: "w-16 bg-white rounded-lg border border-outline-variant/10 text-center text-[10px] font-black text-primary outline-none px-2 py-1" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => moveBlock(i, "up"), disabled: i === 0, className: "p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl disabled:opacity-20", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 rotate-90" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => removeBlock(i), className: "p-2 text-error hover:bg-error/10 rounded-xl", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => moveBlock(i, "down"), disabled: i === agenda.data.program.blocks.length - 1, className: "p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl disabled:opacity-20", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 -rotate-90" }) })
        ] })
      ] }, block.id)),
      /* @__PURE__ */ jsxs("div", { className: "pt-8 border-t border-outline-variant/10 flex gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(ModernInput, { label: "Add Program Item", value: newCustomLabel, onChange: setNewCustomLabel }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          if (newCustomLabel) {
            addBlock("custom", newCustomLabel);
            setNewCustomLabel("");
          }
        }, className: "bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-6", children: "Add Block" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Attendance Tracker", icon: Users, children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsx(ModernInput, { label: "Before Sacrament", type: "number", value: agenda.data.attendance.beforeSacrament, onChange: (val) => updateData("attendance", "beforeSacrament", val) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "After Sacrament", type: "number", value: agenda.data.attendance.afterSacrament, onChange: (val) => updateData("attendance", "afterSacrament", val) })
    ] }) })
  ] });
}
function SecondHourFlow({ agenda, updateClass }) {
  const isAuto = agenda.data.secondHour?.override === "auto" || !agenda.data.secondHour?.override;
  const isNew = agenda.data.secondHour?.override === "new" || isAuto && isNewSchedule(agenda.date);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-white/50 p-6 rounded-[2rem] border border-outline-variant/30 flex justify-between items-center", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: "Schedule Format" }),
      /* @__PURE__ */ jsx("div", { className: "flex bg-white p-1 rounded-xl border border-outline-variant/20", children: ["auto", "legacy", "new"].map((mode) => /* @__PURE__ */ jsx("button", { onClick: () => updateClass("config", null, "override", mode), className: `px-4 py-2 rounded-lg text-xs font-black ${agenda.data.secondHour?.override === mode || !agenda.data.secondHour?.override && mode === "auto" ? "bg-secondary text-on-secondary shadow-md" : "text-on-surface-variant"}`, children: mode === "auto" ? "Auto" : mode === "legacy" ? "Legacy" : "2026 Format" }, mode)) })
    ] }),
    !isNew ? /* @__PURE__ */ jsx(Section, { title: "Second Hour Classes", icon: Users, children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: agenda.data.classes?.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: cls.name }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(ModernInput, { label: "Teacher", value: cls.teacher, onChange: (val) => updateClass("legacy", i, "teacher", val) }),
        /* @__PURE__ */ jsx(ModernInput, { label: "Topic", value: cls.topic, onChange: (val) => updateClass("legacy", i, "topic", val) })
      ] })
    ] }, i)) }) }) : /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
      /* @__PURE__ */ jsx(Section, { title: "Block 1: Sunday School", icon: Book, children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: agenda.data.secondHour.block1.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: cls.name }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(ModernInput, { label: "Teacher", value: cls.teacher, onChange: (val) => updateClass("block1", i, "teacher", val) }),
          /* @__PURE__ */ jsx(ModernInput, { label: "Topic", value: cls.topic, onChange: (val) => updateClass("block1", i, "topic", val) })
        ] })
      ] }, i)) }) }),
      /* @__PURE__ */ jsx(Section, { title: "Block 2: Quorums & Relief Society", icon: Users, children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: agenda.data.secondHour.block2.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: cls.name }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(ModernInput, { label: "Teacher", value: cls.teacher, onChange: (val) => updateClass("block2", i, "teacher", val) }),
          /* @__PURE__ */ jsx(ModernInput, { label: "Topic", value: cls.topic, onChange: (val) => updateClass("block2", i, "topic", val) })
        ] })
      ] }, i)) }) }),
      /* @__PURE__ */ jsx(Section, { title: "Primary", icon: Sparkles, children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(ModernInput, { label: "Lead", value: agenda.data.secondHour.primary.teacher, onChange: (val) => updateClass("primary", null, "teacher", val) }),
        /* @__PURE__ */ jsx(ModernInput, { label: "Focus", value: agenda.data.secondHour.primary.topic, onChange: (val) => updateClass("primary", null, "topic", val) })
      ] }) })
    ] })
  ] });
}
function ActivityFlow({ agenda, updateData, updateBlock, removeBlock, moveBlock, addBlock, addAssignment, updateAssignment, removeAssignment }) {
  const [newCustomLabel, setNewCustomLabel] = useState("");
  const blocks = agenda.data.activity?.program?.blocks || [];
  const activityStartTime = agenda.data.activity?.time || "19:00";
  const startTimeFormatted = formatTime(activityStartTime);
  const totalDuration = blocks.reduce((acc, b) => acc + (b.duration || 0), 0);
  const finalEndTime = addMinutes(startTimeFormatted, totalDuration);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-10", children: [
    /* @__PURE__ */ jsx(Section, { title: "Ward Activity Details", icon: Calendar, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsx(ModernInput, { label: "Activity Name", value: agenda.data.activity?.name || "", onChange: (val) => updateData("activity", "name", val) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Location", value: agenda.data.activity?.location || "", onChange: (val) => updateData("activity", "location", val) }),
      /* @__PURE__ */ jsxs("div", { className: "md:col-span-2 space-y-2.5", children: [
        /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1", children: "Description" }),
        /* @__PURE__ */ jsx("textarea", { className: "w-full bg-white/50 border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary transition-all min-h-[120px]", value: agenda.data.activity?.description || "", onChange: (e) => updateData("activity", "description", e.target.value) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Activity Program", icon: Clock, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-8 py-5 bg-primary/5 rounded-[2rem] border border-primary/10 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-primary/40", children: "Duration" }),
            /* @__PURE__ */ jsxs("span", { className: "text-lg font-black text-primary", children: [
              totalDuration,
              " min"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-primary/40", children: "Expected End" }),
            /* @__PURE__ */ jsx("span", { className: "text-lg font-black text-primary", children: finalEndTime })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-4 py-2 bg-white rounded-xl border border-primary/10 text-[10px] font-black uppercase text-primary/60", children: [
          "Starts at ",
          startTimeFormatted
        ] })
      ] }),
      blocks.map((block, i) => /* @__PURE__ */ jsxs("div", { className: "relative flex flex-col gap-4 bg-white p-6 rounded-[2.5rem] border border-outline-variant/20 shadow-sm group", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center gap-6", children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-4 bg-primary/5 px-6 py-4 rounded-2xl border border-primary/10 shrink-0", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[8px] font-black uppercase text-primary/40 tracking-widest", children: "Time" }),
            /* @__PURE__ */ jsxs("span", { className: "text-xs font-black text-primary whitespace-nowrap", children: [
              block.time,
              " - ",
              block.endTime
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(ModernInput, { label: block.label, value: block.value, onChange: (val) => updateBlock(block.id, val) }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsx("button", { onClick: () => moveBlock(i, "up"), disabled: i === 0, className: "p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl disabled:opacity-20", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 rotate-90" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => removeBlock(i), className: "p-2 text-error hover:bg-error/10 rounded-xl", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { onClick: () => moveBlock(i, "down"), disabled: i === blocks.length - 1, className: "p-2 text-on-surface-variant hover:bg-surface-container-high rounded-xl disabled:opacity-20", children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4 -rotate-90" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-3 pt-4 border-t border-outline-variant/5", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-on-surface-variant/20" }),
          /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 mr-2", children: "Set Duration:" }),
          [5, 10, 15, 30, 45, 60].map((mins) => /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => updateBlock(block.id, mins, "duration"),
              className: `px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${block.duration === mins ? "bg-secondary text-white shadow-lg" : "bg-surface-container-low text-on-surface-variant/40 hover:bg-white"}`,
              children: [
                mins,
                "m"
              ]
            },
            mins
          )),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 ml-auto", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[9px] font-black uppercase text-on-surface-variant/20", children: "Custom:" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "number",
                value: block.duration || "",
                onChange: (e) => updateBlock(block.id, parseInt(e.target.value) || 0, "duration"),
                className: "w-16 bg-surface-container-low border border-outline-variant/10 rounded-lg px-2 py-1 text-[10px] font-black text-center text-primary"
              }
            )
          ] })
        ] })
      ] }, block.id)),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-outline-variant/10 flex gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx(ModernInput, { label: "Add Stage", value: newCustomLabel, onChange: setNewCustomLabel }) }),
        /* @__PURE__ */ jsx("button", { onClick: () => {
          if (newCustomLabel) {
            addBlock("activity_item", newCustomLabel);
            setNewCustomLabel("");
          }
        }, className: "bg-primary text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest mt-6", children: "Add" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Activity Assignments", icon: ClipboardList, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
      agenda.data.activity.assignments.map((a) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-12 gap-3 items-end bg-white p-4 rounded-2xl border border-outline-variant/10 shadow-sm", children: [
        /* @__PURE__ */ jsx("div", { className: "md:col-span-5", children: /* @__PURE__ */ jsx(ModernInput, { label: "Task", value: a.task, onChange: (val) => updateAssignment(a.id, "task", val) }) }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-4", children: /* @__PURE__ */ jsx(ModernInput, { label: "Person", value: a.person, onChange: (val) => updateAssignment(a.id, "person", val) }) }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-2", children: /* @__PURE__ */ jsxs("select", { value: a.status, onChange: (e) => updateAssignment(a.id, "status", e.target.value), className: "w-full bg-white border border-outline-variant/40 px-4 py-4 rounded-2xl text-xs font-bold text-primary appearance-none", children: [
          /* @__PURE__ */ jsx("option", { value: "pending", children: "Pending" }),
          /* @__PURE__ */ jsx("option", { value: "confirmed", children: "Confirmed" }),
          /* @__PURE__ */ jsx("option", { value: "completed", children: "Completed" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "md:col-span-1 flex justify-end pb-1", children: /* @__PURE__ */ jsx("button", { onClick: () => removeAssignment(a.id), className: "p-3 text-error hover:bg-error/10 rounded-xl", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) }) })
      ] }, a.id)),
      /* @__PURE__ */ jsxs("button", { onClick: addAssignment, className: "w-full py-4 border-2 border-dashed border-outline-variant/40 rounded-2xl text-on-surface-variant/40 hover:text-primary hover:border-primary/40 transition-all flex items-center justify-center gap-2", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-4 w-4" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "Add Assignment" })
      ] })
    ] }) })
  ] });
}

const $$Sunday = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sunday Architect" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SundayArchitectComponent", SundayArchitect, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/pages/SundayArchitect", "client:component-export": "SundayArchitect" })} ` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/plan/sunday.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/plan/sunday.astro";
const $$url = "/plan/sunday";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sunday,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
