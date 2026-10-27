import React, { useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const TermsOfUse = () => {
    const { language } = useLanguage();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const content = {
        tr: {
            title: "Kullanım Şartları",
            date: `Son güncellenme: ${new Date().toLocaleDateString('tr-TR')}`,
            sections: [
                {
                    title: "1. Kabul",
                    text: "Bu web sitesini (sacliendustri.com) ziyaret ederek veya kullanarak, aşağıda belirtilen kullanım şartlarını kabul etmiş sayılırsınız. Eğer bu şartları kabul etmiyorsanız, lütfen siteyi kullanmayınız."
                },
                {
                    title: "2. Fikri Mülkiyet Hakları",
                    text: "Bu web sitesinde yer alan tüm içerik (metinler, görseller, logolar, grafikler, videolar vb.) Saçlı Endüstriyel İmalat ve Montaj San. Tic. Ltd. Şti.'ye aittir ve telif hakkı yasaları ile korunmaktadır. İzinsiz kopyalanması, çoğaltılması veya ticari amaçla kullanılması yasaktır."
                },
                {
                    title: "3. Kullanım Sınırlamaları",
                    text: "Web sitesini aşağıdaki amaçlarla kullanamazsınız:",
                    list: [
                        "Herhangi bir yasa dışı faaliyet için.",
                        "Sitenin güvenliğini ihlal etmek veya diğer kullanıcılara zarar vermek için.",
                        "Site içeriğini izinsiz değiştirmek veya silmek için."
                    ]
                },
                {
                    title: "4. Sorumluluk Reddi",
                    text: "Şirketimiz, web sitesindeki bilgilerin doğruluğu ve güncelliği konusunda azami özeni göstermekle birlikte, olası hatalardan veya eksikliklerden sorumlu tutulamaz. Web sitemizde yer alan dış bağlantıların (linklerin) içeriğinden sorumlu değiliz."
                },
                {
                    title: "5. Değişiklikler",
                    text: "Şirketimiz, işbu kullanım şartlarını dilediği zaman önceden bildirimde bulunmaksızın değiştirme hakkını saklı tutar. Değişiklikler sitede yayınlandığı tarihte yürürlüğe girer."
                },
                {
                    title: "6. Uygulanacak Hukuk",
                    text: "Bu kullanım şartlarından doğacak uyuşmazlıklarda Türk Hukuku uygulanır ve Adana Mahkemeleri ve İcra Daireleri yetkilidir."
                }
            ]
        },
        en: {
            title: "Terms of Use",
            date: `Last updated: ${new Date().toLocaleDateString('en-US')}`,
            sections: [
                {
                    title: "1. Acceptance",
                    text: "By visiting or using this website (sacliendustri.com), you are deemed to have accepted the terms of use set forth below. If you do not accept these terms, please do not use the site."
                },
                {
                    title: "2. Intellectual Property Rights",
                    text: "All content (texts, images, logos, graphics, videos, etc.) on this website belongs to Saçlı Industrial Manufacturing and Assembly Ind. Trade Ltd. Co. and is protected by copyright laws. Unauthorized copying, reproduction, or use for commercial purposes is prohibited."
                },
                {
                    title: "3. Usage Limitations",
                    text: "You may not use the website for the following purposes:",
                    list: [
                        "For any illegal activity.",
                        "To violate the security of the site or harm other users.",
                        "To modify or delete site content without permission."
                    ]
                },
                {
                    title: "4. Disclaimer",
                    text: "Although our company takes maximum care regarding the accuracy and currency of the information on the website, it cannot be held responsible for possible errors or omissions. We are not responsible for the content of external links on our website."
                },
                {
                    title: "5. Changes",
                    text: "Our company reserves the right to change these terms of use at any time without prior notice. Changes come into force on the date they are published on the site."
                },
                {
                    title: "6. Applicable Law",
                    text: "Turkish Law applies to disputes arising from these terms of use, and Adana Courts and Enforcement Offices are authorized."
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

export default TermsOfUse;
