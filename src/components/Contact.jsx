import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../constants/translations';
import { db } from '../firebase.config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Toaster, toast } from 'react-hot-toast';

const Contact = () => {
    const { language } = useLanguage();
    const t = translations[language].contact;
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await addDoc(collection(db, 'contact_messages'), {
                name: formData.name.trim(),
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                message: formData.message.trim(),
                read: false,
                createdAt: serverTimestamp()
            });

            toast.success(
                language === 'tr'
                    ? 'Mesajınız başarıyla iletildi! En kısa sürede dönüş yapacağız.'
                    : 'Your message has been sent successfully! We will get back to you soon.'
            );

            setFormData({
                name: '',
                phone: '',
                email: '',
                message: ''
            });
        } catch (error) {
            console.error('Error saving contact message:', error);
            // Properly encoded mailto fallback
            const subject = `İletişim Formu: ${formData.name}`;
            const body = `Ad Soyad: ${formData.name}\r\nTelefon: ${formData.phone}\r\nE-posta: ${formData.email}\r\n\r\nMesaj:\r\n${formData.message}`;
            window.location.href = `mailto:info@sacliendustri.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-20 bg-gray-50 relative overflow-hidden">
            <Toaster position="bottom-right" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="text-center mb-16">
                    <h2 className="text-safety-orange font-heading font-bold text-lg tracking-widest mb-2">{translations[language].navbar.contact.toUpperCase()}</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-6 relative inline-block">
                        {t.title}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                    </h3>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        {t.description}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Side: Contact Form */}
                    <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-safety-orange">
                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-industrial-dark mb-2">{t.formTitle}</h3>
                            <p className="text-gray-600 text-sm">{t.formDescription}</p>
                        </div>
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t.name}</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-safety-orange focus:ring-1 focus:ring-safety-orange outline-none transition-colors bg-gray-50"
                                        placeholder={t.name}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t.phone}</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-safety-orange focus:ring-1 focus:ring-safety-orange outline-none transition-colors bg-gray-50"
                                        placeholder="+90 555 555 55 55"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">{t.email}</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-safety-orange focus:ring-1 focus:ring-safety-orange outline-none transition-colors bg-gray-50"
                                    placeholder={t.email}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">{t.message}</label>
                                <textarea
                                    id="message"
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-md border border-gray-300 focus:border-safety-orange focus:ring-1 focus:ring-safety-orange outline-none transition-colors bg-gray-50 resize-none"
                                    placeholder={t.message}
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-safety-orange text-white font-bold py-4 rounded-md hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center mt-4 disabled:opacity-50"
                            >
                                <span>{submitting ? (language === 'tr' ? 'Gönderiliyor...' : 'Sending...') : t.send}</span>
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Info & Map */}
                    <div className="space-y-8">
                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Address - Left Side */}
                            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-navy flex items-start space-x-4 h-full">
                                <div className="bg-brand-navy/10 p-3 rounded-full shrink-0">
                                    <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <div>
                                    <h5 className="font-bold text-industrial-dark mb-1">{t.addressTitle}</h5>
                                    <p className="text-sm text-gray-600">{t.address}</p>
                                </div>
                            </div>

                            {/* Phone & Email - Right Side */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-navy flex items-start space-x-4">
                                    <div className="bg-brand-navy/10 p-3 rounded-full shrink-0">
                                        <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-industrial-dark mb-1">{t.phoneTitle}</h5>
                                        <a href="tel:+903225031212" className="text-sm text-gray-600 hover:text-safety-orange transition-colors">+90 322 503 12 12 </a>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-navy flex items-start space-x-4">
                                    <div className="bg-brand-navy/10 p-3 rounded-full shrink-0">
                                        <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-industrial-dark mb-1">{t.emailTitle}</h5>
                                        <a href="mailto:info@sacliendustri.com" className="text-sm text-gray-600 hover:text-safety-orange transition-colors">info@sacliendustri.com</a>
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-brand-navy flex items-center space-x-4">
                                    <div className="bg-brand-navy/10 p-3 rounded-full shrink-0">
                                        <svg className="w-6 h-6 text-brand-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                                    </div>
                                    <div className="flex space-x-4">
                                        <a href="https://www.linkedin.com/company/sacli-endustri" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-safety-orange transition-colors">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                        <a href="https://www.instagram.com/sacliendustri" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-safety-orange transition-colors">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.468 4.08c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map */}
                        <div className="bg-white p-2 rounded-lg shadow-lg h-80 w-full overflow-hidden">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.5384911088404!2d35.25435497652222!3d36.99597757219212!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1528872b3d63971b%3A0x2772c54f6a4b88b0!2sSa%C3%A7l%C4%B1%20End%C3%BCstriyel%20%C4%B0malat%20ve%20Montaj%20Sanayi%20ve%20Ticaret%20Ltd.%20%C5%9Eti!5e1!3m2!1str!2str!4v1766943321152!5m2!1str!2str"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Saçlı Endüstri Konum"
                                className="rounded-md"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
