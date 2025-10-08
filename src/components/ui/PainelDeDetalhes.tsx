// src/components/ui/PainelDeDetalhes.tsx
import React from 'react';
import { LaminaSafira } from './LaminaSafira';

interface Entity {
  id: string;
  name: string;
  dnaCode: string;
}

interface PainelDeDetalhesProps {
  entity: Entity;
  onClose: () => void; // Função para fechar o painel
}

export const PainelDeDetalhes = ({ entity, onClose }: PainelDeDetalhesProps) => {
  const panelStyle: React.CSSProperties = {
    position: 'absolute',
    top: '2rem',
    right: '2rem',
    width: '100%',
    maxWidth: '300px',
    textAlign: 'left',
    zIndex: 20, // Garante que fica sobre outros elementos da UI
  };

  const closeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
    background: 'none',
    border: 'none',
    color: 'var(--cor-texto-secundario)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.5rem',
    lineHeight: '0.5'
  };

  return (
    <LaminaSafira style={panelStyle}>
      <button style={closeButtonStyle} onClick={onClose}>&times;</button>
      <h3 style={{ margin: '0 0 1rem 0', color: 'var(--cor-amarelo-analise)' }}>{entity.name}</h3>
      <p style={{ margin: '0.2rem 0', fontSize: '0.8rem', color: 'var(--cor-texto-secundario)' }}>ID DA AMOSTRA:</p>
      <p style={{ margin: '0 0 1rem 0', fontSize: '0.7rem', fontFamily: 'monospace', color: 'white' }}>{entity.id}</p>
      <p style={{ margin: '0.2rem 0', fontSize: '0.8rem', color: 'var(--cor-texto-secundario)' }}>CÓDIGO GENÉTICO DIGITAL:</p>
      <p style={{ margin: 0, fontSize: '1rem', fontFamily: 'monospace', color: 'var(--cor-verde-vitalidade)', fontWeight: 'bold' }}>{entity.dnaCode}</p>
    </LaminaSafira>
  );
};