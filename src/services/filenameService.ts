/**
 * Filename Standardizer Service
 * Format: YYYYMMDD_LOAI_SOKYHIEU_DONVI_TRICHYEU.ext
 * Example: 20261001_CV_125_MTTQ-CH_Trien-khai-cong-tac-thang-10-2026.pdf
 */

export interface DocumentTypeCodeMapping {
  name: string;
  code: string;
}

export const DOCUMENT_TYPE_CODES: DocumentTypeCodeMapping[] = [
  { name: 'Công văn', code: 'CV' },
  { name: 'Kế hoạch', code: 'KH' },
  { name: 'Báo cáo', code: 'BC' },
  { name: 'Thông báo', code: 'TB' },
  { name: 'Quyết định', code: 'QD' },
  { name: 'Tờ trình', code: 'TTr' },
  { name: 'Hướng dẫn', code: 'HD' },
  { name: 'Nghị quyết', code: 'NQ' },
  { name: 'Kết luận', code: 'KL' },
  { name: 'Giấy mời', code: 'GM' },
  { name: 'Biên bản', code: 'BB' },
  { name: 'Chương trình', code: 'CTr' },
  { name: 'Danh sách', code: 'DS' },
  { name: 'Đề án', code: 'DA' },
  { name: 'Quy chế', code: 'QC' },
  { name: 'Tài liệu', code: 'TL' }
];

export function getDocumentTypeCode(docType: string): string {
  if (!docType) return 'VB';
  const trimmed = docType.trim().toLowerCase();
  const match = DOCUMENT_TYPE_CODES.find(
    item => item.name.toLowerCase() === trimmed || item.code.toLowerCase() === trimmed
  );
  if (match) return match.code;

  // Fallback uppercase first letters
  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase();
}

/**
 * Strips Vietnamese diacritics and converts spaces/special characters
 */
export function removeVietnameseDiacritics(str: string): string {
  if (!str) return '';
  let result = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  result = result.replace(/[đĐ]/g, 'd');
  return result;
}

/**
 * Sanitizes strings for safe filename usage (removes forbidden characters / \ : * ? " < > |)
 */
export function sanitizeFilenamePart(text: string, replaceSpacesWithHyphen = true): string {
  if (!text) return '';
  let clean = removeVietnameseDiacritics(text);
  // Remove illegal characters
  clean = clean.replace(/[/\\:*?"<>|]/g, '-');

  if (replaceSpacesWithHyphen) {
    clean = clean.replace(/\s+/g, '-');
  } else {
    clean = clean.replace(/\s+/g, '_');
  }

  // Remove duplicate dashes or underscores
  clean = clean.replace(/-+/g, '-').replace(/_+/g, '_');
  clean = clean.replace(/^[-_]|[-_]$/g, '');

  return clean;
}

export interface StandardizedFilenameOptions {
  issueDate?: string;    // YYYY-MM-DD or YYYYMMDD
  docType?: string;      // Công văn -> CV
  documentNumber?: string; // 125
  documentSymbol?: string; // CV-MTTQ or MTTQ-CH
  issuingAgency?: string;  // MTTQ Phường Chánh Hiệp -> MTTQ-CH
  summary?: string;       // Trích yếu
  extension?: string;     // pdf, docx, etc.
  versionSuffix?: string; // _v02, _BAN-HANH
}

export function generateStandardizedFilename(options: StandardizedFilenameOptions): string {
  const {
    issueDate = new Date().toISOString().substring(0, 10),
    docType = 'Công văn',
    documentNumber = '01',
    documentSymbol = 'MTTQ',
    issuingAgency = 'MTTQ-CH',
    summary = 'Van-ban-trien-khai',
    extension = 'pdf',
    versionSuffix = ''
  } = options;

  // 1. Format YYYYMMDD
  const cleanDate = issueDate.replace(/[-/]/g, '').substring(0, 8) || new Date().toISOString().substring(0, 10).replace(/-/g, '');

  // 2. Type Code (CV, KH, BC, QD)
  const typeCode = getDocumentTypeCode(docType);

  // 3. Clean Symbol / Number
  const numClean = sanitizeFilenamePart(documentNumber, false) || '01';
  const symbolClean = sanitizeFilenamePart(documentSymbol || issuingAgency || 'MTTQ-CH', false) || 'MTTQ-CH';

  // 4. Short Summary Slug
  const summaryClean = sanitizeFilenamePart(summary, true).substring(0, 40) || 'Van-ban';

  // 5. Clean extension
  let extClean = extension.toLowerCase().replace(/^\./, '');
  if (!extClean || extClean === 'octet-stream') extClean = 'pdf';

  // Assembly: YYYYMMDD_LOAI_SO_KYHIEU_TRICHYEU
  let baseName = `${cleanDate}_${typeCode}_${numClean}_${symbolClean}_${summaryClean}`;
  if (versionSuffix) {
    const cleanVer = versionSuffix.startsWith('_') ? versionSuffix : `_${versionSuffix}`;
    baseName += cleanVer;
  }

  return `${baseName}.${extClean}`;
}
