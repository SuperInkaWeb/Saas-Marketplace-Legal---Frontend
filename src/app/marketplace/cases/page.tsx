"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { marketplaceService } from "@/modules/marketplace/services/marketplaceService";
import { marketplaceApi } from "@/modules/marketplace/api";
import type {
  CaseRequestResponse,
  SpecialtyResponse,
  CreateProposalRequest,
} from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Briefcase,
  DollarSign,
  Send,
  FileText,
  UserCircle,
  X,
  Clock,
  Search,
  SlidersHorizontal,
  Plus,
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
    <Link href={`/marketplace/cases/${caseData.publicId}`} className="block outline-none group">
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-300 overflow-hidden"
      >
      {/* Card Body */}
      <div className="p-6 md:p-7">
        {/* Top row: Specialty + Budget */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5" />
            {caseData.specialtyName || "General"}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 text-xs font-medium">
            <Clock className="w-3.5 h-3.5" />
            {timeAgo}
          </span>
          {caseData.budget != null && (
            <span className="ml-auto inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold px-4 py-1.5 rounded-full text-sm border border-emerald-200/60">
              <DollarSign className="w-4 h-4" />
              {caseData.budget.toLocaleString("es-ES")} USD
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-3 leading-tight group-hover:text-secondary transition-colors font-manrope">
          {caseData.title}
        </h3>

        {/* Render Quill HTML safely and apply line clamp */}
        <div 
          className="text-slate-600 text-sm leading-relaxed line-clamp-4 mb-6 prose prose-sm prose-slate max-w-none [&>p]:mb-1 [&>p]:inline"
          dangerouslySetInnerHTML={{ __html: caseData.description }}
        />

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <UserCircle className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">
                {caseData.clientName}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">
                Cliente verificado
              </p>
            </div>
          </div>

          {isLawyer && (
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent navigating to the case detail
                onSendProposal(caseData);
              }}
              className="bg-primary-container text-on-primary font-bold text-sm py-2.5 px-5 rounded-xl hover:opacity-90 transition-all active:scale-[0.97] flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <Send className="w-4 h-4" />
              Enviar Propuesta
            </button>
          )}
        </div>
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
      toast.error(
        error.response?.data?.message || "Error al enviar la propuesta"
      );
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
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="min-w-0 pr-4">
            <h2 className="text-xl font-black text-slate-900 tracking-tight font-manrope">
              Enviar Propuesta
            </h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1 truncate">
              {selectedCase.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 bg-white shadow-sm p-2 rounded-full border border-slate-200 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Tu Plan de Acción
            </label>
            <textarea
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              placeholder="Explícale al cliente cómo puedes ayudarle con su caso, tu experiencia relevante y plan de trabajo..."
              className="w-full text-sm rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none resize-none h-40"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Honorarios Propuestos (USD)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-slate-400" />
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
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none font-medium"
              />
            </div>
            {selectedCase.budget != null && (
              <p className="text-xs text-slate-500 mt-2">
                Presupuesto del cliente:{" "}
                <span className="font-bold text-emerald-600">
                  ${selectedCase.budget.toLocaleString("es-ES")} USD
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100">
          <button
            disabled={submitting || !proposalText.trim() || !proposedFee}
            onClick={handleSubmit}
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
  const isLawyer = user?.role === "LAWYER";
  const isClient = user?.role === "CLIENT";

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
      <div className="min-h-screen bg-surface selection:bg-secondary/30 pt-28 pb-20 px-6 sm:px-12">
        {/* Hero Header */}
        <header className="max-w-5xl mx-auto mb-12">
          <nav className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-on-surface-variant mb-4">
            <Link href="/" className="hover:text-secondary transition-colors">
              Inicio
            </Link>
            <span className="material-symbols-outlined text-sm">
              chevron_right
            </span>
            <span className="text-secondary font-bold">
              Casos Legales Abiertos
            </span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-primary mb-3 font-manrope">
            Tablero de Casos
          </h1>
          <p className="text-on-surface-variant font-medium text-lg max-w-2xl">
            Necesidades legales publicadas por clientes verificados. Encuentra un
            caso afín a tu especialidad y envía tu propuesta.
          </p>

          {/* CTA for clients */}
          {isClient && (
            <Link
              href="/dashboard/my-cases"
              className="mt-6 inline-flex items-center gap-2 bg-primary-container text-on-primary font-bold text-sm py-3 px-6 rounded-xl shadow-md hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Publicar mi caso
            </Link>
          )}

          {!hydrated ? null : !user ? (
            <div className="mt-6 p-4 bg-secondary/5 border border-secondary/15 rounded-xl inline-block">
              <p className="text-sm text-on-surface-variant">
                <Link
                  href="/register"
                  className="text-secondary font-bold hover:underline"
                >
                  Regístrate como abogado
                </Link>{" "}
                para enviar propuestas o{" "}
                <Link
                  href="/register"
                  className="text-secondary font-bold hover:underline"
                >
                  como cliente
                </Link>{" "}
                para publicar tu caso.
              </p>
            </div>
          ) : null}
        </header>

        {/* Search & Filters */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título o descripción..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none font-medium"
              />
            </div>
            <div className="relative flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="appearance-none pl-2 pr-8 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none font-medium min-w-[180px]"
              >
                <option value="">Todas las especialidades</option>
                {specialties.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cases Listing */}
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-52 bg-surface-container-low rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
              <FileText className="w-14 h-14 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-black text-primary tracking-tight font-manrope">
                {cases.length === 0
                  ? "No hay casos publicados aún"
                  : "No se encontraron resultados"}
              </h3>
              <p className="text-on-surface-variant mt-2 max-w-md mx-auto">
                {cases.length === 0
                  ? "Sé el primero en publicar una necesidad legal y recibe propuestas de abogados calificados."
                  : "Intenta ajustar tus filtros de búsqueda para encontrar casos."}
              </p>
              {isClient && cases.length === 0 && (
                <Link
                  href="/dashboard/my-cases"
                  className="mt-6 inline-flex items-center gap-2 bg-secondary text-white font-bold text-sm py-3 px-6 rounded-xl shadow-md hover:opacity-90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Publicar el primer caso
                </Link>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm font-bold text-on-surface-variant mb-6">
                {filteredCases.length} caso
                {filteredCases.length !== 1 && "s"} disponible
                {filteredCases.length !== 1 && "s"}
              </p>
              <div className="grid gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCases.map((c, index) => (
                    <PublicCaseCard
                      key={c.publicId}
                      caseData={c}
                      onSendProposal={setSelectedCase}
                      isLawyer={isLawyer}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
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
      </div>
      <Footer />
    </>
  );
}
