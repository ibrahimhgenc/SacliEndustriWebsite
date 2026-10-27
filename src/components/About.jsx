import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { db } from '../firebase.config';
import { doc, onSnapshot } from 'firebase/firestore';

const About = () => {
    const { language } = useLanguage();
    const [dynamicData, setDynamicData] = useState(null);
    const t = dynamicData && dynamicData[language] ? { ...translations[language].about, ...(dynamicData[language] || {}) } : translations[language].about;
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "site_content", "about"), (docSnap) => {
            if (docSnap.exists()) {
                setDynamicData(docSnap.data());
            }
        });

        return () => unsubscribe();
    }, []);

    const handlePlayOverlayClick = (e) => {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Video Side */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-brand-navy/10 rounded-xl transform -rotate-2"></div>
                        <video
                            key={language}
                            ref={videoRef}
                            src={language === 'tr' ? '/tanitim_videoTR.mp4' : '/tanitim_videoEN.mp4'}
                            className="relative rounded-xl shadow-lg w-full object-cover h-[400px]"
                            controls
                            muted
                            loop
                            playsInline
                            preload="none"
                            poster="/poster1.jpg"
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                        >
                            Tarayıcınız video etiketini desteklemiyor.
                        </video>

                        {/* Custom Play Button Overlay */}
                        {!isPlaying && (
                            <div
                                onClick={handlePlayOverlayClick}
                                className="absolute inset-0 flex items-center justify-center z-10 bg-black/30 rounded-xl transition-all duration-300 group-hover:bg-black/40 cursor-pointer"
                            >
                                <div className="w-20 h-20 bg-safety-orange/90 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                                    <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Side */}
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-safety-orange font-heading font-bold text-lg tracking-widest mb-2">{translations[language].navbar.about.toUpperCase()}</h2>
                            <h3 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-6 relative inline-block">
                                {t.title}
                                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                            </h3>
                            <p className="text-gray-600 max-w-2xl mx-auto mb-12">
                                {t.description}
                            </p>
                        </div>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {t.description1}
                        </p>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            {t.description2}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-brand-navy">
                                <h3 className="font-bold text-xl text-industrial-dark mb-2">{t.missionTitle}</h3>
                                <p className="text-sm text-gray-600">{t.missionText}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-safety-orange">
                                <h3 className="font-bold text-xl text-industrial-dark mb-2">{t.visionTitle}</h3>
                                <p className="text-sm text-gray-600">{t.visionText}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
