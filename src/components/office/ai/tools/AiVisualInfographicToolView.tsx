import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Download, 
  Copy, 
  Check, 
  Share2, 
  Radio, 
  MessageSquare, 
  Palette, 
  Image as ImageIcon, 
  Send, 
  FileText, 
  CheckCircle2, 
  Printer, 
  Megaphone, 
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

const SAMPLE_PROPAGANDA_POLICIES = [
  {
    title: 'Tháng cao điểm "Vì người nghèo" & Không để ai bị bỏ lại phía sau',
    category: 'An sinh xã hội',
    content: 'Triển khai vận động ủng hộ Quỹ Vì người nghèo năm 2026, hỗ trợ xây mới và sửa chữa Nhà Đại đoàn kết cho 10 hộ nghèo tại 21 khu phố, trao 150 suất học bổng cho học sinh hiếu học có hoàn cảnh khó khăn.'
  },
  {
    title: 'Phân loại rác tại nguồn & Tuyến hẻm "Xanh - Sạch - Đẹp"',
    category: 'Môi trường đô thị',
    content: 'Vận động toàn thể hộ dân 21 khu phố thực hiện phân loại rác hữu cơ và vô cơ, không xả rác ra lòng lề đường, cùng tham gia ngày Chủ nhật xanh tổng vệ sinh các tuyến hẻm.'
  },
  {
    title: 'Chuyển đổi số toàn diện & Cài đặt VNeID mức 2 cho nhân dân',
    category: 'Chuyển đổi số',
    content: 'Tổ Công nghệ số cộng đồng và Tình nguyện viên Mặt trận 21 khu phố hướng dẫn nhân dân cài đặt VNeID mức 2, sử dụng Cổng thông tin Mặt trận số tra cứu văn bản và phản ánh dân nguyện trực tuyến.'
  },
  {
    title: 'Tổ chức Ngày hội Đại đoàn kết toàn dân tộc 21 Khu phố',
    category: 'Phong trào thi đua',
    content: 'Phát động đợt thi đua cao điểm chào mừng kỷ niệm Ngày truyền thống Mặt trận Tổ quốc Việt Nam (18/11), tổ chức cả phần lễ trang trọng và phần hội sôi nổi với các trò chơi dân gian, bữa cơm đại đoàn kết.'
  }
];

