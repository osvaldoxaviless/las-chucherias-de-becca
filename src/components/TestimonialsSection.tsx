import React from 'react';
import { Star, Heart } from 'lucide-react';
import { REVIEWS } from '../data/reviews';

const POLAROID_IMAGES = [
  'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=80',
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-[#FFFDF9] via-pink-50/40 to-[#FFFDF9] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Muro del Amor en Toluca</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Momentos Felices con las Chuches 📸✨
          </h2>
          <p className="font-handwriting text-2xl text-rose-600 font-bold -rotate-1">
            "Lo que dicen quienes ya celebraron con nosotros"
          </p>
        </div>

        {/* Polaroid Style Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((rev, idx) => {
            const rotationClass = idx === 0 ? '-rotate-1' : idx === 1 ? 'rotate-1' : '-rotate-2';
            return (
              <div
                key={rev.id}
                className={`bg-white p-4 pb-6 rounded-2xl shadow-polaroid border border-stone-200/80 transition-all duration-300 hover:scale-103 hover:shadow-2xl ${rotationClass} washi-tape flex flex-col justify-between space-y-4`}
              >
                {/* Photo space */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 shadow-inner">
                  <img
                    src={POLAROID_IMAGES[idx] || POLAROID_IMAGES[0]}
                    alt={rev.product}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full font-semibold">
                    {rev.source}
                  </div>
                </div>

                {/* Polaroid caption handwritten area */}
                <div className="space-y-2 pt-1 px-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-xs sm:text-sm text-stone-700 italic leading-relaxed font-sans">
                    "{rev.comment}"
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="font-handwriting text-xl text-stone-900 font-bold block">
                        {rev.name}
                      </span>
                      <span className="text-[11px] text-rose-600 font-semibold block -mt-1">
                        {rev.product}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-medium">
                      {rev.date}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
