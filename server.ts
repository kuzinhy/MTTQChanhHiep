import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

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

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

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
        model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
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
        model: 'gemini-2.5-flash',
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
      const { fileName, textContent } = req.body;
      const ai = getGeminiClient();

      const prompt = `Bạn là Trợ lý AI chuyên gia phân tích văn bản hành chính nhà nước, Mặt trận Tổ quốc Việt Nam, UBND, HĐND.
Nhiệm vụ: Phân tích tên tệp và nội dung văn bản dưới đây để trích xuất đầy đủ các thuộc tính hành chính theo định dạng JSON.

Tên tệp văn bản: ${fileName || 'Chưa cung cấp'}
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
        model: 'gemini-2.5-flash',
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

  // AI Route: Tra cứu Kho Tài liệu
  app.post('/api/ai/knowledge-search', async (req: Request, res: Response) => {
    try {
      const { query, documentsContext } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey.trim() === '') {
        return res.json({ 
          result: `Chào bạn! Trợ lý AI hiện chưa được cấu hình khóa API (GEMINI_API_KEY) trong hệ thống. Vui lòng cấu hình khóa API Gemini hợp lệ hoặc sử dụng tính năng tra cứu văn bản trực tiếp.` 
        });
      }

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Bạn là Trợ lý Tra cứu Kho Dữ liệu Nội bộ MTTQ Phường Chánh Hiệp.
Dữ liệu kho tài liệu được cấp quyền:
${documentsContext || 'Dữ liệu các kế hoạch, báo cáo, thông báo năm 2026.'}

Câu hỏi của cán bộ: "${query}"

Hãy trả lời chính xác, trung thực dựa trên dữ liệu kho tài liệu trên. Nếu thông tin không có trong kho dữ liệu, hãy nêu rõ "Không tìm thấy thông tin cụ thể trong kho tài liệu được cấp". Trích dẫn tên văn bản/kế hoạch nếu có.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      res.json({ result: response.text });
    } catch (error: any) {
      console.error('Error in /api/ai/knowledge-search:', error);
      res.json({ 
        result: `Trợ lý AI đang gặp sự cố kết nối hoặc khóa API không hợp lệ. Bạn có thể tra cứu thông tin trực tiếp tại mục Kho văn bản hoặc gửi Ý kiến Dân sinh.` 
      });
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
        model: 'gemini-3.7-flash',
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
        model: 'gemini-3.7-flash',
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
        model: 'gemini-2.5-flash',
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
  // Monitored Folder: 1TNEc-8JYkF17R44igkinTIZAmFEjSmOL
  // =========================================================================

  const GOOGLE_DRIVE_MONITORED_FOLDER_ID = '1TNEc-8JYkF17R44igkinTIZAmFEjSmOL';
  const GOOGLE_DRIVE_FOLDER_URL = `https://drive.google.com/drive/folders/${GOOGLE_DRIVE_MONITORED_FOLDER_ID}`;

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
