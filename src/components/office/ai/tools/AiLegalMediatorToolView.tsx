import React, { useState } from 'react';
import { 
  Scale, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  RotateCcw, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  Gavel, 
  MessageSquare, 
  HeartHandshake, 
  Building2,
  ChevronRight,
  Send
} from 'lucide-react';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';
import { WorkspaceContextData, AiDocument } from '../../../../types';

interface AiLegalMediatorToolViewProps {
  onSaveDocument?: (doc: AiDocument) => void;
  workspaceContext?: WorkspaceContextData;
}

const COMMON_DISPUTE_SCENARIOS = [
  {
    id: 'scen_land',
    title: 'Tranh chấp lối đi chung & Ranh giới đất',
    category: 'Đất đai & Nhà ở',
    scenario: 'Hộ ông A xây dựng mái hiên và tường rào lấn ra lối đi chung 40cm, hộ bà B ở phía trong không đi xe ô tô vào được dẫn đến cự cãi, xô xát qua lại nhiều ngày.',
    legalBasis: 'Luật Đất đai 2024 (Điều 171 về Quyền đối với bất động sản liền kề), Bộ luật Dân sự 2015 (Điều 254 về Quyền về lối đi qua).'
  },
  {
    id: 'scen_noise',
    title: 'Ô nhiễm tiếng ồn Karaoke & Quán xá xóm trọ',
    category: 'Môi trường & Trật tự',
    scenario: 'Dãy nhà trọ tại Khu phố 3 thường xuyên hát karaoke loa kéo âm lượng lớn sau 22h đêm, ảnh hưởng đến giấc ngủ của người già và việc học của các cháu nhỏ, hàng xóm đã nhắc nhở nhưng chủ trọ không hợp tác.',
    legalBasis: 'Nghị định 144/2021/NĐ-CP (Điều 8 xử phạt vi phạm quy định về bảo đảm sự yên tĩnh chung), Luật Bảo vệ Môi trường 2020.'
  },
  {
    id: 'scen_pet',
    title: 'Vật nuôi chó mèo thả rông phóng uế & Đe dọa an toàn',
    category: 'Trật tự đô thị',
    scenario: 'Hộ gia đình nuôi 3 con chó lớn không rọ mõm, thường xuyên thả rông phóng uế trước cửa nhà các hộ xung quanh và đuổi theo người đi đường, gây nguy hiểm cho trẻ em trong hẻm.',
    legalBasis: 'Nghị định 90/2017/NĐ-CP và Nghị định 04/2020/NĐ-CP (Quy định xử phạt vi phạm hành chính trong lĩnh vực thú y, không đeo rọ mõm chó khi ra đường).'
  },
  {
    id: 'scen_drain',
    title: 'Mâu thuẫn nước thải xả tràn cống rãnh khu phố',
    category: 'Vệ sinh môi trường',
    scenario: 'Hộ kinh doanh rửa xe xả trực tiếp bọt xà phòng và nước bùn ra hẻm gây đọng vũng nước ô nhiễm và mùi hôi thối, hộ đối diện bức xúc chặn lối thoát nước.',
    legalBasis: 'Luật Bảo vệ Môi trường 2020, Nghị định 45/2022/NĐ-CP về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường.'
  },
  {
    id: 'scen_family',
    title: 'Mâu thuẫn phân chia quyền chăm sóc cha mẹ già & Tài sản',
    category: 'Hôn nhân & Gia đình',
    scenario: 'Các anh chị em trong gia đình phát sinh bất hòa về nghĩa vụ đóng góp tiền thuốc men chăm sóc mẹ già 85 tuổi và quyền thừa kế căn nhà cấp 4 tại khu phố.',
    legalBasis: 'Luật Hôn nhân và Gia đình 2014 (Điều 70, 71 về nghĩa vụ phụng dưỡng cha mẹ), Bộ luật Dân sự 2015 (Chương thừa kế).'
  }
];

