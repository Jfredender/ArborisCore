// src/views/LaboratorioView.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BiomaCanvas } from '../components/scene/BiomaCanvas';
import { LaminaSafira } from '../components/ui/LaminaSafira';
import { useFirestore } from '../hooks/useFirestore';
import { useUserData } from '../hooks/useUserData';
import { Entity } from '../types';
import { PainelDeControle } from '../components/ui/PainelDeControle';
import { PainelDeMissao } from '../components/ui/PainelDeMissao';
import { db } from '../services/firebase';
import { doc, runTransaction, arrayUnion, increment } from 'firebase/firestore';

const primeiroContrato = { id: 'contract_electronics_1', title: 'Pesquisa de Campo: Eletrónicos', description: 'Sequencie os códigos genéticos de 3 dispositivos eletrónicos distintos.', reward: 1000, objective: { category: 'Electronic device', targetCount: 3 } };
const viewContainerStyle: React.CSSProperties = { position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' };
const painelRegistosStyle: React.CSSProperties = { position: 'absolute', top: '2rem', left: '2rem', width: '100%', maxWidth: '400px', pointerEvents: 'auto' };
const painelInspetorStyle: React.CSSProperties = { position: 'absolute', top: '2rem', right: '2rem', width: '100%', maxWidth: '300px', pointerEvents: 'auto' };
const logoutButtonStyle: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace", backgroundColor: 'transparent', border: '1px solid var(--cor-ciano-cirurgico)', color: 'var(--cor-ciano-cirurgico)', padding: '0.5rem 1rem', marginTop: '1.5rem', cursor: 'pointer', transition: 'all 0.2s' };

export const LaboratorioView = () => {
  const { user, logout } = useAuth();
  const collectionPath = user ? `users/${user.uid}/entities` : '';
  const { docs: entities } = useFirestore<Entity>(collectionPath);
  const { userData } = useUserData();
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => { setSelectedEntityId(null); }, [location]);

  const selectedEntity = useMemo(() => entities.find(e => e.id === selectedEntityId), [selectedEntityId, entities]);
  const hasClimateControl = userData?.unlockedTech?.includes('incubator_climate');
  const unlockedTech = userData?.unlockedTech || [];
  const claimedMissions = userData?.claimedMissions || [];

  const handleClaimReward = async (missionId: string, reward: number) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    try {
      await runTransaction(db, async (transaction) => {
        transaction.update(userDocRef, { researchPoints: increment(reward), claimedMissions: arrayUnion(missionId) });
      });
    } catch (error) { console.error("Erro ao coletar recompensa: ", error); }
  };

  return (
    <>
      <BiomaCanvas 
        entities={entities} 
        selectedEntity={selectedEntityId}
        setSelectedEntity={setSelectedEntityId}
        unlockedTech={unlockedTech} // <-- A NOVA PROPRIEDADE A SER PASSADA
      />
      
      <div style={viewContainerStyle}>
        <LaminaSafira style={painelRegistosStyle}>
          <h2 style={{ margin: '0 0 0.5rem 0' }}>Registos do Bio-Arquiteto</h2>
          <p style={{ margin: 0, color: 'var(--cor-amarelo-analise)' }}>{userData?.displayName || 'Operador'}</p>
          <div style={{ marginTop: '1rem', padding: '0.5rem', border: '1px solid var(--cor-amarelo-analise)', borderRadius: '4px' }}>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>PONTOS DE PESQUISA (PP)</p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 'bold' }}>{userData?.researchPoints || 0}</p>
          </div>
          <div style={{ marginTop: '1.5rem', maxHeight: '250px', overflowY: 'auto', paddingRight: '1rem' }}>
            {entities.length > 0 ? (
              entities.map((entity) => (
                <div key={entity.id} style={{ marginBottom: '0.5rem', borderBottom: '1px solid rgba(0, 255, 255, 0.2)', paddingBottom: '0.5rem', cursor: 'pointer' }} onClick={() => setSelectedEntityId(entity.id)}>
                  <p style={{ margin: 0, color: entity.id === selectedEntityId ? 'white' : 'var(--cor-verde-vitalidade)', fontWeight: 'bold' }}>{entity.name}</p>
                </div>
              ))
            ) : ( <p style={{ fontStyle: 'italic', textAlign: 'center' }}>Nenhuma entidade sequenciada.</p> )}
          </div>
          <PainelDeMissao mission={primeiroContrato} entities={entities} onClaim={handleClaimReward} isClaimed={claimedMissions.includes(primeiroContrato.id)} />
          <button style={logoutButtonStyle} onClick={logout}>[ Terminar Simulação ]</button>
        </LaminaSafira>

        {selectedEntity && (
          <LaminaSafira style={painelInspetorStyle}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Inspetor de Entidade</h3>
            <div style={{ textAlign: 'left', fontSize: '0.8rem', gap: '0.5rem' }}>
              <div><strong>NOME:</strong> <span style={{ color: 'var(--cor-verde-vitalidade)' }}>{selectedEntity.name}</span></div>
              <div><strong>ID:</strong> <span style={{ wordBreak: 'break-all' }}>{selectedEntity.id}</span></div>
              <div><strong>DNA:</strong> <span style={{ color: 'var(--cor-ciano-cirurgico)' }}>{selectedEntity.dnaCode}</span></div>
              {selectedEntity.discoveredAt && <div><strong>DATA:</strong> <span>{new Date(selectedEntity.discoveredAt.seconds * 1000).toLocaleString('pt-BR')}</span></div>}
            </div>
          </LaminaSafira>
        )}
        {hasClimateControl && <PainelDeControle />}
      </div>
    </>
  );
};