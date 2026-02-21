import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';
import { getProducts } from '../services/supabaseService';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';

export default function NewArrivalsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getProducts().then(all => setProducts(all.filter(p => p.isNew)));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary flex items-center gap-1"><Home size={14} /> Accueil</Link>
        <ChevronRight size={14} />
        <span className="text-primary font-bold">Nouvel Arrivage</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-gray-900 mb-2">Nouvel Arrivage</h1>
        <p className="text-gray-500">Découvrez les dernières nouveautés Tech & Gaming au Maroc.</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-gray-500">Aucun nouveau produit pour le moment.</p>
        </div>
      )}
    </div>
  );
}
