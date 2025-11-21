// src/pages/Viewer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookViewer from '../components/Bookviewer';

function Viewer() {
  const { bookId } = useParams();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (bookId === '1') {
      const pageCount = 32;
      const imgs = [];
      for (let i = 1; i <= pageCount; i++) {
        // require each image from assets
        imgs.push(require(`../assets/images/${i}.jpg`));
      }
      setImages(imgs);
    } else if (bookId === '2') {
      // example for another issue
      const pageCount = 10;  // e.g., 10 pages
      const imgs = [];
      for (let i = 1; i <= pageCount; i++) {
        imgs.push(require(`../assets/images/${i}.jpg`));
      }
      setImages(imgs);
    } else {
      setImages([]);
    }
  }, [bookId]);

  if (!images.length) {
    return <div>Loading or no pages found for this issue…</div>;
  }

  return (
    <div>
      <BookViewer images={images} title="Udbhav202501" />
    </div>
  );
}

export default Viewer;
