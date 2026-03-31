"use client";

import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

interface RatingBreakdownProps {
  ratingAvg: number;
  reviewCount: number;
  ratingBreakdown: Record<number, number>;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({
  ratingAvg,
  reviewCount,
  ratingBreakdown,
}) => {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm mb-12">
      {/* Score Big Display */}
      <div className="flex flex-col items-center text-center">
        <div className="text-6xl font-black text-slate-900 tracking-tighter">
          {ratingAvg.toFixed(1)}
        </div>
        <div className="flex gap-0.5 my-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-5 h-5 ${
                s <= Math.round(ratingAvg)
                  ? "text-amber-400 fill-amber-400"
                  : "text-slate-200 fill-slate-200"
              }`}
            />
          ))}
        </div>
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
          {reviewCount} {reviewCount === 1 ? "Valoración" : "Valoraciones"}
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex-1 w-full space-y-3">
        {ratings.map((star) => {
          const count = ratingBreakdown[star] || 0;
          const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

          return (
            <div key={star} className="flex items-center gap-4 group">
              <div className="flex items-center gap-1.5 w-12 shrink-0">
                <span className="text-sm font-black text-slate-700">{star}</span>
                <Star className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />
              </div>
              
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className={`h-full rounded-full ${
                    star === 5 ? "bg-blue-600" : star === 4 ? "bg-blue-400" : star === 3 ? "bg-blue-200" : "bg-slate-200"
                  }`}
                />
              </div>

              <div className="w-10 text-right shrink-0">
                <span className="text-xs font-bold text-slate-400 group-hover:text-slate-600 transition-colors">
                  {Math.round(percentage)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
