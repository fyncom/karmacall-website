import React from 'react';
import './quote.css';

export const Quote = ({ children }) => {
  return (
    <blockquote className="quote-container">
      {children}
    </blockquote>
  );
};
