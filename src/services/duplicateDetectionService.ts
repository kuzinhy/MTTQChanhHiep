import { NewDocument } from '../types';

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  confidence: number;
  reason?: string;
  matchedDocument?: NewDocument;
  suggestedAction?: 'CANCEL' | 'VIEW_EXISTING' | 'CREATE_VERSION' | 'FORCE_CREATE';
}

/**
 * Calculates simple file hash / checksum string for text content or file metadata
 */
export async function calculateFileHash(file: File): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return `${file.name}_${file.size}_${file.lastModified}`;
  }
}

/**
 * Checks if candidate document duplicates an existing document
 */
export function checkForDuplicateDocument(
  candidate: Partial<NewDocument>,
  existingDocuments: NewDocument[]
): DuplicateCheckResult {
  if (!existingDocuments || existingDocuments.length === 0) {
    return { isDuplicate: false, confidence: 0 };
  }

  const candSymbolFull = (candidate.documentNumberFull || candidate.codeNumber || '').trim().toLowerCase();
  const candDate = (candidate.issueDate || '').trim();
  const candAgency = (candidate.issuingAgency || candidate.issuer || '').trim().toLowerCase();
  const candStdFilename = (candidate.standardizedFilename || '').trim().toLowerCase();
  const candHash = candidate.fileHash;

  for (const doc of existingDocuments) {
    // 1. File Hash Match (Exact File Duplicate)
    if (candHash && doc.fileHash && candHash === doc.fileHash) {
      return {
        isDuplicate: true,
        confidence: 0.99,
        reason: 'Tệp tin trùng khớp 100% mã checksum SHA-256 với tệp đã có trên hệ thống.',
        matchedDocument: doc,
        suggestedAction: 'VIEW_EXISTING'
      };
    }

    // 2. Exact Standardized Filename Match
    if (candStdFilename && doc.standardizedFilename && candStdFilename === doc.standardizedFilename) {
      return {
        isDuplicate: true,
        confidence: 0.95,
        reason: 'Tên file chuẩn hóa đã tồn tại trong kho lưu trữ Google Drive.',
        matchedDocument: doc,
        suggestedAction: 'CREATE_VERSION'
      };
    }

    const docSymbolFull = (doc.documentNumberFull || doc.codeNumber || '').trim().toLowerCase();
    const docDate = (doc.issueDate || '').trim();
    const docAgency = (doc.issuingAgency || doc.issuer || '').trim().toLowerCase();

    // 3. Document Number + Symbol Match
    if (candSymbolFull && docSymbolFull && candSymbolFull === docSymbolFull && candSymbolFull.length > 3) {
      if (candDate && docDate && candDate === docDate) {
        return {
          isDuplicate: true,
          confidence: 0.92,
          reason: `Văn bản số ký hiệu "${doc.codeNumber}" phát hành ngày ${doc.issueDate} đã tồn tại trong hệ thống.`,
          matchedDocument: doc,
          suggestedAction: 'CREATE_VERSION'
        };
      }
    }

    // 4. Exact Title & Issue Date Match
    const candTitle = (candidate.summary || candidate.title || '').trim().toLowerCase();
    const docTitle = (doc.summary || doc.title || '').trim().toLowerCase();

    if (candTitle && docTitle && candTitle === docTitle && candDate && docDate && candDate === docDate) {
      return {
        isDuplicate: true,
        confidence: 0.85,
        reason: `Trích yếu và Ngày ban hành trùng khớp hoàn toàn với văn bản "${doc.title}".`,
        matchedDocument: doc,
        suggestedAction: 'VIEW_EXISTING'
      };
    }
  }

  return { isDuplicate: false, confidence: 0 };
}
