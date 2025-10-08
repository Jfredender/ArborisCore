// src/views/ExploratorView.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCamera } from '../hooks/useCamera';
import { useUserData } from '../hooks/useUserData';
import { useSensors } from '../hooks/useSensors';
import { getWeatherData } from '../services/weather';
import { LaminaSafira } from '../components/ui/LaminaSafira';
import { AnaliseSoloAR } from '../components/ui/AnaliseSoloAR';
import { analyzeImage } from '../services/vision';
import { db } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, runTransaction, increment } from "firebase/firestore";
import { playSound } from '../services/sound';

// --- ESTILOS COMPLETOS E CORRIGIDOS ---
const viewContainerStyle: React.CSSProperties = { position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#000', overflow: 'hidden' };
const videoStyle: React.CSSProperties = { width: '100%', height: '100%', objectFit: 'cover' };
const hudOverlayStyle: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
const reticulaStyle: React.CSSProperties = { width: '150px', height: '150px', border: '2px solid var(--cor-amarelo-analise)', borderRadius: '50%', opacity: 0.7, boxShadow: '0 0 15px var(--cor-amarelo-analise)', position: 'relative', animation: 'focusPulse 4s infinite ease-in-out' };
const scanLineStyle: React.CSSProperties = { position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: 'var(--cor-ciano-cirurgico)', boxShadow: '0 0 10px var(--cor-ciano-cirurgico)', borderRadius: '50%', animation: 'scan 2s infinite cubic-bezier(0.4, 0, 0.2, 1)' };
const scanButtonStyle: React.CSSProperties = { position: 'absolute', bottom: '10rem', width: '70px', height: '70px', borderRadius: '50%', backgroundColor: 'rgba(0, 255, 255, 0.2)', border: '3px solid var(--cor-ciano-cirurgico)', boxShadow: '0 0 15px var(--cor-ciano-cirurgico)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.1s ease', zIndex: 10 };
const scanButtonInnerCircle: React.CSSProperties = { width: '55px', height: '55px', borderRadius: '50%', backgroundColor: 'var(--cor-ciano-cirurgico)' };
const resetButtonStyle: React.CSSProperties = { fontFamily: "'IBM Plex Mono', monospace", backgroundColor: 'transparent', border: '1px solid var(--cor-amarelo-analise)', color: 'var(--cor-amarelo-analise)', padding: '0.5rem 1rem', marginTop: '1rem', cursor: 'pointer', opacity: 0.8 };
const telemetryPanelStyle: React.CSSProperties = { position: 'absolute', bottom: '2rem', left: '1rem', padding: '0.5rem 1rem', width: 'calc(100% - 2rem)', maxWidth: '350px' };
const animations = `@keyframes focusPulse { 0%, 100% { transform: scale(0.98); opacity: 0.7; } 50% { transform: scale(1.02); opacity: 1; } } @keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }`;

export const ExploratorView = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const { videoRef, error: cameraError, captureFrame } = useCamera();
  const { location, illumination } = useSensors();
  const [weather, setWeather] = useState<{ temp: number; humidity: number } | null>(null);
  const [dateTime, setDateTime] = useState(new Date());
  const [analysisState, setAnalysisState] = useState<'idle' | 'scanning' | 'analyzing' | 'complete' | 'error'>('idle');
  const [analysisResult, setAnalysisResult] = useState<{ name: string; points: number } | null>(null);
  
  const hasGeoAnalysis = userData?.unlockedTech?.includes('geo_analysis');

  useEffect(() => { if (location) { getWeatherData(location.latitude, location.longitude).then(data => { if (data) setWeather({ temp: data.temperature, humidity: data.humidity }); }); } }, [location]);
  useEffect(() => { const timer = setInterval(() => setDateTime(new Date()), 1000); return () => clearInterval(timer); }, []);

  const handleScan = async () => { if (analysisState !== 'idle' && analysisState !== 'complete') return; const frame = captureFrame(); if (frame && user) { playSound('scan'); setAnalysisState('scanning'); setTimeout(async () => { setAnalysisState('analyzing'); const analysisData = await analyzeImage(frame); if (typeof analysisData === 'string') { setAnalysisResult({ name: analysisData, points: 0 }); setAnalysisState('error'); return; } const { name, category } = analysisData; const hasScannerMkII = userData?.unlockedTech?.includes('scan_level_2'); const pointsAwarded = (hasScannerMkII ? 150 : 50) + Math.floor(Math.random() * (hasScannerMkII ? 101 : 51)); const userDocRef = doc(db, "users", user.uid); const userEntitiesCollection = collection(db, "users", user.uid, "entities"); try { await runTransaction(db, async (transaction) => { transaction.set(doc(userEntitiesCollection), { name: name, category: category, discoveredAt: serverTimestamp(), dnaCode: Math.random().toString(36).substring(2, 10).toUpperCase() }); transaction.set(userDocRef, { researchPoints: increment(pointsAwarded) }, { merge: true }); }); playSound('success'); setAnalysisResult({ name: name, points: pointsAwarded }); setAnalysisState('complete'); } catch (e) { console.error("Erro na transação: ", e); setAnalysisResult({ name: "Falha ao registrar amostra", points: 0 }); setAnalysisState('error'); } }, 300); } };
  const resetScanner = () => { setAnalysisState('idle'); setAnalysisResult(null); };

  const renderHUDContent = () => {
    const hasScannerMkII = userData?.unlockedTech?.includes('scan_level_2');
    switch (analysisState) {
      case 'analyzing': return <div style={reticulaStyle}><div style={scanLineStyle}></div><p>ANALISANDO...</p></div>;
      case 'complete': return (<LaminaSafira style={{ textAlign: 'center' }}><p style={{ margin: 0, fontSize: '0.8rem' }}>SEQUENCIAMENTO COMPLETO</p><h3 style={{ margin: '0.5rem 0', color: 'var(--cor-verde-vitalidade)' }}>{analysisResult?.name}</h3>{hasScannerMkII && <p style={{margin: '0.25rem 0', fontSize: '0.7rem', color: 'var(--cor-ciano-cirurgico)'}}>BÓNUS Mk. II</p>}<p style={{ margin: 0, color: 'var(--cor-amarelo-analise)', fontWeight: 'bold' }}>+{analysisResult?.points} PP</p><button onClick={resetScanner} style={resetButtonStyle}>[ NOVO SCAN ]</button></LaminaSafira>);
      case 'error': return (<LaminaSafira style={{ textAlign: 'center' }}><p style={{ margin: 0, color: 'var(--cor-vermelho-alerta)' }}>{analysisResult?.name}</p><button onClick={resetScanner} style={resetButtonStyle}>[ TENTAR NOVAMENTE ]</button></LaminaSafira>);
      default: return <div style={reticulaStyle}><p style={{position: 'absolute', top: '105%', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap'}}>[ ALVO NA RETÍCULA ]</p></div>;
    }
  };

  return (
    <div style={viewContainerStyle}>
      <style>{animations}</style>
      <video ref={videoRef} autoPlay playsInline muted style={videoStyle} />
      {hasGeoAnalysis && <AnaliseSoloAR />}
      <div style={hudOverlayStyle}>
        {cameraError ? (<LaminaSafira style={{color: 'var(--cor-vermelho-alerta)'}}><p>{cameraError}</p></LaminaSafira>) : (
          <>
            {renderHUDContent()}
            {analysisState === 'idle' && <div style={scanButtonStyle} onClick={handleScan}><div style={scanButtonInnerCircle} /></div>}
            <LaminaSafira style={telemetryPanelStyle}>
              <div style={{fontSize: '0.7rem', color: 'var(--cor-texto-secundario)', textAlign: 'left'}}>
                <p style={{margin: '0 0 4px 0'}}><strong>DATA:</strong> {dateTime.toLocaleDateString('pt-BR')} | <strong>HORA:</strong> {dateTime.toLocaleTimeString('pt-BR')}</p>
                <p style={{margin: '0 0 4px 0'}}><strong>GPS:</strong> {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Sincronizando...'}</p>
                <p style={{margin: '0 0 4px 0'}}><strong>LUX:</strong> {illumination !== null ? `${illumination.toFixed(0)}` : 'N/A'} | <strong>ALT:</strong> {location?.altitude ? `${location.altitude.toFixed(0)}m` : 'N/A'}</p>
                <p style={{margin: '0'}}><strong>CLIMA:</strong> {weather ? `${weather.temp.toFixed(0)}°C / ${weather.humidity}% Umid.` : 'Carregando...'}</p>
              </div>
            </LaminaSafira>
          </>
        )}
      </div>
    </div>
  );
};