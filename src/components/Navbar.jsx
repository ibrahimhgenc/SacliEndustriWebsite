import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const t = translations[language].navbar;

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (e, href) => {
    e.preventDefault();

    // If simply navigating to home top
    if (href === '#home') {
      if (location.pathname !== '/') {
        navigate('/');
        window.scrollTo(0, 0);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setIsMobileMenuOpen(false);
      return;
    }

    // If navigating to a section
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation then scroll
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { name: t.home, href: '#home' },
    { name: t.about, href: '#about' },
    { name: t.catalog, href: '#catalog' },
    { name: t.certificates, href: '#certificates' },
    { name: t.services, href: '#services' },
    { name: t.projects, href: '#projects' },
    { name: t.team, href: '#team' },
    { name: 'Blog', href: '#blog' },
    { name: t.contact, href: '#contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled || location.pathname !== '/' ? 'bg-white shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" onClick={(e) => handleNavigation(e, '#home')} className="flex items-center gap-2">
              <img src="/logo.png" alt="Saçlı Endüstri" className="h-20 w-auto" />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden xl:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className={`text-sm font-medium transition-colors duration-300 hover:text-safety-orange ${isScrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-gray-200'}`}
              >
                {link.name}
              </a>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 border-l pl-4 border-gray-300">
              <button
                onClick={() => toggleLanguage('tr')}
                className={`text-sm font-bold transition-colors ${language === 'tr' ? 'text-safety-orange' : (isScrolled || location.pathname !== '/' ? 'text-gray-500 hover:text-gray-900' : 'text-gray-300 hover:text-white')}`}
              >
                TR
              </button>
              <span className={isScrolled || location.pathname !== '/' ? 'text-gray-300' : 'text-gray-500'}>|</span>
              <button
                onClick={() => toggleLanguage('en')}
                className={`text-sm font-bold transition-colors ${language === 'en' ? 'text-safety-orange' : (isScrolled || location.pathname !== '/' ? 'text-gray-500 hover:text-gray-900' : 'text-gray-300 hover:text-white')}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md focus:outline-none ${isScrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'}`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white shadow-xl absolute w-full left-0 top-full border-t border-gray-100">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavigation(e, link.href)}
                className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-safety-orange hover:bg-gray-50 transition-colors"
              >
                {link.name}
              </a>
            ))}
            {/* Mobile Language Switcher */}
            <div className="flex items-center space-x-4 px-3 py-3 mt-2 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-500">Dil / Language:</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => { toggleLanguage('tr'); setIsMobileMenuOpen(false); }}
                  className={`px-2 py-1 rounded text-sm font-bold ${language === 'tr' ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  TR
                </button>
                <button
                  onClick={() => { toggleLanguage('en'); setIsMobileMenuOpen(false); }}
                  className={`px-2 py-1 rounded text-sm font-bold ${language === 'en' ? 'bg-brand-navy text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
