import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ExternalLink } from 'lucide-react';

export default function PartnersPage() {
  const partners = [
    { name: 'ASUS ROG', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/de/ROG_logo.png', desc: 'Republic of Gamers' },
    { name: 'MSI', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/MSI_Logo_2019.svg', desc: 'True Gaming' },
    { name: 'NVIDIA', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg', desc: 'GeForce RTX' },
    { name: 'AMD', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7c/AMD_Logo.svg', desc: 'Ryzen & Radeon' },
    { name: 'Logitech G', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Logitech_logo.svg', desc: 'Advanced Gaming Gear' },
    { name: 'Corsair', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/36/Corsair_logo_2020.svg', desc: 'High Performance Gear' },
    { name: 'Razer', logo: 'https://upload.wikimedia.org/wikipedia/en/4/40/Razer_snake_logo.svg', desc: 'For Gamers. By Gamers.' },
    { name: 'Intel', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg', desc: 'Intel Core Processors' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-32">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-primary flex items-center gap-1"><Home size={14} /> Accueil</Link>
        <ChevronRight size={14} />
        <span className="text-primary font-bold">Nos Partenaires</span>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold font-display text-gray-900 mb-4">Nos Partenaires Officiels</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Nous travaillons en étroite collaboration avec les plus grandes marques mondiales pour vous garantir des produits authentiques et performants.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {partners.map((partner, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center hover:shadow-md transition-shadow group">
            <div className="h-24 w-full flex items-center justify-center mb-4 grayscale group-hover:grayscale-0 transition-all duration-300">
              <img src={partner.logo} alt={partner.name} className="max-h-full max-w-full object-contain" />
            </div>
            <h3 className="font-bold text-gray-900">{partner.name}</h3>
            <p className="text-xs text-gray-500">{partner.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
