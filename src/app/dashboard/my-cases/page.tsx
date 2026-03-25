"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { clientCaseService } from "@/modules/marketplace/services/clientCaseService";
import { marketplaceApi } from "@/modules/marketplace/api";
import type {
  CaseWithProposalsResponse,
  ClientProposalResponse,
  CreateCaseRequest,
  SpecialtyResponse,
} from "@/modules/marketplace/types";
import { CaseRequestStatus, ProposalStatus } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Briefcase,
  Plus,
  DollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  X,
  FileText,
  UserCircle,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import RichTextEditor from "@/app/dashboard/profile/components/RichTextEditor";

// ── Status Helpers ──────────────────────────────────────────────────

const CASE_STATUS_CONFIG: Record<
  CaseRequestStatus,
  { label: string; classes: string; icon: React.ElementType }
> = {
  [CaseRequestStatus.OPEN]: {
    label: "Abierto",
    classes:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: Clock,
  },
  [CaseRequestStatus.IN_PROGRESS]: {
    label: "En Progreso",
    classes:
      "bg-blue-50 text-blue-700 border-blue-200",
    icon: Briefcase,
  },
  [CaseRequestStatus.CLOSED]: {
    label: "Cerrado",
    classes:
      "bg-slate-100 text-slate-500 border-slate-200",
    icon: Lock,
  },
};

const PROPOSAL_STATUS_CONFIG: Record<
  ProposalStatus,
  { label: string; classes: string; icon: React.ElementType }
