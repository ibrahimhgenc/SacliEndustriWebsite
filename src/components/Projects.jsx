import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { db } from '../firebase.config';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const Projects = () => {
    const { language } = useLanguage();
    const t = translations[language].projects;
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const q = query(collection(db, "projects"), orderBy("order", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    image: data.image,
                    ...(data[language] || {}) // Safely merge or use empty object
                };
            });
            setProjects(list);
        });
        return () => unsubscribe();
    }, [language]);



    return (
        <section id="projects" className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-safety-orange font-heading font-bold text-lg tracking-widest mb-2">
                        {translations[language].navbar.projects.toUpperCase()}
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-6 relative inline-block">
                        {t.title}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t.description}
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-brand-navy/20"></div>

                    <div className="space-y-12">
                        {(projects.length > 0 ? projects : t.items).map((project, index) => (
                            <div key={project.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Timeline Dot/Number */}
                                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-lg bg-safety-orange text-white font-bold z-10 shadow-lg border-4 border-white text-xl">
                                    {index + 1}
                                </div>

                                {/* Content Spacer for Desktop */}
                                <div className="hidden md:block w-1/2"></div>

                                {/* Content Card */}
                                <div className={`w-full md:w-[calc(50%-3rem)] pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                    <div
                                        onClick={() => setSelectedProject(project)}
                                        className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col lg:flex-row h-full cursor-pointer hover:scale-[1.02] group"
                                    >
                                        {/* Text Section */}
                                        <div className="bg-[#1B779C] p-6 text-white flex flex-col justify-center lg:w-1/2">
                                            <h3 className="text-lg font-bold mb-2 uppercase leading-tight">{project.title}</h3>
                                            <p className="text-white/90 text-sm mb-4 font-light">{project.description}</p>
                                            <div className="mt-auto pt-4 border-t border-white/20">
                                                <span className="text-sm font-semibold text-safety-orange">{project.location}</span>
                                            </div>
                                        </div>
                                        {/* Image Section */}
                                        <div className="lg:w-1/2 h-64 lg:h-80 relative overflow-hidden">
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                <div className="text-white text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <span className="block text-lg font-bold mb-2">{t.viewDetails}</span>
                                                    <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>


            {/* Project Detail Modal */}
            {
                selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                            onClick={() => setSelectedProject(null)}
                        ></div>

                        {/* Modal Content */}
                        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row animate-fade-in-up">
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 text-white md:text-gray-500 md:bg-gray-100 md:hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Modal Image */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                                <img
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden"></div>
                            </div>

                            {/* Modal Text */}
                            <div className="w-full md:w-1/2 p-8 flex flex-col">
                                <h3 className="text-2xl font-bold text-industrial-dark mb-2">{selectedProject.title}</h3>
                                <span className="text-safety-orange font-bold text-sm mb-6 block">{selectedProject.location}</span>

                                <div className="prose prose-sm max-w-none text-gray-600">
                                    {selectedProject.content ? (
                                        <p className="whitespace-pre-wrap leading-relaxed">
                                            {selectedProject.content}
                                        </p>
                                    ) : (
                                        <p>{selectedProject.description}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </section >
    );
};

export default Projects;
