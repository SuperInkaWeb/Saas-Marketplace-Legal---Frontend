"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { marketplaceApi } from "@/modules/marketplace/api";
import { ReviewResponse } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Star, MessageSquare, Reply, Send, X, Clock, CheckCircle2, BarChart3, Pin, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { RatingBreakdown } from "@/app/lawyer/[slug]/components/RatingBreakdown";
import { DashboardStatsResponse } from "@/modules/marketplace/types";
import { ReportModal } from "./components/ReportModal";

export default function ReviewsPage() {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  
  // States
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [reportingReview, setReportingReview] = useState<{ publicId: string; clientName: string } | null>(null);

  useEffect(() => {
    if (user?.role === "LAWYER") {
      Promise.all([fetchReviews(), fetchStats()]);
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const data = await lawyerConfigService.getMyReviews();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews", error);
      toast.error("No se pudieron cargar las reseñas");
    }
  };

  const fetchStats = async () => {
    try {
      const data = await lawyerConfigService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats", error);
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

  const handleToggleFeatured = async (publicId: string) => {
    try {
      await marketplaceApi.featureReview(publicId);
      toast.success("Estado de destacado actualizado");
      fetchReviews();
    } catch (error: any) {
      toast.error("Error al actualizar el destacado");
    }
  };

  if (user?.role !== "LAWYER") {
    return (
      <div className="p-8 max-w-5xl mx-auto flex justify-center py-32">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Acceso Denegado</h2>
          <p className="text-slate-500">Solo los abogados pueden ver esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Mis Reseñas</h1>
          <p className="text-slate-500 font-medium">Gestiona tu reputación, responde a clientes y destaca tus mejores testimonios.</p>
        </div>
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-4 py-2 text-center">
            <div className="text-xl font-black text-slate-900">{stats?.reviewCount || 0}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</div>
          </div>
          <div className="w-px bg-slate-100 my-1"></div>
          <div className="px-4 py-2 text-center">
            <div className="text-xl font-black text-slate-900 flex items-center justify-center gap-1">
              {stats?.ratingAvg.toFixed(1) || "0.0"}
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Promedio</div>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-1">
             <RatingBreakdown 
               ratingAvg={stats.ratingAvg}
               reviewCount={stats.reviewCount}
               ratingBreakdown={stats.ratingBreakdown || {}}
             />
           </div>
           
           <div className="lg:col-span-3">
             <div className="grid gap-6">
               {loading ? (
                 [1, 2, 3].map((i) => (
                   <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-slate-100" />
                 ))
               ) : reviews.length === 0 ? (
                 <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
                   <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                     <MessageSquare className="w-8 h-8 text-slate-300" />
                   </div>
                   <h3 className="text-lg font-bold text-slate-600">Aún no tienes reseñas</h3>
                   <p className="text-slate-400 mt-1 max-w-xs mx-auto">Tus clientes podrán dejar valoraciones después de completar sus citas.</p>
                 </div>
               ) : (
                 reviews.map((review) => (
                  <motion.div
                    key={review.publicId}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "group bg-white rounded-3xl p-8 border-2 transition-all duration-300",
                      review.isFeatured 
                        ? "border-blue-500 shadow-xl shadow-blue-100" 
                        : "border-slate-100 hover:border-blue-200"
                    )}
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-100">
                              <Star className="w-4 h-4 text-blue-500 fill-blue-500 mr-2" />
                              <span className="font-black text-blue-700 text-sm">{review.rating}.0</span>
                            </div>
                            
                            <button
                              onClick={() => handleToggleFeatured(review.publicId)}
                              className={cn(
                                "p-2 rounded-xl border transition-all",
                                review.isFeatured 
                                  ? "bg-blue-600 border-blue-700 text-white shadow-lg shadow-blue-200" 
                                  : "bg-white border-slate-200 text-slate-300 hover:text-blue-500 hover:border-blue-200"
                              )}
                              title={review.isFeatured ? "Quitar de destacados" : "Destacar esta reseña"}
                            >
                              <Pin className={cn("w-4 h-4", review.isFeatured && "fill-white")} />
                            </button>

                            <button
                              onClick={() => setReportingReview({ publicId: review.publicId, clientName: review.clientName })}
                              className="p-2 rounded-xl border border-slate-200 text-slate-300 hover:text-rose-600 hover:border-rose-100 hover:bg-rose-50 transition-all"
                              title="Reportar esta reseña"
                            >
                              <Flag className="w-4 h-4" />
                            </button>
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{review.clientName}</h4>
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                              <Clock className="w-3 h-3" />
                              {format(new Date(review.createdAt), "d 'de' MMM, yyyy", { locale: es })}
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
                        <div className="ml-6 md:ml-12 bg-blue-50/50 border border-blue-100 rounded-2xl p-6 relative">
                          <div className="absolute -top-3 left-6 bg-blue-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-200">
                            <CheckCircle2 className="w-3 h-3" />
                            Tu Respuesta
                          </div>
                          <p className="text-blue-900 font-medium leading-relaxed">
                            {review.replyText}
                          </p>
                          <div className="mt-3 text-[10px] text-blue-600/70 font-bold uppercase tracking-widest">
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
                              className="w-full bg-slate-50 border-2 border-blue-100 rounded-2xl px-6 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all min-h-[120px] resize-none"
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
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-200 flex items-center gap-2 active:scale-95 disabled:opacity-50"
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
                            className="group flex items-center gap-3 px-6 py-3 rounded-2xl border-2 border-blue-500/20 text-blue-600 hover:bg-blue-500 hover:border-blue-500 hover:text-white transition-all font-black text-xs uppercase tracking-widest"
                          >
                            <Reply className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Responder Valoración
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                 ))
               )}
             </div>
           </div>
        </div>
      )}

      <ReportModal
        isOpen={!!reportingReview}
        onClose={() => setReportingReview(null)}
        reviewPublicId={reportingReview?.publicId || ""}
        clientName={reportingReview?.clientName || ""}
      />
    </div>
  );
}
