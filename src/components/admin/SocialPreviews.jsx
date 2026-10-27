import React, { useMemo } from 'react';

// Icons
const HeartIcon = () => (
    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
);
const CommentIcon = () => (
    <svg className="w-5 h-5 text-gray-800 transform -scale-x-100" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
);
const ShareIcon = () => (
    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
);
const BookmarkIcon = () => (
    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
);
const GlobeIcon = () => (
    <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-3.943 5.317 5.317 0 00-1.023-.918A5.992 5.992 0 005.186 6.55c.068-.34.208-.663.415-.951.353-.491.802-.897 1.31-1.196l.16-.089a6.012 6.012 0 015.688 0l.16.089a6.012 6.012 0 013.224 5.253A3 3 0 0013.5 10a1.5 1.5 0 00-1.5 1.5v.5a3 3 0 00-1.5 5.5v2.833a6.012 6.012 0 01-5.688 0V17.5a3 3 0 00-1.5-2.5v-.5a1.5 1.5 0 00-1.5-1.5A2.992 2.992 0 014.332 8.027z" clipRule="evenodd"></path></svg>
);
const CheckIcon = () => (
    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
);
const WarningIcon = () => (
    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
);
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);


function getStatusColor(status) {
    if (status === 'optimize') return 'bg-green-100 text-green-800 border-green-200';
    if (status === 'warning') return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800';
}

