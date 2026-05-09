"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, CloudCheck, WifiOff } from 'lucide-react';

interface AuthSectionProps {
  step: string;
  email: string;
  setEmail: (e: string) => void;
  otp: string;
  setOtp: (o: string) => void;
  isSyncing: boolean;
  isOnline: boolean;
  handleSendOTP: (e: React.FormEvent) => void;
  handleVerifyOTP: (e: React.FormEvent) => void;
  handleLogout: () => void;
  user: any;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  step,
  email,
  setEmail,
  otp,
  setOtp,
  isSyncing,
  isOnline,
  handleSendOTP,
  handleVerifyOTP,
  handleLogout,
  user
}) => {
  if (step === 'login') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-900">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative h-24 w-24 rounded-[2.5rem] bg-sky-500 flex items-center justify-center text-white shadow-2xl shadow-sky-500/50">
              <CloudCheck size={48} strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-[900] text-white tracking-tight">Gospel Agenda</h1>
          <p className="mb-12 text-slate-400 font-medium">Sacred coordination for inspired leaders.</p>
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div className="relative group">
              <input type="email" placeholder="Email Address" className="w-full rounded-2xl bg-white/5 p-5 text-sm font-bold text-white border-none ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all placeholder:text-white/20" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <button type="submit" disabled={isSyncing} className="premium-button w-full rounded-2xl py-5 font-bold text-white shadow-xl shadow-sky-500/20 active:scale-[0.98] transition-all disabled:opacity-50">
              {isSyncing ? "Preparing Light..." : "Access Portal"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  if (step === 'otp') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-900">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm text-center">
          <h2 className="mb-3 text-2xl font-[900] text-white">Identity Verification</h2>
          <p className="mb-8 text-slate-400 font-medium">We've sent a code to your celestial mailbox.</p>
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <input type="text" placeholder="Enter 6-digit Code" className="w-full rounded-2xl bg-white/5 p-5 text-center text-2xl font-[900] tracking-[0.5em] text-white border-none ring-1 ring-white/10 focus:ring-2 focus:ring-sky-500/50 outline-none transition-all" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
            <button type="submit" disabled={isSyncing} className="premium-button w-full rounded-2xl py-5 font-bold text-white shadow-xl shadow-sky-500/20 active:scale-[0.98] transition-all disabled:opacity-50">
              {isSyncing ? "Verifying..." : "Confirm Identity"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-8 pt-12">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center text-white text-xl font-[900] shadow-lg">
            {user?.name?.charAt(0) || "G"}
          </div>
          <div className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-slate-50 flex items-center justify-center ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}>
            {!isOnline && <WifiOff size={8} className="text-white" />}
          </div>
        </div>
        <div>
          <h2 className="text-xs font-[900] uppercase tracking-widest text-primary/40 mb-1">Inspired Leader</h2>
          <p className="text-lg font-[900] text-slate-900 tracking-tight">{user?.name || "Member"}</p>
        </div>
      </div>
      <button onClick={handleLogout} className="rounded-2xl bg-white p-4 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all shadow-sm border border-slate-100 active:scale-90">
        <LogOut size={20} />
      </button>
    </div>
  );
};
