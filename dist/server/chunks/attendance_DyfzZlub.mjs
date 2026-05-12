import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_BwkHfUgm.mjs';
import { $ as $$Layout } from './Layout_CWEyc26O.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Calendar, Users, Check } from 'lucide-react';
import 'react';

const classes = [
  { id: 1, name: "Gospel Doctrine", count: 42 },
  { id: 2, name: "Elder's Quorum", count: 28 },
  { id: 3, name: "Relief Society", count: 35 },
  { id: 4, name: "Primary", count: 18 }
];
function AttendanceTracker() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-primary", children: "Attendance" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mt-1", children: "Track participation for Sunday classes." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-primary rounded-3xl p-6 text-white shadow-xl shadow-slate-900/20", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold uppercase tracking-widest text-blue-200", children: "Total Attendance" }),
        /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-blue-200" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "text-4xl font-bold", children: "123" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm text-blue-200", children: "Members Present" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4", children: classes.map((cls, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: i * 0.1 },
        className: "bg-surface-container-lowest border border-outline-variant/30 p-5 rounded-3xl flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-amber-100 p-3 rounded-2xl text-amber-600", children: /* @__PURE__ */ jsx(Users, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary", children: cls.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-xs text-on-surface-variant", children: [
                cls.count,
                " Registered"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-surface px-4 py-2 rounded-xl border border-outline-variant/30 font-bold text-primary", children: Math.floor(cls.count * 0.8) }),
            /* @__PURE__ */ jsx("button", { className: "bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-500/20", children: /* @__PURE__ */ jsx(Check, { className: "h-5 w-5" }) })
          ] })
        ]
      },
      cls.id
    )) })
  ] });
}

const $$Attendance = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Attendance Tracker" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AttendanceTracker", AttendanceTracker, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/tools/AttendanceTracker", "client:component-export": "AttendanceTracker" })} ` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/tools/attendance.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/tools/attendance.astro";
const $$url = "/tools/attendance";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Attendance,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
