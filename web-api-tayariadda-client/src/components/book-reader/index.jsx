import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Document, Page, pdfjs } from 'react-pdf';
import { X, ChevronLeft, ChevronRight, Loader2, Volume2, VolumeX, ZoomIn, ZoomOut } from 'lucide-react';
import useSound from 'use-sound';

// Configure PDF.js worker - LOCAL FILE (Robust)
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const BookReader = ({ bookUrl, title, onClose }) => {
    // PDF State
    const [numPages, setNumPages] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Reader State
    const bookRef = useRef(null);
    const [pageNumber, setPageNumber] = useState(0); // Current viewing page index
    const [zoomLevel, setZoomLevel] = useState(1);
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);

    // Layout Textures
    const [dimensions, setDimensions] = useState({ width: 400, height: 600 }); // Defaults

    // Sound Hook (Placeholder for now until file exists)
    // const [playFlip] = useSound('/sounds/page-flip.mp3', { volume: 0.5, soundEnabled: isSoundEnabled });
    const playFlip = useCallback(() => {
        if (isSoundEnabled) {
            // console.log("Flip sound play");
        }
    }, [isSoundEnabled]);

    // --------------------------------------------------------------------------------
    // Sizing Logic: "Best Fit" Strategy
    // --------------------------------------------------------------------------------
    const updateDimensions = useCallback(() => {
        const viewportW = window.innerWidth;
        const viewportH = window.innerHeight;

        // Reserve space for UI (Header: 60px, Margins: 20px)
        const availableHeight = viewportH - 80;
        const availableWidth = viewportW - 40;

        // Target Aspect Ratio for a Single Page (Portrait)
        // A4 is ~0.707. we use 0.72 for a good balance.
        const targetRatio = 0.72;

        // 1. Try fitting by Height
        let pageHeight = availableHeight;
        let pageWidth = Math.floor(pageHeight * targetRatio);

        // 2. Check if 2 pages wide fits in available width
        // We need 2 * pageWidth to fit in availableWidth
        if (pageWidth * 2 > availableWidth) {
            // Scale down to fit width
            pageWidth = Math.floor(availableWidth / 2);
            pageHeight = Math.floor(pageWidth / targetRatio);
        }

        // Apply Zoom
        // When zoomed in, we allow the book to be larger than screen (scrollable)
        // When zoomed out, it shrinks
        setDimensions({
            width: Math.floor(pageWidth * zoomLevel),
            height: Math.floor(pageHeight * zoomLevel)
        });

    }, [zoomLevel]);

    useEffect(() => {
        updateDimensions();

        // Add global style for PDF canvas containment
        const style = document.createElement('style');
        style.innerHTML = `
            .react-pdf__Page__canvas {
                max-width: 100% !important;
                height: auto !important;
                object-fit: contain;
                display: block;
                margin: 0 auto;
            }
            .react-pdf__Page {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
            }
        `;
        document.head.appendChild(style);

        let timeout;
        const widthListener = () => {
            clearTimeout(timeout);
            timeout = setTimeout(updateDimensions, 100);
        };
        window.addEventListener('resize', widthListener);
        return () => {
            window.removeEventListener('resize', widthListener);
            document.head.removeChild(style);
        }
    }, [updateDimensions]);


    // --------------------------------------------------------------------------------
    // PDF Handlers
    // --------------------------------------------------------------------------------
    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setIsLoading(false);
        setError(null);
    };

    const onDocumentLoadError = (err) => {
        console.error("PDF Error:", err);
        setError("Could not load book content.");
        setIsLoading(false);
    };

    // Memoize options to prevent reload loop
    const pdfOptions = useMemo(() => ({
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
    }), []);


    return (
        <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col overflow-hidden">

            {/* --- Header / Toolbar --- */}
            <div className="flex-none h-16 flex items-center justify-between px-6 bg-gradient-to-b from-black/60 to-transparent z-50 text-white absolute w-full top-0">
                <div className="flex items-center gap-4">
                    <span className="bg-white/10 p-2 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </span>
                    <h2 className="font-semibold tracking-wide truncate max-w-md">{title || "Course Material"}</h2>
                </div>

                <div className="flex items-center gap-3 bg-black/30 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md shadow-xl">
                    <button onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))} className="p-1.5 hover:bg-white/10 rounded-full transition"><ZoomOut size={18} /></button>
                    <span className="text-xs font-mono w-10 text-center">{Math.round(zoomLevel * 100)}%</span>
                    <button onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.1))} className="p-1.5 hover:bg-white/10 rounded-full transition"><ZoomIn size={18} /></button>
                    <div className="h-4 w-px bg-white/20 mx-1"></div>
                    <button onClick={() => setIsSoundEnabled(!isSoundEnabled)} className="p-1.5 hover:bg-white/10 rounded-full transition">
                        {isSoundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                    </button>
                </div>

                <button onClick={onClose} className="p-2 hover:bg-red-500/20 hover:text-red-400 rounded-full transition">
                    <X size={24} />
                </button>
            </div>

            {/* --- Main Content Area --- */}
            {/* Added pt-20 to account for absolute header, centered vertically */}
            <div className="flex-1 relative w-full overflow-auto flex items-center justify-center p-4 pt-20">

                {/* Navigation Arrows (Fixed to sides of view) */}
                <button
                    className="fixed left-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm border border-white/10 transition-all hidden md:flex"
                    onClick={() => bookRef.current?.pageFlip()?.flipPrev()}
                >
                    <ChevronLeft size={32} />
                </button>

                <button
                    className="fixed right-4 top-1/2 -translate-y-1/2 z-40 p-3 bg-black/20 hover:bg-black/50 text-white rounded-full backdrop-blur-sm border border-white/10 transition-all hidden md:flex"
                    onClick={() => bookRef.current?.pageFlip()?.flipNext()}
                >
                    <ChevronRight size={32} />
                </button>

                {/* Loading / Error UI */}
                {(isLoading) && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white pointer-events-none">
                        <Loader2 className="w-12 h-12 animate-spin mb-3 text-cyan-400" />
                        <span className="text-sm uppercase tracking-widest opacity-70">Loading Book...</span>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-slate-900">
                        <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl max-w-md text-center">
                            <h3 className="text-red-400 font-bold text-lg mb-2">Error</h3>
                            <p className="text-white/80 mb-4">{error}</p>
                            <button onClick={onClose} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-white text-sm">Close Reader</button>
                        </div>
                    </div>
                )}

                {/* --- PDF CANVAS --- */}
                {/* We render Document always to load specific page count */}
                <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} w-full flex justify-center items-center`}>
                    <Document
                        file={bookUrl}
                        onLoadSuccess={onDocumentLoadSuccess}
                        onLoadError={onDocumentLoadError}
                        loading={null}
                        options={pdfOptions}
                    >
                        {/* Only render FlipBook if we have pages */}
                        {numPages && (
                            <HTMLFlipBook
                                width={dimensions.width}
                                height={dimensions.height}
                                size="fixed"
                                minWidth={200}
                                maxWidth={2000} // Allow large width for high quality
                                minHeight={300}
                                maxHeight={2000} // Allow large height
                                showCover={true}
                                usePortrait={false} // Force 2-page spread
                                mobileScrollSupport={true}
                                ref={bookRef}
                                className="shadow-2xl"
                                onFlip={playFlip}
                                showPageCorners={true}
                            >
                                {/* Generate Pages */}
                                {[...Array(numPages).keys()].map((index) => {
                                    const pageNum = index + 1;
                                    return (
                                        <div key={index} className="bg-white overflow-hidden relative">
                                            {/* 
                                                CRITICAL: Width & Height here MUST match FlipBook width/height exactly. 
                                                'react-pdf' Page component will scale the internal canvas to fit.
                                            */}
                                            <div className="w-full h-full flex items-center justify-center bg-white">
                                                <Page
                                                    pageNumber={pageNum}
                                                    height={dimensions.height} // Constrain by Height primarily
                                                    className="page-canvas shadow-sm"
                                                    renderAnnotationLayer={false}
                                                    renderTextLayer={false}
                                                    loading={
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                            <Loader2 className="animate-spin w-8 h-8" />
                                                        </div>
                                                    }
                                                />
                                            </div>

                                            {/* Page Number Badge */}
                                            <div className="absolute bottom-4 right-4 text-[10px] font-mono text-gray-400 select-none">
                                                {pageNum} / {numPages}
                                            </div>
                                        </div>
                                    );
                                })}
                            </HTMLFlipBook>
                        )}
                    </Document>
                </div>

            </div>

            {/* Footer Hint */}
            <div className="flex-none h-8 flex items-center justify-center text-white/20 text-[10px] uppercase tracking-widest select-none">
                Use Arrow Keys or Click Corners to Flip
            </div>
        </div>
    );
};

export default BookReader;
