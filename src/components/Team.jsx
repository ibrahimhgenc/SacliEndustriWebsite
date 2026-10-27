import React, { useState, useEffect } from 'react';
import { db } from '../firebase.config';
import { collection, query, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { Linkedin, User, Mail, Phone } from 'lucide-react';

const Team = () => {
    const { language } = useLanguage();
    const t = translations[language].team;
    const [members, setMembers] = useState([]);
    const [isVisible, setIsVisible] = useState(true); // Default to true, or wait for fetch
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Check visibility setting
                const settingsRef = doc(db, 'site_settings', 'team_section');
                const settingsSnap = await getDoc(settingsRef);

                if (settingsSnap.exists()) {
                    const data = settingsSnap.data();
                    if (data.isVisible === false) {
                        setIsVisible(false);
                        setLoading(false);
                        return;
                    }
                }

                // 2. Fetch members
                const q = query(collection(db, 'team_members'), orderBy('order', 'asc'));
                const querySnapshot = await getDocs(q);
                const memberList = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).filter(m => m.status !== 'passive'); // Filter out passive members

                setMembers(memberList);
            } catch (error) {
                console.error("Error fetching team data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return null;
    if (!isVisible) return null;

    if (members.length === 0) return null; // Don't show empty section

    return (
        <section id="team" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-safety-orange font-heading font-bold text-lg tracking-widest mb-2">
                        {translations[language].navbar.team.toUpperCase()}
                    </h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-6 relative inline-block">
                        {t.title}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-24 mt-36">
                    {members.map((member) => (
                        <div key={member.id} className="bg-[#1B779C] rounded-xl shadow-xl relative pt-20 pb-8 px-6 text-center group hover:-translate-y-2 transition-transform duration-300 w-full max-w-[260px] mx-auto h-[380px] flex flex-col">
                            {/* Avatar Image - Floating Top Center */}
                            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white z-10 transition-transform duration-300 group-hover:scale-110">
                                {member.image ? (
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                        <User size={40} />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="mt-8 flex flex-col flex-1 items-center w-full">
                                {/* Name - Fixed Height for alignment */}
                                <div className="h-16 flex items-end justify-center w-full mb-2">
                                    <h4 className="text-xl font-bold text-white leading-tight">{member.name}</h4>
                                </div>

                                {/* Title - Fixed Height for alignment */}
                                <div className="h-12 flex items-start justify-center w-full mb-4">
                                    <p className="text-safety-orange font-medium text-sm uppercase tracking-wider leading-snug">
                                        {language === 'tr' ? member.title?.tr : member.title?.en}
                                    </p>
                                </div>

                                {/* Social Icons - Pushed to bottom */}
                                <div className="mt-auto">
                                    <div className="flex justify-center space-x-3">
                                        {member.linkedin && (
                                            <a
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 rounded-full bg-industrial-dark flex items-center justify-center text-white hover:bg-safety-orange hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {member.email && (
                                            <a
                                                href={`mailto:${member.email}`}
                                                className="w-10 h-10 rounded-full bg-industrial-dark flex items-center justify-center text-white hover:bg-safety-orange hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <Mail size={18} />
                                            </a>
                                        )}
                                        {member.phone && (
                                            <a
                                                href={`tel:${member.phone}`}
                                                className="w-10 h-10 rounded-full bg-industrial-dark flex items-center justify-center text-white hover:bg-safety-orange hover:text-white transition-all duration-300 shadow-sm"
                                            >
                                                <Phone size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
