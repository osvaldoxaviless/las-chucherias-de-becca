import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Check, X, Move, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  imageSrc: string | null;
  productName?: string;
  onSave: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export const ImageCropModal: React.FC<Props> = ({
  isOpen,
  imageSrc,
  productName,
  onSave,
  onCancel,
}) => {
  if (!isOpen || !imageSrc) return null;

  // Zoom: 1.0 to 3.0
  const [zoom, setZoom] = useState<number>(1.0);
  // Pan offsets in pixels (-200 to 200)
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  // Rotation in degrees (0, 90, 180, 270)
  const [rotation, setRotation] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Load image object
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageObjRef.current = img;
      // Reset controls on new image load
      setZoom(1.0);
      setOffsetX(0);
      setOffsetY(0);
      setRotation(0);
      renderCanvas();
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Re-render canvas whenever zoom, offset, or rotation changes
  useEffect(() => {
    renderCanvas();
  }, [zoom, offsetX, offsetY, rotation]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Target 4:3 aspect ratio (e.g. 800 x 600 px)
    const targetWidth = 800;
    const targetHeight = 600;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.save();

    // Center of canvas
    ctx.translate(targetWidth / 2 + offsetX * (targetWidth / 400), targetHeight / 2 + offsetY * (targetHeight / 300));
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate aspect fill
    const imgAspect = img.width / img.height;
    const targetAspect = targetWidth / targetHeight;

    let drawWidth = targetWidth;
    let drawHeight = targetHeight;

    if (imgAspect > targetAspect) {
      // Image is wider than 4:3
      drawHeight = targetHeight;
      drawWidth = targetHeight * imgAspect;
    } else {
      // Image is taller than 4:3
      drawWidth = targetWidth;
      drawHeight = targetWidth / imgAspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
    onSave(croppedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border-2 border-black shadow-modal overflow-hidden flex flex-col my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 bg-[#faf9f5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#e9d5ff] border border-black flex items-center justify-center text-black">
              <Sparkles className="w-4 h-4 text-purple-700" />
            </div>
            <div>
              <h3 className="font-recoleta font-bold text-base text-black">
                Ajustar y Encuadrar Foto
              </h3>
              <p className="text-[11px] text-black/60 truncate max-w-[240px]">
                {productName ? `Postre: "${productName}"` : 'Previsualiza cómo lucirá en tu tienda'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-full hover:bg-black/5 text-black/60 hover:text-black transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Area (4:3 Ratio matching product cards) */}
        <div className="p-4 sm:p-6 bg-stone-100 flex flex-col items-center justify-center border-b border-black/10">
          <div className="relative w-full max-w-[380px] aspect-[4/3] rounded-2xl overflow-hidden border-2 border-black bg-white shadow-sm flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full object-cover"
            />

            {/* Subtle 4:3 Guide Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-dashed border-white/50 m-2 rounded-xl" />

            <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              Vista previa (4:3)
            </div>
          </div>
          <span className="text-[11px] text-stone-500 mt-2">
            Así es exactamente como se verá la tarjeta en el catálogo
          </span>
        </div>

        {/* Adjustment Controls */}
        <div className="p-4 sm:p-5 space-y-4 bg-white">
          
          {/* Zoom Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-black">
              <span className="flex items-center gap-1.5">
                <ZoomIn className="w-3.5 h-3.5 text-black/70" />
                <span>Zoom (Acercar / Alejar)</span>
              </span>
              <span className="font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                {zoom.toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1.0, +(z - 0.1).toFixed(1)))}
                className="w-8 h-8 rounded-lg border border-black/20 hover:border-black bg-white flex items-center justify-center text-xs font-bold active:scale-95"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min="1.0"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-purple-600 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, +(z + 0.1).toFixed(1)))}
                className="w-8 h-8 rounded-lg border border-black/20 hover:border-black bg-white flex items-center justify-center text-xs font-bold active:scale-95"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Posición Vertical (Encuadre Arriba / Abajo) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-black">
              <span className="flex items-center gap-1.5">
                <Move className="w-3.5 h-3.5 text-black/70" />
                <span>Posición Vertical (Centrar foto)</span>
              </span>
              <button
                type="button"
                onClick={() => { setOffsetY(0); setOffsetX(0); }}
                className="text-[10px] text-purple-700 hover:underline font-semibold"
              >
                Centrar foto
              </button>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={offsetY}
              onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
              className="w-full accent-purple-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>↑ Subir encuadre</span>
              <span>Centrado</span>
              <span>↓ Bajar encuadre</span>
            </div>
          </div>

          {/* Botones de acción rápida: Girar y Presets */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-black/10">
            <button
              type="button"
              onClick={handleRotate}
              className="px-3 py-2 rounded-xl border border-black/20 hover:border-black bg-white text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all text-black"
            >
              <RotateCw className="w-3.5 h-3.5 text-black" />
              <span>Girar 90°</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOffsetY(-40)}
                className="px-2.5 py-1.5 rounded-lg border border-black/20 text-[11px] font-semibold text-black hover:bg-stone-50"
              >
                Enfocar Arriba
              </button>
              <button
                type="button"
                onClick={() => setOffsetY(40)}
                className="px-2.5 py-1.5 rounded-lg border border-black/20 text-[11px] font-semibold text-black hover:bg-stone-50"
              >
                Enfocar Abajo
              </button>
            </div>
          </div>

          {/* Confirmation Buttons */}
          <div className="flex items-center gap-2 pt-3 border-t border-black/10">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl border border-black/20 text-xs font-bold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-3 rounded-xl bg-[#99ffcc] hover:bg-[#80ffbf] text-black text-xs font-bold border border-black flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95"
            >
              <Check className="w-4 h-4 text-black" />
              <span>Guardar y Aplicar Foto</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
