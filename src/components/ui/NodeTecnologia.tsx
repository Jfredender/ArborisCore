// src/components/ui/NodeTecnologia.tsx
import React from 'react';
import { LaminaSafira } from './LaminaSafira';

export interface TechNode {
  id: string;
  name: string;
  description: string;
  cost: number;
}

interface NodeTecnologiaProps {
  node: TechNode;
  userPoints: number;
  isUnlocked: boolean;
  onPurchase: (techId: string, cost: number) => void;
}

export const NodeTecnologia = ({ node, userPoints, isUnlocked, onPurchase }: NodeTecnologiaProps) => {
  const canAfford = userPoints >= node.cost;

  const handlePurchase = () => {
    if (canAfford && !isUnlocked) {
      onPurchase(node.id, node.cost);
    }
  };

  return (
    <LaminaSafira style={{ 
      marginBottom: '1rem', 
      textAlign: 'left',
      opacity: isUnlocked ? 0.6 : (canAfford ? 1 : 0.5),
      borderLeft: `3px solid ${isUnlocked ? 'var(--cor-verde-vitalidade)' : (canAfford ? 'var(--cor-ciano-cirurgico)' : 'var(--cor-vermelho-alerta)')}`
    }}>
      <h3 style={{ margin: 0, color: isUnlocked ? 'var(--cor-texto-secundario)' : 'var(--cor-texto-primario)' }}>{node.name}</h3>
      <p style={{ margin: '0.5rem 0 1rem 0', fontSize: '0.8rem', color: 'var(--cor-texto-secundario)' }}>
        {node.description}
      </p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold', color: isUnlocked ? 'var(--cor-verde-vitalidade)' : (canAfford ? 'var(--cor-amarelo-analise)' : 'var(--cor-vermelho-alerta)') }}>
          {node.cost} PP
        </p>
        <button style={{ 
          fontFamily: "'IBM Plex Mono', monospace",
          border: 'none',
          padding: '0.5rem 1rem',
          backgroundColor: isUnlocked ? '#333' : (canAfford ? 'var(--cor-ciano-cirurgico)' : '#333'),
          color: isUnlocked ? 'var(--cor-verde-vitalidade)' : (canAfford ? '#000' : '#777'),
          cursor: isUnlocked ? 'default' : (canAfford ? 'pointer' : 'not-allowed')
        }} 
        disabled={!canAfford || isUnlocked}
        onClick={handlePurchase}
        >
          {isUnlocked ? "[ Adquirido ]" : "[ Pesquisar ]"}
        </button>
      </div>
    </LaminaSafira>
  );
};