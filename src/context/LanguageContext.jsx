/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        const saved = localStorage.getItem('sacli_lang');
        return saved === 'en' || saved === 'tr' ? saved : 'tr';
    });

    useEffect(() => {
        localStorage.setItem('sacli_lang', language);
        document.documentElement.lang = language;
    }, [language]);

    const toggleLanguage = (lang) => {
        setLanguage(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
