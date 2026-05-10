import { c as createComponent } from './astro-component_nfC7UynX.mjs';
import 'piccolore';
import { q as renderComponent, r as renderTemplate } from './server_CnwHzkPb.mjs';
import { $ as $$Layout } from './Layout_DD8YNFZ0.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Plus, Search, FileText, Calendar, Clock, ChevronRight } from 'lucide-react';

const agendas = [
  { id: 1, title: "Sacrament Meeting", date: "May 17, 2026", status: "Draft" },
  { id: 2, title: "Stake Conference", date: "June 24, 2026", status: "Planned" },
  { id: 3, title: "Youth Activity", date: "May 20, 2026", status: "Draft" }
];
function AgendaBuilder() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-primary", children: "Agenda Builder" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mt-1", children: "Manage and create service programs." })
      ] }),
      /* @__PURE__ */ jsx("a", { href: "/plan/sunday", className: "bg-secondary text-on-secondary p-4 rounded-2xl shadow-lg shadow-secondary/20 transition-transform active:scale-95", children: /* @__PURE__ */ jsx(Plus, { className: "h-6 w-6" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low flex items-center px-4 py-3 rounded-2xl border border-outline-variant/30", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-outline" }),
      /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search agendas...", className: "bg-transparent border-none focus:ring-0 w-full ml-2 text-sm" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: agendas.map((agenda, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.1 },
        className: "bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:shadow-md transition-all",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-secondary/10 p-3 rounded-2xl text-secondary", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary", children: agenda.title }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
                  " ",
                  agenda.date
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                  " ",
                  agenda.status
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5 text-outline group-hover:translate-x-1 transition-transform" })
        ]
      },
      agenda.id
    )) })
  ] });
}

const $$Agenda = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Agenda Builder" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AgendaBuilder", AgendaBuilder, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/hosanna/Documents/GitHub/mychurchcallings/src/components/tools/AgendaBuilder", "client:component-export": "AgendaBuilder" })} ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools/agenda.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools/agenda.astro";
const $$url = "/tools/agenda";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Agenda,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
