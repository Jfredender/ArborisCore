// src/hooks/useCamera.ts
import { useState, useEffect, useRef, useCallback } from 'react';

export const useCamera = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const startCamera = async () => {
      console.log("useCamera: A tentar iniciar a câmera...");
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        
        console.log("useCamera: Stream da câmera obtido.");
        
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.srcObject = stream;
          videoElement.play().catch(playError => {
            console.error("useCamera: Erro ao tentar reproduzir o vídeo.", playError);
            setError("Não foi possível iniciar o feed da câmera.");
          });
          console.log("useCamera: Stream anexado e a reproduzir.");
        }
      } catch (err) {
        console.error("useCamera: Erro detalhado ao aceder à câmera:", err);
        setError("Câmera não encontrada ou permissão negada.");
      }
    };

    // --- O PROTOCOLO DE INICIALIZAÇÃO ESCALONADA ---
    // Atrasamos a inicialização da câmera em 100ms.
    // Isto dá ao navegador tempo para libertar os recursos da cena 3D anterior.
    timeoutId = setTimeout(startCamera, 100);

    // Função de limpeza
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        console.log("useCamera: Stream da câmera parado.");
      }
    };
  }, []);

  const captureFrame = useCallback(() => {
    const videoElement = videoRef.current;
    if (videoElement && videoElement.readyState >= 3) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL('image/jpeg', 0.8);
      }
    }
    return null;
  }, [videoRef]);

  return { videoRef, error, captureFrame };
};