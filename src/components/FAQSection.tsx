import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../data/faq';
import { StoreConfig } from '../types';

interface Props {
  config: StoreConfig;
}

export const FAQSection: React.FC<Props> = ({ config }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="py-16 sm:py-20 bg-[#f5f4f0] border-b border-black/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-black text-xs font-bold text-black">
            <span>Dudas Frecuentes</span>
          </div>
          <h2 className="font-recoleta text-3xl sm:text-4xl font-bold text-black tracking-tight">
            Todo lo que necesitas saber
          </h2>
          <p className="text-xs sm:text-sm text-[#222222]">
            Tiempos de anticipación, zonas de entrega y pagos
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-card border border-black overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(idx)}
                  className={`w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-black transition-colors ${
                    isOpen ? 'bg-[#99ffcc]/30' : 'hover:bg-[#f5f4f0]'
                  }`}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-black transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 text-xs sm:text-sm text-[#222222] leading-relaxed border-t border-black/10 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
