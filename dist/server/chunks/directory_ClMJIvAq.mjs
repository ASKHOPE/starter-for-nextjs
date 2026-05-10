import { c as createComponent } from './astro-component_nfC7UynX.mjs';
import 'piccolore';
import { q as renderComponent, r as renderTemplate } from './server_CnwHzkPb.mjs';
import { $ as $$Layout } from './Layout_DD8YNFZ0.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Filter, Search, Phone, Mail } from 'lucide-react';

const members = [
  { name: "Bishop Smith", role: "Bishopric", phone: "555-0101", initial: "BS" },
  { name: "Sister Jones", role: "Relief Society", phone: "555-0102", initial: "SJ" },
  { name: "Brother Miller", role: "Elder's Quorum", phone: "555-0103", initial: "BM" },
  { name: "Sister Wilson", role: "Primary", phone: "555-0104", initial: "SW" }
];
function MemberDirectory() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-primary", children: "Member Directory" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mt-1", children: "Ward leadership and organization." })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "bg-surface-container-low p-3 rounded-2xl border border-outline-variant/30 text-primary transition-colors hover:bg-surface-variant", children: /* @__PURE__ */ jsx(Filter, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low flex items-center px-4 py-3 rounded-2xl border border-outline-variant/30", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-outline" }),
      /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search members by name or calling...", className: "bg-transparent border-none focus:ring-0 w-full ml-2 text-sm" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: members.map((member, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: i * 0.05 },
        className: "bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-3xl flex items-center justify-between group hover:shadow-md transition-all",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary font-bold text-sm border border-outline-variant/20", children: member.initial }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary", children: member.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] font-bold text-secondary uppercase tracking-widest", children: member.role })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("button", { className: "p-2 rounded-xl text-secondary hover:bg-secondary/10", children: /* @__PURE__ */ jsx(Phone, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "p-2 rounded-xl text-secondary hover:bg-secondary/10", children: /* @__PURE__ */ jsx(Mail, { className: "h-4 w-4" }) })
          ] })
        ]
      },
      member.name
    )) })
  ] });
}

const $$Directory = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Member Directory" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "MemberDirectory", MemberDirectory, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/hosanna/Documents/GitHub/mychurchcallings/src/components/tools/MemberDirectory", "client:component-export": "MemberDirectory" })} ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools/directory.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/tools/directory.astro";
const $$url = "/tools/directory";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Directory,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
