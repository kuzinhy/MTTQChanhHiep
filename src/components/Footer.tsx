import React, { useState, useEffect } from 'react';
import { VisitorTrackerEngine, VisitorStats } from '../lib/visitorTracker';
import { VisitorStatsModal } from './VisitorStatsModal';

export const Footer: React.FC<{
  onSelectTab?: (tab: string) => void;
}> = () => {
  const [onlineCount, setOnlineCount] = useState<number>(() => VisitorTrackerEngine.getOnlineCount());
  const [stats, setStats] = useState<VisitorStats>(() => VisitorTrackerEngine.getStats());
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  useEffect(() => {
    VisitorTrackerEngine.init();

    const unsubscribeOnline = VisitorTrackerEngine.subscribeOnlineCount((count) => {
      setOnlineCount(count);
    });

    const unsubscribeStats = VisitorTrackerEngine.subscribeStats((newStats) => {
      setStats(newStats);
    });

    return () => {
      unsubscribeOnline();
      unsubscribeStats();
    };
  }, []);

  return (
    <footer className="bg-gradient-to-br from-blue-800 via-indigo-700 to-blue-900 text-white relative overflow-hidden text-xs border-t border-blue-500/40 shadow-xl">
      {/* Top Blue-Cyan Accent Line */}
      <div className="h-[4px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

      <div className="bg-slate-950 py-3.5 px-6 border-t border-blue-900 text-left text-[11px] text-blue-200 font-semibold max-w-7xl mx-auto w-full">
        &copy; 2026 Bản quyền thuộc về Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, Thành phố Hồ Chí Minh.
      </div>

      {/* Visitor Analytics Modal */}
      <VisitorStatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        onlineCount={onlineCount}
        stats={stats}
      />
    </footer>
  );
};

