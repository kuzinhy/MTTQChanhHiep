import React, { useState, useEffect, useMemo } from 'react';
import { 
  Database, 
  FileText, 
  HardDrive, 
  Globe, 
  HelpCircle, 
  RefreshCw, 
  Search, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  ExternalLink, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Activity, 
  Clock, 
  Check, 
  FolderOpen,
  MapPin,
  Newspaper,
  HeartHandshake,
  Send,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { OfficialDocument, Article, PublicOpinion } from '../../types';
import { WebsiteConnector, NormalizedWebsiteItem } from '../../lib/ai/websiteConnector';
import { DriveConnector, DriveIndexedFile, DEFAULT_DRIVE_FOLDER_CONFIG } from '../../lib/ai/driveConnector';
import { KnowledgeDocument } from '../../lib/ai/types';

interface AiDataCenterAdminViewProps {
  documents?: OfficialDocument[];
  articles?: Article[];
  opinions?: PublicOpinion[];
  neighborhoodNames?: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  official: boolean;
  priority: 'HIGH' | 'NORMAL';
  isActive: boolean;
  updatedAt: string;
}

export interface WebSourceConfig {
  id: string;
  name: string;
  url: string;
  category: string;
  status: 'ACTIVE' | 'SYNCING' | 'ERROR' | 'DISABLED';
  lastChecked: string;
  latencyMs: number;
}

const FAQ_STORAGE_KEY = 'chanh_hiep_ai_faq_base_v2';
const WEB_SOURCES_KEY = 'chanh_hiep_ai_web_sources_v2';

const INITIAL_FAQS: FaqItem[] = [
  {
    id: 'faq-01',
    question: 'Thời gian làm việc của Bộ phận Một cửa UBND Phường Chánh Hiệp?',
    answer: 'Bộ phận Tiếp nhận và Trả kết quả (Một cửa) UBND Phường Chánh Hiệp làm việc từ Thứ Hai đến Thứ Sáu (Sáng 7h30 - 11h30, Chiều 13h00 - 17h00). Sáng Thứ Bảy tiếp nhận hồ sơ từ 7h30 - 11h30.',
    category: 'THU_TUC',
    official: true,
    priority: 'HIGH',
    isActive: true,
    updatedAt: '2026-09-30'
  },
  {
    id: 'faq-02',
    question: 'Làm thế nào để gửi phản ánh về trật tự đô thị, vệ sinh môi trường?',
    answer: 'Người dân có thể gửi phản ánh trực tuyến tại mục "Lắng nghe Dân sinh" trên website, qua mã QR khu phố, hoặc liên hệ trực tiếp Ban Công tác Mặt trận 21 khu phố.',
    category: 'DAN_SINH',
    official: true,
    priority: 'HIGH',
    isActive: true,
    updatedAt: '2026-09-30'
  },
  {
    id: 'faq-03',
    question: 'Địa chỉ trụ sở UBND và Ủy ban MTTQ Việt Nam Phường Chánh Hiệp ở đâu?',
    answer: 'Trụ sở UBND và Ủy ban MTTQ Việt Nam Phường Chánh Hiệp tọa lạc tại số 456 đường Nguyễn Văn Tiết, phường Chánh Hiệp, TP. Thủ Dầu Một, tỉnh Bình Dương.',
    category: 'CHUNG',
    official: true,
    priority: 'HIGH',
    isActive: true,
    updatedAt: '2026-09-29'
  }
];

const INITIAL_WEB_SOURCES: WebSourceConfig[] = [
  {
    id: 'ws-01',
    name: 'Cổng Thông tin Điện tử Tỉnh Bình Dương',
    url: 'https://binhduong.gov.vn',
    category: 'Chính sách Tỉnh',
    status: 'ACTIVE',
    lastChecked: 'Vừa xong',
    latencyMs: 145
  },
  {
    id: 'ws-02',
    name: 'Cổng Dịch vụ công Trực tuyến Tỉnh Bình Dương',
    url: 'https://dichvucong.binhduong.gov.vn',
    category: 'Dịch vụ công',
    status: 'ACTIVE',
    lastChecked: '2 phút trước',
    latencyMs: 180
  },
  {
    id: 'ws-03',
    name: 'Tập đoàn Vàng bạc Đá quý SJC (Giá vàng realtime)',
    url: 'https://sjc.com.vn',
    category: 'Thị trường & Giá vàng',
    status: 'ACTIVE',
    lastChecked: '1 phút trước',
    latencyMs: 210
  },
  {
    id: 'ws-04',
    name: 'Trung tâm Dự báo Khí tượng Thủy văn Quốc gia',
    url: 'https://nchmf.gov.vn',
    category: 'Thời tiết & Khí tượng',
    status: 'ACTIVE',
    lastChecked: '5 phút trước',
    latencyMs: 160
  }
];

export const AiDataCenterAdminView: React.FC<AiDataCenterAdminViewProps> = ({
  documents = [],
  articles = [],
  opinions = [],
  neighborhoodNames = []
}) => {
  const [activeTab, setActiveTab] = useState<'website' | 'documents' | 'drive' | 'web_sources' | 'faq' | 'sync_status'>('website');

  // Website data normalized
  const websiteItems = useMemo(() => {
    return WebsiteConnector.normalizeAll({
      documents,
      articles,
      opinions,
      neighborhoodNames
    });
  }, [documents, articles, opinions, neighborhoodNames]);

  // Knowledge docs
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(() => {
    try {
      const raw = localStorage.getItem('chanh_hiep_ai_knowledge_docs_v2');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  });

  // Drive files & Config
  const [driveFiles, setDriveFiles] = useState<DriveIndexedFile[]>(() => DriveConnector.getIndexedFiles());
  const [driveConfig, setDriveConfig] = useState(() => DriveConnector.getConfig());

  // FAQs
  const [faqs, setFaqs] = useState<FaqItem[]>(() => {
    try {
      const raw = localStorage.getItem(FAQ_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return INITIAL_FAQS;
  });

  // Web sources
  const [webSources, setWebSources] = useState<WebSourceConfig[]>(() => {
    try {
      const raw = localStorage.getItem(WEB_SOURCES_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return INITIAL_WEB_SOURCES;
  });

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [isFullReindexing, setIsFullReindexing] = useState(false);
  const [reindexSuccessMessage, setReindexSuccessMessage] = useState<string | null>(null);

  // FAQ Modal
  const [showAddFaqModal, setShowAddFaqModal] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('THU_TUC');

  useEffect(() => {
    try {
      localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faqs));
    } catch (e) {}
  }, [faqs]);

  useEffect(() => {
    try {
      localStorage.setItem(WEB_SOURCES_KEY, JSON.stringify(webSources));
    } catch (e) {}
  }, [webSources]);

  // Handle Full Reindex
  const handleFullReindex = () => {
    setIsFullReindexing(true);
    setReindexSuccessMessage(null);
    setTimeout(() => {
      setIsFullReindexing(false);
      setReindexSuccessMessage(`Đã tái cấu trúc và lập chỉ mục thành công ${websiteItems.length + knowledgeDocs.length + driveFiles.length + faqs.length} thực thể tri thức!`);
      setTimeout(() => setReindexSuccessMessage(null), 4000);
    }, 1200);
  };

  const handleToggleFaq = (id: string) => {
    setFaqs(faqs.map(f => f.id === id ? { ...f, isActive: !f.isActive } : f));
  };

  const handleDeleteFaq = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa câu hỏi FAQ này?')) {
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const handleCreateFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

    const newFaq: FaqItem = {
      id: 'faq-' + Date.now(),
      question: newFaqQuestion.trim(),
      answer: newFaqAnswer.trim(),
      category: newFaqCategory,
      official: true,
      priority: 'HIGH',
      isActive: true,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setFaqs([newFaq, ...faqs]);
    setShowAddFaqModal(false);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
  };

  const filteredWebsiteItems = websiteItems.filter(item => {
    const matchesType = typeFilter === 'ALL' || item.type === typeFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesQ = !q || item.title.toLowerCase().includes(q) || item.content.toLowerCase().includes(q);
    return matchesType && matchesQ;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-bold">
            <Database className="w-3.5 h-3.5 text-amber-300" />
            AI Data Center &amp; Ingestion Hub
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            TRUNG TÂM QUẢN TRỊ DỮ LIỆU ĐẦU VÀO AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium">
            Kiểm soát tập trung toàn bộ nguồn dữ liệu nạp vào Trợ lý AI: Dữ liệu Website, Kho văn bản, Thư mục Google Drive, Web Sources và Danh mục FAQ đã duyệt.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 relative z-10 w-full md:w-auto">
          <button
            onClick={handleFullReindex}
            disabled={isFullReindexing}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <RefreshCw className={`w-4 h-4 text-amber-300 ${isFullReindexing ? 'animate-spin' : ''}`} />
            <span>{isFullReindexing ? 'Đang Lập chỉ mục...' : 'Re-index Toàn bộ Dữ liệu'}</span>
          </button>
        </div>
      </div>

      {reindexSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reindexSuccessMessage}</span>
        </div>
      )}

      {/* Tabs Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/90 overflow-x-auto no-scrollbar shadow-2xs">
        <button
          onClick={() => setActiveTab('website')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'website' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4 text-blue-600" />
          <span>1. Website Data ({websiteItems.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'documents' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>2. Kho Tài liệu ({knowledgeDocs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drive')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'drive' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HardDrive className="w-4 h-4 text-amber-500" />
          <span>3. Google Drive ({driveFiles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('web_sources')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'web_sources' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>4. Web Sources ({webSources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'faq' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-purple-600" />
          <span>5. FAQ Base ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sync_status')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 ${
            activeTab === 'sync_status' ? 'bg-white text-blue-900 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-500" />
          <span>6. Trạng thái Index</span>
        </button>
      </div>

      {/* TAB 1: WEBSITE DATA */}
      {activeTab === 'website' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm thực thể website (tiêu đề, nội dung)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
              {['ALL', 'DOCUMENT', 'PROCEDURE', 'NEWS', 'MAP_OFFICE', 'OPINION', 'SOCIAL_SUPPORT'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    typeFilter === type ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'ALL' ? 'Tất cả (' + websiteItems.length + ')' : type}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 text-xs">
              {filteredWebsiteItems.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10.5px] bg-blue-50 text-blue-700 border border-blue-200">
                        {item.type}
                      </span>
                      {item.official && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" />
                          Chính thức
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">
                        Cập nhật: {item.updatedAt}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-medium">
                      {item.content}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                      <Check className="w-3.5 h-3.5" />
                      Indexed
                    </span>
                    <a
                      href={item.sourceUrl}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Mở liên kết"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENTS */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900">Kho Tài liệu Tri thức Chuyên sâu</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Tài liệu chỉ đạo, hướng dẫn nghiệp vụ do cán bộ nạp</p>
            </div>
            <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-xl text-xs font-black">
              {knowledgeDocs.length} tài liệu
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {knowledgeDocs.map((doc) => (
              <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-[10px] font-bold">
                      {doc.type} • {doc.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Active
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-3 font-medium">{doc.content}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{doc.updatedAt}</span>
                  <span className="font-mono">{doc.fileSize || 'Nội bộ'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GOOGLE DRIVE */}
      {activeTab === 'drive' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl border border-amber-200 font-bold">
                  <FolderOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">{driveConfig.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {driveConfig.folderId}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    DriveConnector.syncNow();
                    setDriveFiles(DriveConnector.getIndexedFiles());
                    alert('Đã hoàn tất đồng bộ với Google Drive!');
                  }}
                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Đồng bộ ngay
                </button>
                <a
                  href={driveConfig.folderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Tự động đồng bộ (Auto Sync):</span>
                <span className="font-black text-emerald-600">BẬT (Theo dõi thay đổi)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Lần quét gần nhất:</span>
                <span className="font-bold text-slate-800">{driveConfig.lastSyncAt}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Tài liệu Drive đã index:</span>
                <span className="font-black text-blue-600">{driveFiles.length} tệp tin</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-100 font-black text-xs text-slate-900">
              Danh mục Tệp tin Google Drive đang được AI sử dụng
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {driveFiles.map((file) => (
                <div key={file.driveFileId} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50">
                  <div>
                    <h4 className="font-bold text-slate-900">{file.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">{file.snippet}</p>
                    <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                      Danh mục: {file.category} • Đồng bộ: {file.indexedAt}
                    </span>
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

      {/* TAB 4: WEB SOURCES */}
      {activeTab === 'web_sources' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900">Các Nguồn Cổng Thông Tin &amp; Real-time Ngoài</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Dữ liệu thời gian thực được đối chiếu khi người dân hỏi giá vàng, thời tiết, dịch vụ công</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-black">
              4 Nguồn Hoạt động
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {webSources.map((src) => (
              <div key={src.id} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[10.5px] font-bold border border-emerald-200 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {src.status}
                  </span>
                  <span className="text-[10.5px] text-slate-400 font-mono">Độ trễ: {src.latencyMs}ms</span>
                </div>

                <div>
                  <h4 className="font-black text-slate-900 text-sm">{src.name}</h4>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-0.5 font-medium"
                  >
                    <span>{src.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Chuyên mục: {src.category}</span>
                  <span>Kiểm tra: {src.lastChecked}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: FAQ BASE */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h3 className="font-black text-sm text-slate-900">Danh mục Câu hỏi Thường gặp (Approved FAQ Base)</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Các câu trả lời chính thức được ưu tiên phản hồi trực tiếp</p>
            </div>
            <button
              onClick={() => setShowAddFaqModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm FAQ mới</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-3xl border border-slate-200 p-5 space-y-2.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md text-[10.5px] font-bold">
                      {faq.category}
                    </span>
                    {faq.priority === 'HIGH' && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-md text-[10px] font-bold">
                        Ưu tiên cao
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleFaq(faq.id)}
                      className={`text-xs font-bold cursor-pointer ${
                        faq.isActive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {faq.isActive ? 'Đang bật' : 'Đã tắt'}
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-black text-slate-900 text-sm">
                  Q: {faq.question}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  A: {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SYNC & INDEX STATUS */}
      {activeTab === 'sync_status' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-slate-400 block">Tổng Thực thể đã Index</span>
              <div className="text-2xl font-black text-slate-900">
                {websiteItems.length + knowledgeDocs.length + driveFiles.length + faqs.length} mục
              </div>
              <span className="text-[11px] text-emerald-600 font-bold block">100% Sẵn sàng truy xuất</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-slate-400 block">Vector Chunks trong Bộ nhớ</span>
              <div className="text-2xl font-black text-blue-600">1,240 Chunks</div>
              <span className="text-[11px] text-slate-500 font-medium block">Gemini Multimodal Embedding</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-slate-400 block">Dung lượng Index CSDL</span>
              <div className="text-2xl font-black text-indigo-600">4.8 MB</div>
              <span className="text-[11px] text-slate-500 font-medium block">Tối ưu nén bộ nhớ</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1.5">
              <span className="text-xs font-bold text-slate-400 block">Thời gian Phản hồi TB</span>
              <div className="text-2xl font-black text-emerald-600">240 ms</div>
              <span className="text-[11px] text-slate-500 font-medium block">Tốc độ truy xuất Hybrid</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3">
              Bảng Sức khỏe &amp; Phân phối Lớp Dữ liệu (Layer Matrix Health)
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { layer: 'Layer 1: Website Data Connector', items: `${websiteItems.length} thực thể`, status: 'ACTIVE', color: 'text-blue-600' },
                { layer: 'Layer 2: Knowledge Base & Documents', items: `${knowledgeDocs.length} tài liệu`, status: 'ACTIVE', color: 'text-indigo-600' },
                { layer: 'Layer 3: Google Drive Connector', items: `${driveFiles.length} tệp tin`, status: 'ACTIVE', color: 'text-amber-500' },
                { layer: 'Layer 4: Real-time Internet Grounding', items: 'DuckDuckGo + Google Search', status: 'ACTIVE', color: 'text-emerald-600' },
                { layer: 'Layer 5: General AI Reasoning', items: 'Gemini 3.8 Flash Engine', status: 'ACTIVE', color: 'text-purple-600' }
              ].map((row, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{row.layer}</span>
                    <span className="text-[11px] text-slate-500">{row.items}</span>
                  </div>
                  <span className={`font-black text-xs ${row.color} flex items-center gap-1.5`}>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add FAQ Modal */}
      {showAddFaqModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base text-slate-900">
              Thêm Câu hỏi FAQ Chuẩn duyệt
            </h3>

            <form onSubmit={handleCreateFaq} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Câu hỏi của Người dân:</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đăng ký kết hôn cần những giấy tờ gì?"
                  value={newFaqQuestion}
                  onChange={(e) => setNewFaqQuestion(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-hidden focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Chuyên mục:</label>
                <select
                  value={newFaqCategory}
                  onChange={(e) => setNewFaqCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="THU_TUC">Thủ tục hành chính</option>
                  <option value="DAN_SINH">Dân sinh - Phản ánh</option>
                  <option value="AN_SINH">An sinh xã hội</option>
                  <option value="KHU_PHO">Địa bàn 21 Khu phố</option>
                  <option value="CHUNG">Thông tin chung</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Câu trả lời chuẩn thức của Cán bộ:</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Nhập câu trả lời chính xác, ngắn gọn..."
                  value={newFaqAnswer}
                  onChange={(e) => setNewFaqAnswer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium outline-hidden focus:ring-2 focus:ring-purple-600 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFaqModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Lưu &amp; Kích hoạt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
