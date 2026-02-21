import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function FloatingElements() {
  const [showCookie, setShowCookie] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setShowCookie(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowCookie(false);
  };

  return (
    <>
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/212600000000" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 hover:shadow-green-500/30"
      >
        <MessageCircle size={32} />
      </a>

      {/* Cookie Consent */}
      <AnimatePresence>
        {showCookie && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 md:p-6"
          >
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-600 text-center md:text-left">
                Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant, vous acceptez notre politique de confidentialité.
              </p>
              <button 
                onClick={acceptCookies}
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 whitespace-nowrap"
              >
                Accepter tout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
