import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
    const { language } = useLanguage();

    return (
        <section className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <h1 className="text-7xl md:text-9xl font-extrabold text-safety-orange mb-4">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-industrial-dark mb-4">
                {language === 'tr' ? 'Aradığınız Sayfa Bulunamadı' : 'Page Not Found'}
            </h2>
            <p className="text-gray-600 max-w-md mb-8">
                {language === 'tr'
                    ? 'Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.'
                    : 'The page you are looking for might have been moved, deleted, or never existed.'}
            </p>
            <Link
                to="/"
                className="px-8 py-3 bg-brand-navy text-white font-bold rounded-md hover:bg-safety-orange transition-colors shadow-lg"
            >
                {language === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
            </Link>
        </section>
    );
};

export default NotFound;
