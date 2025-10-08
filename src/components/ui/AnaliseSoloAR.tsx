// src/components/ui/AnaliseSoloAR.tsx
import React from 'react';

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0, left: 0,
  width: '100%', height: '100%',
  pointerEvents: 'none',
  overflow: 'hidden',
};

const gridStyle: React.CSSProperties = {
  position: 'absolute',
  bottom: 0, left: '50%',
  transform: 'translateX(-50%) perspective(150px) rotateX(45deg)',
  width: '200%',
  height: '50%',
  backgroundSize: '40px 40px',
  backgroundImage: `
    linear-gradient(to right, rgba(0, 255, 255, 0.2) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 255, 255, 0.2) 1px, transparent 1px)
  `,
  animation: 'scanGrid 5s linear infinite',
};

const dataPointStyle: React.CSSProperties = {
  position: 'absolute',
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: '0.7rem',
  color: 'var(--cor-ciano-cirurgico)',
  backgroundColor: 'rgba(20, 25, 40, 0.7)',
  padding: '2px 5px',
  borderRadius: '3px',
  textShadow: '0 0 5px var(--cor-ciano-cirurgico)',
};

const animations = `
  @keyframes scanGrid {
    0% { background-position-y: 0px; }
    100% { background-position-y: 40px; }
  }
`;

export const AnaliseSoloAR = () => {
  return (
    <div style={containerStyle}>
      <style>{animations}</style>
      <div style={gridStyle}></div>
      <div style={{ ...dataPointStyle, bottom: '20%', left: '15%' }}>N: 14.2%</div>
      <div style={{ ...dataPointStyle, bottom: '15%', left: '60%' }}>P: 8.9%</div>
      <div style={{ ...dataPointStyle, bottom: '30%', left: '80%' }}>K: 11.5%</div>
      <div style={{ ...dataPointStyle, bottom: '5%', left: '30%' }}>pH: 6.8</div>
    </div>
  );
};