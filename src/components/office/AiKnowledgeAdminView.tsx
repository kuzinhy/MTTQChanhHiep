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
    "id": "kb-faq-01",
    "title": "HỎI: Thủ tục Cấp bản sao từ sổ gốc tại UBND Phường Chánh Hiệp có mất phí không và mất bao lâu?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Thủ tục Cấp bản sao từ sổ gốc [Mã 2.000908] tại UBND Phường Chánh Hiệp được giải quyết MIỄN PHÍ. Thời gian thực hiện: Ngay trong ngày làm việc cơ quan tiếp nhận yêu cầu, hoặc trong ngày làm việc tiếp theo nếu tiếp nhận sau 15 giờ. Người dân cần nộp Tờ khai theo mẫu và xuất trình CCCD gắn chip hoặc tài khoản VNeID mức 2.",
    "sourceName": "Tư pháp - Hộ tịch Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "bản sao từ sổ gốc",
      "sao lục",
      "sổ gốc",
      "miễn phí",
      "tư pháp"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-02",
    "title": "HỎI: Lệ phí và thời gian chứng thực bản sao từ bản chính (sao y bản chính) được tính thế nào?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Chứng thực bản sao từ bản chính [Mã 2.000907] tại UBND Phường Chánh Hiệp được giải quyết ngay trong ngày (hoặc ngày tiếp theo nếu nộp sau 15h). Lệ phí: 2.000 đồng/trang; từ trang thứ 3 trở lên thu 1.000 đồng/trang, tối đa thu không quá 200.000 đồng/bản. Bản chính phải còn nguyên vẹn, không rách nát, tẩy xóa trái phép.",
    "sourceName": "Một cửa UBND Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "chứng thực bản sao",
      "sao y",
      "bản chính",
      "photo công chứng",
      "lệ phí"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-03",
    "title": "HỎI: Tôi muốn chứng thực chữ ký trong đơn cam kết, giấy tờ cá nhân thì làm thế nào?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Thủ tục Chứng thực chữ ký [Mã 2.000906] yêu cầu người dân mang theo bản chính CCCD/VNeID và văn bản cần ký. Người yêu cầu chứng thực chữ ký TUYỆT ĐỐI không được ký trước vào giấy tờ. Việc ký phải được thực hiện trực tiếp trước mặt cán bộ Một cửa tại Quầy số 1. Lệ phí: 10.000 đồng/trường hợp, giải quyết ngay trong ngày.",
    "sourceName": "Tư pháp Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "chứng thực chữ ký",
      "ký tên",
      "điểm chỉ",
      "cam kết",
      "mẫu đơn"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-04",
    "title": "HỎI: Có những quy định gì về chứng thực chữ ký người dịch (Cộng tác viên hoặc tự do)?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Phường có hai quy trình: Chứng thực chữ ký người dịch là Cộng tác viên cơ hữu của phường [Mã 2.000905] và người dịch tự do [Mã 2.000904]. Người dịch tự do khi chứng thực phải xuất trình bản chính bằng tốt nghiệp Đại học chuyên ngành ngoại ngữ tương ứng hoặc bằng cấp ngoại ngữ hợp lệ khác. Lệ phí: 10.000 đồng/trường hợp, giải quyết ngay trong ngày làm việc.",
    "sourceName": "Tư pháp - Hộ tịch Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "chữ ký người dịch",
      "dịch thuật",
      "công dịch",
      "bản dịch",
      "bằng ngoại ngữ"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-05",
    "title": "HỎI: Thủ tục chứng thực hợp đồng mua bán xe, tặng cho tài sản, nhà đất mất bao lâu và phí bao nhiêu?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Thủ tục Chứng thực hợp đồng, giao dịch tài sản [Mã 2.000911] giải quyết trong tối đa 02 ngày làm việc. Lệ phí: 50.000 đồng/giao dịch. Các bên tham gia phải chuẩn bị 03 bản dự thảo hợp đồng, bản gốc giấy chứng nhận tài sản (Sổ hồng, Đăng ký xe gốc...), CCCD và giấy chứng nhận kết hôn hoặc xác nhận độc thân của các bên. Tất cả các bên phải có mặt trực tiếp để ký và điểm chỉ tại Quầy Một cửa.",
    "sourceName": "Bộ phận Một cửa Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "hợp đồng",
      "mua bán xe",
      "chuyển nhượng",
      "tặng cho",
      "lệ phí",
      "ủy quyền"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-06",
    "title": "HỎI: Tôi muốn lập di chúc tại phường thì cần chuẩn bị giấy tờ gì để chứng thực?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Chứng thực di chúc [Mã 2.001019] giải quyết trong tối đa 02 ngày làm việc. Lệ phí: 50.000 đồng/di chúc. Yêu cầu bắt buộc: (1) Giấy khám sức khỏe từ Bệnh viện đa khoa xác nhận tinh thần minh mẫn (cấp trong 30 ngày); (2) Bản gốc giấy tờ sở hữu tài sản (Sổ đỏ, sổ tiết kiệm...); (3) CCCD gắn chip của người lập di chúc. Người lập phải tự có mặt trực tiếp đọc hoặc viết di chúc trước mặt cán bộ.",
    "sourceName": "Tư pháp - Hộ tịch Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "di chúc",
      "thừa kế",
      "sức khỏe tâm thần",
      "minh mẫn",
      "di sản"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-07",
    "title": "HỎI: Làm thủ tục từ chối nhận di sản thừa kế (đất đai, nhà ở) như thế nào tại Phường Chánh Hiệp?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Chứng thực văn bản từ chối nhận di sản [Mã 2.001016] giải quyết trong tối đa 02 ngày làm việc. Lệ phí: 50.000 đồng/văn bản. Hồ sơ cần có: Dự thảo văn bản từ chối di sản thừa kế, Giấy chứng tử của người để lại di sản, Giấy tờ chứng minh quan hệ thừa kế (khai sinh, kết hôn...) và giấy tờ tài sản gốc. Người từ chối phải trực tiếp ký văn bản tại Quầy Một cửa.",
    "sourceName": "Tư pháp Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "từ chối nhận di sản",
      "thừa kế",
      "khai tử",
      "từ chối di sản",
      "đất đai"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-08",
    "title": "HỎI: Làm sao để chứng thực văn bản thỏa thuận phân chia di sản thừa kế tại UBND phường?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Chứng thực văn bản phân chia di sản [Mã 2.001015] giải quyết trong tối đa 02 ngày làm việc. Lệ phí: 50.000 đồng/văn bản. Tất cả các đồng thừa kế theo di chúc hoặc theo pháp luật phải cùng có mặt trực tiếp tại Một cửa Phường Chánh Hiệp để cùng ký tên và điểm chỉ. Mang theo Giấy chứng tử của người quá cố, giấy tờ diện thừa kế và giấy tờ tài sản gốc.",
    "sourceName": "Tư pháp - Hộ tịch Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "phân chia di sản",
      "chia thừa kế",
      "thỏa thuận",
      "nhân thân",
      "sổ hồng"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-09",
    "title": "HỎI: Tôi muốn sửa đổi, bổ sung hoặc hủy bỏ một hợp đồng, giao dịch đã chứng thực thì làm thế nào?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Thủ tục Chứng thực việc sửa đổi, bổ sung, hủy bỏ giao dịch [Mã 2.000913] giải quyết ngay trong ngày làm việc. Lệ phí: 30.000 đồng/giao dịch. Các bên tham gia hợp đồng gốc phải cùng có mặt tại quầy Một cửa, mang theo bản gốc hợp đồng đã chứng thực trước đây, dự thảo văn bản thỏa thuận sửa đổi/bổ sung/hủy bỏ mới và CCCD gắn chip để cán bộ kiểm tra đối chiếu.",
    "sourceName": "Bộ phận Một cửa UBND Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "sửa đổi hợp đồng",
      "bổ sung giao dịch",
      "hủy hợp đồng",
      "đối chiếu",
      "lời chứng"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-10",
    "title": "HỎI: Hợp đồng đã công chứng bị ghi sai thông tin cá nhân hoặc số liệu thì đính chính như thế nào?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Thủ tục Sửa lỗi sai sót trong giao dịch [Mã 2.000927] áp dụng cho đính chính lỗi kỹ thuật, chữ viết, số liệu ghi sai so với giấy tờ gốc mà không làm đổi bản chất hợp đồng. Lệ phí: 25.000 đồng/giao dịch, giải quyết ngay trong ngày làm việc. Cần nộp hợp đồng gốc có lỗi, giấy tờ làm căn cứ đính chính (CCCD đúng, Sổ đỏ đúng...) và văn bản đề nghị đính chính của các bên.",
    "sourceName": "Tư pháp Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "sửa lỗi sai sót",
      "đính chính",
      "lỗi kỹ thuật",
      "hợp đồng sai",
      "đối chiếu"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-11",
    "title": "HỎI: Tôi muốn xin cấp bản sao của một hợp đồng giao dịch đất đai đã chứng thực trước đây tại phường?",
    "type": "TEXT",
    "category": "THU_TUC",
    "content": "ĐÁP: Thủ tục Cấp bản sao hợp đồng, giao dịch đã chứng thực [Mã 2.000942] được giải quyết ngay trong ngày làm việc. Lệ phí: 2.000 đồng/trang (từ trang thứ 3: 1.000 đồng/trang, tối đa 200.000 đồng/bản). Chủ thể trong hợp đồng hoặc người thừa kế/ủy quyền hợp pháp điền Phiếu yêu cầu và xuất trình CCCD gắn chip để cán bộ tra cứu trong kho lưu trữ của phường.",
    "sourceName": "Phòng Lưu trữ UBND Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "bản sao giao dịch",
      "sao lục hợp đồng",
      "kho lưu trữ",
      "yêu cầu sao lục",
      "lệ phí"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
  },
  {
    "id": "kb-faq-12",
    "title": "HỎI: Trụ sở UBND và Ủy ban MTTQ Phường Chánh Hiệp ở đâu? Có số hotline không?",
    "type": "TEXT",
    "category": "KHU_PHO",
    "content": "ĐÁP: Trụ sở cơ quan đặt tại: Số 1240 Đại Lộ Bình Dương, Khu phố Định Hòa 5, Phường Chánh Hiệp, TP. Thủ Dầu Một. Đường dây nóng tiếp nhận phản ánh dân sinh và tư vấn thủ tục: 0989614614. Giờ làm việc: Sáng 07:30 - 11:30, Chiều 13:00 - 17:00 (Từ Thứ Hai đến Thứ Sáu).",
    "sourceName": "Văn phòng HĐND - UBND & MTTQ Phường Chánh Hiệp",
    "official": true,
    "tags": [
      "địa chỉ",
      "trụ sở",
      "hotline",
      "đường dây nóng",
      "giờ làm việc"
    ],
    "rolesAllowed": [
      "PUBLIC",
      "STAFF"
    ],
    "updatedAt": "2025-11-13",
    "isActive": true
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
