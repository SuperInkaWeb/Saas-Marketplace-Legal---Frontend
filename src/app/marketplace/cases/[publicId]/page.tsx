"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";
import { marketplaceService } from "@/modules/marketplace/services/marketplaceService";
import type { CaseWithProposalsResponse } from "@/modules/marketplace/types";
import { CaseRequestStatus, ProposalStatus } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  DollarSign,
  Send,
  ArrowLeft,
  X,
  FileText,
  Briefcase,
  Clock,
  UserCircle,
  ShieldCheck,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// ── Proposal Modal ────────────────────────────────────────────────────────
function ProposalModal({
  selectedCase,
  onClose,
  onSubmitted,
}: {
  selectedCase: CaseWithProposalsResponse;
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
         // Verificamos si es un ProblemDetail (title/detail)
         if (respData.detail) apiError = respData.detail;
         else if (respData.title) apiError = respData.title;
         else if (respData.message) apiError = respData.message;
         
         // Si es un error de validación genérico con array de errores
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
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
            className="text-slate-400 hover:text-slate-900 bg-white shadow-sm p-2 rounded-full border border-slate-200 shrink-0 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Tu Plan de Acción
            </label>
            <textarea
              value={proposalText}
              onChange={(e) => setProposalText(e.target.value)}
              placeholder="Explícale al cliente cómo puedes ayudarle con su caso..."
              className="w-full text-sm font-medium rounded-2xl border border-slate-200 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none h-40 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
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
                  setProposedFee(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="0.00"
                min={0}
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-black text-lg bg-slate-50"
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100">
          <button
            disabled={submitting || !proposalText.trim() || !proposedFee}
            onClick={handleSubmit}
            className="w-full bg-primary text-white font-bold py-4 rounded-2xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-primary/95"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Confirmar Propuesta
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Status Badge Helper ─────────────────────────────────────────────
function ProposalBadge({ status }: { status: ProposalStatus }) {
  if (status === ProposalStatus.ACCEPTED) {
    return (
      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg uppercase tracking-widest border border-emerald-200">
        Aceptada
      </span>
    );
  }
  if (status === ProposalStatus.REJECTED) {
    return (
      <span className="px-3 py-1 bg-red-100 text-red-800 text-[10px] font-black rounded-lg uppercase tracking-widest border border-red-200">
        Rechazada
      </span>
    );
  }
  return (
    <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-lg uppercase tracking-widest border border-amber-200">
      En Revisión
    </span>
  );
}

// ── Main Detail Page ────────────────────────────────────────────────
export default function CaseDetailPage() {
  const { publicId } = useParams() as { publicId: string };
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isLawyer = user?.role === "LAWYER";
  
  const [caseData, setCaseData] = useState<CaseWithProposalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const data = await marketplaceService.getCaseDetail(publicId);
      setCaseData(data);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (publicId) fetchCase();
  }, [publicId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-surface pt-32 pb-20 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !caseData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-surface pt-32 pb-20 flex flex-col justify-center items-center">
          <FileText className="w-16 h-16 text-slate-300 mb-4" />
          <h1 className="text-3xl font-black text-slate-800 font-manrope">Caso no encontrado</h1>
          <p className="text-slate-500 mt-2 font-medium">El caso que buscas no existe o ha sido eliminado.</p>
          <Link href="/marketplace/cases" className="text-primary font-bold mt-6 inline-flex items-center gap-2 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Volver al tablero general
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const isOpen = caseData.status === CaseRequestStatus.OPEN;

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen bg-surface selection:bg-primary/20">
        {/* Breadcrumb & Navigation */}
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500">
            <Link href="/marketplace/cases" className="text-xs uppercase tracking-widest font-bold hover:text-primary transition-colors flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver a Marketplace
            </Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-xs uppercase tracking-widest font-black text-slate-800 truncate max-w-[200px] sm:max-w-xs">
              Detalle del Mandato
            </span>
          </div>
        </div>

        {/* Upper Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20">
          
          {/* Main Brief Content Card */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm relative overflow-hidden">
              {/* Decorative top bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-emerald-500"></div>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-md">
                  <Briefcase className="w-3.5 h-3.5 mr-1.5" />
                  {caseData.specialtyName || "General"}
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-widest rounded-md border border-slate-100">
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Publicado el {format(new Date(caseData.createdAt), "d MMM, yyyy", { locale: es })}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1] font-manrope">
                {caseData.title}
              </h1>
              
              <div className="h-px bg-slate-100 mb-8 w-full"></div>
              
              <div className="prose prose-slate prose-lg max-w-none">
                <div 
                  className="text-slate-600 font-medium leading-relaxed mb-8
                    [&>p]:mb-5 [&>h1]:text-2xl [&>h1]:font-black [&>h1]:mb-4 [&>h1]:text-slate-900 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:text-slate-900
                    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-5 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-5 [&>li]:mb-2"
                  dangerouslySetInnerHTML={{ __html: caseData.description }}
                />
              </div>
              
              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
                {caseData.clientAvatarUrl ? (
                  <img 
                    src={caseData.clientAvatarUrl} 
                    alt={caseData.clientName}
                    className="h-14 w-14 rounded-full object-cover border border-slate-200"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold border border-slate-200">
                    <UserCircle className="w-8 h-8" />
                  </div>
                )}
                <div>
                  <p className="font-black text-slate-900 flex items-center gap-1.5 text-lg">
                    {caseData.clientName}
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  </p>
                  <p className="text-sm text-emerald-600 font-bold">Identidad verificada en la plataforma</p>
                </div>
              </div>
            </div>
          </div>

          {/* Side Card: Stats & Actions */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 sticky top-28 shadow-[0_20px_40px_rgba(0,0,0,0.04)] border border-slate-200">
              <div className="space-y-8">
                <div>
                  <span className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                    <DollarSign className="w-4 h-4" /> Presupuesto
                  </span>
                  {caseData.budget != null ? (
                    <div className="text-4xl font-black text-emerald-600 font-manrope">
                      ${caseData.budget.toLocaleString("es-ES")} <span className="text-xl font-bold text-slate-400">USD</span>
                    </div>
                  ) : (
                    <div className="text-2xl font-black text-slate-500 font-manrope">A Convenir</div>
                  )}
                  <span className="text-sm text-slate-500 mt-2 block font-medium">Tarifa del cliente por el servicio completo</span>
                </div>
                
                <div className="h-px bg-slate-100"></div>
                
                <div>
                  <span className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                    <Lock className="w-4 h-4" /> Estado del Mandato
                  </span>
                  <div className="flex items-center gap-3">
                    {isOpen ? (
                      <span className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-black border border-emerald-100">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        Recibiendo Propuestas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-sm font-black border border-slate-200">
                        <Lock className="w-3.5 h-3.5" /> Caso Cerrado
                      </span>
                    )}
                  </div>
                </div>

                {token && isLawyer && isOpen && user?.isVerified && (
                  <div className="pt-4">
                    <button 
                      onClick={() => setShowProposalModal(true)}
                      className="w-full bg-primary hover:bg-primary/90 text-white py-4 rounded-xl font-black text-[15px] shadow-lg shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" /> Enviar Propuesta
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4 font-medium">Destácate enviando una propuesta formal</p>
                  </div>
                )}

                {token && isLawyer && isOpen && !user?.isVerified && (
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 mt-4">
                    <p className="text-[13px] text-amber-800 font-bold text-center leading-relaxed flex flex-col items-center gap-2">
                       <ShieldCheck className="w-6 h-6 text-amber-500 opacity-80" />
                       <span>Tu identidad aún no ha sido verificada.</span>
                       <span className="font-medium text-amber-700 font-normal">Para enviar propuestas, debes completar el proceso de verificación.</span>
                    </p>
                  </div>
                )}

                {!token && isOpen && (
                  <div className="pt-4">
                    <Link 
                      href="/login?redirect=/marketplace/cases/[publicId]"
                      as={`/login?redirect=/marketplace/cases/${publicId}`}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-xl font-black text-[15px] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      Inicia Sesión para Postular
                    </Link>
                    <p className="text-center text-xs text-slate-400 mt-4 font-medium italic">Debes ser un abogado registrado</p>
                  </div>
                )}

                {!isLawyer && isOpen && (
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mt-6">
                    <p className="text-[13px] text-primary-dim font-bold text-center leading-relaxed">
                      Solo los abogados certificados pueden mandar propuestas. Si este es tu caso, contrólalo en tu <Link href="/dashboard/my-cases" className="underline hover:text-primary transition-colors">Panel Cliente</Link>.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Lower Section: Proposals */}
        <section className="mt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-2 font-manrope">Ofertas Recibidas</h2>
              <p className="text-slate-500 font-medium">Profesionales legales que han mostrado interés real en este mandato.</p>
            </div>
            
            <div className="shrink-0 flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-sm font-black text-slate-700">
                {caseData.proposals?.length || 0} Expertos
              </span>
            </div>
          </div>

          {!caseData.proposals || caseData.proposals.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="w-20 h-20 bg-slate-50 flex justify-center items-center rounded-2xl mx-auto mb-6 border border-slate-100">
                <FileText className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 font-manrope">La oportunidad está libre</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-[15px] font-medium leading-relaxed">
                Los profesionales de la plataforma enviarán sus propuestas aquí.
              </p>
              {isLawyer && isOpen && user?.isVerified && (
                <button 
                  onClick={() => setShowProposalModal(true)}
                  className="mt-8 text-primary font-black hover:underline underline-offset-4"
                >
                  ¡Aplica ahora y sé el primero!
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {caseData.proposals.map((proposal) => (
                <div key={proposal.id} className="group bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden flex flex-col">
                  {/* Subtle Top Indicator */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-primary transition-colors duration-300"></div>

                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      {proposal.lawyerAvatarUrl ? (
                        <img 
                          src={proposal.lawyerAvatarUrl} 
                          alt={proposal.lawyerName}
                          className="h-14 w-14 rounded-2xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 text-xl font-black border border-slate-200 group-hover:border-primary/20 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                          {proposal.lawyerName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <h4 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">{proposal.lawyerName}</h4>
                        <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {format(new Date(proposal.createdAt), "d MMM, HH:mm", { locale: es })}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0 pl-2">
                       <span className="text-xl font-black text-slate-900 font-manrope">${proposal.proposedFee.toLocaleString("es-ES")}</span>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mb-6 flex-1">
                    <p className="text-slate-600 font-medium text-sm leading-relaxed line-clamp-3 whitespace-pre-wrap">
                      "{proposal.proposalText}"
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] font-black tracking-widest uppercase text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                        <ShieldCheck className="w-3.5 h-3.5" /> Identidad Verificada
                      </span>
                    </div>
                    <Link href={`/lawyer/${proposal.lawyerSlug}`} className="text-sm font-black text-primary hover:text-primary-dim transition-colors group-hover:underline underline-offset-4 flex items-center gap-1">
                      Ver Perfil <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Proposal Modal Form */}
        <AnimatePresence>
          {showProposalModal && (
            <ProposalModal
              selectedCase={caseData}
              onClose={() => setShowProposalModal(false)}
              onSubmitted={fetchCase}
            />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
