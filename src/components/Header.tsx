import React, { useEffect, useState } from 'react';
import { Phone, Search, User, ShoppingCart, Menu, ChevronRight, X, MapPin, Monitor, Cpu, HardDrive, Keyboard, Gamepad, Camera, Package, MonitorPlay, Gamepad2, Armchair, Disc, Tv, Printer, Headphones, Laptop, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { mockBackend } from '../services/mockBackend';
import { Category, SiteConfig } from '../types';
import { useUser } from '../context/UserContext';

const IconMap: Record<string, any> = {
  Monitor, Cpu, HardDrive, Keyboard, Gamepad, Camera, Package, MonitorPlay, Gamepad2, Armchair, Disc, Tv, Printer, Headphones, Laptop, Settings
};

export default function Header() {
  const { items, setIsOpen } = useCart();
  const { user, isAuthenticated } = useUser();
  const [isMegaMenuOpen, setIsMegaMenuOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCategories(mockBackend.getCategories());
    setConfig(mockBackend.getSiteConfig());
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2.5 flex items-center gap-4 shadow-2xl max-w-[95%] w-full xl:w-auto justify-between transition-all duration-300">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 group mr-2">
          <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
            <Monitor size={18} />
          </div>
          <span className="font-bold font-display text-white text-lg hidden sm:block tracking-tight">
            TECH<span className="text-primary">MAROC</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <ul className="hidden xl:flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-gray-200">
          <li 
            className="relative group"
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
          >
            <button 
              onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all whitespace-nowrap border border-white/5"
            >
              <Menu size={16} />
              TOUS NOS PRODUITS
            </button>

            {/* Mega Menu */}
            <AnimatePresence>
              {isMegaMenuOpen && (
                <div className="absolute top-full left-0 mt-4 pt-2 flex items-start shadow-2xl z-50 rounded-2xl overflow-hidden">
                  {/* Categories List */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="w-[300px] bg-white/95 backdrop-blur-xl border border-gray-100 py-2 max-h-[80vh] overflow-y-auto custom-scrollbar relative z-20 rounded-l-2xl"
                  >
                    {categories.map((cat) => {
                      const Icon = IconMap[cat.icon] || Monitor;
                      const isActive = activeCategory === cat.id;
                      
                      return (
                        <div 
                          key={cat.id}
                          onMouseEnter={() => setActiveCategory(cat.id)}
                          className={cn(
                            "flex items-center justify-between px-6 py-3 cursor-pointer transition-colors border-l-4",
                            isActive 
                              ? "bg-purple-50 text-primary border-primary" 
                              : "text-gray-700 hover:bg-gray-50 border-transparent hover:text-primary"
                          )}
                        >
                          <Link to={`/category/${cat.id}`} className="flex items-center gap-4 flex-1">
                            <Icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "text-gray-400")} />
                            <span className="text-xs font-bold uppercase tracking-wide">{cat.name}</span>
                          </Link>
                          {cat.subCategories && cat.subCategories.length > 0 && (
                            <ChevronRight size={14} className={cn("transition-colors", isActive ? "text-primary" : "text-gray-300")} />
                          )}
                        </div>
                      );
                    })}
                  </motion.div>

                  {/* Subcategories Panel */}
                  <AnimatePresence mode="wait">
                    {activeCategory && categories.find(c => c.id === activeCategory)?.subCategories?.length! > 0 && (
                      <motion.div
                        key={activeCategory}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="w-[600px] bg-white/95 backdrop-blur-xl h-auto min-h-[400px] p-8 border-l border-gray-100 z-10 rounded-r-2xl"
                        style={{ minHeight: '100%' }}
                      >
                        <h3 className="text-xl font-bold font-display text-gray-900 mb-6 flex items-center gap-2">
                          {categories.find(c => c.id === activeCategory)?.name}
                          <span className="text-primary text-sm font-normal ml-auto cursor-pointer hover:underline">
                            <Link to={`/category/${activeCategory}`}>Voir tout</Link>
                          </span>
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-6">
                          {categories.find(c => c.id === activeCategory)?.subCategories.map((sub) => (
                            <Link 
                              key={sub.id} 
                              to={`/category/${activeCategory}?sub=${sub.id}`}
                              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200 group-hover:border-primary/30 transition-colors">
                                <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors">{sub.name}</h4>
                                <p className="text-xs text-gray-500 mt-1">Découvrir</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </AnimatePresence>
          </li>

          {[
            { name: 'NOUVEL ARRIVAGE', path: '/new-arrivals' },
            { name: 'MEILLEURES VENTES', path: '/best-sellers' },
            { name: 'PROMOTION', path: '/promotions' },
            { name: 'NOS MAGASINS', path: '/stores' }
          ].map((item, idx) => (
            <li key={idx}>
              <Link to={item.path} className="block px-4 py-2 hover:bg-white/10 rounded-full transition-all whitespace-nowrap hover:text-white">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="relative group mr-2">
            <div className={cn(
              "flex items-center transition-all duration-300 ease-in-out bg-white/5 border border-white/10 rounded-full overflow-hidden",
              isSearchOpen ? "w-64 bg-white/10" : "w-9 h-9 hover:bg-white/10 cursor-pointer"
            )}>
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="w-9 h-9 flex items-center justify-center text-gray-300 hover:text-white shrink-0"
              >
                <Search size={18} />
              </button>
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className={cn(
                  "bg-transparent border-none text-sm text-white placeholder-gray-400 focus:outline-none h-full w-full pr-4 transition-opacity duration-200",
                  isSearchOpen ? "opacity-100 visible" : "opacity-0 invisible w-0 p-0"
                )}
                autoFocus={isSearchOpen}
                onBlur={(e) => !e.target.value && setIsSearchOpen(false)}
              />
            </div>
          </div>

          <div className="h-8 w-px bg-white/10 mx-1 hidden lg:block"></div>

          <Link 
            to={isAuthenticated ? "/profile" : "/login"} 
            className="p-2.5 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors flex items-center justify-center"
          >
            {isAuthenticated && user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <User size={20} />
            )}
          </Link>

          <button onClick={() => setIsOpen(true)} className="p-2.5 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors relative group">
            <ShoppingCart size={20} className="group-hover:text-primary transition-colors" />
            {items.length > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border border-black shadow-lg">
                {items.length}
              </span>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}
