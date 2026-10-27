import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../context/LanguageContext';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();

    const t = {
        back: language === 'tr' ? '← Blog\'a Dön' : '← Back to Blog',
        notFound: language === 'tr' ? 'Gönderi bulunamadı.' : 'Post not found.'
    };

    const handleBackToBlog = (e) => {
        e.preventDefault();
        navigate('/');
        setTimeout(() => {
            const element = document.querySelector('#blog');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPost = async () => {
            try {
                const docRef = doc(db, "posts", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({ id: docSnap.id, ...docSnap.data() });
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safety-orange"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-32 pb-20 px-4 text-center">
                <h2 className="text-2xl font-bold text-gray-700">{t.notFound}</h2>
                <a href="/#blog" onClick={handleBackToBlog} className="text-safety-orange hover:underline mt-4 inline-block">{t.back}</a>
            </div>
        );
    }

    return (
        <article className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <a
                    href="/#blog"
                    onClick={handleBackToBlog}
                    className="text-gray-500 hover:text-safety-orange transition-colors mb-8 inline-block"
                >
                    {t.back}
                </a>

                {post.imageUrl && (
                    <div className="w-full h-[400px] rounded-xl overflow-hidden mb-8 shadow-lg">
                        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                )}

                <h1 className="text-3xl md:text-5xl font-bold text-industrial-dark mb-4 leading-tight">
                    {post.title}
                </h1>

                <div className="flex items-center text-gray-500 text-sm mb-8 border-b border-gray-100 pb-8">
                    <span>{post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : ''}</span>
                    {post.author && (
                        <>
                            <span className="mx-2">•</span>
                            <span>{post.author.includes('@') ? 'Saçlı Endüstri' : post.author}</span>
                        </>
                    )}
                </div>

                <div className="prose prose-lg max-w-none prose-a:text-safety-orange prose-headings:text-industrial-dark">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </div>
        </article>
    );
};

export default BlogPost;
