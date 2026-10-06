import React, { useState } from 'react';
import { 
  Sparkles, Play, RefreshCw, Copy, Check, Info, ShieldCheck, 
  Layers, Sliders, Smartphone, Laptop, Zap 
} from 'lucide-react';
import { AnimatedIcon } from '../common/AnimatedIcon';
import { animatedIcons, AnimatedIconName, AnimatedIconConfig } from '../../lib/animatedIcons';

export const AnimatedIconLabView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIconName, setSelectedIconName] = useState<AnimatedIconName>('document');
  const [activeTrigger, setActiveTrigger] = useState<'hover' | 'loop' | 'load'>('hover');
  const [activeTheme, setActiveTheme] = useState<'navy' | 'white' | 'slate'>('navy');
  const [previewSize, setPreviewSize] = useState<number>(110);
  const [copiedCode, setCopiedCode] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const iconList = Object.values(animatedIcons) as AnimatedIconConfig[];
  const categories = [
    { id: 'all', label: 'Tất cả icon' },
    { id: 'office', label: 'Văn phòng số' },
    { id: 'auth', label: 'Xác thực & An ninh' },
    { id: 'cloud', label: 'Google Drive & Cloud' },
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
  colorScheme="${activeTheme === 'navy' ? 'light' : 'default'}"
/>`;

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-800/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-radial from-cyan-400/15 to-transparent rounded-full pointer-events-none blur-3xl -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>Phòng Nghiên Cứu Vi Hiệu Ứng Giao Diện (Micro-Interactions)</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Hệ Thống Icon Động Sinh Động &amp; Tương Tác Cao
            </h1>
            
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal">
              Thay thế hoàn toàn các icon tĩnh đơn điệu bằng bộ 12 icon động chuẩn Lordicon / Lottie-Vector. Tối ưu hóa 100% SVG thuần kết hợp Framer Motion, 60fps GPU acceleration, không phát sinh dung lượng thư viện ngoài, tương thích tuyệt đối chế độ trợ năng.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 flex items-center gap-3 shadow-inner">
              <AnimatedIcon name="document" size={54} colorScheme="white" trigger="hover" />
              <div className="text-left">
                <span className="block text-[11px] font-mono text-cyan-300 font-bold">12 Animated Icons</span>
                <span className="block text-xs font-black text-white">Ready in Production</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer ${
                selectedCategory === c.id 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Tổng số icon: <b>{filteredIcons.length}</b></span>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Icon Catalog Cards (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
            {filteredIcons.map((icon) => {
              const isSelected = selectedIconName === icon.name;
              return (
                <div
                  key={icon.name}
                  onClick={() => {
                    setSelectedIconName(icon.name);
                    setPreviewSize(icon.defaultSize > 80 ? 100 : Math.max(40, icon.defaultSize * 1.5));
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center justify-between gap-3 group relative overflow-hidden ${
                    isSelected 
                      ? 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20 shadow-md' 
                      : 'bg-white border-slate-200/90 hover:border-blue-400 hover:shadow-sm shadow-2xs'
                  }`}
                >
                  <div className="w-20 h-20 flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
                    <AnimatedIcon 
                      name={icon.name} 
                      size={icon.defaultSize > 80 ? 68 : 36} 
                      trigger="hover" 
                    />
                  </div>

                  <div className="w-full text-center space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900 truncate">{icon.label}</h4>
                    <p className="text-[10px] text-slate-500 font-mono">name="{icon.name}"</p>
                  </div>

                  {isSelected && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-blue-200" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Research & Engineering Specs */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wide flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Tiêu Chuẩn Thiết Kế &amp; Cơ Chế Động Học (Kinematics)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <b className="text-slate-900 block text-xs">Phản hồi vi tương tác</b>
                <p className="text-[11px] leading-relaxed">Sử dụng đường cong đàn hồi (spring bounce easing) khi rê chuột, mang lại cảm giác sống động như vật thể thực tế.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <b className="text-slate-900 block text-xs">Quỹ đạo dữ liệu số</b>
                <p className="text-[11px] leading-relaxed">Tích hợp các luồng hạt ánh sáng di chuyển theo chu kỳ, mô phỏng việc truyền tải văn bản và kết nối dữ liệu.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <b className="text-slate-900 block text-xs">Trợ năng &amp; Hiệu năng</b>
                <p className="text-[11px] leading-relaxed">Tự động chuyển về icon tĩnh chất lượng cao khi người dùng kích hoạt <code>prefers-reduced-motion</code>.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Testing Sandbox & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Trực Quan Hóa Tương Tác</span>
              </h3>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTheme('navy')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    activeTheme === 'navy' ? 'bg-[#101D43] text-white shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  Navy
                </button>
                <button
                  onClick={() => setActiveTheme('white')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition cursor-pointer ${
                    activeTheme === 'white' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                  }`}
                >
                  White
                </button>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div 
              key={refreshKey}
              className={`p-8 rounded-2xl border flex flex-col items-center justify-center min-h-[220px] relative transition-colors shadow-inner ${
                activeTheme === 'navy' 
                  ? 'bg-gradient-to-br from-[#101D43] to-[#162957] border-blue-950 text-white' 
                  : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className="absolute top-2 right-2 text-[10px] font-mono opacity-60">
                {previewSize}px · {activeTrigger}
              </div>

              <div className="py-2 cursor-pointer group">
                <AnimatedIcon 
                  name={selectedIconName} 
                  size={previewSize} 
                  trigger={activeTrigger}
                  colorScheme={activeTheme === 'navy' ? 'light' : 'default'}
                />
              </div>

              <p className={`text-[11px] font-medium text-center mt-3 max-w-[280px] ${
                activeTheme === 'navy' ? 'text-blue-200/90' : 'text-slate-500'
              }`}>
                Rê chuột lên icon để trải nghiệm vi tương tác đàn hồi
              </p>
            </div>

            {/* Interactive Parameter Controls */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                  <span>Kích thước vector:</span>
                  <span className="font-mono text-blue-700 font-black">{previewSize}px</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="150" 
                  value={previewSize} 
                  onChange={(e) => setPreviewSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cơ chế kích hoạt chuyển động:</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['hover', 'loop', 'load'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setActiveTrigger(t)}
                      className={`py-1.5 rounded-xl font-bold text-xs capitalize transition cursor-pointer ${
                        activeTrigger === t 
                          ? 'bg-blue-600 text-white shadow-2xs' 
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p><b>Tên icon:</b> {currentIcon?.label}</p>
                <p><b>Mô tả:</b> {currentIcon?.description}</p>
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-cyan-300 font-mono text-[11.5px]">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <span>React Component Code</span>
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
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Đã copy' : 'Sao chép'}</span>
                </button>
              </div>
              <pre className="pt-2 text-cyan-200 overflow-x-auto whitespace-pre">
                {snippet}
              </pre>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
