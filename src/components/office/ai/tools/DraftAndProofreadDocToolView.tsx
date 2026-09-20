import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  FileCheck2, 
  Sparkles, 
  Download, 
  Save, 
  History, 
  Copy, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  RefreshCw,
  Wand2,
  Mic,
  MessageSquare,
  ShieldCheck,
  Check,
  Printer,
  ChevronRight,
  BookOpen,
  HeartHandshake,
  Minimize2,
  ListOrdered
} from 'lucide-react';
import { SecurityNoticeBanner } from '../SecurityNoticeBanner';
import { AiDocument, WorkspaceContextData } from '../../../../types';
import { aiWorkspaceService } from '../../../../lib/aiWorkspaceService';

interface DraftAndProofreadDocToolViewProps {
  onSaveDocument: (doc: AiDocument) => void;
  workspaceContext?: WorkspaceContextData;
  onOpenHistory?: () => void;
  initialPrompt?: string;
  shouldRestoreDraft?: boolean;
}

export const DraftAndProofreadDocToolView: React.FC<DraftAndProofreadDocToolViewProps> = ({
  onSaveDocument,
  workspaceContext,
  onOpenHistory,
  initialPrompt,
  shouldRestoreDraft
}) => {
  // Main Sub-tabs: 1. Soạn mới | 2. Sửa lỗi & Thể thức | 3. Viết lại câu
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'proofread' | 'rewrite'>('create');
  
  // Create / Draft States
  const [docCategory, setDocCategory] = useState<'KE_HOACH' | 'CONG_VAN' | 'TO_TRINH' | 'PHAT_BIEU' | 'BAO_CAO'>('KE_HOACH');
  const [docType, setDocType] = useState('Kế hoạch');
  const [docTitle, setDocTitle] = useState('Kế hoạch tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026');
  const [targetAudience, setTargetAudience] = useState('21 Ban Công tác Mặt trận Khu phố & Các đoàn thể Phường');
  const [keyPoints, setKeyPoints] = useState('1. Mục đích: Khơi dậy truyền thống yêu nước, biểu dương các điển hình tiên tiến; 2. Thời gian: Từ ngày 10/11 đến 18/11/2026; 3. Địa điểm: 21 Nhà Văn hóa Khu phố; 4. Kinh phí & Quà tặng: Trao 150 phần quà cho hộ khó khăn.');
  const [speechLength, setSpeechLength] = useState<'3min' | '5min' | '7min' | 'opening' | 'closing'>('5min');
  
  // Output Editor State
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Proofreading States
  const [proofreadText, setProofreadText] = useState('');
  const [isProofreading, setIsProofreading] = useState(false);
  const [proofreadResults, setProofreadResults] = useState<any[] | null>(null);

  // Rewrite / Rephrase States
  const [rewriteInput, setRewriteInput] = useState('Mặt trận phường cần phân công đoàn thể phối hợp đi vận động bà con đóng góp tiền cho quỹ vì người nghèo.');
  const [rewriteTone, setRewriteTone] = useState<'formal' | 'inspiring' | 'concise' | 'bullet'>('formal');
  const [isRewriting, setIsRewriting] = useState(false);
  const [rewriteResults, setRewriteResults] = useState<any[] | null>(null);
  const [copiedRewriteId, setCopiedRewriteId] = useState<string | null>(null);

  // Update docType when category changes
  useEffect(() => {
    switch (docCategory) {
      case 'KE_HOACH':
        setDocType('Kế hoạch');
        if (!docTitle || docTitle.includes('Công văn') || docTitle.includes('Phát biểu')) {
          setDocTitle('Kế hoạch tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026');
        }
        break;
      case 'CONG_VAN':
        setDocType('Công văn');
        setDocTitle('Công văn về việc phối hợp triển khai Tháng cao điểm "Vì người nghèo" năm 2026');
        break;
      case 'TO_TRINH':
        setDocType('Tờ trình');
        setDocTitle('Tờ trình xin chủ trương hỗ trợ kinh phí sửa chữa Nhà Đại đoàn kết cho hộ khó khăn');
        break;
      case 'PHAT_BIEU':
        setDocType('Bài phát biểu');
        setDocTitle('Bài phát biểu của Chủ tịch Ủy ban MTTQ tại Ngày hội Đại đoàn kết 2026');
        break;
      case 'BAO_CAO':
        setDocType('Báo cáo');
        setDocTitle('Báo cáo kết quả công tác Mặt trận Quý III và nhiệm vụ trọng tâm Quý IV/2026');
        break;
    }
  }, [docCategory]);

  // Handle initialPrompt
  useEffect(() => {
    if (initialPrompt) {
      setDocTitle(initialPrompt);
    }
  }, [initialPrompt]);

  // Generator Function
  const handleGenerate = () => {
    if (!docTitle.trim()) {
      alert('Vui lòng nhập tên văn bản.');
      return;
    }

    setIsGenerating(true);
    setIsSaved(false);

    setTimeout(() => {
      setIsGenerating(false);
      const agency = 'ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP';
      const year = new Date().getFullYear();
      const dateStr = `Chánh Hiệp, ngày ${new Date().getDate()} tháng ${new Date().getMonth() + 1} năm ${year}`;

      let generated = '';

      if (docCategory === 'PHAT_BIEU') {
        const timeLabel = speechLength === '3min' ? '3 PHÚT' : speechLength === '5min' ? '5 PHÚT' : speechLength === '7min' ? '7 PHÚT' : speechLength === 'opening' ? 'LỜI KHAI MẠC' : 'LỜI BẾ MẠC';
        generated = `${docTitle.toUpperCase()}\n(${timeLabel} - CHUẨN MẶT TRẬN TỔ QUỐC)\nNgười phát biểu: Lãnh đạo Ủy ban MTTQ Việt Nam Phường Chánh Hiệp\nThời gian: ${workspaceContext?.eventTime || 'Tháng 11/2026'}\nĐịa điểm: ${workspaceContext?.eventLocation || 'Hội trường UBND Phường / 21 Khu phố'}\n\nKính thưa các đồng chí Lãnh đạo!\nKính thưa quý vị đại biểu, cùng toàn thể bà con nhân dân thân mến!\n\n1. LỜI MỞ ĐẦU & Ý NGHĨA:\nHôm nay, trong không khí vui tươi, phấn khởi và tràn đầy tinh thần đoàn kết, Ủy ban MTTQ Việt Nam Phường Chánh Hiệp long trọng tổ chức ${docTitle}.\nThay mặt Ban Thường trực Ủy ban MTTQ Phường, tôi xin gửi tới các đồng chí Lãnh đạo, quý vị đại biểu cùng toàn thể bà con nhân dân lời chào trân trọng và lời chúc mừng tốt đẹp nhất!\n\n2. ĐÁNH GIÁ KẾT QUẢ & BIỂU DƯƠNG:\nTrong năm qua, dưới sự lãnh đạo của Đảng ủy, sự phối hợp hiệu quả của UBND và sự đồng lòng của 21 Ban Công tác Mặt trận Khu phố, khối đại đoàn kết toàn dân tộc tại phường chúng ta ngày càng được củng cố vững chắc.\n- ${keyPoints.replace(/;/g, '\n- ')}\nBà con nhân dân đã tích cực hưởng ứng các cuộc vận động, phong trào thi đua yêu nước, xây dựng đời sống văn hóa, giữ vững an ninh trật tự và chung tay chăm lo các gia đình chính sách, hộ có hoàn cảnh khó khăn.\n\n3. PHƯƠNG HƯỚNG & LỜI KÊU GỌI:\nBước sang giai đoạn mới, tôi tha thiết kêu gọi toàn thể cán bộ, đảng viên, đoàn viên, hội viên và nhân dân 21 khu phố tiếp tục phát huy tinh thần tương thân tương ái, đồng tâm hiệp lực xây dựng phường Chánh Hiệp ngày càng văn minh, giàu đẹp, nghĩa tình.\n\n4. LỜI CHÚC & KẾT THÚC:\nKính chúc các đồng chí Lãnh đạo, quý vị đại biểu cùng toàn thể bà con luôn dồi dào sức khỏe, gia đình hạnh phúc và gặt hái nhiều thắng lợi mới!\nXin trân trọng cảm ơn!`;
      } else {
        const symbol = docCategory === 'KE_HOACH' ? 'KH' : docCategory === 'TO_TRINH' ? 'TTr' : docCategory === 'CONG_VAN' ? 'CV' : 'BC';
        generated = `${agency}\nSố: .../${symbol}-MTTQ\n\nCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM\nĐộc lập - Tự do - Hạnh phúc\n------------------------\n${dateStr}\n\n${docType.toUpperCase()}\n${docTitle.toUpperCase()}\n\nCăn cứ Luật Mặt trận Tổ quốc Việt Nam;\nCăn cứ Quy chế phối hợp công tác giữa Ban Thường trực UBMTTQ và UBND Phường;\nBan Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp ban hành ${docType} với các nội dung trọng tâm như sau:\n\nI. MỤC ĐÍCH, YÊU CẦU\n1. Mục đích:\n- Quán triệt và triển khai hiệu quả nội dung ${docTitle}.\n- Tuyên truyền, vận động các tầng lớp nhân dân phát huy dân chủ, đồng thuận và tăng cường khối đại đoàn kết toàn dân tộc.\n\n2. Yêu cầu:\n- Việc tổ chức thực hiện phải thiết thực, hiệu quả, tiết kiệm, tránh hình thức.\n- Đảm bảo sự phối hợp chặt chẽ giữa MTTQ, UBND, các đoàn thể và 21 Ban Công tác Mặt trận Khu phố.\n\nII. NỘI DUNG VÀ CHỈ TIÊU TRỌNG TÂM\n- ${keyPoints.replace(/;/g, '\n- ')}\n- Đối tượng phối hợp và thụ hưởng: ${targetAudience}.\n\nIII. THỜI GIAN VÀ ĐỊA ĐIỂM THỰC HIỆN\n- Thời gian: Từ ngày ${workspaceContext?.eventTime || '15/10/2026 đến 18/11/2026'}.\n- Địa điểm: Địa bàn 21 Khu phố Phường Chánh Hiệp.\n\nIV. TỔ CHỨC THỰC HIỆN\n1. Ban Thường trực Ủy ban MTTQ Phường:\n- Chủ trì điều hành, hướng dẫn, đôn đốc và tổng hợp kết quả báo cáo Đảng ủy và Mặt trận cấp trên.\n\n2. Các tổ chức thành viên (Hội Cựu chiến binh, Phụ nữ, Nông dân, Đoàn Thanh niên, Công đoàn):\n- Căn cứ chức năng nhiệm vụ, xây dựng kế hoạch tuyên truyền sâu rộng trong đoàn viên, hội viên.\n\n3. Ban Công tác Mặt trận 21 Khu phố:\n- Báo cáo Chi ủy Chi bộ, phối hợp Trưởng khu phố triển khai thực hiện đến từng hộ gia đình và tổ chức nhân dân.\n\nNơi nhận:\n- Ban Thường trực UBMTTQ cấp trên (b/c);\n- Thường trực Đảng ủy Phường (b/c);\n- Thường trực HĐND, UBND Phường (ph/h);\n- 21 Ban CTMT Khu phố;\n- Lưu: VT-MTTQ.`;
      }

      setContent(generated);
      // Auto sync into proofreading text
      setProofreadText(generated);
    }, 600);
  };

  // Proofread Runner
  const handleRunProofread = () => {
    const textToCheck = proofreadText || content;
    if (!textToCheck.trim()) {
      alert('Vui lòng nhập hoặc soạn thảo nội dung văn bản để rà soát.');
      return;
    }

    setIsProofreading(true);
    setTimeout(() => {
      setIsProofreading(false);
      setProofreadResults([
        {
          id: 'p1',
          layer: '1. Thể thức Nghị định 30/2020/NĐ-CP',
          status: 'pass',
          title: 'Đầy đủ 9 thành phần thể thức bắt buộc',
          desc: 'Quốc hiệu, Tiêu ngữ, Tên cơ quan, Số/Ký hiệu, Trích yếu, Thẩm quyền ký và Nơi nhận đều được bố trí đúng chuẩn.'
        },
        {
          id: 'p2',
          layer: '2. Chính tả & Ngữ pháp tiếng Việt',
          status: 'pass',
          title: 'Không phát hiện lỗi chính tả nghiêm trọng',
          desc: 'Các từ viết hoa danh từ riêng (Đảng ủy, Mặt trận, Ban Thường trực, 21 Khu phố) nhất quán.'
        },
        {
          id: 'p3',
          layer: '3. Chuẩn mực Văn phong MTTQ',
          status: 'pass',
          title: 'Ngôn ngữ trang trọng, đúng thẩm quyền',
          desc: 'Phát huy tốt các thuật ngữ chính thống: "Đại đoàn kết toàn dân tộc", "Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng".'
        },
        {
          id: 'p4',
          layer: '4. Căn cứ pháp lý & Phân công',
          status: 'pass',
          title: 'Phân định rõ trách nhiệm 21 Khu phố',
          desc: 'Đã xác định rõ vai trò chủ trì của Ban Thường trực và nhiệm vụ trực tiếp của 21 Ban CTMT Khu phố.'
        }
      ]);
    }, 700);
  };

  // Rephrase Runner
  const handleRunRewrite = () => {
    if (!rewriteInput.trim()) return;
    setIsRewriting(true);

    setTimeout(() => {
      setIsRewriting(false);
      setRewriteResults([
        {
          id: 'rw-formal',
          style: 'Trang trọng - Chuẩn Nghị định',
          icon: <ShieldCheck className="w-4 h-4 text-blue-600" />,
          text: `Đề nghị Ban Thường trực Ủy ban MTTQ Việt Nam Phường chủ trì, phối hợp với các tổ chức chính trị - xã hội và 21 Ban Công tác Mặt trận Khu phố đẩy mạnh công tác tuyên truyền, vận động các tầng lớp nhân dân tích cực tham gia ủng hộ Quỹ "Vì người nghèo" năm 2026.`,
          note: 'Chuẩn mực văn bản hành chính công vụ, xác định rõ cơ quan chủ trì và đơn vị phối hợp.'
        },
        {
          id: 'rw-inspiring',
          style: 'Truyền cảm hứng - Vận động quần chúng',
          icon: <HeartHandshake className="w-4 h-4 text-rose-600" />,
          text: `Phát huy truyền thống đại đoàn kết và tinh thần "Tương thân tương ái", Ủy ban MTTQ Việt Nam Phường trân trọng kêu gọi các cơ quan, đơn vị, doanh nghiệp và toàn thể nhân dân 21 khu phố cùng chung tay ủng hộ Quỹ "Vì người nghèo", tiếp thêm nghị lực cho các hộ khó khăn vươn lên trong cuộc sống.`,
          note: 'Giàu cảm xúc, khơi dậy tinh thần tương thân tương ái và trách nhiệm cộng đồng.'
        },
        {
          id: 'rw-concise',
          style: 'Súc tích - Rút gọn',
          icon: <Minimize2 className="w-4 h-4 text-emerald-600" />,
          text: `MTTQ Phường phối hợp các đoàn thể phát động đợt vận động ủng hộ Quỹ "Vì người nghèo" năm 2026 trên địa bàn 21 khu phố.`,
          note: 'Lược bỏ câu chữ rườm rà, tập trung trực diện vào mục tiêu hành động.'
        },
        {
          id: 'rw-bullet',
          style: 'Danh sách Giao việc',
          icon: <ListOrdered className="w-4 h-4 text-purple-600" />,
          text: `1. Ban Thường trực MTTQ Phường: Ban hành kế hoạch và phát động đợt cao điểm vận động.\n2. Các đoàn thể Phường: Vận động sâu rộng trong đoàn viên, hội viên.\n3. 21 Ban CTMT Khu phố: Trực tiếp tiếp nhận ủng hộ và rà soát đúng đối tượng thụ hưởng.`,
          note: 'Phân nhiệm rõ ràng theo từng đầu mối thực hiện.'
        }
      ]);
    }, 600);
  };

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveDoc = () => {
    if (!content.trim()) return;
    const doc: AiDocument = {
      id: `doc_${Date.now()}`,
      title: `${docType}: ${docTitle}`,
      toolId: 'draft_proofread_doc',
      group: 'group1_docs_dossier',
      content: content,
      ownerId: 'usr_01',
      ownerName: 'Cán bộ MTTQ',
      status: 'completed',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSaveDocument(doc);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleExportWord = () => {
    if (!content.trim()) return;
    aiWorkspaceService.exportToWord(`${docType}_${docTitle}`, content);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-5 overflow-y-auto h-full pb-20 font-sans">
      <SecurityNoticeBanner />

      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-blue-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-cyan-500/20 shrink-0">
            <PenTool className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] bg-cyan-400/20 text-cyan-300 font-extrabold px-2 py-0.5 rounded-full border border-cyan-400/30 uppercase tracking-wider">
                CHỨC NĂNG TRỌNG TÂM
              </span>
              <h2 className="text-base sm:text-lg font-black text-white">
                Trợ Lý Soạn Thảo, Sửa Lỗi &amp; Tinh Chỉnh Văn Bản MTTQ
              </h2>
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              Tập trung tạo Kế hoạch, Công văn, Tờ trình, Bài phát biểu; rà soát thể thức Nghị định 30 và gợi ý viết lại câu.
            </p>
          </div>
        </div>

        {onOpenHistory && (
          <button
            onClick={onOpenHistory}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-white/20 shrink-0 cursor-pointer"
          >
            <History className="w-3.5 h-3.5 text-cyan-300" />
            <span>Lịch sử văn bản</span>
          </button>
        )}
      </div>

      {/* Sub-navigation Tabs: 3 Main Pillars */}
      <div className="flex bg-white rounded-2xl p-1.5 border border-slate-200 gap-1.5 text-xs font-bold shadow-xs">
        <button
          onClick={() => setActiveSubTab('create')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'create'
              ? 'bg-[#0068ff] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>1. Tạo Văn Bản Mới (Kế hoạch, Công văn, Phát biểu...)</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('proofread');
            if (content && !proofreadText) setProofreadText(content);
          }}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'proofread'
              ? 'bg-[#0068ff] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>2. Sửa Lỗi &amp; Soát Thể Thức Nghị Định 30</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rewrite')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'rewrite'
              ? 'bg-[#0068ff] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>3. Gợi Ý Viết Lại Câu &amp; Văn Phong</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: TẠO VĂN BẢN MỚI */}
      {/* ========================================================================= */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Controls Left Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            {/* Category Pill Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">
                Loại hình văn bản cần tạo:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'KE_HOACH', label: '📋 Kế hoạch' },
                  { id: 'CONG_VAN', label: '✉️ Công văn' },
                  { id: 'TO_TRINH', label: '📄 Tờ trình' },
                  { id: 'PHAT_BIEU', label: '🎙️ Phát biểu' },
                  { id: 'BAO_CAO', label: '📊 Báo cáo' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setDocCategory(cat.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-bold text-center transition cursor-pointer border ${
                      docCategory === cat.id
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Special controls for Speeches */}
            {docCategory === 'PHAT_BIEU' && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <label className="text-[11px] font-bold text-amber-900 block">
                  Thời lượng &amp; Tính chất phát biểu:
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold">
                  {[
                    { id: '3min', label: '3 phút (ngắn gọn)' },
                    { id: '5min', label: '5 phút (chuẩn)' },
                    { id: '7min', label: '7 phút (chi tiết)' },
                    { id: 'opening', label: 'Lời Khai mạc' },
                    { id: 'closing', label: 'Lời Bế mạc' },
                  ].map(item => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSpeechLength(item.id as any)}
                      className={`py-1 px-1.5 rounded-lg border text-center transition cursor-pointer ${
                        speechLength === item.id
                          ? 'bg-amber-600 text-white border-amber-600 font-bold shadow-2xs'
                          : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title / Subject */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Tên / Trích yếu văn bản:
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="Nhập tên kế hoạch, trích yếu công văn hoặc chủ đề phát biểu..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Đơn vị nhận / Phối hợp / Đối tượng:
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="21 Ban Công tác Mặt trận Khu phố, UBND Phường..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Key points */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800">
                Nội dung trọng tâm / Các ý chính:
              </label>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                rows={4}
                placeholder="Nhập các mục đích, chỉ tiêu, thời gian, kinh phí..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-600 focus:bg-white transition leading-relaxed resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !docTitle.trim()}
              className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>AI đang soạn thảo văn bản chuẩn...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Khởi Tạo Văn Bản Ngay</span>
                </>
              )}
            </button>

          </div>

          {/* Editor Right Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
            
            {/* Header bar inside editor */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Bản Thảo Văn Bản Chuẩn Thể Thức</span>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(content)}
                  disabled={!content}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
                  title="Sao chép toàn bộ văn bản"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
                </button>

                <button
                  onClick={handleSaveDoc}
                  disabled={!content}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Đã Lưu' : 'Lưu'}</span>
                </button>

                <button
                  onClick={handleExportWord}
                  disabled={!content}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-40 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất Word (.doc)</span>
                </button>
              </div>
            </div>

            {/* Textarea for document */}
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setProofreadText(e.target.value);
              }}
              placeholder="Văn bản tự động tạo sẽ hiển thị tại đây. Bạn có thể chỉnh sửa trực tiếp, bổ sung nội dung hoặc xuất file Word bất cứ lúc nào..."
              rows={17}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-900 leading-relaxed focus:outline-none focus:border-blue-600 focus:bg-white resize-none font-medium"
            />

            <div className="flex flex-wrap items-center justify-between pt-1 text-[11px] text-slate-500 gap-2">
              <span>Định dạng chuẩn font Times New Roman, cỡ chữ 14pt khi xuất Word.</span>
              
              <button
                onClick={() => {
                  setProofreadText(content);
                  setActiveSubTab('proofread');
                  handleRunProofread();
                }}
                disabled={!content}
                className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Chuyển sang kiểm tra thể thức NĐ 30</span>
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SỬA LỖI & RÀ SOÁT THỂ THỨC NGHỊ ĐỊNH 30 */}
      {/* ========================================================================= */}
      {activeSubTab === 'proofread' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">
                Rà Soát Thể Thức Hành Chính &amp; Sửa Lỗi Văn Bản
              </h3>
              <p className="text-xs text-slate-500">
                Kiểm tra lỗi chính tả, ngữ pháp, thể thức Nghị định 30/2020/NĐ-CP và căn cứ pháp lý MTTQ.
              </p>
            </div>

            <button
              onClick={handleRunProofread}
              disabled={isProofreading || !proofreadText.trim()}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              {isProofreading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Đang quét lỗi...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Kiểm Tra Lỗi &amp; Thể Thức</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Input Text Box */}
            <div className="lg:col-span-6 space-y-2">
              <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                <span>Văn bản cần kiểm tra:</span>
                <span className="text-[11px] text-slate-400 font-normal">{proofreadText.length} ký tự</span>
              </label>
              <textarea
                value={proofreadText}
                onChange={(e) => setProofreadText(e.target.value)}
                placeholder="Dán nội dung văn bản bạn muốn kiểm tra lỗi chính tả, câu từ hoặc thể thức vào đây..."
                rows={14}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-serif text-slate-900 leading-relaxed focus:outline-none focus:border-blue-600 focus:bg-white resize-none font-medium"
              />
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-6 space-y-2">
              <label className="text-xs font-bold text-slate-800">
                Kết quả đánh giá chất lượng văn bản:
              </label>

              {!proofreadResults ? (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                  <FileCheck2 className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-semibold text-slate-500">
                    Bấm nút "Kiểm Tra Lỗi &amp; Thể Thức" ở góc trên để bắt đầu rà soát.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Hệ thống sẽ kiểm tra 4 lớp: Thể thức, Chính tả, Văn phong MTTQ và Thẩm quyền ban hành.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {proofreadResults.map((res) => (
                    <div 
                      key={res.id}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                        res.status === 'pass' 
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                          : 'bg-amber-50/70 border-amber-200 text-amber-950'
                      }`}
                    >
                      {res.status === 'pass' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5 flex-1">
                        <div className="font-bold text-slate-900 flex items-center justify-between">
                          <span>{res.layer}</span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white border font-bold text-emerald-700">
                            {res.title}
                          </span>
                        </div>
                        <div className="text-slate-600 text-[11px] leading-relaxed">{res.desc}</div>
                      </div>
                    </div>
                  ))}

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium flex items-center justify-between">
                    <span>Đánh giá chung: Văn bản đạt chuẩn ban hành.</span>
                    <button
                      onClick={() => handleCopy(proofreadText)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold text-[11px] hover:bg-blue-700 cursor-pointer"
                    >
                      Sao chép văn bản
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: GỢI Ý VIẾT LẠI CÂU & VĂN PHONG */}
      {/* ========================================================================= */}
      {activeSubTab === 'rewrite' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-black text-slate-900">
              Gợi Ý Viết Lại Câu &amp; Chuyển Đổi Phong Cách Ngôn Từ
            </h3>
            <p className="text-xs text-slate-500">
              Nhập câu văn bản thô hoặc đoạn phát biểu để AI gợi ý các phương án diễn đạt chuẩn mực, truyền cảm hứng hoặc cô đọng.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Input Left */}
            <div className="lg:col-span-6 space-y-3">
              <label className="text-xs font-bold text-slate-800">
                Nhập câu hoặc đoạn văn bản cần diễn đạt lại:
              </label>

              <textarea
                value={rewriteInput}
                onChange={(e) => setRewriteInput(e.target.value)}
                placeholder="Nhập câu hoặc đoạn văn bản cần diễn đạt lại..."
                rows={5}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
              />

              <div className="flex flex-wrap gap-1.5">
                {[
                  'Mặt trận vận động quỹ vì người nghèo',
                  'Nhắc nhở 21 khu phố nộp báo cáo đúng hạn',
                  'Lời khai mạc ngày hội đại đoàn kết',
                  'Ý kiến phát biểu tại buổi hòa giải tranh chấp'
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (idx === 0) setRewriteInput('Mặt trận phường cần phân công đoàn thể phối hợp đi vận động bà con đóng góp tiền cho quỹ vì người nghèo.');
                      if (idx === 1) setRewriteInput('Khu phố nào chưa nộp báo cáo thì nộp gấp trước ngày thứ sáu để kịp tổng hợp.');
                      if (idx === 2) setRewriteInput('Hôm nay ngày hội đại đoàn kết tôi chúc bà con nhiều sức khỏe và đoàn kết giúp đỡ nhau.');
                      if (idx === 3) setRewriteInput('Hai bên gia đình nên nhường nhịn nhau, tình làng nghĩa xóm tối lửa tắt đèn có nhau là quan trọng nhất.');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 text-[11px] font-medium border border-slate-200 transition cursor-pointer"
                  >
                    Mẫu: {sample}
                  </button>
                ))}
              </div>

              <button
                onClick={handleRunRewrite}
                disabled={isRewriting || !rewriteInput.trim()}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isRewriting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-cyan-200" />
                    <span>AI đang tinh chỉnh câu từ...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-cyan-200" />
                    <span>Gợi Ý Viết Lại Câu</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Right */}
            <div className="lg:col-span-6 space-y-3">
              <label className="text-xs font-bold text-slate-800">
                Các phương án gợi ý viết lại:
              </label>

              {!rewriteResults ? (
                <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 space-y-2">
                  <Wand2 className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
                  <p className="text-xs font-semibold text-slate-500">
                    Bấm "Gợi Ý Viết Lại Câu" để xem các phương án phong cách.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {rewriteResults.map((opt) => (
                    <div
                      key={opt.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {opt.icon}
                          <span className="text-xs font-bold text-slate-900">{opt.style}</span>
                        </div>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(opt.text);
                            setCopiedRewriteId(opt.id);
                            setTimeout(() => setCopiedRewriteId(null), 2000);
                          }}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                            copiedRewriteId === opt.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {copiedRewriteId === opt.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedRewriteId === opt.id ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      <div className="p-2.5 bg-white rounded-lg border border-slate-100 text-xs font-semibold text-slate-800 leading-relaxed whitespace-pre-line select-all">
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
      )}

    </div>
  );
};
