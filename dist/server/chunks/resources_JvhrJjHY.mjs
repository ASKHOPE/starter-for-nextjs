import { c as createComponent } from './astro-component_nfC7UynX.mjs';
import 'piccolore';
import { q as renderComponent, r as renderTemplate } from './server_CnwHzkPb.mjs';
import { $ as $$Layout } from './Layout_DD8YNFZ0.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Sparkles, Search, ArrowRight, Bookmark, MessageSquare, Music, Book, ChevronRight } from 'lucide-react';

const resources = [
  {
    title: "General Conference",
    description: "Sacred words from living prophets and apostles.",
    icon: MessageSquare,
    color: "bg-blue-600",
    lightBg: "bg-blue-50",
    count: "24 Sessions"
  },
  {
    title: "Music Library",
    description: "Hymns, Children's Songbook, and Youth Music.",
    icon: Music,
    color: "bg-emerald-600",
    lightBg: "bg-emerald-50",
    count: "500+ Songs"
  },
  {
    title: "Curriculum",
    description: "Come, Follow Me and Gospel Principles manuals.",
    icon: Book,
    color: "bg-amber-600",
    lightBg: "bg-amber-50",
    count: "12 Manuals"
  },
  {
    title: "Scriptures",
    description: "Standard Works and study helps.",
    icon: Search,
    color: "bg-indigo-600",
    lightBg: "bg-indigo-50",
    count: "4 Volumes"
  }
];
function ResourcesHub() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-12 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-end justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest mb-1", children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
          "Study Library"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-primary tracking-tight", children: "Sacred Resources" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mt-2 font-medium", children: "Access essential content for study and teaching." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-md w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low flex items-center px-5 py-4 rounded-2xl border border-outline-variant/30 shadow-sm focus-within:ring-4 focus-within:ring-secondary/10 transition-all", children: [
        /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-outline" }),
        /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search the library...", className: "bg-transparent border-none focus:ring-0 w-full ml-3 text-sm font-medium" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-primary overflow-hidden rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/30 relative", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 p-10 md:p-14 space-y-6", children: [
          /* @__PURE__ */ jsx("span", { className: "bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest", children: "Current Study" }),
          /* @__PURE__ */ jsx("h2", { className: "text-4xl font-black leading-tight max-w-md", children: "Come, Follow Me 2026: Old Testament" }),
          /* @__PURE__ */ jsx("p", { className: "text-blue-100/80 text-lg leading-relaxed max-w-lg", children: "Deepen your conversion through home-centered, Church-supported study of the Book of Mormon and Old Testament." }),
          /* @__PURE__ */ jsxs("button", { className: "bg-white text-primary rounded-2xl px-10 py-4 font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2", children: [
            "Start Today's Lesson ",
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-[100px]" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-600/30 blur-[80px]" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-secondary-container/20 rounded-[2.5rem] border-2 border-dashed border-secondary/20 flex flex-col items-center justify-center p-10 text-center space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "bg-white p-6 rounded-3xl shadow-xl text-secondary", children: /* @__PURE__ */ jsx(Bookmark, { className: "h-10 w-10 fill-current" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-bold text-primary", children: "Saved Content" }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm mt-1", children: "Access your bookmarked talks and lessons." })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "text-secondary font-black text-sm uppercase tracking-widest hover:underline pt-2", children: "View All Saved" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: resources.map((item, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.1 },
        className: "bg-surface-container-lowest group flex cursor-pointer items-center gap-6 rounded-[2rem] border border-outline-variant/30 p-6 transition-all hover:shadow-2xl hover:shadow-slate-200/60",
        children: [
          /* @__PURE__ */ jsx("div", { className: `${item.color} rounded-2xl p-5 text-white shadow-xl shadow-current/20 group-hover:scale-110 transition-transform`, children: /* @__PURE__ */ jsx(item.icon, { className: "h-8 w-8" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-1", children: /* @__PURE__ */ jsx("h3", { className: "font-black text-xl text-primary tracking-tight", children: item.title }) }),
            /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm font-medium leading-relaxed", children: item.description })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-end gap-3", children: [
            /* @__PURE__ */ jsx("span", { className: "bg-surface-container-low px-3 py-1 rounded-full text-[10px] font-black text-secondary uppercase tracking-widest", children: item.count }),
            /* @__PURE__ */ jsx("div", { className: "bg-surface p-2 rounded-full text-outline group-hover:text-primary group-hover:bg-secondary-container/20 transition-all", children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5 group-hover:translate-x-0.5 transition-transform" }) })
          ] })
        ]
      },
      item.title
    )) })
  ] });
}

const $$Resources = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sacred Library" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ResourcesHubComponent", ResourcesHub, { "client:load": true, "client:component-hydration": "load", "client:component-path": "/Users/hosanna/Documents/GitHub/mychurchcallings/src/components/pages/ResourcesHub", "client:component-export": "ResourcesHub" })} ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/resources.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/resources.astro";
const $$url = "/resources";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Resources,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
