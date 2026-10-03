export type ProcedureCategory = 'Hộ tịch' | 'Chứng thực' | 'An sinh' | 'Đất đai' | 'Khác';

export interface ProcedureDocumentRequirement {
  id: string;
  procedureId: string;
  name: string;
  required: boolean;
  quantity?: string;
  notes?: string;
}

export interface ProcedureFormItem {
  id: string;
  procedureId: string;
  name: string;
  fileUrl?: string;
  onlineUrl?: string;
  version?: string;
}

export interface ProcedureStep {
  id: string;
  procedureId: string;
  stepNumber: number;
  title: string;
  description: string;
  instruction?: string;
  location?: string;
  counter?: string;
  officerUnit?: string;
  requiredDocuments?: string[];
  formName?: string;
  formUrl?: string;
  onlineUrl?: string;
  notes?: string;
  estimatedTime?: string;
}

export interface ProcedureItem {
  id: string;
  code: string;
  name: string;
  aliases: string[];
  category: ProcedureCategory;
  description: string;
  authority: string;
  locationId: string;
  counter?: string;
  onlineAvailable: boolean;
  onlineUrl?: string;
  processingTime: string;
  fee: string;
  officialSourceUrl: string;
  sourceUpdatedAt: string;
  active: boolean;
  sortOrder: number;
  version: string;
  updatedAt: string;
  updatedBy: string;
  steps: ProcedureStep[];
  documents: ProcedureDocumentRequirement[];
  forms: ProcedureFormItem[];
}
