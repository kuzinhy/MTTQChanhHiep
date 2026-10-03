/**
 * Task Planner for Complex Multi-intent Queries
 * Decomposes complex user queries into sub-tasks (procedure -> requirements -> location -> online option -> synthesis)
 */

export interface TaskPlanStep {
  stepId: string;
  description: string;
  targetTool: 'PROCEDURE_SEARCH' | 'DOCUMENT_SEARCH' | 'MAP_SEARCH' | 'CONTACT_SEARCH' | 'WEB_SEARCH';
  query: string;
}

export interface TaskPlan {
  query: string;
  isComplex: boolean;
  steps: TaskPlanStep[];
}

export class TaskPlanner {
  public static plan(query: string): TaskPlan {
    const raw = (query || '').trim();
    const lower = raw.toLowerCase();

    const isMultiAspect = 
      (lower.includes('cần') || lower.includes('hồ sơ') || lower.includes('giấy')) &&
      (lower.includes('đâu') || lower.includes('mấy ngày') || lower.includes('lệ phí') || lower.includes('ai') || lower.includes('online'));

    if (!isMultiAspect) {
      return {
        query: raw,
        isComplex: false,
        steps: [
          {
            stepId: 'step-1',
            description: 'Direct retrieval for query',
            targetTool: 'PROCEDURE_SEARCH',
            query: raw
          }
        ]
      };
    }

    // Complex query plan
    const steps: TaskPlanStep[] = [];

    // Step 1: Procedure resolution
    steps.push({
      stepId: 'step-proc',
      description: 'Tra cứu quy trình và tên thủ tục hành chính',
      targetTool: 'PROCEDURE_SEARCH',
      query: raw
    });

    // Step 2: Requirements & Dossier checklist
    if (lower.includes('cần') || lower.includes('hồ sơ') || lower.includes('giấy')) {
      steps.push({
        stepId: 'step-req',
        description: 'Bóc tách thành phần hồ sơ và lệ phí',
        targetTool: 'DOCUMENT_SEARCH',
        query: `${raw} hồ sơ giấy tờ cần chuẩn bị`
      });
    }

    // Step 3: Location / Contact
    if (lower.includes('đâu') || lower.includes('địa chỉ') || lower.includes('ai')) {
      steps.push({
        stepId: 'step-loc',
        description: 'Xác định địa điểm tiếp nhận và cán bộ phụ trách',
        targetTool: 'MAP_SEARCH',
        query: 'Bộ phận Một cửa UBND Phường Chánh Hiệp địa chỉ liên hệ'
      });
    }

    return {
      query: raw,
      isComplex: true,
      steps
    };
  }
}
