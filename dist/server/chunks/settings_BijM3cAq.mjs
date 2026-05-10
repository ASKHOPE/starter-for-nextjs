import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_BigHAIxm.mjs';
import { $ as $$Layout } from './Layout_B9ck-HJB.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Bell, Shield, Moon, Globe, ChevronRight } from 'lucide-react';

const settingGroups = [
  { title: "Notifications", description: "Agenda alerts and reminders", icon: Bell, color: "text-rose-600" },
  { title: "Privacy & Security", description: "Two-factor and data access", icon: Shield, color: "text-blue-600" },
  { title: "Appearance", description: "Dark mode and accent colors", icon: Moon, color: "text-indigo-600" },
  { title: "Localization", description: "Language and time zone", icon: Globe, color: "text-emerald-600" }
];
function AppSettings() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-primary", children: "App Settings" }),
      /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mt-1", children: "Customize your platform experience." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-2", children: settingGroups.map((group, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 5 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.05 },
        className: "bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-surface transition-colors",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: `${group.color} bg-white p-3 rounded-2xl shadow-sm border border-outline-variant/10 group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsx(group.icon, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary text-sm", children: group.title }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-on-surface-variant font-medium", children: group.description })
            ] })
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5 text-outline opacity-50" })
        ]
      },
      group.title
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "p-6 bg-surface-container-low rounded-3xl border border-outline-variant/20 mt-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-sm font-bold text-primary mb-4", children: "About MyChurchCalling" }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-on-surface-variant mb-2", children: [
        /* @__PURE__ */ jsx("span", { children: "Version" }),
        /* @__PURE__ */ jsx("span", { className: "font-bold text-primary", children: "2.4.0 (Astro)" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs text-on-surface-variant", children: [
        /* @__PURE__ */ jsx("span", { children: "Build ID" }),
        /* @__PURE__ */ jsx("span", { className: "font-mono", children: "8cb91eb2" })
      ] })
    ] })
  ] });
}

const $$Settings = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "App Settings" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AppSettings", AppSettings, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/hosanna/Documents/GitHub/mychurchcallings/src/components/tools/AppSettings", "client:component-export": "AppSettings" })} ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools/settings.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools/settings.astro";
const $$url = "/tools/settings";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Settings,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
