import React, { useRef, useState, useMemo } from 'react';
import HTMLFlipBook from 'react-pageflip';

function BookViewer({ images, title }) {
  const bookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Group images into pairs so we render two pages side-by-side
  const pairedPages = useMemo(() => {
    const pairs = [];
    for (let i = 0; i < images.length; i += 2) {
      pairs.push(images.slice(i, i + 2));
    }
    return pairs;
  }, [images]);

  const onFlip = (e) => {
    setCurrentPage(e.data);
  };

  const flipPrev = () => bookRef.current && bookRef.current.pageFlip().flipPrev();
  const flipNext = () => bookRef.current && bookRef.current.pageFlip().flipNext();

  return (
    <div className="book-viewer" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', position: 'relative', flexDirection: 'column' }}>

      {/* Styled centered title (if provided) */}
      {title && (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <h1 style={{
            margin: 0,
            marginBottom: 2,
            padding: '1px 1px',
            fontFamily: "'Poppins', 'Segoe UI', Roboto, Arial, sans-serif",
            fontWeight: 800,
            fontSize: 30,
            color: '#0d47a1',
            letterSpacing: 0.4,
            textTransform: 'none',
            display: 'inline-block',
            background: 'linear-gradient(90deg, rgba(13,71,161,0.08), rgba(2,136,209,0.04))',
            borderRadius: 8,
            boxShadow: '0 6px 18px rgba(13,71,161,0.06)'
          }}>{title}</h1>
        </div>
      )}
      <HTMLFlipBook
        width={800}
        height={600}
        ref={bookRef}
        onFlip={onFlip}
        showCover={true}
        mobileScrollSupport={true}
        drawShadow={true}
        maxShadowOpacity={0.4}
      >
        {pairedPages.map((pair, idx) => (
          <div className="page" key={idx} style={{ padding: 0 }}>
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              {pair.map((src, i) => (
                <div key={i} style={{ flex: 1, padding: 4 }}>
                  <img src={src} alt={`Page ${idx * 2 + i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              ))}
              {pair.length === 1 && (
                <div style={{ flex: 1, padding: 4 }} />
              )}
            </div>
          </div>
        ))}
      </HTMLFlipBook>

      {/* Left (Prev) button - vertically centered at the left side of the book */}
      <button
        onClick={flipPrev}
        aria-label="Previous"
        style={{
          position: 'absolute',
          top: '50%',
          left: 8,
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          border: 'none',
          padding: '8px 12px',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Prev
      </button>

      {/* Right (Next) button - vertically centered at the right side of the book */}
      <button
        onClick={flipNext}
        aria-label="Next"
        style={{
          position: 'absolute',
          top: '50%',
          right: 8,
          transform: 'translateY(-50%)',
          zIndex: 20,
          background: 'rgba(0,0,0,0.6)',
          color: '#fff',
          border: 'none',
          padding: '8px 12px',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Next
      </button>

      {/* Center label below the book */}
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}>
        <span style={{ background: 'rgba(255,255,255,0.9)', padding: '4px 8px', borderRadius: 4 }}>Spread {currentPage + 1} of {pairedPages.length}</span>
      </div>
    </div>
  );
}

export default BookViewer;