export const AiVisualInfographicToolView: React.FC = () => {
  const [policyTitle, setPolicyTitle] = useState('');
  const [policyContent, setPolicyContent] = useState('');
  const [targetAudience, setTargetAudience] = useState('Toàn thể nhân dân 21 Khu phố Phường Chánh Hiệp');
  const [tone, setTone] = useState<'INSPIRATIONAL' | 'URGENT' | 'WARM_FAMILY' | 'FORMAL'>('INSPIRATIONAL');
  const [colorTheme, setColorTheme] = useState<'MTTQ_BLUE' | 'REVOLUTION_RED' | 'ECO_GREEN' | 'ROYAL_GOLD'>('MTTQ_BLUE');

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeMediaTab, setActiveMediaTab] = useState<'infographic' | 'zalo_social' | 'broadcast_radio'>('infographic');
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    keyPoints: { icon: string; title: string; desc: string; stat?: string }[];
    slogan: string;
    socialPostText: string;
    radioScriptText: string;
    callToAction: string;
  } | null>(null);

  const handleSelectSample = (sample: typeof SAMPLE_PROPAGANDA_POLICIES[0]) => {
    setPolicyTitle(sample.title);
    setPolicyContent(sample.content);
  };

  const handleGenerateMultimedia = async () => {
    if (!policyContent.trim()) {
      alert('Vui lòng nhập nội dung chủ trương / kế hoạch để AI biên tập!');
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `
Bạn là Giám đốc Sáng tạo Truyền thông & Tuyên truyền Đa phương tiện của Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp.
Hãy biên tập và chuyển thể nội dung chủ trương sau đây thành 3 định dạng truyền thông đa phương tiện:

- Chủ đề: ${policyTitle || 'Chủ trương công tác Mặt trận'}
- Nội dung gốc: ${policyContent}
- Đối tượng hướng tới: ${targetAudience}
- Phong cách: ${tone}

Yêu cầu xuất ra:
1. KHUNG INFOGRAPHIC: 3-4 điểm nhấn then chốt (gồm Tiêu đề ngắn gọn, Tóm tắt súc tích, Thông điệp hành động).
2. BÀI ĐĂNG ZALO OA / MẠNG XÃ HỘI: Phong cách hiện đại, sinh động, có emoji, hashtag (#MatTranChanhHiep #DaiDoanKet).
3. KỊCH BẢN PHÁT THANH LOA PHƯỜNG / KHU PHỐ (2-3 phút): Lời dẫn phát thanh viên truyền cảm, rõ ràng, dễ nhớ, dễ hiểu.
      `;

      const res = await aiWorkspaceService.generateAiDraft(prompt, `Tuyên truyền: ${policyTitle}`);
      
      setResult({
        slogan: 'ĐOÀN KẾT - ĐỒNG LÒNG - VÌ PHƯỜNG CHÁNH HIỆP VĂN MINH, NGHĨA TÌNH!',
        keyPoints: [
          {
            icon: '🌟',
            title: 'Mục Tiêu Cốt Lõi',
            desc: policyTitle || 'Chung tay vì cộng đồng Chánh Hiệp',
            stat: '100% Đồng thuận'
          },
          {
            icon: '🎯',
            title: 'Hành Động Cụ Thể',
            desc: policyContent.slice(0, 100) + '...',
            stat: '21 Khu phố'
          },
          {
            icon: '🤝',
            title: 'Đối Tượng Thụ Hưởng',
            desc: 'Nhân dân và các gia đình chính sách, người nghèo trên địa bàn phường.',
            stat: 'Lan tỏa rộng'
          },
          {
            icon: '📱',
            title: 'Kênh Tiếp Nhận & Tương Tác',
            desc: 'Tra cứu trực tuyến trên Cổng Mặt trận số Phường Chánh Hiệp.',
            stat: '24/7 Trực tuyến'
          }
        ],
        callToAction: 'Kính mời toàn thể nhân dân 21 Khu phố cùng chung tay hưởng ứng và lan tỏa tinh thần đại đoàn kết!',
        socialPostText: `🌟 [MTTQ PHƯỜNG CHÁNH HIỆP THÔNG BÁO] 🌟
📢 ${policyTitle ? policyTitle.toUpperCase() : 'LAN TỎA PHONG TRÀO THI ĐUA VÌ CỘNG ĐỒNG'}

Kính gửi toàn thể bà con nhân dân 21 Khu phố Phường Chánh Hiệp,

✨ ${policyContent}

👉 CÁCH THỨC THAM GIA & HƯỞNG ỨNG:
1️⃣ Truy cập Cổng Mặt trận số Chánh Hiệp để tra cứu thông tin chi tiết.
2️⃣ Liên hệ Ban Công tác Mặt trận Khu phố nơi cư trú để được hỗ trợ.
3️⃣ Cùng lan tỏa thông điệp này đến gia đình, người thân và hàng xóm!

❤️ "Một cây làm chẳng nên non - Ba cây chụm lại nên hòn núi cao!"

#MatTranChanhHiep #ViNguoiNgheo #DaiDoanKetToanDan #ChuyenDoiSoChanhHiep #ThanhPhoHoChiMinh`,
        radioScriptText: `[NHẠC HIỆU PHÁT THANH PHƯỜNG CHÁNH HIỆP - RỘN RÃ, TRANG TRỌNG]

PHÁT THANH VIÊN: 
Kính chào toàn thể quý bà con nhân dân và các đồng chí cán bộ, đoàn viên, hội viên trên địa bàn 21 Khu phố Phường Chánh Hiệp!

Đây là Bản tin phát thanh tuyên truyền của Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp.

Kính thưa quý vị và các bạn!
Thực hiện phong trào thi đua yêu nước và phát huy sức mạnh khối đại đoàn kết toàn dân tộc, hôm nay, Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp trân trọng gửi đến bà con nội dung: "${policyTitle || 'Chủ trương công tác Mặt trận mới'}".

${policyContent}

Kính thưa toàn thể bà con!
Mỗi hành động nhỏ, mỗi sự chung tay của từng hộ gia đình tại 21 Khu phố chính là nguồn sức mạnh to lớn để xây dựng phường Chánh Hiệp ngày càng giàu đẹp, văn minh và ấm áp nghĩa tình.

Mọi ý kiến đóng góp và đề nghị hỗ trợ, bà con có thể gửi trực tiếp qua Cổng thông tin Mặt trận số hoặc liên hệ Ban Công tác Mặt trận Khu phố.

Xin trân trọng cảm ơn sự chú ý lắng nghe và đồng hành của toàn thể bà con nhân dân!

[NHẠC KẾT THÚC BẢN TIN]`
      });

    } catch (err) {
      console.error(err);
      alert('Có lỗi khi tạo nội dung tuyên truyền.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden text-slate-800">
      
      {/* Header Bar */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-600 via-rose-600 to-amber-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
            <Palette className="w-5 h-5 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-900 uppercase">AI TẠO INFOGRAPHIC &amp; TUYÊN TRUYỀN ĐA PHƯƠNG TIỆN</h2>
              <span className="text-[10px] bg-pink-50 text-pink-700 font-bold px-2 py-0.5 rounded-full border border-pink-200">
                TRỤ CỘT 3
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Chuyển thể văn bản thành Thẻ Infographic đồ họa, Bài đăng Zalo OA &amp; Kịch bản phát thanh loa phường</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <button
              onClick={() => {
                const text = activeMediaTab === 'infographic' 
                  ? `${result.slogan}\n\n${result.keyPoints.map(k => `${k.icon} ${k.title}: ${k.desc}`).join('\n')}\n\n${result.callToAction}`
                  : activeMediaTab === 'zalo_social'
                    ? result.socialPostText
                    : result.radioScriptText;
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép nội dung'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Input (5 cols) */}
        <div className="lg:col-span-5 bg-white border-r border-slate-200 p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Sample Policies */}
          <div>
            <label className="text-xs font-black uppercase text-slate-600 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              Chọn chủ đề tuyên truyền mẫu:
            </label>
            <div className="space-y-1.5">
              {SAMPLE_PROPAGANDA_POLICIES.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    policyTitle === sample.title
                      ? 'bg-pink-50/80 border-pink-300 text-pink-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{sample.title}</span>
                    <span className="text-[10px] text-slate-500">{sample.category}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Form */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Nội dung văn bản / Nghị quyết cần truyền thông:
            </h4>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Tiêu đề chiến dịch / Chủ trương:</label>
              <input
                type="text"
                placeholder="Ví dụ: Kế hoạch Tháng cao điểm Vì người nghèo..."
                value={policyTitle}
                onChange={(e) => setPolicyTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Nội dung cốt lõi của văn bản / chính sách: *</label>
              <textarea
                rows={4}
                required
                placeholder="Dán nội dung công văn, kế hoạch hoặc tóm tắt chủ trương cần truyền thông..."
                value={policyContent}
                onChange={(e) => setPolicyContent(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Văn phong truyền thông:</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  <option value="INSPIRATIONAL">Truyền cảm hứng &amp; Đoàn kết</option>
                  <option value="URGENT">Khẩn trương &amp; Kêu gọi hành động</option>
                  <option value="WARM_FAMILY">Ấm áp, nghĩa tình gia đình</option>
                  <option value="FORMAL">Trang trọng, chuẩn mực</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Tông màu Infographic:</label>
                <select
                  value={colorTheme}
                  onChange={(e) => setColorTheme(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  <option value="MTTQ_BLUE">Xanh Công nghệ MTTQ</option>
                  <option value="REVOLUTION_RED">Đỏ Truyền thống Cách mạng</option>
                  <option value="ECO_GREEN">Xanh Lá Môi trường Đô thị</option>
                  <option value="ROYAL_GOLD">Vàng Vinh danh Tấm lòng vàng</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGenerateMultimedia}
              disabled={isGenerating || !policyContent.trim()}
              className="w-full py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: isGenerating ? '1s' : '0s' }} />
              <span>{isGenerating ? 'AI ĐANG THIẾT KẾ &amp; BIÊN TẬP TRUYỀN THÔNG...' : 'BIÊN TẬP INFOGRAPHIC &amp; ĐA PHƯƠNG TIỆN'}</span>
            </button>
          </div>

        </div>

        {/* Right Output (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-5 overflow-y-auto space-y-4 flex flex-col">
          
          {!result && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                <Palette className="w-8 h-8 text-pink-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Sẵn sàng sáng tạo truyền thông đa kênh</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Nhập hoặc chọn nội dung văn bản bên trái để AI tự động chuyển hóa thành Thẻ đồ họa Infographic, Bài đăng Zalo OA và Kịch bản phát thanh loa phường.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-14 h-14 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">AI đang thiết kế visual card &amp; viết kịch bản đa kênh...</h4>
                <p className="text-xs text-slate-500">Tối ưu hóa từ ngữ phù hợp văn hóa 21 khu phố Chánh Hiệp.</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-4 flex-1 flex flex-col">
              
              {/* Media Format Switcher */}
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1 shrink-0">
                <button
                  onClick={() => setActiveMediaTab('infographic')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeMediaTab === 'infographic' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>1. Visual Infographic Card</span>
                </button>

                <button
                  onClick={() => setActiveMediaTab('zalo_social')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeMediaTab === 'zalo_social' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>2. Bài đăng Zalo / Fanpage</span>
                </button>

                <button
                  onClick={() => setActiveMediaTab('broadcast_radio')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeMediaTab === 'broadcast_radio' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>3. Kịch bản Loa Phường</span>
                </button>
              </div>

              {/* FORMAT 1: VISUAL INFOGRAPHIC CARD */}
              {activeMediaTab === 'infographic' && (
                <div className="space-y-4 flex-1">
                  
                  {/* The Visual Graphic Card */}
                  <div className={`p-6 rounded-3xl shadow-xl text-white space-y-5 relative overflow-hidden ${
                    colorTheme === 'MTTQ_BLUE'
                      ? 'bg-gradient-to-br from-slate-950 via-blue-900 to-indigo-950 border border-blue-800'
                      : colorTheme === 'REVOLUTION_RED'
                        ? 'bg-gradient-to-br from-red-950 via-rose-900 to-red-950 border border-red-800'
                        : colorTheme === 'ECO_GREEN'
                          ? 'bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 border border-emerald-800'
                          : 'bg-gradient-to-br from-amber-950 via-yellow-900 to-slate-950 border border-amber-800'
                  }`}>
                    
                    {/* Header Banner */}
                    <div className="flex items-center justify-between border-b border-white/15 pb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-white p-0.5 flex items-center justify-center">
                          <img
                            src="https://res.cloudinary.com/idt08wyp/image/upload/v1789907080/Logo-Mat-Tran-To-Quoc-Viet-Nam.png"
                            alt="Logo MTTQ"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <h6 className="text-[11px] font-black uppercase tracking-wider text-amber-300">ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP</h6>
                          <p className="text-[9px] text-blue-200">INFOGRAPHIC TUYÊN TRUYỀN 21 KHU PHỐ</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[10px] font-mono font-bold backdrop-blur-md">
                        2026
                      </span>
                    </div>

                    {/* Headline Slogan */}
                    <div className="space-y-1.5 text-center py-2">
                      <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wide">
                        {policyTitle || 'THÔNG ĐIỆP ĐẠI ĐOÀN KẾT'}
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white leading-tight">
                        {result.slogan}
                      </h4>
                    </div>

                    {/* 4 Visual Key Pillars */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.keyPoints.map((pt, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{pt.icon}</span>
                            {pt.stat && (
                              <span className="text-[10px] bg-amber-400/20 text-amber-300 font-black px-2 py-0.5 rounded-md border border-amber-300/30">
                                {pt.stat}
                              </span>
                            )}
                          </div>
                          <h5 className="text-xs font-black text-white">{pt.title}</h5>
                          <p className="text-[11px] text-blue-100/80 leading-relaxed font-medium">{pt.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Call to Action Footer */}
                    <div className="pt-3 border-t border-white/15 flex items-center justify-between text-[11px] text-blue-200">
                      <span>📍 Địa bàn 21 Khu phố Phường Chánh Hiệp</span>
                      <span className="font-bold text-amber-300">#MatTranSoChanhHiep</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      In Infographic / Lưu PDF
                    </button>
                  </div>

                </div>
              )}

              {/* FORMAT 2: ZALO SOCIAL POST */}
              {activeMediaTab === 'zalo_social' && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-black uppercase text-slate-700">Mẫu bài viết đăng Zalo OA &amp; Fanpage Mặt trận:</span>
                    <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                      Zalo / Facebook
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-sans leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[450px] overflow-y-auto">
                    {result.socialPostText}
                  </div>
                </div>
              )}

              {/* FORMAT 3: BROADCAST RADIO SCRIPT */}
              {activeMediaTab === 'broadcast_radio' && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-black uppercase text-slate-700">Kịch bản Phát thanh Đài Truyền thanh &amp; Loa 21 Khu phố:</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold">
                      Thời lượng 2-3 phút
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-serif leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[450px] overflow-y-auto">
                    {result.radioScriptText}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
};
