import React from 'react';
import { motion } from 'motion/react';
import { Cpu, HardDrive, Monitor, Settings, Zap } from 'lucide-react';

const Configurator = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Configurateur PC</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Créez votre PC sur mesure avec notre configurateur intelligent. Choisissez vos composants et nous nous occupons du montage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Placeholder for configuration steps */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Bureautique</h3>
            <p className="text-sm text-gray-500">Pour le travail et la navigation web</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group border-primary/20 ring-1 ring-primary/10">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary/30">
              <Zap size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-primary">Gaming</h3>
            <p className="text-sm text-gray-500">Pour jouer aux derniers titres en haute qualité</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Settings size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Workstation</h3>
            <p className="text-sm text-gray-500">Pour le montage vidéo et la 3D</p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">Le configurateur complet est en cours de développement...</p>
        </div>
      </div>
    </div>
  );
};

export default Configurator;
