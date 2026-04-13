"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { marketplaceService } from "@/modules/marketplace/services/marketplaceService";
import { marketplaceApi } from "@/modules/marketplace/api";
import type {
  CaseRequestResponse,
  SpecialtyResponse
} from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DollarSign,
  FileText,
  UserCircle,
  X,
  Search,
  Plus,
  ShieldCheck,
  Loader2,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// ── Motion Variants ────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } 
  },
};

// ── Case Card (Lex Architect Style) ─────────────────────────────────

function PublicCaseCard({
  caseData,
  onSendProposal,
  isLawyer,
  isVerified,
}: {
  caseData: CaseRequestResponse;
  onSendProposal: (c: CaseRequestResponse) => void;
  isLawyer: boolean;
  isVerified: boolean;
}) {
  const timeAgo = format(new Date(caseData.createdAt), "d 'de' MMMM, yyyy", {
    locale: es,
  });

  return (
    <motion.article
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: "easeOut" } }}
      className="bg-surface-container-lowest p-8 border border-outline-variant/10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.05)] transition-shadow group relative"
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-8 mb-10">
        <div>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="px-4 py-1.5 bg-primary text-on-primary text-[9px] font-black uppercase tracking-[0.2em]"
            >
              {caseData.specialtyName || "General"}
            </motion.span>
            <span className="text-[10px] font-bold text-secondary/60 uppercase tracking-widest">{timeAgo}</span>
          </div>
          <Link href={`/marketplace/cases/${caseData.publicId}`}>
            <h2 className="text-3xl md:text-4xl font-black text-primary group-hover:text-accent transition-colors font-manrope leading-none uppercase tracking-tighter">
              {caseData.title}
            </h2>
          </Link>
        </div>
        
        <div className="md:text-right shrink-0 border-l-2 border-accent pl-6 md:pl-0 md:border-l-0 md:border-r-2 md:pr-6">
          <motion.span 
            className="text-3xl font-black text-primary font-manrope block"
            whileHover={{ scale: 1.05 }}
          >
            {caseData.budget != null ? `$${caseData.budget.toLocaleString("es-ES")}` : "A DEFINIR"}
          </motion.span>
          <p className="text-[9px] text-secondary/40 uppercase tracking-[0.3em] font-black mt-2">
            Presupuesto Base
          </p>
        </div>
      </div>

      <div 
        className="text-secondary/70 font-medium text-sm leading-relaxed mb-10 line-clamp-3 prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: caseData.description }}
      />

      <div className="mt-auto flex flex-wrap items-center justify-between gap-6 pt-10 border-t border-outline-variant/10">
        <div className="flex items-center gap-8">
            <div className="flex items-center text-primary">
                <div className="w-8 h-8 bg-surface-container-low flex items-center justify-center mr-3 border border-outline-variant/20 overflow-hidden">
                    {caseData.clientAvatarUrl ? (
                        <img src={caseData.clientAvatarUrl} className="w-full h-full object-cover" />
                    ) : (
                        <UserCircle className="w-4 h-4 text-outline-variant" />
                    )}
                </div>
                <span className="text-[10px] font-black uppercase tracking-tight">
                    {caseData.clientName}
                </span>
            </div>
            <div className="flex items-center text-accent">
                <ShieldCheck className="w-4 h-4 mr-2" />
                <span className="text-[9px] font-black uppercase tracking-widest">Verificado</span>
            </div>
        </div>
        
        <div className="flex items-center gap-6">
            <Link 
                href={`/marketplace/cases/${caseData.publicId}`}
                className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.2em] hover:text-primary transition-colors flex items-center gap-2 group/link"
            >
                Detalles Tecnicos
                <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
            </Link>
            
            {(isLawyer && isVerified) ? (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSendProposal(caseData)}
                    className="bg-primary hover:bg-black text-on-primary px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all shadow-xl"
                >
                    Presentar Postulación
                </motion.button>
            ) : (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                        href="/login"
                        className="bg-accent/10 text-accent px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-accent/20 transition-all border border-accent/20 inline-block"
                    >
                        Login para Postular
                    </Link>
                </motion.div>
            )}
        </div>
      </div>
    </motion.article>
  );
}

