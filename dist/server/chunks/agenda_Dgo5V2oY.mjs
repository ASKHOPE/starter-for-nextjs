import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_BwkHfUgm.mjs';
import { $ as $$Layout } from './Layout_CWEyc26O.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Loader2, Plus, Search, FileText, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { a as actions } from './server_Bk0GM6sU.mjs';

function AgendaBuilder() {
  const [agendas, setAgendas] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      const { data } = await actions.getAgendas();
      if (data?.success) {
        setAgendas(data.agendas);
      }
      setLoading(false);
    }
    load();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin h-8 w-8 text-primary" }) });
  }
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
    /* @__PURE__ */ jsx("div", { className: "space-y-4", children: agendas.map((item, i) => /* @__PURE__ */ jsxs(
      "a",
      {
        href: `/plan/sunday?id=${item.$id}`,
        className: "bg-surface-container-lowest border border-outline-variant/20 p-5 rounded-3xl flex items-center justify-between group cursor-pointer hover:shadow-md transition-all",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-secondary/10 p-3 rounded-2xl text-secondary", children: /* @__PURE__ */ jsx(FileText, { className: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-primary", children: item.title }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mt-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
                  " ",
                  new Date(item.date).toLocaleDateString()
                ] }),
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3" }),
                  " Draft"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(ChevronRight, { className: "h-5 w-5 text-outline group-hover:translate-x-1 transition-transform" })
        ]
      },
      item.$id
    )) })
  ] });
}

const $$Agenda = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Agenda Builder" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AgendaBuilder", AgendaBuilder, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/tools/AgendaBuilder", "client:component-export": "AgendaBuilder" })} ` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/tools/agenda.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/tools/agenda.astro";
const $$url = "/tools/agenda";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Agenda,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
