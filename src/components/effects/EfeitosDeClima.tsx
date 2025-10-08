// src/components/effects/EfeitosDeClima.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const EfeitosDeClima = () => {
  const pointsRef = useRef<THREE.Points>(null!);

  // Gera 5000 posições aleatórias para as gotas de chuva
  const positions = new Float32Array(5000 * 3);
  for (let i = 0; i < 5000; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 20; // x
    positions[i * 3 + 1] = Math.random() * 10;          // y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z
  }

  useFrame((state, delta) => {
    // Anima a queda da chuva
    for (let i = 0; i < 5000; i++) {
      pointsRef.current.geometry.attributes.position.array[i * 3 + 1] -= 5 * delta;
      // Se a gota atingir o chão (y=0), reinicia a sua posição no topo
      if (pointsRef.current.geometry.attributes.position.array[i * 3 + 1] < 0) {
        pointsRef.current.geometry.attributes.position.array[i * 3 + 1] = 10;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.05}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};