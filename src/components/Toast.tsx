import React, { useEffect } from 'react';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

interface Props {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  onOpenCart: () => void;
}

export const Toast: React.FC<Props> = ({ message, isVisible, onClose, onOpenCart }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 inset-x-4 sm:top-6 sm:right-6 sm:inset-x-auto sm:w-auto sm:max-w-sm z-50 animate-bounce-short">
      <div className="bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="font-medium text-stone-200">{message}</span>
        </div>
        <button
          onClick={onOpenCart}
          className="min-h-[44px] px-2 py-1 flex items-center gap-1 font-bold text-rose-400 hover:text-rose-300 underline whitespace-nowrap ml-2"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Ver Carrito</span>
        </button>
      </div>
    </div>
  );
};
