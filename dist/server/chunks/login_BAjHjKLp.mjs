import { c as createComponent } from './astro-component_CBny-ftk.mjs';
import 'piccolore';
import { T as renderTemplate } from './params-and-props_B3jbH-NX.mjs';
import { r as renderComponent } from './server_yjx_LAnn.mjs';
import { $ as $$Layout } from './Layout_6wALqu6j.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Loader2, ArrowRight, KeyRound, ChevronLeft, Church, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { a as actions } from './server_B_Pg_n71.mjs';

function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: actionError } = await actions.sendOTP({ email });
    if (actionError || !data?.success) {
      setError(actionError?.message || data?.error || "Failed to send OTP. Please check your email.");
    } else {
      setUserId(data.userId || "");
      setStep("otp");
    }
    setLoading(false);
  };
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { data, error: actionError } = await actions.verifyOTP({ userId, otp });
    if (actionError || !data?.success) {
      setError(actionError?.message || data?.error || "Invalid OTP. Please try again.");
    } else {
      localStorage.setItem("isLoggedIn", "true");
      window.location.href = "/";
    }
    setLoading(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-[80vh] flex flex-col items-center justify-center p-4", children: /* @__PURE__ */ jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      className: "w-full max-w-md bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/30 shadow-2xl shadow-slate-200/50 space-y-8 relative overflow-hidden",
      children: [
        /* @__PURE__ */ jsx("div", { className: "absolute -top-24 -right-24 h-48 w-48 bg-secondary/10 rounded-full blur-3xl" }),
        /* @__PURE__ */ jsx("div", { className: "absolute -bottom-24 -left-24 h-48 w-48 bg-primary/10 rounded-full blur-3xl" }),
        /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 relative z-10", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-primary h-16 w-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-primary/20 transform -rotate-6", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-8 w-8" }) }),
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-black text-primary tracking-tighter", children: step === "email" ? "Welcome Back" : "Verify Identity" }),
          /* @__PURE__ */ jsx("p", { className: "text-on-surface-variant font-medium", children: step === "email" ? "Access your organizational dashboard." : `We sent a code to ${email}` })
        ] }),
        error && /* @__PURE__ */ jsx("div", { className: "bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-bold border border-rose-100 animate-shake", children: error }),
        /* @__PURE__ */ jsx(AnimatePresence, { mode: "wait", children: step === "email" ? /* @__PURE__ */ jsxs(
          motion.form,
          {
            initial: { opacity: 0, x: -20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: 20 },
            onSubmit: handleSendOTP,
            className: "space-y-6 relative z-10",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2", children: "Email Address" }),
                /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsx(Mail, { className: "absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      placeholder: "bishop@ward.org",
                      className: "w-full bg-surface border border-outline-variant/40 pl-14 pr-6 py-5 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-primary",
                      required: true
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  disabled: loading,
                  className: "w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70",
                  children: [
                    loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : "Send Access Key",
                    !loading && /* @__PURE__ */ jsx(ArrowRight, { className: "h-5 w-5" })
                  ]
                }
              )
            ]
          },
          "email-form"
        ) : /* @__PURE__ */ jsxs(
          motion.form,
          {
            initial: { opacity: 0, x: 20 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -20 },
            onSubmit: handleVerifyOTP,
            className: "space-y-6 relative z-10",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("label", { className: "text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2", children: "6-Digit Code" }),
                /* @__PURE__ */ jsxs("div", { className: "relative group", children: [
                  /* @__PURE__ */ jsx(KeyRound, { className: "absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      value: otp,
                      onChange: (e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)),
                      placeholder: "000000",
                      className: "w-full bg-surface border border-outline-variant/40 pl-14 pr-6 py-5 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-center text-2xl tracking-[0.5em] text-primary",
                      required: true
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setStep("email"),
                    className: "bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-primary hover:bg-surface-variant transition-colors",
                    children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-6 w-6" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    disabled: loading || otp.length < 6,
                    className: "flex-1 bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50",
                    children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "h-5 w-5 animate-spin" }) : "Verify & Access"
                  }
                )
              ] })
            ]
          },
          "otp-form"
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 my-8", children: [
            /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-outline-variant/30" }),
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-black text-outline uppercase tracking-widest", children: "Authorized Only" }),
            /* @__PURE__ */ jsx("div", { className: "h-px flex-1 bg-outline-variant/30" })
          ] }),
          /* @__PURE__ */ jsxs("button", { className: "w-full bg-surface-container-low border border-outline-variant/30 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors", children: [
            /* @__PURE__ */ jsx(Church, { className: "h-5 w-5" }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "LDS Account" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => {
              document.cookie = `a_session_church=test-admin-session; path=/; max-age=3600; SameSite=Strict; Secure`;
              window.location.href = "/";
            },
            type: "button",
            className: "w-full bg-emerald-50 text-emerald-600 py-4 rounded-xl flex items-center justify-center gap-2 border border-emerald-100 hover:bg-emerald-100 transition-all mt-4",
            children: [
              /* @__PURE__ */ jsx(Sparkles, { className: "h-5 w-5" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs font-bold", children: "Temporary Test Access" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("p", { className: "text-center text-xs text-on-surface-variant font-medium relative z-10", children: [
          "Didn't get a code? ",
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setStep("email"), className: "text-secondary font-black hover:underline", children: "Resend Code" })
        ] })
      ]
    }
  ) });
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "LoginComponent", Login, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/Admin/Documents/Repo Proj/calling/src/components/pages/Login", "client:component-export": "Login" })} ` })}`;
}, "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/login.astro", void 0);

const $$file = "C:/Users/Admin/Documents/Repo Proj/calling/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
