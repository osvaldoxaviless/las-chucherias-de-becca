import React from 'react';
import { StoreConfig } from '../types';
import { Edit3 } from 'lucide-react';

interface Props {
  config: StoreConfig;
  isEditMode?: boolean;
  onUpdateField?: (field: keyof StoreConfig, value: string) => void;
}

export const AboutBecca: React.FC<Props> = ({
  config,
  isEditMode = false,
  onUpdateField,
}) => {
  return (
    <section id="about-section" className="py-16 sm:py-20 bg-[#f5f4f0] border-b border-black/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-card border border-black p-6 sm:p-10 relative overflow-hidden">
          
          {/* Confetti dots */}
          <div className="absolute top-6 right-8 w-2.5 h-2.5 rounded-full bg-[#ff99cc] pointer-events-none"></div>
          <div className="absolute bottom-6 right-16 w-3 h-3 rounded-full bg-[#99ffcc] pointer-events-none"></div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Foto Real de Rebecca Sánchez */}
            <div className="md:col-span-5">
              <div className="rounded-xl overflow-hidden aspect-[4/5] bg-[#eae8e1] border border-black relative">
                <img
                  src="/images/becca-birthday.jpg"
                  alt="Rebecca Sánchez - Fundadora de Las chucherías de Becca"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-2.5 left-2.5 bg-white border border-black px-2.5 py-0.5 rounded-full text-[11px] font-bold text-black">
                  👩🏻‍🍳 Rebecca Sánchez
                </div>
              </div>
            </div>

            {/* Texto de la Biografía */}
            <div className="md:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#99ffcc] border border-black text-xs font-bold text-black">
                <span>Detrás de la Cocina</span>
              </div>

              {isEditMode ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-stone-600" />
                      <span>Título Sección Nosotros</span>
                    </label>
                    <input
                      type="text"
                      value={config.aboutTitle || 'Hola, soy Becca.'}
                      onChange={(e) => onUpdateField?.('aboutTitle', e.target.value)}
                      placeholder="Hola, soy Becca."
                      className="font-recoleta text-2xl sm:text-4xl font-bold text-black tracking-tight w-full border-b-2 border-dashed border-black/50 focus:border-black focus:outline-none bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1 flex items-center gap-1">
                      <Edit3 className="w-3 h-3 text-stone-600" />
                      <span>Historia de la Pastelería</span>
                    </label>
                    <textarea
                      rows={4}
                      value={config.aboutStory || ''}
                      onChange={(e) => onUpdateField?.('aboutStory', e.target.value)}
                      placeholder="Escribe la historia de Las chucherías de Becca..."
                      className="text-sm sm:text-base text-[#222222] leading-relaxed font-normal w-full border-2 border-dashed border-black/40 rounded-xl p-2.5 focus:border-black focus:outline-none bg-stone-50/50"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-recoleta text-2xl sm:text-4xl font-bold text-black tracking-tight">
                    {config.aboutTitle || 'Hola, soy Becca.'}
                  </h2>

                  <p className="text-sm sm:text-base text-[#222222] leading-relaxed font-normal">
                    {config.aboutStory || (
                      <>
                        <em>Las chucherías de Becca</em> nació de hornear postres que no solo se vean hermosos, sino que tengan un sabor inolvidable. Desde nuestro taller en Toluca elaboramos cada creación artesanalmente con mantequilla pura, chocolate de primera calidad y fruta fresca al día.
                      </>
                    )}
                  </p>
                </>
              )}

              <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
                <span className="px-3 py-1 rounded-full bg-[#ffcc99] border border-black text-black">
                  📍 {(config.address && !config.address.includes('El Oro 112')) ? config.address : 'Toluca, Estado de México'}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#7bbbff] border border-black text-black">
                  🧁 +1,500 seguidores
                </span>
                <span className="px-3 py-1 rounded-full bg-[#ff99cc] border border-black text-black">
                  ✨ {config.city || 'Toluca & Metepec'}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
