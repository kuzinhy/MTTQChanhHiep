import React, { useState, useEffect } from 'react';
import { 
  Type, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  Phone, 
  HelpCircle, 
  Bot, 
  BookOpen, 
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface CitizenAccessibilityToolbarProps {
  onOpenAiAssistant?: () => void;
  onOpenDirectory?: () => void;
}

export const CitizenAccessibilityToolbar: React.FC<CitizenAccessibilityToolbarProps> = ({
  onOpenAiAssistant,
  onOpenDirectory
}) => {
  const [fontSizeScale, setFontSizeScale] = useState<'normal' | 'medium' | 'large'>('normal');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Apply font scale to document body / root
  useEffect(() => {
    const root = document.documentElement;
    if (fontSizeScale === 'large') {
      root.style.fontSize = '18px';
    } else if (fontSizeScale === 'medium') {
      root.style.fontSize = '17px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSizeScale]);

  // Apply high contrast mode class
  useEffect(() => {
    if (isHighContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [isHighContrast]);

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn chưa hỗ trợ tính năng đọc màn hình tự động.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = 'Cổng Thông tin Điện tử và Điều hành số Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, Thành phố Thủ Dầu Một. Kính chào quý bà con nhân dân. Cổng thông tin cung cấp các tiện ích tra cứu văn bản, phản ánh ý kiến cử tri, tham gia khảo sát dân ý và bản đồ số 21 khu phố.';
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleReset = () => {
    setFontSizeScale('normal');
    setIsHighContrast(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="bg-slate-900 text-slate-200 text-[11px] font-medium border-b border-slate-800 px-3 py-1.5 hidden sm:block">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Accessibility Tools for Elderly & Citizens */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Trợ năng công dân:</span>
          </span>

          {/* Font Size Adjusters */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setFontSizeScale('normal')}
              className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                fontSizeScale === 'normal' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
              title="Cỡ chữ chuẩn"
            >
              A
            </button>
            <button
              onClick={() => setFontSizeScale('medium')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors cursor-pointer ${
                fontSizeScale === 'medium' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
              title="Cỡ chữ vừa (+10%)"
            >
              A+
            </button>
            <button
              onClick={() => setFontSizeScale('large')}
              className={`px-2 py-0.5 rounded text-xs font-black transition-colors cursor-pointer ${
                fontSizeScale === 'large' ? 'bg-blue-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
              title="Cỡ chữ lớn (+20%) cho người cao tuổi"
            >
              A++
            </button>
          </div>

          {/* Text to Speech Voice Reader */}
          <button
            onClick={handleToggleSpeech}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
              isSpeaking
                ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Đọc tóm tắt trang thông tin bằng giọng đọc tiếng Việt"
          >
            {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-amber-400" />}
            <span>{isSpeaking ? 'Dừng đọc' : 'Đọc trang'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
              isHighContrast
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
            }`}
            title="Bật/Tắt chế độ tương phản cao cho người thị lực yếu"
          >
            {isHighContrast ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3 text-blue-400" />}
            <span>Tương phản cao</span>
          </button>

          {(fontSizeScale !== 'normal' || isHighContrast) && (
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-slate-200 text-[10px] font-medium inline-flex items-center gap-1 underline cursor-pointer"
              title="Đặt lại cài đặt mặc định"
            >
              <RotateCcw className="w-2.5 h-2.5" />
              <span>Mặc định</span>
            </button>
          )}
        </div>

        {/* Right: Quick Emergency & Assistance Links */}
        <div className="flex items-center gap-3">
          {onOpenDirectory && (
            <button
              onClick={onOpenDirectory}
              className="text-slate-300 hover:text-white text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              <span>Danh bạ 21 Khu phố</span>
            </button>
          )}

          <a
            href="https://dichvucong.gov.vn"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-300 hover:text-amber-200 text-[10px] font-bold inline-flex items-center gap-1 transition-colors"
          >
            <span>Cổng DVC Quốc gia</span>
          </a>
        </div>

      </div>
    </div>
  );
};
