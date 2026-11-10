import React from 'react';

export const HeroPastryPhotos: React.FC = () => {
  return (
    <>
      {/* ==================================================================== */}
      {/* FOTO 1 (IZQUIERDA): PASTEL REAL DE BECCA (FONDO BLANCO PURO)         */}
      {/* ==================================================================== */}
      <div 
        className="hidden lg:flex absolute left-4 xl:left-12 top-1/2 -translate-y-1/2 z-10 flex-col items-center select-none pointer-events-auto animate-float-slow group"
        title="Pastel personalizado de Becca con receta artesanal"
      >
        <div className="w-28 h-28 xl:w-36 xl:h-36 rounded-3xl bg-white border-2 border-black p-2 shadow-xl group-hover:scale-105 group-hover:rotate-2 transition-all duration-300">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center">
            <img 
              src="/images/cake-monkey.jpg" 
              alt="Pastel temático artesanal de Becca" 
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-white border border-black text-[10px] font-black text-black shadow-xs -mt-2.5 group-hover:bg-[#99ffcc] transition-colors">
          <span>🎂 Pasteles de Diseño</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* FOTO 2 (DERECHA): REPOSTERÍA / CASITA ARTESANAL (FONDO BLANCO PURO)  */}
      {/* ==================================================================== */}
      <div 
        className="hidden lg:flex absolute right-4 xl:right-12 top-1/2 -translate-y-1/2 z-10 flex-col items-center select-none pointer-events-auto animate-float-delayed group"
        title="Casita de galleta y repostería artesanal"
      >
        <div className="w-28 h-28 xl:w-36 xl:h-36 rounded-3xl bg-white border-2 border-black p-2 shadow-xl group-hover:scale-105 group-hover:-rotate-2 transition-all duration-300">
          <div className="w-full h-full rounded-2xl overflow-hidden bg-white flex items-center justify-center">
            <img 
              src="/images/navidad/navidad-2.jpg" 
              alt="Casita de galleta y repostería artesanal" 
              className="w-full h-full object-contain"
              loading="eager"
            />
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-white border border-black text-[10px] font-black text-black shadow-xs -mt-2.5 group-hover:bg-[#ffcc99] transition-colors">
          <span>🍪 Repostería Artesanal</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* FOTO 3 (ACENTO INFERIOR): CUPCAKES REALES EN FONDO BLANCO           */}
      {/* ==================================================================== */}
      <div 
        className="hidden 2xl:flex absolute left-28 bottom-4 z-10 flex-col items-center select-none pointer-events-auto animate-float-gentle group"
        title="Cupcakes suaves horneados al día"
      >
        <div className="w-24 h-24 rounded-2xl bg-white border-2 border-black p-1.5 shadow-lg group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
          <div className="w-full h-full rounded-xl overflow-hidden bg-white flex items-center justify-center">
            <img 
              src="/images/navidad/navidad-5.jpg" 
              alt="Cupcakes decorados artesanalmente" 
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
        <div className="px-2.5 py-0.5 rounded-full bg-white border border-black text-[9px] font-black text-black shadow-xs -mt-2">
          <span>🧁 Horneado al Día</span>
        </div>
      </div>
    </>
  );
};
