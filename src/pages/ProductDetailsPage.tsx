import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockBackend } from '../services/mockBackend';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Heart, Share2, ChevronRight, Home, Check, Truck, Shield } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const products = mockBackend.getProducts();
    const found = products.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImage(found.image);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-32">
        <p>Chargement...</p>
      </div>
    );
  }

  const allImages = [product.image, ...(product.images || [])];

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary flex items-center gap-1"><Home size={14} /> Accueil</Link>
          <ChevronRight size={14} />
          <Link to={`/category/${product.category.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-primary">{product.category}</Link>
          <ChevronRight size={14} />
          <span className="text-primary font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Gallery */}
            <div className="p-8 bg-white border-r border-gray-100">
              <div className="relative h-[400px] mb-6 flex items-center justify-center">
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={activeImage} 
                  alt={product.name} 
                  className="max-h-full max-w-full object-contain"
                />
                {product.isPromo && (
                  <span className="absolute top-0 left-0 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-full shadow-lg">
                    PROMO
                  </span>
                )}
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl border-2 flex items-center justify-center p-2 transition-all ${activeImage === img ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-auto">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                    {product.brand || 'TechMaroc'}
                  </span>
                  {product.stock > 0 ? (
                    <span className="flex items-center gap-1 text-green-600 text-xs font-bold uppercase">
                      <Check size={12} /> En Stock
                    </span>
                  ) : (
                    <span className="text-red-500 text-xs font-bold uppercase">Rupture</span>
                  )}
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold font-display text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-4 mb-8">
                  {product.promoPrice ? (
                    <>
                      <span className="text-4xl font-bold text-primary">{product.promoPrice.toLocaleString()} MAD</span>
                      <span className="text-xl text-gray-400 line-through">{product.price.toLocaleString()} MAD</span>
                    </>
                  ) : (
                    <span className="text-4xl font-bold text-primary">{product.price.toLocaleString()} MAD</span>
                  )}
                </div>

                <div className="prose prose-sm text-gray-600 mb-8">
                  <p>{product.description || "Aucune description disponible pour ce produit."}</p>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {Object.entries(product.specs).map(([key, value]) => value && (
                    <div key={key} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="block text-xs text-gray-500 uppercase mb-1">{key}</span>
                      <span className="font-bold text-gray-900 text-sm">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 pt-8 border-t border-gray-100">
                <div className="flex gap-4">
                  <button 
                    onClick={() => addToCart(product)}
                    className="flex-1 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={20} /> AJOUTER AU PANIER
                  </button>
                  <button className="w-14 h-14 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200">
                    <Heart size={24} />
                  </button>
                  <button className="w-14 h-14 bg-gray-50 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors border border-gray-200">
                    <Share2 size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-primary" /> Livraison partout au Maroc
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-primary" /> Garantie 1 an minimum
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
