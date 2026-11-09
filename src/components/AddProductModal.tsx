import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { X, Plus, Upload, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const AddProductModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(180);
  const [category, setCategory] = useState<ProductCategory>('chucherias');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80');
  const [prepTime, setPrepTime] = useState('24 hrs');
  const [badge, setBadge] = useState('');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImage(event.target.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: name.trim(),
      price: Number(price) || 0,
      category,
      description: description.trim() || 'Elaborado artesanalmente por Las chucherías de Becca.',
      image: image.trim(),
      available: true,
      preparationTime: prepTime.trim() || '24 hrs',
      badge: badge.trim() || undefined,
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border-2 border-black shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scaleUp">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-black/10 flex items-center justify-between bg-[#faf9f5]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#99ffcc] border border-black text-black">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-recoleta font-bold text-lg text-black">
                Agregar Nuevo Postre al Menú
              </h3>
              <p className="text-xs text-stone-500">
                Se añadirá de inmediato a la vista de tus clientes
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs">
          
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Nombre del Postre *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Fresas con Chocolate Belga"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold focus:outline-none focus:ring-2 focus:ring-black bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Precio ($ MXN) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="180"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Categoría *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-semibold focus:outline-none focus:ring-2 focus:ring-black bg-white"
              >
                <option value="chucherias">Fresas, Uvas & Manzanas</option>
                <option value="pasteles">Pasteles</option>
                <option value="cupcakes">Cupcakes</option>
                <option value="galletas-brownies">Galletas & Brownies</option>
                <option value="cajas-regalo">Cajas de Regalo</option>
              </select>
            </div>
          </div>

          {/* Image */}
          <div className="space-y-2 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <label className="font-bold text-stone-800 block">Foto del Postre *</label>
            <div className="flex items-center gap-3">
              <img
                src={image}
                alt="Vista previa"
                className="w-14 h-14 rounded-xl object-cover border border-stone-300 flex-shrink-0"
              />
              <div className="flex-1 space-y-1.5">
                <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 border-dashed border-stone-300 hover:border-black cursor-pointer bg-white hover:bg-stone-100 transition-colors text-xs font-bold text-stone-800">
                  <Upload className="w-3.5 h-3.5 text-stone-600" />
                  <span>Subir foto desde celular o PC</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                </label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="o pega URL de la imagen..."
                  className="w-full px-2.5 py-1 text-[11px] rounded-lg border border-stone-300 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Tiempo de Preparación
              </label>
              <input
                type="text"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="24 hrs"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">
                Etiqueta / Distintivo (Opcional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ej: Bestseller, Nuevo, Favorito"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-black bg-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Descripción del Postre
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los ingredientes, presentación o porción..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-black bg-white"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-300 text-stone-600 font-bold hover:bg-stone-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#99ffcc] text-black border border-black font-extrabold flex items-center gap-1.5 shadow-xs hover:bg-[#80ffbf] active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Añadir al Menú</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
