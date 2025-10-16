// Caminho: src/components/ui/ModelViewer.tsx

"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF } from "@react-three/drei";
import { Suspense } from "react";

// Um placeholder visual enquanto o modelo principal carrega.
const Loader = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" wireframe />
    </mesh>
  );
};

// O componente que carrega e renderiza o modelo .glb
const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  // Podemos clonar a cena se precisarmos de múltiplas instâncias
  return <primitive object={scene} />;
};

// A exportação principal que monta a cena 3D
export default function ModelViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div style={{ width: "100%", height: "100vh", background: "linear-gradient(to bottom, #111, #333)" }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={<Loader />}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}