import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingCart, Heart, BarChart2, Search, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative">
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isPromo && (
          <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
            Promo
          </span>
        )}
        {product.isNew && (
          <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            New
          </span>
        )}
        {product.stock <= 5 && product.stock > 0 && (
          <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg flex items-center gap-1">
            Last {product.stock}
          </span>
        )}
      </div>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative h-64 p-8 bg-white flex items-center justify-center group-hover:bg-gray-50 transition-colors">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain transform group-hover:scale-110 transition-transform duration-500"
        />
      </Link>

      {/* Content */}
      <div className="p-6 border-t border-gray-100">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description Preview */}
        {product.description && (
          <p className="text-xs text-gray-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Specs */}
        <ul className="text-xs text-gray-500 space-y-1 mb-4">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            {product.specs.processor}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            {product.specs.gpu}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            {product.specs.ram} / {product.specs.storage}
          </li>
        </ul>

        {/* Price */}
        <div className="mb-4">
          {product.promoPrice ? (
            <div className="flex flex-col">
              <span className="text-gray-400 line-through text-sm">{product.price.toLocaleString()} MAD</span>
              <span className="text-2xl font-bold text-primary">{product.promoPrice.toLocaleString()} MAD</span>
            </div>
          ) : (
            <span className="text-2xl font-bold text-primary">{product.price.toLocaleString()} MAD</span>
          )}
        </div>

        {/* Stock Status */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wide">En Stock</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110">
              <Search size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110">
              <BarChart2 size={16} />
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-primary hover:text-white transition-all hover:scale-110">
              <Heart size={16} />
            </button>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all hover:scale-110 shadow-lg shadow-primary/30"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCard);
