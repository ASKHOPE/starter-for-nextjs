import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_yjx_LAnn.mjs';
import { $ as $$Layout } from './Layout_6wALqu6j.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Loader2, Calendar, Save, Users, Clock, MapPin, Music, Sparkles, Plus, Book } from 'lucide-react';
import { useState, useEffect } from 'react';
import { a as actions } from './server_B_Pg_n71.mjs';

const NEW_SCHEDULE_DATE = /* @__PURE__ */ new Date("2026-09-06");
const isNewSchedule = (dateStr) => {
  return new Date(dateStr) >= NEW_SCHEDULE_DATE;
};
function SundayArchitect() {
  const [activeTab, setActiveTab] = useState("sacrament");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [agenda, setAgenda] = useState(() => {
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    return {
      id: "",
      title: "Sunday Sacrament Service",
      date: today,
      type: "sacrament",
      status: "draft",
      data: {
        leadership: { presiding: "", conducting: "", organist: "", chorister: "" },
        program: { openingHymn: "", sacramentHymn: "", intermediateHymn: "", closingHymn: "", items: [] },
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
          override: "auto"
        },
        classes: [
          { name: "Relief Society / Elders Quorum", teacher: "", topic: "" },
          { name: "Sunday School", teacher: "", topic: "" }
        ],
        attendance: { total: "" }
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
          if (migratedData.classes.length === 0) {
            migratedData.classes = [
              { name: "Relief Society / Elders Quorum", teacher: "", topic: "" },
              { name: "Sunday School", teacher: "", topic: "" }
            ];
          }
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
  const [hymnSuggestions, setHymnSuggestions] = useState([]);
  const [activeSearchField, setActiveSearchField] = useState(null);
  const [activeBook, setActiveBook] = useState("hymns");
  const searchHymns = async (query, field) => {
    setActiveSearchField(field);
    if (query.length < 2) {
      setHymnSuggestions([]);
      return;
    }
    const { data } = await actions.getLibraryItems({ collection: activeBook, search: query });
    if (data?.success) {
      setHymnSuggestions(data.items);
    }
  };
  const selectHymn = (hymn, section, field) => {
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
        setAgenda((prev) => ({ ...prev, id: data.agenda.$id }));
      }
    } else {
      alert("Failed to save agenda: " + (error?.message || "Unknown error"));
    }
    setSaving(false);
  };
  const updateData = (section, field, value) => {
    setAgenda((prev) => ({
      ...prev,
      data: {
        ...prev.data,
        [section]: {
          ...prev.data[section],
          [field]: value
        }
      }
    }));
  };
  const updateClass = (block, index, field, value) => {
    setAgenda((prev) => {
      const newData = { ...prev.data };
      if (block === "legacy") {
        newData.classes[index] = { ...newData.classes[index], [field]: value };
      } else if (block === "config") {
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
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 animate-spin text-primary mb-4" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-bold", children: "Loading..." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "pb-32 space-y-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center text-center gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-primary tracking-tight", children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: agenda.title,
            onChange: (e) => setAgenda((prev) => ({ ...prev, title: e.target.value })),
            className: "bg-transparent border-none outline-none focus:ring-0 w-full text-center"
          }
        ) }),
        /* @__PURE__ */ jsxs("p", { className: "text-on-surface-variant font-medium flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "date",
              value: agenda.date,
              onChange: (e) => setAgenda((prev) => ({ ...prev, date: e.target.value })),
              className: "bg-transparent border-none outline-none focus:ring-0 text-sm font-bold text-center"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => window.open(`/preview/agenda?id=${agenda.id}`, "_blank"),
            className: "flex-1 md:flex-none bg-surface-container-low border border-outline-variant/30 px-6 py-3 rounded-2xl font-bold text-primary hover:bg-surface-variant transition-all",
            children: "Preview"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleSave,
            disabled: saving,
            className: "flex-1 md:flex-none bg-secondary text-on-secondary px-8 py-3 rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2 disabled:opacity-50",
            children: [
              saving ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsx(Save, { className: "h-5 w-5" }),
              saving ? "Saving..." : "Save Program"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "bg-surface-container-lowest p-1.5 rounded-[2rem] border border-outline-variant/20 shadow-sm flex max-w-md mx-auto md:mx-0", children: [
      { id: "sacrament", label: "Sacrament", icon: ChurchIcon },
      { id: "second-hour", label: "2nd Hour", icon: Users }
    ].map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `flex flex-1 items-center justify-center gap-2 py-4 rounded-[1.75rem] text-sm font-black transition-all ${activeTab === tab.id ? "bg-primary text-white shadow-lg" : "text-on-surface-variant hover:text-primary"}`,
        children: [
          /* @__PURE__ */ jsx(tab.icon, { className: "h-4 w-4" }),
          tab.label
        ]
      },
      tab.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-8 space-y-8", children: activeTab === "sacrament" ? /* @__PURE__ */ jsx(
        SacramentFlow,
        {
          agenda,
          updateData,
          searchHymns,
          hymnSuggestions,
          activeSearchField,
          selectHymn,
          activeBook,
          setActiveBook
        }
      ) : /* @__PURE__ */ jsx(SecondHourFlow, { agenda, updateClass }) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 space-y-6 lg:sticky lg:top-24", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/20 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-primary uppercase tracking-widest text-xs", children: "Service Timing" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100", children: [
            /* @__PURE__ */ jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-tighter", children: "Live Preview" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(TimeItem, { label: "Start Service", time: "10:00 AM" }),
          agenda.data.secondHour?.override === "new" || agenda.data.secondHour?.override === "auto" && isNewSchedule(agenda.date) ? /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 px-4 py-1 bg-secondary/5 border border-secondary/10 border-dashed rounded-xl", children: [
            /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3 text-secondary" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-secondary uppercase tracking-widest", children: "Transitions Included" })
          ] }) }) : null,
          /* @__PURE__ */ jsx(TimeItem, { label: "End Service", time: "12:00 PM" })
        ] }),
        /* @__PURE__ */ jsx("hr", { className: "border-outline-variant/20" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 text-sm text-on-surface-variant", children: [
          /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { children: "Main Chapel • East Wing" })
        ] })
      ] }) })
    ] })
  ] });
}
function TimeItem({ label, time }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-outline-variant/10", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-bold text-on-surface-variant uppercase tracking-wider", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-black text-primary", children: time })
  ] });
}
function ChurchIcon(props) {
  return /* @__PURE__ */ jsxs("svg", { ...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("path", { d: "m18 7 4 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9l4-2" }),
    /* @__PURE__ */ jsx("path", { d: "M14 22v-4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v4" }),
    /* @__PURE__ */ jsx("path", { d: "M18 22V5l-6-3-6 3v17" }),
    /* @__PURE__ */ jsx("path", { d: "M12 7v5" }),
    /* @__PURE__ */ jsx("path", { d: "M10 9h4" })
  ] });
}
function SacramentFlow({ agenda, updateData, searchHymns, hymnSuggestions, activeSearchField, selectHymn, activeBook, setActiveBook }) {
  return /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: [
    /* @__PURE__ */ jsx(Section, { title: "Leadership & Music", icon: Users, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(ModernInput, { label: "Presiding", placeholder: "Bishop Smith", value: agenda.data.leadership.presiding, onChange: (val) => updateData("leadership", "presiding", val) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Conducting", placeholder: "Brother Jones", value: agenda.data.leadership.conducting, onChange: (val) => updateData("leadership", "conducting", val) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Organist", placeholder: "Sister Miller", value: agenda.data.leadership.organist, onChange: (val) => updateData("leadership", "organist", val) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Chorister", placeholder: "Brother Wilson", value: agenda.data.leadership.chorister, onChange: (val) => updateData("leadership", "chorister", val) })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Sacred Program", icon: Music, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2 p-1 bg-surface-container-low rounded-2xl border border-outline-variant/10", children: [
        { id: "hymns", label: "Hymns" },
        { id: "childrens_songbook", label: "Children" },
        { id: "new_hymns", label: "New Hymns" },
        { id: "youth_music", label: "Youth" }
      ].map((book) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setActiveBook(book.id),
          className: `flex-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeBook === book.id ? "bg-primary text-white shadow-lg" : "text-on-surface-variant hover:bg-white"}`,
          children: book.label
        },
        book.id
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(ModernInput, { label: "Opening Hymn", placeholder: `Search in ${activeBook.replace("_", " ")}...`, icon: Sparkles, value: agenda.data.program.openingHymn, onChange: (val) => {
          updateData("program", "openingHymn", val);
          searchHymns(val, "openingHymn");
        } }),
        activeSearchField === "openingHymn" && hymnSuggestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden", children: hymnSuggestions.map((h) => /* @__PURE__ */ jsxs("button", { onClick: () => selectHymn(h, "program", "openingHymn"), className: "w-full px-6 py-4 text-left hover:bg-secondary/10 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: h.title }),
          /* @__PURE__ */ jsxs("span", { className: "text-secondary font-black", children: [
            "#",
            h.number
          ] })
        ] }, h.$id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(ModernInput, { label: "Sacrament Hymn", placeholder: `Search in ${activeBook.replace("_", " ")}...`, value: agenda.data.program.sacramentHymn, onChange: (val) => {
          updateData("program", "sacramentHymn", val);
          searchHymns(val, "sacramentHymn");
        } }),
        activeSearchField === "sacramentHymn" && hymnSuggestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden", children: hymnSuggestions.map((h) => /* @__PURE__ */ jsxs("button", { onClick: () => selectHymn(h, "program", "sacramentHymn"), className: "w-full px-6 py-4 text-left hover:bg-secondary/10 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: h.title }),
          /* @__PURE__ */ jsxs("span", { className: "text-secondary font-black", children: [
            "#",
            h.number
          ] })
        ] }, h.$id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(ModernInput, { label: "Intermediate Hymn / Special Music", placeholder: `Search in ${activeBook.replace("_", " ")}...`, value: agenda.data.program.intermediateHymn, onChange: (val) => {
          updateData("program", "intermediateHymn", val);
          searchHymns(val, "intermediateHymn");
        } }),
        activeSearchField === "intermediateHymn" && hymnSuggestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden", children: hymnSuggestions.map((h) => /* @__PURE__ */ jsxs("button", { onClick: () => selectHymn(h, "program", "intermediateHymn"), className: "w-full px-6 py-4 text-left hover:bg-secondary/10 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: h.title }),
          /* @__PURE__ */ jsxs("span", { className: "text-secondary font-black", children: [
            "#",
            h.number
          ] })
        ] }, h.$id)) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "bg-secondary/5 p-6 rounded-3xl border border-secondary/20 border-dashed", children: /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 text-secondary font-bold w-full justify-center", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5" }),
        "Add Program Item (Talk, Musical Number)"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(ModernInput, { label: "Closing Hymn", placeholder: `Search in ${activeBook.replace("_", " ")}...`, value: agenda.data.program.closingHymn, onChange: (val) => {
          updateData("program", "closingHymn", val);
          searchHymns(val, "closingHymn");
        } }),
        activeSearchField === "closingHymn" && hymnSuggestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden", children: hymnSuggestions.map((h) => /* @__PURE__ */ jsxs("button", { onClick: () => selectHymn(h, "program", "closingHymn"), className: "w-full px-6 py-4 text-left hover:bg-secondary/10 font-medium text-primary border-b border-outline-variant/10 last:border-0 flex justify-between", children: [
          /* @__PURE__ */ jsx("span", { children: h.title }),
          /* @__PURE__ */ jsxs("span", { className: "text-secondary font-black", children: [
            "#",
            h.number
          ] })
        ] }, h.$id)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Attendance Tracker", icon: Users, children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-6 rounded-3xl border border-outline-variant/10 space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "text-xs text-on-surface-variant font-medium", children: "Track total attendance for this specific service." }),
      /* @__PURE__ */ jsx(
        ModernInput,
        {
          label: "Total Attendance",
          placeholder: "0",
          type: "number",
          value: agenda.data.attendance?.total,
          onChange: (val) => updateData("attendance", "total", val)
        }
      )
    ] }) })
  ] });
}
function SecondHourFlow({ agenda, updateClass }) {
  const isAuto = agenda.data.secondHour?.override === "auto" || !agenda.data.secondHour?.override;
  const isNew = agenda.data.secondHour?.override === "new" || isAuto && isNewSchedule(agenda.date);
  return /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: "Schedule Format" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-on-surface-variant", children: "Choose the Sunday schedule structure for this agenda." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex bg-white p-1 rounded-xl border border-outline-variant/20 shadow-inner", children: [
        { id: "auto", label: "Auto (Date)" },
        { id: "legacy", label: "Legacy" },
        { id: "new", label: "2026 Format" }
      ].map((mode) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => updateClass("config", null, "override", mode.id),
          className: `px-4 py-2 rounded-lg text-xs font-black transition-all ${agenda.data.secondHour?.override === mode.id || !agenda.data.secondHour?.override && mode.id === "auto" ? "bg-secondary text-on-secondary shadow-md" : "text-on-surface-variant hover:text-secondary"}`,
          children: mode.label
        },
        mode.id
      )) })
    ] }),
    !isNew ? /* @__PURE__ */ jsx(Section, { title: "Second Hour Classes", icon: Users, children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: agenda.data.classes?.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 pb-2 border-b border-outline-variant/10", children: /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: cls.name }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsx(ModernInput, { label: "Teacher", placeholder: "Instructor Name", value: cls.teacher, onChange: (val) => updateClass("legacy", i, "teacher", val) }),
        /* @__PURE__ */ jsx(ModernInput, { label: "Topic", placeholder: "Lesson Topic", value: cls.topic, onChange: (val) => updateClass("legacy", i, "topic", val) })
      ] })
    ] }, i)) }) }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Section, { title: "Block 1: Sunday School (25 min)", icon: Book, children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: agenda.data.secondHour.block1.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 pb-2 border-b border-outline-variant/10", children: /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: cls.name }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(ModernInput, { label: "Teacher", placeholder: "Instructor Name", value: cls.teacher, onChange: (val) => updateClass("block1", i, "teacher", val) }),
          /* @__PURE__ */ jsx(ModernInput, { label: "Topic", placeholder: "Lesson Topic", value: cls.topic, onChange: (val) => updateClass("block1", i, "topic", val) })
        ] })
      ] }, i)) }) }),
      /* @__PURE__ */ jsx(Section, { title: "Block 2: Quorums & Classes (25 min)", icon: Users, children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: agenda.data.secondHour.block2.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 pb-2 border-b border-outline-variant/10", children: /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: cls.name }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(ModernInput, { label: "Teacher", placeholder: "Instructor Name", value: cls.teacher, onChange: (val) => updateClass("block2", i, "teacher", val) }),
          /* @__PURE__ */ jsx(ModernInput, { label: "Topic", placeholder: "Lesson Topic", value: cls.topic, onChange: (val) => updateClass("block2", i, "topic", val) })
        ] })
      ] }, i)) }) }),
      /* @__PURE__ */ jsx(Section, { title: "Primary (55 min)", icon: Sparkles, children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-3 pb-2 border-b border-outline-variant/10", children: /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary text-sm uppercase tracking-widest", children: "Held parallel to both blocks" }) }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsx(ModernInput, { label: "Presidency/Lead", placeholder: "Primary Presidency", value: agenda.data.secondHour.primary.teacher, onChange: (val) => updateClass("primary", null, "teacher", val) }),
          /* @__PURE__ */ jsx(ModernInput, { label: "Special Focus", placeholder: "Singing Time / Theme", value: agenda.data.secondHour.primary.topic, onChange: (val) => updateClass("primary", null, "topic", val) })
        ] })
      ] }) })
    ] })
  ] });
}
function Section({ title, icon: Icon, children }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/20 shadow-xl shadow-slate-200/30", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 mb-8", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-primary p-3 rounded-2xl text-white shadow-lg", children: /* @__PURE__ */ jsx(Icon, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-2xl font-black text-primary tracking-tight", children: title })
    ] }),
    children
  ] });
}
function ModernInput({ label, placeholder, icon: Icon, value, onChange }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: value || "",
          onChange: (e) => onChange(e.target.value),
          placeholder,
          className: "w-full bg-surface border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-primary placeholder:text-on-surface-variant/50"
        }
      ),
      Icon && /* @__PURE__ */ jsx(Icon, { className: "absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary opacity-50 group-focus-within:opacity-100 transition-opacity" })
    ] })
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
