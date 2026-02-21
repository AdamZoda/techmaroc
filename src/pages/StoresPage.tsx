import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, MapPin, Phone, Clock } from 'lucide-react';
import { getStores } from '../services/supabaseService';
import { Store } from '../types';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    getStores().then(setStores);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary flex items-center gap-1"><Home size={14} /> Accueil</Link>
        <ChevronRight size={14} />
        <span className="text-primary font-bold">Nos Magasins</span>
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Nos Points de Vente</h1>
        <p className="text-gray-500">Venez découvrir nos produits et tester les dernières configurations dans nos showrooms.</p>
      </div>

      <div className="space-y-12">
        {stores.map((store, idx) => (
          <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col md:flex-row">
            <div className="md:w-1/2 h-64 md:h-auto relative">
              <img src={store.map} alt={store.city} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-3xl font-bold font-display">{store.city}</h3>
              </div>
            </div>
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Adresse</h4>
                    <p className="text-gray-600">{store.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Téléphone</h4>
                    <p className="text-gray-600">{store.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Horaires</h4>
                    <p className="text-gray-600">{store.hours}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-primary transition-colors">
                  Itinéraire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