> = {
  [ProposalStatus.PENDING]: {
    label: "Pendiente",
    classes:
      "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  [ProposalStatus.ACCEPTED]: {
    label: "Aceptada",
    classes:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  [ProposalStatus.REJECTED]: {
    label: "Rechazada",
    classes:
      "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
};

function StatusBadge({
  status,
  config,
}: {
  status: string;
  config: Record<string, { label: string; classes: string; icon: React.ElementType }>;
}) {
  const entry = config[status];
  if (!entry) return null;
  const Icon = entry.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${entry.classes}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {entry.label}
    </span>
  );
}

// ── Proposal Card ───────────────────────────────────────────────────

function ProposalCard({
  proposal,
  caseStatus,
  onAccept,
  accepting,
}: {
  proposal: ClientProposalResponse;
  caseStatus: CaseRequestStatus;
  onAccept: (proposalId: number) => void;
  accepting: boolean;
}) {
  const canAccept =
    caseStatus === CaseRequestStatus.OPEN &&
    proposal.status === ProposalStatus.PENDING;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col md:flex-row gap-4"
    >
      {/* Lawyer Info & Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200">
            <UserCircle className="w-5 h-5 text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {proposal.lawyerName}
            </p>
            <p className="text-[11px] text-slate-400">
              {format(new Date(proposal.createdAt), "d MMM yyyy, HH:mm", {
                locale: es,
              })}
            </p>
          </div>
          <div className="ml-auto">
            <StatusBadge
              status={proposal.status}
              config={PROPOSAL_STATUS_CONFIG}
            />
          </div>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
            {proposal.proposalText}
          </p>
        </div>
      </div>

      {/* Fee & Action */}
      <div className="shrink-0 flex md:flex-col items-center md:items-end justify-between gap-3 md:w-44">
        <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50 w-full text-center md:text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
            Honorarios
          </span>
          <div className="flex items-center justify-center md:justify-end gap-0.5 mt-1 text-emerald-700 font-bold text-lg">
            <DollarSign className="w-4 h-4" />
            {proposal.proposedFee.toLocaleString("es-ES")}
          </div>
        </div>

        {canAccept && (
          <button
            onClick={() => onAccept(proposal.id)}
            disabled={accepting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]"
          >
            {accepting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Aceptar
              </>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ── Case Card ───────────────────────────────────────────────────────

function CaseCard({
  caseData,
  onAcceptProposal,
  onClose,
}: {
  caseData: CaseWithProposalsResponse;
  onAcceptProposal: (
    casePublicId: string,
    proposalId: number
  ) => Promise<void>;
  onClose: (casePublicId: string) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [closing, setClosing] = useState(false);

  const pendingCount = caseData.proposals.filter(
    (p) => p.status === ProposalStatus.PENDING
  ).length;

  const handleAccept = async (proposalId: number) => {
    setAccepting(true);
    try {
      await onAcceptProposal(caseData.publicId, proposalId);
    } finally {
      setAccepting(false);
    }
  };

  const handleClose = async () => {
    setClosing(true);
    try {
      await onClose(caseData.publicId);
    } finally {
      setClosing(false);
    }
  };

  const canClose = caseData.status !== CaseRequestStatus.CLOSED;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Card Header */}
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <StatusBadge
            status={caseData.status}
            config={CASE_STATUS_CONFIG}
          />
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
            {caseData.specialtyName || "General"}
          </span>
          {caseData.budget != null && (
            <span className="ml-auto text-emerald-600 font-bold flex items-center bg-emerald-50 px-3 py-1 rounded-full text-sm">
              <DollarSign className="w-4 h-4" />
              {caseData.budget.toLocaleString("es-ES")}
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">
          {caseData.title}
        </h3>
        
        {/* Render Quill HTML safely and apply line clamp */}
        <div 
          className="text-slate-600 text-sm line-clamp-3 prose prose-sm prose-slate max-w-none [&>p]:mb-1 [&>p]:inline"
          dangerouslySetInnerHTML={{ __html: caseData.description }}
        />

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-400">
            Publicado el{" "}
            {format(new Date(caseData.createdAt), "d MMM yyyy", {
              locale: es,
            })}
          </span>

          <div className="flex items-center gap-2">
            {canClose && (
              <button
                onClick={handleClose}
                disabled={closing}
                className="text-xs font-medium text-slate-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 disabled:opacity-50"
              >
                {closing ? "Cerrando..." : "Cerrar Caso"}
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50 border border-slate-200"
            >
              {caseData.proposals.length} Propuesta
              {caseData.proposals.length !== 1 && "s"}
              {pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {pendingCount}
                </span>
              )}
              {expanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Proposals */}
      <AnimatePresence>
        {expanded && caseData.proposals.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50/50 border-t border-slate-100 p-5 space-y-4">
              {caseData.proposals.map((proposal) => (
                <ProposalCard
                  key={proposal.id}
                  proposal={proposal}
                  caseStatus={caseData.status}
                  onAccept={handleAccept}
                  accepting={accepting}
                />
              ))}
            </div>
          </motion.div>
        )}
        {expanded && caseData.proposals.length === 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-slate-50/50 border-t border-slate-100 p-8 text-center">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">
                Aún no has recibido propuestas para este caso.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Create Case Modal ───────────────────────────────────────────────

function CreateCaseModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specialtyId, setSpecialtyId] = useState<number | undefined>(undefined);
  const [budget, setBudget] = useState<number | "">("" );
  const [submitting, setSubmitting] = useState(false);

  const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);

  useEffect(() => {
    if (isOpen) {
      marketplaceApi.getAllSpecialties().then(setSpecialties).catch(() => {});
    }
  }, [isOpen]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSpecialtyId(undefined);
    setBudget("");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("El título y la descripción son obligatorios");
      return;
    }
    if (description.trim().length < 20) {
      toast.error("La descripción debe tener al menos 20 caracteres");
      return;
    }

    const request: CreateCaseRequest = {
      title: title.trim(),
      description: description.trim(),
      specialtyId: specialtyId || undefined,
      budget: budget ? Number(budget) : undefined,
    };

    try {
      setSubmitting(true);
      await clientCaseService.createCase(request);
      toast.success("Caso publicado exitosamente");
      resetForm();
      onCreated();
      onClose();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al publicar el caso"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Publicar Nuevo Caso
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Describe tu situación legal y recibe propuestas de abogados
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 bg-white shadow-sm p-2 rounded-full border border-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 overflow-y-auto custom-scrollbar space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Título del Caso *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Necesito asesoría en derecho laboral"
                  maxLength={255}
                  className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col h-[320px]">
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Descripción *
                </label>
                <div className="flex-1 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-slate-900/20 focus-within:border-slate-900 overflow-hidden">
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Describe con detalle tu situación legal, qué necesitas y cualquier contexto relevante..."
                    className="h-[250px] border-none shadow-none"
                  />
                </div>
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Especialidad
                </label>
                <select
                  value={specialtyId ?? ""}
                  onChange={(e) =>
                    setSpecialtyId(
                      e.target.value ? Number(e.target.value) : undefined
                    )
                  }
                  className="w-full text-sm rounded-xl border border-slate-200 p-3 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none bg-white"
                >
                  <option value="">Sin especialidad específica</option>
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Presupuesto Estimado (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) =>
                      setBudget(e.target.value ? Number(e.target.value) : "")
                    }
                    placeholder="Opcional"
                    min={0}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100">
              <button
                disabled={submitting || !title.trim() || !description.trim()}
                onClick={handleSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Publicar Caso
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ── Page (Main) ─────────────────────────────────────────────────────

export default function MyCasesPage() {
  const user = useAuthStore((s) => s.user);
  const [cases, setCases] = useState<CaseWithProposalsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientCaseService.getMyCases();
      setCases(data);
    } catch (error) {
      toast.error("Error al cargar tus casos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "CLIENT") {
      fetchCases();
    } else {
      setLoading(false);
    }
  }, [user, fetchCases]);

  const handleAcceptProposal = async (
    casePublicId: string,
    proposalId: number
  ) => {
    try {
      await clientCaseService.acceptProposal(casePublicId, proposalId);
      toast.success("Propuesta aceptada. El abogado ha sido notificado.");
      fetchCases();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al aceptar la propuesta"
      );
    }
  };

  const handleCloseCase = async (casePublicId: string) => {
    try {
      await clientCaseService.closeCase(casePublicId);
      toast.success("Caso cerrado correctamente");
      fetchCases();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al cerrar el caso"
      );
    }
  };

  // ── Role Guard ──────────────────────────────────────────────────
  if (user?.role !== "CLIENT") {
    return (
      <div className="p-8 max-w-5xl mx-auto flex justify-center py-32">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">
            Acceso Restringido
          </h2>
          <p className="text-slate-500 mt-2">
            Esta sección es solo para clientes.
          </p>
        </div>
      </div>
    );
  }

  // ── Main Render ─────────────────────────────────────────────────
  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Mis Casos
          </h1>
          <p className="mt-2 text-slate-500 text-sm">
            Publica tus necesidades legales y recibe propuestas de abogados
            calificados.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg hover:shadow-emerald-200 active:scale-[0.97] flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Publicar Caso
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
        </div>
      ) : cases.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">
            No tienes casos publicados
          </h3>
          <p className="text-slate-500 mt-1 mb-6 max-w-md mx-auto">
            Publica tu primer caso y comienza a recibir propuestas de abogados
            especializados.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-slate-900 hover:bg-black text-white font-semibold py-3 px-6 rounded-xl transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Publicar mi primer caso
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {cases.map((c) => (
            <CaseCard
              key={c.publicId}
              caseData={c}
              onAcceptProposal={handleAcceptProposal}
              onClose={handleCloseCase}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <CreateCaseModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={fetchCases}
      />
    </div>
  );
}
