"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { marketplaceApi } from "@/modules/marketplace/api";
import { ReviewResponse } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Star, MessageSquare, Reply, Send, X, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ReviewsPage() {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Reply states
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    if (user?.role === "LAWYER") {
      fetchReviews();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await lawyerConfigService.getMyReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews", error);
      toast.error("No se pudieron cargar las reseñas");
    } finally {
      setLoading(false);
    }
  };

  const handleReplySubmit = async (publicId: string) => {
    if (!replyText.trim()) {
      toast.error("La respuesta no puede estar vacía");
      return;
    }

    try {
      setSubmittingReply(true);
      await marketplaceApi.replyToReview(publicId, replyText);
      toast.success("Respuesta publicada con éxito");
      setReplyingTo(null);
      setReplyText("");
      fetchReviews(); // Refresh list
    } catch (error: any) {
      const message = error.response?.data?.detail || "Error al publicar la respuesta";
      toast.error(message);
    } finally {
      setSubmittingReply(false);
    }
  };

  if (user?.role !== "LAWYER") {
    return (
      <div className="p-8 max-w-5xl mx-auto flex justify-center py-32">
        <div className="text-center">
          <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">Acceso Restringido</h2>
          <p className="text-slate-500 mt-2">Esta sección es solo para abogados.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Gestión de Reputación
          </h1>
          <p className="mt-2 text-slate-500 font-medium">
            Administra tus valoraciones y responde a tus clientes para mejorar tu perfil profesional.
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <div className="text-2xl font-black text-slate-900">
              {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Rating Global</div>
          </div>
          <div className="w-px h-8 bg-slate-100"></div>
          <div className="text-center">
            <div className="text-2xl font-black text-slate-900">{reviews.length}</div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Reseñas</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Sin reseñas por el momento</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            Las valoraciones de tus clientes aparecerán aquí una vez que completen sus citas.
          </p>
        </div>
      ) : (
        <div className="grid gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.publicId}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col gap-6"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-2" />
                      <span className="font-black text-amber-700 text-sm">{review.rating}.0</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{review.clientName}</h4>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {format(new Date(review.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 relative">
                    <MessageSquare className="absolute -top-3 -left-3 w-8 h-8 text-white fill-slate-100 stroke-slate-200" />
                    <p className="text-slate-700 leading-relaxed italic">
                      "{review.comment || "Sin comentario adicional."}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Responder o Ver Respuesta */}
              <div className="pt-2">
                {review.replyText ? (
                  <div className="ml-6 md:ml-12 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 relative">
                    <div className="absolute -top-3 left-6 bg-emerald-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Tu Respuesta
                    </div>
                    <p className="text-emerald-900 font-medium leading-relaxed">
                      {review.replyText}
                    </p>
                    <div className="mt-3 text-[10px] text-emerald-600/70 font-bold uppercase tracking-widest">
                      Respondido el {review.repliedAt ? format(new Date(review.repliedAt), "d MMM yyyy", { locale: es }) : "Recientemente"}
                    </div>
                  </div>
                ) : replyingTo === review.publicId ? (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="ml-6 md:ml-12 space-y-4"
                  >
                    <div className="relative">
                      <textarea
                        autoFocus
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Escribe tu agradecimiento o respuesta profesional..."
                        className="w-full bg-slate-50 border-2 border-emerald-100 rounded-2xl px-6 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all min-h-[120px] resize-none"
                      />
                      <button 
                        onClick={() => setReplyingTo(null)}
                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full border border-slate-100 shadow-sm transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => handleReplySubmit(review.publicId)}
                        disabled={submittingReply}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                      >
                        {submittingReply ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Publicar Respuesta
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex justify-start ml-6 md:ml-12">
                    <button
                      onClick={() => {
                        setReplyingTo(review.publicId);
                        setReplyText("");
                      }}
                      className="group flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest"
                    >
                      <Reply className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      Responder Valoración
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

