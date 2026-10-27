import React, { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { SERVICE_ICONS, SERVICE_ICON_KEYS } from '../../constants/serviceIcons';

const ServicesEditor = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentService, setCurrentService] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        order: 0,
        iconKey: 'HardHat',
        tr: { title: '', desc: '', details: '' },
        en: { title: '', desc: '', details: '' }
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "services"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            const list = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
            setServices(list);
        } catch (error) {
            console.error("Error fetching services:", error);
            toast.error("Hizmetler yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (service) => {
        setCurrentService(service);
        setFormData({
            order: service.order || 0,
            iconKey: service.iconKey || 'Settings',
            tr: service.tr || { title: '', desc: '', details: '' },
            en: service.en || { title: '', desc: '', details: '' }
        });
        setEditMode(true);
    };

    const handleAddNew = () => {
        setCurrentService(null);
        setFormData({
            order: services.length + 1,
            iconKey: 'Settings',
            tr: { title: '', desc: '', details: '' },
            en: { title: '', desc: '', details: '' }
        });
        setEditMode(true);
    };

    const handleCancel = () => {
        setEditMode(false);
        setCurrentService(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
        try {
            await deleteDoc(doc(db, "services", id));
            toast.success("Hizmet silindi.");
            fetchServices();
        } catch (error) {
            console.error("Error deleting service:", error);
            toast.error("Silme hatası: " + error.message);
        }
    };

    const handleFormChange = (lang, field, value) => {
        if (lang === 'root') {
            setFormData(prev => ({ ...prev, [field]: value }));
        } else {
            setFormData(prev => ({
                ...prev,
                [lang]: {
                    ...prev[lang],
                    [field]: value
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const serviceData = {
                ...formData,
                updatedAt: serverTimestamp()
            };

            if (currentService) {
                await updateDoc(doc(db, "services", currentService.id), serviceData);
                toast.success("Hizmet güncellendi!");
            } else {
                await addDoc(collection(db, "services"), {
                    ...serviceData,
                    createdAt: serverTimestamp()
                });
                toast.success("Yeni hizmet eklendi!");
            }

            setEditMode(false);
            fetchServices();
        } catch (error) {
            console.error("Error saving service:", error);
            toast.error("Kaydetme hatası: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const renderIconPreview = (iconName, sizeClass = "w-8 h-8") => {
        const IconComponent = SERVICE_ICONS[iconName] || SERVICE_ICONS.Settings;
        return <IconComponent className={`${sizeClass} text-safety-orange`} />;
    };

    if (editMode) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">{currentService ? 'Hizmeti Düzenle' : 'Yeni Hizmet Ekle'}</h2>
                    <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">
                        İptal
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* General Info */}
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase mb-4">Genel Bilgiler</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    İkon Seçimi
                                </label>
                                <div className="grid grid-cols-7 gap-2 p-2 bg-white border rounded-lg max-h-40 overflow-y-auto">
                                    {SERVICE_ICON_KEYS.map((key) => {
                                        const IconComp = SERVICE_ICONS[key];
                                        const isSelected = formData.iconKey === key;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => handleFormChange('root', 'iconKey', key)}
                                                title={key}
                                                className={`p-2 rounded-md flex items-center justify-center border transition-all ${
                                                    isSelected
                                                        ? 'border-safety-orange bg-orange-50 text-safety-orange scale-105'
                                                        : 'border-transparent hover:bg-gray-100 text-gray-600'
                                                }`}
                                            >
                                                <IconComp className="w-6 h-6" />
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Seçili İkon: <strong>{formData.iconKey}</strong></p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sıra No (Order)</label>
                                <input type="number" value={formData.order} onChange={(e) => handleFormChange('root', 'order', parseInt(e.target.value, 10) || 0)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* Turkish Content */}
                    <div className="p-4 bg-red-50/50 rounded-lg border border-red-100">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">🇹🇷</span>
                            <h3 className="text-sm font-semibold text-gray-700 uppercase">Türkçe İçerik</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hizmet Başlığı</label>
                                <input type="text" value={formData.tr.title} onChange={(e) => handleFormChange('tr', 'title', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
                                <textarea rows={2} value={formData.tr.desc} onChange={(e) => handleFormChange('tr', 'desc', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detaylı İçerik (Popup - Markdown destekler)</label>
                                <textarea rows={6} value={formData.tr.details} onChange={(e) => handleFormChange('tr', 'details', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    {/* English Content */}
                    <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-xl">🇬🇧</span>
                            <h3 className="text-sm font-semibold text-gray-700 uppercase">İngilizce İçerik</h3>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Service Title</label>
                                <input type="text" value={formData.en.title} onChange={(e) => handleFormChange('en', 'title', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                <textarea rows={2} value={formData.en.desc} onChange={(e) => handleFormChange('en', 'desc', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Content (Popup - Markdown supported)</label>
                                <textarea rows={6} value={formData.en.details} onChange={(e) => handleFormChange('en', 'details', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={handleCancel} className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                            İptal
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 bg-brand-navy text-white rounded-lg hover:bg-blue-900 transition disabled:opacity-50">
                            {loading ? 'Kaydediliyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Hizmetler Listesi</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-brand-navy text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Yeni Hizmet Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-lg text-gray-800">{service.tr?.title || 'Başlıksız'}</h3>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-gray-500">
                                <span>İkon: <span className="font-mono text-xs bg-gray-100 px-1 py-0.5 rounded">{service.iconKey}</span></span>
                                {renderIconPreview(service.iconKey, "w-5 h-5")}
                            </div>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">Sıra: {service.order}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(service)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Düzenle"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button
                                onClick={() => handleDelete(service.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {services.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">Henüz hiç hizmet eklenmemiş.</div>
            )}
        </div>
    );
};

export default ServicesEditor;
