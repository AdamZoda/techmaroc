import { useEffect } from 'react';
import { mockBackend } from '../services/mockBackend';

export default function ThemeManager() {
  useEffect(() => {
    const applyTheme = () => {
      const config = mockBackend.getSiteConfig();
      if (config.primaryColor) {
        document.documentElement.style.setProperty('--color-primary', config.primaryColor);
        
        // Simple darkening for dark variant (not perfect but works for demo)
        // We can't easily manipulate hex in vanilla JS without a helper, 
        // so we'll just use the same color or rely on opacity if needed.
        // For now, let's just set the primary.
        // Ideally we would calculate primary-light and primary-dark.
      }
    };

    applyTheme();
    window.addEventListener('siteConfigUpdated', applyTheme);
    return () => window.removeEventListener('siteConfigUpdated', applyTheme);
  }, []);

  return null;
}
