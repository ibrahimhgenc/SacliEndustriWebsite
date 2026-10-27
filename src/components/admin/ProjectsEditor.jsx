import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase.config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-hot-toast';

const getUploadPath = (folder, fileName) => `${folder}/${new Date().getTime()}_${fileName}`;

const ProjectsEditor = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        order: 0,
        tr: { title: '', description: '', location: '', content: '' },
        en: { title: '', description: '', location: '', content: '' }
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "projects"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            const list = querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
            setProjects(list);
        } catch (error) {
            console.error("Error fetching projects:", error);
            toast.error("Projeler yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project) => {
        setCurrentProject(project);
        setFormData({
            order: project.order || 0,
            tr: project.tr || { title: '', description: '', location: '', content: '' },
            en: project.en || { title: '', description: '', location: '', content: '' }
        });
        setEditMode(true);
        setImageFile(null);
    };

    const handleAddNew = () => {
        setCurrentProject(null);
        setFormData({
            order: projects.length + 1,
            tr: { title: '', description: '', location: '', content: '' },
            en: { title: '', description: '', location: '', content: '' }
        });
        setEditMode(true);
        setImageFile(null);
    };

    const handleCancel = () => {
        setEditMode(false);
        setCurrentProject(null);
        setImageFile(null);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
        try {
            await deleteDoc(doc(db, "projects", id));
            toast.success("Proje silindi.");
            fetchProjects();
        } catch (error) {
            console.error("Error deleting project:", error);
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

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = currentProject?.image || '';

            if (imageFile) {
                const storageRef = ref(storage, getUploadPath('projects', imageFile.name));
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            const projectData = {
                ...formData,
                image: imageUrl,
                updatedAt: serverTimestamp()
            };

            if (currentProject) {
                await updateDoc(doc(db, "projects", currentProject.id), projectData);
                toast.success("Proje güncellendi!");
            } else {
                await addDoc(collection(db, "projects"), {
                    ...projectData,
                    createdAt: serverTimestamp()
                });
                toast.success("Yeni proje eklendi!");
            }

            setEditMode(false);
            fetchProjects();
        } catch (error) {
            console.error("Error saving project:", error);
            toast.error("Kaydetme hatası: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (editMode) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">{currentProject ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}</h2>
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Görsel</label>
                                <input type="file" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-navy file:text-white hover:file:bg-blue-900" accept="image/*" />
                                {currentProject && currentProject.image && !imageFile && (
                                    <img src={currentProject.image} alt="Preview" className="h-20 w-auto mt-2 rounded border" />
                                )}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Proje Başlığı</label>
                                <input type="text" value={formData.tr.title} onChange={(e) => handleFormChange('tr', 'title', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Kısa Açıklama</label>
                                    <input type="text" value={formData.tr.description} onChange={(e) => handleFormChange('tr', 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Konum/Tarih</label>
                                    <input type="text" value={formData.tr.location} onChange={(e) => handleFormChange('tr', 'location', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detaylı İçerik (Popup)</label>
                                <textarea rows={4} value={formData.tr.content} onChange={(e) => handleFormChange('tr', 'content', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                                <input type="text" value={formData.en.title} onChange={(e) => handleFormChange('en', 'title', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                    <input type="text" value={formData.en.description} onChange={(e) => handleFormChange('en', 'description', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location/Date</label>
                                    <input type="text" value={formData.en.location} onChange={(e) => handleFormChange('en', 'location', e.target.value)} className="w-full px-4 py-2 border rounded-lg" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Detailed Content (Popup)</label>
                                <textarea rows={4} value={formData.en.content} onChange={(e) => handleFormChange('en', 'content', e.target.value)} className="w-full px-4 py-2 border rounded-lg" />
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
                <h2 className="text-xl font-bold text-gray-800">Projeler Listesi</h2>
                <button
                    onClick={handleAddNew}
                    className="bg-brand-navy text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Yeni Proje Ekle
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-center bg-gray-50 hover:bg-white hover:shadow-md transition-all">
                        <div className="w-full md:w-24 h-24 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                            {project.image ? (
                                <img src={project.image} alt={project.tr?.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-lg text-gray-800">{project.tr?.title || 'Başlıksız'}</h3>
                            <p className="text-sm text-gray-500">{project.tr?.location}</p>
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">Sıra: {project.order}</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(project)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Düzenle"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button
                                onClick={() => handleDelete(project.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Sil"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {projects.length === 0 && !loading && (
                <div className="text-center py-12 text-gray-500">Henüz hiç proje eklenmemiş.</div>
            )}
        </div>
    );
};

export default ProjectsEditor;
