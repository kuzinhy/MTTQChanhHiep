import { GoogleGenAI } from '@google/genai';
import { getApiUrl, runClientLocalKnowledgeFallback } from './api';

export interface SearchTraceLog {
  timestamp: string;
  query: string;
  methodTried: 'SERVER_PROXY' | 'CLIENT_SDK' | 'OFFLINE_RAG';
  status: 'SUCCESS' | 'FAILED';
  durationMs: number;
  errorDetails?: string;
  networkOnline: boolean;
}

/**
 * Executes a Gemini-powered smart query for the MTTQ Phường Chánh Hiệp app.
 * Automatically tries Vercel rewrite / Server proxy, then Direct Client-Side Gemini SDK (if key provided),
 * and finally falls back to local client-side RAG searching.
 */
export async function queryGeminiWithFallback(
  query: string,
  documentsContext: string,
  knowledgeNotesContext: string,
  messages?: Array<{ sender: 'user' | 'ai'; text: string }>
): Promise<{ text: string; logs: SearchTraceLog[] }> {
  const traces: SearchTraceLog[] = [];
  const startTime = Date.now();
  const networkOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  console.log(`%c[GEMINI SDK INTEGRATION] Starting process for query: "${query}"`, 'color: #3b82f6; font-weight: bold;');
  console.log(`[GEMINI SDK INTEGRATION] Client Network State: ${networkOnline ? 'ONLINE' : 'OFFLINE'}`);

  // 1. TRY SERVER PROXY / REWRITE FIRST
  try {
    const proxyStart = Date.now();
    const apiUrl = getApiUrl('/api/ai/knowledge-search');
    console.log(`[GEMINI SDK INTEGRATION] [Step 1] Attempting fetch to Server/Vercel Proxy: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query.trim(),
        documentsContext,
        knowledgeNotesContext,
        messages: messages || [],
      }),
    });

    const proxyDuration = Date.now() - proxyStart;

    if (!response.ok) {
      throw new Error(`Server returned status ${response.status} (${response.statusText})`);
    }

    const data = await response.json();
    const resultText = data.result || data.answer || data.error;
    
    if (resultText && !data.error) {
      console.log(`%c[GEMINI SDK INTEGRATION] [Step 1 SUCCESS] Query resolved via Server Proxy in ${proxyDuration}ms`, 'color: #10b981; font-weight: bold;');
      traces.push({
        timestamp: new Date().toISOString(),
        query,
        methodTried: 'SERVER_PROXY',
        status: 'SUCCESS',
        durationMs: proxyDuration,
        networkOnline,
      });
      return { text: resultText, logs: traces };
    } else {
      throw new Error(data.error || 'Server response did not contain valid "result" field.');
    }
  } catch (err: any) {
    const proxyDuration = Date.now() - startTime;
    console.warn(`%c[GEMINI SDK INTEGRATION] [Step 1 FAILED] Server Proxy failed: ${err.message}`, 'color: #ef4444; font-weight: bold;');
    
    traces.push({
      timestamp: new Date().toISOString(),
      query,
      methodTried: 'SERVER_PROXY',
      status: 'FAILED',
      durationMs: proxyDuration,
      errorDetails: `Message: ${err.message}. Stack: ${err.stack || 'No stack'}. URL: ${getApiUrl('/api/ai/knowledge-search')}`,
      networkOnline,
    });
  }

  // 2. TRY DIRECT CLIENT-SIDE GEMINI SDK (IF VITE_GEMINI_API_KEY OR GEMINI_API_KEY IS AVAILABLE ON CLIENT)
  const clientApiKey = ((import.meta as any).env?.VITE_GEMINI_API_KEY || (window as any).GEMINI_API_KEY) as string | undefined;
  
  if (clientApiKey && clientApiKey.trim() !== '') {
    const sdkStart = Date.now();
    try {
      console.log('[GEMINI SDK INTEGRATION] [Step 2] Found client-side API key. Initializing GoogleGenAI client-side SDK...');
      const ai = new GoogleGenAI({ apiKey: clientApiKey });

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const sdkDuration = Date.now() - sdkStart;
      const resultText = response.text;

      if (resultText) {
        console.log(`%c[GEMINI SDK INTEGRATION] [Step 2 SUCCESS] Query resolved via direct client-side Gemini SDK in ${sdkDuration}ms`, 'color: #10b981; font-weight: bold;');
        traces.push({
          timestamp: new Date().toISOString(),
          query,
          methodTried: 'CLIENT_SDK',
          status: 'SUCCESS',
          durationMs: sdkDuration,
          networkOnline,
        });
        return { text: resultText, logs: traces };
      } else {
        throw new Error('Gemini SDK generateContent returned empty response.');
      }
    } catch (err: any) {
      const sdkDuration = Date.now() - sdkStart;
      console.warn(`%c[GEMINI SDK INTEGRATION] [Step 2 FAILED] Client-side Gemini SDK failed: ${err.message}`, 'color: #ef4444; font-weight: bold;');
      
      traces.push({
        timestamp: new Date().toISOString(),
        query,
        methodTried: 'CLIENT_SDK',
        status: 'FAILED',
        durationMs: sdkDuration,
        errorDetails: `Client Key Length: ${clientApiKey.length}. Message: ${err.message}. Stack: ${err.stack || 'No stack'}`,
        networkOnline,
      });
    }
  } else {
    console.log('[GEMINI SDK INTEGRATION] [Step 2 SKIPPED] No client-side VITE_GEMINI_API_KEY or window.GEMINI_API_KEY detected.');
  }

  // 3. TRY OFFLINE RAG SEARCH FALLBACK
  const fallbackStart = Date.now();
  console.log('[GEMINI SDK INTEGRATION] [Step 3] Initiating local client-side offline RAG fallback search...');
  
  try {
    const fallbackReply = runClientLocalKnowledgeFallback(query, documentsContext, knowledgeNotesContext);
    const fallbackDuration = Date.now() - fallbackStart;

    console.log(`%c[GEMINI SDK INTEGRATION] [Step 3 SUCCESS] Local client-side fallback completed in ${fallbackDuration}ms`, 'color: #f59e0b; font-weight: bold;');
    traces.push({
      timestamp: new Date().toISOString(),
      query,
      methodTried: 'OFFLINE_RAG',
      status: 'SUCCESS',
      durationMs: fallbackDuration,
      networkOnline,
    });

    return { text: fallbackReply, logs: traces };
  } catch (err: any) {
    const fallbackDuration = Date.now() - fallbackStart;
    console.error('[GEMINI SDK INTEGRATION] Critical: Local offline RAG also failed!', err);
    
    traces.push({
      timestamp: new Date().toISOString(),
      query,
      methodTried: 'OFFLINE_RAG',
      status: 'FAILED',
      durationMs: fallbackDuration,
      errorDetails: err.message,
      networkOnline,
    });

    return {
      text: 'Rất tiếc, đã có sự cố kết nối với hệ thống Trợ lý AI và bộ nhớ đệm ngoại tuyến. Vui lòng gửi Ý kiến Dân sinh trực tiếp qua mục "Ý kiến Dân sinh" để cán bộ tiếp nhận ngay lập tức.',
      logs: traces,
    };
  }
}

/**
 * Universal Gemini helper for administrative analysis, OCR metadata extraction and summarization.
 */
export async function callGeminiPrompt(prompt: string): Promise<string> {
  try {
    const res = await queryGeminiWithFallback(prompt, '', '');
    return res.text;
  } catch (err: any) {
    return `Lỗi phân tích AI: ${err?.message || 'Không thể kết nối'}`;
  }
}

