import React, { createContext, useContext, useState, useEffect } from 'react';

interface TranslationContextType {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}

interface TranslationProviderProps {
  children: React.ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang) return savedLang;
    
    const browserLang = navigator.language.split('-')[0];
    return ['en', 'id'].includes(browserLang) ? browserLang : 'en';
  });
  
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load all translations on initial mount
  useEffect(() => {
    const loadAllTranslations = async () => {
      try {
        setIsLoading(true);
        
        // Load both English and Indonesian translations in parallel
        const [enResponse, idResponse] = await Promise.all([
          fetch('/translations/en.json'),
          fetch('/translations/id.json')
        ]);

        if (!enResponse.ok || !idResponse.ok) {
          throw new Error('Failed to load translations');
        }

        const [enData, idData] = await Promise.all([
          enResponse.json(),
          idResponse.json()
        ]);

        setTranslations({
          en: enData,
          id: idData
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to empty translations but don't block the app
        setTranslations({
          en: {},
          id: {}
        });
        setIsLoading(false);
      }
    };

    loadAllTranslations();
  }, []); // Only load translations once on mount

  const setLanguage = (lang: string) => {
    if (['en', 'id'].includes(lang)) {
      setCurrentLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
      // No need to reload translations since we have them all in memory
    } else {
      console.warn(`Unsupported language: ${lang}. Falling back to English.`);
      setCurrentLanguage('en');
      localStorage.setItem('preferredLanguage', 'en');
    }
  };

  const t = (key: string, params?: Record<string, any>): string => {
    // Get the translation from the current language
    let translation = translations[currentLanguage]?.[key];
    
    // If translation is not found in current language and it's not English,
    // try to fall back to English
    if (!translation && currentLanguage !== 'en') {
      translation = translations['en']?.[key];
    }
    
    // If still no translation found, return the key
    if (!translation) {
      console.warn(`Translation not found for key: ${key}`);
      return key;
    }
    
    // Replace parameters if they exist
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(paramValue));
      });
    }
    
    return translation;
  };

  if (isLoading) {
    // You could show a loading indicator here if needed
    return null;
  }

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
} 