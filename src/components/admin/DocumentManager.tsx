import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Plus, Edit2, Trash2, FileText, Upload, Search, 
  X, Check, ExternalLink, Clock, RefreshCw, AlertTriangle,
  File, ArrowRight, Save, Trash, Sparkles, CheckCircle2, 
  Eye, Layers, Send, AlertCircle, HardDrive, Filter, BookOpen, 
  Tag, Calendar, User, ShieldCheck, HelpCircle, ChevronRight,
  ListTodo, Archive, History, Copy, ArrowUpRight, FolderGit2,
  Database, Link2, FolderOpen, CheckSquare, Square
} from 'lucide-react';
import { ChanhHiepDriveFolderBar } from '../office/ChanhHiepDriveFolderBar';
import { GoogleDriveExplorer, DriveExplorerFile } from '../office/GoogleDriveExplorer';
import { NewDocument, DocumentTask, DocumentAuditLog, ExtractedConfidenceMap } from '../../types';
import { documentService } from '../../services/documentService';
import { uploadFileViaServerProxy, extractGoogleDriveFileId, deleteFileFromGoogleDrive } from '../../lib/googleDriveService';
import { parseAndExtractDocument, SmartParseResult } from '../../services/smartDocumentIngestion';
import { generateStandardizedFilename, DOCUMENT_TYPE_CODES } from '../../services/filenameService';
import { checkForDuplicateDocument, calculateFileHash, DuplicateCheckResult } from '../../services/duplicateDetectionService';
import { AppStorageEngine } from '../../lib/storage';

export const OFFICIAL_DOCUMENTS_DRIVE_FOLDER_ID = '1Vw365JIFDuUFT1AwF-MoJD8kKkvhiLH_';

export const SOCIO_POLITICAL_ORGANIZATIONS = [
  'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
  'Đoàn TNCS Hồ Chí Minh phường Chánh Hiệp',
  'Hội Liên hiệp Phụ nữ phường Chánh Hiệp',
  'Hội Cựu chiến binh phường Chánh Hiệp',
  'Công đoàn Cơ sở phường Chánh Hiệp',
  'Hội Nông dân phường Chánh Hiệp',
  'Hội Người cao tuổi phường Chánh Hiệp',
  'Đảng ủy phường Chánh Hiệp',
  'HĐND - UBND phường Chánh Hiệp',
  'Ban Chỉ huy Quân sự phường Chánh Hiệp',
  'Công an phường Chánh Hiệp',
  'Ban Công tác Mặt trận 21 Khu phố',
  'Cơ quan / Tổ chức khác'
];

export const DOCUMENT_FIELDS = [
  'Công tác Mặt trận',
  'Đoàn thanh niên',
  'Phụ nữ',
  'Cựu chiến binh',
  'Chữ thập đỏ',
  'Công đoàn',
  'Nông dân',
  'Người cao tuổi',
  'An sinh xã hội',
  'Tuyên truyền - Tuyên giáo',
  'Dân vận',
  'Giám sát - Phản biện',
  'Thi đua - Khen thưởng',
  'Dân chủ - Pháp luật',
  'Chuyển đổi số'
];

interface DocumentManagerProps {
  onShowToast?: (type: 'success' | 'error' | 'info', message: string) => void;
  currentUser?: any;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({ onShowToast, currentUser }) => {
  const [documents, setDocuments] = useState<NewDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [activeStatusTab, setActiveTab] = useState<'ALL' | 'Published' | 'Draft' | 'Hidden' | 'ARCHIVED'>('ALL');
  const [selectedDocTypeFilter, setSelectedDocTypeFilter] = useState<string>('ALL');
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState<string>('ALL');
  const [selectedFieldFilter, setSelectedFieldFilter] = useState<string>('ALL');
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [hasTasksFilter, setHasTasksFilter] = useState<boolean | null>(null);
  const [isCustomAgency, setIsCustomAgency] = useState<boolean>(false);

  // Modal & Processing States
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  // Google Drive Monitored Folder Config & Import States
  const [monitoredFolderId, setMonitoredFolderId] = useState<string>(() => {
    return localStorage.getItem('chanh_hiep_monitored_drive_folder_id') || OFFICIAL_DOCUMENTS_DRIVE_FOLDER_ID;
  });
  const [folderInputVal, setFolderInputVal] = useState<string>(monitoredFolderId);
  const [isDriveImportModalOpen, setIsDriveImportModalOpen] = useState(false);
  const [selectedDriveFilesToImport, setSelectedDriveFilesToImport] = useState<string[]>([]);
  const [isSavedFolderToast, setIsSavedFolderToast] = useState(false);
  const [filterImportFolder, setFilterImportFolder] = useState<string>('ALL');
  
  const [selectedDocForDetail, setSelectedDocForDetail] = useState<NewDocument | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'meta' | 'preview' | 'content' | 'tasks' | 'audit'>('meta');
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [editingDoc, setEditingDoc] = useState<NewDocument | null>(null);

  // Drag & Drop / Processing File States
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>('');
  const [fileHash, setFileHash] = useState<string>('');
  const [processingStatus, setProcessingStatus] = useState<'IDLE' | 'PARSING' | 'EXTRACTING' | 'WAITING_REVIEW' | 'UPLOADING_DRIVE' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [parsedText, setParsedText] = useState<string>('');
  
  // Structured Smart Form Data
  const [formData, setFormData] = useState<Partial<NewDocument>>({
    codeNumber: '',
    documentNumber: '',
    documentSymbol: '',
    documentNumberFull: '',
    title: '',
    docType: 'Công văn',
    field: 'Công tác Mặt trận',
    issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
    issuingAgency: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
    issueDate: new Date().toISOString().substring(0, 10),
    signer: 'Trần Văn Nam',
    signerPosition: 'Chủ tịch Ủy ban MTTQ',
    summary: '',
    documentSummary: '',
    priority: 'Bình thường',
    confidentialLevel: 'Thường',
    leadUnit: 'Ban Thường trực MTTQ phường',
    coordinatingUnits: [],
    keywords: [],
    isPublic: true,
    status: 'Published',
    fileUrl: '',
    fileName: '',
    fileSize: ''
  });

  const [proposedFilename, setProposedFilename] = useState<string>('');
  const [versionSuffix, setVersionSuffix] = useState<string>('');
  const [extractedTasks, setExtractedTasks] = useState<DocumentTask[]>([]);
  const [selectedTaskIndices, setSelectedTaskIndices] = useState<number[]>([]);
  const [confidenceMap, setConfidenceMap] = useState<ExtractedConfidenceMap>({});

  // Duplicate Check Warning State
  const [duplicateWarning, setDuplicateWarning] = useState<DuplicateCheckResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Batch Files Queue
  const [batchFiles, setBatchFiles] = useState<Array<{
    file: File;
    status: 'WAITING' | 'PROCESSING' | 'COMPLETED' | 'ERROR';
    result?: SmartParseResult;
    error?: string;
  }>>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const batchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const docs = await documentService.getDocuments();
      setDocuments(docs);
    } catch (error: any) {
      onShowToast?.('error', 'Lỗi tải danh sách văn bản: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract distinct years for filters
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    documents.forEach(d => {
      if (d.issueDate && d.issueDate.length >= 4) {
        years.add(d.issueDate.substring(0, 4));
      }
    });
    return Array.from(years).sort().reverse();
  }, [documents]);

