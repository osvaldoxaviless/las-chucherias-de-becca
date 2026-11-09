import React from 'react';
import { Award, Sparkles, Heart, ShieldCheck } from 'lucide-react';

export const QualitySealBanner: React.FC = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-purple-900 via-rose-950 to-stone-900 text-white relative overflow-hidden">
      {/* Decorative subtle sprinkles */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1">
          <span className="font-handwriting text-2xl text-pink-300 font-bold">
            El Estándar de las Chuches
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
            Nuestros Sellos de Calidad Artesanal
          </h3>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <span className="text-3xl block">🧈</span>
            <h4 className="font-bold text-sm text-yellow-200">100% Mantequilla Pura</h4>
            <p className="text-xs text-stone-300">Cero margarina ni premezclas químicas industriales. Sabor real.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <span className="text-3xl block">🍫</span>
            <h4 className="font-bold text-sm text-pink-200">Chocolate Belga</h4>
            <p className="text-xs text-stone-300">Coberturas de cacao fino de aroma, crujientes y sedosas.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <span className="text-3xl block">🍓</span>
            <h4 className="font-bold text-sm text-rose-200">Fruta Fresca al Día</h4>
            <p className="text-xs text-stone-300">Fresas, uvas y manzanas crujientes seleccionadas cada mañana.</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xs border border-white/10 space-y-2 hover:bg-white/10 transition-colors">
            <span className="text-3xl block">🦄</span>
            <h4 className="font-bold text-sm text-purple-200">Horneado por Becca</h4>
            <p className="text-xs text-stone-300">Atención personalizada y dedicación en cada detalle en Toluca.</p>
          </div>

        </div>

      </div>
    </section>
  );
};
