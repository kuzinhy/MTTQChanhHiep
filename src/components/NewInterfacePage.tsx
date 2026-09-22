import React from 'react';
import { motion } from 'motion/react';
import { DashboardInterface } from './DashboardInterface';
import { Article, OfficialDocument, PublicOpinion, StaffUser } from '../types';

interface NewInterfacePageProps {
  backgroundImage: string;
  currentStaffUser?: StaffUser | null;
  articles?: Article[];
  documents?: OfficialDocument[];
  opinions?: PublicOpinion[];
  onNavigatePortalTab?: (tab: string) => void;
  onGoToOffice?: (view?: string) => void;
  onOpenStaffLogin?: () => void;
}

export const NewInterfacePage: React.FC<NewInterfacePageProps> = ({ 
  backgroundImage,
  currentStaffUser,
  articles,
  documents,
  opinions,
  onNavigatePortalTab,
  onGoToOffice,
  onOpenStaffLogin,
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 w-full h-full bg-cover bg-top bg-no-repeat overflow-y-auto z-40"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dynamic atmospheric subtle lighting effect */}
      <div className="min-h-full w-full bg-gradient-to-b from-white/10 via-sky-50/20 to-sky-100/35 backdrop-blur-[0.5px]">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05, ease: 'easeOut' }}
        >
          <DashboardInterface 
            currentStaffUser={currentStaffUser}
            articles={articles}
            documents={documents}
            opinions={opinions}
            onNavigatePortalTab={onNavigatePortalTab}
            onGoToOffice={onGoToOffice}
            onOpenStaffLogin={onOpenStaffLogin}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
