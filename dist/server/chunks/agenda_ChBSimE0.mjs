import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate, B as maybeRenderHead } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_BwkHfUgm.mjs';
import { $ as $$Layout } from './Layout_CWEyc26O.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { motion } from 'framer-motion';
import { Loader2, ChevronLeft, Printer, Share, Church, Calendar, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { a as actions } from './server_Bk0GM6sU.mjs';

const NEW_SCHEDULE_DATE = /* @__PURE__ */ new Date("2026-09-06");
const isNewSchedule = (dateStr) => {
  return new Date(dateStr) >= NEW_SCHEDULE_DATE;
};
function PreviewAgenda({ agendaId }) {
  const [agenda, setAgenda] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function load() {
      const { data } = await actions.getAgendas();
      if (data?.success) {
        const found = data.agendas.find((a) => a.$id === agendaId);
        if (found) {
          const migratedData = { ...found.data };
          if (!migratedData.secondHour && migratedData.classes) {
            migratedData.secondHour = {
              block1: migratedData.classes,
              block2: [],
              primary: { teacher: "Primary Presidency", topic: "Singing Time & Classes" }
            };
          }
          found.data = migratedData;
        }
        setAgenda(found);
      }
      setLoading(false);
    }
    load();
  }, [agendaId]);
  if (loading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: [
      /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 animate-spin text-primary" }),
      /* @__PURE__ */ jsx("p", { className: "mt-4 font-bold text-on-surface-variant", children: "Preparing Preview..." })
    ] });
  }
  if (!agenda) {
    return /* @__PURE__ */ jsxs("div", { className: "text-center py-20", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-primary", children: "Agenda Not Found" }),
      /* @__PURE__ */ jsx("a", { href: "/", className: "text-secondary font-bold hover:underline mt-4 inline-block", children: "Return to Dashboard" })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto space-y-8 pb-20", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between no-print", children: [
      /* @__PURE__ */ jsxs("button", { onClick: () => window.history.back(), className: "flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors", children: [
        /* @__PURE__ */ jsx(ChevronLeft, { className: "h-5 w-5" }),
        " Back to Editor"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => window.print(), className: "bg-surface-container-low p-3 rounded-xl border border-outline-variant/30 text-primary hover:bg-surface-variant transition-colors", children: /* @__PURE__ */ jsx(Printer, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxs("button", { className: "bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 flex items-center gap-2 hover:scale-105 transition-transform", children: [
          /* @__PURE__ */ jsx(Share, { className: "h-4 w-4" }),
          " Share"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className: "bg-white text-slate-900 shadow-2xl rounded-[1rem] overflow-hidden border border-slate-200 aspect-[1/1.4] p-12 md:p-20 flex flex-col items-center text-center space-y-12",
        id: "printable-area",
        children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx(Church, { className: "h-12 w-12 mx-auto text-slate-400" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
              /* @__PURE__ */ jsx("h1", { className: "text-3xl font-serif italic tracking-tight", children: agenda.title }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-slate-500 uppercase tracking-[0.2em]", children: "The Church of Jesus Christ of Latter-day Saints" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-24 h-px bg-slate-200" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-6 text-sm font-bold text-slate-600", children: [
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4" }),
              " ",
              new Date(agenda.date).toLocaleDateString(void 0, { dateStyle: "long" })
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4" }),
              " Oak Hills 4th Ward"
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "w-full space-y-10 text-left max-w-lg mx-auto", children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-x-12 gap-y-4 text-sm border-b border-slate-100 pb-8", children: [
              /* @__PURE__ */ jsx(ProgramLine, { label: "Presiding", value: agenda.data.leadership.presiding }),
              /* @__PURE__ */ jsx(ProgramLine, { label: "Conducting", value: agenda.data.leadership.conducting }),
              /* @__PURE__ */ jsx(ProgramLine, { label: "Organist", value: agenda.data.leadership.organist }),
              /* @__PURE__ */ jsx(ProgramLine, { label: "Chorister", value: agenda.data.leadership.chorister }),
              /* @__PURE__ */ jsx(ProgramLine, { label: "Acknowledging", value: agenda.data.leadership.acknowledgeLeader })
            ] }),
            agenda.data.program.announcements && /* @__PURE__ */ jsxs("div", { className: "bg-slate-50 p-6 rounded-xl text-left space-y-2 border border-slate-100", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Announcements" }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-slate-600 leading-relaxed whitespace-pre-wrap", children: agenda.data.program.announcements })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "space-y-6", children: agenda.data.program.blocks?.map((block, i) => block.type === "sacrament" ? /* @__PURE__ */ jsx("div", { className: "py-4 text-center italic text-slate-400 text-sm", children: "The Administration of the Sacrament" }, i) : /* @__PURE__ */ jsx(ProgramLine, { label: block.label, value: block.value, centered: true }, i)) }),
            /* @__PURE__ */ jsxs("div", { className: "pt-12 space-y-8", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-px bg-slate-200 mx-auto mb-4" }),
                /* @__PURE__ */ jsx("h2", { className: "text-xl font-serif italic", children: "Second Hour" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "space-y-6", children: agenda.data.secondHour?.override === "new" || (agenda.data.secondHour?.override === "auto" || !agenda.data.secondHour?.override) && isNewSchedule(agenda.date) ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end border-b border-slate-100 pb-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Block 1: Sunday School" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "25 Minutes" })
                  ] }),
                  agenda.data.secondHour?.block1.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: cls.name }),
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500 italic", children: cls.teacher })
                  ] }, i))
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end border-b border-slate-100 pb-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Block 2: Quorums & Classes" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "25 Minutes" })
                  ] }),
                  agenda.data.secondHour?.block2.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: cls.name }),
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500 italic", children: cls.teacher })
                  ] }, i))
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "bg-slate-50/50 p-4 rounded-xl space-y-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-end border-b border-slate-200/50 pb-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400", children: "Primary" }),
                    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-slate-400", children: "55 Minutes" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-xs", children: [
                    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: "All Children" }),
                    /* @__PURE__ */ jsx("span", { className: "text-slate-500 italic", children: agenda.data.secondHour?.primary.teacher })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ jsx("div", { className: "space-y-4", children: agenda.data.classes?.map((cls, i) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs border-b border-slate-100 pb-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-700", children: cls.name }),
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] text-slate-400", children: cls.topic })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-slate-500 italic", children: cls.teacher })
              ] }, i)) }) })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-12 text-[10px] text-slate-400 font-medium uppercase tracking-[0.1em] flex justify-between w-full border-t border-slate-100", children: [
            /* @__PURE__ */ jsx("span", { children: "Oak Hills Stake • Zion Terrace Region" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-4", children: [
              agenda.data.attendance?.beforeSacrament && /* @__PURE__ */ jsxs("span", { children: [
                "Before: ",
                agenda.data.attendance.beforeSacrament
              ] }),
              agenda.data.attendance?.afterSacrament && /* @__PURE__ */ jsxs("span", { children: [
                "After: ",
                agenda.data.attendance.afterSacrament
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          #printable-area { 
            box-shadow: none !important; 
            border: none !important; 
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
          }
        }
      ` } })
  ] });
}
function ProgramLine({ label, value, centered }) {
  if (!value) return null;
  return /* @__PURE__ */ jsxs("div", { className: `flex flex-col ${centered ? "items-center" : ""}`, children: [
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5", children: label }),
    /* @__PURE__ */ jsx("span", { className: "font-bold text-slate-800", children: value })
  ] });
}

const $$Agenda = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Agenda;
  const id = Astro2.url.searchParams.get("id");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Program Preview" }, { "default": ($$result2) => renderTemplate`${id ? renderTemplate`${renderComponent($$result2, "PreviewAgenda", PreviewAgenda, { "client:load": true, "agendaId": id, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/pages/PreviewAgenda", "client:component-export": "PreviewAgenda" })}` : renderTemplate`${maybeRenderHead()}<div class="flex items-center justify-center min-h-[60vh] text-on-surface-variant font-bold">
No Agenda Selected
</div>`}` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/preview/agenda.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/preview/agenda.astro";
const $$url = "/preview/agenda";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Agenda,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
