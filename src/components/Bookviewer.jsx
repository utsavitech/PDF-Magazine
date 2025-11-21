import React, { useRef, useState, useMemo, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import './Bookviewer.css';

function BookViewer({ images = [], title }) {
  const bookRef = useRef(null);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [bookSize, setBookSize] = useState({ width: 900, height: 650 });
  const [scale, setScale] = useState(1);
  const [isSinglePage, setIsSinglePage] = useState(false);

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
        // On mobile, use a larger, taller book to make pages more readable.
        const bw = Math.round(w * 0.92); // ~92% of viewport width
        const bh = Math.round(Math.min(h * 0.82, bw * 1.4)); // tall but not excessive
        setBookSize({ width: bw, height: bh });
        setScale(1);
      } else {
        const vw = Math.max(320, w - 48);
        const bw = Math.min(1000, vw);
        const bh = Math.round(bw * 0.72);
        setBookSize({ width: bw, height: bh });
        const s = Math.min(1, (w - 32) / bw);
        setScale(s);
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

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
          <h1 className="bv-title">{title}</h1>
        </div>
      )}

      <div className="flipbook-wrapper">
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
