import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { mockBackend } from '../services/mockBackend';
import { Product, Category, FilterOption } from '../types';
import ProductCard from '../components/ProductCard';
import { Filter, Search, ChevronDown, ChevronUp } from 'lucide-react';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Dynamic filters state: { [filterId]: selectedValues }
  // For range: [min, max]
  // For checkbox: string[]
  const [selectedFilters, setSelectedFilters] = useState<Record<string, any>>({});
  const [expandedFilters, setExpandedFilters] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const categories = mockBackend.getCategories();
    const currentCategory = categories.find(c => c.id === slug);
    setCategory(currentCategory || null);

    if (currentCategory) {
      const data = mockBackend.getProducts();
      const categoryProducts = data.filter(p => p.category === currentCategory.name);
      setAllProducts(categoryProducts);
      setProducts(categoryProducts);

      // Initialize filters
      const initialFilters: Record<string, any> = {};
      const initialExpanded: Record<string, boolean> = {};
      
      currentCategory.filters?.forEach(filter => {
        initialExpanded[filter.id] = true;
        if (filter.type === 'range') {
          initialFilters[filter.id] = [filter.min || 0, filter.max || 10000];
        } else {
          initialFilters[filter.id] = [];
        }
      });
      setSelectedFilters(initialFilters);
      setExpandedFilters(initialExpanded);
    } else {
      setAllProducts([]);
      setProducts([]);
    }
  }, [slug]);

  useEffect(() => {
    if (!category?.filters) return;

    let filtered = allProducts;

    category.filters.forEach(filter => {
      const selectedValue = selectedFilters[filter.id];
      
      if (filter.type === 'range') {
        const [min, max] = selectedValue || [0, 1000000];
        // Assuming 'price' is the only range filter for now, or map filter.id to product property
        if (filter.id === 'price') {
          filtered = filtered.filter(p => p.price >= min && p.price <= max);
        }
      } else if (filter.type === 'checkbox') {
        if (selectedValue && selectedValue.length > 0) {
          filtered = filtered.filter(p => {
            // Check top-level properties
            if (filter.id === 'brand' && p.brand) {
              return selectedValue.includes(p.brand);
            }
            if (filter.id === 'subCategory' && p.subCategory) {
              return selectedValue.includes(p.subCategory);
            }
            
            // Check specs
            if (p.specs && p.specs[filter.id]) {
              // Exact match or partial match? Let's try partial for specs like "Intel Core i5" vs "i5"
              // But here options are usually exact.
              // For specs like "processor", product might have "Intel Core i9-13900K" and filter option "Intel Core i9"
              const specValue = p.specs[filter.id];
              if (!specValue) return false;
              return selectedValue.some((val: string) => specValue.includes(val));
            }
            
            return false;
          });
        }
      }
    });

    setProducts(filtered);
  }, [selectedFilters, allProducts, category]);

  const handleFilterChange = (filterId: string, value: any) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  const toggleFilterExpanded = (filterId: string) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterId]: !prev[filterId]
    }));
  };

  const toggleCheckboxFilter = (filterId: string, option: string) => {
    const currentSelected = selectedFilters[filterId] || [];
    const newSelected = currentSelected.includes(option)
      ? currentSelected.filter((item: string) => item !== option)
      : [...currentSelected, option];
    handleFilterChange(filterId, newSelected);
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-500">Catégorie introuvable</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 shrink-0 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-32 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-2 mb-6">
              <Filter size={20} className="text-primary" />
              <h3 className="font-bold text-lg">Filtres</h3>
            </div>

            {category.filters?.map(filter => (
              <div key={filter.id} className="mb-6 border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                <div 
                  className="flex items-center justify-between cursor-pointer mb-4"
                  onClick={() => toggleFilterExpanded(filter.id)}
                >
                  <h4 className="font-bold text-sm uppercase">{filter.name}</h4>
                  {expandedFilters[filter.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {expandedFilters[filter.id] && (
                  <div>
                    {filter.type === 'range' && (
                      <div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                          <span>{selectedFilters[filter.id]?.[0] || filter.min} MAD</span>
                          <span>{selectedFilters[filter.id]?.[1] || filter.max} MAD</span>
                        </div>
                        <input 
                          type="range" 
                          min={filter.min} 
                          max={filter.max} 
                          step={filter.step}
                          value={selectedFilters[filter.id]?.[1] || filter.max}
                          onChange={(e) => handleFilterChange(filter.id, [selectedFilters[filter.id]?.[0] || filter.min, parseInt(e.target.value)])}
                          className="w-full accent-primary h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}

                    {filter.type === 'checkbox' && (
                      <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                        {filter.options?.map(option => (
                          <label key={option} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary transition-colors">
                            <input 
                              type="checkbox" 
                              checked={selectedFilters[filter.id]?.includes(option) || false}
                              onChange={() => toggleCheckboxFilter(filter.id, option)}
                              className="rounded border-gray-300 text-primary focus:ring-primary" 
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2 uppercase">{category.name}</h1>
            <p className="text-gray-500 text-sm max-w-2xl">
              Découvrez notre sélection de {category.name} pour des performances optimales.
            </p>
          </div>

          {/* Sub Categories */}
          {category.subCategories && category.subCategories.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {category.subCategories.map(sub => (
                <div 
                  key={sub.id}
                  className="group relative overflow-hidden rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img src={sub.image} alt={sub.name} className="w-full h-24 object-cover group-hover:scale-110 transition-transform duration-500" />
                  <span className="absolute bottom-3 left-3 text-white font-bold text-xs z-20">{sub.name}</span>
                </div>
              ))}
            </div>
          )}

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">Aucun produit ne correspond à vos critères.</p>
              <button 
                onClick={() => {
                   const initialFilters: Record<string, any> = {};
                   category.filters?.forEach(filter => {
                     if (filter.type === 'range') {
                       initialFilters[filter.id] = [filter.min || 0, filter.max || 10000];
                     } else {
                       initialFilters[filter.id] = [];
                     }
                   });
                   setSelectedFilters(initialFilters);
                }}
                className="mt-4 text-primary font-bold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
