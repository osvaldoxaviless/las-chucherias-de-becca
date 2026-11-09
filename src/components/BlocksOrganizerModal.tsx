import React from 'react';
import { X, ArrowUp, ArrowDown, Eye, EyeOff, LayoutGrid, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  blockOrder: string[];
  hiddenBlocks: string[];
  blockDefinitions: Record<string, { name: string; icon: string }>;
  onMoveBlock: (index: number, direction: 'up' | 'down') => void;
  onToggleHideBlock: (blockId: string) => void;
  onClose: () => void;
}

export const BlocksOrganizerModal: React.FC<Props> = ({
  isOpen,
  blockOrder,
  hiddenBlocks,
  blockDefinitions,
  onMoveBlock,
  onToggleHideBlock,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-black shadow-2xl max-w-md w-full overflow-hidden animate-scaleUp">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 flex items-center justify-between bg-[#faf9f5]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#99ffcc] border border-black text-black">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-recoleta font-bold text-lg text-black">
                Canvas: Organizar Bloques
              </h3>
              <p className="text-xs text-stone-500">
                Reordena o activa/oculta las secciones de tu tienda
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-black hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of blocks */}
        <div className="p-4 sm:p-6 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {blockOrder.map((id, index) => {
            const def = blockDefinitions[id] || { name: id, icon: '📦' };
            const isHidden = hiddenBlocks.includes(id);
            const isFirst = index === 0;
            const isLast = index === blockOrder.length - 1;

            return (
              <div
                key={id}
                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                  isHidden
                    ? 'bg-rose-50/60 border-rose-200 opacity-60'
                    : 'bg-white border-stone-200 hover:border-black shadow-xs'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{def.icon}</span>
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      {def.name}
                    </span>
                    {isHidden && (
                      <span className="text-[10px] text-rose-600 font-semibold">
                        Oculto para los clientes
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Up */}
                  <button
                    type="button"
                    disabled={isFirst}
                    onClick={() => onMoveBlock(index, 'up')}
                    className={`p-1.5 rounded-lg border border-stone-200 transition-all ${
                      isFirst
                        ? 'opacity-25 cursor-not-allowed text-stone-400'
                        : 'hover:bg-stone-900 hover:text-white active:scale-95 text-stone-700'
                    }`}
                    title="Mover arriba"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>

                  {/* Down */}
                  <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onMoveBlock(index, 'down')}
                    className={`p-1.5 rounded-lg border border-stone-200 transition-all ${
                      isLast
                        ? 'opacity-25 cursor-not-allowed text-stone-400'
                        : 'hover:bg-stone-900 hover:text-white active:scale-95 text-stone-700'
                    }`}
                    title="Mover abajo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Hide */}
                  <button
                    type="button"
                    onClick={() => onToggleHideBlock(id)}
                    className={`p-1.5 rounded-lg border transition-all active:scale-95 ${
                      isHidden
                        ? 'bg-rose-100 text-rose-700 border-rose-300'
                        : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                    }`}
                    title={isHidden ? 'Hacer visible' : 'Ocultar'}
                  >
                    {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-[#faf9f5] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-black text-white font-bold text-xs flex items-center gap-1.5 shadow-xs hover:bg-stone-800 active:scale-95"
          >
            <Check className="w-4 h-4 text-[#99ffcc]" />
            <span>Listo</span>
          </button>
        </div>

      </div>
    </div>
  );
};