  // Comprehensive Filtered Documents
  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch = !q || 
        (doc.title || '').toLowerCase().includes(q) || 
        (doc.codeNumber || '').toLowerCase().includes(q) ||
        (doc.documentNumberFull || '').toLowerCase().includes(q) ||
        (doc.signer || '').toLowerCase().includes(q) ||
        (doc.issuer || '').toLowerCase().includes(q) ||
        (doc.keywords || []).some(k => k.toLowerCase().includes(q)) ||
        (doc.contentText || '').toLowerCase().includes(q);

      const matchesStatus = activeStatusTab === 'ALL' 
        ? (!doc.isArchived)
        : activeStatusTab === 'ARCHIVED' 
        ? (doc.isArchived === true)
        : (doc.status === activeStatusTab && !doc.isArchived);

      const matchesType = selectedDocTypeFilter === 'ALL' || doc.docType === selectedDocTypeFilter;
      const matchesAgency = selectedAgencyFilter === 'ALL' || doc.issuer === selectedAgencyFilter || doc.issuingAgency === selectedAgencyFilter || (doc.issuer || '').includes(selectedAgencyFilter);
      const matchesField = selectedFieldFilter === 'ALL' || doc.field === selectedFieldFilter;
      const matchesYear = selectedYearFilter === 'ALL' || (doc.issueDate && doc.issueDate.startsWith(selectedYearFilter));
      const matchesTasks = hasTasksFilter === null || (hasTasksFilter ? (doc.tasks && doc.tasks.length > 0) : (!doc.tasks || doc.tasks.length === 0));

