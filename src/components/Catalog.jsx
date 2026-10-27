import React, { Suspense, lazy } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';

const FlipBookViewer = lazy(() => import('./FlipBookViewer'));

const Catalog = ({ showCatalog, setShowCatalog }) => {
    const { language } = useLanguage();
    const t = translations[language].catalog;
    const catalogUrl = language === 'tr' ? "/KatalogTR.pdf" : "/KatalogEN.pdf";

    return (
        <section id="catalog" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-safety-orange font-heading font-bold text-lg tracking-widest mb-2">{translations[language].navbar.catalog.toUpperCase()}</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-6 relative inline-block">
                        {t.title}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        {t.description}
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={() => {
                                if (window.innerWidth < 768) {
                                    window.open(catalogUrl, '_blank');
                                } else {
                                    setShowCatalog(!showCatalog);
                                }
                            }}
                            className="inline-flex items-center px-6 py-3 border border-safety-orange text-base font-medium rounded-md shadow-sm text-safety-orange bg-transparent hover:bg-safety-orange hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-safety-orange transition-all duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {showCatalog ? t.hideCatalog : t.viewCatalog}
                        </button>

                        <a
                            href={catalogUrl}
                            download={language === 'tr' ? "Sacli_Endustri_Katalog_TR.pdf" : "Sacli_Endustri_Katalog_EN.pdf"}
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-safety-orange hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-safety-orange transition-colors duration-300"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            {t.download}
                        </a>
                    </div>
                </div>

                {showCatalog && (
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden min-h-[600px] animate-fade-in-up flex items-center justify-center p-4">
                        <div className="w-full h-full max-w-5xl">
                            <Suspense
                                fallback={
                                    <div className="flex items-center justify-center h-96 w-full">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safety-orange"></div>
                                    </div>
                                }
                            >
                                <FlipBookViewer pdfUrl={catalogUrl} />
                            </Suspense>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Catalog;
