// src/services/sound.ts
import { Howl } from 'howler';

// Mapeia os nossos eventos de som para os ficheiros de áudio
const soundMap = {
  scan: new Howl({ src: ['/sounds/scan.mp3'], volume: 0.5 }),
  success: new Howl({ src: ['/sounds/success.mp3'], volume: 0.7 }),
  purchase: new Howl({ src: ['/sounds/purchase.mp3'], volume: 0.8 }),
};

// A nossa função de serviço para tocar sons
export const playSound = (soundName: keyof typeof soundMap) => {
  if (soundMap[soundName]) {
    soundMap[soundName].play();
  }
};