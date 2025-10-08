// src/components/scene/LigacaoSinergica.tsx
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface LigacaoSinergicaProps {
  start: [number, number, number];
  end: [number, number, number];
}

export const LigacaoSinergica = ({ start, end }: LigacaoSinergicaProps) => {
  const lineRef = useRef<any>(null!);

  useFrame(({ clock }) => {
    // Anima a opacidade da linha para criar um efeito de pulsação
    if (lineRef.current) {
      lineRef.current.material.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 3) * 0.5;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={[start, end]}
      color={'#00FFFF'}
      lineWidth={2}
      dashed={false}
      transparent
    />
  );
};