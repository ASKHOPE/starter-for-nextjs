import { c as createComponent } from './astro-component_nfC7UynX.mjs';
import 'piccolore';
import { q as renderComponent, r as renderTemplate } from './server_CnwHzkPb.mjs';
import { $ as $$Layout } from './Layout_DD8YNFZ0.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Search, Edit, Users, ArrowRight, Church, BookOpenText, UserPlus, StickyNote, Ellipsis } from 'lucide-react';
import { motion } from 'framer-motion';

function Dashboard() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12 pb-24", children: [
    /* @__PURE__ */ jsx("section", { className: "relative max-w-2xl mx-auto md:mx-0", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest flex items-center rounded-3xl border border-outline-variant/30 px-6 py-5 shadow-xl shadow-slate-200/40 transition-all focus-within:ring-4 focus-within:ring-secondary/10 focus-within:border-secondary", children: [
      /* @__PURE__ */ jsx(Search, { className: "text-outline h-5 w-5" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Search agendas, members, or lessons...",
          className: "font-medium text-body-lg placeholder:text-on-surface-variant ml-4 w-full border-none bg-transparent outline-none focus:ring-0"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs(
      motion.section,
      {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        className: "bg-primary overflow-hidden rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl shadow-slate-900/30 relative",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [
            /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]", children: "Live Session" }),
                /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black tracking-tight leading-tight", children: "Sunday Sacrament Service" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-100/80 text-lg max-w-md font-medium leading-relaxed", children: "Managing Oak Hills 4th Ward. Join the live stream or edit the program in real-time." }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 pt-4", children: [
                /* @__PURE__ */ jsxs("a", { href: "/plan/sunday", className: "bg-white text-primary px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform", children: [
                  /* @__PURE__ */ jsx(Edit, { className: "h-5 w-5" }),
                  "Edit Program"
                ] }),
                /* @__PURE__ */ jsxs("button", { className: "bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-white/20 transition-all", children: [
                  /* @__PURE__ */ jsx(Users, { className: "h-5 w-5" }),
                  "Attendance"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "hidden lg:grid grid-cols-1 gap-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/10", children: [
              /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-blue-200 uppercase mb-4", children: "Current Progress" }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
                  /* @__PURE__ */ jsx("span", { children: "Opening Hymn" }),
                  /* @__PURE__ */ jsx("span", { className: "text-emerald-400 font-bold", children: "Done" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "h-1.5 bg-white/10 rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full bg-emerald-400 w-1/3 shadow-[0_0_10px_rgba(52,211,153,0.5)]" }) })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" }),
          /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" })
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("section", { className: "xl:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-primary", children: "Sunday Schedule" }),
          /* @__PURE__ */ jsxs("button", { className: "text-secondary font-bold text-sm flex items-center gap-1 group", children: [
            "Full Calendar ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-1 transition-transform" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
          { title: "Sacrament Meeting", time: "10:00 AM", location: "Chapel", icon: Church, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Sunday School", time: "11:15 AM", location: "Room 204", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Priesthood / RS", time: "12:15 PM", location: "Main Hall", icon: BookOpenText, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Youth Mtg", time: "12:15 PM", location: "Room 102", icon: UserPlus, color: "text-amber-600", bg: "bg-amber-50" }
        ].map((item, i) => /* @__PURE__ */ jsxs(
          motion.div,
          {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: i * 0.1 },
            className: "bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 flex items-start gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group",
            children: [
              /* @__PURE__ */ jsx("div", { className: `${item.bg} ${item.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsx(item.icon, { className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-1", children: /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary", children: item.title }) }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-on-surface-variant font-medium", children: [
                  item.time,
                  " • ",
                  item.location
                ] })
              ] })
            ]
          },
          item.title
        )) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-primary", children: "Admin Access" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 xl:grid-cols-1 gap-4", children: [
          { icon: UserPlus, label: "Manage Visitors", color: "bg-blue-50 text-blue-600" },
          { icon: Users, label: "Mark Attendance", color: "bg-purple-50 text-purple-600" },
          { icon: StickyNote, label: "Take Notes", color: "bg-amber-50 text-amber-600" },
          { icon: Ellipsis, label: "More Tools", color: "bg-slate-50 text-slate-600" }
        ].map((action) => /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-5 rounded-[2rem] border border-outline-variant/30 flex items-center gap-4 group cursor-pointer hover:bg-surface-variant/20 transition-all", children: [
          /* @__PURE__ */ jsx("div", { className: `${action.color} p-3 rounded-xl group-hover:rotate-12 transition-transform`, children: /* @__PURE__ */ jsx(action.icon, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("span", { className: "font-bold text-sm text-primary", children: action.label })
        ] }, action.label)) })
      ] })
    ] })
  ] });
}

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashboardComponent", Dashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/hosanna/Documents/GitHub/mychurchcallings/src/components/pages/Dashboard", "client:component-export": "Dashboard" })} ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/index.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
