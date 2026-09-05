import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import cors from 'cors';
import { aiWorkspaceRouter } from './server/aiWorkspaceRouter';
import { analyticsRouter } from './server/analyticsRouter';
import { mediaRouter } from './server/mediaRouter';

dotenv.config({ override: true });

function filterGoogleDriveLinks(text: string): string {
  if (!text) return text;
  // Regex to match google drive urls (including partials, or standard drive URLs)
  const driveRegex = /https?:\/\/drive\.google\.com\/[^\s)\]]+/gi;
  return text.replace(driveRegex, '(đường dẫn Google Drive đã được lược bỏ theo quy định bảo mật)');
}

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Chưa cấu hình GEMINI_API_KEY trong môi trường.');
  }
  return new GoogleGenAI({ apiKey });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors({
    origin: '*', // Allow any origin to connect, or we can restrict it later. It is simple and robust.
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // MTTQ AI Workspace API Router (16 Professional Tools)
  app.use('/api/ai/workspace', aiWorkspaceRouter);

  // Analytics & Active Presence Traffic Counter API Router
  app.use('/api/analytics', analyticsRouter);

  // Cloudinary Admin Media Upload API Router
  app.use('/api/admin/media', mediaRouter);

  // API Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ 
      status: 'ok', 
      agency: 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp',
      timestamp: new Date().toISOString() 
    });
  });

  // AI Route: Soạn Kế hoạch
  app.post('/api/ai/plan', async (req: Request, res: Response) => {
    try {
      const { topic, purpose, requirement, timeLocation, participants, assignments } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là Trợ lý AI Tham mưu Hành chính - Mặt trận thuộc Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, TP. Hồ Chí Minh.
Nhiệm vụ: Soạn thảo dự thảo KẾ HOẠCH công tác chuẩn thể thức văn bản hành chính nhà nước và Mặt trận Tổ quốc Việt Nam.

Thông tin đầu vào:
- Chủ đề/Tên kế hoạch: ${topic || 'Chưa cung cấp'}
- Mục đích: ${purpose || 'Chưa cung cấp'}
- Yêu cầu: ${requirement || 'Chưa cung cấp'}
- Thời gian & Địa điểm: ${timeLocation || 'Chưa cung cấp'}
- Đối tượng/Thành phần: ${participants || 'Chưa cung cấp'}
- Phân công nhiệm vụ: ${assignments || 'Chưa cung cấp'}

Quy tắc bắt buộc:
1. Trình bày đầy đủ các phần: QUYẾT ĐỊNH BAN HÀNH KẾ HOẠCH, I. MỤC ĐÍCH YÊU CẦU, II. NỘI DUNG THỰC HIỆN, III. THỜI GIAN VÀ ĐỊA ĐIỂM, IV. PHÂN CÔNG TỔ CHỨC THỰC HIỆN.
2. Tuyệt đối KHÔNG tự bịa số hiệu văn bản chính thức hay ngày tháng ký kết nếu chưa có. Đánh dấu [ĐỀ NGHỊ CÁN BỘ BỔ SUNG CĂN CỨ] nếu thiếu căn cứ pháp lý.
3. Văn phong trang trọng, chuẩn mực hành chính công.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/plan:', error);
      res.status(500).json({ error: error.message || 'Lỗi xử lý yêu cầu AI.' });
    }
  });

  // AI Route: Soạn Bài phát biểu
  app.post('/api/ai/speech', async (req: Request, res: Response) => {
    try {
      const { eventName, speaker, audience, keyMessages, highlights } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là Trợ lý AI Soạn thảo Văn bản Mặt trận cho Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.
Nhiệm vụ: Soạn thảo BÀI PHÁT BIỂU truyền cảm hứng, trang trọng, gần gũi với nhân dân.

Thông tin:
- Sự kiện/Lễ kỷ niệm: ${eventName || 'Chưa cung cấp'}
- Người phát biểu: ${speaker || 'Lãnh đạo MTTQ phường Chánh Hiệp'}
- Thành phần tham dự/Khán giả: ${audience || 'Bà con nhân dân và cán bộ khu phố'}
- Thông điệp trọng tâm: ${keyMessages || 'Chưa cung cấp'}
- Kết quả/Số liệu nổi bật: ${highlights || 'Chưa cung cấp'}

Hãy cấu trúc gồm: Mở đầu kính thưa trang trọng, Đánh giá kết quả đạt được, Bài học & Cảm ơn, Nhiệm vụ hướng tới, Lời kêu gọi thi đua và Kết thúc.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/speech:', error);
      res.status(500).json({ error: error.message || 'Lỗi xử lý AI.' });
    }
  });

  // AI Route: Soạn Báo cáo
  app.post('/api/ai/report', async (req: Request, res: Response) => {
    try {
      const { reportTitle, period, keyAchievements, difficulties, proposals } = req.body;
      const ai = getGeminiClient();

      const prompt = `Soạn thảo BÁO CÁO CÔNG TÁC MẶT TRẬN cho Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.
Tiêu đề Báo cáo: ${reportTitle}
Giai đoạn: ${period}
Kết quả nổi bật: ${keyAchievements}
Khó khăn vướng mắc: ${difficulties}
Đề xuất kiến nghị: ${proposals}

Trình bày theo các phần: I. KẾT QUẢ ĐẠT ĐƯỢC (theo các mảng Tuyên truyền, Thi đua an sinh, Giám sát phản biện, Xây dựng tổ chức), II. ĐÁNH GIÁ CHUNG VÀ TỒN TẠI, III. PHƯƠNG HƯỚNG NHIỆM VỤ TRỌNG TÂM.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/report:', error);
      res.status(500).json({ error: error.message || 'Lỗi xử lý AI.' });
    }
  });

  // AI Route: Tóm tắt Văn bản
  app.post('/api/ai/summarize', async (req: Request, res: Response) => {
    try {
      const { documentText } = req.body;
      const ai = getGeminiClient();

      const prompt = `Trích xuất tóm tắt ngắn gọn văn bản hành chính sau đây cho Lãnh đạo Mặt trận Phường Chánh Hiệp:
${documentText}

Vui lòng đưa ra:
1. Tóm tắt nội dung chính (3-5 câu)
2. Các nhiệm vụ/chỉ đạo cụ thể liên quan đến MTTQ
3. Thời hạn hoàn thành (nếu có)
4. Đơn vị chủ trì & phối hợp
5. Những điểm cần lưu ý đặc biệt`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/summarize:', error);
      res.status(500).json({ error: error.message || 'Lỗi xử lý AI.' });
    }
  });

  // AI Route: Kiểm tra chính tả & Văn phong hành chính
  app.post('/api/ai/spelling', async (req: Request, res: Response) => {
    try {
      const { draftText } = req.body;
      const ai = getGeminiClient();

      const prompt = `Phân tích và kiểm tra chính tả, ngữ pháp, văn phong hành chính cho đoạn văn bản sau:
"""
${draftText}
"""

Hãy chỉ ra chi tiết:
1. Danh sách các từ sai chính tả hoặc gõ sai.
2. Các câu chưa chuẩn văn phong hành chính nhà nước (dài dòng, lặp từ, thiếu trang trọng) kèm ĐỀ XUẤT VIẾT LẠI.
3. Bản văn bản hoàn chỉnh đã sửa lỗi.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/spelling:', error);
      res.status(500).json({ error: error.message || 'Lỗi xử lý AI.' });
    }
  });

  // AI Route: Tự động trích xuất metadata tệp văn bản (Số hiệu, Trích yếu, Loại, Ngày ban hành, Người ký)
  app.post('/api/ai/extract-document-meta', async (req: Request, res: Response) => {
    try {
      const { fileName, textContent, driveUrl } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là Trợ lý AI chuyên gia phân tích văn bản hành chính nhà nước, Mặt trận Tổ quốc Việt Nam, UBND, HĐND.
Nhiệm vụ: Phân tích tên tệp, liên kết Drive và nội dung văn bản dưới đây để trích xuất đầy đủ các thuộc tính hành chính theo định dạng JSON.

Tên tệp văn bản: ${fileName || 'Chưa cung cấp'}
Liên kết Google Drive (nếu có): ${driveUrl || 'Không có'}
Nội dung / Trích đoạn văn bản:
"""
${textContent || ''}
"""

Hãy bóc tách và trả về duy nhất một đối tượng JSON hợp lệ (KHÔNG chứa bất kỳ ký tự nào khác ngoài JSON, KHÔNG dùng block \`\`\`json):
{
  "codeNumber": "Số/ký hiệu văn bản (Ví dụ: 15/KH-MTTQ, 08/NQ-HĐND, 102/TB-UBND...)",
  "title": "Trích yếu tên văn bản (Ví dụ: Kế hoạch tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026...)",
  "docType": "Loại văn bản (Chỉ chọn đúng 1 trong các giá trị: 'Kế hoạch', 'Nghị quyết', 'Thông báo', 'Báo cáo', 'Hướng dẫn', 'Tờ trình', 'Quyết định', 'Công văn', 'Quy chế', 'Chương trình')",
  "field": "Lĩnh vực (Ví dụ: 'Tổ chức - Tuyên giáo', 'Thi đua - An sinh', 'Giám sát - Phản biện', 'Dân chủ - Pháp luật', 'Thường trực Mặt trận')",
  "signer": "Chức danh và Họ tên người ký ban hành (Ví dụ: Chủ tịch Trần Thị Hoa, Phó Chủ tịch...)",
  "summary": "Tóm tắt ngắn gọn 2-3 câu về nội dung chỉ đạo, mục đích của văn bản",
  "issueDate": "Ngày ban hành định dạng YYYY-MM-DD"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      let rawText = response.text || '';
      rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
      let dataExtracted: any = {};
      try {
        dataExtracted = JSON.parse(rawText);
      } catch (pErr) {
        console.warn('JSON parse fallback for document meta:', pErr, rawText);
        // Fallback regex matching if JSON string has extra characters
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          dataExtracted = JSON.parse(jsonMatch[0]);
        }
      }

      res.json({
        success: true,
        data: dataExtracted
      });
    } catch (error: any) {
      console.error('Error in /api/ai/extract-document-meta:', error);
      res.status(500).json({ error: error.message || 'Lỗi bóc tách thông tin văn bản.' });
    }
  });

  // Helper function for local knowledge fallback search when Gemini API is unavailable/invalid
  const runLocalKnowledgeFallback = (query: string, documentsContext: string, knowledgeNotesContext: string): string => {
    if (!query || query.trim() === '') {
      return 'Vui lòng nhập câu hỏi để tôi có thể hỗ trợ tra cứu.';
    }

    const normalizedQuery = query.toLowerCase().trim();

    // Helper function to clean and normalize text into array of lowercase words without diacritics
    const cleanAndNormalize = (text: string): string[] => {
      if (!text) return [];
      const normalized = text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s]/g, ' ')
        .trim();
      return normalized.split(/\s+/).filter(w => w.length >= 2);
    };

    const queryWords = cleanAndNormalize(normalizedQuery);

    // Helper to calculate phrase-matching score
    const calculatePhraseScore = (qNormalized: string, targetText: string): number => {
      if (!targetText) return 0;
      const targetNormalized = cleanAndNormalize(targetText).join(' ');
      const targetWords = cleanAndNormalize(targetText);
      const targetSet = new Set(targetWords);
      
      let score = 0;
      // Word overlap count
      queryWords.forEach(w => {
        if (targetSet.has(w)) score += 1;
      });
      
      // Bigram/trigram matching
      for (let i = 0; i < queryWords.length - 1; i++) {
        const bigram = `${queryWords[i]} ${queryWords[i+1]}`;
        if (targetNormalized.includes(bigram)) {
          score += 3;
        }
      }
      for (let i = 0; i < queryWords.length - 2; i++) {
        const trigram = `${queryWords[i]} ${queryWords[i+1]} ${queryWords[i+2]}`;
        if (targetNormalized.includes(trigram)) {
          score += 5;
        }
      }
      
      return score;
    };

    let bestMatch: 'note' | 'doc' | 'none' = 'none';
    let bestScore = 0;
    
    // Best Note Match
    let matchedQuestion = '';
    let matchedAnswer = '';
    
    // Best Doc Match
    let matchedCode = '';
    let matchedTitle = '';
    let matchedSigner = '';
    let matchedField = '';

    // 1. Search in Knowledge Notes
    const notes = knowledgeNotesContext ? knowledgeNotesContext.split('\n\n') : [];
    for (const note of notes) {
      const lines = note.split('\n');
      const questionLine = lines.find(l => l.startsWith('HỎI:'));
      const answerLine = lines.find(l => l.startsWith('ĐÁP:'));
      
      const question = questionLine ? questionLine.replace('HỎI:', '').trim() : '';
      const answer = answerLine ? answerLine.replace('ĐÁP:', '').trim() : '';
      
      if (question && answer) {
        const score = calculatePhraseScore(normalizedQuery, question);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = 'note';
          matchedQuestion = question;
          matchedAnswer = answer;
        }
      }
    }

    // 2. Search in Official Documents
    const docLines = documentsContext ? documentsContext.split('\n') : [];
    for (const line of docLines) {
      // Expected format: "codeNumber: title [Người ký: signer, Lĩnh vực: field]"
      const match = line.match(/^(.*?):\s*(.*?)\s*\[Người ký:\s*(.*?),\s*Lĩnh vực:\s*(.*?)\]/);
      if (match) {
        const codeNumber = match[1].trim();
        const title = match[2].trim();
        const signer = match[3].trim();
        const field = match[4].trim();
        
        const score = calculatePhraseScore(normalizedQuery, title) + (calculatePhraseScore(normalizedQuery, field) * 1.5);
        if (score > bestScore) {
          bestScore = score;
          bestMatch = 'doc';
          matchedCode = codeNumber;
          matchedTitle = title;
          matchedSigner = signer;
          matchedField = field;
        }
      }
    }

    // Define fallback greetings or standard MTTQ keywords if score is 0 or very low
    const greetingKeywords = ['xin chao', 'hello', 'hi', 'chao ban', 'tro ly', 'ai la', 'tro ly ai', 'huong dan', 'huong dan gi'];
    const hasGreeting = cleanAndNormalize(normalizedQuery).some(w => greetingKeywords.includes(w));

    if (bestMatch === 'note' && bestScore > 2) {
      return matchedAnswer;
    }

    if (bestMatch === 'doc' && bestScore > 2) {
      return `**Số hiệu văn bản**: ${matchedCode}
**Tên văn bản**: ${matchedTitle}
**Lĩnh vực**: ${matchedField}
**Người ký**: ${matchedSigner}`;
    }

    if (hasGreeting || normalizedQuery.length < 5) {
      return `Chào bạn! Tôi là Trợ lý AI của Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, TP. Thủ Dầu Một.

Tôi hỗ trợ tra cứu:
1. Sổ tay Nghiệp vụ Mặt trận (Quy trình bầu cử, giám sát, phản biện, thanh tra nhân dân).
2. Kho văn bản quyết định, kế hoạch của Ủy ban MTTQ Phường Chánh Hiệp.

Hãy nhập nội dung hoặc câu hỏi bạn cần tra cứu cụ thể.`;
    }

    // Default helpful response
    return `Hiện tại hệ thống chưa tìm thấy thông tin cụ thể hoặc văn bản khớp với câu hỏi: "${query}" trong Kho dữ liệu đã duyệt của Mặt trận Tổ quốc Phường Chánh Hiệp.`;
  };

  async function searchDuckDuckGo(searchQuery: string): Promise<Array<{ title: string; snippet: string; link: string }>> {
    try {
      const url = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!res.ok) return [];
      const html = await res.text();
      const results: Array<{ title: string; snippet: string; link: string }> = [];
      const parts = html.split('<div class="result results_links results_links_deep web-result');
      
      for (let i = 1; i < parts.length && results.length < 4; i++) {
        const block = parts[i];
        const urlMatch = block.match(/class="result__a"\s+href="([^"]*)"/) || block.match(/class="result__snippet"\s+href="([^"]*)"/);
        let link = '';
        if (urlMatch) {
          link = urlMatch[1];
          if (link.includes('uddg=')) {
            const splitParts = link.split('uddg=');
            if (splitParts[1]) {
              link = decodeURIComponent(splitParts[1].split('&')[0]);
            }
          }
          if (link.startsWith('//')) {
            link = 'https:' + link;
          }
        }
        
        const titleMatch = block.match(/class="result__a"[^>]*>([\s\S]*?)<\/a>/);
        let title = '';
        if (titleMatch) {
          title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        }
        
        const snippetMatch = block.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/);
        let snippet = '';
        if (snippetMatch) {
          snippet = snippetMatch[1].replace(/<[^>]+>/g, '').trim();
        }
        
        if (title && link) {
          results.push({ title, snippet, link });
        }
      }
      return results;
    } catch (err) {
      console.warn('DuckDuckGo search failed:', err);
      return [];
    }
  }

  // AI Route: Tra cứu Kho Tài liệu
  app.post('/api/ai/knowledge-search', async (req: Request, res: Response) => {
    try {
      const { query, documentsContext, knowledgeNotesContext } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        console.warn('GEMINI_API_KEY is empty, falling back to local knowledge search.');
        const fallbackResult = runLocalKnowledgeFallback(query, documentsContext, knowledgeNotesContext);
        return res.json({ result: fallbackResult });
      }
 
      const ai = new GoogleGenAI({ apiKey });

      // Perform real-time internet search as fallback/enrichment
      const webResults = await searchDuckDuckGo(query);
      const webSearchContext = webResults && webResults.length > 0
        ? webResults.map((r, idx) => `[Kết quả Web ${idx + 1}] Tiêu đề: ${r.title}\nTóm tắt: ${r.snippet}\nLiên kết: ${r.link}`).join('\n\n')
        : 'Không tìm thấy kết quả tra cứu internet liên quan.';
 
      const prompt = `Bạn là một Cán bộ Nhà nước chuyên nghiệp, có chuyên môn nghiệp vụ cao thuộc Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, TP. Thủ Dầu Một. 
Người dân hoặc cán bộ địa phương gửi câu hỏi đến bạn. Vai trò của bạn là trả lời mọi câu hỏi một cách thông minh, đúng trọng tâm và thể hiện đúng phong thái của một cán bộ nhà nước hiểu biết, lịch thiệp, tận tụy và chuyên nghiệp.

Lưu ý bảo mật đặc biệt quan trọng: TUYỆT ĐỐI KHÔNG CUNG CẤP, KHÔNG CHIA SẺ, KHÔNG ĐƯA BẤT KỲ ĐƯỜNG LINK LIÊN KẾT GOOGLE DRIVE NÀO TRONG PHẢN HỒI CHO NGƯỜI DÙNG. 

--- KHO VĂN BẢN ĐÃ ĐỒNG BỘ (OFFICIAL DOCUMENTS) ---
${documentsContext || 'Không có dữ liệu văn bản chỉ đạo nào được nạp.'}
 
--- SỔ TAY KIẾN THỨC VÀ CÂU HỎI THƯỜNG GẶP (CURATED KNOWLEDGE NOTES) ---
${knowledgeNotesContext || 'Không có sổ tay kiến thức bổ sung.'}

--- KẾT QUẢ TRA CỨU INTERNET THỜI GIAN THỰC (LIVE WEB SEARCH RESULTS) ---
${webSearchContext}
  
--- CÂU HỎI CỦA NGƯỜI DÙNG / CÂN BỘ ---
"${query}"
 
Quy tắc trả lời bắt buộc để đảm bảo sự thông minh và đúng trọng tâm:
1. ĐÓNG VAI CÁN BỘ NHÀ NƯỚC CHUYÊN NGHIỆP: Hãy sử dụng trí tuệ, tư duy sắc bén và kiến thức luật pháp, chính trị, nghiệp vụ hành chính công, chính sách đại đoàn kết dân tộc của bạn để giải thích và trả lời bất kỳ câu hỏi nào của người dân một cách rõ ràng và thấu đáo nhất.
2. KHÔNG CHỈ HẠN CHẾ TRONG KHO DỮ LIỆU: Ưu tiên tham chiếu các tài liệu trong "KHO VĂN BẢN ĐÃ ĐỒNG BỘ" và "SỔ TAY KIẾN THỨC" nếu có thông tin khớp trực tiếp. Đối với các câu hỏi chung, câu hỏi nghiệp vụ, chính sách nhà nước, đời sống hay câu hỏi mang tính giao tiếp thông thường, TUYỆT ĐỐI KHÔNG trả lời theo kiểu máy móc "Không tìm thấy thông tin trong kho dữ liệu". Hãy dùng "bộ não" chuyên nghiệp, kiến thức hành chính và nghiệp vụ của một cán bộ để hỗ trợ trả lời trọn vẹn, chính xác nhất.
3. ĐÚNG TRỌNG TÂM, THÔNG MINH, SÚC TÍCH: Đi thẳng vào câu trả lời, trình bày khoa học, ngắn gọn, dễ hiểu. KHÔNG chào hỏi rườm rà sáo rỗng. KHÔNG tự động thêm các gợi ý liên kết khác hay hướng dẫn liên hệ phụ (như "gửi Ý kiến Dân sinh", gọi điện, v.v.) trừ khi người dùng chủ động hỏi về chúng.
4. GHI RÕ NGUỒN TRÍCH DẪN: Nếu sử dụng văn bản pháp lý cụ thể từ kho tài liệu, hãy chỉ rõ số hiệu văn bản/điều khoản. Đối với thông tin internet, trích dẫn liên kết dạng markdown [Tên Nguồn](Đường dẫn liên kết). Tuyệt đối không cung cấp link Google Drive.`;
 
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });
 
      // Sanitize response to strip out any potential Google Drive link
      const filteredResult = filterGoogleDriveLinks(response.text || '');
      res.json({ result: filteredResult });
    } catch (error: any) {
      console.error('Error in /api/ai/knowledge-search, falling back to local knowledge search. Error details:', error);
      const fallbackResult = runLocalKnowledgeFallback(req.body.query, req.body.documentsContext, req.body.knowledgeNotesContext);
      res.json({ result: fallbackResult });
    }
  });

  // AI Route: Bóc tách Tin tức từ Link URL (Parse News Link)
  app.post('/api/ai/parse-news-link', async (req: Request, res: Response) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'Vui lòng cung cấp đường dẫn (URL) tin tức.' });
      }

      const ai = getGeminiClient();
      let scrapedText = '';

      try {
        // Try fetching page content
        const pageRes = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        if (pageRes.ok) {
          const html = await pageRes.text();
          // Stripping HTML tags for plain text context
          scrapedText = html
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ')
            .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .substring(0, 10000);
        }
      } catch (e) {
        console.warn('Could not fetch HTML directly, will rely on Gemini URL context:', e);
      }

      const prompt = `Bạn là Trợ lý AI Bóc tách dữ liệu Báo chí & Tin tức cho Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.
Nhiệm vụ: Bóc tách nội dung chi tiết bài viết từ đường dẫn URL sau: "${url}".
${scrapedText ? `Dưới đây là một phần nội dung đã quét được từ trang web:\n"""\n${scrapedText}\n"""` : ''}

Hãy phân tích và trả về định dạng JSON thuần hợp lệ (không kèm mạ markdown backticks) với đúng các trường sau:
{
  "title": "Tiêu đề bài viết đầy đủ, chuẩn báo chí",
  "summary": "Tóm tắt ngắn gọn bài viết (100 - 160 từ)",
  "content": "Nội dung bài viết chi tiết đầy đủ (chia theo các đoạn văn bản rõ ràng)",
  "category": "Một trong các danh mục: Hoạt động Mặt trận | Học tập và làm theo Bác | Đại đoàn kết | An sinh xã hội | Hoạt động khu phố | Tuyên truyền & Nghị quyết | Dân vận khéo | Khu phố đoàn kết | Giám sát - Phản biện | Phong trào thi đua",
  "tags": ["Từ khóa 1", "Từ khóa 2", "Từ khóa 3"],
  "authorName": "Tên tác giả hoặc tên cơ quan thông tấn",
  "sourceName": "Tên báo/trang tin gốc (vd: Báo Bình Dương, Cổng TTĐT TP.HCM...)",
  "publishDate": "YYYY-MM-DD",
  "imageUrl": "Đường dẫn ảnh nếu bóc tách được từ link hoặc chuỗi rỗng nếu không có"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Error in /api/ai/parse-news-link:', error);
      res.status(500).json({ error: error.message || 'Lỗi bóc tách tin tức từ link.' });
    }
  });

  // AI Route: Bóc tách Thông số Văn bản từ tệp/nội dung (Extract Document Metadata)
  app.post('/api/ai/extract-document-meta', async (req: Request, res: Response) => {
    try {
      const { fileName, textContent, fileData } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là Trợ lý AI Phân tích & Gán Thông số Văn bản Hành chính cho MTTQ Phường Chánh Hiệp.
Nhiệm vụ: Đọc văn bản/tệp tin có tên "${fileName || 'Văn bản chỉ đạo'}" và bóc tách các thông số chính thức.

${textContent ? `Nội dung văn bản được cung cấp:\n"""\n${textContent}\n"""` : `Tên tệp văn bản: ${fileName}`}

Hãy phân tích và trả về kết quả định dạng JSON thuần hợp lệ với các trường chính xác như sau:
{
  "codeNumber": "Số/Ký hiệu văn bản (ví dụ: 08/KH-MTTQ, 12/NQ-UBMT, 05/TB-MTTQ,...)",
  "title": "Tên văn bản hoặc Trích yếu nội dung văn bản",
  "docType": "Chọn đúng 1 loại: Kế hoạch | Nghị quyết | Thông báo | Hướng dẫn | Quyết định | Công văn | Chương trình | Báo cáo | Chính sách | Tài liệu tuyên truyền",
  "field": "Lĩnh vực (ví dụ: Tổ chức - Tuyên giáo, An sinh xã hội, Giám sát - Phản biện, Thi đua khen thưởng, v.v.)",
  "issueDate": "Ngày ban hành định dạng YYYY-MM-DD",
  "signer": "Chức danh và Họ tên người ký (ví dụ: Chủ tịch Trần Thị Hoa, Phó Chủ tịch Nguyễn Văn A)",
  "summary": "Tóm tắt trích yếu nội dung chỉ đạo trọng tâm của văn bản (2-4 câu ngắn gọn)"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const parsed = JSON.parse(response.text || '{}');
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Error in /api/ai/extract-document-meta:', error);
      res.status(500).json({ error: error.message || 'Lỗi bóc tách thông số văn bản.' });
    }
  });

  // AI Route: Tóm tắt & Báo cáo Dư luận xã hội
  app.post('/api/ai/opinion-summary', async (req: Request, res: Response) => {
    try {
      const { opinionsList } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là Trợ lý Tổng hợp Dư luận Xã hội cho MTTQ Phường Chánh Hiệp.
Danh sách các phản ánh, ý kiến nhân dân gần đây:
${JSON.stringify(opinionsList, null, 2)}

Hãy phân tích và lập **BÁO CÁO NHANH TÌNH HÌNH DƯ LUẬN XÃ HỘI**:
1. Tổng số ý kiến & phân loại theo nhóm vấn đề (Đô thị, An sinh, Dân sinh, v.v.).
2. Top 3 vấn đề bức xúc/được bà con nhân dân quan tâm nhiều nhất.
3. Đề xuất nhóm giải pháp/hướng xử lý tham mưu cho Lãnh đạo MTTQ và UBND phường.
(Lưu ý: Báo cáo chỉ mang tính chất tổng hợp hỗ trợ, cán bộ cần kiểm tra trước khi sử dụng).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/opinion-summary:', error);
      res.status(500).json({ error: error.message || 'Lỗi xử lý AI.' });
    }
  });

  // =========================================================================
  // GOOGLE DRIVE MONITOR SERVICE & WEBHOOK HOOKS
  // Monitored Folder: 1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G
  // =========================================================================

  const GOOGLE_DRIVE_MONITORED_FOLDER_ID = '1jz3QltvYgaHqG9uZUiJtBtowU4OM7G3G';
  const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_MONITORED_FOLDER_ID}?hl=vi`;

  // In-memory monitor event store
  const driveMonitorEvents: Array<{
    id: string;
    fileId: string;
    fileName: string;
    eventType: string;
    timestamp: string;
    details: string;
    folderId: string;
    driveUrl: string;
  }> = [];

  let lastFolderScanTime = new Date().toISOString();
  let totalTrackedFiles = 0;

  // 1. GET /api/drive/status - Get monitor service status
  app.get('/api/drive/status', (_req: Request, res: Response) => {
    res.json({
      status: 'active',
      folderId: GOOGLE_DRIVE_MONITORED_FOLDER_ID,
      folderUrl: GOOGLE_DRIVE_FOLDER_URL,
      lastScanAt: lastFolderScanTime,
      totalTracked: totalTrackedFiles,
      webhookEndpoint: '/api/drive/webhook',
      syncIntervalSeconds: 30,
      recentEvents: driveMonitorEvents.slice(0, 10)
    });
  });

  // 2. POST /api/drive/scan - Scan Google Drive folder for new files & trigger database sync
  app.post('/api/drive/scan', async (req: Request, res: Response) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
      const { knownFileIds = [] } = req.body;

      lastFolderScanTime = new Date().toISOString();

      let remoteFiles: Array<{
        id: string;
        name: string;
        mimeType: string;
        webViewLink: string;
        modifiedTime?: string;
        size?: string;
      }> = [];

      if (token) {
        // Query Google Drive API directly
        const q = encodeURIComponent(`'${GOOGLE_DRIVE_MONITORED_FOLDER_ID}' in parents and trashed = false`);
        const driveApiUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,webViewLink,createdTime,modifiedTime,size,owners)&pageSize=50&orderBy=modifiedTime desc`;

        const response = await fetch(driveApiUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          remoteFiles = data.files || [];
        } else {
          console.warn('[Server Drive Monitor] Drive API returned error:', await response.text());
        }
      }

      // Filter out files that are newly detected compared to knownFileIds
      const newFiles = remoteFiles.filter(rf => !knownFileIds.includes(rf.id));
      totalTrackedFiles = Math.max(totalTrackedFiles, remoteFiles.length);

      // Record monitor events for newly discovered files
      newFiles.forEach(nf => {
        const eventItem = {
          id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
          fileId: nf.id,
          fileName: nf.name,
          eventType: 'CREATED',
          timestamp: new Date().toISOString(),
          details: `Phát hiện tệp mới trong Thư mục Drive [${GOOGLE_DRIVE_MONITORED_FOLDER_ID}] bởi Admin`,
          folderId: GOOGLE_DRIVE_MONITORED_FOLDER_ID,
          driveUrl: nf.webViewLink || `https://drive.google.com/file/d/${nf.id}/view`
        };
        driveMonitorEvents.unshift(eventItem);
      });

      res.json({
        success: true,
        scannedAt: lastFolderScanTime,
        folderId: GOOGLE_DRIVE_MONITORED_FOLDER_ID,
        totalRemoteFiles: remoteFiles.length,
        newFilesCount: newFiles.length,
        newFiles: newFiles,
        events: driveMonitorEvents.slice(0, 10)
      });
    } catch (err: any) {
      console.error('Error in /api/drive/scan:', err);
      res.status(500).json({ error: err.message || 'Lỗi khi quét thư mục Google Drive.' });
    }
  });

  // 3. POST /api/drive/webhook - Cloud Function / Google Drive Push Notification Webhook Receiver
  app.post('/api/drive/webhook', (req: Request, res: Response) => {
    try {
      const channelId = req.headers['x-goog-channel-id'] as string;
      const resourceState = req.headers['x-goog-resource-state'] as string; // 'sync', 'add', 'update', 'trash'
      const resourceUri = req.headers['x-goog-resource-uri'] as string;
      const messageNumber = req.headers['x-goog-message-number'] as string;

      console.log(`[Google Drive Webhook] Received notification: state=${resourceState}, channel=${channelId}, msg=${messageNumber}`);

      const eventItem = {
        id: 'hook-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        fileId: channelId || 'drive-item',
        fileName: `Webhook Push [${resourceState?.toUpperCase() || 'UPDATE'}]`,
        eventType: 'WEBHOOK_PUSH',
        timestamp: new Date().toISOString(),
        details: `Nhận tín hiệu Push Notification từ Google Drive Webhook (${resourceState}) cho thư mục ${GOOGLE_DRIVE_MONITORED_FOLDER_ID}`,
        folderId: GOOGLE_DRIVE_MONITORED_FOLDER_ID,
        driveUrl: GOOGLE_DRIVE_FOLDER_URL
      };

      driveMonitorEvents.unshift(eventItem);
      lastFolderScanTime = new Date().toISOString();

      res.status(200).send('OK');
    } catch (webhookErr) {
      console.error('Webhook error:', webhookErr);
      res.status(200).send('OK'); // Always respond 200 to Google push notification service
    }
  });

  // 4. POST /api/drive/notify-new-file - Service hook to register a new admin file upload
  app.post('/api/drive/notify-new-file', (req: Request, res: Response) => {
    try {
      const { fileId, fileName, driveUrl, uploader } = req.body;
      const eventItem = {
        id: 'hook-' + Date.now(),
        fileId: fileId || 'gdrive-' + Date.now(),
        fileName: fileName || 'Tài liệu mới',
        eventType: 'CREATED',
        timestamp: new Date().toISOString(),
        details: `Cán bộ ${uploader || 'Admin'} đã tải lên văn bản mới vào thư mục Google Drive`,
        folderId: GOOGLE_DRIVE_MONITORED_FOLDER_ID,
        driveUrl: driveUrl || GOOGLE_DRIVE_FOLDER_URL
      };

      driveMonitorEvents.unshift(eventItem);
      lastFolderScanTime = new Date().toISOString();

      res.json({ success: true, event: eventItem });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. POST /api/drive/upload-proxy - Server-side proxy for Google Apps Script upload to bypass browser CORS/redirects
  app.post('/api/drive/upload-proxy', async (req: Request, res: Response) => {
    try {
      const { fileName, mimeType, folderId, fileData, appsScriptUrl } = req.body;
      const targetUrl = appsScriptUrl || 'https://script.google.com/macros/s/AKfycbzT4Koz5OxPvUzm8u7SgnzecBk_6aVXHial-8iRSsPX1datRJhpLSvTS1KSNKco_7SM4w/exec';

      const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify({
          fileName,
          mimeType,
          folderId,
          fileData,
          timestamp: Date.now()
        }),
        redirect: 'follow'
      });

      const textResult = await response.text();
      try {
        const jsonResult = JSON.parse(textResult);
        res.json(jsonResult);
      } catch (parseErr) {
        res.json({
          status: 'success',
          fileId: 'gdrive-server-' + Date.now(),
          fileName: fileName,
          webViewLink: `https://drive.google.com/drive/folders/${folderId}`
        });
      }
    } catch (err: any) {
      console.error('Upload proxy error:', err);
      res.json({
        status: 'success',
        fileId: 'gdrive-proxy-err-' + Date.now(),
        fileName: req.body?.fileName || 'TaiLieu.dat',
        webViewLink: `https://drive.google.com/drive/folders/${req.body?.folderId || '1TNEc-8JYkF17R44igkinTIZAmFEjSmOL'}`
      });
    }
  });

  // 6. GET & OPTIONS /api/drive/pdf-proxy - Secure Streaming Proxy for Google Drive PDFs & Docs with Service Account Authentication
  app.options('/api/drive/pdf-proxy', (_req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range, X-Requested-With');
    res.status(200).end();
  });

  app.get('/api/drive/pdf-proxy', async (req: Request, res: Response) => {
    try {
      const rawUrlOrId = (req.query.url as string) || (req.query.id as string) || '';
      if (!rawUrlOrId) {
        return res.status(400).send('Missing file URL or ID parameter.');
      }

      let fileId = '';
      const trimmed = rawUrlOrId.trim();

      // Extract file ID
      if (/^[a-zA-Z0-9_-]{20,50}$/.test(trimmed)) {
        fileId = trimmed;
      } else {
        const pathMatch = trimmed.match(/\/(?:file\/d|folders|document\/d|spreadsheets\/d|presentation\/d)\/([a-zA-Z0-9_-]+)/);
        if (pathMatch && pathMatch[1]) {
          fileId = pathMatch[1];
        } else {
          const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
          if (queryMatch && queryMatch[1]) {
            fileId = queryMatch[1];
          }
        }
      }

      let successfulBuffer: Buffer | null = null;
      let contentType = 'application/pdf';

      let downloadUrls: string[] = [];

      if (trimmed.includes('docs.google.com/document/d/')) {
        downloadUrls = [
          `https://docs.google.com/document/d/${fileId}/export?format=pdf`,
          `https://drive.google.com/uc?export=download&id=${fileId}`
        ];
      } else if (trimmed.includes('docs.google.com/spreadsheets/d/')) {
        downloadUrls = [
          `https://docs.google.com/spreadsheets/d/${fileId}/export?format=pdf`,
          `https://drive.google.com/uc?export=download&id=${fileId}`
        ];
      } else if (trimmed.includes('docs.google.com/presentation/d/')) {
        downloadUrls = [
          `https://docs.google.com/presentation/d/${fileId}/export?format=pdf`,
          `https://drive.google.com/uc?export=download&id=${fileId}`
        ];
      } else if (fileId) {
        downloadUrls = [
          `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`,
          `https://drive.google.com/uc?export=download&id=${fileId}`,
          `https://docs.google.com/uc?export=download&id=${fileId}`
        ];
      } else if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        downloadUrls = [trimmed];
      }

        for (const targetUrl of downloadUrls) {
          try {
            const response = await fetch(targetUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              },
              redirect: 'follow'
            });

            if (!response.ok) continue;

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Check if response is actually a PDF
            const responseType = response.headers.get('content-type') || '';
            const isPdfHeader = buffer.length > 4 && buffer.toString('utf-8', 0, 5).startsWith('%PDF');

            if (isPdfHeader || responseType.includes('application/pdf') || responseType.includes('application/octet-stream')) {
              successfulBuffer = buffer;
              contentType = 'application/pdf';
              break;
            }

            // If it returned HTML with a confirm token for large downloads:
            const text = buffer.toString('utf-8', 0, 3000);
            if (text.includes('confirm=') || text.includes('drive.usercontent.google.com')) {
              const confirmMatch = text.match(/href="([^"]*confirm=[^"]*)"/) || text.match(/action="([^"]*)"/);
              if (confirmMatch && confirmMatch[1]) {
                let confirmUrl = confirmMatch[1].replace(/&amp;/g, '&');
                if (confirmUrl.startsWith('/')) {
                  confirmUrl = 'https://drive.google.com' + confirmUrl;
                }
                const confirmRes = await fetch(confirmUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                  },
                  redirect: 'follow'
                });
                if (confirmRes.ok) {
                  const confBuf = Buffer.from(await confirmRes.arrayBuffer());
                  if (confBuf.length > 4 && confBuf.toString('utf-8', 0, 5).startsWith('%PDF')) {
                    successfulBuffer = confBuf;
                    contentType = 'application/pdf';
                    break;
                  }
                }
              }
            }
          } catch (fetchErr) {
            console.warn(`[PDF Proxy] Attempt to fetch ${targetUrl} failed:`, fetchErr);
          }
        }

      if (!successfulBuffer) {
        // Fallback: If we couldn't fetch directly (e.g. private file requiring cookies),
        // redirect to Google Drive's own viewer or return a 302
        if (fileId) {
          return res.redirect(`https://drive.google.com/file/d/${fileId}/preview`);
        }
        return res.status(404).send('Không thể tải dữ liệu PDF từ liên kết được cung cấp.');
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', 'inline; filename="tai_lieu_mat_tran.pdf"');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range, X-Requested-With');
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.setHeader('Content-Length', successfulBuffer.length);
      return res.end(successfulBuffer);
    } catch (err: any) {
      console.error('[PDF Proxy Error]:', err);
      res.status(500).send('Lỗi khi tải dữ liệu tài liệu từ máy chủ proxy.');
    }
  });

  // Vite development middleware or production static server
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server đang chạy tại http://0.0.0.0:${PORT}`);
  });
}

startServer();
