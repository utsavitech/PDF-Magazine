import React from 'react';
import { Link } from 'react-router-dom';

const issues = [
  { id: '1', title: 'Book 1 – November 2025' },
  { id: '2', title: 'Book 2 – December 2025' },
];

function Home() {
  return (
    <div>
      <h1>Available Issues</h1>
      <ul>
        {issues.map(issue => (
          <li key={issue.id}>
            <Link to={`/viewer/${issue.id}`}>{issue.title}</Link>
          </li>
        ))}
      </ul>
      <Link to="/upload" className="btn btn-primary mt-3">Upload New Issue</Link>
    </div>
  );
}

export default Home;
