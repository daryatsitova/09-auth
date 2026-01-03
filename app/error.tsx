'use client';

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

const Error = ({ error, reset }: Props) => {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Could not fetch the list of notes</h2>
      <p>Something went wrong while loading your notes.</p>
      {error.message && (
        <details style={{ marginTop: '10px' }}>
          <summary>Error details</summary>
          <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: '10px' }}>
            {error.message}
          </pre>
        </details>
      )}
      <button 
        onClick={reset}
        style={{ 
          marginTop: '20px', 
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Try again
      </button>
    </div>
  );
};

export default Error;