// ── Proposal Modal ──────────────────────────────────────────────────

function ProposalModal({
  selectedCase,
  onClose,
  onSubmitted,
}: {
  selectedCase: CaseRequestResponse;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [proposalText, setProposalText] = useState("");
  const [proposedFee, setProposedFee] = useState<number | "">(selectedCase.budget || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!proposalText.trim() || !proposedFee) {
      toast.error("Completa todos los campos");
      return;
    }
    
    try {
      setSubmitting(true);
      await marketplaceService.submitProposal(selectedCase.publicId, {
        proposalText: proposalText.trim(),
        proposedFee: Number(proposedFee),
      });
      toast.success("¡Propuesta enviada exitosamente!");
      onSubmitted();
      onClose();
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Error al enviar la propuesta";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-primary/90 backdrop-blur-md p-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-surface-container-lowest shadow-[0_40px_100px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-outline-variant/10"
      >
        <div className="flex items-center justify-between p-10 border-b border-outline-variant/10 bg-surface-container-low/30">
          <div className="border-l-4 border-accent pl-6">
            <h2 className="text-2xl font-black text-primary uppercase tracking-tighter">Propuesta Técnica</h2>
            <p className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.3em] mt-2 line-clamp-1">{selectedCase.title}</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose} 
            className="bg-surface-container-lowest p-3 text-outline-variant hover:text-primary transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="p-10 overflow-y-auto custom-scrollbar space-y-10">
          <div className="space-y-4">
            <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em]">Plan de Ejecución Legal</label>
            <textarea
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              placeholder="Explique su estrategia jurídica..."
              className="w-full text-sm font-medium text-secondary bg-surface-container-low border border-outline-variant/10 p-6 focus:ring-1 focus:ring-accent outline-none resize-none h-48 transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-[10px] font-black text-primary uppercase tracking-[0.3em]">Honorarios Propuestos (USD)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-accent" />
              </div>
              <input
                type="number"
                value={proposedFee}
                onChange={(e) => setProposedFee(e.target.value ? Number(e.target.value) : "")}
                placeholder="0.00"
                className="w-full pl-12 pr-6 py-5 bg-surface-container-lowest border border-outline-variant/10 text-xl font-black text-primary focus:ring-1 focus:ring-accent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="p-10 border-t border-outline-variant/10">
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "#000" }}
            whileTap={{ scale: 0.98 }}
            disabled={submitting || !proposalText.trim() || !proposedFee}
            onClick={handleSubmit}
            className="w-full bg-primary text-on-primary text-[10px] font-black uppercase tracking-[0.3em] py-6 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin text-on-primary" /> : "Ejecutar Postulación Pública"}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────

