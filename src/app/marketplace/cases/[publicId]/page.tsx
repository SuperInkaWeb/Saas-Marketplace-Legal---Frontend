"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuthStore } from "@/modules/auth/store";
import { marketplaceService } from "@/modules/marketplace/services/marketplaceService";
import type { CaseWithProposalsResponse, ClientProposalResponse } from "@/modules/marketplace/types";
import { CaseRequestStatus, ProposalStatus } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Briefcase,
  DollarSign,
  Clock,
  UserCircle,
  ShieldCheck,
  Send,
  Lock,
  ArrowLeft,
  FileText,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

// Status Badge Helper
function ProposalBadge({ status }: { status: ProposalStatus }) {
  if (status === ProposalStatus.ACCEPTED) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Aceptada
      </span>
    );
  }
  if (status === ProposalStatus.REJECTED) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
        Rechazada
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
      Pendiente
    </span>
  );
}

export default function CaseDetailPage() {
  const { publicId } = useParams() as { publicId: string };
  const user = useAuthStore((s) => s.user);
  const isLawyer = user?.role === "LAWYER";
  
  const [caseData, setCaseData] = useState<CaseWithProposalsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchCase() {
      try {
        setLoading(true);
        const data = await marketplaceService.getCaseDetail(publicId);
        setCaseData(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    if (publicId) fetchCase();
  }, [publicId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-surface pt-32 pb-20 px-6 sm:px-12 flex justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary" />
        </div>
        <Footer />
      </>
    );
  }

  if (error || !caseData) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-surface pt-32 pb-20 px-6 sm:px-12 text-center">
          <h1 className="text-3xl font-black text-primary font-manrope">Caso no encontrado</h1>
          <p className="text-on-surface-variant mt-4">El caso que buscas no existe o ha sido eliminado.</p>
          <Link href="/marketplace/cases" className="text-secondary font-bold mt-6 inline-block hover:underline">
            ← Volver al tablero
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
      <div className="min-h-screen bg-surface selection:bg-secondary/30 pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Link href="/marketplace/cases" className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-secondary transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver a todos los casos
          </Link>

          {/* Main Case Info */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-8">
            <div className="p-8 md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 text-secondary text-xs font-black uppercase tracking-widest">
                    <Briefcase className="w-4 h-4" />
                    {caseData.specialtyName || "General"}
                  </span>
                  {!isOpen && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-black uppercase tracking-widest">
                      <Lock className="w-4 h-4" />
                      Cerrado
                    </span>
                  )}
                </div>
                {caseData.budget != null && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold px-5 py-2 rounded-full text-lg border border-emerald-200/60">
                    <DollarSign className="w-5 h-5" />
                    {caseData.budget.toLocaleString("es-ES")} USD
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-8 font-manrope">
                {caseData.title}
              </h1>

              {/* Rich Text Editor Content */}
              <div className="mb-10">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  Descripción del Caso
                </h3>
                <div 
                  className="prose prose-slate max-w-none text-slate-700 leading-relaxed 
                    [&>p]:mb-4 [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 
                    [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4"
                  dangerouslySetInnerHTML={{ __html: caseData.description }}
                />
              </div>

              {/* Footer Meta */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                    <UserCircle className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                      {caseData.clientName}
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </p>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      Publicado el {format(new Date(caseData.createdAt), "d MMMM, yyyy", { locale: es })}
                    </p>
                  </div>
                </div>

                {isLawyer && isOpen && (
                  <button className="hidden md:flex bg-secondary hover:bg-secondary/90 text-white font-bold text-sm py-3 px-6 rounded-xl transition-all items-center gap-2 shadow-md">
                    <Send className="w-4 h-4" />
                    Enviar Propuesta
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Proposals Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-black text-primary font-manrope mb-6 flex items-center gap-3">
              Propuestas de Abogados
              <span className="bg-primary/5 text-primary text-sm px-3 py-1 rounded-full font-bold">
                {caseData.proposals?.length || 0}
              </span>
            </h2>

            {caseData.proposals && caseData.proposals.length > 0 ? (
              <div className="space-y-4">
                {caseData.proposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Link href={`/lawyer/${proposal.lawyerPublicId}`} className="text-base font-bold text-slate-900 hover:text-secondary hover:underline transition-colors flex items-center gap-1.5">
                            {proposal.lawyerName}
                            <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          </Link>
                          <span className="text-xs text-slate-400 font-medium">
                            {format(new Date(proposal.createdAt), "d MMM, HH:mm", { locale: es })}
                          </span>
                        </div>
                        <ProposalBadge status={proposal.status} />
                      </div>
                      
                      <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                        {proposal.proposalText}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-start md:w-32 md:justify-end">
                       <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 font-extrabold px-3 py-1.5 rounded-lg text-sm border border-emerald-200/60">
                        <DollarSign className="w-4 h-4" />
                        {proposal.proposedFee.toLocaleString("es-ES")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Aún no hay propuestas para este caso.</p>
                {isLawyer && isOpen && (
                  <p className="text-sm text-secondary font-bold mt-2 cursor-pointer hover:underline">
                    ¡Sé el primero en enviar una propuesta!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
