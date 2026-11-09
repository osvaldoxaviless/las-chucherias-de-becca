import React from 'react';
import { ProductCategory } from '../types';

interface Props {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  counts: Record<ProductCategory, number>;
}

const CATEGORIES: { id: ProductCategory; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'pasteles', label: 'Pasteles & Bento Cakes' },
  { id: 'chucherias', label: 'Fresas, Uvas & Manzanas' },
  { id: 'cupcakes', label: 'Cupcakes' },
  { id: 'galletas-brownies', label: 'Galletas & Brownies' },
  { id: 'cajas-regalo', label: 'Cajas de Regalo' },
];

export const CategoryFilter: React.FC<Props> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id] || 0;

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 min-h-[44px] flex items-center rounded-full text-xs font-bold transition-all border ${
              isActive
                ? '!bg-[#99ffcc] bg-stone-900 text-black border-black shadow-none'
                : 'bg-white text-black border-black/30 hover:border-black hover:bg-[#f5f4f0]'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`ml-1.5 text-[10px] px-2 py-0.5 rounded-full border ${
                isActive ? 'bg-black text-white border-black' : 'bg-[#f5f4f0] text-black border-black/20'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};
