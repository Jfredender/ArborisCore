// src/components/ui/PainelDeControle.tsx
import React from 'react';
import { LaminaSafira } from './LaminaSafira';
import { useClima } from '../../context/ClimaContext';

const painelStyle: React.CSSProperties = { position: 'absolute', bottom: '10rem', left: '2rem', width: '100%', maxWidth: '250px', pointerEvents: 'auto' };
const buttonStyle: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace", border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', width: '100px' };

export const PainelDeControle = () => {
  const { clima, setClima } = useClima();

  return (
    <LaminaSafira style={painelStyle}>
      <h4 style={{ margin: '0 0 1rem 0' }}>Controle Climático</h4>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button 
          style={{...buttonStyle, backgroundColor: clima === 'sol' ? 'var(--cor-amarelo-analise)' : '#333', color: clima === 'sol' ? '#000' : '#777'}}
          onClick={() => setClima('sol')}
        >
          [ Sol ]
        </button>
        <button 
          style={{...buttonStyle, backgroundColor: clima === 'chuva' ? 'var(--cor-ciano-cirurgico)' : '#333', color: clima === 'chuva' ? '#000' : '#777'}}
          onClick={() => setClima('chuva')}
        >
          [ Chuva ]
        </button>
      </div>
    </LaminaSafira>
  );
};