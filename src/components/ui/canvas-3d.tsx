// Caminho: src/components/ui/canvas-3d.tsx (Correto e Completo)

"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Torus } from "@react-three/drei";

interface Canvas3DProps {
  modelId: string;
}

export default function Canvas3D({ modelId }: Canvas3DProps) {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Torus args={[1, 0.4, 32, 100]}>
          <meshStandardMaterial color="#8A2BE2" roughness={0.3} metalness={0.8} />
        </Torus>
        <OrbitControls />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
}