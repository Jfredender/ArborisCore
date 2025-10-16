// src/views/ArvoreTecView.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../hooks/useUserData';
import { NodeTecnologia, TechNode } from '../components/ui/NodeTecnologia';
import { db } from '../firebase';
import { doc, runTransaction, arrayUnion, increment } from 'firebase/firestore';
import { playSound } from '../services/sound';

const arvoreTecnologica: TechNode[] = [
  { id: 'scan_level_2', name: 'Scanner Óptico Mk. II', description: 'Aumenta a chance de obter mais Pontos de Pesquisa por scan.', cost: 500 },
  { id: 'geo_analysis', name: 'Análise de Composição de Solo', description: 'Desbloqueia a capacidade de analisar o solo com a câmera em RA.', cost: 1200 },
  { id: 'incubator_climate', name: 'Controle Climático Avançado', description: 'Permite alterar o clima na sua incubadora de bioma.', cost: 2500 },
  { id: 'dna_storage_2', name: 'Armazenamento de DNA Expandido', description: 'Aumenta o número de entidades que você pode cultivar no seu bioma.', cost: 5000 },
];

const viewContainerStyle: React.CSSProperties = { width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', boxSizing: 'border-box', background: 'var(--cor-fundo-metal)' };

export const ArvoreTecView = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const userPoints = userData?.researchPoints || 0;
  const unlockedTech = userData?.unlockedTech || [];

  const handlePurchase = async (techId: string, cost: number) => {
    if (!user || userPoints < cost) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(userDocRef, { researchPoints: increment(-cost), unlockedTech: arrayUnion(techId) });
      });
      playSound('purchase');
    } catch (error) { console.error("Erro ao adquirir tecnologia: ", error); }
  };

  return (
    <div style={viewContainerStyle}>
      <h1 style={{ textAlign: 'center' }}>Árvore de Tecnologia</h1>
      <p style={{textAlign: 'center', margin: '-1rem 0 2rem 0', color: 'var(--cor-amarelo-analise)', fontWeight: 'bold'}}>Meus Pontos de Pesquisa: {userPoints}</p>
      <div style={{ width: '100%', maxWidth: '600px', height: '70vh', overflowY: 'auto', padding: '1rem' }}>
        {arvoreTecnologica.map(node => (
          <NodeTecnologia 
            key={node.id} 
            node={node} 
            userPoints={userPoints}
            isUnlocked={unlockedTech.includes(node.id)}
            onPurchase={handlePurchase}
          />
        ))}
      </div>
    </div>
  );
};