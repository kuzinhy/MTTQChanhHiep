import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

export const documentIngestionRouter = express.Router();

// TARGET OFFICIAL DOCUMENTS GOOGLE DRIVE FOLDER ID
export const OFFICIAL_DOCUMENTS_DRIVE_FOLDER_ID = '1Vw365JIFDuUFT1AwF-MoJD8kKkvhiLH_';

/**
 * POST /api/documents/parse-and-extract
 * AI OCR & Text Parsing Router
 */
documentIngestionRouter.post('/parse-and-extract', async (req: Request, res: Response) => {
  try {
    const { fileName, mimeType, fileSize, base64Data } = req.body;

    if (!fileName || !base64Data) {
      return res.status(400).json({ success: false, error: 'Thiếu tên tệp hoặc dữ liệu base64' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Chưa cấu hình GEMINI_API_KEY môi trường máy chủ.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const promptText = `
Bạn là Trợ lý AI Bóc tách Văn bản Hành chính Phường Chánh Hiệp.
Đọc văn bản/hình ảnh sau và trả về DUY NHẤT một chuỗi JSON chuẩn hóa (không markdown) có cấu trúc đúng sau:

{
  "documentType": "Công văn | Kế hoạch | Báo cáo | Thông báo | Quyết định | Tờ trình | Hướng dẫn | Nghị quyết | Kết luận | Giấy mời | Biên bản | Chương trình | Danh sách | Đề án | Quy chế",
  "documentNumber": "125",
  "documentSymbol": "CV-MTTQ",
  "documentNumberFull": "125/CV-MTTQ",
  "issuingAgency": "Ủy ban MTTQ Việt Nam phường Chánh Hiệp",
  "issuingUnit": "Ban Thường trực",
  "issueDate": "YYYY-MM-DD",
  "signedBy": "Nguyễn Văn A",
  "signerPosition": "Chủ tịch",
  "summary": "Trích yếu ngắn gọn của văn bản",
  "documentSummary": "Tóm tắt chi tiết 2-3 câu về nội dung chính",
  "field": "Công tác Mặt trận | An sinh xã hội | Tuyên truyền | Dân vận | Giám sát - Phản biện | Chuyển đổi số",
  "priority": "Bình thường | Khẩn | Thượng khẩn | Hỏa tốc",
  "confidentialLevel": "Thường | Mật | Tối mật | Tuyệt mật",
  "effectiveDate": "YYYY-MM-DD",
  "deadline": "YYYY-MM-DD",
  "leadUnit": "Đơn vị chủ trì thực hiện",
  "coordinatingUnits": ["Đơn vị phối hợp 1", "Đơn vị phối hợp 2"],
  "keywords": ["MTTQ", "tháng 10", "triển khai"],
  "tasks": [
    {
      "taskTitle": "Tên nhiệm vụ cụ thể được giao trong văn bản",
      "taskDescription": "Chi tiết nhiệm vụ",
      "leadUnit": "Đơn vị phụ trách",
      "coordinatingUnits": ["Đơn vị phối hợp"],
      "assignee": "Tên cán bộ/Chức danh",
      "deadline": "YYYY-MM-DD",
      "priority": "Bình thường | Khẩn",
      "confidence": 0.95
    }
  ],
  "confidenceMap": {
    "documentType": 0.98,
    "documentNumberFull": 0.95,
    "issuingAgency": 0.98,
    "issueDate": 0.92,
    "signedBy": 0.90,
    "summary": 0.96
  }
}
`;

    const contentsPayload: any[] = [{ text: promptText }];
    if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
      contentsPayload.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: base64Data
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contentsPayload
    });

    const rawText = response.text || '';
    const cleanJsonStr = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const aiJson = JSON.parse(cleanJsonStr);

    return res.json({
      success: true,
      data: {
        plainText: rawText,
        extractedData: {
          codeNumber: aiJson.documentNumberFull || `${aiJson.documentNumber}/${aiJson.documentSymbol}`,
          documentNumber: aiJson.documentNumber,
          documentSymbol: aiJson.documentSymbol,
          documentNumberFull: aiJson.documentNumberFull,
          title: aiJson.summary,
          docType: aiJson.documentType,
          documentType: aiJson.documentType,
          field: aiJson.field || 'Công tác Mặt trận',
          issuer: aiJson.issuingAgency || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
          issuingAgency: aiJson.issuingAgency,
          issuingUnit: aiJson.issuingUnit,
          issueDate: aiJson.issueDate || new Date().toISOString().substring(0, 10),
          effectiveDate: aiJson.effectiveDate,
          deadline: aiJson.deadline,
          signer: aiJson.signedBy || 'Trần Văn Nam',
          signedBy: aiJson.signedBy,
          signerPosition: aiJson.signerPosition || 'Chủ tịch',
          summary: aiJson.summary,
          documentSummary: aiJson.documentSummary,
          priority: aiJson.priority || 'Bình thường',
          confidentialLevel: aiJson.confidentialLevel || 'Thường',
          leadUnit: aiJson.leadUnit || 'Ban Thường trực MTTQ',
          coordinatingUnits: aiJson.coordinatingUnits || [],
          keywords: aiJson.keywords || [],
          fileName: fileName,
          fileSize: (fileSize / 1024).toFixed(1) + ' KB',
          mimeType: mimeType,
          aiExtracted: true,
          aiConfidence: aiJson.confidenceMap,
          tasks: aiJson.tasks || []
        },
        confidenceMap: aiJson.confidenceMap || {},
        tasks: aiJson.tasks || [],
        rawAiJson: aiJson
      }
    });
  } catch (err: any) {
    console.error('[DocumentIngestionRouter] Error in parse-and-extract:', err);
    return res.status(500).json({ success: false, error: err.message || 'Lỗi bóc tách AI' });
  }
});
