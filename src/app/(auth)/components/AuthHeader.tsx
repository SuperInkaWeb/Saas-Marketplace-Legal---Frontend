"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthHeader() {
  return (
    <div className="mb-12 sm:mb-20">
      <Link href="/" className="group flex flex-col gap-4 outline-none inline-flex">
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/5 p-1.5 rounded-md opacity-60 group-hover:opacity-100 transition-all duration-300 group-hover:bg-slate-900/10">
            <ChevronLeft className="w-4 h-4 text-slate-900" />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-slate-900 transition-colors">Volver al inicio</span>
        </div>
        <img 
          src="/logo full aboghub svg.svg" 
          alt="AbogHub" 
          className="h-9 sm:h-11 w-auto group-hover:scale-105 transition-transform duration-500 origin-left" 
        />
      </Link>
    </div>
  );
}