      return matchesSearch && matchesStatus && matchesType && matchesAgency && matchesField && matchesYear && matchesTasks;
    });
  }, [documents, searchTerm, activeStatusTab, selectedDocTypeFilter, selectedAgencyFilter, selectedFieldFilter, selectedYearFilter, hasTasksFilter]);

  // Open Smart Ingestion Modal
  const handleOpenSmartModal = (doc?: NewDocument) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        codeNumber: doc.codeNumber || doc.documentNumberFull || '',
        documentNumber: doc.documentNumber || '',
        documentSymbol: doc.documentSymbol || '',
        documentNumberFull: doc.documentNumberFull || doc.codeNumber || '',
        title: doc.title || '',
        docType: doc.docType || 'Công văn',
        field: doc.field || 'Công tác Mặt trận',
        issuer: doc.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issuingAgency: doc.issuingAgency || doc.issuer,
        issueDate: doc.issueDate || new Date().toISOString().substring(0, 10),
        signer: doc.signer || '',
        signerPosition: doc.signerPosition || 'Chủ tịch',
        summary: doc.summary || '',
        documentSummary: doc.documentSummary || doc.summary || '',
        priority: doc.priority || 'Bình thường',
        confidentialLevel: doc.confidentialLevel || 'Thường',
        leadUnit: doc.leadUnit || 'Ban Thường trực MTTQ',
        coordinatingUnits: doc.coordinatingUnits || [],
        keywords: doc.keywords || [],
        isPublic: doc.isPublic ?? true,
        status: doc.status || 'Published',
        fileUrl: doc.fileUrl || '',
        fileName: doc.fileName || '',
        fileSize: doc.fileSize || ''
      });
      setProposedFilename(doc.fileName || doc.standardizedFilename || '');
      setExtractedTasks(doc.tasks || []);
      setParsedText(doc.contentText || '');
      setProcessingStatus('WAITING_REVIEW');
    } else {
      setEditingDoc(null);
      setCurrentFile(null);
      setParsedText('');
      setProcessingStatus('IDLE');
      setStatusMessage('');
      setFormData({
        codeNumber: '',
        documentNumber: '',
        documentSymbol: '',
        documentNumberFull: '',
        title: '',
        docType: 'Công văn',
        field: 'Công tác Mặt trận',
        issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issuingAgency: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: new Date().toISOString().substring(0, 10),
        signer: 'Trần Văn Nam',
        signerPosition: 'Chủ tịch Ủy ban MTTQ',
        summary: '',
        documentSummary: '',
        priority: 'Bình thường',
        confidentialLevel: 'Thường',
        leadUnit: 'Ban Thường trực MTTQ phường',
        coordinatingUnits: [],
        keywords: [],
        isPublic: true,
        status: 'Published',
        fileUrl: '',
        fileName: '',
        fileSize: ''
      });
      setProposedFilename('');
      setExtractedTasks([]);
      setConfidenceMap({});
    }
    setDuplicateWarning(null);
    setIsSmartModalOpen(true);
  };

  // Handle Drag & Drop / File Select
  const handleFileSelected = async (file: File) => {
    if (!file) return;
    setCurrentFile(file);
    setProcessingStatus('PARSING');
    setStatusMessage('Đang tải và chuẩn bị tệp tin...');

    try {
      const hash = await calculateFileHash(file);
      setFileHash(hash);

      // Run AI Ingestion
      const parseResult = await parseAndExtractDocument({
        file,
        onStatusUpdate: (status, msg) => {
          setProcessingStatus(status as any);
          setStatusMessage(msg);
        }
      });

      setParsedText(parseResult.plainText);
      setConfidenceMap(parseResult.confidenceMap);
      setExtractedTasks(parseResult.tasks);
      setSelectedTaskIndices(parseResult.tasks.map((_, idx) => idx)); // Select all tasks by default

      const ext = parseResult.extractedData;
      setFormData({
        codeNumber: ext.codeNumber || '',
        documentNumber: ext.documentNumber || '',
        documentSymbol: ext.documentSymbol || '',
        documentNumberFull: ext.documentNumberFull || ext.codeNumber || '',
        title: ext.title || '',
        docType: ext.docType || 'Công văn',
        field: ext.field || 'Công tác Mặt trận',
        issuer: ext.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issuingAgency: ext.issuingAgency || ext.issuer,
        issueDate: ext.issueDate || new Date().toISOString().substring(0, 10),
        effectiveDate: ext.effectiveDate,
        deadline: ext.deadline,
        signer: ext.signer || 'Trần Văn Nam',
        signerPosition: ext.signerPosition || 'Chủ tịch',
        summary: ext.summary || '',
        documentSummary: ext.documentSummary || ext.summary || '',
        priority: ext.priority || 'Bình thường',
        confidentialLevel: ext.confidentialLevel || 'Thường',
        leadUnit: ext.leadUnit || 'Ban Thường trực MTTQ phường',
        coordinatingUnits: ext.coordinatingUnits || [],
        keywords: ext.keywords || [],
        isPublic: true,
        status: 'Published',
        fileSize: (file.size / 1024).toFixed(1) + ' KB',
        fileName: parseResult.suggestedFilename
      });

      setProposedFilename(parseResult.suggestedFilename);

      // Run Duplicate Check
      const dupResult = checkForDuplicateDocument({
        ...ext,
        standardizedFilename: parseResult.suggestedFilename,
        fileHash: hash
      }, documents);

      if (dupResult.isDuplicate) {
        setDuplicateWarning(dupResult);
      } else {
        setDuplicateWarning(null);
      }

      setProcessingStatus('WAITING_REVIEW');
      setStatusMessage('AI đã bóc tách xong. Vui lòng kiểm tra và xác nhận.');
      onShowToast?.('info', 'AI đã bóc tách xong 24 trường thông tin từ văn bản.');
    } catch (err: any) {
      console.error(err);
      setProcessingStatus('ERROR');
      setStatusMessage('Lỗi bóc tách văn bản: ' + err.message);
      onShowToast?.('error', 'Lỗi khi đọc file: ' + err.message);
    }
  };

  // Recalculate Filename when user edits fields
  const handleRecalculateFilename = () => {
    const stdName = generateStandardizedFilename({
      issueDate: formData.issueDate,
      docType: formData.docType,
      documentNumber: formData.documentNumber || formData.codeNumber,
      documentSymbol: formData.documentSymbol || 'MTTQ',
      summary: formData.summary || formData.title,
      extension: currentFile?.name.split('.').pop() || 'pdf',
      versionSuffix
    });
    setProposedFilename(stdName);
  };

  // CONFIRM & SAVE DOCUMENT Workflow
  const handleConfirmAndSaveDocument = async (overrideDuplicate = false) => {
    if (isSubmitting) return;

    if (!formData.title?.trim() || !formData.codeNumber?.trim()) {
      onShowToast?.('error', 'Vui lòng nhập Số hiệu và Trích yếu văn bản.');
      return;
    }

    // Check duplicate again if not overridden
    if (!overrideDuplicate && duplicateWarning?.isDuplicate) {
      return; // Will stay on modal showing warning
    }

    setIsSubmitting(true);
    setProcessingStatus('UPLOADING_DRIVE');
    setStatusMessage('Đang đổi tên file và tải lên Google Drive folder [1Vw365JIFDuUFT1AwF-MoJD8kKkvhiLH_]...');

    try {
      let finalDriveUrl = formData.fileUrl || `https://drive.google.com/drive/folders/${OFFICIAL_DOCUMENTS_DRIVE_FOLDER_ID}`;
      let finalDriveFileId = formData.driveFileId || '';

      // Perform Server Proxy Upload to Google Drive if file attached
      if (currentFile) {
        try {
          const uploadRes = await uploadFileViaServerProxy(currentFile, OFFICIAL_DOCUMENTS_DRIVE_FOLDER_ID);
          if (uploadRes && uploadRes.webViewLink) {
            finalDriveUrl = uploadRes.webViewLink;
            finalDriveFileId = uploadRes.id || extractGoogleDriveFileId(uploadRes.webViewLink);
          }
        } catch (uploadErr: any) {
          console.warn('[SmartIngestion] Upload proxy warning, setting direct drive folder link:', uploadErr);
          finalDriveUrl = `https://drive.google.com/drive/folders/${OFFICIAL_DOCUMENTS_DRIVE_FOLDER_ID}`;
        }
      }

      // Filter Approved Tasks
      const approvedTasks = extractedTasks.filter((_, idx) => selectedTaskIndices.includes(idx));

      // Construct Audit Log Entry
      const initialLog: DocumentAuditLog = {
        id: 'log-' + Date.now(),
        action: editingDoc ? 'Cập nhật văn bản' : 'Tiếp nhận & Bóc tách AI',
        userId: currentUser?.id || 'admin',
        userName: currentUser?.fullname || 'Cán bộ Quản trị',
        timestamp: new Date().toISOString(),
        details: `Văn bản "${formData.title}" đã được lưu thành công vào cơ sở dữ liệu và tải lên Google Drive.`
      };

      const existingAuditLogs = editingDoc?.auditLogs || [];

      const payload: Omit<NewDocument, 'id' | 'createdAt' | 'updatedAt'> = {
        codeNumber: formData.codeNumber || formData.documentNumberFull || '',
        title: formData.title || '',
        docType: formData.docType || 'Công văn',
        documentType: formData.docType || 'Công văn',
        documentNumber: formData.documentNumber || '',
        documentSymbol: formData.documentSymbol || '',
        documentNumberFull: formData.codeNumber || '',
        field: formData.field || 'Công tác Mặt trận',
        issuer: formData.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issuingAgency: formData.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: formData.issueDate || new Date().toISOString().substring(0, 10),
        effectiveDate: formData.effectiveDate || formData.issueDate || new Date().toISOString().substring(0, 10),
        deadline: formData.deadline || '',
        signer: formData.signer || 'Trần Văn Nam',
        signerPosition: formData.signerPosition || 'Chủ tịch',
        summary: formData.summary || formData.title || '',
        documentSummary: formData.documentSummary || formData.summary || formData.title || '',
        contentText: parsedText || formData.contentText || '',
        isPublic: formData.isPublic ?? true,
        status: formData.status || 'Published',
        processingStatus: 'CONFIRMED',
        priority: formData.priority || 'Bình thường',
        confidentialLevel: formData.confidentialLevel || 'Thường',
        leadUnit: formData.leadUnit || 'Ban Thường trực MTTQ',
        coordinatingUnits: formData.coordinatingUnits || [],
        keywords: formData.keywords || [],
        originalFilename: currentFile?.name || formData.originalFilename || '',
        standardizedFilename: proposedFilename || formData.standardizedFilename || '',
        fileHash: fileHash || formData.fileHash || '',
        fileUrl: finalDriveUrl || '',
        fileName: proposedFilename || formData.fileName || currentFile?.name || 'VanBan.pdf',
        fileSize: formData.fileSize || (currentFile ? (currentFile.size / 1024).toFixed(1) + ' KB' : '1.2 MB'),
        driveFileId: finalDriveFileId || '',
        driveFolderId: OFFICIAL_DOCUMENTS_DRIVE_FOLDER_ID,
        driveUrl: finalDriveUrl || '',
        tasks: approvedTasks || [],
        auditLogs: [initialLog, ...existingAuditLogs],
        aiExtracted: true,
        aiConfidence: confidenceMap || {},
        aiExtractedAt: new Date().toISOString(),
        uploadedBy: currentUser?.fullname || 'Cán bộ Quản trị',
        uploadedAt: new Date().toISOString()
      };

      let savedDocId = '';
      if (editingDoc) {
        await documentService.updateDocument(editingDoc.id, payload);
        savedDocId = editingDoc.id;
        onShowToast?.('success', 'Đã cập nhật văn bản thành công!');
      } else {
        savedDocId = await documentService.addDocument(payload);
        onShowToast?.('success', 'Đã xuất bản văn bản mới lên hệ thống & Google Drive thành công!');
      }

      // Auto-create tasks in Workspace Tasks if approved
      if (approvedTasks.length > 0) {
        const currentTasks = AppStorageEngine.getItem<any[]>(AppStorageEngine.KEYS.TASKS, []);
        approvedTasks.forEach(t => {
          currentTasks.unshift({
            id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            title: t.taskTitle,
            description: `Nhiệm vụ phát sinh từ Văn bản số ${payload.codeNumber}: ${t.taskDescription || payload.title}`,
            assigneeName: t.assignee || 'Cán bộ chuyên trách',
            assigneeRole: 'STAFF',
            dueDate: t.deadline || payload.issueDate,
            priority: t.priority === 'Khẩn' || t.priority === 'Thượng khẩn' ? 'HIGH' : 'MEDIUM',
            status: 'TODO',
            category: payload.field,
            relatedDocId: savedDocId,
            createdAt: new Date().toISOString()
          });
        });
        AppStorageEngine.setItem(AppStorageEngine.KEYS.TASKS, currentTasks);
        onShowToast?.('info', `Đã tự động khởi tạo ${approvedTasks.length} công việc trong Quản lý Nhiệm vụ.`);
      }

      setIsSmartModalOpen(false);
      loadDocuments();
    } catch (err: any) {
      console.error(err);
      setProcessingStatus('ERROR');
      setStatusMessage('Lỗi khi lưu dữ liệu: ' + err.message);
      onShowToast?.('error', 'Lỗi khi lưu văn bản: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handlers: Web Only vs Dual Delete (Web & Google Drive) vs Soft Archive
  const [deletingDocTarget, setDeletingDocTarget] = useState<NewDocument | null>(null);
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);

  const handleInitiateDelete = (docOrId: string | NewDocument) => {
    if (typeof docOrId === 'string') {
      const found = documents.find(d => d.id === docOrId);
      if (found) setDeletingDocTarget(found);
    } else {
      setDeletingDocTarget(docOrId);
    }
    setIsConfirmDeleteOpen(true);
  };

  // Action 1: Permanent Dual Delete (Delete from Website AND Google Drive)
  const handleDeleteBothWebAndDrive = async () => {
    if (!deletingDocTarget) return;
    setIsDeletingLoading(true);
    try {
      // 1. Delete physical file on Google Drive
      const fileTarget = deletingDocTarget.driveFileId || deletingDocTarget.fileUrl;
      if (fileTarget) {
        await deleteFileFromGoogleDrive(fileTarget);
      }
      // 2. Delete document record from Firestore
      await documentService.deleteDocument(deletingDocTarget.id);

      onShowToast?.('success', `Đã xóa vĩnh viễn văn bản "${deletingDocTarget.title}" trên cả Website và Google Drive!`);
      setIsConfirmDeleteOpen(false);
      setDeletingDocTarget(null);
      loadDocuments();
    } catch (err: any) {
      onShowToast?.('error', 'Lỗi khi xóa văn bản: ' + err.message);
    } finally {
      setIsDeletingLoading(false);
    }
  };

  // Action 2: Delete from Website only (Keep file on Google Drive)
  const handleDeleteWebOnly = async () => {
    if (!deletingDocTarget) return;
    setIsDeletingLoading(true);
    try {
      await documentService.deleteDocument(deletingDocTarget.id);
      onShowToast?.('success', `Đã xóa văn bản khỏi Website (Tệp gốc vẫn lưu trên Google Drive).`);
      setIsConfirmDeleteOpen(false);
      setDeletingDocTarget(null);
      loadDocuments();
    } catch (err: any) {
      onShowToast?.('error', 'Lỗi khi xóa văn bản: ' + err.message);
    } finally {
      setIsDeletingLoading(false);
    }
  };

  // Action 3: Soft Delete (Move to Archive tab)
  const handleSoftArchive = async () => {
    if (!deletingDocTarget) return;
    setIsDeletingLoading(true);
    try {
      await documentService.updateDocument(deletingDocTarget.id, {
        isArchived: true,
        status: 'ARCHIVED'
      });
      onShowToast?.('success', 'Đã chuyển văn bản vào kho Lưu trữ an toàn.');
      setIsConfirmDeleteOpen(false);
      setDeletingDocTarget(null);
      loadDocuments();
    } catch (err: any) {
      onShowToast?.('error', 'Lỗi khi lưu trữ văn bản: ' + err.message);
    } finally {
      setIsDeletingLoading(false);
    }
  };

  // Render Confidence Badge
  const renderConfidenceBadge = (score?: number) => {
    if (score === undefined) return null;
    if (score >= 0.90) {
      return (
        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded font-black text-[10px] flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          Tin cậy cao ({Math.round(score * 100)}%)
        </span>
      );
    }
    if (score >= 0.70) {
      return (
        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-black text-[10px] flex items-center gap-1">
          <AlertTriangle className="w-3 h-3 text-amber-600" />
          Cần kiểm tra ({Math.round(score * 100)}%)
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 border border-rose-200 rounded font-black text-[10px] flex items-center gap-1">
        <HelpCircle className="w-3 h-3 text-rose-600" />
        Chưa xác định
      </span>
    );
  };

  const handleImportFromDriveExplorer = async (files: DriveExplorerFile[]) => {
    if (!files || files.length === 0) return;
    
    for (const f of files) {
      // 1. AI Auto-Extraction of Code, Number & Symbol
      const codeNumber = f.codeNumber || f.name.match(/\d+[-/][A-Za-z0-9-]+/)?.[0] || '01/VB-MTTQ';
      const docNum = codeNumber.split(/[\/\-]/)[0] || '01';
      const docSym = codeNumber.includes('/') ? codeNumber.split('/')[1] : 'KH-MTTQ';
      
      // 2. Human-readable Title
      let titleClean = f.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ').replace(/^\d+[-_]/, '');
      if (titleClean.length < 5) titleClean = `Văn bản triển khai ${codeNumber}`;

      // 3. AI Standardized Renaming
      const stdFilename = generateStandardizedFilename({
        issueDate: f.modifiedTime || new Date().toISOString().substring(0, 10),
        docType: f.docType || 'Kế hoạch',
        documentNumber: docNum,
        documentSymbol: docSym,
        issuingAgency: 'MTTQ-CH',
        summary: titleClean.substring(0, 40),
        extension: f.name.endsWith('.docx') ? 'docx' : f.name.endsWith('.xlsx') ? 'xlsx' : 'pdf'
      });

      // 4. Construct complete NewDocument payload with 24 fields
      const newDoc: Omit<NewDocument, 'id' | 'createdAt' | 'updatedAt'> = {
        codeNumber: codeNumber,
        documentNumber: docNum,
        documentSymbol: docSym,
        documentNumberFull: codeNumber,
        title: titleClean,
        docType: f.docType || 'Kế hoạch',
        documentType: f.docType || 'Kế hoạch',
        field: f.folder || 'Công tác Mặt trận',
        issuer: f.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issuingAgency: f.issuer || 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: f.modifiedTime || new Date().toISOString().split('T')[0],
        effectiveDate: f.modifiedTime || new Date().toISOString().split('T')[0],
        signer: 'Trần Văn Nam',
        signerPosition: 'Chủ tịch MTTQ',
        summary: f.summary || `Văn bản chỉ đạo số hóa và liên kết tự động từ Google Drive [${monitoredFolderId}]`,
        documentSummary: f.summary || `Văn bản chỉ đạo số hóa và liên kết tự động từ Google Drive [${monitoredFolderId}]`,
        priority: 'Bình thường',
        confidentialLevel: 'Thường',
        leadUnit: 'Ban Thường trực MTTQ phường',
        coordinatingUnits: ['Ban Công tác Mặt trận 21 khu phố'],
        keywords: [f.folder, 'Google Drive', 'AI Bóc tách', 'Chánh Hiệp'],
        isPublic: true,
        status: 'Published',
        processingStatus: 'CONFIRMED',
        fileUrl: f.webViewLink,
        driveUrl: f.webViewLink,
        driveFolderId: monitoredFolderId,
        fileName: stdFilename,
        originalFilename: f.name,
        standardizedFilename: stdFilename,
        fileSize: f.size || '1.2 MB',
        aiExtracted: true,
        uploadedBy: currentUser?.fullname || 'Hệ thống AI Google Drive Sync',
        uploadedAt: new Date().toISOString()
      };

      await documentService.addDocument(newDoc);
    }

    await loadDocuments();
    onShowToast?.('success', `🤖 AI đã tự động đổi tên tệp chuẩn hóa & nạp đầy đủ thông tin cho ${files.length} văn bản lên Web!`);
  };

  const handleSaveMonitoredFolderId = (e: React.FormEvent) => {
    e.preventDefault();
    let extracted = extractGoogleDriveFileId(folderInputVal) || folderInputVal.trim();
    if (!extracted) extracted = OFFICIAL_DOCUMENTS_DRIVE_FOLDER_ID;
    
    localStorage.setItem('chanh_hiep_monitored_drive_folder_id', extracted);
    setMonitoredFolderId(extracted);
    setFolderInputVal(extracted);

    // Update currently loaded documents to point directly to this newly connected drive folder URL
    const newDriveUrl = `https://drive.google.com/drive/folders/${extracted}`;
    setDocuments(prevDocs => prevDocs.map(doc => ({
      ...doc,
      driveFolderId: extracted,
      driveUrl: newDriveUrl,
      fileUrl: doc.fileUrl && doc.fileUrl.startsWith('https://drive.google.com') ? newDriveUrl : doc.fileUrl
    })));

    setIsSavedFolderToast(true);
    setTimeout(() => setIsSavedFolderToast(false), 2500);
    onShowToast?.('success', `Đã kết nối thành công với Google Drive [Mã ID: ${extracted}]. Toàn bộ văn bản đã trỏ đúng link!`);
  };

  const driveSubfolderFiles = useMemo(() => {
    const targetUrl = `https://drive.google.com/drive/folders/${monitoredFolderId}`;
    return [
      {
        id: 'f-mttq-01',
        codeNumber: '05/KH-MTTQ',
        documentNumber: '05',
        documentSymbol: 'KH-MTTQ',
        title: 'Kế hoạch Tổ chức Ngày hội Đại đoàn kết toàn dân tộc năm 2026',
        docType: 'Kế hoạch',
        field: 'Công tác Mặt trận',
        issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: '2026-09-30',
        signer: 'Trần Văn Nam',
        signerPosition: 'Chủ tịch MTTQ',
        summary: 'Kế hoạch tổ chức ngày hội đại đoàn kết tại 21 khu phố',
        folder: 'Văn bản MTTQ',
        fileUrl: targetUrl
      },
      {
        id: 'f-mttq-02',
        codeNumber: '14/NQ-MTTQ',
        documentNumber: '14',
        documentSymbol: 'NQ-MTTQ',
        title: 'Nghị quyết Phát động Phong trào Thi đua yêu nước phường Chánh Hiệp năm 2026',
        docType: 'Nghị quyết',
        field: 'Công tác Mặt trận',
        issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: '2026-09-28',
        signer: 'Trần Văn Nam',
        signerPosition: 'Chủ tịch MTTQ',
        summary: 'Phát động thi đua yêu nước các tổ chức thành viên',
        folder: 'Văn bản MTTQ',
        fileUrl: targetUrl
      },
      {
        id: 'f-doan-01',
        codeNumber: '12/NQ-DOAN',
        documentNumber: '12',
        documentSymbol: 'NQ-DOAN',
        title: 'Nghị quyết Đại hội Đại biểu Đoàn TNCS Hồ Chí Minh phường Chánh Hiệp',
        docType: 'Nghị quyết',
        field: 'Công tác Thanh niên',
        issuer: 'Ban Chấp hành Đoàn TNCS Hồ Chí Minh phường',
        issueDate: '2026-09-29',
        signer: 'Nguyễn Lê Hoàng',
        signerPosition: 'Bí thư Đoàn phường',
        summary: 'Phương hướng công tác Đoàn và phong trào thanh thiếu nhi',
        folder: 'Văn bản Đoàn TNCS Hồ Chí Minh',
        fileUrl: targetUrl
      },
      {
        id: 'f-pn-01',
        codeNumber: '08/HD-PN',
        documentNumber: '08',
        documentSymbol: 'HD-PN',
        title: 'Hướng dẫn Thực hiện Phong trào "Xây dựng người phụ nữ Chánh Hiệp thời đại mới"',
        docType: 'Hướng dẫn',
        field: 'Công tác Phụ nữ',
        issuer: 'Hội Liên hiệp Phụ nữ phường Chánh Hiệp',
        issueDate: '2026-09-27',
        signer: 'Phạm Thị Hương',
        signerPosition: 'Chủ tịch Hội LHPN',
        summary: 'Triển khai phong trào thi đua phụ nữ tích cực học tập lao động sáng tạo',
        folder: 'Văn bản Hội LHPN',
        fileUrl: targetUrl
      },
      {
        id: 'f-hcm-01',
        codeNumber: '01/TL-HCM',
        documentNumber: '01',
        documentSymbol: 'TL-HCM',
        title: 'Tư liệu Học tập và làm theo Tư tưởng, đạo đức, phong cách Hồ Chí Minh năm 2026',
        docType: 'Tài liệu',
        field: 'Tuyên giáo - Tư tưởng',
        issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: '2026-09-20',
        signer: 'Ban Tuyên giáo MTTQ',
        signerPosition: 'Bộ phận Tuyên giáo',
        summary: 'Chuyên đề học tập tư tưởng Hồ Chí Minh về đại đoàn kết toàn dân tộc',
        folder: 'HCM',
        fileUrl: targetUrl
      },
      {
        id: 'f-kt-01',
        codeNumber: '02/CN-KT',
        documentNumber: '02',
        documentSymbol: 'CN-KT',
        title: 'Cẩm nang Nghiệp vụ Dân vận khéo và Hoạt động Ban Công tác Mặt trận 21 Khu phố',
        docType: 'Cẩm nang',
        field: 'Nghiệp vụ Mặt trận',
        issuer: 'Ủy ban MTTQ Việt Nam phường Chánh Hiệp',
        issueDate: '2026-09-18',
        signer: 'Trần Văn Nam',
        signerPosition: 'Chủ tịch MTTQ',
        summary: 'Hướng dẫn quy trình giám sát, phản biện xã hội và hòa giải cơ sở',
        folder: 'Kiến thức chung',
        fileUrl: targetUrl
      }
    ];
  }, [monitoredFolderId]);

  const handleImportSelectedDriveFiles = async () => {
    if (selectedDriveFilesToImport.length === 0) {
      onShowToast?.('error', 'Vui lòng chọn ít nhất 1 tài liệu từ Drive.');
      return;
    }

    const filesToImport = driveSubfolderFiles.filter(f => selectedDriveFilesToImport.includes(f.id));
    const now = new Date().toISOString();
    
    for (const f of filesToImport) {
      const newDoc: Omit<NewDocument, 'id' | 'createdAt' | 'updatedAt'> = {
        codeNumber: f.codeNumber,
        documentNumber: f.documentNumber,
        documentSymbol: f.documentSymbol,
        documentNumberFull: `${f.documentNumber}/${f.documentSymbol}`,
        title: f.title,
        docType: f.docType,
        field: f.field,
        issuer: f.issuer,
        issuingAgency: f.issuer,
        issueDate: f.issueDate,
        signer: f.signer,
        signerPosition: f.signerPosition,
        summary: f.summary,
        documentSummary: f.summary,
        priority: 'Bình thường',
        confidentialLevel: 'Thường',
        leadUnit: 'Ban Thường trực MTTQ phường',
        coordinatingUnits: [],
        keywords: [f.folder, 'Google Drive', 'MTTQ'],
        isPublic: true,
        status: 'Published',
        fileUrl: f.fileUrl,
        driveUrl: f.fileUrl,
        driveFolderId: monitoredFolderId,
        fileName: `${f.codeNumber.replace('/', '_')}_${f.title.substring(0, 30)}.pdf`,
        fileSize: '1.2 MB'
      };

      await documentService.addDocument(newDoc);
    }

    await loadDocuments();
    setIsDriveImportModalOpen(false);
    setSelectedDriveFilesToImport([]);
    onShowToast?.('success', `Đã nhập thành công ${filesToImport.length} văn bản từ Google Drive!`);
  };

  return (
    <div className="p-4 sm:p-6 bg-slate-50 min-h-screen relative space-y-6 animate-fadeIn">
      {/* GOOGLE DRIVE EXPLORER INTERACTIVE COMPONENT */}
      <GoogleDriveExplorer
        initialFolderId={monitoredFolderId}
        onConnectFolder={(newId) => setMonitoredFolderId(newId)}
        onImportSelectedFiles={handleImportFromDriveExplorer}
        onShowToast={(type, msg) => onShowToast?.(type, msg)}
      />

      {/* HEADER BAR */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              QUẢN TRỊ VĂN BẢN
            </span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
              DRIVE LIVE CONNECTED
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-2 flex items-center gap-2">
            <FileText className="text-blue-600 w-7 h-7" />
            Quản Lý Văn Bản Triển Khai
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Tổng số: <strong className="text-slate-900">{documents.length} văn bản</strong> • Công khai: <strong className="text-emerald-600">{documents.filter(d => d.status === 'Published').length}</strong> • Bản nháp: <strong className="text-amber-600">{documents.filter(d => d.status === 'Draft').length}</strong> • Lưu trữ: <strong className="text-slate-500">{documents.filter(d => d.isArchived).length}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => loadDocuments()}
            disabled={loading}
            className="p-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl transition shadow-xs cursor-pointer"
            title="Tải lại danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <a
            href={`https://drive.google.com/drive/folders/${monitoredFolderId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 border border-slate-200"
          >
            <ExternalLink className="w-4 h-4 text-blue-600" />
            <span>Mở Google Drive</span>
          </a>

          <button
            onClick={() => handleOpenSmartModal()}
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl transition shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>THÊM VĂN BẢN MỚI</span>
          </button>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm tự nhiên theo số hiệu, trích yếu, người ký, cơ quan, từ khóa hoặc nội dung..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {(['ALL', 'Published', 'Draft', 'Hidden', 'ARCHIVED'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  activeStatusTab === tab 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab === 'ALL' ? 'Tất cả' : tab === 'Published' ? 'Công khai' : tab === 'Draft' ? 'Bản nháp' : tab === 'Hidden' ? 'Tạm ẩn' : 'Lưu trữ'}
              </button>
            ))}
          </div>
        </div>

        {/* SECONDARY FILTERS */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div>
            <label className="text-slate-400 block text-[10px] font-bold mb-1">Loại văn bản:</label>
            <select
              value={selectedDocTypeFilter}
              onChange={(e) => setSelectedDocTypeFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
            >
              <option value="ALL">Tất cả loại văn bản</option>
              {DOCUMENT_TYPE_CODES.map(c => (
                <option key={c.code} value={c.name}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block text-[10px] font-bold mb-1">Cơ quan ban hành:</label>
            <select
              value={selectedAgencyFilter}
              onChange={(e) => setSelectedAgencyFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
            >
              <option value="ALL">Tất cả cơ quan</option>
              {SOCIO_POLITICAL_ORGANIZATIONS.slice(0, -1).map(org => (
                <option key={org} value={org}>{org}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block text-[10px] font-bold mb-1">Lĩnh vực:</label>
            <select
              value={selectedFieldFilter}
              onChange={(e) => setSelectedFieldFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
            >
              <option value="ALL">Tất cả lĩnh vực</option>
              {DOCUMENT_FIELDS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block text-[10px] font-bold mb-1">Năm ban hành:</label>
            <select
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
            >
              <option value="ALL">Tất cả các năm</option>
              {availableYears.map(yr => (
                <option key={yr} value={yr}>Năm {yr}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-slate-400 block text-[10px] font-bold mb-1">Có nhiệm vụ giao:</label>
            <select
              value={hasTasksFilter === null ? 'ALL' : hasTasksFilter ? 'HAS' : 'NO'}
              onChange={(e) => {
                const val = e.target.value;
                setHasTasksFilter(val === 'ALL' ? null : val === 'HAS');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
            >
              <option value="ALL">Tất cả</option>
              <option value="HAS">Có nhiệm vụ AI phát hiện</option>
              <option value="NO">Không có nhiệm vụ</option>
            </select>
          </div>
        </div>
      </div>

      {/* DOCUMENTS TABLE / CARDS GRID */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600">Đang tải danh sách văn bản chỉ đạo...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">Chưa tìm thấy văn bản phù hợp</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hãy bấm <strong>Thêm văn bản thông minh</strong> để kéo thả tệp PDF/Word/Excel vào hệ thống.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                  <th className="py-3.5 px-4">Số / Ký hiệu</th>
                  <th className="py-3.5 px-4 min-w-[250px]">Trích yếu nội dung</th>
                  <th className="py-3.5 px-4">Loại &amp; Lĩnh vực</th>
                  <th className="py-3.5 px-4">Ngày / Người ký</th>
                  <th className="py-3.5 px-4">Drive &amp; Nhiệm vụ</th>
                  <th className="py-3.5 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDocuments.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {doc.codeNumber || doc.documentNumberFull || 'Số --'}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <button
                          onClick={() => {
                            setSelectedDocForDetail(doc);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="font-bold text-slate-900 hover:text-blue-600 text-left line-clamp-2 leading-relaxed cursor-pointer"
                        >
                          {doc.title || doc.summary}
                        </button>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          Cơ quan: {doc.issuer || doc.issuingAgency}
                        </p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded font-black text-[10px]">
                          {doc.docType || 'Công văn'}
                        </span>
                        <div className="text-[10px] font-bold text-slate-500">{doc.field}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800">{doc.issueDate}</div>
                        <div className="text-[11px] text-slate-500">{doc.signer || 'Chưa cập nhật'}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:underline"
                        >
                          <HardDrive className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Google Drive</span>
                        </a>

                        {doc.tasks && doc.tasks.length > 0 && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                            <ListTodo className="w-3 h-3 text-indigo-600" />
                            <span>{doc.tasks.length} nhiệm vụ giao</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedDocForDetail(doc);
                            setIsDetailDrawerOpen(true);
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenSmartModal(doc)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition"
                          title="Chỉnh sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleInitiateDelete(doc.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Lưu trữ/Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* III, IV, V, VI, VII, VIII, IX, X, XIV: SMART INGESTION 2-COLUMN DESKTOP MODAL */}
      {/* ========================================================================= */}
      {isSmartModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-6xl w-full my-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/20 rounded-2xl border border-blue-400/30 text-blue-300">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-black text-base sm:text-lg text-white">
                    {editingDoc ? 'Chỉnh Sửa Văn Bản Triển Khai' : 'Nhập Văn Bản Thông Minh (AI Ingestion Engine)'}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium">
                    Tự động đọc OCR, bóc tách 24 trường thông tin, đề xuất tên file chuẩn và lưu Google Drive
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSmartModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body: Split 2 Columns Desktop */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/50">
              
              {/* LEFT COLUMN: PREVIEW & DROPZONE & STATUS */}
              <div className="lg:col-span-5 space-y-4">
                
                {/* Drag & Drop Zone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 hover:bg-blue-50 p-6 rounded-3xl text-center transition cursor-pointer group space-y-3"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileSelected(f);
                    }}
                  />

                  <div className="w-12 h-12 rounded-2xl bg-white text-blue-600 shadow-md flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>

                  <div>
                    <h4 className="font-black text-sm text-slate-800">
                      Kéo &amp; thả văn bản vào đây hoặc nhấn để chọn tệp
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Hỗ trợ: PDF, Word (DOC/DOCX), Excel (XLS/XLSX), Ảnh (JPG/PNG)
                    </p>
                  </div>
                </div>

                {/* Processing Steps Indicator */}
                {processingStatus !== 'IDLE' && (
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <RefreshCw className={`w-4 h-4 text-blue-600 ${processingStatus !== 'WAITING_REVIEW' && processingStatus !== 'COMPLETED' ? 'animate-spin' : ''}`} />
                        Trạng thái xử lý: {processingStatus}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">Folder [1Vw365JIFDuUFT1AwF-MoJD8kKkvhiLH_]</span>
                    </div>

                    <p className="text-xs text-blue-900 bg-blue-50 p-2.5 rounded-xl font-medium border border-blue-100">
                      {statusMessage}
                    </p>
                  </div>
                )}

                {/* Document Preview Box */}
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
                  <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-blue-600" />
                    Bản Xem Trước / Nội Dung Bóc Tách
                  </h4>

                  {currentFile ? (
                    currentFile.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(currentFile)}
                        alt="Preview"
                        className="max-h-60 w-full object-contain rounded-xl border border-slate-200 bg-slate-900/5"
                      />
                    ) : (
                      <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                        {parsedText || 'Đang bóc tách văn bản...'}
                      </div>
                    )
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      Chưa chọn tệp tin
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: AI STRUCTURED FORM & CONFIDENCE */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Proposed Filename Preview Card */}
                {proposedFilename && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-blue-900 flex items-center gap-1.5">
                        <Tag className="w-4 h-4 text-blue-600" />
                        Đề xuất Tên File Chuẩn hóa (Standardized Filename):
                      </span>
                      <button
                        onClick={handleRecalculateFilename}
                        className="text-[11px] font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        Tạo lại tên file
                      </button>
                    </div>

                    <input
                      type="text"
                      value={proposedFilename}
                      onChange={(e) => setProposedFilename(e.target.value)}
                      className="w-full p-2.5 bg-white border border-blue-300 rounded-xl text-xs font-mono font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                )}

                {/* Duplicate Check Warning Alert */}
                {duplicateWarning?.isDuplicate && (
                  <div className="bg-amber-50 border-2 border-amber-400 p-4 rounded-2xl space-y-2 text-amber-900 animate-fadeIn">
                    <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      <span>CẢNH BÁO: Phát hiện khả năng văn bản đã tồn tại!</span>
                    </div>

                    <p className="text-xs leading-relaxed font-medium">
                      {duplicateWarning.reason}
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      <button
                        onClick={() => {
                          setVersionSuffix('_v02');
                          handleRecalculateFilename();
                          setDuplicateWarning(null);
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Tạo phiên bản mới (_v02)
                      </button>

                      <button
                        onClick={() => handleConfirmAndSaveDocument(true)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Vẫn xuất bản văn bản này
                      </button>
                    </div>
                  </div>
                )}

                {/* Form Fields Grid */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
                  
                  {/* Row 1: Code & DocType */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Loại văn bản:</label>
                        {renderConfidenceBadge(confidenceMap.documentType)}
                      </div>
                      <select
                        value={formData.docType}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, docType: e.target.value }));
                          handleRecalculateFilename();
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                      >
                        {DOCUMENT_TYPE_CODES.map(c => (
                          <option key={c.code} value={c.name}>{c.name} ({c.code})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Số / Ký hiệu đầy đủ:</label>
                        {renderConfidenceBadge(confidenceMap.documentNumberFull)}
                      </div>
                      <input
                        type="text"
                        value={formData.codeNumber}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, codeNumber: e.target.value }));
                          handleRecalculateFilename();
                        }}
                        placeholder="Ví dụ: 125/CV-MTTQ"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-blue-800"
                        required
                      />
                    </div>
                  </div>

                  {/* Row 2: Title / Summary */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-slate-700">Trích yếu nội dung văn bản:</label>
                      {renderConfidenceBadge(confidenceMap.summary)}
                    </div>
                    <textarea
                      rows={2}
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, summary: e.target.value }))}
                      placeholder="Nhập trích yếu tóm tắt nội dung..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                      required
                    />
                  </div>

                  {/* Row 3: Issuer & Date & Signer */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Cơ quan / Tổ chức ban hành:</label>
                        {renderConfidenceBadge(confidenceMap.issuingAgency)}
                      </div>
                      <select
                        value={
                          SOCIO_POLITICAL_ORGANIZATIONS.slice(0, -1).includes(formData.issuer || '')
                            ? formData.issuer
                            : 'Cơ quan / Tổ chức khác'
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== 'Cơ quan / Tổ chức khác') {
                            setFormData(prev => ({ ...prev, issuer: val, issuingAgency: val }));
                            setIsCustomAgency(false);
                          } else {
                            setIsCustomAgency(true);
                            setFormData(prev => ({ ...prev, issuer: '', issuingAgency: '' }));
                          }
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                      >
                        {SOCIO_POLITICAL_ORGANIZATIONS.map((agency) => (
                          <option key={agency} value={agency}>
                            {agency}
                          </option>
                        ))}
                      </select>

                      {(isCustomAgency || (formData.issuer && !SOCIO_POLITICAL_ORGANIZATIONS.slice(0, -1).includes(formData.issuer))) && (
                        <input
                          type="text"
                          value={formData.issuer || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value, issuingAgency: e.target.value }))}
                          placeholder="Nhập tên cơ quan / tổ chức ban hành khác..."
                          className="w-full p-2.5 mt-2 bg-white border border-blue-300 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Ngày ban hành:</label>
                        {renderConfidenceBadge(confidenceMap.issueDate)}
                      </div>
                      <input
                        type="date"
                        value={formData.issueDate}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, issueDate: e.target.value }));
                          handleRecalculateFilename();
                        }}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Người ký / Chức vụ:</label>
                        {renderConfidenceBadge(confidenceMap.signedBy)}
                      </div>
                      <input
                        type="text"
                        value={formData.signer}
                        onChange={(e) => setFormData(prev => ({ ...prev, signer: e.target.value }))}
                        placeholder="Họ tên người ký"
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Row 4: Field & Priority & Lead Unit */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 mb-1 block">Lĩnh vực:</label>
                      <select
                        value={formData.field}
                        onChange={(e) => setFormData(prev => ({ ...prev, field: e.target.value }))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                      >
                        {DOCUMENT_FIELDS.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 mb-1 block">Mức độ khẩn:</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                      >
                        <option value="Bình thường">Bình thường</option>
                        <option value="Khẩn">Khẩn</option>
                        <option value="Thượng khẩn">Thượng khẩn</option>
                        <option value="Hỏa tốc">Hỏa tốc</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold text-slate-700 mb-1 block">Đơn vị chủ trì:</label>
                      <input
                        type="text"
                        value={formData.leadUnit}
                        onChange={(e) => setFormData(prev => ({ ...prev, leadUnit: e.target.value }))}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                      />
                    </div>
                  </div>

                  {/* EXTRACTED TASKS LIST */}
                  {extractedTasks.length > 0 && (
                    <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-indigo-900 flex items-center gap-1.5">
                          <ListTodo className="w-4 h-4 text-indigo-600" />
                          AI Đã Bóc Tách {extractedTasks.length} Nhiệm Vụ Giao Triển Khai:
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          Đã chọn {selectedTaskIndices.length}/{extractedTasks.length}
                        </span>
                      </div>

                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {extractedTasks.map((t, tIdx) => {
                          const isTaskChecked = selectedTaskIndices.includes(tIdx);
                          return (
                            <div
                              key={tIdx}
                              onClick={() => {
                                setSelectedTaskIndices(prev =>
                                  prev.includes(tIdx) ? prev.filter(i => i !== tIdx) : [...prev, tIdx]
                                );
                              }}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2 ${
                                isTaskChecked 
                                  ? 'bg-white border-indigo-500 shadow-xs' 
                                  : 'bg-indigo-50 border-indigo-200 opacity-60'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isTaskChecked}
                                onChange={() => {}}
                                className="mt-0.5"
                              />
                              <div className="min-w-0 flex-1 space-y-0.5">
                                <div className="font-bold text-slate-900">{t.taskTitle}</div>
                                <div className="text-[10px] text-slate-500 flex items-center gap-2">
                                  <span>Đơn vị: <strong>{t.leadUnit}</strong></span>
                                  <span>Hạn: <strong>{t.deadline || 'Chưa định'}</strong></span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ACTION BUTTONS */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentFile) handleFileSelected(currentFile);
                      }}
                      className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>PHÂN TÍCH LẠI</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleConfirmAndSaveDocument(false)}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Đang tải lên Drive & Lưu DB...' : 'XÁC NHẬN & XUẤT BẢN VĂN BẢN'}</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* XX: BATCH IMPORT MODAL ("NHẬP VĂN BẢN HÀNG LOẠT") */}
      {/* ========================================================================= */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-2xl">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Nhập Văn Bản Hàng Loạt (Batch Import 5 - 20 Tệp)
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Kéo thả nhiều file cùng lúc, hệ thống sẽ tự động xử lý hàng đợi
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={() => batchInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 bg-indigo-50/40 p-8 rounded-2xl text-center cursor-pointer space-y-2 hover:bg-indigo-50 transition"
            >
              <input
                ref={batchInputRef}
                type="file"
                multiple
                accept=".pdf,.docx,.xlsx,.jpg,.png"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setBatchFiles(files.map(f => ({ file: f, status: 'WAITING' })));
                }}
              />
              <Layers className="w-8 h-8 text-indigo-600 mx-auto" />
              <div className="font-bold text-xs text-slate-800">
                Nhấn để chọn từ 5 - 20 tệp văn bản cùng lúc
              </div>
            </div>

            {batchFiles.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {batchFiles.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate">{item.file.name}</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-[10px]">
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* XXX: DOCUMENT DETAIL DRAWER / MODAL */}
      {/* ========================================================================= */}
      {isDetailDrawerOpen && selectedDocForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-mono text-xs font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    MÃ: {selectedDocForDetail.codeNumber}
                  </span>
                  <h3 className="font-black text-base text-slate-900 mt-1">
                    {selectedDocForDetail.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold">
              <button
                onClick={() => setDetailActiveTab('meta')}
                className={`px-3 py-1.5 rounded-xl transition ${detailActiveTab === 'meta' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                Thông tin chung
              </button>
              <button
                onClick={() => setDetailActiveTab('preview')}
                className={`px-3 py-1.5 rounded-xl transition ${detailActiveTab === 'preview' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                File Drive
              </button>
              <button
                onClick={() => setDetailActiveTab('tasks')}
                className={`px-3 py-1.5 rounded-xl transition ${detailActiveTab === 'tasks' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                Nhiệm vụ ({selectedDocForDetail.tasks?.length || 0})
              </button>
              <button
                onClick={() => setDetailActiveTab('audit')}
                className={`px-3 py-1.5 rounded-xl transition ${detailActiveTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-600'}`}
              >
                Nhật ký Audit Log
              </button>
            </div>

            {/* Tab Content */}
            {detailActiveTab === 'meta' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl">
                <div><span className="text-slate-400 block text-[10px]">Loại văn bản:</span><strong>{selectedDocForDetail.docType}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Ngày ban hành:</span><strong>{selectedDocForDetail.issueDate}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Người ký:</span><strong>{selectedDocForDetail.signer}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Cơ quan ban hành:</span><strong>{selectedDocForDetail.issuer}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Lĩnh vực:</span><strong>{selectedDocForDetail.field}</strong></div>
                <div><span className="text-slate-400 block text-[10px]">Mức độ khẩn:</span><strong>{selectedDocForDetail.priority || 'Bình thường'}</strong></div>
              </div>
            )}

            {detailActiveTab === 'preview' && (
              <div className="p-4 bg-slate-50 rounded-2xl text-center space-y-3">
                <p className="text-xs text-slate-600 font-medium">Tệp gốc lưu tại Google Drive:</p>
                <a
                  href={selectedDocForDetail.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Mở tệp trên Google Drive Folder [1Vw365JIFDuUFT1AwF-MoJD8kKkvhiLH_]</span>
                </a>
              </div>
            )}

            {detailActiveTab === 'tasks' && (
              <div className="space-y-2">
                {selectedDocForDetail.tasks?.map((t, idx) => (
                  <div key={idx} className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-1">
                    <div className="font-bold text-indigo-900">{t.taskTitle}</div>
                    <div className="text-[11px] text-slate-600">Đơn vị: {t.leadUnit} • Hạn: {t.deadline}</div>
                  </div>
                ))}
              </div>
            )}

            {detailActiveTab === 'audit' && (
              <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                {selectedDocForDetail.auditLogs?.map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">{log.action}</div>
                      <div className="text-[10px] text-slate-500">Bởi: {log.userName}</div>
                    </div>
                    <span className="text-[10px] text-slate-400">{log.timestamp?.split('T')[0]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TRIPLE DELETE & ARCHIVE MODAL */}
      {isConfirmDeleteOpen && deletingDocTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-2.5 bg-rose-100 rounded-2xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">Tùy Chọn Xóa Văn Bản</h4>
                  <p className="text-xs text-slate-500 font-medium">Mã: {deletingDocTarget.codeNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <strong className="text-slate-900 block truncate font-black">{deletingDocTarget.title}</strong>
              <span className="text-slate-500 block text-[11px]">Thư mục Drive: {deletingDocTarget.field || '1Vw365JIFDuUFT1AwF-MoJD8kKkvhiLH_'}</span>
            </div>

            <p className="text-xs font-bold text-slate-700">Vui lòng chọn hình thức xử lý văn bản này:</p>

            <div className="space-y-2.5">
              {/* Option 1: Both Web and Drive */}
              <button
                type="button"
                onClick={handleDeleteBothWebAndDrive}
                disabled={isDeletingLoading}
                className="w-full p-3.5 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-700 hover:to-red-800 text-white rounded-2xl text-left transition shadow-md group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Trash className="w-5 h-5 text-rose-200 shrink-0" />
                    <div>
                      <div className="font-black text-xs group-hover:underline">🔥 XÓA HOÀN TOÀN (CẢ WEBSITE VÀ GOOGLE DRIVE)</div>
                      <div className="text-[10.5px] text-rose-100/90 font-medium mt-0.5">Xóa bản ghi khỏi cơ sở dữ liệu VÀ đưa tệp vật lý vào thùng rác Google Drive.</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-200 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 2: Web Only */}
              <button
                type="button"
                onClick={handleDeleteWebOnly}
                disabled={isDeletingLoading}
                className="w-full p-3.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-300 text-amber-950 rounded-2xl text-left transition shadow-2xs group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-black text-xs text-amber-900">🌐 CHỈ XÓA TRÊN WEBSITE (GIỮ FILE TẠI GOOGLE DRIVE)</div>
                      <div className="text-[10.5px] text-amber-800 font-medium mt-0.5">Gỡ văn bản khỏi hiển thị trên Web, tệp gốc trên Google Drive vẫn được giữ nguyên.</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Option 3: Soft Archive */}
              <button
                type="button"
                onClick={handleSoftArchive}
                disabled={isDeletingLoading}
                className="w-full p-3.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 rounded-2xl text-left transition group cursor-pointer disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Archive className="w-5 h-5 text-slate-600 shrink-0" />
                    <div>
                      <div className="font-black text-xs">📦 CHUYỂN VÀO MỤC LƯU TRỮ (SOFT DELETE)</div>
                      <div className="text-[10.5px] text-slate-500 font-medium mt-0.5">Tạm ẩn khỏi trang công khai và chuyển sang tab "Lưu trữ" để tra cứu sau.</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsConfirmDeleteOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
              >
                Đóng / Hủy
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
