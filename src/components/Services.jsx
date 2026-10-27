import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { db } from '../firebase.config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import { SERVICE_ICONS } from '../constants/serviceIcons';

const Services = () => {
    const { language } = useLanguage();
    const t = translations[language].services;
    const [selectedService, setSelectedService] = useState(null);
    const [servicesData, setServicesData] = useState([]);

    // Helper to render icon safely
    const getIcon = useCallback((iconName) => {
        const IconComponent = SERVICE_ICONS[iconName] || SERVICE_ICONS.Settings;
        return <IconComponent className="w-12 h-12 text-safety-orange mb-4 pointer-events-none" />;
    }, []);

    // Static fallback using dynamic import structure
    const staticServices = [
        { key: 'engineering', icon: getIcon('HardHat') },
        { key: 'manufacturing', icon: getIcon('Factory') },
        { key: 'assembly', icon: getIcon('Wrench') },
        { key: 'procurement', icon: getIcon('PackageSearch') },
        { key: 'projectManagement', icon: getIcon('ClipboardList') }
    ];

    useEffect(() => {
        const q = query(collection(db, "services"), orderBy("order", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    key: data.iconKey || 'Settings',
                    icon: getIcon(data.iconKey || 'Settings'),
                    title: data[language]?.title,
                    desc: data[language]?.desc,
                    details: data[language]?.details
                };
            });
            setServicesData(list);
        });
        return () => unsubscribe();
    }, [language, getIcon]);

    const displayServices = servicesData.length > 0 ? servicesData : staticServices;

    return (
        <section id="services" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-safety-orange font-heading font-bold text-lg tracking-widest mb-2">
                        {translations[language].navbar.services.toUpperCase()}
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-6 relative inline-block">
                        {t.title}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayServices.map((service) => (
                        <div
                            key={service.id || service.key}
                            onClick={() => setSelectedService(service)}
                            className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-b-4 border-transparent hover:border-safety-orange group cursor-pointer hover:scale-[1.02]"
                        >
                            <div className="flex flex-col items-center text-center h-full">
                                <div className="transform group-hover:scale-110 transition-transform duration-300">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-industrial-dark mb-3 group-hover:text-safety-orange transition-colors">
                                    {service.title || t[service.key]?.title}
                                </h3>
                                <p className="text-gray-600 mb-6 flex-grow">
                                    {service.desc || t[service.key]?.desc}
                                </p>
                                <div className="mt-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 text-safety-orange font-bold flex items-center justify-center">
                                    <span>{t.viewDetails}</span>
                                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Service Detail Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                        onClick={() => setSelectedService(null)}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedService(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-8 md:p-10">
                            <div className="flex flex-col items-center text-center mb-8">
                                <div className="p-4 bg-gray-50 rounded-full mb-6">
                                    {React.cloneElement(selectedService.icon, { className: "w-16 h-16 text-safety-orange" })}
                                </div>
                                <h3 className="text-3xl font-bold text-industrial-dark mb-2">
                                    {selectedService.title || t[selectedService.key]?.title}
                                </h3>
                                <div className="w-24 h-1 bg-safety-orange rounded-full"></div>
                            </div>

                            <div className="prose prose-lg max-w-none text-gray-600 space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_strong]:text-industrial-dark">
                                <ReactMarkdown>
                                    {selectedService.details || t[selectedService.key]?.details || t[selectedService.key]?.desc || ''}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Services;
