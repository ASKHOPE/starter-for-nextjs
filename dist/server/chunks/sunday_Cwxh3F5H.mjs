import { c as createComponent } from './astro-component_nfC7UynX.mjs';
import 'piccolore';
import { q as renderComponent, r as renderTemplate } from './server_CnwHzkPb.mjs';
import { $ as $$Layout } from './Layout_DD8YNFZ0.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Sparkles, Save, Users, Clock, MapPin, Music, Plus, Book } from 'lucide-react';
import { useState } from 'react';

function SundayArchitect() {
  const [activeTab, setActiveTab] = useState("sacrament");
  return /* @__PURE__ */ jsxs("div", { className: "pb-32 space-y-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
          "Agenda Architect"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-primary tracking-tight", children: "Sunday Service" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-medium", children: "Oak Hills 4th Ward • May 17, 2026" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { className: "flex-1 md:flex-none bg-surface-container-low border border-outline-variant/30 px-6 py-3 rounded-2xl font-bold text-primary hover:bg-surface-variant transition-all", children: "Preview" }),
        /* @__PURE__ */ jsxs("button", { className: "flex-1 md:flex-none bg-secondary text-on-secondary px-8 py-3 rounded-2xl font-bold shadow-xl shadow-secondary/20 hover:scale-105 transition-transform flex items-center justify-center gap-2", children: [
          /* @__PURE__ */ jsx(Save, { className: "h-5 w-5" }),
          "Save Program"
        ] })
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
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-8 space-y-8", children: activeTab === "sacrament" ? /* @__PURE__ */ jsx(SacramentFlow, {}) : /* @__PURE__ */ jsx(SecondHourFlow, {}) }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-4 space-y-6 lg:sticky lg:top-24", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low p-6 rounded-[2.5rem] border border-outline-variant/20 space-y-6", children: [
        /* @__PURE__ */ jsxs("h3", { className: "font-bold text-primary flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-4 w-4 text-secondary" }),
          "Service Timing"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsx(TimeItem, { label: "Prelude", time: "9:50 AM" }),
          /* @__PURE__ */ jsx(TimeItem, { label: "Start", time: "10:00 AM" }),
          /* @__PURE__ */ jsx(TimeItem, { label: "End", time: "11:00 AM" })
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
function SacramentFlow() {
  return /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: [
    /* @__PURE__ */ jsx(Section, { title: "Leadership & Music", icon: Users, children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(ModernInput, { label: "Presiding", placeholder: "Bishop Smith" }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Conducting", placeholder: "Brother Jones" }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Organist", placeholder: "Sister Miller" }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Chorister", placeholder: "Brother Wilson" })
    ] }) }),
    /* @__PURE__ */ jsx(Section, { title: "Sacred Program", icon: Music, children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(ModernInput, { label: "Opening Hymn", placeholder: "Hymn # and Title", icon: Sparkles }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Sacrament Hymn", placeholder: "Hymn # and Title" }),
      /* @__PURE__ */ jsx("div", { className: "bg-secondary/5 p-6 rounded-3xl border border-secondary/20 border-dashed", children: /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-2 text-secondary font-bold w-full justify-center", children: [
        /* @__PURE__ */ jsx(Plus, { className: "h-5 w-5" }),
        "Add Program Item (Talk, Musical Number)"
      ] }) }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Closing Hymn", placeholder: "Hymn # and Title" })
    ] }) })
  ] });
}
function SecondHourFlow() {
  return /* @__PURE__ */ jsx(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, className: "space-y-8", children: /* @__PURE__ */ jsx(Section, { title: "Class Coordination", icon: Book, children: /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "bg-white p-8 rounded-[2rem] border border-outline-variant/30 shadow-sm space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 pb-4 border-b border-outline-variant/10", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-amber-100 p-2 rounded-xl text-amber-600", children: /* @__PURE__ */ jsx(Sparkles, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("h4", { className: "font-bold text-primary", children: "Adult Gospel Doctrine" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsx(ModernInput, { label: "Teacher", placeholder: "Sister Adams" }),
      /* @__PURE__ */ jsx(ModernInput, { label: "Topic", placeholder: "Mosiah 1-3" })
    ] })
  ] }) }) }) });
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
function ModernInput({ label, placeholder, icon: Icon }) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2.5", children: [
    /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-1", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder,
          className: "w-full bg-surface border border-outline-variant/40 px-6 py-4 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-primary placeholder:text-on-surface-variant/50"
        }
      ),
      Icon && /* @__PURE__ */ jsx(Icon, { className: "absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary opacity-50 group-focus-within:opacity-100 transition-opacity" })
    ] })
  ] });
}

const $$Sunday = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sunday Architect" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SundayArchitectComponent", SundayArchitect, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/hosanna/Documents/GitHub/mychurchcallings/src/components/pages/SundayArchitect", "client:component-export": "SundayArchitect" })} ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/plan/sunday.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/plan/sunday.astro";
const $$url = "/plan/sunday";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Sunday,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
