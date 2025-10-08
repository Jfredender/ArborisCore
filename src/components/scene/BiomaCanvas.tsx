// src/components/scene/BiomaCanvas.tsx
import React, { useRef, Suspense, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Entity } from '../../types';
import { useClima } from '../../context/ClimaContext';
import { EfeitosDeClima } from '../effects/EfeitosDeClima';

// Retornamos à nossa lógica de geração procedural de propriedades
const generateGeneticProps = (dna: string) => {
  let hash = 0;
  for (let i = 0; i < dna.length; i++) { hash = dna.charCodeAt(i) + ((hash << 5) - hash); }
  const color = new THREE.Color().setHSL(Math.abs(hash / 0xFFFFFF) % 1, 0.8, 0.6);
  const detail = Math.abs(hash) % 3;
  const rotationSpeed = 0.1 + (Math.abs(hash) % 10) / 20;
  return { color, detail, rotationSpeed };
};

// Retornamos ao nosso componente de entidade procedural
function EntidadeNoBioma({ entity, index, isSelected, onClick, unlockedTech }: { entity: Entity; index: number; isSelected: boolean; onClick: () => void; unlockedTech: string[] }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geneticProps = useMemo(() => generateGeneticProps(entity.dnaCode), [entity.dnaCode]);

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * geneticProps.rotationSpeed;
    meshRef.current.rotation.x += delta * geneticProps.rotationSpeed * 0.5;
    meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1).multiplyScalar(isSelected ? 1.5 : 1), 0.1);
  });

  const hasDnaStorage2 = unlockedTech.includes('dna_storage_2');
  const radiusMultiplier = hasDnaStorage2 ? 0.8 : 0.5;
  const baseRadius = hasDnaStorage2 ? 2.0 : 1.5;
  const angle = index * (hasDnaStorage2 ? 1.8 : 2.1);
  const radius = baseRadius + index * radiusMultiplier;
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;

  const getGeometry = () => {
    const geoType = Math.abs(parseInt(entity.dnaCode, 36)) % 3;
    switch (geoType) {
      case 0: return <icosahedronGeometry args={[0.5, geneticProps.detail]} />;
      case 1: return <sphereGeometry args={[0.4, 16, 16]} />;
      case 2: return <coneGeometry args={[0.4, 0.7, 8]} />;
      default: return <boxGeometry args={[0.6, 0.6, 0.6]} />;
    }
  };

  return (
    <group position={[x, 0.5, z]} onClick={onClick}>
      <mesh ref={meshRef} castShadow>
        {getGeometry()}
        <meshStandardMaterial
          color={isSelected ? '#FFFFFF' : geneticProps.color}
          emissive={isSelected ? geneticProps.color : geneticProps.color}
          emissiveIntensity={isSelected ? 1.5 : 0.2}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      <Text position={[0, -1.0, 0]} fontSize={0.25} color="white" anchorX="center" anchorY="middle">
        {entity.name}
      </Text>
    </group>
  );
}

function Scene({ entities, selectedEntity, setSelectedEntity, unlockedTech }: { entities: Entity[]; selectedEntity: string | null; setSelectedEntity: (id: string | null) => void; unlockedTech: string[] }) {
  const { clima } = useClima();
  return (
    <>
      <fog attach="fog" args={['#1c1f28', 10, 25]} />
      <ambientLight intensity={clima === 'chuva' ? 0.1 : 0.3} />
      <spotLight color={clima === 'chuva' ? '#66aaff' : '#aaddff'} position={[0, 10, 0]} intensity={clima === 'chuva' ? 3 : 2} angle={0.3} penumbra={1} castShadow />
      {clima === 'chuva' && <EfeitosDeClima />}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[25, 64]} />
        <meshStandardMaterial color="#222" metalness={0.8} roughness={0.4} />
      </mesh>
      {entities.map((entity, index) => (
        <EntidadeNoBioma key={entity.id} entity={entity} index={index} isSelected={selectedEntity === entity.id} onClick={() => setSelectedEntity(entity.id === selectedEntity ? null : entity.id)} unlockedTech={unlockedTech} />
      ))}
      <OrbitControls maxPolarAngle={Math.PI / 2 - 0.1} />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}><GizmoViewport axisColors={['#EF4444', '#22C55E', '#007BFF']} /></GizmoHelper>
      <EffectComposer><Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} intensity={clima === 'chuva' ? 1.2 : 1.5} /></EffectComposer>
    </>
  );
}

export const BiomaCanvas = ({ entities = [], selectedEntity, setSelectedEntity, unlockedTech = [] }: { entities?: Entity[]; selectedEntity: string | null; setSelectedEntity: (id: string | null) => void; unlockedTech?: string[]; }) => {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, background: '#1c1f28' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene entities={entities} selectedEntity={selectedEntity} setSelectedEntity={setSelectedEntity} unlockedTech={unlockedTech} />
        </Suspense>
      </Canvas>
    </div>
  );
};