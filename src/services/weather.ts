// src/services/weather.ts

// A SUA CHAVE DE API DA OPENWEATHERMAP ESTÁ INTEGRADA
const WEATHER_API_KEY = "b85d59fb02ac4ed4764a0a5257f9569a";

// A interface que define a estrutura dos nossos dados de clima.
interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
}

// A função assíncrona, agora com a sintaxe correta e robusta.
export async function getWeatherData(lat: number, lon: number): Promise<WeatherData | null> {
  // A verificação robusta garante que não tentemos usar uma chave inválida ou de marcador.
  if (!WEATHER_API_KEY || WEATHER_API_KEY.includes("SUA_CHAVE")) {
    console.warn("Chave da API de Clima não configurada ou inválida.");
    return null;
  }
  
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=pt_br`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Fornece mais detalhes sobre a falha da API.
      throw new Error(`Falha na resposta da API de clima: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Verificação de segurança para garantir que a resposta da API tenha o formato esperado.
    if (data && data.main && data.weather && data.weather[0]) {
      return {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        description: data.weather[0].description,
      };
    } else {
      throw new Error('Dados de clima recebidos em formato inesperado.');
    }

  } catch (error) {
    console.error("Erro ao obter dados de clima:", error);
    return null;
  }
}