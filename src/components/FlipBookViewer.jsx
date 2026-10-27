import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import HTMLFlipBook from 'react-pageflip';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const FlipBookViewer = ({ pdfUrl }) => {
    const [numPages, setNumPages] = useState(null);
    const [width, setWidth] = useState(window.innerWidth < 768 ? 300 : 450);
    const [height, setHeight] = useState(window.innerWidth < 768 ? 424 : 636);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            // A4 ratio approx 1:1.414
            if (window.innerWidth < 768) {
                const w = Math.min(window.innerWidth - 40, 400);
                setWidth(w);
                setHeight(w * 1.414);
                setIsMobile(true);
            } else {
                const w = Math.min((window.innerWidth - 40) / 2, 500);
                setWidth(w);
                setHeight(w * 1.414);
                setIsMobile(false);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    const Pages = React.forwardRef((props, ref) => {
        return (
            <div ref={ref} className="bg-white shadow-xl overflow-hidden">
                <Page
                    pageNumber={props.pageNumber}
                    width={width}
                    height={height}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-sm"
                />

            </div>
        );
    });

    // Explicitly define display name for debugging
    Pages.displayName = 'RefForwardingPage';

    return (
        <div className="flex justify-center items-center py-4 bg-gray-100/50 rounded-xl overflow-hidden min-h-[500px]">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex items-center justify-center h-96 w-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-safety-orange"></div>
                    </div>
                }
                error={
                    <div className="flex items-center justify-center h-96 w-full text-red-500">
                        PDF yüklenemedi. Lütfen tekrar deneyin veya indirin.
                    </div>
                }
            >
                {numPages && (
                    <HTMLFlipBook
                        width={width}
                        height={height}
                        size="fixed" // or "stretch"
                        minWidth={300}
                        maxWidth={1000}
                        minHeight={400}
                        maxHeight={1533}
                        maxShadowOpacity={0.5}
                        showCover={true}
                        mobileScrollSupport={true}
                        usePortrait={isMobile}
                        startPage={0}
                        className="shadow-2xl mx-auto"
                    >
                        {Array.from(new Array(numPages), (el, index) => (
                            <Pages key={`page_${index + 1}`} pageNumber={index + 1} />
                        ))}
                    </HTMLFlipBook>
                )}
            </Document>
        </div>
    );
};

export default FlipBookViewer;
