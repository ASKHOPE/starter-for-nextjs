import { c as createComponent } from './astro-component_nfC7UynX.mjs';
import 'piccolore';
import { q as renderComponent, r as renderTemplate } from './server_CnwHzkPb.mjs';
import { $ as $$Layout } from './Layout_DD8YNFZ0.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { FileText, FileSpreadsheet, FileJson, Download, Database } from 'lucide-react';

const exportOptions = [
  { title: "Agenda Records", type: "PDF / Word", icon: FileText, color: "text-blue-600" },
  { title: "Attendance Logs", type: "Excel / CSV", icon: FileSpreadsheet, color: "text-emerald-600" },
  { title: "Member Lists", type: "JSON / CSV", icon: FileJson, color: "text-amber-600" }
];
function DataExport() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-primary", children: "Data Export" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mt-1", children: "Download and backup your platform data." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: exportOptions.map((option, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: i * 0.1 },
        className: "bg-surface-container-lowest border border-outline-variant/30 p-6 rounded-3xl flex items-center justify-between group cursor-pointer hover:shadow-lg transition-all",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-5", children: [
            /* @__PURE__ */ jsx("div", { className: `${option.color} bg-surface p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsx(option.icon, { className: "h-7 w-7" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary", children: option.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-on-surface-variant", children: [
                "Available formats: ",
                option.type
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "bg-secondary/10 p-3 rounded-full text-secondary opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Download, { className: "h-5 w-5" }) })
        ]
      },
      option.title
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-slate-900 rounded-3xl p-8 text-white", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4 text-slate-400", children: [
        /* @__PURE__ */ jsx(Database, { className: "h-5 w-5" }),
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest", children: "Full System Backup" })
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-4", children: "Complete Archive" }),
      /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-sm mb-6 leading-relaxed", children: "Generate a comprehensive encrypted backup of all agendas, attendance records, and member metadata." }),
      /* @__PURE__ */ jsx("button", { className: "w-full bg-white text-slate-900 py-4 rounded-2xl font-bold shadow-xl shadow-white/10 active:scale-[0.98] transition-transform", children: "Generate Full Export" })
    ] })
  ] });
}

const $$Export = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Data Export" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DataExport", DataExport, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/hosanna/Documents/GitHub/mychurchcallings/src/components/tools/DataExport", "client:component-export": "DataExport" })} ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools/export.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools/export.astro";
const $$url = "/tools/export";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Export,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
