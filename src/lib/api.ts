export function getApiUrl(path: string): string {
  const host = window.location.hostname;
  const isCloudRun = host.endsWith('.run.app') || host.endsWith('.aistudio.google');
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.');

  // If we are not on Cloud Run and not on Localhost, we are probably deployed on Vercel or a custom domain.
  // Direct the API requests to the official backend container running on Cloud Run.
  if (!isCloudRun && !isLocalhost) {
    const baseUrl = 'https://ais-pre-eokzuo3lbp4ijcdgdnvif3-553565080913.asia-southeast1.run.app';
    const sanitizedPath = path.startsWith('/') ? path : '/' + path;
    return `${baseUrl}${sanitizedPath}`;
  }
  return path;
}

export function runClientLocalKnowledgeFallback(query: string, documentsContext: string, knowledgeNotesContext: string): string {
  if (!query || query.trim() === '') {
    return 'Vui lòng nhập câu hỏi để tôi có thể hỗ trợ tra cứu.';
  }

  const normalizedQuery = query.toLowerCase().trim();

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

  const calculatePhraseScore = (qNormalized: string, targetText: string): number => {
    if (!targetText) return 0;
    const targetNormalized = cleanAndNormalize(targetText).join(' ');
    const targetWords = cleanAndNormalize(targetText);
    const targetSet = new Set(targetWords);
    
    let score = 0;
    queryWords.forEach(w => {
      if (targetSet.has(w)) score += 1;
    });
    
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
  
  let matchedQuestion = '';
  let matchedAnswer = '';
  
  let matchedCode = '';
  let matchedTitle = '';
  let matchedSigner = '';
  let matchedField = '';

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

  const docLines = documentsContext ? documentsContext.split('\n') : [];
  for (const line of docLines) {
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

  const greetingKeywords = ['xin chao', 'hello', 'hi', 'chao ban', 'tro ly', 'ai la', 'tro ly ai', 'huong dan', 'huong dan gi'];
  const hasGreeting = cleanAndNormalize(normalizedQuery).some(w => greetingKeywords.includes(w));

  if (bestMatch === 'note' && bestScore > 2) {
    return `[Trích Sổ tay Kiến thức Chánh Hiệp - Offline Fallback Mode]
Chào bạn! Dựa trên Sổ tay Nghiệp vụ Mặt trận Phường Chánh Hiệp, tôi xin giải đáp thắc mắc của bạn về nội dung: "${matchedQuestion}" như sau:

---
${matchedAnswer}
---

*Ghi chú: Nếu cần giải đáp thêm các nghiệp vụ chuyên sâu, bạn có thể gửi câu hỏi trực tiếp cho Cán bộ Mặt trận tại tab Văn phòng Số hoặc liên hệ trực tiếp Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.*`;
  }

  if (bestMatch === 'doc' && bestScore > 2) {
    return `[Trích Kho văn bản Chánh Hiệp - Offline Fallback Mode]
Chào bạn! Tôi đã tìm thấy văn bản liên quan trực tiếp đến yêu cầu tra cứu của bạn trong Kho văn bản Mặt trận Phường Chánh Hiệp:

- **Số hiệu văn bản**: ${matchedCode}
- **Tên văn bản**: ${matchedTitle}
- **Lĩnh vực công tác**: ${matchedField}
- **Người ký ban hành**: ${matchedSigner}

**Gợi ý xử lý**: Bạn có thể tra cứu toàn văn văn bản này trực tiếp tại mục **Kho văn bản** bằng cách tìm theo số hiệu \`${matchedCode}\` hoặc tiêu đề \`${matchedTitle}\`.

*Hệ thống Mặt trận Tổ quốc Phường Chánh Hiệp luôn công khai minh bạch các chỉ đạo, văn bản pháp luật hành chính để phục vụ cán bộ và nhân dân.*`;
  }

  if (hasGreeting || normalizedQuery.length < 5) {
    return `Chào bạn! Tôi là Trợ lý AI thông minh của Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, TP. Thủ Dầu Một.

Tôi luôn sẵn sàng hỗ trợ cán bộ và nhân dân tra cứu:
1. **Sổ tay Nghiệp vụ**: Các câu hỏi quy trình bầu cử, giám sát, phản biện, ban thanh tra nhân dân, ban giám sát đầu tư cộng đồng.
2. **Kho văn bản Mặt trận**: Tra cứu các quyết định, kế hoạch chỉ đạo của Ủy ban MTTQ Phường Chánh Hiệp.
3. **Ý kiến Dân sinh**: Hướng dẫn gửi phản ánh, kiến nghị của bà con lên Ban Thường trực.

Bạn vui lòng nhập câu hỏi cụ thể hơn (ví dụ: "giám sát đầu tư cộng đồng là gì?", "quy định về ban thanh tra nhân dân", hoặc "văn bản về an sinh xã hội") để tôi tìm kiếm chính xác nhất nhé!`;
  }

  return `Chào bạn! Tôi là Trợ lý AI của Ủy ban MTTQ Việt Nam Phường Chánh Hiệp.

Đối với nội dung tra cứu của bạn: "${query}", hiện tại hệ thống chưa tìm thấy tài liệu hướng dẫn cụ thể hoặc số hiệu văn bản khớp hoàn toàn trong Sổ tay Kiến thức đã duyệt.

**Gợi ý các kênh hỗ trợ trực tiếp:**
1. **Tra cứu toàn văn**: Bạn có thể vào mục **Kho văn bản** trên hệ thống để tìm kiếm thêm các tài liệu liên quan bằng từ khóa.
2. **Gửi Ý kiến Dân sinh**: Nếu đây là một ý kiến phản ánh, kiến nghị dân sinh hoặc đóng góp xây dựng chính quyền, xin vui lòng gửi ý kiến qua mục **Ý kiến Dân sinh** để Ban Thường trực MTTQ Phường tiếp nhận, giải quyết kịp thời.
3. **Ghi nhận tự động**: Câu hỏi của bạn đã được ghi nhận tự động vào Nhật ký Tra cứu để chuyển Cán bộ Mặt trận chuyên trách bổ sung hướng dẫn chi tiết vào hệ thống trong thời gian sớm nhất.

Cảm ơn bạn đã đồng hành cùng Mặt trận Tổ quốc Phường Chánh Hiệp!`;
}

