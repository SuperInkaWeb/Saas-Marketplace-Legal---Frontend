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
  Send,
  FileText,
  UserCircle,
  X,
  Search,
  Plus,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// ── Case Card ───────────────────────────────────────────────────────

function PublicCaseCard({
  caseData,
  onSendProposal,
  isLawyer,
}: {
  caseData: CaseRequestResponse;
  onSendProposal: (c: CaseRequestResponse) => void;
  isLawyer: boolean;
}) {
  const timeAgo = format(new Date(caseData.createdAt), "d 'de' MMMM, yyyy", {
    locale: es,
  });

  return (
    <Link href={`/marketplace/cases/${caseData.publicId}`} className="block outline-none group h-full">
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 md:p-8 rounded-xl border border-outline-variant/20 hover:shadow-2xl hover:shadow-on-surface/5 transition-all relative overflow-hidden h-full flex flex-col"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary-container text-on-primary-container text-[10px] font-bold uppercase tracking-widest rounded-full">
                {caseData.specialtyName || "General"}
              </span>
              <span className="text-xs font-medium text-on-surface-variant">Publicado el {timeAgo}</span>
            </div>
            <h2 className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors font-manrope">
              {caseData.title}
            </h2>
          </div>
          <div className="md:text-right shrink-0">
            {caseData.budget != null ? (
              <>
                <span className="text-xl font-bold text-on-surface">${caseData.budget.toLocaleString("es-ES")}</span>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-semibold mt-1">
                  Presupuesto
                </p>
              </>
            ) : (
              <span className="text-sm font-bold text-on-surface-variant mt-2 inline-block">Sin presupuesto</span>
            )}
          </div>
        </div>

        {/* Render Quill HTML safely and apply line clamp */}
        <div 
          className="text-on-surface-variant font-body text-sm leading-relaxed mb-8 max-w-3xl line-clamp-3 prose prose-sm prose-slate max-w-none [&>p]:mb-1 [&>p]:inline"
          dangerouslySetInnerHTML={{ __html: caseData.description }}
        />

        <div className="mt-auto flex flex-wrap items-center gap-6 md:gap-8 border-t border-surface-container-low pt-6">
          <div className="flex items-center text-on-surface-variant">
            {caseData.clientAvatarUrl ? (
              <img 
                src={caseData.clientAvatarUrl} 
                alt={caseData.clientName}
                className="w-4 h-4 mr-2 rounded-full object-cover"
              />
            ) : (
              <UserCircle className="w-4 h-4 mr-2" />
            )}
            <span className="text-xs font-semibold uppercase tracking-tight truncate max-w-[120px]">
              {caseData.clientName}
            </span>
          </div>
          <div className="flex items-center text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
            <span className="text-xs font-semibold uppercase tracking-tight text-emerald-700">Verificado</span>
          </div>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              if (isLawyer) onSendProposal(caseData);
            }}
            className="ml-auto text-primary font-bold text-sm hover:underline transition-all"
          >
            {isLawyer ? "Enviar Propuesta" : "Ver Detalles"}
          </button>
        </div>
      </motion.article>
    </Link>
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
  const [proposedFee, setProposedFee] = useState<number | "">(
    selectedCase.budget || ""
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!proposalText.trim() || !proposedFee) {
      toast.error("Completa todos los campos");
      return;
    }
    
    if (proposalText.trim().length < 20) {
      toast.error("El plan de acción debe tener al menos 20 caracteres.");
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
      const respData = error.response?.data;
      let apiError = "Error al enviar la propuesta";
      
      if (respData) {
         if (respData.detail) apiError = respData.detail;
         else if (respData.title) apiError = respData.title;
         else if (respData.message) apiError = respData.message;
         
         if (Array.isArray(respData.errors) && respData.errors.length > 0) {
             apiError = respData.errors[0];
         }
      }
      toast.error(apiError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-container-low bg-surface-container-lowest">
          <div className="min-w-0 pr-4">
            <h2 className="text-xl font-black text-on-surface tracking-tight font-manrope">
              Enviar Propuesta
            </h2>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mt-1 truncate">
              {selectedCase.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface bg-surface shadow-sm p-2 rounded-full border border-outline-variant/20 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto space-y-6 bg-surface-container-lowest">
          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Tu Plan de Acción
            </label>
            <textarea
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              placeholder="Explícale al cliente cómo puedes ayudarle con su caso, tu experiencia relevante y plan de trabajo..."
              className="w-full text-sm rounded-xl border border-outline-variant/30 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none h-40"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-on-surface mb-2">
              Honorarios Propuestos (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-outline" />
              </div>
              <input
                type="number"
                value={proposedFee}
                onChange={(e) =>
                  setProposedFee(
                    e.target.value ? Number(e.target.value) : ""
                  )
                }
                placeholder="0.00"
                min={0}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-outline-variant/30 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-medium"
              />
            </div>
            {selectedCase.budget != null && (
              <p className="text-xs text-on-surface-variant mt-2">
                Presupuesto del cliente:{" "}
                <span className="font-bold text-emerald-600">
                  ${selectedCase.budget.toLocaleString("es-ES")} USD
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-surface-container-low bg-surface">
          <button
            disabled={submitting || !proposalText.trim() || !proposedFee}
            onClick={handleSubmit}
            className="w-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar Propuesta Formal
              </>
            )}
          </button>
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
  const [selectedCase, setSelectedCase] = useState<CaseRequestResponse | null>(
    null
  );

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
      toast.error("Error al cargar los casos disponibles");
    } finally {
      setLoading(false);
    }
  };

  // Client-side filter by search + specialty
  const filteredCases = cases.filter((c) => {
    const matchesQuery =
      !searchQuery ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty =
      !selectedSpecialty || c.specialtyName === selectedSpecialty;
    return matchesQuery && matchesSpecialty;
  });

  return (
    <>
      <Navbar />
      <main className="bg-surface pt-32 pb-20 px-8 max-w-screen-2xl mx-auto min-h-screen">
        
        {/* Hero Title Section */}
        <header className="mb-12 md:mb-16">
          <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-primary font-bold">
              Marketplace
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-on-surface mb-4 font-manrope">
                Casos Legales
              </h1>
              <p className="text-on-surface-variant max-w-2xl font-body text-lg leading-relaxed">
                Descubre mandatos legales de empresas y clientes verificados. Aplica a los casos que se ajusten a tu especialidad de experiencia.
              </p>
            </div>
            
            {isClient && (
              <Link
                href="/dashboard/my-cases"
                className="shrink-0 bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary font-bold text-sm py-3 px-6 rounded-xl shadow-sm transition-all flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Publicar un caso nuevo
              </Link>
            )}
          </div>

          {!hydrated ? null : !user ? (
            <div className="mt-8 p-4 bg-secondary-container/30 border border-secondary-container rounded-xl inline-block max-w-2xl">
              <p className="text-sm font-medium text-on-secondary-container">
                <Link
                  href="/register"
                  className="font-bold underline hover:text-primary transition-colors"
                >
                  Regístrate como abogado
                </Link>{" "}
                para enviar propuestas, o{" "}
                <Link
                  href="/register"
                  className="font-bold underline hover:text-primary transition-colors"
                >
                  como cliente
                </Link>{" "}
                para publicar tu caso legal.
              </p>
            </div>
          ) : null}
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 md:gap-12">
          
          {/* Sidebar Filters */}
          <aside className="space-y-10">
            <section>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant mb-5">
                Búsqueda Global
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Palabras clave..."
                  className="w-full pl-10 pr-4 py-3 bg-white border border-outline-variant/30 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium outline-none"
                />
              </div>
            </section>

            <section>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-on-surface-variant mb-5">
                Especialidad
              </h3>
              <div className="space-y-3">
                <label className="flex items-center group cursor-pointer">
                  <input
                    type="radio"
                    name="specialty"
                    checked={selectedSpecialty === ""}
                    onChange={() => setSelectedSpecialty("")}
                    className="rounded-full border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                  />
                  <span className={`ml-3 text-sm font-medium transition-colors ${selectedSpecialty === "" ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
                    Cualquier Especialidad
                  </span>
                </label>
                
                {specialties.map((s) => (
                  <label key={s.id} className="flex items-center group cursor-pointer">
                    <input
                      type="radio"
                      name="specialty"
                      checked={selectedSpecialty === s.name}
                      onChange={() => setSelectedSpecialty(s.name)}
                      className="rounded-full border-outline-variant text-primary focus:ring-primary/20 w-4 h-4 cursor-pointer"
                    />
                    <span className={`ml-3 text-sm font-medium transition-colors ${selectedSpecialty === s.name ? 'text-primary font-bold' : 'text-on-surface-variant group-hover:text-primary'}`}>
                      {s.name}
                    </span>
                  </label>
                ))}
              </div>
            </section>

          </aside>

          {/* Job Cards Section */}
          <section className="space-y-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface font-manrope">
                Resultados ({filteredCases.length})
              </h2>
            </div>

            {loading ? (
              <div className="grid gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-64 bg-surface-container-low rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : filteredCases.length === 0 ? (
              <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
                <FileText className="w-12 h-12 text-outline-variant mx-auto mb-4" />
                <h3 className="text-xl font-bold text-on-surface mb-2 font-manrope">
                  {cases.length === 0
                    ? "No hay casos disponibles"
                    : "No se encontraron resultados"}
                </h3>
                <p className="text-on-surface-variant max-w-sm mx-auto text-sm">
                  {cases.length === 0
                    ? "Los clientes publicarán sus casos aquí. ¡Vuelve más tarde!"
                    : "Intenta cambiar tus palabras de búsqueda o elige otra especialidad."}
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCases.map((c) => (
                    <PublicCaseCard
                      key={c.publicId}
                      caseData={c}
                      onSendProposal={setSelectedCase}
                      isLawyer={isLawyer}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )}
            
            {/* Show More Indicator (Aesthetic only for now) */}
            {filteredCases.length > 5 && (
              <div className="pt-12 flex justify-center">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-12 sm:w-24 bg-outline-variant/20"></div>
                  <span className="text-[11px] uppercase tracking-[0.3em] font-extrabold text-on-surface-variant">
                    Fin de los resultados
                  </span>
                  <div className="h-[1px] w-12 sm:w-24 bg-outline-variant/20"></div>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Proposal Modal */}
        <AnimatePresence>
          {selectedCase && (
            <ProposalModal
              selectedCase={selectedCase}
              onClose={() => setSelectedCase(null)}
              onSubmitted={fetchCases}
            />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
