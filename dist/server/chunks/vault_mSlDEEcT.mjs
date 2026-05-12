import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_BwkHfUgm.mjs';
import { $ as $$Layout } from './Layout_CWEyc26O.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Upload, Search, File, Download, MoreVertical } from 'lucide-react';

const documents = [
  { name: "Ward Budget 2026.pdf", size: "1.2 MB", date: "Jan 15", type: "PDF" },
  { name: "Youth Calendar.xlsx", size: "450 KB", date: "Feb 02", type: "XLS" },
  { name: "Emergency Plan.docx", size: "890 KB", date: "Dec 10", type: "DOC" }
];
function DocumentVault() {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-primary", children: "Document Vault" }),
        /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant mt-1", children: "Secure organizational storage." })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "bg-indigo-600 text-white p-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-transform active:scale-95", children: /* @__PURE__ */ jsx(Upload, { className: "h-6 w-6" }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low flex items-center px-4 py-3 rounded-2xl border border-outline-variant/30", children: [
      /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-outline" }),
      /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Search documents...", className: "bg-transparent border-none focus:ring-0 w-full ml-2 text-sm" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "space-y-3", children: documents.map((doc, i) => /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.1 },
        className: "bg-surface-container-lowest border border-outline-variant/20 p-4 rounded-3xl flex items-center justify-between group hover:shadow-md transition-all",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-indigo-50 p-3 rounded-2xl text-indigo-600", children: /* @__PURE__ */ jsx(File, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary text-sm", children: doc.name }),
              /* @__PURE__ */ jsxs("p", { className: "text-[10px] text-on-surface-variant font-medium uppercase tracking-wider", children: [
                doc.size,
                " • ",
                doc.date
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("button", { className: "p-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors", children: /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsx("button", { className: "p-2 rounded-xl text-on-surface-variant hover:bg-surface-variant transition-colors", children: /* @__PURE__ */ jsx(MoreVertical, { className: "h-4 w-4" }) })
          ] })
        ]
      },
      doc.name
    )) })
  ] });
}

const $$Vault = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Document Vault" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "DocumentVault", DocumentVault, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/tools/DocumentVault", "client:component-export": "DocumentVault" })} ` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/tools/vault.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/tools/vault.astro";
const $$url = "/tools/vault";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Vault,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
