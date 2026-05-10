import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_BigHAIxm.mjs';
import { $ as $$Layout } from './Layout_B9ck-HJB.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Wrench, LayoutTemplate, UserCheck, Calculator, ShieldCheck, Database, Settings, ArrowRight, RefreshCw } from 'lucide-react';
import { a as actions } from './server_IsJhRAnQ.mjs';

const tools = [
  {
    title: "Agenda Builder",
    description: "Create and manage sacred service programs.",
    icon: LayoutTemplate,
    color: "bg-blue-600",
    href: "/tools/agenda"
  },
  {
    title: "Member Directory",
    description: "Quick access to ward and stake leadership.",
    icon: UserCheck,
    color: "bg-emerald-600",
    href: "/tools/directory"
  },
  {
    title: "Attendance Tracker",
    description: "Monitor participation across auxiliaries.",
    icon: Calculator,
    color: "bg-amber-600",
    href: "/tools/attendance"
  },
  {
    title: "Document Vault",
    description: "Securely store and share organizational docs.",
    icon: ShieldCheck,
    color: "bg-indigo-600",
    href: "/tools/vault"
  },
  {
    title: "Data Export",
    description: "Download agenda and attendance records.",
    icon: Database,
    color: "bg-slate-600",
    href: "/tools/export"
  },
  {
    title: "App Settings",
    description: "Configure your platform experience.",
    icon: Settings,
    color: "bg-rose-600",
    href: "/tools/settings"
  }
];
function ToolsHub() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12 pb-32", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest mb-1", children: [
        /* @__PURE__ */ jsx(Wrench, { className: "h-3 w-3" }),
        "System Control"
      ] }),
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-primary tracking-tight", children: "Admin Tools" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mt-2 font-medium", children: "Powerful utilities for ward organizational management." })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: tools.map((tool, i) => /* @__PURE__ */ jsxs(
      motion.a,
      {
        href: tool.href,
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: i * 0.05 },
        className: "bg-surface-container-lowest group flex flex-col items-start p-8 rounded-[2.5rem] border border-outline-variant/30 transition-all hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1",
        children: [
          /* @__PURE__ */ jsx("div", { className: `${tool.color} mb-8 rounded-2xl p-5 text-white shadow-xl shadow-current/20 transition-transform group-hover:scale-110 group-hover:rotate-6`, children: /* @__PURE__ */ jsx(tool.icon, { className: "h-8 w-8" }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2 flex-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-black text-xl text-primary tracking-tight group-hover:text-secondary transition-colors", children: tool.title }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm font-medium leading-relaxed", children: tool.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-8 flex items-center gap-2 text-xs font-black text-secondary uppercase tracking-widest group-hover:gap-4 transition-all", children: [
            "Launch Tool ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
          ] })
        ]
      },
      tool.title
    )) }),
    /* @__PURE__ */ jsxs("section", { className: "bg-slate-900 rounded-[2.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-widest", children: [
            /* @__PURE__ */ jsx(RefreshCw, { className: "h-4 w-4 animate-spin-slow" }),
            "Backend Sync"
          ] }),
          /* @__PURE__ */ jsx("h2", { className: "text-3xl font-black tracking-tight", children: "Cloud Content Synchronization" }),
          /* @__PURE__ */ jsx("p", { className: "text-slate-400 text-lg leading-relaxed max-w-md font-medium", children: "Refresh the sacred library, update hymn numbers, and sync the latest General Conference talks from the central repository." }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: async () => {
                const { data } = await actions.syncData();
                if (data?.success) {
                  alert(data.message);
                }
              },
              className: "bg-white text-slate-900 px-10 py-4 rounded-2xl font-black shadow-xl shadow-white/10 active:scale-95 transition-transform flex items-center gap-3",
              children: "Sync All Data"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:block", children: /* @__PURE__ */ jsxs("div", { className: "bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 space-y-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-blue-400 uppercase", children: "System Health" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(StatusRow, { label: "Appwrite Database", status: "Connected", color: "text-emerald-400" }),
            /* @__PURE__ */ jsx(StatusRow, { label: "Scraper Service", status: "Idle", color: "text-blue-400" }),
            /* @__PURE__ */ jsx(StatusRow, { label: "Last Sync", status: "2h ago", color: "text-slate-400" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2" }),
      /* @__PURE__ */ jsx("div", { className: "absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] translate-y-1/2" })
    ] })
  ] });
}
function StatusRow({ label, status, color }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm font-medium", children: [
    /* @__PURE__ */ jsx("span", { className: "text-slate-400", children: label }),
    /* @__PURE__ */ jsx("span", { className: `${color} font-black`, children: status })
  ] });
}

const $$Tools = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Tools Hub" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ToolsHubComponent", ToolsHub, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/hosanna/Documents/GitHub/mychurchcallings/src/components/pages/ToolsHub", "client:component-export": "ToolsHub" })} ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools.astro";
const $$url = "/tools";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Tools,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
