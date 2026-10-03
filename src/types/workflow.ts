export type WorkflowNodeType = 
  | 'START' 
  | 'USER_ACTION' 
  | 'DOCUMENT' 
  | 'FORM' 
  | 'LOCATION' 
  | 'COUNTER' 
  | 'VERIFY' 
  | 'DECISION' 
  | 'PROCESS' 
  | 'WAIT' 
  | 'PAYMENT' 
  | 'RESULT' 
  | 'END';

export type WorkflowNodeStatus = 'DONE' | 'RUNNING' | 'WAITING' | 'WARNING';

export interface WorkflowDocumentItem {
  id: string;
  name: string;
  required: boolean;
  quantity?: string;
  notes?: string;
}

export interface WorkflowDecisionChoice {
  label: string;
  targetNodeId: string;
  isPositive?: boolean;
}

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  subtitle?: string;
  description: string;
  instruction?: string;
  status: WorkflowNodeStatus;
  stepNumber: number;
  duration?: string;
  counter?: string;
  location?: string;
  officerUnit?: string;
  requiredDocuments?: WorkflowDocumentItem[];
  formName?: string;
  formUrl?: string;
  onlineUrl?: string;
  notes?: string;
  decisionChoices?: WorkflowDecisionChoice[];
  position?: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  condition?: string;
  label?: string;
  isActive?: boolean;
}

export interface ProcessLogEntry {
  id: string;
  timestamp: string;
  nodeType: WorkflowNodeType;
  title: string;
  message: string;
  status: WorkflowNodeStatus;
}

export interface WorkflowProcedure {
  id: string;
  code: string;
  name: string;
  aliases: string[];
  category: 'Hộ tịch' | 'Chứng thực' | 'An sinh' | 'Đất đai' | 'Khác';
  description: string;
  authority: string;
  locationId: string;
  counter: string;
  onlineAvailable: boolean;
  onlineUrl?: string;
  processingTime: string;
  fee: string;
  officialSourceUrl: string;
  sourceUpdatedAt: string;
  active: boolean;
  version: string;
  updatedAt: string;
  updatedBy: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
