"use client";

import { useState } from "react";
import { Star, X, MessageSquare, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { marketplaceApi } from "@/modules/marketplace/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentPublicId: string;
  lawyerName: string;
  onSuccess: () => void;
}

export function ReviewModal({ isOpen, onClose, appointmentPublicId, lawyerName, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [hoveredScore, setHoveredScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      toast.error("Por favor selecciona una calificación");
      return;
    }

    try {
      setSubmitting(true);
      await marketplaceApi.createReview({
        appointmentPublicId,
        rating,
        comment,
        isAnonymous
      });
      toast.success("¡Gracias por tu valoración!");
      onSuccess();
      onClose();
    } catch (error: any) {
      const message = error.response?.data?.detail || error.response?.data?.message || "Error al enviar la reseña";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-slate-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">Valorar Servicio</h3>
                <p className="text-sm text-slate-500 font-medium">Reseña verificada para {lawyerName}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Star Rating */}
              <div className="flex flex-col items-center gap-3 py-4 bg-slate-50 rounded-2xl border border-slate-100 font-manrope">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tu Calificación</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredScore(star)}
                      onMouseLeave={() => setHoveredScore(0)}
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90 outline-none"
                    >
                      <Star
                        className={cn(
                          "w-10 h-10 transition-colors",
                          (hoveredScore || rating) >= star
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-200"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-sm font-black text-amber-600">
                  {rating === 5 ? "¡Excelente servicio!" : 
                   rating === 4 ? "Muy buen servicio" : 
                   rating === 3 ? "Servicio normal" : 
                   rating === 2 ? "Podría mejorar" : "Mala experiencia"}
                </p>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <MessageSquare className="w-3 h-3" />
                  Tu comentario (Opcional)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Cuéntanos más sobre tu experiencia..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none h-32"
                />
              </div>

              {/* Anonymity */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={cn(
                    "w-10 h-5 rounded-full transition-colors",
                    isAnonymous ? "bg-emerald-500" : "bg-slate-200"
                  )} />
                  <div className={cn(
                    "absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform",
                    isAnonymous ? "translate-x-5" : "translate-x-0"
                  )} />
                </div>
                <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                  Publicar como usuario anónimo
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-slate-900 text-white rounded-2xl py-4 text-sm font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Enviando..." : "Publicar Valoración"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
