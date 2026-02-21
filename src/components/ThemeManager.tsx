import { useEffect } from 'react';
import { getSiteConfig } from '../services/supabaseService';

export default function ThemeManager() {
  useEffect(() => {
    const applyTheme = async () => {
      const config = await getSiteConfig();
      if (config?.primaryColor) {
        document.documentElement.style.setProperty('--color-primary', config.primaryColor);
      }
    };

    applyTheme();
    const handleUpdate = () => applyTheme();
    window.addEventListener('siteConfigUpdated', handleUpdate);
    return () => window.removeEventListener('siteConfigUpdated', handleUpdate);
  }, []);

  return null;
}
