import React, { useState } from 'react';
import { Calculator, QrCode, CreditCard, Check, X, ShieldCheck, Download, AlertCircle } from 'lucide-react';

interface CivicFeeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CivicFeeCalculatorModal: React.FC<CivicFeeCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [feeType, setFeeType] = useState<'sao_y' | 'hon_nhan' | 'trich_luc' | 'khac'>('sao_y');
  const [pageCount, setPageCount] = useState<number>(2);
  const [copyCount, setCopyCount] = useState<number>(3);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  if (!isOpen) return null;

  // Exact statutory fee calculation logic:
  // Sao y: 2.000d cho 2 trang đầu, từ trang thứ 3: 1.000d/trang
  const calculateTotal = () => {
    if (feeType === 'sao_y') {
      const feePerPage = pageCount <= 2 ? 2000 * pageCount : (2000 * 2) + ((pageCount - 2) * 1000);
      return feePerPage * copyCount;
    }
    if (feeType === 'hon_nhan') return 15000 * copyCount;
    if (feeType === 'trich_luc') return 8000 * copyCount;
    return 10000 * copyCount;
  };

  const totalAmount = calculateTotal();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 font-sans select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-5 sm:p-6 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl border border-blue-200">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">Tính lệ phí thủ tục &amp; VietQR</h3>
              <p className="text-[11px] text-slate-500 font-medium">Theo biểu mức thu quy định của HĐND tỉnh</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selection Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Loại thủ tục hành chính:</label>
            <select
              value={feeType}
              onChange={(e) => setFeeType(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
            >
              <option value="sao_y">Chứng thực bản sao từ bản chính (Sao y)</option>
              <option value="hon_nhan">Cấp Giấy xác nhận tình trạng hôn nhân (15.000đ/bản)</option>
              <option value="trich_luc">Cấp bản sao trích lục hộ tịch (8.000đ/bản)</option>
              <option value="khac">Thủ tục hành chính khác</option>
            </select>
          </div>

          {feeType === 'sao_y' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">Số trang trên 01 bản gốc:</label>
              <input
                type="number"
                min="1"
                max="100"
                value={pageCount}
                onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">Số lượng bản cần cấp / chứng thực:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={copyCount}
              onChange={(e) => setCopyCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none"
            />
          </div>
        </div>

        {/* Calculated Result Box */}
        <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200 text-center space-y-1">
          <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">TỔNG LỆ PHÍ CẦN NỘP:</span>
          <strong className="text-2xl font-black text-blue-900 font-mono">
            {totalAmount.toLocaleString('vi-VN')} VNĐ
          </strong>
          <span className="text-[10px] text-blue-600 block">Miễn phí đối với người có công, hộ nghèo và trẻ em</span>
        </div>

        {/* VietQR Mock Card */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
          <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <QrCode className="w-14 h-14 text-slate-900" />
          </div>
          <div className="min-w-0 flex-1 space-y-0.5 text-[11px]">
            <span className="font-bold text-slate-900 block">Tài khoản thu phí Một cửa:</span>
            <span className="text-slate-600 font-mono block">UBND PHƯỜNG CHÁNH HIỆP</span>
            <span className="text-emerald-700 font-bold block">Quét VietQR chuyển khoản nhanh</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
        >
          Đã hiểu &amp; Đóng
        </button>

      </div>
    </div>
  );
};
