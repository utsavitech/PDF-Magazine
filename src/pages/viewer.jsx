// src/pages/Viewer.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookViewer from '../components/Bookviewer';

function Viewer() {
  const { bookId } = useParams();
  const [images, setImages] = useState([]);

 useEffect(() => {
  if (bookId === '1' || bookId === '2') {
    const pageCount = bookId === '1' ? 32 : 10;
    // require all .jpg files from the folder
    const req = require.context('../assets/images', false, /\.jpg$/);
    const imgs = [];

    for (let i = 1; i <= pageCount; i++) {
      const filename = `./${i}.jpg`;
      if (req.keys().includes(filename)) {
        imgs.push(req(filename));
      } else {
        // optional: push a placeholder or break if missing
        console.warn('Missing image:', filename);
      }
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
