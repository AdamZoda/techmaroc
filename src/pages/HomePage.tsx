import { useEffect, useState, lazy, Suspense, useMemo, useTransition } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { getProducts, getSiteConfig } from '../services/supabaseService';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'motion/react';
import { SiteConfig, Product } from '../types';

const Model3D = lazy(() => import('../components/Model3D'));

import { MODELS } from '../constants/models';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchConfig = () => getSiteConfig().then(setConfig);
    getProducts().then(all => setProducts(all.filter(p => p.isBestSeller)));
    fetchConfig();

    window.addEventListener('siteConfigUpdated', fetchConfig);
    return () => window.removeEventListener('siteConfigUpdated', fetchConfig);
  }, []);

  // Rotate 3D models every 60 seconds (Adjusted from 120s for better visibility while keeping it calm)
  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(() => {
        setCurrentModelIndex((prev) => (prev + 1) % MODELS.length);
      });
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getYouTubeId = (url: string) => {
    // Enhanced regex to support Shorts and common YouTube URL variants
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const background = useMemo(() => {
    if (config?.hero.bgType === 'video' && config.hero.videoUrl) {
      const ytId = getYouTubeId(config.hero.videoUrl);

      if (ytId) {
        return (
          <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <iframe
              className="w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              src={`https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&showinfo=0&rel=0&enablejsapi=1&modestbranding=1&iv_load_policy=3`}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              loading="lazy"
            />
          </div>
        );
      }

      return (
        <video
          key={config.hero.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
        >
          <source src={config.hero.videoUrl} type="video/mp4" />
          <source src={config.hero.videoUrl} />
        </video>
      );
    }

    return (
      <img
        src={config?.hero.image || "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=2574&auto=format&fit=crop"}
        alt="Gaming Setup"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
    );
  }, [config?.hero.bgType, config?.hero.videoUrl, config?.hero.image]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative min-h-screen text-white overflow-hidden flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent z-10 pointer-events-none" />

        <div className="absolute inset-0 z-0 transform-gpu translate-z-0">
          {background}
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 w-full pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold mb-4 border border-white/20">
                NOUVELLE COLLECTION 2024
              </span>
              <div className="mb-6">
                <h1 className="text-5xl md:text-7xl font-black font-display tracking-tight text-white leading-tight">
                  {config?.hero.title || "TECHMAROC GAMING"}
                </h1>
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
            </div>

            <div className="flex flex-col justify-center items-center relative flex-1 min-h-[400px] md:min-h-[500px]">
              <div className="w-full">
                <Suspense fallback={
                  <div className="w-full h-[400px] md:h-[500px] flex flex-col items-center justify-center relative">
                    <div className="relative">
                      <div className="w-20 h-20 border-2 border-primary/20 rounded-2xl animate-[spin_3s_linear_infinite]" />
                      <div className="absolute inset-0 w-20 h-20 border-t-2 border-primary rounded-2xl animate-[spin_1.5s_ease-out_infinite]" />
                    </div>
                    <div className="mt-6 text-center">
                      <p className="text-primary font-bold tracking-widest uppercase text-[10px] animate-pulse">
                        Synchronisation Setup {currentModelIndex + 1}
                      </p>
                    </div>
                  </div>
                }>
                  <Model3D
                    url={MODELS[currentModelIndex].url}
                    scale={MODELS[currentModelIndex].scale}
                  />
                </Suspense>
              </div>

              {/* Manual Switch Controls */}
              <div className="flex gap-3 mt-4 z-30">
                {MODELS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => startTransition(() => setCurrentModelIndex(idx))}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${currentModelIndex === idx
                      ? 'bg-primary w-8 shadow-lg shadow-primary/40'
                      : 'bg-white/20 hover:bg-white/40'
                      }`}
                    title={`Setup ${idx + 1}`}
                  />
                ))}
              </div>

            </div>
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
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-700"
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
