import React, { useRef, useState, useMemo, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './Bookviewer.css';

function BookViewer({ images = [], title }) {
  const bookRef = useRef(null);
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [bookSize, setBookSize] = useState({ width: 900, height: 650 });
  const [scale, setScale] = useState(1);
  const [isSinglePage, setIsSinglePage] = useState(false);

  // Zoom controls
  const minScale = 0.5;
  const maxScale = 2.2;
  const zoomStep = 0.1;
  const zoomIn = () => setScale(s => Math.min(maxScale, +(s + zoomStep).toFixed(2)));
  const zoomOut = () => setScale(s => Math.max(minScale, +(s - zoomStep).toFixed(2)));
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoIntervalMs, setAutoIntervalMs] = useState(2500);
  const toggleSpread = () => setIsSinglePage(v => !v);
  const toggleAutoPlay = () => setAutoPlay(v => !v);
  const enterFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  // Create spreads (pairs of pages)
  const spreads = useMemo(() => {
    const s = [];
    for (let i = 0; i < images.length; i += 2) s.push(images.slice(i, i + 2));
    return s;
  }, [images]);

  useEffect(() => setCurrentSpread(0), [images]);

  // Responsive size calculation
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w < 700;
      setIsSinglePage(mobile);

      if (mobile) {
        const bw = Math.round(w * 0.92);
        const bh = Math.round(Math.min(h * 0.82, bw * 1.4));
        setBookSize({ width: bw, height: bh });
        setScale(s => (s === 1 ? 1 : s));
      } else {
        // Make desktop/laptop view a bit smaller than before
        const vw = Math.max(320, w - 120); // more margin
        const bw = Math.min(820, vw); // max width reduced from 1000 to 820
        const bh = Math.round(bw * 0.68); // slightly less tall
        setBookSize({ width: bw, height: bh });
        setScale(s => (s === 1 ? Math.min(1, (w - 80) / bw) : s));
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // Set CSS --vh custom property for mobile viewport height issues
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
      // measure title height and set CSS var
      const th = titleRef.current ? titleRef.current.offsetHeight : 56;
      document.documentElement.style.setProperty('--bv-title-height', `${th + 8}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);
    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  // autoplay effect
  useEffect(() => {
    if (!autoPlay) return undefined;
    const id = setInterval(() => {
      try { next(); } catch (e) {}
    }, autoIntervalMs);
    return () => clearInterval(id);
  }, [autoPlay, autoIntervalMs]);

  const onFlip = (e) => {
    // e.data is the current flipbook page index (0-based where each child is a spread)
    setCurrentSpread(e.data);
  };

  const prev = () => bookRef.current && bookRef.current.pageFlip().flipPrev();
  const next = () => bookRef.current && bookRef.current.pageFlip().flipNext();

  return (
    <div className="book-viewer-container">
      {title && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <h1 className="bv-title" ref={titleRef}>{title}</h1>
        </div>
      )}

      <div className="flipbook-wrapper" ref={containerRef}>
        <div className="flipbook-inner" style={{ width: bookSize.width, height: bookSize.height, transform: `scale(${scale})`, position: 'relative' }}>
          <HTMLFlipBook
            key={isSinglePage ? 'single' : 'spread'}
            width={bookSize.width}
            height={bookSize.height}
            ref={bookRef}
            onFlip={onFlip}
            showCover={false}
            mobileScrollSupport={false}
          >
            {isSinglePage
              ? images.map((src, idx) => (
                  <div className="page" key={idx} style={{ padding: 0 }}>
                    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                      <div style={{ flex: 1, padding: 8 }}>
                        <img src={src} alt={`Page ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                    </div>
                  </div>
                ))
              : spreads.map((pair, idx) => (
                  <div className="page" key={idx} style={{ padding: 0 }}>
                    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                      <div style={{ flex: 1, padding: 8 }}>
                        {pair[0] ? <img src={pair[0]} alt={`Page ${idx * 2 + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
                      </div>
                      <div style={{ flex: 1, padding: 8 }}>
                        {pair[1] ? <img src={pair[1]} alt={`Page ${idx * 2 + 2}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : null}
                      </div>
                    </div>
                  </div>
                ))}
          </HTMLFlipBook>

          <button className="bv-overlay-btn bv-btn-left" onClick={prev} aria-label="Previous" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="bv-overlay-btn bv-btn-right" onClick={next} aria-label="Next" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Control Panel */}
      <div className="bv-control-panel">
        <div className="bv-cp-left">
          <button className="bv-cp-btn" onClick={zoomOut} aria-label="Zoom Out" disabled={scale <= minScale}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button className="bv-cp-btn" onClick={zoomIn} aria-label="Zoom In" disabled={scale >= maxScale}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <span className="bv-cp-zoom">{Math.round(scale * 100)}%</span>
        </div>

        <div className="bv-cp-center">
          <button className="bv-cp-btn" onClick={toggleAutoPlay} aria-pressed={autoPlay} title="Play/Pause">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d={autoPlay?"M6 6h4v12H6zM14 6h4v12h-4z":"M5 3v18l15-9L5 3z"} stroke="currentColor" strokeWidth="0" fill="currentColor"/></svg>
          </button>
          <button className="bv-cp-btn" onClick={toggleSpread} title="Toggle single/two page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="7" height="16" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="4" width="7" height="16" stroke="currentColor" strokeWidth="1.6"/></svg>
          </button>
          <button className="bv-cp-btn" title="Grid / Thumbnails">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="1.6"/><rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6"/><rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="1.6"/></svg>
          </button>
        </div>

        <div className="bv-cp-right">
          <button className="bv-cp-btn" onClick={prev} aria-label="Previous Page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="bv-cp-btn" onClick={next} aria-label="Next Page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button className="bv-cp-btn" onClick={enterFullscreen} title="Fullscreen">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 3h8v2H5v6H3V3zm18 0v8h-2V5h-6V3h8zM3 21v-8h2v6h6v2H3zm18 0h-8v-2h6v-6h2v8z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 10, textAlign: 'center' }}>
        {isSinglePage ? (
          <span style={{ background: 'rgba(255,255,255,0.95)', padding: '6px 10px', borderRadius: 6 }}>
            Page {currentSpread + 1} of {images.length}
          </span>
        ) : (
          (() => {
            const leftPage = currentSpread * 2 + 1;
            const rightPage = leftPage + 1 <= images.length ? leftPage + 1 : null;
            return (
              <span style={{ background: 'rgba(255,255,255,0.95)', padding: '6px 10px', borderRadius: 6 }}>
                Pages {leftPage}{rightPage ? ` - ${rightPage}` : ''} of {images.length}
              </span>
            );
          })()
        )}
      </div>
    </div>
  );
}

export default BookViewer;
