import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';

const CERTIFICATES_LIST = [
    {
        id: 'iso9001',
        file: '/ISO_9001.pdf',
        image: '/ISO_9001.png'
    },
    {
        id: 'iso14001',
        file: '/ISO_14001.pdf',
        image: '/ISO_14001.png'
    },
    {
        id: 'iso45001',
        file: '/ISO_45001.pdf',
        image: '/ISO_45001.png'
    },
    {
        id: 'iso3834',
        file: '/ISO_3834.pdf',
        image: '/ISO_3834.png'
    },
    {
        id: 'marka',
        file: '/MARKA_TESCIL_BELGESI.pdf',
        image: '/MARKA_TESCIL_BELGESI.png'
    }
];

const Certificates = () => {
    const { language } = useLanguage();
    const t = translations[language].certificates;
    const [selectedCertIndex, setSelectedCertIndex] = useState(null);

    const openModal = useCallback((index) => {
        setSelectedCertIndex(index);
    }, []);

    const closeModal = useCallback(() => {
        setSelectedCertIndex(null);
    }, []);

    const nextCert = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedCertIndex((prev) => (prev + 1) % CERTIFICATES_LIST.length);
    }, []);

    const prevCert = useCallback((e) => {
        if (e) e.stopPropagation();
        setSelectedCertIndex((prev) => (prev - 1 + CERTIFICATES_LIST.length) % CERTIFICATES_LIST.length);
    }, []);

    // Body scroll lock & Keyboard navigation
    useEffect(() => {
        if (selectedCertIndex === null) {
            document.body.style.overflow = 'unset';
            return;
        }

        document.body.style.overflow = 'hidden';

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') nextCert();
            if (e.key === 'ArrowLeft') prevCert();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedCertIndex, closeModal, nextCert, prevCert]);

    return (
        <section id="certificates" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-safety-orange font-heading font-bold text-lg tracking-widest mb-2">{translations[language].navbar.certificates.toUpperCase()}</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-6 relative inline-block">
                        {t.title}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t.description}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8">
                    {CERTIFICATES_LIST.map((cert, index) => (
                        <div
                            key={cert.id}
                            onClick={() => openModal(index)}
                            className="group flex flex-col items-center w-64 cursor-pointer"
                        >
                            {/* Certificate Frame */}
                            <div className="relative w-full p-4 bg-brand-navy/90 shadow-xl rounded-sm transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl">
                                {/* Decorative Corner Frames */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-safety-orange/50 -mt-1 -ml-1 transition-all group-hover:border-safety-orange group-hover:w-full group-hover:h-full group-hover:rounded-sm"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-safety-orange/50 -mt-1 -mr-1 transition-all group-hover:border-safety-orange"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-safety-orange/50 -mb-1 -ml-1 transition-all group-hover:border-safety-orange"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-safety-orange/50 -mb-1 -mr-1 transition-all group-hover:border-safety-orange"></div>

                                {/* Inner Content */}
                                <div className="relative aspect-[1/1.41] w-full border border-gray-100 overflow-hidden bg-white">
                                    <img
                                        src={cert.image}
                                        alt={t.items[cert.id]}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white p-3 rounded-full shadow-lg">
                                            <svg className="w-6 h-6 text-safety-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="mt-4 text-sm font-semibold text-gray-800 text-center max-w-[90%] group-hover:text-safety-orange transition-colors duration-300">
                                {t.items[cert.id]}
                            </h3>
                        </div>
                    ))}
                </div>

                {/* Modal */}
                {selectedCertIndex !== null && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 transition-all duration-300 backdrop-blur-sm animate-fade-in" onClick={closeModal}>
                        <div className="relative w-full max-w-5xl h-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-all z-50 pointer-events-auto"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Navigation Buttons */}
                            <button
                                onClick={prevCert}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 rounded-full p-3 transition-all hidden md:block z-50"
                            >
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <button
                                onClick={nextCert}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white hover:bg-white/10 rounded-full p-3 transition-all hidden md:block z-50"
                            >
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Main Image Container */}
                            <div className="relative w-full h-full flex items-center justify-center p-2 pb-20">
                                <img
                                    src={CERTIFICATES_LIST[selectedCertIndex].image}
                                    alt={t.items[CERTIFICATES_LIST[selectedCertIndex].id]}
                                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-scale-in"
                                />
                            </div>

                            {/* Mobile Navigation (Bottom) */}
                            <div className="flex justify-between w-full px-4 py-4 md:hidden absolute bottom-12">
                                <button onClick={prevCert} className="text-white bg-white/10 p-3 rounded-full backdrop-blur-md">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button onClick={nextCert} className="text-white bg-white/10 p-3 rounded-full backdrop-blur-md">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Caption & PDF Download Link */}
                            <div className="absolute bottom-4 left-0 right-0 flex flex-col sm:flex-row items-center justify-center gap-3 z-50">
                                <h3 className="text-white/90 text-sm md:text-lg font-bold tracking-wide bg-black/60 px-5 py-2 rounded-full backdrop-blur-md">
                                    {t.items[CERTIFICATES_LIST[selectedCertIndex].id]}
                                </h3>
                                <a
                                    href={CERTIFICATES_LIST[selectedCertIndex].file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-safety-orange hover:bg-orange-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    PDF
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Certificates;
