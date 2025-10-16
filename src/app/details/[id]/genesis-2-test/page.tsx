"use client"; // Diretiva obrigatória para componentes com interatividade (useState)

import { useState } from 'react';
import ModelViewer from '@/components/ui/ModelViewer';

// Lista de assets disponíveis no nosso diretório /public/models
// Esta lista é baseada nos ficheiros visíveis na sua estrutura de projeto.
const availableAssets = [
  { name: "Cristal 1", path: "/models/cristal1.glb" },
  { name: "Planta 1", path: "/models/planta1.glb" },
  { name: "Rocha 1", path: "/models/rocha1.glb" },
  { name: "Modelo de Teste", path: "/models/test-model.glb" },
];

// Estilos para a nossa interface de controlo, alinhados com a estética do projeto.
const controlPanelStyle: React.CSSProperties = {
  position: 'absolute',
  top: '1rem',
  left: '1rem',
  zIndex: 10,
  padding: '1rem',
  background: 'rgba(0, 255, 153, 0.1)',
  border: '1px solid #00ff99',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  fontFamily: 'monospace',
};

const buttonStyle: React.CSSProperties = {
  background: '#111',
  border: '1px solid #00ff99',
  color: '#00ff99',
  padding: '0.5rem 1rem',
  cursor: 'pointer',
  textAlign: 'left',
};

export default function GenesisTestPage() {
  // Estado para controlar o URL do modelo atualmente a ser exibido
  const [currentModelUrl, setCurrentModelUrl] = useState(availableAssets[0].path);

  return (
    <div>
      <div style={controlPanelStyle}>
        <h3 style={{ color: '#00ff99', margin: '0 0 1rem 0' }}>[Controlo de Assets]</h3>
        {availableAssets.map(asset => (
          <button 
            key={asset.path} 
            onClick={() => setCurrentModelUrl(asset.path)}
            style={buttonStyle}
          >
            Carregar: {asset.name}
          </button>
        ))}
      </div>
      <main>
        {/* Passamos o estado dinâmico para o ModelViewer, validando a sua reusabilidade */}
        <ModelViewer modelUrl={currentModelUrl} />
      </main>
    </div>
  );
}