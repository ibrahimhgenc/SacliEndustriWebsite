import React, { useState, useEffect, useCallback } from 'react';
import { SocialPreviews } from './SocialPreviews';
import AboutEditor from './AboutEditor';
import ProjectsEditor from './ProjectsEditor';
import ServicesEditor from './ServicesEditor';
import TeamEditor from './TeamEditor';
import MessagesEditor from './MessagesEditor';
import { auth, db, storage } from '../../firebase.config';
import { translations } from '../../constants/translations';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, setDoc, getDocs, deleteDoc, doc, updateDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [authChecking, setAuthChecking] = useState(true);
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [linkedinFile, setLinkedinFile] = useState(null);
    const [postToSocial, setPostToSocial] = useState(false);
    const [activeTab, setActiveTab] = useState('blog');
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const isConfigured = db?.app?.options?.apiKey && db.app.options.apiKey !== "YOUR_API_KEY_HERE";

    const fetchPosts = useCallback(async () => {
        if (!isConfigured) return;
        try {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            setPosts(querySnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() })));
        } catch (err) {
            console.error(err);
            toast.error("Yazılar yüklenirken bir hata oluştu");
        }
    }, [isConfigured]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate('/admin');
            } else {
                setAuthChecking(false);
                fetchPosts();
            }
        });
        return () => unsubscribe();
    }, [navigate, fetchPosts]);

    const handleEdit = (post) => {
        setEditMode(true);
        setEditingId(post.id);
        setTitle(post.title);
        setContent(post.content);
        setAuthorName(post.author || '');
        setFile(null);
        setLinkedinFile(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditMode(false);
        setEditingId(null);
        setTitle('');
        setContent('');
        setAuthorName('');
        setFile(null);
        setLinkedinFile(null);
        setShowPreview(false);
    };

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const onDropLinkedin = (acceptedFiles) => {
        setLinkedinFile(acceptedFiles[0]);
    };

    const { getRootProps: getRootPropsMain, getInputProps: getInputPropsMain } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const { getRootProps: getRootPropsLi, getInputProps: getInputPropsLi, isDragActive: isDragActiveLi } = useDropzone({
        onDrop: onDropLinkedin,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin');
    };

    // Generic Webhook Trigger
    const sendToWebhook = async (postData, isTest = false) => {
        const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;

        if (!webhookUrl) {
            toast.error("Make.com Webhook URL (.env içinde VITE_MAKE_WEBHOOK_URL) tanımlanmamış");
            return;
        }

        const payload = {
            ...postData,
            isTest: isTest
        };

        try {
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            toast.success(isTest ? "Test gönderimi başarılı!" : "Sosyal medya gönderimi tetiklendi!");
        } catch (e) {
            console.error("Webhook error", e);
            toast.error("Webhook tetiklenemedi");
        }
    };

    const handleTestWebhook = async (post) => {
        const postData = {
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl || "",
            linkedinImageUrl: post.linkedinImageUrl || "",
            author: post.author || "",
            id: post.id,
            socialText: `${post.title}\n\n${post.content.substring(0, 200)}...Devamını oku: sacliendustri.com/blog/${post.id}`
        };
        await sendToWebhook(postData, true);
    };

    const handleMigration = async () => {
        if (!window.confirm("Bu işlem mevcut verileri veritabanına yükleyecektir. Devam etmek istiyor musunuz?")) return;

        setLoading(true);
        try {
            // 1. Migrate About Us
            const aboutData = {
                tr: translations.tr.about,
                en: translations.en.about
            };
            await setDoc(doc(db, "site_content", "about"), aboutData);

            // 2. Migrate Projects
            const projectOrderIds = [7, 1, 2, 3, 4, 5, 6];
            const trProjects = translations.tr.projects.items;
            const enProjects = translations.en.projects.items;

            let projSortOrder = 1;
            for (const id of projectOrderIds) {
                const trProj = trProjects.find(p => p.id === id);
                const enProj = enProjects.find(p => p.id === id);

                if (!trProj || !enProj) continue;

                const projectDoc = {
                    order: projSortOrder++,
                    image: trProj.image,
                    createdAt: serverTimestamp(),
                    tr: {
                        title: trProj.title,
                        description: trProj.description,
                        location: trProj.location,
                        content: trProj.content || ""
                    },
                    en: {
                        title: enProj.title,
                        description: enProj.description,
                        location: enProj.location,
                        content: enProj.content || ""
                    }
                };

                await setDoc(doc(db, "projects", `project_${trProj.id}`), projectDoc);
            }

            // 3. Migrate Services
            const serviceKeys = [
                { key: 'engineering', icon: 'HardHat' },
                { key: 'manufacturing', icon: 'Factory' },
                { key: 'assembly', icon: 'Wrench' },
                { key: 'procurement', icon: 'PackageSearch' },
                { key: 'projectManagement', icon: 'ClipboardList' }
            ];

            const trServices = translations.tr.services;
            const enServices = translations.en.services;

            let order = 1;
            for (const item of serviceKeys) {
                const trData = trServices[item.key];
                const enData = enServices[item.key];

                if (!trData || !enData) continue;

                const serviceDoc = {
                    order: order++,
                    iconKey: item.icon,
                    createdAt: serverTimestamp(),
                    tr: {
                        title: trData.title,
                        desc: trData.desc,
                        details: trData.details || trData.desc
                    },
                    en: {
                        title: enData.title,
                        desc: enData.desc,
                        details: enData.details || enData.desc
                    }
                };

                await setDoc(doc(db, "services", item.key), serviceDoc);
            }

            toast.success("Veri taşıma işlemi başarıyla tamamlandı!");
        } catch (error) {
            console.error("Migration error:", error);
            toast.error("Veri taşıma sırasında hata oluştu: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e, targetStatus) => {
        e.preventDefault();
        if (!isConfigured) {
            toast.error("Firebase not configured!");
            return;
        }
        setLoading(true);

        try {
            let imageUrl = '';
            let linkedinImageUrl = '';

            if (file) {
                const storageRef = ref(storage, `blog/${new Date().getTime()}_${file.name}`);
                await uploadBytes(storageRef, file);
                imageUrl = await getDownloadURL(storageRef);
            }

            if (linkedinFile) {
                const storageRefLi = ref(storage, `blog/${new Date().getTime()}_li_${linkedinFile.name}`);
                await uploadBytes(storageRefLi, linkedinFile);
                linkedinImageUrl = await getDownloadURL(storageRefLi);
            }

            const postData = {
                title,
                content,
                createdAt: serverTimestamp(),
                author: authorName || auth.currentUser?.email || 'Saçlı Endüstri'
            };

            if (imageUrl) {
                postData.imageUrl = imageUrl;
            }
            if (linkedinImageUrl) {
                postData.linkedinImageUrl = linkedinImageUrl;
            }

            postData.status = targetStatus;

            if (editMode && editingId) {
                await updateDoc(doc(db, "posts", editingId), postData);
                toast.success("Yazı başarıyla güncellendi!");

                if (targetStatus === 'published' && postToSocial) {
                    await sendToWebhook({
                        ...postData,
                        id: editingId,
                        socialText: `${title}\n\n${content.substring(0, 200)}...Devamını oku: sacliendustri.com/blog/${editingId}`
                    });
                }
            } else {
                postData.imageUrl = imageUrl;
                const docRef = await addDoc(collection(db, "posts"), postData);

                if (targetStatus === 'published' && postToSocial) {
                    await sendToWebhook({
                        ...postData,
                        id: docRef.id,
                        socialText: `${title}\n\n${content.substring(0, 200)}...Devamını oku: sacliendustri.com/blog/${docRef.id}`
                    });
                }
                toast.success(targetStatus === 'draft' ? "Taslak kaydedildi!" : "Yazı yayınlandı!");
            }

            cancelEdit();
            setPostToSocial(false);
            fetchPosts();
        } catch (error) {
            console.error(error);
            toast.error(editMode ? "Yazı güncellenirken hata oluştu" : "Yazı oluşturulurken hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) {
            try {
                await deleteDoc(doc(db, "posts", id));
                toast.success("Yazı silindi");
                fetchPosts();
            } catch (err) {
                console.error(err);
                toast.error("Yazı silinirken hata oluştu");
            }
        }
    };

    if (authChecking) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safety-orange"></div>
            </div>
        );
    }

    const tabs = [
        { key: 'blog', label: 'Blog Yazıları' },
        { key: 'about', label: 'Hakkımızda' },
        { key: 'projects', label: 'Projeler' },
        { key: 'services', label: 'Hizmetlerimiz' },
        { key: 'team', label: 'Ekibimiz' },
        { key: 'messages', label: 'Gelen Mesajlar' }
    ];

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-100 px-4">
            <Toaster />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Admin Paneli</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={handleMigration}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors text-sm"
                        >
                            Veri Taşıma (Migration)
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                        >
                            Çıkış Yap
                        </button>
                    </div>
                </div>
                {!isConfigured && (
                    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                        <p className="font-bold">Yapılandırma Gerekli</p>
                        <p>Firebase yapılandırması yapılmamış. src/firebase.config.js dosyasını kontrol edin.</p>
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="flex flex-wrap border-b border-gray-200 mb-8 gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-5 py-3 font-medium text-sm focus:outline-none transition-colors border-b-2 ${
                                activeTab === tab.key
                                    ? 'border-safety-orange text-safety-orange'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'blog' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Sol Kolon: Yazı Ekleme/Düzenleme */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">{editMode ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}</h2>
                            <form onSubmit={(e) => handleSubmit(e, 'published')} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Başlık</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Yazar</label>
                                    <input
                                        type="text"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        placeholder={auth.currentUser?.email}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Görsel</label>
                                    <div
                                        {...getRootPropsMain()}
                                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors relative cursor-pointer"
                                    >
                                        <input {...getInputPropsMain()} />
                                        {file ? (
                                            <span className="text-green-600 font-medium">{file.name}</span>
                                        ) : (
                                            <span className="text-gray-500">Görsel seçmek için tıklayın veya sürükleyin</span>
                                        )}
                                    </div>
                                    {editMode && !file && (
                                        <p className="text-xs text-gray-500 mt-1">Yeni görsel seçmezseniz mevcut görsel korunur.</p>
                                    )}
                                </div>

                                {/* LinkedIn Image Upload (Optional) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        LinkedIn Görseli (Opsiyonel)
                                        <span className="text-xs text-gray-500 ml-2 font-normal">(Yatay format önerilir)</span>
                                    </label>
                                    <div
                                        {...getRootPropsLi()}
                                        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer ${isDragActiveLi ? 'border-brand-navy bg-brand-navy/5' : 'border-gray-300 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input {...getInputPropsLi()} />
                                        {linkedinFile ? (
                                            <span className="text-green-600 font-medium block truncate">{linkedinFile.name}</span>
                                        ) : (
                                            <span className="text-gray-500 text-sm">
                                                LinkedIn için farklı bir görsel yüklemek isterseniz buraya sürükleyin veya tıklayın.
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">İçerik</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows="6"
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-navy focus:border-transparent"
                                        required
                                    ></textarea>
                                </div>

                                {/* Social Media Checkbox */}
                                <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                    <input
                                        type="checkbox"
                                        id="socialShare"
                                        checked={postToSocial}
                                        onChange={(e) => setPostToSocial(e.target.checked)}
                                        className="w-4 h-4 text-brand-navy rounded border-gray-300 focus:ring-brand-navy"
                                    />
                                    <label htmlFor="socialShare" className="text-sm text-gray-700 select-none">
                                        Yazıyı Instagram ve LinkedIn hesaplarında da paylaş
                                    </label>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    {editMode ? (
                                        <>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 bg-brand-navy text-white py-2 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 font-medium"
                                            >
                                                {loading ? 'Güncelleniyor...' : 'Güncelle ve Yayınla'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                disabled={loading}
                                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                            >
                                                İptal
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                type="button"
                                                onClick={(e) => handleSubmit(e, 'draft')}
                                                disabled={loading}
                                                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium"
                                            >
                                                {loading ? 'Kaydediliyor...' : 'Taslak Kaydet'}
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="flex-1 bg-brand-navy text-white py-2 rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50 font-medium"
                                            >
                                                {loading ? 'Yayınlanıyor...' : 'Yayınla'}
                                            </button>
                                        </>
                                    )}
                                </div>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:opacity-90 transition-opacity font-medium flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {showPreview ? "Önizlemeyi Kapat" : "Sosyal Medya Önizlemesi ve İpuçları"}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Sağ Kolon: Mevcut Yazılar */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h2 className="text-xl font-bold mb-6 text-gray-800">Mevcut Yazılar</h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {posts.map((post) => (
                                    <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-gray-50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-800 line-clamp-1">{post.title}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(post)}
                                                    className="text-blue-600 hover:text-blue-800 p-1"
                                                    title="Düzenle"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Sil"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleTestWebhook(post)}
                                                    className="text-purple-500 hover:text-purple-700 p-1"
                                                    title="Make.com Test Gönderimi"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.content}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('tr-TR') : ''}</span>
                                            {post.status === 'draft' ? (
                                                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs font-semibold">Taslak</span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Yayında</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {posts.length === 0 && (
                                    <div className="text-center text-gray-500 py-8">
                                        Henüz hiç blog yazısı eklenmemiş.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'about' && <AboutEditor />}
                {activeTab === 'projects' && <ProjectsEditor />}
                {activeTab === 'services' && <ServicesEditor />}
                {activeTab === 'team' && <TeamEditor />}
                {activeTab === 'messages' && <MessagesEditor />}
            </div>

            {/* Social Previews Modal */}
            {showPreview && (
                <SocialPreviews
                    title={title}
                    content={content}
                    imageFile={file}
                    imageUrl={editMode ? posts.find(p => p.id === editingId)?.imageUrl : null}
                    linkedinImageFile={linkedinFile}
                    linkedinImageUrl={editMode ? posts.find(p => p.id === editingId)?.linkedinImageUrl : null}
                    onClose={() => setShowPreview(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
