import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate, B as maybeRenderHead } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_dYLE_H8d.mjs';
import { $ as $$Layout } from './Layout_DKvmS3pq.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { ChevronLeft, Search, Loader2, ExternalLink, Music, MessageSquare, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { a as actions } from './server_CG6lBRbX.mjs';

function LibraryList({ collection, title }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  useEffect(() => {
    load();
  }, [collection]);
  async function load(query = "") {
    setLoading(true);
    setError(null);
    const { data } = await actions.getLibraryItems({ collection, search: query });
    if (data?.success) {
      setItems(data.items);
    } else {
      setError(data?.error || "Failed to load content.");
    }
    setLoading(false);
  }
  const getIcon = () => {
    if (collection.includes("hymn")) return Music;
    if (collection.includes("talk")) return MessageSquare;
    return BookOpen;
  };
  const Icon = getIcon();
  return /* @__PURE__ */ jsxs("div", { className: "space-y-8 pb-32", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => window.history.back(), className: "flex items-center gap-2 text-secondary font-black text-xs uppercase tracking-widest mb-2 hover:translate-x-[-4px] transition-transform", children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "h-3 w-3" }),
          " Back to Library"
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-black text-primary tracking-tight", children: title || "Library Content" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "max-w-md w-full", children: /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-low flex items-center px-5 py-4 rounded-2xl border border-outline-variant/30", children: [
        /* @__PURE__ */ jsx(Search, { className: "h-5 w-5 text-outline" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            placeholder: `Search in ${title}...`,
            className: "bg-transparent border-none focus:ring-0 w-full ml-3 text-sm font-medium",
            value: search,
            onChange: (e) => {
              setSearch(e.target.value);
              if (e.target.value.length === 0 || e.target.value.length > 2) {
                load(e.target.value);
              }
            }
          }
        )
      ] }) })
    ] }),
    error ? /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border border-red-100 p-8 rounded-[2rem] text-center", children: [
      /* @__PURE__ */ jsx("p", { className: "text-red-600 font-bold mb-2", children: "Error Loading Content" }),
      /* @__PURE__ */ jsx("p", { className: "text-red-500 text-sm", children: error })
    ] }) : loading ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-32", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 animate-spin text-secondary" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 font-bold text-on-surface-variant uppercase tracking-widest text-xs", children: "Loading Sacred Content..." })
    ] }) : /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [
      items.map((item, i) => /* @__PURE__ */ jsxs(
        motion.a,
        {
          href: item.url,
          target: "_blank",
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: i * 0.02 },
          className: "bg-surface-container-lowest group p-6 rounded-[2rem] border border-outline-variant/30 hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between mb-4", children: [
              /* @__PURE__ */ jsx("div", { className: "bg-surface-container-low p-3 rounded-xl text-primary group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
              item.number && /* @__PURE__ */ jsxs("span", { className: "bg-primary text-white px-3 py-1 rounded-full text-[10px] font-black tracking-widest", children: [
                "#",
                item.number
              ] })
            ] }),
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary line-clamp-2 flex-1 mb-4", children: item.title }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[10px] font-black text-secondary uppercase tracking-widest", children: [
              "Read More ",
              /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
            ] })
          ]
        },
        item.$id
      )),
      items.length === 0 && /* @__PURE__ */ jsx("div", { className: "col-span-full py-20 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-bold", children: "No content found in this category." }) })
    ] })
  ] });
}

const $$List = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$List;
  const collection = Astro2.url.searchParams.get("collection");
  const title = Astro2.url.searchParams.get("title");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": title || "Sacred Library" }, { "default": ($$result2) => renderTemplate`${collection ? renderTemplate`${renderComponent($$result2, "LibraryList", LibraryList, { "client:load": true, "collection": collection, "title": title, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/pages/LibraryList", "client:component-export": "LibraryList" })}` : renderTemplate`${maybeRenderHead()}<div class="flex items-center justify-center min-h-[60vh] text-on-surface-variant font-bold">
Category Not Found
</div>`}` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/resources/list.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/resources/list.astro";
const $$url = "/resources/list";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$List,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
