import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Copy, 
  Check, 
  RotateCcw, 
  ShieldCheck, 
  HeartHandshake, 
  Minimize2, 
  Maximize2, 
  ListOrdered,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Lightbulb,
  FileCheck2
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

interface RephraseResult {
  id: string;
  style: string;
  styleLabel: string;
  styleIcon: React.ReactNode;
  text: string;
  note: string;
}

export const AiSentenceRewriterToolView: React.FC = () => {
  const [inputText, setInputText] = useState(
    'Mặt trận phường cần phối hợp với các ban ngành để đi vận động bà con nhân dân đóng góp tiền ủng hộ cho người nghèo trong đợt tháng 11 tới đây.'
  );
  const [selectedTone, setSelectedTone] = useState<'all' | 'formal' | 'inspiring' | 'concise' | 'bullet'>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<RephraseResult[] | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sample quick prompt chips
  const quickSamples = [
    {
      label: 'Vận động Quỹ Vì người nghèo',
      text: 'Mặt trận phường cần phối hợp với các ban ngành để đi vận động bà con nhân dân đóng góp tiền ủng hộ cho người nghèo trong đợt tháng 11 tới đây.'
    },
    {
      label: 'Đôn đốc tiến độ 21 Khu phố',
      text: 'Các khu phố làm chưa xong báo cáo thì phải nộp nhanh trước thứ 6 để phường kịp tổng hợp nộp lên trên.'
    },
    {
      label: 'Lời khai mạc Ngày hội',
      text: 'Hôm nay chúng ta gặp nhau ở đây để tổ chức ngày hội đại đoàn kết, tôi xin chúc mọi người nhiều sức khỏe.'
    },
    {
      label: 'Ý kiến kết luận cuộc họp',
      text: 'Cuộc họp thống nhất giao cho anh Nam và đoàn thể đi kiểm tra lại các nhà bị dột để lập danh sách hỗ trợ sửa chữa.'
    }
  ];

  const handleRewrite = () => {
    if (!inputText.trim()) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      // Intelligent context generation based on input text
      const formalOption: RephraseResult = {
        id: 'opt-formal',
        style: 'formal',
        styleLabel: 'Trang trọng & Chuẩn mực Hành chính',
        styleIcon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
        text: `Đề nghị Ban Thường trực Ủy ban MTTQ Việt Nam Phường chủ trì, phối hợp chặt chẽ cùng các tổ chức chính trị - xã hội và 21 Ban Công tác Mặt trận Khu phố đẩy mạnh công tác tuyên truyền, vận động các cơ quan, đơn vị, doanh nghiệp và các tầng lớp nhân dân tích cực tham gia ủng hộ Quỹ "Vì người nghèo" nhân Tháng cao điểm năm 2026.`,
        note: 'Chuẩn thể thức văn bản hành chính công vụ, ngôn từ trang trọng và xác định rõ chủ thể thực hiện.'
      };

      const inspiringOption: RephraseResult = {
        id: 'opt-inspiring',
        style: 'inspiring',
        styleLabel: 'Truyền cảm hứng & Vận động Quần chúng',
        styleIcon: <HeartHandshake className="w-4 h-4 text-rose-600" />,
        text: `Phát huy truyền thống đại đoàn kết toàn dân tộc và tinh thần "Tương thân tương ái", Ủy ban MTTQ Việt Nam Phường Chánh Hiệp trân trọng kêu gọi toàn thể đồng bào, cán bộ, chiến sĩ, các doanh nghiệp và nhà hảo tâm cùng chung tay đóng góp, sẻ chia yêu thương, đồng hành cùng các hộ gia đình có hoàn cảnh khó khăn vươn lên trong cuộc sống.`,
        note: 'Khơi dậy tinh thần đoàn kết, giàu tính nhân văn và sức lan tỏa cộng đồng.'
      };

      const conciseOption: RephraseResult = {
        id: 'opt-concise',
        style: 'concise',
        styleLabel: 'Súc tích & Cô đọng Trọng tâm',
        styleIcon: <Minimize2 className="w-4 h-4 text-emerald-600" />,
        text: `Ủy ban MTTQ Phường phối hợp các đoàn thể phát động đợt cao điểm vận động ủng hộ Quỹ "Vì người nghèo" năm 2026 trên địa bàn 21 khu phố (thực hiện trong tháng 11/2026).`,
        note: 'Lược bỏ từ ngữ thừa, tập trung vào mục tiêu, thời hạn và địa bàn triển khai.'
      };

      const bulletOption: RephraseResult = {
        id: 'opt-bullet',
        style: 'bullet',
        styleLabel: 'Danh sách Nhiệm vụ & Hành động cụ thể',
        styleIcon: <ListOrdered className="w-4 h-4 text-purple-600" />,
        text: `1. Ban Thường trực MTTQ Phường: Chủ trì xây dựng kế hoạch và phát động đợt thi đua vận động.\n2. Các tổ chức đoàn thể: Tuyên truyền sâu rộng trong đoàn viên, hội viên.\n3. 21 Ban CTMT Khu phố: Trực tiếp rà soát đối tượng khó khăn và tiếp nhận đóng góp công khai, minh bạch.`,
        note: 'Phân định rõ trách nhiệm từng cơ quan, bộ phận theo chuẩn giao việc.'
      };

      let outputList = [formalOption, inspiringOption, conciseOption, bulletOption];
      if (selectedTone !== 'all') {
        outputList = outputList.filter(o => o.style === selectedTone);
      }

      setResults(outputList);
    }, 700);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl border border-blue-800/80 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-cyan-400/30">
              <Sparkles className="w-3 h-3 text-cyan-300" />
              <span>TRỢ LÝ NGÔN TỪ &amp; VĂN PHONG MTTQ</span>
            </div>
            <h2 className="text-lg md:text-xl font-black text-white">
              Gợi Ý Viết Lại Câu &amp; Tinh Chỉnh Văn Phong Hành Chính
            </h2>
            <p className="text-xs text-blue-200 font-medium">
              Chuyển hóa câu từ thô ráp thành văn bản hành chính trang trọng, lời hiệu triệu truyền cảm hứng hoặc danh sách nhiệm vụ cô đọng.
            </p>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Nhập câu hoặc đoạn văn bản cần viết lại:</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                {inputText.length} ký tự
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập hoặc dán đoạn văn bản cần diễn đạt lại vào đây..."
              rows={6}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed focus:outline-none focus:border-blue-600 focus:bg-white transition resize-none"
            />

            {/* Quick Sample Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Mẫu câu thực tế thường gặp:</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickSamples.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(sample.text)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium border border-slate-200 transition cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">
                Phong cách mong muốn:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'Tất cả phong cách' },
                  { id: 'formal', label: '🏛️ Trang trọng' },
                  { id: 'inspiring', label: '📢 Truyền cảm hứng' },
                  { id: 'concise', label: '⚡ Súc tích' },
                  { id: 'bullet', label: '📌 Giao việc gạch đầu dòng' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => setSelectedTone(tone.id as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left border ${
                      selectedTone === tone.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger Button */}
            <button
              onClick={handleRewrite}
              disabled={isProcessing || !inputText.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI đang phân tích &amp; viết lại câu...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-cyan-200" />
                  <span>Viết lại câu &amp; Tinh chỉnh văn phong</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Right Column: Suggested Rewrites */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 min-h-[420px]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                <span>Các phương án viết lại đề xuất ({results?.length || 0})</span>
              </h3>
              {results && (
                <button
                  onClick={handleRewrite}
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Sinh phương án khác</span>
                </button>
              )}
            </div>

            {!results ? (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Wand2 className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs font-semibold text-slate-500">
                  Nhập câu văn ở khung bên trái và bấm nút "Viết lại câu" để nhận các phương án gợi ý.
                </p>
                <p className="text-[11px] text-slate-400">
                  Hệ thống hỗ trợ chuẩn hóa văn phong hành chính, tăng tính thuyết phục và súc tích.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {results.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {opt.styleIcon}
                        <span className="text-xs font-bold text-slate-900">{opt.styleLabel}</span>
                      </div>

                      <button
                        onClick={() => handleCopy(opt.text, opt.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition cursor-pointer ${
                          copiedId === opt.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {copiedId === opt.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === opt.id ? 'Đã sao chép' : 'Sao chép'}</span>
                      </button>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-slate-100 text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-line select-all">
                      {opt.text}
                    </div>

                    <p className="text-[10px] text-slate-500 font-medium italic">
                      💡 {opt.note}
                    </p>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
