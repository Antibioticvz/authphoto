/**
 * MessageInput Component
 * Input field for optional message
 */

import React from 'react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter optional message...',
  disabled = false,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="message-input"
      style={{
        padding: '10px',
        fontSize: '14px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        width: '100%',
        maxWidth: '400px',
        outline: 'none',
      }}
    />
  );
};
