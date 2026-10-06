import React, { useState } from 'react';
import { X, Play, RefreshCw, Sparkles, Check, Copy } from 'lucide-react';
import { AnimatedIcon } from './AnimatedIcon';
import { animatedIcons, AnimatedIconName, AnimatedIconConfig } from '../../lib/animatedIcons';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AnimatedIconShowcaseModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIconName, setSelectedIconName] = useState<AnimatedIconName>('document');
  const [activeTrigger, setActiveTrigger] = useState<'hover' | 'loop' | 'load'>('hover');
  const [previewSize, setPreviewSize] = useState<number>(100);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const iconList = Object.values(animatedIcons) as AnimatedIconConfig[];
  const categories = [
    { id: 'all', label: 'Tất cả icon' },
    { id: 'office', label: 'Văn phòng số' },
    { id: 'auth', label: 'Xác thực & An ninh' },
    { id: 'cloud', label: 'Google Drive & Data' },
    { id: 'feedback', label: 'Dân sinh & An sinh' },
    { id: 'system', label: 'Hệ thống & AI' }
  ];

  const filteredIcons = selectedCategory === 'all' 
    ? iconList 
    : iconList.filter(i => i.category === selectedCategory);

  const currentIcon = animatedIcons[selectedIconName];

  const snippet = `<AnimatedIcon 
  name="${selectedIconName}" 
  size={${previewSize}} 
  trigger="${activeTrigger}" 
/>`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-fadeIn select-none">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-xl text-sky-400 border border-sky-400/30">
              <AnimatedIcon name="ai_brain" size={24} colorScheme="white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm sm:text-base">PHÒNG NGHIÊN CỨU &amp; THỬ NGHIỆM ICON ĐỘNG</h3>
                <span className="px-2 py-0.5 bg-blue-600/40 text-blue-200 rounded-full text-[10px] font-bold border border-blue-400/30">
                  Lively Vector Micro-interactions
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80 font-medium mt-0.5">
                Mô hình Icon động chuẩn Lordicon / Lottie-Vector 60fps thuần SVG &amp; Framer Motion
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 sm:px-6 py-2.5 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                selectedCategory === c.id 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Main Body (2 Columns) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left: Icon Grid (7 cols) */}
          <div className="md:col-span-7 space-y-4">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
              Danh mục Icon động ({filteredIcons.length})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredIcons.map((icon) => {
                const isSelected = selectedIconName === icon.name;
                return (
                  <button
                    key={icon.name}
                    onClick={() => {
                      setSelectedIconName(icon.name);
                      setPreviewSize(icon.defaultSize > 80 ? 90 : Math.max(36, icon.defaultSize * 1.5));
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group ${
                      isSelected 
                        ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/60 shadow-2xs'
                    }`}
                  >
                    <div className="w-16 h-16 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                      <AnimatedIcon 
                        name={icon.name} 
                        size={icon.defaultSize > 80 ? 56 : 32} 
                        trigger="hover" 
                      />
                    </div>
                    <div className="w-full text-center">
                      <p className="text-xs font-extrabold text-slate-900 truncate">{icon.label}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">name="{icon.name}"</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Live Sandbox & Code (5 cols) */}
          <div className="md:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                Trực quan hóa &amp; Tương tác
              </h4>

              {/* Preview Stage Container (Navy Dark Card for contrast) */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#101D43] to-[#162957] border border-blue-900 flex flex-col items-center justify-center min-h-[200px] relative overflow-hidden shadow-md">
                <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800">
                  {previewSize}px · {activeTrigger}
                </div>

                <div className="py-2">
                  <AnimatedIcon 
                    name={selectedIconName} 
                    size={previewSize} 
                    trigger={activeTrigger}
                    colorScheme="white"
                  />
                </div>

                <p className="text-[11px] text-blue-200/90 text-center font-medium mt-2 max-w-[260px]">
                  Rê chuột hoặc chạm vào icon để kích hoạt vi hiệu ứng đàn hồi
                </p>
              </div>

              {/* Controls */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Kích thước hiển thị: {previewSize}px
                  </label>
                  <input 
                    type="range" 
                    min="20" 
                    max="140" 
                    value={previewSize} 
                    onChange={(e) => setPreviewSize(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Cơ chế kích hoạt:</label>
                  <div className="flex gap-2">
                    {(['hover', 'loop', 'load'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setActiveTrigger(t)}
                        className={`flex-1 py-1 rounded-lg font-bold text-xs capitalize transition cursor-pointer ${
                          activeTrigger === t ? 'bg-blue-600 text-white' : 'bg-white border text-slate-700'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-600">
                  <p><b>Mô tả:</b> {currentIcon?.description}</p>
                </div>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-blue-100 font-mono text-[11px] relative">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[10px] text-slate-400">
                <span>React Component Usage</span>
                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(snippet);
                      setCopiedCode(true);
                      setTimeout(() => setCopiedCode(false), 2000);
                    }
                  }}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 cursor-pointer font-bold"
                >
                  {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Đã sao chép' : 'Copy'}</span>
                </button>
              </div>
              <pre className="pt-2 text-cyan-300 overflow-x-auto whitespace-pre">
                {snippet}
              </pre>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Tối ưu hóa 100% SVG + Motion Framework, tuân thủ prefers-reduced-motion.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg cursor-pointer transition"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
