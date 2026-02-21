import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div>
          <h3 className="text-xl font-bold font-display mb-6">TECH<span className="text-primary">MAROC</span></h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Leader du Gaming au Maroc. Nous proposons les meilleures configurations PC, composants et périphériques pour les passionnés de jeux vidéo.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
              <Facebook size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
              <Instagram size={18} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Informations</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="#" className="hover:text-primary transition-colors">À propos de nous</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Conditions générales</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Politique de confidentialité</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Mentions légales</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Contactez-nous</Link></li>
            <li><Link to="/admin" className="hover:text-primary transition-colors">Admin Access</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Catégories</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="#" className="hover:text-primary transition-colors">PC Gamer</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Composants</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Périphériques</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Écrans</Link></li>
            <li><Link to="#" className="hover:text-primary transition-colors">Promotions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6">Contact</h4>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary shrink-0" size={18} />
              <span>123 Boulevard Zerktouni, Casablanca, Maroc</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-primary shrink-0" size={18} />
              <span>+212 5 22 00 00 00</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary shrink-0" size={18} />
              <span>contact@techmaroc.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; 2024 TechMaroc Gaming. Tous droits réservés.</p>
      </div>
    </footer>
  );
}
