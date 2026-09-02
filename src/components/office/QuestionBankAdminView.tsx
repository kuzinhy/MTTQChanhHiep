import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  HelpCircle,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { QuestionBankCollection, BankQuestion } from '../../types';
import { INITIAL_QUESTION_BANKS } from '../../data/seedData';

export const QuestionBankAdminView: React.FC<{
  questionBanks?: QuestionBankCollection[];
  onTriggerToast?: (title: string, message: string) => void;
}> = ({
  questionBanks = INITIAL_QUESTION_BANKS,
  onTriggerToast
}) => {
  const [banks, setBanks] = useState<QuestionBankCollection[]>(questionBanks);
  const [selectedBank, setSelectedBank] = useState<QuestionBankCollection>(questionBanks[0] || INITIAL_QUESTION_BANKS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Sample questions in selected bank
  const [questions, setQuestions] = useState<BankQuestion[]>([
    {
      id: 'bq-1',
      question: 'Mặt trận Dân tộc Thống nhất Việt Nam được thành lập vào ngày, tháng, năm nào?',
      options: ['18/11/1930', '19/08/1945', '02/09/1945', '03/02/1930'],
      correctAnswerIndex: 0,
      explanation: 'Ngày 18/11/1930, Ban Thường vụ Trung ương Đảng Cộng sản Đông Dương ra Chỉ thị thành lập Hội Phản đế Đồng minh - hình thức tổ chức đầu tiên của Mặt trận Dân tộc Thống nhất Việt Nam.',
      topic: 'Truyền thống MTTQ',
      difficulty: 'EASY',
      category: 'Lịch sử MTTQ',
      status: 'ACTIVE',
      createdAt: '2026-08-01'
    },
    {
      id: 'bq-2',
      question: 'Chủ tịch Hồ Chí Minh đã căn dặn câu nói nổi tiếng nào về Đại đoàn kết?',
      options: [
        'Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công.',
        'Không có gì quý hơn độc lập, tự do.',
        'Vì lợi ích mười năm thì phải trồng cây, vì lợi ích trăm năm thì phải trồng người.',
        'Dễ trăm lần không dân cũng chịu, khó vạn lần dân liệu cũng xong.'
      ],
      correctAnswerIndex: 0,
      explanation: 'Câu nói được Bác Hồ phát biểu tại Đại hội Mặt trận Tổ quốc Việt Nam năm 1961.',
      topic: 'Tư tưởng Hồ Chí Minh',
      difficulty: 'EASY',
      category: 'Học tập làm theo Bác',
      status: 'ACTIVE',
      createdAt: '2026-08-02'
    },
    {
      id: 'bq-3',
      question: 'Theo Luật Thực hiện dân chủ ở cơ sở năm 2022, phương châm thực hiện dân chủ ở cơ sở là gì?',
      options: [
        'Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng',
        'Dân biết, dân làm, dân kiểm tra',
        'Dân bàn, dân làm, dân thụ hưởng',
        'Tập trung dân chủ, đoàn kết nội bộ'
      ],
      correctAnswerIndex: 0,
      explanation: 'Điều 3 Luật Thực hiện dân chủ ở cơ sở quy định phương châm đầy đủ gồm 6 bước: Dân biết, dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng.',
      topic: 'Pháp luật & Dân chủ',
      difficulty: 'MEDIUM',
      category: 'Quy chế Dân chủ',
      status: 'ACTIVE',
      createdAt: '2026-08-05'
    }
  ]);

  const handleExportExcel = () => {
    if (onTriggerToast) {
      onTriggerToast('Xuất tệp Ngân hàng đề', `Đã xuất ${questions.length} câu hỏi thuộc bộ đề "${selectedBank.title}" ra tệp Excel chuẩn.`);
    }
  };

  const handleImportExcel = () => {
    setIsImportModalOpen(false);
    if (onTriggerToast) {
      onTriggerToast('Nhập dữ liệu thành công', 'Đã nhập thành công 25 câu hỏi mới vào Ngân hàng câu hỏi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-100 text-red-800">
              <Database className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-black text-slate-900">Quản Lý Ngân Hàng Câu Hỏi Trắc Nghiệm</h2>
              <p className="text-xs text-slate-500 font-medium">Lưu trữ, trộn đề tự động và kiểm soát chất lượng câu hỏi cho các hội thi trực tuyến</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Nhập Excel / CSV</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Bank Collections */}
        <div className="lg:col-span-4 space-y-3">
          <div className="font-black text-xs uppercase tracking-wider text-slate-500 px-1">
            Danh mục Bộ đề &amp; Chủ đề
          </div>
          {banks.map(b => (
            <div
              key={b.id}
              onClick={() => setSelectedBank(b)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedBank.id === b.id 
                  ? 'bg-red-50/60 border-red-500 shadow-md ring-1 ring-red-500/20' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="text-[10px] font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded">
                  {b.topic}
                </span>
                <span className="text-xs font-mono font-bold text-slate-600">
                  {b.totalQuestions} câu
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                {b.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {b.description}
              </p>
            </div>
          ))}
        </div>

        {/* Right: Question List in Selected Bank */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
            <div className="relative w-72">
              <input
                type="text"
                placeholder="Tìm câu hỏi theo từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            </div>
            <div className="text-xs font-bold text-slate-500">
              Hiển thị <strong>{questions.length}</strong> câu hỏi chuẩn hóa
            </div>
          </div>

          <div className="space-y-3">
            {questions.map((q, qIndex) => (
              <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-red-700 text-white text-xs font-black flex items-center justify-center shrink-0">
                      {qIndex + 1}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {q.difficulty === 'EASY' ? 'Dễ' : q.difficulty === 'MEDIUM' ? 'Trung bình' : 'Khó'}
                    </span>
                    <span className="text-[10px] font-bold text-red-700">
                      Chủ đề: {q.topic}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1 text-slate-400 hover:text-red-700 rounded-lg hover:bg-red-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="font-black text-slate-900 text-xs sm:text-sm leading-snug">
                  {q.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctAnswerIndex;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                          isCorrect 
                            ? 'bg-emerald-50/80 border-emerald-400 text-emerald-900 font-bold' 
                            : 'bg-slate-50/60 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                          isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-tight">{opt}</span>
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 font-medium">
                    <strong>Giải thích đáp án:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <span>Nhập Ngân hàng câu hỏi từ Excel</span>
            </h3>
            <p className="text-xs text-slate-600">
              Vui lòng sử dụng tệp mẫu có các cột: <code>CauHoi</code>, <code>DapAnA</code>, <code>DapAnB</code>, <code>DapAnC</code>, <code>DapAnD</code>, <code>DapAnDung</code>, <code>GiaiThich</code>.
            </p>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center space-y-2 hover:border-red-400 transition-colors cursor-pointer bg-slate-50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-700">Kéo thả tệp .xlsx hoặc bấm để duyệt</div>
              <div className="text-[10px] text-slate-400">Dung lượng tối đa 10MB</div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl"
              >
                Hủy
              </button>
              <button
                onClick={handleImportExcel}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Xác nhận nhập dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
