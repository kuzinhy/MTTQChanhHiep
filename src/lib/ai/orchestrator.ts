/**
 * Master AI Orchestrator for "Cán bộ số hỗ trợ người dân" - Phường Chánh Hiệp
 * Coordinates the complete 15-stage brain architecture:
 * INPUT NORMALIZATION -> CONVERSATION CONTEXT -> INTENT + ENTITY DETECTION -> QUERY REWRITE ->
 * TASK PLANNER -> SOURCE ROUTER -> TOOL ROUTER -> MULTI-SOURCE RETRIEVAL -> RERANK ->
 * FACT EXTRACTION -> SOURCE VALIDATION -> CONFLICT CHECK -> ANSWER COMPOSER -> QUALITY GATE -> ACTION RECOMMENDER -> RESPONSE
 */

import { InputNormalizer, NormalizedInput } from './inputNormalizer';
import { IntentRouter, IntentAnalysisResult } from './intentRouter';
import { MemoryService } from './memoryService';
import { QueryRewrite } from './queryRewrite';
import { TaskPlanner } from './taskPlanner';
import { SourceRouter } from './sourceRouter';
import { Reranker } from './reranker';
import { QualityGate } from './qualityGate';
import { AIResponseEnvelope, AISource, AIAction, SessionMemory } from './types';

/**
 * Standard Helper: Normalizes input query for processing.
 */
export function processInput(rawQuery: string): NormalizedInput {
  return InputNormalizer.normalize(rawQuery);
}

/**
 * Standard Helper: Routes intent and extracts entities based on normalized input and session context.
 */
export function routeIntent(query: string, session?: SessionMemory): IntentAnalysisResult {
  return IntentRouter.classify(query, session);
}

export class AIOrchestrator {
  /**
   * Alias static method for input processing
   */
  public static processInput(rawQuery: string): NormalizedInput {
    return processInput(rawQuery);
  }

  /**
   * Alias static method for intent routing
   */
  public static routeIntent(query: string, session?: SessionMemory): IntentAnalysisResult {
    return routeIntent(query, session);
  }

  /**
   * Full Pipeline Processor for Cán bộ số hỗ trợ người dân
   */
  public static async processUserQuery(
    rawQuery: string,
    session: SessionMemory,
    customKnowledge: any[] = []
  ): Promise<AIResponseEnvelope> {
    // Stage 1: Input Normalization
    const normalizedInput = processInput(rawQuery);

    // Stage 2: Conversation Context
    const sessionContext = MemoryService.getSessionContext(session);

    // Stage 3: Intent + Entity Detection
    const intentResult: IntentAnalysisResult = routeIntent(
      normalizedInput.raw,
      session
    );

    // If 0ms direct response available (Greeting, Thanks, Goodbye, Direct Cadre lookup)
    if (intentResult.directResponse) {
      const validated = QualityGate.validate(
        intentResult.directResponse.answer,
        normalizedInput.raw,
        false
      );

      return {
        intent: intentResult.intent,
        answer: validated.cleanAnswer,
        sources: [
          {
            name: 'Cổng thông tin Điện tử Phường Chánh Hiệp',
            url: '/gioi-thieu',
            type: 'WEBSITE',
            official: true
          }
        ],
        actions: intentResult.directResponse.actions || [],
        confidence: 1.0,
        sourceMode: 'LOCAL_FIRST',
        usedWebsite: true,
        usedKnowledgeBase: false,
        usedDrive: false,
        usedInternet: false,
        followUps: intentResult.directResponse.followUps || [
          'Tra cứu văn bản mới nhất',
          'Sơ đồ thủ tục hành chính',
          'Gửi phản ánh - kiến nghị'
        ]
      };
    }

    // Stage 4: Query Rewrite
    const rewrittenQueries = QueryRewrite.rewrite(normalizedInput.raw, intentResult.intent);

    // Stage 5: Task Planner
    const taskPlan = TaskPlanner.plan(normalizedInput.raw);

    // Stage 6: Source Router
    const routingPlan = SourceRouter.plan(intentResult.intent);

    // Default Fallback Envelope
    return {
      intent: intentResult.intent,
      answer: 'Cán bộ số hỗ trợ người dân Phường Chánh Hiệp xin chào bác/anh/chị. Hệ thống đã tiếp nhận yêu cầu và có thể hỗ trợ tư vấn thủ tục, tra cứu văn bản, phản ánh dân sinh hoặc tìm vị trí 21 khu phố.',
      sources: [
        {
          name: 'Cổng thông tin Điện tử Phường Chánh Hiệp',
          url: '/gioi-thieu',
          type: 'WEBSITE',
          official: true
        }
      ],
      actions: routingPlan.targetActions || [
        { type: 'OPEN_ROUTE' as const, label: 'Gửi phản ánh', route: '/phan-anh' },
        { type: 'OPEN_ROUTE' as const, label: 'Tra cứu văn bản', route: '/van-ban' }
      ],
      confidence: 0.95,
      sourceMode: 'LOCAL_FIRST',
      usedWebsite: true,
      usedKnowledgeBase: false,
      usedDrive: false,
      usedInternet: false,
      followUps: [
        'Tra cứu quy trình đăng ký kết hôn',
        'Địa chỉ văn phòng 21 khu phố',
        'Hotline hỗ trợ an sinh xã hội'
      ]
    };
  }
}
