import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit2, Trash2, FileText, Upload, Search, 
  X, Check, ExternalLink, Clock, RefreshCw, AlertTriangle,
  File, ArrowRight, Save, Trash
} from 'lucide-react';
import { NewDocument } from '../../types';
import { documentService } from '../../services/documentService';
import { uploadFileViaAppsScript } from '../../lib/googleDriveService';

interface DocumentManagerProps {
  onShowToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ onShowToast }) => {
  const [documents, setDocuments] = useState<NewDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'Published' | 'Draft' | 'Hidden'>('ALL');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<NewDocument | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<Omit<NewDocument, 'id' | 'createdAt' | 'updatedAt'>>({
    codeNumber: '',
    title: '',
    docType: 'Kế hoạch',
    field: 'MTTQ',
    issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
    issueDate: new Date().toISOString().substring(0, 10),
    signer: '',
    signerPosition: 'Chủ tịch Ủy ban MTTQ',
    summary: '',
    isPublic: true,
    status: 'Published',
    fileUrl: '',
    fileName: '',
    fileSize: ''
  });

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error: any) {
      onShowToast?.('error', 'Lỗi tải dữ liệu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = (doc.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                           (doc.codeNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === 'ALL' || doc.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [documents, searchTerm, activeTab]);

  const handleOpenModal = (doc?: NewDocument) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({ 
        codeNumber: doc.codeNumber || '',
        title: doc.title || '',
        docType: doc.docType || 'Kế hoạch',
        field: doc.field || 'MTTQ',
        issuer: doc.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: doc.issueDate || new Date().toISOString().substring(0, 10),
        signer: doc.signer || '',
        signerPosition: doc.signerPosition || 'Chủ tịch Ủy ban MTTQ',
        summary: doc.summary || '',
        isPublic: doc.isPublic ?? true,
        status: doc.status || 'Published',
        fileUrl: doc.fileUrl || '',
        fileName: doc.fileName || '',
        fileSize: doc.fileSize || ''
      });
    } else {
      setEditingDoc(null);
      setFormData({
        codeNumber: '',
        title: '',
        docType: 'Kế hoạch',
        field: 'MTTQ',
        issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: new Date().toISOString().substring(0, 10),
        signer: '',
        signerPosition: 'Chủ tịch Ủy ban MTTQ',
        summary: '',
        isPublic: true,
        status: 'Published',
        fileUrl: '',
        fileName: '',
        fileSize: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    onShowToast?.('info', 'Đang tải tệp lên Google Drive...');
    try {
      const result = await uploadFileViaAppsScript(file);
      if (result && result.webViewLink) {
        setFormData(prev => ({
          ...prev,
          fileUrl: result.webViewLink,
          fileName: result.name || file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB'
        }));
        onShowToast?.('success', 'Đã tải tệp lên thành công.');
      } else {
        throw new Error('Không nhận được liên kết từ Drive.');
      }
    } catch (error: any) {
      onShowToast?.('error', 'Lỗi tải tệp: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      if (editingDoc) {
        await documentService.updateDocument(editingDoc.id, formData);
        onShowToast?.('success', 'Đã cập nhật văn bản thành công.');
      } else {
        await documentService.addDocument(formData);
        onShowToast?.('success', 'Đã ban hành văn bản mới thành công.');
      }
      setIsModalOpen(false);
      loadDocuments();
    } catch (error: any) {
      onShowToast?.('error', 'Lỗi lưu dữ liệu: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateDelete = (id: string) => {
    setDocToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;
    try {
      await documentService.deleteDocument(docToDelete);
      onShowToast?.('success', 'Đã xóa văn bản thành công.');
      setIsConfirmDeleteOpen(false);
      setDocToDelete(null);
      loadDocuments();
    } catch (error: any) {
      onShowToast?.('error', 'Lỗi khi xóa văn bản: ' + error.message);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen relative">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="text-blue-600" />
            Quản lý Văn bản Triển khai
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Hệ thống lưu trữ và công khai văn bản chính thức</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => loadDocuments()}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer pointer-events-auto"
            title="Tải lại danh sách"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            type="button"
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer pointer-events-auto"
          >
            <Plus size={20} />
            <span>Thêm Văn bản</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm theo trích yếu hoặc số hiệu..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {(['ALL', 'Published', 'Draft', 'Hidden'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer pointer-events-auto ${
                  activeTab === tab 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {tab === 'ALL' ? 'Tất cả' : tab === 'Published' ? 'Đã xuất bản' : tab === 'Draft' ? 'Bản nháp' : 'Đã ẩn'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-black tracking-wider">
                <th className="px-6 py-4">Số / Ký hiệu</th>
                <th className="px-6 py-4">Trích yếu nội dung</th>
                <th className="px-6 py-4">Loại & Lĩnh vực</th>
                <th className="px-6 py-4">Ngày ban hành</th>
                <th className="px-6 py-4 text-center">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Đang tải dữ liệu...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{doc.codeNumber}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">{doc.title}</p>
                    {doc.fileName && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                        <Check size={12} /> {doc.fileName} ({doc.fileSize})
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100 w-fit font-bold uppercase">{doc.docType}</span>
                      <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200 w-fit font-bold uppercase">{doc.field}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Clock size={14} className="text-slate-400" />
                      {doc.issueDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      doc.status === 'Published' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : doc.status === 'Draft'
                        ? 'bg-amber-100 text-amber-700 border-amber-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}>
                      {doc.status === 'Published' ? 'Xuất bản' : doc.status === 'Draft' ? 'Bản nháp' : 'Đã ẩn'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 relative z-10">
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleOpenModal(doc); }}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90 cursor-pointer pointer-events-auto"
                        title="Chỉnh sửa"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); initiateDelete(doc.id); }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90 cursor-pointer pointer-events-auto"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                    <div className="opacity-40">
                      <FileText className="w-12 h-12 mx-auto mb-3" />
                      <p>Không tìm thấy văn bản nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {editingDoc ? 'Cập nhật Văn bản' : 'Thêm Văn bản mới'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Cung cấp đầy đủ thông tin để công khai văn bản</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider">Số / Ký hiệu *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ví dụ: 12/KH-MTTQ"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                    value={formData.codeNumber}
                    onChange={e => setFormData({...formData, codeNumber: e.target.value})}
                  />
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider">Ngày ban hành *</label>
                  <input 
                    type="date"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                    value={formData.issueDate}
                    onChange={e => setFormData({...formData, issueDate: e.target.value})}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider">Trích yếu nội dung *</label>
                  <textarea 
                    required
                    rows={3}
                    placeholder="Nhập trích yếu đầy đủ của văn bản..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider">Loại văn bản</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 cursor-pointer"
                    value={formData.docType}
                    onChange={e => setFormData({...formData, docType: e.target.value})}
                  >
                    <option value="Kế hoạch">Kế hoạch</option>
                    <option value="Quyết định">Quyết định</option>
                    <option value="Công văn">Công văn</option>
                    <option value="Thông báo">Thông báo</option>
                    <option value="Nghị quyết">Nghị quyết</option>
                    <option value="Báo cáo">Báo cáo</option>
                    <option value="Hướng dẫn">Hướng dẫn</option>
                    <option value="Chương trình">Chương trình</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider">Lĩnh vực</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 cursor-pointer"
                    value={formData.field}
                    onChange={e => setFormData({...formData, field: e.target.value})}
                  >
                    <option value="MTTQ">Công tác Mặt trận</option>
                    <option value="Tổ chức">Tổ chức - Cán bộ</option>
                    <option value="Tuyên giáo">Tuyên giáo</option>
                    <option value="An sinh">An sinh xã hội</option>
                    <option value="Giám sát">Giám sát - Phản biện</option>
                    <option value="Thi đua">Thi đua - Khen thưởng</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider">Người ký</label>
                  <input 
                    type="text"
                    placeholder="Ví dụ: Trần Thị Hoa"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900"
                    value={formData.signer}
                    onChange={e => setFormData({...formData, signer: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider">Trạng thái hiển thị</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-900 cursor-pointer"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as any})}
                  >
                    <option value="Published">Đã xuất bản (Công khai)</option>
                    <option value="Draft">Bản nháp (Nội bộ)</option>
                    <option value="Hidden">Đã ẩn</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-black text-slate-700 uppercase mb-1.5 tracking-wider">Tệp đính kèm (PDF / Word)</label>
                  <div className="flex flex-col gap-3">
                    <div className="relative group">
                      <input 
                        type="file" 
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        accept=".pdf,.doc,.docx"
                      />
                      <div className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl transition-all ${
                        isUploading ? 'bg-slate-100 border-slate-300' : 'bg-blue-50/30 border-blue-200 group-hover:bg-blue-50 group-hover:border-blue-400'
                      }`}>
                        {isUploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <span className="text-sm font-bold text-blue-700">Đang tải lên Drive...</span>
                          </div>
                        ) : formData.fileName ? (
                          <div className="flex items-center gap-3 w-full">
                            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                              <Check size={24} />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <p className="text-sm font-black text-slate-900 truncate">{formData.fileName}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase">{formData.fileSize} • Đã lưu trên Drive</p>
                            </div>
                            <button 
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFormData({...formData, fileName: '', fileUrl: '', fileSize: ''}) }}
                              className="p-2 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-blue-500 mb-2" />
                            <p className="text-sm font-bold text-blue-700">Nhấp hoặc kéo thả để tải tệp lên</p>
                            <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-wider">Hỗ trợ PDF, DOCX tối đa 20MB</p>
                          </>
                        )}
                      </div>
                    </div>
                    {formData.fileUrl && (
                      <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-black text-slate-500 uppercase">Link Drive:</span>
                        <input 
                          type="text" 
                          readOnly 
                          value={formData.fileUrl} 
                          className="flex-1 bg-transparent text-[10px] font-mono outline-none text-blue-600"
                        />
                        <a href={formData.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1 text-slate-400 hover:text-blue-600">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all uppercase tracking-wider text-xs cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  disabled={isUploading || isSubmitting}
                  className="flex-[2] py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 uppercase tracking-wider text-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Save size={16} />
                      <span>{editingDoc ? 'Lưu thay đổi' : 'Ban hành Văn bản'}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      {isConfirmDeleteOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm pointer-events-auto">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Xác nhận xóa?</h3>
            <p className="text-sm text-slate-500 font-medium mb-6">Hành động này không thể hoàn tác. Văn bản sẽ bị xóa vĩnh viễn khỏi hệ thống.</p>
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-2xl transition-all uppercase tracking-wider text-xs cursor-pointer"
              >
                Hủy
              </button>
              <button 
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 uppercase tracking-wider text-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <Trash size={16} />
                <span>Xóa ngay</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
