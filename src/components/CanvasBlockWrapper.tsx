import React from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Move } from 'lucide-react';

interface Props {
  blockId: string;
  blockName: string;
  icon?: React.ReactNode;
  isEditMode?: boolean;
  isHidden?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onToggleHide?: () => void;
  children: React.ReactNode;
}

export const CanvasBlockWrapper: React.FC<Props> = ({
  blockId,
  blockName,
  icon,
  isEditMode = false,
  isHidden = false,
  isFirst = false,
  isLast = false,
  onMoveUp,
  onMoveDown,
  onToggleHide,
  children,
}) => {
  // When not in edit mode: if hidden, don't render; otherwise render normally without canvas wrapper
  if (!isEditMode) {
    if (isHidden) return null;
    return <>{children}</>;
  }

  return (
    <div
      data-block-id={blockId}
      className={`relative my-4 sm:my-6 mx-2 sm:mx-4 rounded-3xl transition-all duration-300 ${
        isHidden
          ? 'opacity-40 border-2 border-dashed border-rose-300 bg-rose-50/20'
          : 'border-2 border-dashed border-stone-300 hover:border-black/60 hover:shadow-lg bg-white/30'
      }`}
    >
      {/* Floating Canvas Block Toolbar */}
      <div className="sticky top-14 sm:top-12 z-30 flex items-center justify-between gap-2 px-3 py-1.5 mx-3 sm:mx-6 -mt-3.5 bg-white border-2 border-black rounded-2xl shadow-md">
        
        {/* Block Badge */}
        <div className="flex items-center gap-1.5 text-xs font-black text-black">
          <Move className="w-3.5 h-3.5 text-stone-400 hidden sm:block" />
          {icon}
          <span>{blockName}</span>
          {isHidden && (
            <span className="ml-1.5 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
              Oculto al cliente
            </span>
          )}
        </div>

        {/* Canvas Ordering & Visibility Controls */}
        <div className="flex items-center gap-1">
          {/* Move Up */}
          <button
            type="button"
            disabled={isFirst}
            onClick={onMoveUp}
            className={`p-1.5 rounded-lg border border-stone-200 text-xs font-bold transition-all ${
              isFirst
                ? 'opacity-30 cursor-not-allowed text-stone-400 bg-stone-50'
                : 'hover:bg-stone-900 hover:text-white text-stone-700 active:scale-95'
            }`}
            title="Mover este bloque hacia arriba en el canvas"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          {/* Move Down */}
          <button
            type="button"
            disabled={isLast}
            onClick={onMoveDown}
            className={`p-1.5 rounded-lg border border-stone-200 text-xs font-bold transition-all ${
              isLast
                ? 'opacity-30 cursor-not-allowed text-stone-400 bg-stone-50'
                : 'hover:bg-stone-900 hover:text-white text-stone-700 active:scale-95'
            }`}
            title="Mover este bloque hacia abajo en el canvas"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Hide */}
          <button
            type="button"
            onClick={onToggleHide}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 border transition-all active:scale-95 ${
              isHidden
                ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
            }`}
            title={isHidden ? 'Hacer visible a los clientes' : 'Ocultar a los clientes'}
          >
            {isHidden ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Mostrar</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-stone-600" />
                <span className="hidden sm:inline">Ocultar</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Block Body */}
      <div className="p-1 sm:p-2">
        {children}
      </div>

    </div>
  );
};
