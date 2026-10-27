import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
    const { language } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const content = {
        tr: {
            title: "Gizlilik Politikası",
            date: `Son güncellenme: ${new Date().toLocaleDateString('tr-TR')}`,
            sections: [
                {
                    title: "1. Giriş",
                    text: "Saçlı Endüstriyel İmalat ve Montaj San. Tic. Ltd. Şti. (\"Şirket\") olarak, web sitemizi ziyaret eden kullanıcılarımızın kişisel verilerinin korunmasına büyük önem veriyoruz. Bu Gizlilik Politikası, 6698 sayılı Kişisel Verilerin Korunması Kanunu (\"KVKK\") uyarınca kişisel verilerinizin toplanması, işlenmesi, aktarılması ve saklanması konusundaki prensiplerimizi açıklamaktadır."
                },
                {
                    title: "2. Toplanan Kişisel Veriler",
                    text: "Web sitemizi ziyaret ettiğinizde veya bizimle iletişime geçtiğinizde aşağıdaki kişisel verileriniz toplanabilir:",
                    list: [
                        "Kimlik Bilgileri: Ad, soyad.",
                        "İletişim Bilgileri: E-posta adresi, telefon numarası.",
                        "İşlem Güvenliği Bilgileri: IP adresi, tarayıcı bilgileri, ziyaret kayıtları.",
                        "Talep ve Şikayet Bilgileri: İletişim formu aracılığıyla ilettiğiniz mesaj içeriği."
                    ]
                },
                {
                    title: "3. Kişisel Verilerin İşlenme Amaçları",
                    text: "Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:",
                    list: [
                        "Şirketimiz tarafından sunulan ürün ve hizmetlerden sizleri faydalandırmak.",
                        "İletişim faaliyetlerinin yürütülmesi.",
                        "Talep ve şikayetlerin takibi.",
                        "Bilgi güvenliği süreçlerinin yürütülmesi.",
                        "Yetkili kişi, kurum ve kuruluşlara bilgi verilmesi."
                    ]
                },
                {
                    title: "4. Çerez Politikası (Cookies)",
                    text: "Web sitemizin işlevselliğini artırmak ve size daha iyi bir deneyim sunmak için çerezler kullanabiliriz. Çerezler, tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır. Tarayıcı ayarlarınızdan çerezleri dilediğiniz zaman engelleyebilirsiniz."
                },
                {
                    title: "5. Haklarınız",
                    text: "KVKK'nın 11. maddesi uyarınca kişisel verilerinizin; işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme haklarına sahipsiniz."
                },
                {
                    title: "6. İletişim",
                    text: <>Gizlilik politikamızla ilgili her türlü soru ve talebiniz için <strong>info@sacliendustri.com</strong> adresinden bizimle iletişime geçebilirsiniz.</>
                }
            ]
        },
        en: {
            title: "Privacy Policy",
            date: `Last updated: ${new Date().toLocaleDateString('en-US')}`,
            sections: [
                {
                    title: "1. Introduction",
                    text: "As Saçlı Industrial Manufacturing and Assembly Ind. Trade Ltd. Co. (\"Company\"), we attach great importance to the protection of the personal data of our users visiting our website. This Privacy Policy explains our principles regarding the collection, processing, transfer, and storage of your personal data in accordance with the Law on Protection of Personal Data No. 6698 (\"KVKK\")."
                },
                {
                    title: "2. Collected Personal Data",
                    text: "When you visit our website or contact us, the following personal data may be collected:",
                    list: [
                        "Identity Information: Name, surname.",
                        "Contact Information: Email address, phone number.",
                        "Transaction Security Information: IP address, browser information, visit records.",
                        "Request and Complaint Information: Message content you submit via the contact form."
                    ]
                },
                {
                    title: "3. Purposes of Processing Personal Data",
                    text: "Your personal data is processed for the following purposes:",
                    list: [
                        "To benefit you from the products and services offered by our company.",
                        "To conduct communication activities.",
                        "To follow up on requests and complaints.",
                        "To conduct information security processes.",
                        "To provide information to authorized persons, institutions, and organizations."
                    ]
                },
                {
                    title: "4. Cookie Policy",
                    text: "We may use cookies to increase the functionality of our website and provide you with a better experience. Cookies are small text files saved to your device via your browser. You can block cookies at any time from your browser settings."
                },
                {
                    title: "5. Your Rights",
                    text: "In accordance with Article 11 of KVKK, you have the right to learn whether your personal data is processed, to request information if it has been processed, to learn the purpose of processing and whether it is used in accordance with its purpose, to know the third parties to whom it is transferred in the country or abroad, and to request correction if it is incomplete or incorrectly processed."
                },
                {
                    title: "6. Contact",
                    text: <>For any questions and requests regarding our privacy policy, you can contact us at <strong>info@sacliendustri.com</strong>.</>
                }
            ]
        }
    };

    const t = content[language];

    return (
        <section className="pt-32 pb-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-8">{t.title}</h1>

                <div className="prose prose-lg text-gray-600">
                    <p className="mb-4">
                        {t.date}
                    </p>

                    {t.sections.map((section, index) => (
                        <div key={index}>
                            <h3 className="text-xl font-bold text-industrial-dark mt-6 mb-3">{section.title}</h3>
                            <p>{section.text}</p>
                            {section.list && (
                                <ul className="list-disc pl-5 mb-4">
                                    {section.list.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
