"use client";

import React, { useEffect, useState } from "react";
import { marketplaceApi } from "@/modules/marketplace/api";
import { ReviewDTO } from "@/modules/marketplace/types";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface ProfileReviewsProps {
  lawyerPublicId: string;
}

export const ProfileReviews: React.FC<ProfileReviewsProps> = ({ lawyerPublicId }) => {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (lawyerPublicId) {
      fetchReviews();
    }
  }, [lawyerPublicId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await marketplaceApi.getLawyerReviews(lawyerPublicId);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel rounded-3xl p-8 lg:p-12 mb-12 flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return null; // Omitimos la sección si no hay reseñas
  }

  return (
    <section className="glass-panel rounded-3xl p-8 lg:p-12 mb-12" data-purpose="profile-reviews">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Valoraciones</h2>
          <p className="text-slate-500 font-medium">
            Lo que dicen nuestros clientes sobre la experiencia y el servicio brindado.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.publicId}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="bg-white/80 rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0">
                  <span className="font-bold text-slate-500 text-sm">
                    {review.clientName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{review.clientName}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? "text-amber-500 fill-amber-500"
                              : "text-slate-200 fill-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                      {format(new Date(review.createdAt), "d MMM yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm italic relative">
                <span className="text-3xl text-slate-200 absolute -top-2 -left-3 font-serif leading-none">"</span>
                {review.comment || "Sin comentario."}
                <span className="text-3xl text-slate-200 absolute -bottom-4 font-serif leading-none ml-1">"</span>
              </p>

              {/* Lawyer Reply */}
              {review.replyText && (
                <div className="mt-6 ml-4 md:ml-10 bg-slate-50 border-l-4 border-blue-600 rounded-r-2xl p-5 relative">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold italic">L</span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Respuesta del Abogado</span>
                    <span className="text-[10px] text-slate-400 font-medium ml-auto">
                      {review.repliedAt ? format(new Date(review.repliedAt), "d MMM yyyy", { locale: es }) : ""}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {review.replyText}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
