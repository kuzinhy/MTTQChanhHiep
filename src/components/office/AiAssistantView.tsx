import React from 'react';
import { AiWorkspaceDashboard } from './ai/AiWorkspaceDashboard';
import { AiChatLog, KnowledgeNote, StaffUser } from '../../types';

interface AiAssistantViewProps {
  documentsContext?: string;
  opinionsContext?: any[];
  aiChats?: AiChatLog[];
  knowledgeNotes?: KnowledgeNote[];
  currentStaffUser?: StaffUser | null;
  onBackToOffice?: () => void;
  onSaveAiChat?: (chat: AiChatLog) => Promise<void>;
  onSaveKnowledgeNote?: (note: KnowledgeNote) => Promise<void>;
  onDeleteKnowledgeNote?: (id: string) => Promise<void>;
  onShowToast?: (title: string, message: string) => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  onBackToOffice
}) => {
  return <AiWorkspaceDashboard onBackToOffice={onBackToOffice} />;
};

