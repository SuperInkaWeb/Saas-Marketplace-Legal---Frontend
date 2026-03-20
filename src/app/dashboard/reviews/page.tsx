"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/modules/auth/store";
import { lawyerConfigService } from "@/modules/profile/services/lawyerConfigService";
import { ReviewResponse } from "@/modules/marketplace/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

export default function ReviewsPage() {
  const user = useAuthStore((s) => s.user);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
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
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-4">
          Mis Reseñas
        </h1>
        <p className="mt-2 text-slate-500 text-sm">
          Lo que dicen tus clientes sobre tus servicios legales.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900">Aún no tienes reseñas</h3>
          <p className="text-slate-500 mt-1">Completa casos para empezar a recibir calificaciones de tus clientes.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6"
            >
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 mr-1.5" />
                    <span className="font-bold text-amber-700">{review.rating}.0</span>
                  </div>
                  <span className="text-sm font-medium text-slate-900">{review.clientName}</span>
                </div>
                <p className="text-slate-600 italic">"{review.comment}"</p>
              </div>
              <div className="shrink-0 text-right">
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                  Fecha
                </span>
                <span className="text-sm text-slate-700 font-medium mt-1 block">
                  {format(new Date(review.createdAt), "d MMM yyyy", { locale: es })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
