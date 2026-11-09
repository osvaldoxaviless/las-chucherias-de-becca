import React from 'react';

export const HeroPastryStickers: React.FC = () => {
  return (
    <>
      {/* ==================================================================== */}
      {/* STICKER 1 (IZQUIERDA): CUPCAKE ARTESANAL CON BETÚN Y CEREZA          */}
      {/* ==================================================================== */}
      <div 
        className="hidden md:flex absolute -left-4 lg:left-6 top-1/2 -translate-y-1/2 z-10 flex-col items-center select-none pointer-events-auto animate-float-slow group"
        title="Cupcake artesanal horneado al día con mantequilla pura"
      >
        <div className="relative w-28 h-28 lg:w-32 lg:h-32 p-2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            {/* Sombra base */}
            <ellipse cx="60" cy="112" rx="34" ry="6" fill="#000000" opacity="0.12" />

            {/* Capacillo / Wrapper del Cupcake */}
            <path
              d="M32 64 L40 106 C40.5 108 43 110 46 110 L74 110 C77 110 79.5 108 80 106 L88 64 Z"
              fill="#fef08a"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Pliegues del capacillo */}
            <line x1="42" y1="65" x2="48" y2="108" stroke="#ca8a04" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="51" y1="65" x2="55" y2="109" stroke="#ca8a04" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="60" y1="65" x2="60" y2="110" stroke="#ca8a04" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="69" y1="65" x2="65" y2="109" stroke="#ca8a04" strokeWidth="1.5" strokeOpacity="0.4" />
            <line x1="78" y1="65" x2="72" y2="108" stroke="#ca8a04" strokeWidth="1.5" strokeOpacity="0.4" />

            {/* Bizcocho sobresaliente */}
            <path
              d="M28 66 C28 58 36 54 44 56 C52 50 68 50 76 56 C84 54 92 58 92 66 C92 70 28 70 28 66 Z"
              fill="#b45309"
              stroke="#000000"
              strokeWidth="2.5"
            />

            {/* Swirl de Betún / Frosting Menta & Bubblegum */}
            <path
              d="M26 62 C26 50 36 46 46 48 C48 38 60 34 72 38 C80 34 94 42 94 54 C94 62 88 65 78 64 C68 66 52 66 42 64 C32 66 26 64 26 62 Z"
              fill="#99ffcc"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Capa superior de betún rosa */}
            <path
              d="M34 50 C36 38 48 30 60 28 C72 30 84 38 86 50 C80 54 70 48 60 48 C50 48 40 54 34 50 Z"
              fill="#ff99cc"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Copete rizado superior */}
            <path
              d="M48 36 C50 26 58 20 60 18 C62 20 70 26 72 36 C66 38 54 38 48 36 Z"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="2"
            />

            {/* Chispitas dulces (Sprinkles) */}
            <rect x="42" y="44" width="5" height="2" rx="1" fill="#7bbbff" transform="rotate(20 42 44)" />
            <rect x="68" y="42" width="5" height="2" rx="1" fill="#160042" transform="rotate(-30 68 42)" />
            <rect x="54" y="34" width="4.5" height="2" rx="1" fill="#ffcc99" transform="rotate(45 54 34)" />
            <rect x="76" y="52" width="5" height="2" rx="1" fill="#ff99cc" transform="rotate(-15 76 52)" />
            <rect x="36" y="58" width="4" height="2" rx="1" fill="#ffffff" transform="rotate(60 36 58)" />

            {/* Cereza con brillo y rabillo */}
            <circle cx="60" cy="16" r="8" fill="#e11d48" stroke="#000000" strokeWidth="2" />
            <ellipse cx="58" cy="14" rx="2" ry="3" fill="#ffffff" opacity="0.8" transform="rotate(-30 58 14)" />
            <path
              d="M60 10 C62 4 70 2 76 4"
              fill="none"
              stroke="#15803d"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Badge inferior con estilo Hatch */}
        <div className="px-2.5 py-0.5 rounded-full bg-white border border-black text-[10px] font-black text-black shadow-xs -mt-1 group-hover:bg-[#99ffcc] transition-colors">
          <span>🧁 Horneado hoy</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* STICKER 2 (DERECHA): PASTELITO BENTO CON VELITA FLOTANTE             */}
      {/* ==================================================================== */}
      <div 
        className="hidden md:flex absolute -right-4 lg:right-6 top-1/2 -translate-y-1/2 z-10 flex-col items-center select-none pointer-events-auto animate-float-delayed group"
        title="Bento cake con velita y decoración retro de celebración"
      >
        <div className="relative w-28 h-28 lg:w-32 lg:h-32 p-2 drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] group-hover:scale-110 group-hover:-rotate-6 transition-all duration-300">
          <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
            {/* Sombra base */}
            <ellipse cx="60" cy="112" rx="38" ry="6" fill="#000000" opacity="0.12" />

            {/* Base blonda / plato festoneado */}
            <ellipse cx="60" cy="106" rx="42" ry="10" fill="#ffffff" stroke="#000000" strokeWidth="2" />
            <ellipse cx="60" cy="104" rx="38" ry="8" fill="#ffcc99" stroke="#000000" strokeWidth="1.5" />

            {/* Cuerpo del pastel (Cilindro) */}
            <path
              d="M26 68 C26 78 41 86 60 86 C79 86 94 78 94 68 L94 98 C94 107 79 114 60 114 C41 114 26 107 26 98 Z"
              fill="#ff99cc"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Cara superior del pastel */}
            <ellipse cx="60" cy="68" rx="34" ry="14" fill="#fffaf0" stroke="#000000" strokeWidth="2.5" />

            {/* Olas retro estilo Lambeth en la parte superior */}
            <path
              d="M26 68 Q34 76 42 70 Q51 78 60 70 Q69 78 78 70 Q86 76 94 68"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M26 68 Q34 76 42 70 Q51 78 60 70 Q69 78 78 70 Q86 76 94 68"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Guirnalda festoneada intermedia */}
            <path
              d="M30 84 Q45 92 60 86 Q75 92 90 84"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Velita de cumpleaños */}
            <rect x="58" y="38" width="4" height="20" rx="1" fill="#7bbbff" stroke="#000000" strokeWidth="1.5" />
            {/* Espirales de la velita */}
            <line x1="58" y1="44" x2="62" y2="46" stroke="#ffffff" strokeWidth="1.5" />
            <line x1="58" y1="50" x2="62" y2="52" stroke="#ffffff" strokeWidth="1.5" />

            {/* Pábilo */}
            <line x1="60" y1="38" x2="60" y2="33" stroke="#000000" strokeWidth="1.5" />

            {/* Llama de la vela con animación de pulso/parpadeo */}
            <g className="animate-candle-flicker origin-bottom">
              <ellipse cx="60" cy="27" rx="4.5" ry="7" fill="#fbbf24" />
              <ellipse cx="60" cy="27" rx="2.5" ry="4.5" fill="#fef08a" />
              <circle cx="60" cy="30" r="1.5" fill="#3b82f6" />
            </g>

            {/* Pequeños lazos decorativos en los bordes */}
            <circle cx="34" cy="74" r="2.5" fill="#e11d48" />
            <circle cx="86" cy="74" r="2.5" fill="#e11d48" />
          </svg>
        </div>

        {/* Badge inferior con estilo Hatch */}
        <div className="px-2.5 py-0.5 rounded-full bg-white border border-black text-[10px] font-black text-black shadow-xs -mt-1 group-hover:bg-[#ffcc99] transition-colors">
          <span>🎂 100% Mantequilla</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* STICKER 3 (MÓVIL & ACENTO): FRESA CON CHOCOLATE / CHUCHERÍA           */}
      {/* ==================================================================== */}
      <div 
        className="hidden xl:flex absolute left-24 bottom-6 z-10 flex-col items-center select-none pointer-events-auto animate-float-gentle group"
        title="Fresa bañada en chocolate belga"
      >
        <div className="relative w-16 h-16 p-1 drop-shadow-md group-hover:scale-110 group-hover:rotate-12 transition-all">
          <svg viewBox="0 0 60 60" className="w-full h-full">
            {/* Fresa */}
            <path
              d="M30 52 C22 46 14 34 16 22 C18 12 30 14 30 18 C30 14 42 12 44 22 C46 34 38 46 30 52 Z"
              fill="#ef4444"
              stroke="#000000"
              strokeWidth="2"
            />
            {/* Bañado en chocolate oscuro */}
            <path
              d="M17 26 C20 32 25 36 30 35 C35 34 40 38 43 27 C45 36 38 46 30 52 C22 46 15 36 17 26 Z"
              fill="#3e2723"
              stroke="#000000"
              strokeWidth="1.5"
            />
            {/* Líneas de chocolate blanco en zigzag */}
            <path
              d="M20 36 Q30 32 40 40 M24 44 Q30 42 36 46"
              fill="none"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Hoja de fresa */}
            <path
              d="M30 14 C26 8 20 10 24 16 C30 16 30 14 30 14 C30 14 30 16 36 16 C40 10 34 8 30 14 Z"
              fill="#22c55e"
              stroke="#000000"
              strokeWidth="1.5"
            />
          </svg>
        </div>
        <div className="px-2 py-0.2 rounded-full bg-white border border-black text-[9px] font-bold text-black shadow-xs -mt-1">
          <span>🍓 Fruta fresca</span>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* DESTELLOS MÁGICOS (BAKERY SPARKLES)                                  */}
      {/* ==================================================================== */}
      <div className="absolute top-8 left-1/4 pointer-events-none text-[#ff99cc] animate-pulse">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-1/4 pointer-events-none text-[#99ffcc] animate-pulse delay-500">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
        </svg>
      </div>
    </>
  );
};
