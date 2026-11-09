import React, { useState } from 'react';
import { X, Sparkles, Heart, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Product } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product) => void;
}

interface QuizOption {
  label: string;
  icon: string;
  value: string;
}

export const CravingOracleModal: React.FC<Props> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
}) => {
  const [step, setStep] = useState(1);
  const [who, setWho] = useState('');
  const [flavor, setFlavor] = useState('');
  const [mood, setMood] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [resultProduct, setResultProduct] = useState<Product | null>(null);

  if (!isOpen) return null;

  const handleFinish = (selectedMood: string) => {
    setMood(selectedMood);
    setIsSpinning(true);

    setTimeout(() => {
      // Pick matching product
      let matched: Product | undefined;

      if (flavor === 'acidito') {
        matched = products.find((p) => p.id === 'chuche-uvas' || p.id === 'chuche-manzanas');
      } else if (flavor === 'frutal') {
        matched = products.find((p) => p.id === 'chuche-fresas-box');
      } else if (who === 'celebracion') {
        matched = products.find((p) => p.id === 'chuche-bento-cake' || p.id === 'chuche-pastel-cumple');
      } else {
        matched = products.find((p) => p.id === 'chuche-mini-cookies' || p.id === 'chuche-brownies-fudge');
      }

      const finalPick = matched || products[0];
      setResultProduct(finalPick);
      setIsSpinning(false);
      setStep(4);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  const restartQuiz = () => {
    setStep(1);
    setWho('');
    setFlavor('');
    setMood('');
    setResultProduct(null);
  };

  const handleAddResult = () => {
    if (resultProduct) {
      onAddToCart(resultProduct);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-pink-200 z-10 p-6 sm:p-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>El Oráculo del Antojo</span>
          </div>
          <h3 className="font-display font-bold text-2xl text-stone-900">
            {step < 4 ? '¿Qué postre es tu match hoy?' : '¡Tu Destino Dulce! 🔮✨'}
          </h3>
          <p className="text-xs text-stone-500">
            {step < 4 ? `Paso ${step} de 3 — Responde en 10 segundos` : 'Preparado con todo el cariño de Becca'}
          </p>
        </div>

        {/* Step 1: ¿Para quién? */}
        {step === 1 && (
          <div className="space-y-4 animate-fadeIn">
            <h4 className="font-bold text-sm text-stone-800 text-center">
              1. ¿Para quién es el antojo hoy?
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Para mí solito y mi momento de paz', icon: '🛋️', val: 'solo' },
                { label: 'Para consentir a mi pareja / amor', icon: '💖', val: 'pareja' },
                { label: 'Para festejar en familia o con amigos', icon: '🎉', val: 'celebracion' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => { setWho(opt.val); setStep(2); }}
                  className="w-full p-4 rounded-2xl border border-stone-200 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/60 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                    <span className="font-bold text-xs sm:text-sm text-stone-800">{opt.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: ¿Qué sabor manda? */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <h4 className="font-bold text-sm text-stone-800 text-center">
              2. ¿Qué vibra de sabor traes en mente?
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Dulce, chocolatoso y apapachador', icon: '🍫', val: 'choco' },
                { label: 'Acidito con chamoy, tamarindo y chilito', icon: '🌶️', val: 'acidito' },
                { label: 'Fresco, frutal y ligero', icon: '🍓', val: 'frutal' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => { setFlavor(opt.val); setStep(3); }}
                  className="w-full p-4 rounded-2xl border border-stone-200 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/60 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                    <span className="font-bold text-xs sm:text-sm text-stone-800">{opt.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: ¿Cuál es la ocasión? */}
        {step === 3 && (
          <div className="space-y-4 animate-fadeIn">
            <h4 className="font-bold text-sm text-stone-800 text-center">
              3. ¿Cuál es la ocasión?
            </h4>
            <div className="space-y-2.5">
              {[
                { label: 'Antojo de media tarde en el trabajo / casa', icon: '⏰', val: 'tarde' },
                { label: 'Cumpleaños o fecha importante', icon: '🎂', val: 'cumple' },
                { label: 'Merezco un premio porque la semana estuvo pesada', icon: '✨', val: 'premio' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  disabled={isSpinning}
                  onClick={() => handleFinish(opt.val)}
                  className="w-full p-4 rounded-2xl border border-stone-200 hover:border-rose-400 bg-stone-50 hover:bg-rose-50/60 text-left transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{opt.icon}</span>
                    <span className="font-bold text-xs sm:text-sm text-stone-800">{opt.label}</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </button>
              ))}
            </div>

            {isSpinning && (
              <div className="py-6 text-center space-y-2">
                <span className="text-4xl block animate-spin">🔮</span>
                <p className="font-handwriting text-xl text-rose-600 font-bold">
                  Consultando con el horno de Becca...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Step 4: The Result! */}
        {step === 4 && resultProduct && (
          <div className="text-center space-y-5 animate-fadeIn">
            <div className="relative rounded-2xl overflow-hidden h-48 bg-stone-100 shadow-md border-2 border-pink-200">
              <img
                src={resultProduct.image}
                alt={resultProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                100% Tu Match
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-2xl text-stone-900">
                {resultProduct.name}
              </h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {resultProduct.description}
              </p>
              <span className="font-display font-bold text-xl text-rose-600 block mt-2">
                ${resultProduct.price.toLocaleString('es-MX')} MXN
              </span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={restartQuiz}
                className="p-3 rounded-2xl border border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-50 transition-colors"
                title="Repetir test"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleAddResult}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>¡Se me antojó! Agregar al Carrito</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
