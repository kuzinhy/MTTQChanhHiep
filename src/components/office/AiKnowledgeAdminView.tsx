import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Upload, 
  FileText, 
  HardDrive, 
  Globe, 
  ShieldCheck, 
  Trash2, 
  Edit3,
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  FolderOpen,
  Sliders,
  Sparkles,
  Database,
  RotateCcw,
  HelpCircle,
  Tag,
  AlertCircle
} from 'lucide-react';
import { KnowledgeDocument, AISourceMode, AIInternetMode, AIDriveMode } from '../../lib/ai/types';
import { DriveConnector, DriveIndexedFile } from '../../lib/ai/driveConnector';

const KNOWLEDGE_STORAGE_KEY = 'chanh_hiep_ai_knowledge_docs_v2';
const SETTINGS_STORAGE_KEY = 'chanh_hiep_ai_settings_v2';

export const SAMPLE_STANDARD_FAQS: KnowledgeDocument[] = [
  {
    id: 'kb-faq-01',
    title: 'HỎI: Thủ tục Đăng ký kết hôn tại UBND Phường Chánh Hiệp cần những gì và mất bao lâu?',
    type: 'TEXT',
    category: 'THU_TUC',
    content: 'ĐÁP: Thủ tục Đăng ký kết hôn [Mã TTHC-TP-01] được giải quyết ngay trong 01 ngày làm việc (khi hồ sơ hợp lệ). Lệ phí: Miễn phí. Thành phần hồ sơ gồm: (1) Tờ khai đăng ký kết hôn theo mẫu; (2) Bản chính CCCD/VNeID mức 2 của hai bên nam, nữ; (3) Giấy xác nhận tình trạng hôn nhân (nếu cư trú ngoài địa bàn phường). Cả hai bên phải trực tiếp có mặt tại Bộ phận Một cửa UBND Phường Chánh Hiệp (Số 1240 Đại Lộ Bình Dương, KP Định Hòa 5) để ký vào Sổ hộ tịch.',
    sourceName: 'Bộ phận Tiếp nhận & Trả kết quả UBND Phường Chánh Hiệp',
    official: true,
    tags: ['kết hôn', 'đăng ký kết hôn', 'thủ tục', 'hôn nhân', 'một cửa', 'lệ phí'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-02',
    title: 'HỎI: Tôi muốn xin Giấy xác nhận tình trạng hôn nhân (giấy độc thân) thì liên hệ ở đâu?',
    type: 'TEXT',
    category: 'THU_TUC',
    content: 'ĐÁP: Thủ tục Cấp Giấy xác nhận tình trạng hôn nhân [Mã TTHC-TP-03] được tiếp nhận trực tiếp tại Bộ phận Một cửa UBND Phường hoặc nộp trực tuyến qua Cổng Dịch vụ công Quốc gia. Thời hạn giải quyết tối đa 03 ngày làm việc. Lệ phí: Miễn phí cho công dân cư trú trên địa bàn. Hồ sơ cần có: Tờ khai theo mẫu và CCCD gắn chip (hoặc tài khoản định danh VNeID mức 2).',
    sourceName: 'Tư pháp - Hộ tịch Phường Chánh Hiệp',
    official: true,
    tags: ['độc thân', 'xác nhận độc thân', 'tình trạng hôn nhân', 'tư pháp'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-03',
    title: 'HỎI: Ai là Bí thư Đoàn Thanh niên và phụ trách phong trào tình nguyện của phường?',
    type: 'TEXT',
    category: 'DOAN_THE',
    content: 'ĐÁP: Đồng chí Bùi Văn Huy hiện giữ chức vụ Bí thư Đoàn TNCS Hồ Chí Minh Phường Chánh Hiệp, đồng thời là Ủy viên Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp (Nhiệm kỳ 2025 - 2030). Đồng chí phụ trách phong trào thanh thiếu nhi, các đội hình tình nguyện (Chuyển đổi số cộng đồng, Hiến máu nhân đạo, Ngày Chủ nhật xanh) và an sinh xã hội trên địa bàn 21 khu phố.',
    sourceName: 'Đoàn TNCS Hồ Chí Minh & MTTQ Phường Chánh Hiệp',
    official: true,
    tags: ['bùi văn huy', 'bí thư đoàn', 'đoàn thanh niên', 'tình nguyện', 'cán bộ'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-04',
    title: 'HỎI: Trụ sở UBND và Ủy ban MTTQ Phường Chánh Hiệp ở đâu? Có số hotline không?',
    type: 'TEXT',
    category: 'KHU_PHO',
    content: 'ĐÁP: Trụ sở cơ quan đặt tại: Số 1240 Đại Lộ Bình Dương, Khu phố Định Hòa 5, Phường Chánh Hiệp, TP. Thủ Dầu Một. Đường dây nóng tiếp nhận phản ánh dân sinh và tư vấn thủ tục: 0989614614. Giờ làm việc: Sáng 07:30 - 11:30, Chiều 13:30 - 17:00 (Từ Thứ Hai đến Thứ Sáu, sáng Thứ Bảy trực tiếp nhận Một cửa).',
    sourceName: 'Văn phòng HĐND - UBND & MTTQ Phường Chánh Hiệp',
    official: true,
    tags: ['địa chỉ', 'trụ sở', 'hotline', 'đường dây nóng', 'giờ làm việc'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-05',
    title: 'HỎI: Làm sao để đăng ký nhận Bữa cơm nghĩa tình hoặc hỗ trợ Quỹ Vì người nghèo?',
    type: 'TEXT',
    category: 'AN_SINH',
    content: 'ĐÁP: Chương trình "Bữa cơm nghĩa tình" và "Quỹ Vì người nghèo" do Ủy ban MTTQ Phường Chánh Hiệp chủ trì, hỗ trợ miễn phí các suất ăn dinh dưỡng và trợ cấp đột xuất cho người già neo đơn, hộ nghèo, người khuyết tật, người bán vé số. Người dân có thể liên hệ trực tiếp Trưởng Ban Công tác Mặt trận tại khu phố đang cư trú hoặc gửi thông tin qua mục "Phản ánh – An sinh" trên cổng thông tin để được cán bộ đến tận nơi hỗ trợ.',
    sourceName: 'Ban Thường trực Ủy ban MTTQ Việt Nam Phường Chánh Hiệp',
    official: true,
    tags: ['bữa cơm nghĩa tình', 'quỹ vì người nghèo', 'an sinh', 'hộ nghèo', 'khó khăn'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-06',
    title: 'HỎI: Điều kiện và mức kinh phí hỗ trợ xây mới/sửa chữa Nhà Đại đoàn kết là bao nhiêu?',
    type: 'TEXT',
    category: 'AN_SINH',
    content: 'ĐÁP: Kinh phí hỗ trợ xây mới Nhà Đại đoàn kết từ Quỹ "Vì người nghèo" phường là 80 - 100 triệu đồng/căn; hỗ trợ sửa chữa nhà dột nát từ 30 - 50 triệu đồng/căn. Đối tượng: Hộ nghèo, hộ cận nghèo, gia đình chính sách khó khăn có đất ở hợp pháp và được Ban Công tác Mặt trận khu phố bình xét công khai.',
    sourceName: 'Ban Vận động Quỹ Vì người nghèo Phường Chánh Hiệp',
    official: true,
    tags: ['nhà đại đoàn kết', 'xây nhà', 'sửa nhà', 'an sinh', 'kinh phí'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-07',
    title: 'HỎI: Văn phòng Ban Điều hành Khu phố Định Hòa 5 ở đâu và liên hệ ai?',
    type: 'TEXT',
    category: 'KHU_PHO',
    content: 'ĐÁP: Văn phòng Khu phố Định Hòa 5 tọa lạc ngay trên trục đường Đại Lộ Bình Dương (gần trụ sở UBND Phường). Ban Điều hành Khu phố và Ban Công tác Mặt trận trực ban hàng ngày để tiếp nhận ý kiến cử tri, xác nhận hồ sơ ban đầu và hỗ trợ công tác an sinh xã hội cho bà con trên địa bàn.',
    sourceName: 'Ban Điều hành 21 Khu phố Chánh Hiệp',
    official: true,
    tags: ['định hòa 5', 'khu phố định hòa 5', 'văn phòng khu phố', 'địa chỉ'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-08',
    title: 'HỎI: Số điện thoại Công an Phường Chánh Hiệp để báo tin an ninh trật tự là gì?',
    type: 'TEXT',
    category: 'CHINH_SACH',
    content: 'ĐÁP: Trực ban Công an Phường Chánh Hiệp: 0274.3822.456 (hoặc tổng đài 113). Đơn vị trực chiến 24/24 để tiếp nhận tin báo về an ninh trật tự, trộm cắp, phòng cháy chữa cháy và hỗ trợ cấp tài khoản định danh VNeID mức 2.',
    sourceName: 'Công an Phường Chánh Hiệp',
    official: true,
    tags: ['công an', 'an ninh trật tự', 'số điện thoại công an', '113', 'khẩn cấp'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-09',
    title: 'HỎI: Lịch tiêm chủng mở rộng tại Trạm Y tế Phường Chánh Hiệp vào những ngày nào?',
    type: 'TEXT',
    category: 'CHINH_SACH',
    content: 'ĐÁP: Trạm Y tế Phường Chánh Hiệp tổ chức Tiêm chủng mở rộng định kỳ cho trẻ em vào ngày 10 và ngày 25 hàng tháng. Số điện thoại Trạm Y tế: 0274.3833.115. Địa chỉ: Khu phố Định Hòa, Phường Chánh Hiệp.',
    sourceName: 'Trạm Y tế Phường Chánh Hiệp',
    official: true,
    tags: ['y tế', 'tiêm chủng', 'trạm y tế', 'lịch tiêm phòng', 'trẻ em'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-10',
    title: 'HỎI: Quy trình gửi phản ánh rác thải, lấn chiếm lòng lề đường qua Cổng thông tin như thế nào?',
    type: 'TEXT',
    category: 'THU_TUC',
    content: 'ĐÁP: Người dân truy cập mục "Gửi phản ánh – kiến nghị" trên website, chọn khu phố phát sinh sự việc, đính kèm hình ảnh/vị trí và nội dung. Ban Thường trực Mặt trận và UBND Phường sẽ tiếp nhận, phân công lực lượng kiểm tra xử lý trong 24h - 48h và công khai kết quả xử lý ngay trên hệ thống.',
    sourceName: 'Cổng Thông tin Điện tử Phường Chánh Hiệp',
    official: true,
    tags: ['gửi phản ánh', 'rác thải', 'trật tự đô thị', 'kiến nghị', 'xử lý'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-11',
    title: 'HỎI: Không gian Văn hóa Hồ Chí Minh của Phường Chánh Hiệp mở cửa khi nào và có gì?',
    type: 'TEXT',
    category: 'DOAN_THE',
    content: 'ĐÁP: Không gian Văn hóa Hồ Chí Minh đặt tại Tầng 2 Trụ sở Ủy ban MTTQ Phường Chánh Hiệp (Số 1240 Đại Lộ Bình Dương), mở cửa đón nhân dân, đoàn viên, học sinh tham quan miễn phí trong giờ hành chính. Nơi đây trưng bày các kỷ vật lịch sử (Huy hiệu Bác Hồ mạ men đỏ nguyên bản, khăn rằn Nam Bộ, đèn dầu địa đạo), tủ sách hơn 500 đầu sách về Bác và phòng chiếu phim tư liệu số 3D.',
    sourceName: 'Ủy ban MTTQ & Hội đồng Đội Phường Chánh Hiệp',
    official: true,
    tags: ['không gian văn hóa hồ chí minh', 'bác hồ', 'kỷ vật', 'tham quan', 'mặt trận'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  },
  {
    id: 'kb-faq-12',
    title: 'HỎI: Người cao tuổi từ đủ 80 tuổi trở lên không có lương hưu được trợ cấp bao nhiêu?',
    type: 'TEXT',
    category: 'AN_SINH',
    content: 'ĐÁP: Theo Nghị định 20/2021/NĐ-CP và chính sách an sinh của địa phương, người cao tuổi từ đủ 80 tuổi trở lên không có lương hưu, trợ cấp BHXH được hưởng trợ cấp xã hội hàng tháng và được cấp thẻ BHYT miễn phí 100%. Hồ sơ gồm: Tờ khai thông tin cá nhân và CCCD, nộp tại Bộ phận Một cửa UBND Phường để được xét duyệt.',
    sourceName: 'Bộ phận Lao động - Thương binh & Xã hội Phường Chánh Hiệp',
    official: true,
    tags: ['người cao tuổi', '80 tuổi', 'trợ cấp xã hội', 'bhyt miễn phí', 'bảo trợ'],
    rolesAllowed: ['PUBLIC', 'STAFF'],
    updatedAt: '2026-09-30',
    isActive: true
  }
];

export const AiKnowledgeAdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'docs' | 'drive' | 'settings'>('docs');
  const [docs, setDocs] = useState<KnowledgeDocument[]>(() => {
    try {
      const raw = localStorage.getItem(KNOWLEDGE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return SAMPLE_STANDARD_FAQS;
  });

  const [driveFiles, setDriveFiles] = useState<DriveIndexedFile[]>(() => DriveConnector.getIndexedFiles());
  const [driveConfig, setDriveConfig] = useState(() => DriveConnector.getConfig());

  const [settings, setSettings] = useState<{
    sourceMode: AISourceMode;
    internetMode: AIInternetMode;
    driveMode: AIDriveMode;
  }>(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
      sourceMode: 'LOCAL_FIRST',
      internetMode: 'AUTO',
      driveMode: 'MANUAL_SYNC'
    };
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KnowledgeDocument['category']>('THU_TUC');
  const [formType, setFormType] = useState<KnowledgeDocument['type']>('TEXT');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formOfficial, setFormOfficial] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(docs));
    } catch (e) {}
  }, [docs]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {}
  }, [settings]);

  const handleSyncDrive = () => {
    setIsSyncing(true);
    setTimeout(() => {
      const res = DriveConnector.syncNow();
      setDriveFiles(DriveConnector.getIndexedFiles());
      setDriveConfig(DriveConnector.getConfig());
      setIsSyncing(false);
      alert(`Đồng bộ thành công ${res.syncedCount} tài liệu từ Google Drive (Thư mục 1TNEc...)`);
    }, 800);
  };

  const handleToggleDocActive = (id: string) => {
    setDocs(docs.map(d => d.id === id ? { ...d, isActive: !d.isActive } : d));
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa câu hỏi/tài liệu tri thức này khỏi Bộ não AI?')) {
      setDocs(docs.filter(d => d.id !== id));
    }
  };

  const handleResetToSample = () => {
    if (confirm('Khôi phục toàn bộ 12+ Câu hỏi - Đáp mẫu chuẩn của Cán bộ Mặt trận Phường Chánh Hiệp?')) {
      setDocs(SAMPLE_STANDARD_FAQS);
      localStorage.setItem(KNOWLEDGE_STORAGE_KEY, JSON.stringify(SAMPLE_STANDARD_FAQS));
      alert('Đã khôi phục thành công dữ liệu tri thức mẫu chuẩn!');
    }
  };

  const handleOpenAddModal = () => {
    setEditingDoc(null);
    setFormTitle('HỎI: ');
    setFormCategory('THU_TUC');
    setFormType('TEXT');
    setFormContent('ĐÁP: ');
    setFormTags('');
    setFormOfficial(true);
    setShowAddModal(true);
  };

  const handleOpenEditModal = (doc: KnowledgeDocument) => {
    setEditingDoc(doc);
    setFormTitle(doc.title);
    setFormCategory(doc.category);
    setFormType(doc.type);
    setFormContent(doc.content);
    setFormTags(doc.tags.join(', '));
    setFormOfficial(doc.official);
    setShowAddModal(true);
  };

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingDoc) {
      // Update existing doc
      const updatedDocs = docs.map(d => d.id === editingDoc.id ? {
        ...d,
        title: formTitle.trim(),
        category: formCategory,
        type: formType,
        content: formContent.trim(),
        tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
        official: formOfficial,
        updatedAt: new Date().toISOString().split('T')[0]
      } : d);
      setDocs(updatedDocs);
    } else {
      // Create new doc
      const newDoc: KnowledgeDocument = {
        id: 'kb-' + Date.now(),
        title: formTitle.trim(),
        type: formType,
        category: formCategory,
        content: formContent.trim(),
        sourceName: 'Ủy ban MTTQ Việt Nam Phường Chánh Hiệp',
        official: formOfficial,
        tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
        rolesAllowed: ['PUBLIC', 'STAFF'],
        updatedAt: new Date().toISOString().split('T')[0],
        isActive: true
      };
      setDocs([newDoc, ...docs]);
    }

    setShowAddModal(false);
    setEditingDoc(null);
  };

  const filteredDocs = docs.filter(d => {
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    const q = searchTerm.toLowerCase();
    const matchesQ = !q || d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q));
    return matchesCat && matchesQ;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-900/50">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold">
            <Database className="w-3.5 h-3.5 text-amber-300" />
            Bộ não Tri thức &amp; RAG Engine V3
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            KHO TRI THỨC &amp; CÂU HỎI THƯỜNG GẶP (FAQ)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Quản lý toàn bộ câu hỏi thường gặp, câu trả lời chuẩn duyệt và tài liệu hướng dẫn nghiệp vụ của Phường Chánh Hiệp. Trợ lý AI sẽ căn cứ trực tiếp vào kho tri thức này để trả lời người dân.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Câu hỏi / Tri thức Mới</span>
          </button>
          
          <button
            onClick={handleResetToSample}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 text-xs font-bold transition-all cursor-pointer"
            title="Khôi phục 12+ câu hỏi mẫu chuẩn"
          >
            <RotateCcw className="w-4 h-4 text-emerald-400" />
            <span>Khôi phục Mẫu chuẩn</span>
          </button>

          <button
            onClick={handleSyncDrive}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl border border-white/20 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-amber-300 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Đồng bộ Drive</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'docs' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Kho Câu hỏi - Đáp &amp; Tri thức ({docs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'drive' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HardDrive className="w-4 h-4 text-amber-500" />
          <span>Biểu mẫu Google Drive ({driveFiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'settings' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-indigo-600" />
          <span>Cấu hình Định tuyến Nguồn</span>
        </button>
      </div>

      {/* TAB 1: KNOWLEDGE DOCS & FAQS */}
      {activeTab === 'docs' && (
        <div className="space-y-4">
          {/* Quick Guidance Alert */}
          <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl flex items-start gap-3 text-xs text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Hướng dẫn quản trị:</strong> Bạn có thể tự do thêm, chỉnh sửa hoặc xóa bất kỳ câu hỏi nào dưới đây. Trợ lý AI sẽ đọc trực tiếp nội dung các mục đang được bật (<strong>Đang bật</strong>) để giải đáp ngay cho người dân khi nhận diện câu hỏi tương đồng.
            </div>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm câu hỏi, thủ tục, từ khóa..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'THU_TUC', label: 'Thủ tục hành chính' },
                { id: 'AN_SINH', label: 'An sinh xã hội' },
                { id: 'KHU_PHO', label: '21 Khu phố & Hotline' },
                { id: 'DOAN_THE', label: 'Đoàn thể & Văn hóa' },
                { id: 'CHINH_SACH', label: 'Chính sách & An ninh' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat.id ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className={`bg-white rounded-3xl border p-5 space-y-3.5 transition-all shadow-xs flex flex-col justify-between ${
                  doc.isActive ? 'border-slate-200 hover:border-blue-300 hover:shadow-md' : 'border-slate-200 opacity-60 bg-slate-50/60'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md text-[10.5px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                      {doc.category}
                    </span>
                    {doc.official && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        Chính thức
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-black text-slate-900 leading-snug">
                    {doc.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {doc.content}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium pt-1">
                    <span>{doc.updatedAt}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(doc)}
                        className="text-blue-600 hover:text-blue-800 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Chỉnh sửa nội dung"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleToggleDocActive(doc.id)}
                        className={`text-xs font-bold cursor-pointer px-2 py-0.5 rounded-md ${
                          doc.isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'
                        }`}
                      >
                        {doc.isActive ? 'Đang bật' : 'Đã tắt'}
                      </button>

                      <button
                        onClick={() => handleDeleteDoc(doc.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa khỏi bộ não"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: GOOGLE DRIVE */}
      {activeTab === 'drive' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200 font-bold">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">
                    {driveConfig.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ID Thư mục: {driveConfig.folderId}
                  </p>
                </div>
              </div>

              <a
                href={driveConfig.folderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all"
              >
                <span>Mở trên Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px]">Trạng thái kết nối:</span>
                <span className="font-black text-emerald-600 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {driveConfig.status} (Đã cấp quyền)
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px]">Lần đồng bộ gần nhất:</span>
                <span className="font-bold text-slate-800 block mt-0.5">{driveConfig.lastSyncAt}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-400 block text-[10px]">Số file đã lập chỉ mục:</span>
                <span className="font-black text-blue-600 block mt-0.5">{driveFiles.length} tệp tin</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 font-black text-xs text-slate-900">
              Danh mục Tệp tin Google Drive đã quét và nhúng tri thức
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {driveFiles.map((file) => (
                <div key={file.driveFileId} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">{file.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">{file.snippet}</p>
                      <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                        Đồng bộ: {file.indexedAt} • Danh mục: {file.category}
                      </span>
                    </div>
                  </div>

                  <a
                    href={file.webViewLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-bold shrink-0 transition-colors"
                  >
                    Xem tệp
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs max-w-3xl">
          <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3">
            Cấu hình Thứ tự Ưu tiên &amp; Chế độ Hoạt động của Trợ lý AI
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-xs text-slate-900 block">
                Chế độ Nguồn Dữ liệu (Source Mode):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'LOCAL_FIRST', label: 'LOCAL FIRST (Khuyên dùng)', desc: 'Ưu tiên Website & Drive trước' },
                  { id: 'BALANCED', label: 'BALANCED', desc: 'Kết hợp đồng đều nội bộ & web' },
                  { id: 'WEB_FIRST', label: 'WEB FIRST', desc: 'Ưu tiên tìm kiếm internet' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSettings({ ...settings, sourceMode: mode.id as AISourceMode })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      settings.sourceMode === mode.id
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs block">{mode.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal block mt-1">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="font-bold text-xs text-slate-900 block">
                Tra cứu Internet Thời gian thực (Realtime Mode):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'AUTO', label: 'TỰ ĐỘNG (AUTO)', desc: 'Tự tra cứu khi hỏi giá vàng, thời tiết' },
                  { id: 'ON', label: 'LUÔN BẬT (ON)', desc: 'Luôn kiểm tra web ngoài' },
                  { id: 'OFF', label: 'TẮT (OFF)', desc: 'Chỉ dùng dữ liệu trong phường' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSettings({ ...settings, internetMode: mode.id as AIInternetMode })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      settings.internetMode === mode.id
                        ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs block">{mode.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal block mt-1">{mode.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Thêm / Sửa Tri thức FAQ */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                {editingDoc ? 'Chỉnh sửa Câu hỏi / Tri thức' : 'Thêm Câu hỏi / Tri thức Mới'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tiêu đề / Câu hỏi người dân hay hỏi:
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: HỎI: Thủ tục kết hôn cần những giấy tờ gì?"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Chuyên mục:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-medium"
                  >
                    <option value="THU_TUC">Thủ tục hành chính</option>
                    <option value="AN_SINH">An sinh xã hội</option>
                    <option value="KHU_PHO">21 Khu phố &amp; Hotline</option>
                    <option value="DOAN_THE">Đoàn thể &amp; Tình nguyện</option>
                    <option value="CHINH_SACH">Chính sách &amp; An ninh</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Định dạng:
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-medium"
                  >
                    <option value="TEXT">Văn bản / FAQ</option>
                    <option value="PDF">Tài liệu PDF</option>
                    <option value="DOCX">Word (DOCX)</option>
                    <option value="XLSX">Bảng tính (Excel)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Câu trả lời chuẩn duyệt (AI sẽ căn cứ vào đây để trả lời):
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="ĐÁP: Nhập câu trả lời ngắn gọn, đầy đủ, chính xác theo quy định của Phường Chánh Hiệp..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Từ khóa gợi nhớ (cách nhau bằng dấu phẩy):
                </label>
                <input
                  type="text"
                  placeholder="kết hôn, giấy tờ, một cửa, lệ phí..."
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden font-medium"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="officialCheck"
                  checked={formOfficial}
                  onChange={(e) => setFormOfficial(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="officialCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Đánh dấu là Thông tin chính thức (Hiện cờ ✓ Nguồn chính thức khi AI trả lời)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer active:scale-95"
                >
                  {editingDoc ? 'Lưu Thay đổi' : 'Thêm vào Bộ não AI'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
