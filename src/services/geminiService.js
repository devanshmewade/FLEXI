// Gemini API Service for Agentic AI Citizen Query Resolution
// Direct browser-safe REST integration with Google Gemini Models

const DEFAULT_MODEL = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

// Retrieve active API key from LocalStorage or Vite Environment Variables
export function getStoredApiKey() {
  if (typeof window !== 'undefined') {
    const localKey = localStorage.getItem('civic_gemini_api_key');
    if (localKey && localKey.trim()) return localKey.trim();
  }
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveStoredApiKey(apiKey) {
  if (typeof window !== 'undefined') {
    if (apiKey && apiKey.trim()) {
      localStorage.setItem('civic_gemini_api_key', apiKey.trim());
    } else {
      localStorage.removeItem('civic_gemini_api_key');
    }
  }
}

export function getStoredModel() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('civic_gemini_model') || DEFAULT_MODEL;
  }
  return DEFAULT_MODEL;
}

export function saveStoredModel(model) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('civic_gemini_model', model);
  }
}

// Test whether the Gemini API key is valid by sending a lightweight ping
export async function testGeminiConnection(apiKey, model = DEFAULT_MODEL) {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: 'No API Key provided.' };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: 'Respond with a single word: READY' }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.error?.message || `HTTP ${response.status} ${response.statusText}`;
      
      // If 2.5-flash isn't available, try fallback
      if (response.status === 404 && model === DEFAULT_MODEL) {
        return testGeminiConnection(apiKey, FALLBACK_MODEL);
      }
      return { success: false, message: msg };
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    return {
      success: true,
      message: `Gemini API connected successfully! (${model})`,
      reply
    };
  } catch (err) {
    return { success: false, message: err.message || 'Network connection failed.' };
  }
}

// Core function to call Gemini with System Instructions and optional JSON mode
export async function callGemini({
  prompt,
  systemInstruction = '',
  temperature = 0.2,
  responseFormat = 'text', // 'text' | 'json'
  apiKey = null,
  model = null
}) {
  const activeKey = (apiKey || getStoredApiKey()).trim();
  const activeModel = model || getStoredModel();

  if (!activeKey) {
    throw new Error('NO_API_KEY');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${activeKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: 2048
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      role: 'system',
      parts: [{ text: systemInstruction }]
    };
  }

  if (responseFormat === 'json') {
    payload.generationConfig.responseMimeType = 'application/json';
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message = errorData.error?.message || `Gemini API Error: HTTP ${res.status}`;
    throw new Error(message);
  }

  const data = await res.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

  if (responseFormat === 'json') {
    try {
      // Strip potential markdown code fences if present
      const cleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return { raw: rawText, parseError: true };
    }
  }

  return rawText;
}
