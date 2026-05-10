import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Mail, Sparkles, ArrowRight, ShieldCheck, Church, ChevronLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { actions } from "astro:actions";

export function Login() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
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

  const handleVerifyOTP = async (e: React.FormEvent) => {
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

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-surface-container-lowest p-10 rounded-[3rem] border border-outline-variant/30 shadow-2xl shadow-slate-200/50 space-y-8 relative overflow-hidden"
      >
        {/* Decorative Background Blob */}
        <div className="absolute -top-24 -right-24 h-48 w-48 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 bg-primary/10 rounded-full blur-3xl" />

        <div className="text-center space-y-3 relative z-10">
          <div className="bg-primary h-16 w-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-primary/20 transform -rotate-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-primary tracking-tighter">
            {step === "email" ? "Welcome Back" : "Verify Identity"}
          </h1>
          <p className="text-on-surface-variant font-medium">
            {step === "email" 
              ? "Access your organizational dashboard." 
              : `We sent a code to ${email}`}
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-xs font-bold border border-rose-100 animate-shake">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.form 
              key="email-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP} 
              className="space-y-6 relative z-10"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bishop@ward.org" 
                    className="w-full bg-surface border border-outline-variant/40 pl-14 pr-6 py-5 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-primary"
                    required
                  />
                </div>
              </div>

              <button 
                disabled={loading}
                className="w-full bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Access Key"}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
            </motion.form>
          ) : (
            <motion.form 
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP} 
              className="space-y-6 relative z-10"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant ml-2">6-Digit Code</label>
                <div className="relative group">
                  <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-outline group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="000000" 
                    className="w-full bg-surface border border-outline-variant/40 pl-14 pr-6 py-5 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-center text-2xl tracking-[0.5em] text-primary"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setStep("email")}
                  className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30 text-primary hover:bg-surface-variant transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button 
                  disabled={loading || otp.length < 6}
                  className="flex-1 bg-primary text-white py-5 rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Access"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <div className="flex items-center gap-4 my-8">
            <div className="h-px flex-1 bg-outline-variant/30" />
            <span className="text-[10px] font-black text-outline uppercase tracking-widest">Authorized Only</span>
            <div className="h-px flex-1 bg-outline-variant/30" />
          </div>
          <button className="w-full bg-surface-container-low border border-outline-variant/30 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors">
            <Church className="h-5 w-5" />
            <span className="text-xs font-bold">LDS Account</span>
          </button>
        </div>

        <button 
          onClick={() => {
            document.cookie = `a_session_church=test-admin-session; path=/; max-age=3600; SameSite=Strict; Secure`;
            window.location.href = "/";
          }}
          type="button"
          className="w-full bg-emerald-50 text-emerald-600 py-4 rounded-xl flex items-center justify-center gap-2 border border-emerald-100 hover:bg-emerald-100 transition-all mt-4"
        >
          <Sparkles className="h-5 w-5" />
          <span className="text-xs font-bold">Temporary Test Access</span>
        </button>

        <p className="text-center text-xs text-on-surface-variant font-medium relative z-10">
          Didn't get a code? <button type="button" onClick={() => setStep("email")} className="text-secondary font-black hover:underline">Resend Code</button>
        </p>
      </motion.div>
    </div>
  );
}
