import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useLanguage();

    const t = {
        title: language === 'tr' ? 'Blog & Haberler' : 'Blog & News',
        readMore: language === 'tr' ? 'Devamını Oku' : 'Read More',
        noPosts: language === 'tr' ? 'Henüz gönderi bulunmamaktadır.' : 'No posts found yet.',
        error: language === 'tr' ? 'Blog gönderileri yüklenirken bir hata oluştu.' : 'Error loading blog posts.'
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // If config is placeholder, don't try to fetch
                // This check is a simple heuristic to prevent crashing before configuration
                // In a real app, we'd handle this more gracefully around the init logic
                if (db?.app?.options?.apiKey === "YOUR_API_KEY_HERE") {
                    console.warn("Firebase not configured yet.");
                    setLoading(false);
                    return;
                }

                const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }))
                    // Filter: Show if status is 'published' OR if status is missing (legacy posts default to published)
                    .filter(post => !post.status || post.status === 'published');
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <section id="blog" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-safety-orange font-heading font-bold text-lg tracking-widest mb-2">BLOG</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-industrial-dark mb-6 relative inline-block">
                        {t.title}
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-1 bg-safety-orange rounded-full"></span>
                    </h3>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        {t.noPosts} {(db?.app?.options?.apiKey === "YOUR_API_KEY_HERE") && <span className="block text-sm text-red-500 mt-2">(System pending configuration)</span>}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
                                {post.imageUrl && (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={post.imageUrl}
                                            alt={post.title}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="text-xs text-gray-500 mb-2">
                                        {post.createdAt?.toDate ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                                    </div>
                                    <h4 className="text-xl font-bold text-industrial-dark mb-3 line-clamp-2">
                                        {post.title}
                                    </h4>
                                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                                        {post.excerpt || post.content.substring(0, 100) + '...'}
                                    </p>
                                    <Link
                                        to={`/blog/${post.id}`}
                                        className="text-safety-orange font-medium hover:text-orange-600 transition-colors inline-flex items-center mt-auto"
                                    >
                                        {t.readMore}
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default Blog;
