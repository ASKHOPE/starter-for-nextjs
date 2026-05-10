import { c as createComponent } from './astro-component_nfC7UynX.mjs';
import 'piccolore';
import { q as renderComponent, r as renderTemplate, m as maybeRenderHead } from './server_CnwHzkPb.mjs';
import { $ as $$Layout } from './Layout_DD8YNFZ0.mjs';

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"> <div className="text-center space-y-2"> <h1 className="text-3xl font-bold text-primary">Welcome Back</h1> <p className="text-on-surface-variant">Sign in to manage your callings.</p> </div> <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/30 shadow-xl"> <div className="space-y-6"> <div className="space-y-2"> <label className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Email</label> <input type="email" placeholder="you@example.com" className="w-full bg-surface border border-outline-variant/50 rounded-xl px-4 py-3 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all"> </div> <button className="w-full bg-secondary text-on-secondary py-4 rounded-2xl font-bold shadow-lg shadow-secondary/20 active:scale-[0.98] transition-transform">
Send OTP
</button> </div> </div> </div> ` })}`;
}, "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/login.astro", void 0);

const $$file = "/Users/hosanna/Documents/GitHub/mychurchcallings/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
