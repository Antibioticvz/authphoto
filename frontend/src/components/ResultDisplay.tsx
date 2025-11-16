/**
 * ResultDisplay Component
 * Display capture result or error
 */

import React from 'react';
import type { CaptureResponse } from '../types';

interface ResultDisplayProps {
  result: CaptureResponse | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, error }) => {
  if (error) {
    return (
      <div
        className="result-error"
        style={{
          padding: '16px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c00',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0' }}>❌ Error</h3>
        <p style={{ margin: 0 }}>{error}</p>
      </div>
    );
  }

  if (result) {
    return (
      <div
        className="result-success"
        style={{
          padding: '16px',
          backgroundColor: '#efe',
          border: '1px solid #cfc',
          borderRadius: '8px',
          color: '#060',
        }}
      >
        <h3 style={{ margin: '0 0 8px 0' }}>✅ Success!</h3>
        <p style={{ margin: '8px 0' }}>
          <strong>Photo ID:</strong> {result.photoId}
        </p>
        <p style={{ margin: '8px 0' }}>
          <strong>Verified:</strong> {result.verified ? 'Yes' : 'No'}
        </p>
        {result.message && (
          <p style={{ margin: '8px 0' }}>
            <strong>Message:</strong> {result.message}
          </p>
        )}
        <div style={{ marginTop: '16px' }}>
          <a
            href={result.photoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
            }}
          >
            View Photo
          </a>
        </div>
      </div>
    );
  }

  return null;
};
