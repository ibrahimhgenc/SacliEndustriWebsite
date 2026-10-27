import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase.config';
import { collection, addDoc, updateDoc, deleteDoc, doc, query, orderBy, onSnapshot, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Trash2, Edit, Plus, Save, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

const getTeamImagePath = (fileName) => `team/${new Date().getTime()}_${fileName}`;

const TeamEditor = () => {
    const [members, setMembers] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMember, setCurrentMember] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [sectionVisible, setSectionVisible] = useState(true);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        linkedin: '',
        email: '',
        phone: '',
        order: 0,
        status: 'active',
        tr: { title: '' },
        en: { title: '' }
    });

    // Fetch Data
    useEffect(() => {
        const q = query(collection(db, 'team_members'), orderBy('order', 'asc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const memberList = snapshot.docs.map(docSnap => ({
                id: docSnap.id,
                ...docSnap.data()
            }));
            setMembers(memberList);
        });

        const loadSettings = async () => {
            const docRef = doc(db, 'site_settings', 'team_section');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSectionVisible(docSnap.data().isVisible !== false);
            }
        };
        loadSettings();

        return () => unsubscribe();
    }, []);

    const toggleSectionVisibility = async () => {
        const newValue = !sectionVisible;
        setSectionVisible(newValue);
        await setDoc(doc(db, 'site_settings', 'team_section'), { isVisible: newValue }, { merge: true });
        toast.success(newValue ? 'Ekibimiz bölümü aktif edildi' : 'Ekibimiz bölümü gizlendi');
    };

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toastId = toast.loading('Kaydediliyor...');

        try {
            let imageUrl = currentMember?.image || '';

            if (imageFile) {
                const storageRef = ref(storage, getTeamImagePath(imageFile.name));
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            const memberData = {
                name: formData.name,
                linkedin: formData.linkedin,
                email: formData.email,
                phone: formData.phone,
                order: formData.order || members.length + 1,
                status: formData.status,
                image: imageUrl,
                title: {
                    tr: formData.tr.title,
                    en: formData.en.title
                },
                updatedAt: serverTimestamp()
            };

            if (currentMember) {
                await updateDoc(doc(db, 'team_members', currentMember.id), memberData);
                toast.success('Takım üyesi güncellendi', { id: toastId });
            } else {
                await addDoc(collection(db, 'team_members'), {
                    ...memberData,
                    createdAt: serverTimestamp()
                });
                toast.success('Yeni üye eklendi', { id: toastId });
            }

            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Hata oluştu', { id: toastId });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu üyeyi silmek istediğinize emin misiniz?')) {
            await deleteDoc(doc(db, 'team_members', id));
            toast.success('Üye silindi');
        }
    };

    const resetForm = () => {
        setIsEditing(false);
        setCurrentMember(null);
        setImageFile(null);
        setFormData({
            name: '',
            linkedin: '',
            email: '',
            phone: '',
            order: 0,
            status: 'active',
            tr: { title: '' },
            en: { title: '' }
        });
    };

    const openEdit = (member) => {
        setCurrentMember(member);
        setFormData({
            name: member.name,
            linkedin: member.linkedin || '',
            email: member.email || '',
            phone: member.phone || '',
            order: member.order,
            status: member.status || 'active',
            tr: { title: member.title?.tr || '' },
            en: { title: member.title?.en || '' }
        });
        setIsEditing(true);
    };

    const toggleStatus = async (member) => {
        const newStatus = member.status === 'active' ? 'passive' : 'active';
        await updateDoc(doc(db, 'team_members', member.id), { status: newStatus });
        toast.success(`Durum güncellendi: ${newStatus === 'active' ? 'Aktif' : 'Pasif'}`);
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Ekibimiz Yönetimi</h2>
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleSectionVisibility}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${sectionVisible ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}
                    >
                        {sectionVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                        {sectionVisible ? 'Bölüm Görünür' : 'Bölüm Gizli'}
                    </button>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
                        >
                            <Plus size={18} /> Yeni Üye Ekle
                        </button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
                            <input
                                type="url"
                                value={formData.linkedin}
                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-posta</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                placeholder="ornek@sacli.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full p-2 border rounded-md"
                                placeholder="+90 5XX XXX XX XX"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ünvan (Türkçe)</label>
                            <input
                                type="text"
                                value={formData.tr.title}
                                onChange={(e) => setFormData({ ...formData, tr: { ...formData.tr, title: e.target.value } })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ünvan (İngilizce)</label>
                            <input
                                type="text"
                                value={formData.en.title}
                                onChange={(e) => setFormData({ ...formData, en: { ...formData.en, title: e.target.value } })}
                                className="w-full p-2 border rounded-md"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Fotoğraf</label>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            accept="image/*"
                            className="w-full p-2 border rounded-md bg-white"
                        />
                        {currentMember && currentMember.image && !imageFile && (
                            <img src={currentMember.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-md" />
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sıralama</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                            className="w-24 p-2 border rounded-md"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="flex items-center gap-2 bg-safety-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            <Save size={18} /> Kaydet
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {members.map((member) => (
                        <div key={member.id} className={`flex items-center justify-between p-4 border rounded-lg ${member.status === 'passive' ? 'bg-gray-100 opacity-75' : 'bg-white'}`}>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    #{member.order}
                                </span>
                                <img
                                    src={member.image || '/logo.png'}
                                    alt={member.name}
                                    className="w-12 h-12 rounded-full object-cover bg-gray-100"
                                />
                                <div>
                                    <h3 className="font-semibold text-gray-900">{member.name}</h3>
                                    <p className="text-sm text-gray-500">{member.title?.tr}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                    {member.status === 'active' ? 'Aktif' : 'Pasif'}
                                </span>
                                <button
                                    onClick={() => toggleStatus(member)}
                                    className="p-2 text-gray-500 hover:text-blue-600"
                                    title="Durumu Değiştir"
                                >
                                    {member.status === 'active' ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button
                                    onClick={() => openEdit(member)}
                                    className="p-2 text-gray-500 hover:text-indigo-600"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(member.id)}
                                    className="p-2 text-gray-500 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeamEditor;
