// src/components/ui/PainelDeMissao.tsx
import React from 'react';
import { LaminaSafira } from './LaminaSafira';
import { Entity } from '../../types';

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  objective: {
    category: string;
    targetCount: number;
  };
}

interface PainelDeMissaoProps {
  mission: Mission;
  entities: Entity[];
  onClaim: (missionId: string, reward: number) => void;
  isClaimed: boolean;
}

export const PainelDeMissao = ({ mission, entities, onClaim, isClaimed }: PainelDeMissaoProps) => {
  const progress = entities.filter(e => e.category === mission.objective.category).length;
  const isComplete = progress >= mission.objective.targetCount;

  return (
    <LaminaSafira style={{
      marginTop: '2rem',
      borderLeft: `3px solid ${isComplete || isClaimed ? 'var(--cor-verde-vitalidade)' : 'var(--cor-amarelo-analise)'}`
    }}>
      <h3 style={{ margin: 0 }}>Contrato de Pesquisa</h3>
      <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', color: 'var(--cor-texto-secundario)' }}>{mission.title}</p>
      <div style={{ margin: '1rem 0' }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Objetivo: {mission.objective.category} ({progress} / {mission.objective.targetCount})</p>
      </div>
      <button 
        style={{ width: '100%', fontFamily: "'IBM Plex Mono', monospace", border: 'none', padding: '0.75rem 1rem', cursor: (isComplete && !isClaimed) ? 'pointer' : 'not-allowed', backgroundColor: (isComplete && !isClaimed) ? 'var(--cor-amarelo-analise)' : '#333', color: (isComplete && !isClaimed) ? '#000' : '#777' }}
        disabled={!isComplete || isClaimed}
        onClick={() => onClaim(mission.id, mission.reward)}
      >
        {isClaimed ? "[ Recompensa Coletada ]" : (isComplete ? `[ Coletar ${mission.reward} PP ]` : "[ Progresso Insuficiente ]")}
      </button>
    </LaminaSafira>
  );
};