export const SocialPreviews = ({ title, content, imageFile, imageUrl, linkedinImageFile, linkedinImageUrl, onClose }) => {

    // Create a local URL for file preview if available
    const displayImage = useMemo(() => {
        if (imageFile) {
            return URL.createObjectURL(imageFile);
        }
        return imageUrl || "https://via.placeholder.com/1080?text=Gorsel+Yok";
    }, [imageFile, imageUrl]);

    // Create a local URL for LinkedIn file preview if available
    // Fallback to main image if no specific LinkedIn image provided
    const displayImageLi = useMemo(() => {
        if (linkedinImageFile) {
            return URL.createObjectURL(linkedinImageFile);
        }
        if (linkedinImageUrl) {
            return linkedinImageUrl;
        }
        // Fallback to main image
        return displayImage;
    }, [linkedinImageFile, linkedinImageUrl, displayImage]);

    // Aspect Ratio & Analysis
    const [aspectRatio, setAspectRatio] = React.useState(null);
    const [analysis, setAnalysis] = React.useState({
        instagram: { status: 'unknown', message: 'Analiz ediliyor...' },
        linkedin: { status: 'unknown', message: 'Analiz ediliyor...' }
    });

    React.useEffect(() => {
        // Shared logic to analyze an image
        const analyzeImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    const ratio = img.width / img.height;
                    resolve({ ratio, width: img.width, height: img.height });
                };
                img.src = src;
            });
        };

        const runAnalysis = async () => {
            const igAnalysis = await analyzeImage(displayImage);

            // For LinkedIn, we analyze displayImageLi (which might be the same as displayImage or a custom one)
            const liAnalysis = await analyzeImage(displayImageLi);

            setAspectRatio(igAnalysis.ratio); // Main ratio is usually relevant

            // Instagram Logic (Square 1:1 preferred)
            let igStatus = 'warning';
            let igMessage = 'Kare format (1:1) önerilir.';
            if (igAnalysis.ratio >= 0.9 && igAnalysis.ratio <= 1.1) {
                igStatus = 'optimize';
                igMessage = 'Mükemmel! Kare format Instagram için ideal.';
            } else {
                igMessage = `Mevcut oran: ${igAnalysis.ratio.toFixed(2)}. Instagram'da kenarlar kırpılabilir.`;
            }

            // LinkedIn Logic
            let liStatus = 'warning';
            let liMessage = 'Yatay format (1.91:1) önerilir.';
            const liRatio = liAnalysis.ratio;
            if (liRatio >= 1.7 && liRatio <= 2.1) {
                liStatus = 'optimize';
                liMessage = 'Mükemmel! Yatay format LinkedIn kapak görselleri için ideal.';
            } else {
                liMessage = `Mevcut oran: ${liRatio.toFixed(2)}. LinkedIn önizlemesinde kesilmeler olabilir.`;
            }

            setAnalysis({
                instagram: { status: igStatus, message: igMessage },
                linkedin: { status: liStatus, message: liMessage }
            });
        };

        runAnalysis();

    }, [displayImage, displayImageLi]);


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-[95vw] max-w-[1400px] h-[90vh] overflow-hidden flex flex-col md:flex-row">

                {/* 1. Sidebar: Guidance Panel */}
                <div className="w-full md:w-1/3 bg-gray-50 border-r border-gray-200 p-6 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-industrial-dark">Paylaşım Rehberi</h2>
                        {/* Mobile Close Button */}
                        <button onClick={onClose} className="md:hidden p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Overall Status */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <h3 className="font-bold text-gray-700 mb-2">Görsel Analizi</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm text-gray-500">Tespit Edilen Oran:</span>
                                <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-sm font-bold">
                                    {aspectRatio ? aspectRatio?.toFixed(2) : '-'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Görselinizin en/boy oranı, platformlarda nasıl görüneceğini belirler.
                            </p>
                        </div>

                        {/* Instagram Status */}
                        <div className={`p-4 rounded-lg border ${getStatusColor(analysis.instagram.status)}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {analysis.instagram.status === 'optimize' ? <CheckIcon /> : <WarningIcon />}
                                <h3 className="font-bold">Instagram Durumu</h3>
                            </div>
                            <p className="text-sm leading-snug">{analysis.instagram.message}</p>
                        </div>

                        {/* LinkedIn Status */}
                        <div className={`p-4 rounded-lg border ${getStatusColor(analysis.linkedin.status)}`}>
                            <div className="flex items-center gap-2 mb-2">
                                {analysis.linkedin.status === 'optimize' ? <CheckIcon /> : <WarningIcon />}
                                <h3 className="font-bold">LinkedIn Durumu</h3>
                            </div>
                            <p className="text-sm leading-snug">{analysis.linkedin.message}</p>
                        </div>

                        {/* Tips */}
                        <div className="mt-8">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">İpuçları</h4>
                            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                                <li>Instagram gönderileri için <b>1080x1080</b> piksel boyutları en net sonucu verir.</li>
                                <li>LinkedIn bağlantı önizlemeleri için <b>1200x627</b> piksel (1.91:1) standardıdır.</li>
                                <li>Metni görselin ortasında tutarak, farklı kırpma senaryolarında (örn. profil ızgarası) kaybı önleyebilirsiniz.</li>
                            </ul>
                        </div>
                    </div>
                </div>


                {/* 2. Main Area: Previews */}
                <div className="flex-1 bg-gray-100 flex flex-col h-full overflow-hidden">
                    <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                        <h2 className="font-bold text-gray-700">Platform Önizlemeleri</h2>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500 rounded-full transition-colors" title="Kapat">
                            <CloseIcon />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="flex flex-col xl:flex-row gap-8 justify-center items-start">

                            {/* Instagram Preview Card */}
                            <div className="flex flex-col items-center">
                                <span className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Instagram Feed</span>
                                <div className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm w-[370px]">
                                    <div className="bg-white p-3 flex items-center justify-between border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                                                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                                                    <span className="text-xs font-bold text-gray-700">SE</span>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-gray-900 leading-none">sacliendustri</p>
                                                <p className="text-[10px] text-gray-500 leading-none">Adana, Türkiye</p>
                                            </div>
                                        </div>
                                        <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>

                                    {/* Image Area - Force Square Aspect Ratio for Container */}
                                    <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                                        <img
                                            src={displayImage}
                                            alt="Preview"
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="p-3">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex gap-4">
                                                <HeartIcon />
                                                <CommentIcon />
                                                <ShareIcon />
                                            </div>
                                            <BookmarkIcon />
                                        </div>
                                        <div className="text-xs text-gray-900 font-bold mb-1">128 beğenme</div>
                                        <div className="text-sm text-gray-900">
                                            <span className="font-bold mr-2">sacliendustri</span>
                                            {content?.substring(0, 90)}... <span className="text-gray-500">devamı</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* LinkedIn Preview Card */}
                            <div className="flex flex-col items-center">
                                <span className="mb-2 text-xs font-bold text-gray-500 uppercase tracking-widest">LinkedIn Feed</span>
                                <div className="border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm w-[400px]">
                                    <div className="p-3 border-b border-gray-100 flex gap-2">
                                        <div className="w-10 h-10 bg-blue-700 rounded-sm flex items-center justify-center text-white font-bold">SE</div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 leading-none mb-0.5">Saçlı Endüstri</p>
                                            <p className="text-xs text-gray-500 leading-none mb-0.5">2,548 takipçi</p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <span>2s</span> • <GlobeIcon />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-3 text-sm text-gray-800 break-words">
                                        {content?.substring(0, 150)}...
                                    </div>

                                    <div className="bg-gray-100 border-t border-b border-gray-200">
                                        {/* Link Preview Image - Approx 1.91:1 */}
                                        <div className="relative pt-[52.35%] bg-gray-200 overflow-hidden">
                                            <img
                                                src={displayImageLi}
                                                alt="Link Preview"
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-3 bg-gray-50">
                                            <p className="text-sm font-bold text-gray-900 truncate">{title || "Blog Başlığı Buraya"}</p>
                                            <p className="text-xs text-gray-500 truncate">sacliendustri.com</p>
                                        </div>
                                    </div>

                                    <div className="p-2 flex justify-between text-gray-500 border-t border-gray-100">
                                        <span className="text-xs font-bold flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path></svg>
                                            Beğen
                                        </span>
                                        <span className="text-xs font-bold flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path></svg>
                                            Yorum Yap
                                        </span>
                                        <span className="text-xs font-bold flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded cursor-pointer">
                                            <ShareIcon />
                                            Paylaş
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
