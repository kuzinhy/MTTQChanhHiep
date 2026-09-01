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
  knowledgeNotesContext: string
): Promise<{ text: string; logs: SearchTraceLog[] }> {
  const traces: SearchTraceLog[] = [];
  const startTime = Date.now();
  const networkOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  console.log(`%c[GEMINI SDK INTEGRATION] Starting process for query: "${query}"`, 'color: #3b82f6; font-weight: bold;');
  console.log(`[GEMINI SDK INTEGRATION] Client Network State: ${networkOnline ? 'ONLINE' : 'OFFLINE'}`);

  const prompt = `Bạn là Trợ lý Tra cứu Kho Dữ liệu và Hỏi đáp thông minh cho Ủy ban MTTQ Việt Nam Phường Chánh Hiệp, TP. Thủ Dầu Một.
Lưu ý bảo mật đặc biệt quan trọng: TUYỆT ĐỐI KHÔNG CUNG CẤP, KHÔNG CHIA SẺ, KHÔNG ĐƯA BẤT KỲ ĐƯỜNG LINK LIÊN KẾT GOOGLE DRIVE NÀO TRONG PHẢN HỒI CHO NGƯỜI DÙNG. 

--- KHO VĂN BẢN ĐÃ ĐỒNG BỘ (OFFICIAL DOCUMENTS) ---
${documentsContext || 'Không có dữ liệu văn bản chỉ đạo nào được nạp.'}
 
--- SỔ TAY KIẾN THỨC VÀ CÂU HỎI THƯỜNG GẶP (CURATED KNOWLEDGE NOTES) ---
${knowledgeNotesContext || 'Không có sổ tay kiến thức bổ sung.'}
 
--- CÂU HỎI CỦA NGƯỜI DÙNG / CÁN BỘ ---
"${query}"
 
Quy tắc trả lời bắt buộc để đảm bảo sự thông minh và đúng trọng tâm:
1. TRẢ LỜI CỰC KỲ THÔNG MINH, ĐI THẲNG VÀO TRỌNG TÂM của câu hỏi. Trình bày thông tin ngắn gọn, súc tích và dễ hiểu nhất.
2. TUYỆT ĐỐI KHÔNG TỰ ĐỘNG THÊM phần gợi ý xử lý hay đề xuất các kênh liên hệ/hỗ trợ khác (như gửi Ý kiến Dân sinh, Văn phòng Số, v.v.) trừ khi người dùng chủ động hỏi về chúng.
3. KHÔNG chào hỏi rườm rà hay mở đầu/kết thúc sáo rỗng. Hãy trả lời trực tiếp nội dung chính xác.
4. GHI RÕ NGUỒN trích dẫn (số hiệu văn bản, điều khoản hoặc tiêu đề) nếu thông tin được lấy từ các văn bản cụ thể. Không được cung cấp link Google Drive.
5. Nếu không tìm thấy thông tin phù hợp, chỉ trả lời ngắn gọn: "Hiện tại hệ thống chưa tìm thấy thông tin cụ thể hoặc văn bản khớp với câu hỏi của bạn trong Kho dữ liệu Mặt trận."`;

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
        model: 'gemini-3.5-flash',
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
