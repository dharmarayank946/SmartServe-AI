import React, { useState, useEffect } from 'react';

export default function AnimatedCounter({ value, duration = 1200, prefix = "", suffix = "" }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Parse numeric value if string with commas or currency
    const numericTarget = typeof value === 'number' 
      ? value 
      : parseFloat(String(value).replace(/[^0-9.-]+/g, "")) || 0;

    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      setDisplayValue(Math.floor(easedProgress * numericTarget));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, duration]);

  const formattedStr = displayValue.toLocaleString();

  return (
    <span>{prefix}{formattedStr}{suffix}</span>
  );
}
