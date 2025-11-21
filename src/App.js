import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
// import Home from './pages/home';
import Viewer from './pages/viewer';
import Upload from './pages/upload';
import NotFound from './pages/notfound';

function App() {
  return (
    <div className="container mt-4">
      <Routes>
        <Route path="/" element={<Navigate to="/viewer/1" replace />} />
        <Route path="/viewer/:bookId" element={<Viewer />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
