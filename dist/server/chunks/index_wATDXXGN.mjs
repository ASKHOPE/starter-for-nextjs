import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_yjx_LAnn.mjs';
import { $ as $$Layout } from './Layout_6wALqu6j.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { Search, Loader2, Edit, Users, ArrowRight, Church, UserPlus, StickyNote, Ellipsis } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { a as actions } from './server_B_Pg_n71.mjs';

function Dashboard() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  useEffect(() => {
    async function loadAgendas() {
      const { data } = await actions.getAgendas();
      if (data?.success) {
        setAgendas(data.agendas);
      }
      setLoading(false);
    }
    loadAgendas();
  }, []);
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 3) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    const { data } = await actions.globalSearch({ query });
    if (data?.success) {
      setSearchResults(data);
    }
    setIsSearching(false);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12 pb-24", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative max-w-2xl mx-auto md:mx-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest flex items-center rounded-3xl border border-outline-variant/30 px-6 py-5 shadow-xl shadow-slate-200/40 transition-all focus-within:ring-4 focus-within:ring-secondary/10 focus-within:border-secondary", children: [
        /* @__PURE__ */ jsx(Search, { className: "text-outline h-5 w-5" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchQuery,
            onChange: (e) => handleSearch(e.target.value),
            placeholder: "Search agendas, members, or lessons...",
            className: "font-medium text-body-lg placeholder:text-on-surface-variant ml-4 w-full border-none bg-transparent outline-none focus:ring-0"
          }
        ),
        isSearching && /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin text-secondary ml-2" })
      ] }),
      searchResults && /* @__PURE__ */ jsx("div", { className: "absolute z-50 w-full mt-4 bg-white rounded-[2rem] border border-outline-variant/30 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4", children: /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
        searchResults.agendas.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-widest text-secondary", children: "Agendas" }),
          searchResults.agendas.map((a) => /* @__PURE__ */ jsx("a", { href: `/plan/sunday?id=${a.$id}`, className: "block p-3 rounded-xl hover:bg-slate-50 font-bold text-primary", children: a.title }, a.$id))
        ] }),
        searchResults.hymns.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-widest text-emerald-600", children: "Hymns" }),
          searchResults.hymns.map((h) => /* @__PURE__ */ jsxs("div", { className: "p-3 rounded-xl hover:bg-slate-50 font-bold text-primary flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { children: h.title }),
            /* @__PURE__ */ jsxs("span", { className: "text-emerald-600", children: [
              "#",
              h.number
            ] })
          ] }, h.$id))
        ] }),
        searchResults.talks.length > 0 && /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsx("h4", { className: "text-[10px] font-black uppercase tracking-widest text-blue-600", children: "Conference Talks" }),
          searchResults.talks.map((t) => /* @__PURE__ */ jsx("a", { href: t.url, target: "_blank", className: "block p-3 rounded-xl hover:bg-slate-50 font-bold text-primary", children: t.title }, t.$id))
        ] }),
        searchResults.agendas.length === 0 && searchResults.hymns.length === 0 && searchResults.talks.length === 0 && /* @__PURE__ */ jsxs("p", { className: "text-center text-on-surface-variant py-4 font-medium", children: [
          'No results found for "',
          searchQuery,
          '"'
        ] })
      ] }) })
    ] }),
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
                /* @__PURE__ */ jsx("span", { className: "inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em]", children: "Next Meeting" }),
                /* @__PURE__ */ jsx("h2", { className: "text-4xl md:text-5xl font-black tracking-tight leading-tight", children: agendas[0]?.title || "No Upcoming Services" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-100/80 text-lg max-w-md font-medium leading-relaxed", children: agendas[0] ? `Managing ${agendas[0].title}. Date: ${new Date(agendas[0].date).toLocaleDateString()}.` : "Start by creating your first Sunday service agenda." }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-4 pt-4", children: [
                /* @__PURE__ */ jsxs("a", { href: agendas[0] ? `/plan/sunday?id=${agendas[0].$id}` : "/plan/sunday", className: "bg-white text-primary px-8 py-4 rounded-2xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform", children: [
                  /* @__PURE__ */ jsx(Edit, { className: "h-5 w-5" }),
                  agendas[0] ? "Edit Program" : "Create Agenda"
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
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: loading ? /* @__PURE__ */ jsxs("div", { className: "col-span-full flex flex-col items-center justify-center py-12 bg-surface-container-low rounded-[2rem] border border-outline-variant/30", children: [
          /* @__PURE__ */ jsx(Loader2, { className: "h-8 w-8 animate-spin text-secondary mb-4" }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-bold", children: "Synchronizing your agendas..." })
        ] }) : agendas.length > 0 ? agendas.map((item, i) => /* @__PURE__ */ jsxs(
          motion.a,
          {
            href: `/plan/sunday?id=${item.$id}`,
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: i * 0.1 },
            className: "bg-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/30 flex items-start gap-5 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group",
            children: [
              /* @__PURE__ */ jsx("div", { className: `bg-blue-50 text-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsx(Church, { className: "h-6 w-6" }) }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("div", { className: "flex justify-between items-start mb-1", children: /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary", children: item.title }) }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-on-surface-variant font-medium", children: [
                  new Date(item.date).toLocaleDateString(),
                  " • ",
                  item.type
                ] })
              ] })
            ]
          },
          item.$id
        )) : /* @__PURE__ */ jsx("div", { className: "col-span-full py-12 text-center bg-surface-container-low rounded-[2rem] border border-outline-variant/30", children: /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-medium", children: "No agendas found. Create one to get started!" }) }) })
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
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Dashboard" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DashboardComponent", Dashboard, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/pages/Dashboard", "client:component-export": "Dashboard" })} ` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/index.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
