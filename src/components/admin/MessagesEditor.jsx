import React, { useState, useEffect } from 'react';
import { db } from '../../firebase.config';
import { collection, query, orderBy, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Mail, Phone, Trash2, CheckCircle, Circle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const MessagesEditor = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'contact_messages'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const list = snapshot.docs.map((docSnap) => ({
                    id: docSnap.id,
                    ...docSnap.data()
                }));
                setMessages(list);
                setLoading(false);
            },
            (err) => {
                console.error('Error loading messages:', err);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const toggleRead = async (msg) => {
        try {
            await updateDoc(doc(db, 'contact_messages', msg.id), {
                read: !msg.read
            });
        } catch (err) {
            console.error(err);
            toast.error('Durum güncellenemedi');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bu mesajı silmek istediğinize emin misiniz?')) return;
        try {
            await deleteDoc(doc(db, 'contact_messages', id));
            toast.success('Mesaj silindi');
        } catch (err) {
            console.error(err);
            toast.error('Mesaj silinemedi');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Mesajlar yükleniyor...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Gelen İletişim Mesajları</h2>
                <span className="text-sm text-gray-500">
                    Toplam {messages.length} mesaj ({messages.filter((m) => !m.read).length} okunmamış)
                </span>
            </div>

            {messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Henüz iletişim formundan gelen bir mesaj bulunmuyor.</div>
            ) : (
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`border rounded-lg p-5 transition-all ${
                                msg.read ? 'bg-gray-50 border-gray-200' : 'bg-orange-50/40 border-safety-orange/40 shadow-sm'
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => toggleRead(msg)}
                                        className="text-safety-orange hover:opacity-80"
                                        title={msg.read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                                    >
                                        {msg.read ? <CheckCircle size={20} className="text-green-600" /> : <Circle size={20} />}
                                    </button>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{msg.name}</h3>
                                        <span className="text-xs text-gray-500">
                                            {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString('tr-TR') : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    {msg.email && (
                                        <a
                                            href={`mailto:${msg.email}`}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            <Mail size={15} /> {msg.email}
                                        </a>
                                    )}
                                    {msg.phone && (
                                        <a
                                            href={`tel:${msg.phone}`}
                                            className="inline-flex items-center gap-1 text-gray-700 hover:text-safety-orange"
                                        >
                                            <Phone size={15} /> {msg.phone}
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(msg.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md"
                                        title="Sil"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm whitespace-pre-wrap bg-white p-3 rounded border border-gray-100">
                                {msg.message}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MessagesEditor;
