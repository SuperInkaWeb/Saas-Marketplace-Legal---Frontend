"use client";

import React, { useEffect, useState } from "react";
import { marketplaceApi } from "@/modules/marketplace/api";
import { ReviewDTO } from "@/modules/marketplace/types";
import { motion } from "framer-motion";
import { Star, MessageSquare, Pin, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { RatingBreakdown } from "./RatingBreakdown";
import { cn } from "@/lib/utils";

interface ProfileReviewsProps {
  lawyerPublicId: string;
  ratingAvg?: number;
  reviewCount?: number;
  ratingBreakdown?: Record<number, number>;
}

export const ProfileReviews: React.FC<ProfileReviewsProps> = ({ 
  lawyerPublicId,
  ratingAvg = 0,
  reviewCount = 0,
  ratingBreakdown = {}
}) => {
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

      <RatingBreakdown 
        ratingAvg={ratingAvg}
        reviewCount={reviewCount}
        ratingBreakdown={ratingBreakdown}
      />

      <div className="grid gap-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.publicId}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
              "rounded-2xl p-6 border transition-all duration-300 flex flex-col md:flex-row gap-6",
              review.isFeatured 
                ? "bg-white border-blue-200/50 shadow-[0_10px_40px_rgba(37,99,235,0.06)] ring-1 ring-blue-50/50" 
                : "bg-white/80 border-slate-100 shadow-sm hover:shadow-md"
            )}
          >
            <div className="flex-1 relative">
              {review.isFeatured && (
                <div className="absolute -top-3 -right-3 z-20">
                  <div className="flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                    <Sparkles className="w-3 h-3 text-blue-400 fill-blue-400" />
                    <span>Reseña Destacada</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-colors",
                  review.isFeatured ? "bg-blue-600 border-blue-700 text-white" : "bg-slate-50 border-slate-100 text-slate-500"
                )}>
                  <span className="font-black text-lg">
                    {review.clientName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">{review.clientName}</h4>
                    {review.isFeatured && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                  </div>
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
                      • {format(new Date(review.createdAt), "d MMM yyyy", { locale: es })}
                    </span>
                  </div>
                </div>
              </div>
              <p className={cn(
                "leading-relaxed text-sm italic relative",
                review.isFeatured ? "text-slate-800 font-medium" : "text-slate-600"
              )}>
                <span className={cn(
                  "text-3xl absolute -top-2 -left-3 font-serif leading-none",
                  review.isFeatured ? "text-blue-100" : "text-slate-200"
                )}>"</span>
                {review.comment || "Sin comentario."}
                <span className={cn(
                  "text-3xl absolute -bottom-4 font-serif leading-none ml-1",
                  review.isFeatured ? "text-blue-100" : "text-slate-200"
                )}>"</span>
              </p>

              {/* Lawyer Reply */}
              {review.replyText && (
                <div className={cn(
                  "mt-6 ml-4 md:ml-10 rounded-r-2xl p-5 relative border-l-4",
                  review.isFeatured 
                    ? "bg-blue-50/40 border-blue-600 shadow-sm" 
                    : "bg-slate-50 border-slate-900 shadow-sm"
                )}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center",
                      review.isFeatured ? "bg-blue-600 text-white" : "bg-slate-900 text-white"
                    )}>
                      <span className="text-[10px] font-bold italic">L</span>
                    </div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-widest">Respuesta del Abogado</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-auto">
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
