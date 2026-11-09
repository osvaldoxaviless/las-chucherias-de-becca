import React, { useRef, useState } from 'react';
import { 
  Instagram, ArrowLeft, ArrowRight, Sparkles, MessageCircle, Heart, 
  Camera, Plus, Trash2, Edit3, Check, X 
} from 'lucide-react';
import { StoreConfig, PortfolioItem } from '../types';
import { DEFAULT_PORTFOLIO_ITEMS } from '../data/portfolio';

interface Props {
  config: StoreConfig;
  isEditMode?: boolean;
  onUpdatePortfolioItem?: (updatedItem: PortfolioItem) => void;
  onDeletePortfolioItem?: (id: string) => void;
  onAddPortfolioItem?: (newItem: PortfolioItem) => void;
  onTriggerChangeImage?: (item: PortfolioItem) => void;
}

export const PortfolioRoll: React.FC<Props> = ({
  config,
  isEditMode = false,
  onUpdatePortfolioItem,
  onDeletePortfolioItem,
  onAddPortfolioItem,
  onTriggerChangeImage,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = (config.portfolioItems && config.portfolioItems.length > 0)
    ? config.portfolioItems
    : DEFAULT_PORTFOLIO_ITEMS;

  const [activeUrlPromptId, setActiveUrlPromptId] = useState<string | null>(null);
  const [tempUrlInput, setTempUrlInput] = useState('');

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleQuoteDesign = (item: PortfolioItem) => {
    const rawPhone = (config.whatsappNumber || '7225628061').replace(/\D/g, '');
    const phone = rawPhone.length === 10 ? `52${rawPhone}` : rawPhone;
    const message = encodeURIComponent(
      `¡Hola Rebeca! Vi en tu galería de referencias el diseño "${item.title}" (${item.servings}). Me gustaría cotizar uno similar para mi evento.`
    );
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleCreateNewReference = () => {
    const nextNum = (items.length + 1).toString().padStart(2, '0') + 'A';
    const newItem: PortfolioItem = {
      id: `ref-${Date.now()}`,
      frameNum: nextNum,
      title: 'Nuevo Diseño de Referencia',
      category: 'Temático / Celebración',
      servings: '12 a 15 personas',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      description: 'Pastel personalizado con temática especial elaborado en nuestro taller en Toluca.',
    };
    onAddPortfolioItem?.(newItem);
  };

  return (
    <section id="referencias" className="py-16 sm:py-20 bg-[#141414] text-white overflow-hidden border-t-2 border-b-2 border-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
        
        {/* Encabezado estilo rollo de cámara */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#99ffcc] border border-[#99ffcc]/40 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Rollo de Cámara • Nuestro Trabajo Real</span>
            </div>

            <h2 className="font-recoleta text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Galería de Referencias
            </h2>

            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              Fotos reales de pasteles horneados y decorados en nuestro taller en Toluca y Metepec. Cada diseño es único para cada celebración.
            </p>
          </div>

          {/* Controles de deslizamiento y botón de agregar en modo edición */}
          <div className="flex items-center gap-3 self-start md:self-end flex-wrap">
            {isEditMode && (
              <button
                type="button"
                onClick={handleCreateNewReference}
                className="px-3.5 py-2 rounded-full bg-[#99ffcc] hover:bg-[#80ffbf] text-black font-extrabold text-xs flex items-center gap-1.5 border border-black shadow-md active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Agregar Referencia</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Deslizar galería hacia la izquierda"
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all active:scale-95 flex items-center justify-center min-w-[44px] min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Deslizar galería hacia la derecha"
              className="p-3 rounded-full bg-[#99ffcc] hover:bg-[#80ffbf] text-black border border-black transition-all active:scale-95 flex items-center justify-center font-bold min-w-[44px] min-h-[44px]"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIRA DE PELÍCULA / ROLLO DE CÁMARA (FILM STRIP TRACK)          */}
      {/* ============================================================== */}
      <div className="relative w-full">
        {/* Perforaciones superiores de película (Sprockets) */}
        <div className="w-full h-6 bg-[#0a0a0a] border-y border-white/15 flex items-center justify-between px-2 overflow-hidden select-none">
          <div className="flex items-center gap-3 text-[10px] tracking-[6px] font-mono text-white/30 whitespace-nowrap">
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} className="inline-block w-3.5 h-2.5 rounded-xs bg-white/20 border border-white/10" />
            ))}
          </div>
        </div>

        {/* Contenedor desplazable de cuadros de película */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-6 overflow-x-auto py-6 px-4 sm:px-8 scrollbar-none scroll-smooth bg-[#111111]"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex-shrink-0 w-[290px] sm:w-[330px] bg-[#1a1a1a] rounded-2xl border overflow-hidden flex flex-col justify-between group transition-all duration-300 ${
                isEditMode ? 'border-dashed border-[#99ffcc]/70 shadow-lg' : 'border-white/20 hover:border-[#99ffcc] hover:scale-[1.01]'
              }`}
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Barra superior de cuadro de película */}
              <div className="px-3.5 py-2 bg-black/60 border-b border-white/10 flex items-center justify-between font-mono text-[10px] text-white/60">
                <span className="flex items-center gap-1">
                  🎞️ KODAK CHUCHES • <span className="text-[#99ffcc] font-bold">{item.frameNum}</span>
                </span>
                
                {isEditMode ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => onUpdatePortfolioItem?.({ ...item, category: e.target.value })}
                      className="bg-white/10 text-white text-[10px] px-2 py-0.5 rounded border border-white/20 focus:outline-none focus:border-[#99ffcc] max-w-[120px]"
                      placeholder="Categoría..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Eliminar la referencia "${item.title}"?`)) {
                          onDeletePortfolioItem?.(item.id);
                        }
                      }}
                      className="p-1 rounded text-stone-400 hover:text-rose-400 transition-colors"
                      title="Eliminar esta foto de la galería"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/80 font-sans">
                    {item.category}
                  </span>
                )}
              </div>

              {/* Fotografía del pastel */}
              <div className="relative aspect-[4/3] bg-black overflow-hidden group/img">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                />

                {/* Porciones tag */}
                {isEditMode ? (
                  <div className="absolute bottom-2 left-2 z-10">
                    <input
                      type="text"
                      value={item.servings}
                      onChange={(e) => onUpdatePortfolioItem?.({ ...item, servings: e.target.value })}
                      placeholder="8 a 12 personas"
                      className="bg-black/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30 focus:outline-none max-w-[120px]"
                    />
                  </div>
                ) : (
                  <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-white/20">
                    {item.servings}
                  </div>
                )}

                {/* Botón Cambiar Foto en modo edición */}
                {isEditMode && (
                  <div className="absolute inset-0 bg-black/50 opacity-90 sm:opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity z-20">
                    <button
                      type="button"
                      onClick={() => {
                        if (onTriggerChangeImage) {
                          onTriggerChangeImage(item);
                        } else {
                          setActiveUrlPromptId(item.id);
                          setTempUrlInput(item.image);
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 text-stone-800" />
                      <span>Cambiar Foto</span>
                    </button>
                  </div>
                )}

                {/* URL Prompt en caso de edición manual */}
                {activeUrlPromptId === item.id && (
                  <div className="absolute inset-0 bg-stone-900/95 p-3 flex flex-col justify-center gap-2 z-30">
                    <span className="text-[11px] font-bold text-white">URL de la nueva foto:</span>
                    <input
                      type="url"
                      value={tempUrlInput}
                      onChange={(e) => setTempUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full text-xs p-1.5 bg-black text-white border border-stone-700 rounded-lg"
                    />
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveUrlPromptId(null)}
                        className="px-2 py-1 text-[11px] text-stone-400 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (tempUrlInput.trim()) {
                            onUpdatePortfolioItem?.({ ...item, image: tempUrlInput.trim() });
                          }
                          setActiveUrlPromptId(null);
                        }}
                        className="px-2.5 py-1 text-[11px] bg-[#99ffcc] text-black font-bold rounded"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Ficha descriptiva y acción */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-[#1e1e1e]">
                <div className="space-y-1.5">
                  {isEditMode ? (
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                        Título de Referencia
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => onUpdatePortfolioItem?.({ ...item, title: e.target.value })}
                        className="w-full font-recoleta font-bold text-sm sm:text-base text-white border-b border-dashed border-[#99ffcc]/60 focus:border-[#99ffcc] bg-transparent py-0.5 focus:outline-none"
                        placeholder="Título del pastel..."
                      />
                    </div>
                  ) : (
                    <h4 className="font-recoleta font-bold text-base text-white group-hover:text-[#99ffcc] transition-colors leading-snug">
                      {item.title}
                    </h4>
                  )}

                  {isEditMode ? (
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
                        Descripción
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => onUpdatePortfolioItem?.({ ...item, description: e.target.value })}
                        className="w-full text-white/80 text-xs border-b border-dashed border-stone-600 focus:border-[#99ffcc] bg-transparent py-0.5 focus:outline-none resize-none leading-relaxed"
                        placeholder="Descripción del diseño..."
                      />
                    </div>
                  ) : (
                    <p className="text-white/65 text-xs line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuoteDesign(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-[#99ffcc] hover:text-black text-white text-xs font-bold border border-white/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Cotizar diseño</span>
                  </button>

                  <a
                    href="https://instagram.com/laschucheriasdebecca"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ver en Instagram"
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Tarjeta de Agregar Nueva Referencia al final del carrusel en Modo Edición */}
          {isEditMode && (
            <div
              onClick={handleCreateNewReference}
              className="flex-shrink-0 w-[240px] sm:w-[280px] bg-white/5 hover:bg-white/10 rounded-2xl border-2 border-dashed border-[#99ffcc]/60 hover:border-[#99ffcc] cursor-pointer flex flex-col items-center justify-center p-6 text-center transition-all group active:scale-98"
            >
              <div className="w-12 h-12 rounded-full bg-[#99ffcc] text-black flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-white group-hover:text-[#99ffcc] transition-colors">
                + Agregar Referencia
              </span>
              <span className="text-xs text-white/60 mt-1 max-w-[180px]">
                Sube una nueva foto de tus pasteles temáticos o Pinterest
              </span>
            </div>
          )}
        </div>

        {/* Perforaciones inferiores de película (Sprockets) */}
        <div className="w-full h-6 bg-[#0a0a0a] border-y border-white/15 flex items-center justify-between px-2 overflow-hidden select-none">
          <div className="flex items-center gap-3 text-[10px] tracking-[6px] font-mono text-white/30 whitespace-nowrap">
            {Array.from({ length: 40 }).map((_, i) => (
              <span key={i} className="inline-block w-3.5 h-2.5 rounded-xs bg-white/20 border border-white/10" />
            ))}
          </div>
        </div>
      </div>

      {/* Footer del rollo con enlace directo a Instagram */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>¿Tienes una foto de Pinterest o idea propia? La horneamos para ti.</span>
        </div>

        <a
          href="https://instagram.com/laschucheriasdebecca"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black border border-white/20 font-bold transition-all"
        >
          <Instagram className="w-4 h-4" />
          <span>Sigue a @laschucheriasdebecca en Instagram</span>
        </a>
      </div>
    </section>
  );
};
