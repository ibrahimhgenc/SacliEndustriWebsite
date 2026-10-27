import React, { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { translations } from '../../constants/translations';

const AboutEditor = () => {
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState('tr'); // 'tr' | 'en'
    const [formData, setFormData] = useState({
        tr: {
            title: '',
            description1: '',
            description2: '',
            missionTitle: '',
            missionText: '',
            visionTitle: '',
            visionText: ''
        },
        en: {
            title: '',
            description1: '',
            description2: '',
            missionTitle: '',
            missionText: '',
            visionTitle: '',
            visionText: ''
        }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "site_content", "about");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setFormData(docSnap.data());
            } else {
                // Fallback to static translations if not in DB yet
                setFormData({
                    tr: translations.tr.about,
                    en: translations.en.about
                });
            }
        } catch (error) {
            console.error("Error fetching about data:", error);
            toast.error("Veri yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [language]: {
                ...prev[language],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, "site_content", "about"), formData);
            toast.success("Hakkımızda içeriği güncellendi!");
        } catch (error) {
            console.error("Error updating about data:", error);
            toast.error("Güncelleme hatası: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const currentData = formData[language];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Hakkımızda Düzenle</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setLanguage('tr')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${language === 'tr' ? 'bg-white shadow text-brand-navy' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Türkçe
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${language === 'en' ? 'bg-white shadow text-brand-navy' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        English
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                        <input
                            type="text"
                            value={currentData.title || ''}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama 1 (Ana Metin)</label>
                        <textarea
                            rows={4}
                            value={currentData.description1 || ''}
                            onChange={(e) => handleChange('description1', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama 2 (Alt Metin)</label>
                        <textarea
                            rows={4}
                            value={currentData.description2 || ''}
                            onChange={(e) => handleChange('description2', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Misyon Başlığı</label>
                        <input
                            type="text"
                            value={currentData.missionTitle || ''}
                            onChange={(e) => handleChange('missionTitle', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Misyon Metni</label>
                        <textarea
                            rows={3}
                            value={currentData.missionText || ''}
                            onChange={(e) => handleChange('missionText', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vizyon Başlığı</label>
                        <input
                            type="text"
                            value={currentData.visionTitle || ''}
                            onChange={(e) => handleChange('visionTitle', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vizyon Metni</label>
                        <textarea
                            rows={3}
                            value={currentData.visionText || ''}
                            onChange={(e) => handleChange('visionText', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-navy text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 font-medium"
                    >
                        {loading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AboutEditor;
