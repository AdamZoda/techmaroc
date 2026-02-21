import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { mockBackend } from '../services/mockBackend';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { SiteConfig, Product } from '../types';
import TrueFocus from '../components/TrueFocus';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    setProducts(mockBackend.getProducts().filter(p => p.isBestSeller));
    setConfig(mockBackend.getSiteConfig());
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gray-900 text-white overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/95 to-purple-900/50 z-10" />
        <img 
          src={config?.hero.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop"}
          alt="Gaming Setup" 
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        
        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold mb-4 border border-white/20">
                NOUVELLE COLLECTION 2024
              </span>
              <div className="mb-6">
                <TrueFocus 
                  sentence="TECHMAROC GAMING"
                  manualMode={false}
                  blurAmount={5}
                  borderColor="#7c3aed"
                  animationDuration={0.5}
                  pauseBetweenAnimations={1}
                />
              </div>
              <p className="text-gray-300 text-lg max-w-xl mb-8">
                {config?.hero.subtitle || "Découvrez nos PC Gamer assemblés avec passion pour des performances extrêmes."}
              </p>
              <div className="flex gap-4">
                <Link 
                  to="/category/pc-gamer" 
                  className="px-8 py-4 bg-primary hover:bg-white hover:text-primary text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/30 flex items-center gap-2"
                >
                  ACHETER MAINTENANT <ArrowRight size={20} />
                </Link>
                <Link 
                  to="/configurator" 
                  className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold rounded-xl transition-all border border-white/20"
                >
                  CONFIGURATEUR PC
                </Link>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex justify-center items-center relative"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img 
                  src="https://assets.corsair.com/image/upload/f_auto,q_auto/v1/products/Systems/CORSAIR-VENGEANCE-i7500-SERIES/Gallery/Vengeance_i7500_01.webp" 
                  alt="PC Gamer Extreme" 
                  className="w-full max-w-md h-auto drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: Truck, title: 'Livraison Gratuite', desc: 'Partout au Maroc' },
            { icon: ShieldCheck, title: 'Garantie 2 Ans', desc: 'Sur tous nos PC' },
            { icon: Clock, title: 'Service Rapide', desc: 'Support 24/7' },
            { icon: Star, title: 'Expertise', desc: 'Techniciens Qualifiés' },
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden h-80 bg-gray-900 flex items-center">
          <img 
            src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2542&auto=format&fit=crop" 
            alt="Promotion" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="relative z-10 p-12 max-w-2xl">
            <span className="text-primary font-bold tracking-wider uppercase mb-2 block">Offre Spéciale</span>
            <h2 className="text-4xl font-bold text-white mb-6">SETUP COMPLET GAMING</h2>
            <p className="text-gray-300 mb-8">Profitez de -20% sur tous les périphériques pour l'achat d'un PC Gamer.</p>
            <Link to="/category/pc-gamer" className="px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors">
              DÉCOUVRIR L'OFFRE
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
