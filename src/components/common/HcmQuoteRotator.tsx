import React, { useState, useEffect } from 'react';
import { HCM_QUOTES } from '../../data/hcmQuotes';

export const HcmQuoteRotator: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % HCM_QUOTES.length);
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-xs text-slate-600 mt-0.5 font-medium italic">
      "{HCM_QUOTES[quoteIndex]}"
    </p>
  );
};
