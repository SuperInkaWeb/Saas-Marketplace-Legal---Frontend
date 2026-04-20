"use client";

import React from "react";
import Navbar from "../landing/Navbar";
import Footer from "../landing/Footer";
import { motion } from "framer-motion";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

export default function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  return (
    <div className="bg-surface min-h-screen selection:bg-accent/30">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-6 lg:px-12 pt-40 pb-32">
        {/* Header de Documento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 text-left border-l-4 border-accent pl-8 py-4"
        >
          <span className="font-inter text-[10px] uppercase tracking-[0.5em] text-accent mb-4 block font-black">
            Documentación Oficial / QORIBEX
          </span>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-primary uppercase font-manrope leading-[0.9]">
            {title}
          </h1>
          <p className="mt-6 text-secondary/40 font-inter text-xs tracking-widest uppercase font-bold">
            Última Actualización: {lastUpdated} • Jurisdicción: Perú
          </p>
        </motion.div>

        {/* Cuerpo del Documento */}
        <div className="bg-white border border-outline-variant/10 shadow-2xl p-8 md:p-16 lg:p-24 rounded-sm relative overflow-hidden">
          {/* Marca de agua sutil o detalle decorativo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          <div className="prose prose-slate prose-sm md:prose-base max-w-none 
            prose-headings:font-manrope prose-headings:uppercase prose-headings:tracking-tight prose-headings:font-black prose-headings:text-primary
            prose-p:font-inter prose-p:text-secondary/70 prose-p:leading-relaxed prose-p:text-justify
            prose-strong:text-primary prose-strong:font-black
            prose-li:text-secondary/70
            prose-hr:border-accent/10
          ">
            {children}
          </div>
        </div>

        {/* Pie de página del documento */}
        <div className="mt-12 text-center">
          <p className="text-[10px] text-secondary/30 uppercase tracking-[0.3em] font-bold">
            Fin del Documento / Reservados todos los derechos
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
