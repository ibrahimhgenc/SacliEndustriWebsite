import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
    const { language } = useLanguage();
    const t = translations[language];
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (e, href) => {
        e.preventDefault();
        if (href === '#home') {
            if (location.pathname !== '/') {
                navigate('/');
                window.scrollTo(0, 0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return;
        }

        if (location.pathname !== '/') {
            navigate('/');
            setTimeout(() => {
                const element = document.querySelector(href);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            const element = document.querySelector(href);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <footer className="bg-brand-navy text-white pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <img src="/logo.png" alt="Saçlı Endüstri" className="h-20 w-auto brightness-0 invert" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {t.hero.subtitle}
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.linkedin.com/company/sacli-endustri" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-safety-orange transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a href="https://www.instagram.com/sacliendustri" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-safety-orange transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 4.08c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 relative inline-block">
                            {t.footer.quickLinks}
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                        </h4>
                        <div className="grid grid-cols-2 gap-x-4">
                            <ul className="space-y-3">
                                <li><a href="#home" onClick={(e) => handleNavigation(e, '#home')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">{t.navbar.home}</a></li>
                                <li><a href="#about" onClick={(e) => handleNavigation(e, '#about')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">{t.navbar.about}</a></li>
                                <li><a href="#catalog" onClick={(e) => handleNavigation(e, '#catalog')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">{t.navbar.catalog}</a></li>
                                <li><a href="#certificates" onClick={(e) => handleNavigation(e, '#certificates')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">{t.navbar.certificates}</a></li>
                                <li><a href="#services" onClick={(e) => handleNavigation(e, '#services')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">{t.navbar.services}</a></li>
                            </ul>
                            <ul className="space-y-3">
                                <li><a href="#projects" onClick={(e) => handleNavigation(e, '#projects')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">{t.navbar.projects}</a></li>
                                <li><a href="#team" onClick={(e) => handleNavigation(e, '#team')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">{t.navbar.team}</a></li>
                                <li><a href="#blog" onClick={(e) => handleNavigation(e, '#blog')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">Blog</a></li>
                                <li><a href="#contact" onClick={(e) => handleNavigation(e, '#contact')} className="text-gray-400 hover:text-safety-orange transition-colors text-sm">{t.navbar.contact}</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-bold mb-6 relative inline-block">
                            {t.footer.contactInfo}
                            <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-safety-orange mt-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span className="text-gray-400 text-sm">{t.contact.address}</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-safety-orange shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                <a href="tel:+903225031212" className="text-gray-400 hover:text-safety-orange transition-colors text-sm">+90 322 503 12 12</a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-safety-orange shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <a href="mailto:info@sacliendustri.com" className="text-gray-400 hover:text-safety-orange transition-colors text-sm">info@sacliendustri.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} Saçlı Endüstri. {t.footer.rights}
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="/gizlilik-politikasi" className="text-gray-500 hover:text-white text-sm transition-colors">{t.footer.privacyPolicy}</Link>
                        <Link to="/kullanim-sartlari" className="text-gray-500 hover:text-white text-sm transition-colors">{t.footer.termsOfUse}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
