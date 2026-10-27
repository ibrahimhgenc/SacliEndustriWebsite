import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';

const Hero = ({ setShowCatalog }) => {
    const { language } = useLanguage();
    const t = translations[language].hero;
    const tCatalog = translations[language].catalog;

    const handleCatalogClick = (e) => {
        if (window.innerWidth < 768) {
            e.preventDefault();
            const catalogUrl = language === 'tr' ? "/KatalogTR.pdf" : "/KatalogEN.pdf";
            window.open(catalogUrl, '_blank');
        } else {
            setShowCatalog(true);
        }
    };

    return (
        <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/poster3.jpg"
                    alt="Industrial Factory"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-brand-teal/10 to-brand-teal/90 mix-blend-multiply"></div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up">
                    {t.titlePart1} <span className="text-safety-orange">{t.titlePart2}</span>
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200 mb-10 animate-fade-in-up delay-100">
                    {t.subtitle}
                </p>
                <div className="flex justify-center gap-4 animate-fade-in-up delay-200">
                    <a
                        href="#catalog"
                        onClick={handleCatalogClick}
                        className="inline-flex items-center px-8 py-3 bg-safety-orange text-white font-bold rounded-md hover:bg-orange-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {tCatalog.viewCatalog}
                    </a>
                    <a href="#contact" className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-md hover:bg-white hover:text-brand-navy transition-colors">
                        {t.contact}
                    </a>
                </div>
            </div>
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
            </div>
        </section>
    );
};

export default Hero;
