/**
 * CaptureButton Component
 * Button to trigger photo capture
 */

import React from 'react';

interface CaptureButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const CaptureButton: React.FC<CaptureButtonProps> = ({
  onClick,
  disabled = false,
  isLoading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="capture-button"
      style={{
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: 'white',
        backgroundColor: disabled ? '#ccc' : '#007bff',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.3s',
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#0056b3';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = '#007bff';
        }
      }}
    >
      {isLoading ? 'Capturing...' : 'Capture Photo'}
    </button>
  );
};
