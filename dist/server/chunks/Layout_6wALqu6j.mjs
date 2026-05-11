import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { a4 as addAttribute, bk as renderHead, T as renderTemplate, D as renderSlot } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_yjx_LAnn.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { Bell, User, Home, Calendar, BookOpen, Wrench } from 'lucide-react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function TopAppBar() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const toggleAccount = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (isLoggedIn) {
      window.location.href = "/profile";
    } else {
      window.location.href = "/login";
    }
  };
  return /* @__PURE__ */ jsx("header", { className: "bg-surface sticky top-0 z-40 w-full border-b border-outline-variant/10 shadow-sm backdrop-blur-md", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-16 items-center justify-between px-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-headline-lg text-xl font-black tracking-tighter text-primary md:hidden", children: "MyChurchCalling" }),
    /* @__PURE__ */ jsx("div", { className: "hidden md:block flex-1" }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setIsNotificationsOpen(!isNotificationsOpen),
          className: "text-on-surface-variant hover:bg-surface-container-low rounded-full p-2 transition-colors",
          children: /* @__PURE__ */ jsx(Bell, { className: "h-6 w-6" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleAccount,
          className: "text-primary hover:bg-surface-container-low rounded-full p-2 transition-colors border border-outline-variant/30",
          children: /* @__PURE__ */ jsx(User, { className: "h-6 w-6" })
        }
      )
    ] })
  ] }) });
}

function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Plan", icon: Calendar, href: "/plan/sunday" },
  { label: "Resources", icon: BookOpen, href: "/resources" },
  { label: "Tools", icon: Wrench, href: "/tools" }
];
function BottomNav({ pathname = "/" }) {
  return /* @__PURE__ */ jsx("nav", { className: "bg-white/95 backdrop-blur-xl fixed bottom-0 left-0 z-50 w-full rounded-t-[2rem] px-4 pb-8 pt-4 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] border-t border-outline-variant/10", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-around", children: navItems.map((item) => {
    const isActive = pathname === item.href || item.href !== "/" && pathname.startsWith(item.href);
    return /* @__PURE__ */ jsxs(
      "a",
      {
        href: item.href,
        className: cn(
          "flex flex-col items-center justify-center px-6 py-1 transition-all duration-200 active:scale-90",
          isActive ? "bg-secondary-container text-on-secondary-container rounded-full" : "text-on-surface-variant hover:text-secondary"
        ),
        children: [
          /* @__PURE__ */ jsx(item.icon, { className: cn("h-6 w-6", isActive && "fill-current") }),
          /* @__PURE__ */ jsx("span", { className: "font-label-sm mt-0.5 text-[10px] font-medium", children: item.label })
        ]
      },
      item.label
    );
  }) }) });
}

const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Layout;
  const { title } = Astro2.props;
  const pathname = Astro2.url.pathname;
  return renderTemplate`<html lang="en"> <head><meta charset="UTF-8"><meta name="description" content="MyChurchCalling Platform"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>${title ? `${title} | MyChurchCalling` : "MyChurchCalling"}</title><link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">${renderHead()}</head> <body class="antialiased min-h-screen bg-background text-on-background"> <div class="flex flex-col md:flex-row max-w-full mx-auto min-h-screen relative overflow-x-hidden">  <aside class="hidden md:flex w-72 h-screen sticky top-0 border-r border-outline-variant/20 bg-surface-container-lowest z-30 flex-col"> <div class="p-8 space-y-10"> <div class="flex items-center gap-3"> <div class="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-primary/20"> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> </div> <span class="font-black text-2xl text-primary tracking-tighter">MyChurchCalling</span> </div> <nav class="space-y-3"> ${[
    { label: "Dashboard", href: "/" },
    { label: "Sunday Architect", href: "/plan/sunday" },
    { label: "Sacred Library", href: "/resources" },
    { label: "Admin Tools", href: "/tools" }
  ].map((item) => renderTemplate`<a${addAttribute(item.href, "href")}${addAttribute(`flex items-center gap-4 px-5 py-4 rounded-[1.5rem] font-black text-sm transition-all group ${pathname === item.href || item.href !== "/" && pathname.startsWith(item.href) ? "bg-secondary text-white shadow-xl shadow-secondary/20" : "text-on-surface-variant hover:bg-secondary/5 hover:text-secondary"}`, "class")}> ${item.label} </a>`)} </nav> </div> </aside>  <div class="flex-1 flex flex-col min-h-screen min-w-0"> ${renderComponent($$result, "TopAppBar", TopAppBar, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/layout/TopAppBar", "client:component-export": "TopAppBar" })} <main class="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-12 py-8 md:py-12 pb-32 md:pb-12"> <div class="animate-in fade-in slide-in-from-bottom-6 duration-1000"> ${renderSlot($$result, $$slots["default"])} </div> </main> </div> </div>  <div class="md:hidden"> ${renderComponent($$result, "BottomNav", BottomNav, { "client:load": true, "pathname": pathname, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/layout/BottomNav", "client:component-export": "BottomNav" })} </div></body></html>`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/layouts/Layout.astro", void 0);

export { $$Layout as $ };
