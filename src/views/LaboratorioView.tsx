import React, { useState, useEffect } from 'react';
import ModelViewer from '@/components/ui/ModelViewer';
import { getEntitiesFromFirestore, Entidade } from '@/services/firebaseService';

// --- ESTILOS (Inalterados) ---
const layoutStyle: React.CSSProperties = { /* ... (código de estilo inalterado) ... */ };
const painelEsquerdoStyle: React.CSSProperties = { /* ... (código de estilo inalterado) ... */ };
const painelDireitoStyle: React.CSSProperties = { /* ... (código de estilo inalterado) ... */ };
const placeholderStyle: React.CSSProperties = { /* ... (código de estilo inalterado) ... */ };
const itemEntidadeStyle: React.CSSProperties = { /* ... (código de estilo inalterado) ... */ };
// Cole aqui os objetos de estilo da versão anterior para manter a formatação.

export function LaboratorioView() {
  // --- ESTADO DO COMPONENTE ---
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- EFEITO DE CARREGAMENTO DE DADOS (HOOK useEffect) ---
  useEffect(() => {
    const fetchEntidades = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEntitiesFromFirestore();
        setEntidades(data);
      } catch (err) {
        setError("Falha ao carregar registos do Bio-Arquiteto. Verifique a ligação com o núcleo.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntidades();
  }, []); // O array de dependências vazio assegura que este efeito corre apenas uma vez.

  // --- LÓGICA DE RENDERIZAÇÃO DO PAINEL ESQUERDO ---
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 255, 153, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
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