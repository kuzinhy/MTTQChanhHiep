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
    return matchedAnswer;
  }

  if (bestMatch === 'doc' && bestScore > 2) {
    return `**Số hiệu văn bản**: ${matchedCode}
**Tên văn bản**: ${matchedTitle}
**Lĩnh vực**: ${matchedField}
**Người ký**: ${matchedSigner}`;
  }

  if (hasGreeting || normalizedQuery.length < 5) {
    return `Chào bạn! Tôi là Trợ lý AI của Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, TP. Hồ Chí Minh.

Tôi hỗ trợ tra cứu:
1. Sổ tay Nghiệp vụ Mặt trận (Quy trình bầu cử, giám sát, phản biện, thanh tra nhân dân).
2. Kho văn bản quyết định, kế hoạch của Ủy ban MTTQ Phường Chánh Hiệp.

Hãy nhập nội dung hoặc câu hỏi bạn cần tra cứu cụ thể.`;
  }

  return `Hiện tại hệ thống chưa tìm thấy thông tin cụ thể hoặc văn bản khớp với câu hỏi: "${query}" trong Kho dữ liệu đã duyệt của Mặt trận Tổ quốc Phường Chánh Hiệp.`;
}

