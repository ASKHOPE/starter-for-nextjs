"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  id: string;
  label: string;
  sublabel?: string;
  value: string;
}

interface AutocompleteInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
}

export function AutocompleteInput({ label, placeholder, value, onChange, options, className }: AutocompleteInputProps | { label: string, placeholder: string, value: string, onChange: (v: string) => void, options: string[], className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSearchTerm(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const normalizedOptions: Option[] = (options as any[]).map((opt, i) => 
    typeof opt === 'string' ? { id: `opt-${i}`, label: opt, value: opt } : opt
  );

  const filteredOptions = normalizedOptions.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opt.sublabel?.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10);

  const handleSelect = (opt: Option) => {
    setSearchTerm(opt.label);
    onChange(opt.value);
    setIsOpen(false);
  };

  return (
    <div className={`space-y-2 relative ${className || ''}`} ref={wrapperRef}>
      {label && <label className="text-[10px] font-[900] uppercase tracking-[0.2em] text-slate-400 ml-4">{label}</label>}
      <input 
        type="text" 
        placeholder={placeholder} 
        value={searchTerm} 
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onChange(e.target.value); // also update the parent with raw text if they type custom
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full rounded-2xl bg-slate-50 p-4 text-xs font-bold text-slate-900 border-none ring-1 ring-slate-100 outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
      />
      
      <AnimatePresence>
        {isOpen && filteredOptions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-48 overflow-y-auto no-scrollbar"
          >
            {filteredOptions.map((opt) => (
              <div 
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className="p-3 hover:bg-sky-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
              >
                <div className="text-xs font-bold text-slate-800">{opt.label}</div>
                {opt.sublabel && <div className="text-[10px] text-slate-400 font-medium truncate">{opt.sublabel}</div>}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