export default function PublicCaseBoardPage() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const role = user?.role?.toUpperCase().trim();
  const isLawyer = role === "LAWYER" || role === "ROLE_LAWYER";
  const isClient = role === "CLIENT" || role === "ROLE_CLIENT";

  const [cases, setCases] = useState<CaseRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<CaseRequestResponse | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);

  useEffect(() => {
    fetchCases();
    marketplaceApi.getAllSpecialties().then(setSpecialties).catch(() => {});
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getOpenCases();
      setCases(data);
    } catch {
      toast.error("Error al cargar los casos");
    } finally {
      setLoading(false);
    }
  };

  const filteredCases = cases.filter((c) => {
    const matchesQuery = !searchQuery || 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || c.specialtyName === selectedSpecialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      
      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-1 pt-40 pb-32 px-6 lg:px-12 max-w-[1920px] mx-auto w-full"
      >
        
        {/* Architectural Header */}
        <header className="mb-24">
          <motion.nav 
            variants={itemVariants}
            className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-secondary/40 mb-10"
          >
            <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary border-b border-accent">Mercado de Casos</span>
          </motion.nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <motion.div variants={itemVariants} className="border-l-4 border-accent pl-10">
              <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-primary uppercase font-manrope leading-[0.85]">
                Mercado Global <br /> de Justicia
              </h1>
              <p className="text-secondary/60 max-w-2xl font-inter text-base mt-10 leading-relaxed">
                Explore nuestra galería pública de demandas y licitaciones legales. Una infraestructura transparente diseñada para conectar el prestigio técnico con la necesidad jurídica real.
              </p>
            </motion.div>
            
            {isClient && (
              <motion.div variants={itemVariants}>
                <Link
                  href="/dashboard/my-cases"
                  className="shrink-0 bg-primary text-on-primary font-black text-[10px] uppercase tracking-[0.3em] py-6 px-12 shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-4"
                >
                  <Plus className="w-4 h-4 text-accent" />
                  Publicar Requerimiento
                </Link>
              </motion.div>
            )}
          </div>
        </header>

        {/* Search & Filter Bar */}
        <motion.div variants={itemVariants} className="mb-20 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
            <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary/40 group-focus-within:text-accent transition-colors" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="BUSCAR PRECEDENTES O PALABRAS CLAVE..."
                    className="w-full pl-16 pr-8 py-6 bg-surface-container-lowest border border-outline-variant/10 text-[10px] font-black uppercase tracking-[0.2em] focus:outline-none focus:ring-1 focus:ring-accent transition-all outline-none shadow-sm"
                />
            </div>
            <div className="flex flex-wrap items-center gap-3 bg-surface-container-lowest p-2 border border-outline-variant/10 shadow-sm overflow-x-auto scrollbar-hide">
                <button
                    onClick={() => setSelectedSpecialty("")}
                    className={`relative px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${selectedSpecialty === "" ? "text-on-primary" : "text-secondary/40 hover:bg-surface-container-low"}`}
                >
                    {selectedSpecialty === "" && (
                        <motion.div layoutId="activeSpecBg" className="absolute inset-0 bg-primary z-0" />
                    )}
                    <span className="relative z-10">Todas las Áreas</span>
                </button>
                {specialties.map((s) => (
                    <button
                        key={s.id}
                        onClick={() => setSelectedSpecialty(s.name)}
                        className={`relative px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${selectedSpecialty === s.name ? "text-on-primary" : "text-secondary/40 hover:bg-surface-container-low"}`}
                    >
                        {selectedSpecialty === s.name && (
                            <motion.div layoutId="activeSpecBg" className="absolute inset-0 bg-primary z-0" />
                        )}
                        <span className="relative z-10">{s.name}</span>
                    </button>
                ))}
            </div>
        </motion.div>

        {/* Content Section */}
        <div className="relative">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-8">
                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                    <span className="text-[10px] font-black text-secondary/40 uppercase tracking-[0.4em]">Sincronizando Archivos de Justicia...</span>
                </div>
            ) : filteredCases.length === 0 ? (
                <div className="text-center py-40 bg-surface-container-lowest border border-outline-variant/10 shadow-[0_20px_60px_rgba(0,0,0,0.02)]">
                    <FileText className="w-16 h-16 text-outline-variant mx-auto mb-10" />
                    <h3 className="text-xl font-black text-primary uppercase tracking-[0.3em]">No hay casos registrados</h3>
                    <p className="text-secondary/40 text-[11px] uppercase tracking-[0.2em] mt-6">La galería pública se encuentra vacía o no hay coincidencias con su búsqueda.</p>
                </div>
            ) : (
                <motion.div 
                    variants={containerVariants}
                    className="grid grid-cols-1 gap-10"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredCases.map((c) => (
                            <PublicCaseCard
                                key={c.publicId}
                                caseData={c}
                                onSendProposal={setSelectedCase}
                                isLawyer={isLawyer}
                                isVerified={user?.isVerified === true}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
      </motion.main>
      
      <Footer />

      {/* Modal Integration */}
      <AnimatePresence>
        {selectedCase && (
          <ProposalModal
            selectedCase={selectedCase}
            onClose={() => setSelectedCase(null)}
            onSubmitted={fetchCases}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
