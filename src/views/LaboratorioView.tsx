import React, { useState, useEffect } from 'react';
import ModelViewer from '@/components/ui/ModelViewer';
import { getEntitiesFromFirestore, Entidade } from '@/services/firebaseService';
import { useAuth } from '@/context/AuthContext';

const layoutStyle: React.CSSProperties = { /* Estilos da vista */ };
const painelEsquerdoStyle: React.CSSProperties = { /* Estilos do painel esquerdo */ };
const painelDireitoStyle: React.CSSProperties = { /* Estilos do painel direito */ };
const placeholderStyle: React.CSSProperties = { /* Estilos do placeholder */ };
const itemEntidadeStyle: React.CSSProperties = { /* Estilos dos itens */ };

export function LaboratorioView() {
  const { user } = useAuth();
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntidades = async () => { /* ... (código inalterado) ... */ };
    if (user) { fetchEntidades(); }
  }, [user]);

  // Esta função agora retorna o JSX que queremos renderizar
  const renderPainelEsquerdo = () => {
    if (isLoading) {
      return <div>[A carregar registos do núcleo...]</div>;
    }
    if (error) {
      return <div style={{ color: 'red' }}>[ERRO DE SINCRONIZAÇÃO]: {error}</div>;
    }
    if (entidades.length === 0) {
        return <div>[Nenhum registo de entidade encontrado no núcleo.]</div>;
    }
    return (
      <div>
        {entidades.map((entidade) => (
          <div
            key={entidade.id}
            style={itemEntidadeStyle}
            onClick={() => setSelectedModel(entidade.modelUrl)}
          >
            &gt; {entidade.nome}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={layoutStyle}>
      <div style={painelEsquerdoStyle}>
        <h2 style={{ borderBottom: '1px solid #00ff99', paddingBottom: '0.5rem' }}>[Registos do Bio-Arquiteto]</h2>
        {/* --- A CORREÇÃO CRÍTICA ESTÁ AQUI: Invocamos a função com () --- */}
        {renderPainelEsquerdo()}
      </div>
      <div style={painelDireitoStyle}>
        {selectedModel ? (
          <ModelViewer modelUrl={selectedModel} />
        ) : (
          <div style={placeholderStyle}>
            [Análise Holográfica em Espera... Selecione um registo para iniciar]
          </div>
        )}
      </div>
    </div>
  );
}