// src/services/vision.ts
const API_KEY = "AIzaSyCjQm5mfz-12OQZqXD2Z1_iU_py93Wp6gM";
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

// A NOSSA NOVA ESTRUTURA DE RESPOSTA
interface AnalysisResponse {
  name: string;
  category: string;
}

export async function analyzeImage(imageDataUrl: string): Promise<AnalysisResponse | string> {
  if (!API_KEY) return "ERRO: Chave de API não configurada.";
  const base64EncodedData = imageDataUrl.substring(imageDataUrl.indexOf(",") + 1);
  const requestBody = { requests: [ { image: { content: base64EncodedData }, features: [ { type: "OBJECT_LOCALIZATION", maxResults: 1 }, { type: "LABEL_DETECTION", maxResults: 5 } ] } ] };

  try {
    const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(requestBody) });
    if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`); }
    const data = await response.json();
    
    if (data.responses && data.responses[0].labelAnnotations && data.responses[0].labelAnnotations.length > 0) {
      const labels = data.responses[0].labelAnnotations;
      // O nome é o resultado mais confiante. A categoria é o segundo resultado mais confiante.
      const bestMatch = labels[0].description;
      const category = labels.length > 1 ? labels[1].description : 'Desconhecido';
      return { name: bestMatch, category: category };
    } else {
      return "Nenhuma entidade identificada";
    }
  } catch (error) {
    console.error("Erro detalhado na análise do Cloud Vision:", error);
    if (error instanceof Error) { return `Erro da API: ${error.message}`; }
    return "Falha no Sequenciamento";
  }
}