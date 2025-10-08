// src/services/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// A SUA CHAVE DE API DO GEMINI ESTÁ INTEGRADA E VALIDADA
const GEMINI_API_KEY = "AIzaSyCjQm5mfz-12OQZqXD2Z1_iU_py93Wp6gM";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Com a biblioteca reinstalada, o nome de modelo 'gemini-pro-vision' é o nosso alvo canónico.
const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

// Função helper para converter a imagem capturada (data URL) para o formato da API.
function dataUrlToGoogleGenerativeAIContent(dataUrl: string) {
  const mimeType = dataUrl.substring(dataUrl.indexOf(":") + 1, dataUrl.indexOf(";"));
  const base64EncodedData = dataUrl.substring(dataUrl.indexOf(",") + 1);
  return { inlineData: { mimeType, data: base64EncodedData } };
}

// A nossa função principal de análise, com diagnóstico de erros detalhado.
export async function analyzeImage(imageDataUrl: string): Promise<string> {
  // Verificação de segurança para garantir que a chave não esteja vazia.
  if (!GEMINI_API_KEY) {
    const errorMsg = "ERRO CRÍTICO: A chave da API do Gemini está em falta no código-fonte.";
    console.error(errorMsg);
    return errorMsg;
  }
  
  try {
    const prompt = "Identifique o objeto ou ser vivo principal nesta imagem. Forneça apenas o nome, o mais específico possível. Seja conciso.";
    const imagePart = dataUrlToGoogleGenerativeAIContent(imageDataUrl);
    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text().trim();
  } catch (error) {
    // Captura e formata o erro detalhado da API para ser exibido na UI.
    console.error("Erro detalhado na análise do Gemini:", error);
    if (error instanceof Error) { 
      return `Erro da API: ${error.message}`; 
    }
    return "Falha no Sequenciamento (Erro Desconhecido)";
  }
}