import React from 'react';
import { Instagram, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { StoreConfig } from '../types';

interface Props {
  config: StoreConfig;
}

interface FeedItem {
  image: string;
  caption: string;
  likes: number;
  comments: number;
}

const FEED_ITEMS: FeedItem[] = [
  {
    image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80',
    caption: 'Bento Cake de cumpleaños con buttercream artesanal 🎂💙',
    likes: 124,
    comments: 18,
  },
  {
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=600&q=80',
    caption: 'Cajas de fresas cubiertas con chocolate belga para aniversarios 🍓🍫',
    likes: 189,
    comments: 24,
  },
  {
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?auto=format&fit=crop&w=600&q=80',
    caption: 'Pedacito de amor en un cupcake 🧁🤤 ¡Sabor Red Velvet y Vainilla!',
    likes: 145,
    comments: 12,
  },
  {
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
    caption: '¿Ya probaste las nuevas mini cookies de las Chuches? 🍪✨',
    likes: 210,
    comments: 31,
  },
];

export const InstagramFeed: React.FC<Props> = ({ config }) => {
  return (
    <section className="py-16 bg-[#FFFDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-pink-600 uppercase tracking-wider mb-1">
              <Instagram className="w-4 h-4" />
              <span>Comunidad en Instagram</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-stone-900">
              Sigue el día a día en @{config.instagramHandle}
            </h2>
          </div>

          <a
            href={`https://instagram.com/${config.instagramHandle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold shadow-sm hover:shadow-md transition-all hover:scale-105"
          >
            <Instagram className="w-3.5 h-3.5" />
            <span>Ver perfil completo</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>

        {/* Grid of posts */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FEED_ITEMS.map((item, idx) => (
            <a
              key={idx}
              href={`https://instagram.com/${config.instagramHandle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-2xl overflow-hidden shadow-sm aspect-square bg-stone-100"
            >
              <img
                src={item.image}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />

              {/* Hover overlay with likes and caption */}
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-end gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                    {item.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {item.comments}
                  </span>
                </div>

                <p className="text-xs font-medium line-clamp-2 text-stone-200">
                  {item.caption}
                </p>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
