import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Upload() {
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic: upload pdfFile & title to backend, then navigate
    console.log('Uploading:', title, pdfFile);
    navigate('/');
  };

  return (
    <div>
      <h1>Upload New Issue</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control"
            value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">PDF File</label>
          <input type="file" className="form-control" accept="application/pdf"
            onChange={e => setPdfFile(e.target.files[0])} required />
        </div>
        <button type="submit" className="btn btn-success">Upload</button>
      </form>
    </div>
  );
}

export default Upload;
