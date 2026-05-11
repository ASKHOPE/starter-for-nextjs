import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_yjx_LAnn.mjs';
import { $ as $$Layout } from './Layout_6wALqu6j.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Loader2, User, Camera, Sparkles, MapPin, Calendar, Mail, Shield, Clock, Bell, LogOut } from 'lucide-react';
import { a as actions } from './server_B_Pg_n71.mjs';
import { useState, useEffect } from 'react';

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadUser() {
      const { data } = await actions.getMe();
      if (data?.success) {
        setUser(data.user);
      } else {
        window.location.href = "/login";
      }
      setLoading(false);
    }
    loadUser();
  }, []);
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsx(Loader2, { className: "h-12 w-12 animate-spin text-primary" }) });
  }
  const handleLogout = async () => {
    await actions.logout();
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  };
  return /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto space-y-10 pb-32", children: [
    /* @__PURE__ */ jsxs("section", { className: "bg-primary rounded-[3rem] p-8 md:p-14 text-white shadow-2xl shadow-primary/20 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx("div", { className: "h-40 w-40 rounded-[2.5rem] bg-white/10 backdrop-blur-xl flex items-center justify-center text-white border-2 border-white/20 shadow-2xl", children: /* @__PURE__ */ jsx(User, { className: "h-20 w-20" }) }),
          /* @__PURE__ */ jsx("button", { className: "absolute -bottom-2 -right-2 bg-secondary text-white p-3 rounded-2xl shadow-xl border-4 border-primary hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Camera, { className: "h-5 w-5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center md:text-left space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center md:justify-start gap-2 text-blue-200 font-bold text-xs uppercase tracking-widest", children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-3 w-3" }),
              "Active Calling"
            ] }),
            /* @__PURE__ */ jsx("h1", { className: "text-4xl md:text-5xl font-black tracking-tighter", children: user?.name || "Church Member" }),
            /* @__PURE__ */ jsx("p", { className: "text-blue-100/80 text-xl font-medium italic", children: user?.email })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap justify-center md:justify-start gap-3", children: [
            /* @__PURE__ */ jsxs("span", { className: "bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3" }),
              " Chapel West"
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "bg-white/10 px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-3 w-3" }),
              " Setting Apart: 2024"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 space-y-8", children: [
        /* @__PURE__ */ jsxs("section", { className: "bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-xl shadow-slate-200/40 space-y-8", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-black text-primary tracking-tight", children: "Security & Access" }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(ProfileCard, { icon: Mail, label: "Contact Email", value: user?.email }),
            /* @__PURE__ */ jsx(ProfileCard, { icon: Shield, label: "Access Level", value: "Organization Leader" }),
            /* @__PURE__ */ jsx(ProfileCard, { icon: Clock, label: "User ID", value: user?.$id }),
            /* @__PURE__ */ jsx(ProfileCard, { icon: Bell, label: "Status", value: user?.status ? "Active" : "Pending" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("section", { className: "bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/20", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-primary mb-6", children: "Recent Activity" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsx(ActivityItem, { label: "Sacrament Agenda Finalized", time: "2h ago", type: "Agenda" }),
            /* @__PURE__ */ jsx(ActivityItem, { label: "Attendance Exported", time: "Yesterday", type: "Data" }),
            /* @__PURE__ */ jsx(ActivityItem, { label: "System Backup Completed", time: "3 days ago", type: "System" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-surface-container-lowest p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-lg space-y-6 text-center", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-black text-primary", children: "Need Help?" }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant text-sm font-medium leading-relaxed", children: "Contact your Stake Technology Specialist for help with permissions or data sync issues." }),
          /* @__PURE__ */ jsx("button", { className: "w-full bg-surface-container-low py-4 rounded-2xl font-bold text-primary border border-outline-variant/20 hover:bg-surface-variant transition-colors", children: "Request Support" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleLogout,
            className: "w-full bg-rose-50 text-rose-600 py-6 rounded-[2.5rem] font-black flex items-center justify-center gap-3 border border-rose-100 hover:bg-rose-100 transition-all shadow-xl shadow-rose-900/5 active:scale-95",
            children: [
              /* @__PURE__ */ jsx(LogOut, { className: "h-6 w-6" }),
              "Sign Out"
            ]
          }
        )
      ] })
    ] })
  ] });
}
function ProfileCard({ icon: Icon, label, value }) {
  return /* @__PURE__ */ jsxs("div", { className: "bg-white p-6 rounded-3xl border border-outline-variant/10 group cursor-pointer hover:border-secondary/30 transition-all", children: [
    /* @__PURE__ */ jsx("div", { className: "bg-secondary/5 h-10 w-10 rounded-xl flex items-center justify-center text-secondary mb-4 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }) }),
    /* @__PURE__ */ jsx("p", { className: "text-[10px] font-black text-outline uppercase tracking-widest leading-none mb-2", children: label }),
    /* @__PURE__ */ jsx("p", { className: "text-sm font-black text-primary", children: value })
  ] });
}
function ActivityItem({ label, time, type }) {
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white transition-colors cursor-pointer", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("span", { className: "text-xs font-black text-secondary bg-secondary/10 px-2 py-1 rounded-lg uppercase tracking-tighter", children: type }),
      /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-primary", children: label })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-on-surface-variant", children: time })
  ] });
}

const $$Profile = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "My Profile" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Profile", Profile, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/pages/Profile", "client:component-export": "Profile" })} ` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/profile.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/profile.astro";
const $$url = "/profile";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Profile,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