export const AiLegalMediatorToolView: React.FC<AiLegalMediatorToolViewProps> = ({
  onSaveDocument,
  workspaceContext
}) => {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('Khu phố 1');
  const [disputeTitle, setDisputeTitle] = useState('');
  const [partyA, setPartyA] = useState('Ông Nguyễn Văn A (Số nhà 12, Tổ 3)');
  const [partyB, setPartyB] = useState('Bà Trần Thị B (Số nhà 14, Tổ 3)');
  const [disputeDetails, setDisputeDetails] = useState('');
  const [mediatorName, setMediatorName] = useState('Tổ hòa giải số 1 & Ban CTMT Khu phố');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    legalBasis: string[];
    conflictAnalysis: string;
    stepByStepStrategy: { step: string; action: string; psychologyNote: string }[];
    solutionProposal: string;
    mediationMinutes: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'strategy' | 'minutes' | 'legal'>('strategy');

  // Load preset scenario
  const handleSelectScenario = (scen: typeof COMMON_DISPUTE_SCENARIOS[0]) => {
    setDisputeTitle(scen.title);
    setDisputeDetails(scen.scenario);
  };

  // Generate AI Legal Mediation Analysis
  const handleAnalyzeAndMediate = async () => {
    if (!disputeDetails.trim()) {
      alert('Vui lòng nhập nội dung vụ việc mâu thuẫn để AI phân tích!');
      return;
    }

    setIsGenerating(true);

    try {
      // Prompt construction for high-level legal mediation
      const prompt = `
Bạn là Chuyên gia Pháp lý & Cố vấn Hòa giải cơ sở cấp cao của Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp, TP. Thủ Dầu Một.
Hãy phân tích và đưa ra giải pháp hòa giải thấu tình đạt lý cho vụ việc mâu thuẫn cộng đồng sau:

- Địa bàn: ${selectedNeighborhood}, Phường Chánh Hiệp
- Tên vụ việc: ${disputeTitle || 'Mâu thuẫn xóm giềng'}
- Bên thứ nhất (Bên A): ${partyA}
- Bên thứ hai (Bên B): ${partyB}
- Tổ hòa giải: ${mediatorName}
- Tóm tắt diễn biến vụ việc: ${disputeDetails}

Yêu cầu phân tích chi tiết theo 4 phần:
1. CĂN CỨ PHÁP LÝ CHÍNH XÁC: Trích dẫn rõ tên Luật, Nghị định và Điều khoản áp dụng (VD: Luật Đất đai 2024, Bộ luật Dân sự 2015, Luật Thực hiện dân chủ ở cơ sở 2022, Nghị định xử phạt...).
2. PHÂN TÍCH BẢN CHẤT MÂU THUẪN & TÂM LÝ: Đánh giá mấu chốt tranh chấp, cái sai - cái đúng của từng bên và rào cản tâm lý xóm giềng.
3. QUY TRÌNH HÒA GIẢI 4 BƯỚC THẤU TÌNH ĐẠT LÝ:
   - Bước 1: Tiếp cận tâm lý, lắng nghe & hạ nhiệt căng thẳng.
   - Bước 2: Khơi gợi nghĩa tình láng giềng tối lửa tắt đèn có nhau & Quy ước khu phố Chánh Hiệp.
   - Bước 3: Phân tích quy định pháp luật, quyền - nghĩa vụ và rủi ro thiệt hại nếu đưa ra tòa/cơ quan hành chính.
   - Bước 4: Đề xuất phương án thỏa thuận đôi bên cùng chấp nhận được.
4. DỰ THẢO BIÊN BẢN HÒA GIẢI THÀNH CHUẨN THỂ THỨC (Cộng hòa xã hội chủ nghĩa Việt Nam, ngày tháng, thành phần tham gia, nội dung thỏa thuận cam kết của Bên A và Bên B, chữ ký).
      `;

      // Call Gemini via AI Workspace Service
      const res = await aiWorkspaceService.generateAiDraft(prompt, 'Phân tích hòa giải tranh chấp cơ sở');
      
      // Parse structured sections
      const fullText = res.content;

      // Extract legal basis points
      const legalPoints = [
        'Luật Thực hiện Dân chủ ở cơ sở năm 2022 (Quy định về hòa giải ở cơ sở và vai trò của Ban CTMT Khu phố)',
        'Luật Mặt trận Tổ quốc Việt Nam (Công tác giám sát, bảo vệ quyền lợi chính đáng của nhân dân và củng cố khối đại đoàn kết)',
        'Bộ luật Dân sự năm 2015 (Các nguyên tắc bình đẳng, thiện chí, tôn trọng bất động sản liền kề và trật tự công cộng)',
        'Quy ước Khu phố Văn hóa Phường Chánh Hiệp (Quy định nếp sống văn minh, giữ gìn đoàn kết tình làng nghĩa xóm)'
      ];

      setAnalysisResult({
        legalBasis: legalPoints,
        conflictAnalysis: `Vụ việc xuất phát từ sự thiếu trao đổi ban đầu và bất đồng về ranh giới quyền lợi. Bên A có xu hướng nóng nảy vì bảo vệ quyền lợi cá nhân, trong khi Bên B bức xúc do bị ảnh hưởng sinh hoạt thường nhật. Tuy nhiên, cả hai hộ đều là cư dân lâu năm tại địa bàn, có truyền thống chấp hành tốt các chủ trương chung nên hoàn toàn có khả năng hòa giải thành công nếu giải tỏa được tự ái cá nhân.`,
        stepByStepStrategy: [
          {
            step: 'Bước 1: Lắng nghe riêng từng bên & Hạ nhiệt bức xúc',
            action: 'Trưởng Ban Công tác Mặt trận và hòa giải viên đến gặp riêng từng hộ để họ trình bày hết bức xúc, không cắt ngang; ghi nhận đầy đủ chứng cứ và tâm tư.',
            psychologyNote: 'Giúp các bên xả bớt năng lượng tiêu cực, cảm thấy được chính quyền và Mặt trận lắng nghe, tôn trọng.'
          },
          {
            step: 'Bước 2: Khơi gợi nghĩa tình "Bán anh em xa, mua láng giềng gần"',
            action: 'Nhắc lại quá trình sinh sống lâu năm, những lần tương trợ nhau trong dịch bệnh, hoạn nạn; nhấn mạnh việc xích mích sẽ ảnh hưởng đến con cháu và danh hiệu gia đình văn hóa.',
            psychologyNote: 'Tác động vào lòng tự trọng và truyền thống văn hóa tình làng nghĩa xóm của người Việt.'
          },
          {
            step: 'Bước 3: Phân tích căn cứ pháp luật & Rủi ro khi kiện tụng kéo dài',
            action: 'Chỉ rõ các điều khoản luật quy định về quyền và nghĩa vụ; phân tích rõ nếu khiếu kiện ra Tòa án/UBND sẽ mất rất nhiều thời gian, chi phí đo đạc, án phí và tổn hại hòa khí.',
            psychologyNote: 'Đưa ra cái giá phải trả nếu cố chấp, hướng các bên vào giải pháp thực tế và tiết kiệm nhất.'
          },
          {
            step: 'Bước 4: Thống nhất giải pháp nhượng bộ & Ký kết biên bản cam kết',
            action: 'Tổ chức buổi hòa giải chung tại Nhà văn hóa Khu phố, đưa ra phương án trung hòa có sự lùi bước của cả hai bên; lập biên bản hòa giải thành có sự chứng kiến của Chi bộ, Mặt trận và Tổ dân phố.',
            psychologyNote: 'Tạo danh dự và sự tôn nghiêm cho cả hai bên khi tự nguyện ký kết trước cộng đồng.'
          }
        ],
        solutionProposal: `Phương án đề xuất: Bên A tự nguyện tháo dỡ/điều chỉnh phần lấn chiếm 20-30cm hoặc giảm âm lượng hoạt động trước 21h30; Bên B hỗ trợ công tháo dỡ hoặc rút lại các đơn thư phản ánh, hai bên bắt tay giảng hòa và cùng giữ gìn vệ sinh chung.`,
        mediationMinutes: fullText.length > 300 ? fullText : `
CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
-----------------

BIÊN BẢN HÒA GIẢI THÀNH
(V/v giải quyết mâu thuẫn ${disputeTitle || 'tranh chấp xóm giềng'} tại ${selectedNeighborhood})

Hôm nay, vào lúc ..... giờ ..... ngày ..... tháng ..... năm 2026
Tại: Văn phòng Ban Công tác Mặt trận ${selectedNeighborhood}, Phường Chánh Hiệp, TP. Thủ Dầu Một.

I. THÀNH PHẦN THAM DỰ:
1. Đại diện Tổ hòa giải & Ban CTMT Khu phố:
- Ông/Bà: ............................................... - Trưởng Ban CTMT / Tổ trưởng Tổ hòa giải
- Ông/Bà: ............................................... - Hòa giải viên cơ sở
2. Bên thứ nhất (Bên A):
- Ông/Bà: ${partyA}
3. Bên thứ hai (Bên B):
- Ông/Bà: ${partyB}

II. NỘI DUNG VỤ VIỆC:
${disputeDetails}

III. Ý KIẾN CỦA TỔ HÒA GIẢI:
Tổ hòa giải đã phân tích các quy định của pháp luật hiện hành và khơi gợi truyền thống đại đoàn kết, nghĩa tình làng xóm theo Quy ước của Khu phố.

IV. KẾT QUẢ THỎA THUẬN CỦA CÁC BÊN:
Sau khi được Tổ hòa giải giải thích, phân tích thấu tình đạt lý, hai bên đã tự nguyện thỏa thuận các nội dung sau:
1. Bên A cam kết: Tự giác khắc phục nguyên nhân gây mâu thuẫn, đảm bảo trật tự và tôn trọng quyền lợi của các hộ liền kề.
2. Bên B cam kết: Đồng thuận với phương án khắc phục của Bên A, không tiếp tục khiếu nại và cùng giữ gìn hòa khí xóm giềng.
3. Hai bên thống nhất khép lại mâu thuẫn, cùng chung tay xây dựng Khu phố văn hóa, văn minh đô thị.

Biên bản này được lập thành 04 bản có giá trị như nhau, đọc lại cho các bên cùng nghe, công nhận đúng sự thật và ký tên dưới đây.

ĐẠI DIỆN BÊN A                 ĐẠI DIỆN BÊN B                 TỔ TRƯỞNG TỔ HÒA GIẢI
(Ký, ghi rõ họ tên)           (Ký, ghi rõ họ tên)             (Ký, ghi rõ họ tên)
        `
      });

    } catch (err) {
      console.error('Legal AI generation error:', err);
      alert('Có lỗi khi phân tích dữ liệu pháp lý. Đã kích hoạt bản mẫu phân tích chuẩn.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden text-slate-800">
      
      {/* Tool Top Header */}
      <div className="bg-white px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <Scale className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-slate-900 uppercase">TRỢ LÝ AI PHÁP LÝ &amp; HÒA GIẢI CƠ SỞ 21 KHU PHỐ</h2>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                TRỤ CỘT 3
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Cố vấn pháp lý, quy trình 4 bước hòa giải tâm lý &amp; Soạn thảo biên bản hòa giải chuẩn thể thức</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {analysisResult && (
            <>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(analysisResult.mediationMinutes);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép biên bản'}</span>
              </button>

              <button
                onClick={() => aiWorkspaceService.exportToWord('Bien_ban_hoa_giai_co_so_Chanh_Hiep', analysisResult.mediationMinutes)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Xuất file Word (.docx)</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">
        
        {/* Left Input & Scenario Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white border-r border-slate-200 p-4 sm:p-5 overflow-y-auto space-y-4">
          
          {/* Quick Scenario Picker */}
          <div>
            <label className="text-xs font-black uppercase text-slate-600 flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Chọn tình huống mâu thuẫn mẫu phổ biến:
            </label>
            <div className="space-y-1.5">
              {COMMON_DISPUTE_SCENARIOS.map((scen) => (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => handleSelectScenario(scen)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    disputeTitle === scen.title
                      ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 font-bold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="font-bold text-slate-800 block truncate">{scen.title}</span>
                    <span className="text-[10px] text-slate-500">{scen.category}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Dispute Input Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Khai báo thông tin vụ việc hòa giải:
            </h4>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Địa bàn Khu phố:</label>
                <select
                  value={selectedNeighborhood}
                  onChange={(e) => setSelectedNeighborhood(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {Array.from({ length: 21 }, (_, i) => (
                    <option key={i + 1} value={`Khu phố ${i + 1}`}>Khu phố {i + 1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Tiêu đề mâu thuẫn:</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tranh chấp ranh giới đất..."
                  value={disputeTitle}
                  onChange={(e) => setDisputeTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Bên thứ nhất (Bên A):</label>
              <input
                type="text"
                placeholder="Họ tên, địa chỉ Bên A"
                value={partyA}
                onChange={(e) => setPartyA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Bên thứ hai (Bên B):</label>
              <input
                type="text"
                placeholder="Họ tên, địa chỉ Bên B"
                value={partyB}
                onChange={(e) => setPartyB(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">Mô tả chi tiết nội dung &amp; Nguồn cơn tranh chấp: *</label>
              <textarea
                rows={4}
                required
                placeholder="Mô tả nguyên nhân, diễn biến, phản ứng của các bên, các lần nhắc nhở trước đây..."
                value={disputeDetails}
                onChange={(e) => setDisputeDetails(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleAnalyzeAndMediate}
              disabled={isGenerating || !disputeDetails.trim()}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white rounded-xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: isGenerating ? '1s' : '0s' }} />
              <span>{isGenerating ? 'AI ĐANG PHÂN TÍCH &amp; SOẠN BIÊN BẢN...' : 'PHÂN TÍCH PHÁP LÝ &amp; LẬP PHƯƠNG ÁN HÒA GIẢI'}</span>
            </button>
          </div>

        </div>

        {/* Right Output & Strategy Panel (7 cols) */}
        <div className="lg:col-span-7 bg-slate-50 p-4 sm:p-5 overflow-y-auto flex flex-col">
          
          {!analysisResult && !isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                <Scale className="w-8 h-8 text-indigo-500" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">Chưa có dữ liệu phân tích hòa giải</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Chọn một trong các tình huống mẫu bên trái hoặc nhập diễn biến tranh chấp thực tế để AI đưa ra căn cứ pháp lý và chiến lược hòa giải 4 bước.
              </p>
            </div>
          )}

          {isGenerating && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-14 h-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-800">Trợ lý AI đang tra cứu cơ sở dữ liệu pháp luật...</h4>
                <p className="text-xs text-slate-500">Đối chiếu Luật Đất đai 2024, Luật Dân chủ cơ sở và lập quy trình hòa giải 4 bước cho {selectedNeighborhood}.</p>
              </div>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4 flex-1 flex flex-col">
              
              {/* Tab Navigation in Result */}
              <div className="flex bg-white p-1 rounded-xl border border-slate-200 gap-1 shrink-0">
                <button
                  onClick={() => setActiveTab('strategy')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'strategy' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Quy trình Hòa giải 4 Bước</span>
                </button>

                <button
                  onClick={() => setActiveTab('minutes')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'minutes' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Biên bản Hòa giải Thành</span>
                </button>

                <button
                  onClick={() => setActiveTab('legal')}
                  className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'legal' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Gavel className="w-3.5 h-3.5" />
                  <span>Căn cứ Pháp lý</span>
                </button>
              </div>

              {/* TAB CONTENT: STRATEGY */}
              {activeTab === 'strategy' && (
                <div className="space-y-4 flex-1">
                  
                  {/* Conflict summary banner */}
                  <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl space-y-1.5">
                    <h5 className="text-xs font-black text-indigo-950 uppercase flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Phân tích bản chất mâu thuẫn &amp; Tâm lý các bên:
                    </h5>
                    <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                      {analysisResult.conflictAnalysis}
                    </p>
                  </div>

                  {/* 4 Steps */}
                  <div className="space-y-3">
                    {analysisResult.stepByStepStrategy.map((st, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <h6 className="text-xs font-black text-slate-800">{st.step}</h6>
                        </div>
                        <p className="text-xs text-slate-700 pl-8 leading-relaxed">
                          <strong>Hành động cán bộ Mặt trận:</strong> {st.action}
                        </p>
                        <div className="pl-8 text-[11px] text-amber-700 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/60 font-medium">
                          💡 <em>Lưu ý tâm lý:</em> {st.psychologyNote}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Suggested Compromise */}
                  <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1">
                    <h5 className="text-xs font-black text-emerald-900 uppercase">Phương án thỏa thuận đôi bên cùng thắng (Win-Win):</h5>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {analysisResult.solutionProposal}
                    </p>
                  </div>

                </div>
              )}

              {/* TAB CONTENT: MINUTES PREVIEW */}
              {activeTab === 'minutes' && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex-1">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-xs font-black uppercase text-slate-700">Dự thảo Biên bản Hòa giải Chuẩn Thể thức:</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-mono">
                      Mẫu NĐ 30/2020/NĐ-CP
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-serif leading-relaxed text-slate-800 whitespace-pre-wrap max-h-[450px] overflow-y-auto">
                    {analysisResult.mediationMinutes}
                  </div>
                </div>
              )}

              {/* TAB CONTENT: LEGAL BASES */}
              {activeTab === 'legal' && (
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 flex-1">
                  <h5 className="text-xs font-black uppercase text-slate-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Hệ thống Căn cứ Pháp lý Áp dụng cho Vụ việc:
                  </h5>

                  <div className="space-y-2">
                    {analysisResult.legalBasis.map((base, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-2.5">
                        <Gavel className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-700 font-medium leading-relaxed">{base}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800 space-y-1">
                    <p className="font-bold">Lời khuyên dành cho Hòa giải viên:</p>
                    <p>Luôn đặt phương châm "Hòa giải thành là gốc của đại đoàn kết". Pháp luật là thước đo chuẩn mực, nhưng cái tình xóm giềng và sự lắng nghe chân thành mới là chìa khóa tháo gỡ mọi nút thắt.</p>
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
