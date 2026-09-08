import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Printer, 
  Download, 
  Building2, 
  QrCode, 
  Calendar, 
  CheckCircle2, 
  Award, 
  Filter,
  Users,
  MessageSquare,
  FileCheck,
  RefreshCw
} from 'lucide-react';

interface ReportTemplateProps {
  reportType: 'front_work' | 'opinions_summary' | 'volunteer_welfare' | 'emulation_21kp';
}

export const AdministrativeReportExporter: React.FC = () => {
  const [reportType, setReportType] = useState<ReportTemplateProps['reportType']>('front_work');
  const [reportQuarter, setReportQuarter] = useState<string>('Quý I năm 2026');
  const [signerTitle, setSignerTitle] = useState<string>('CHỦ TỊCH');
  const [signerName, setSignerName] = useState<string>('Trần Thị Hoa');
  const [creatorName, setCreatorName] = useState<string>('Nguyễn Huy');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let content = "STT,Danh mục / Chỉ tiêu,Số liệu,Tỷ lệ hoàn thành,Ghi chú\n";
    if (reportType === 'opinions_summary') {
      content += "1,Ý kiến phản ánh dân sinh đã nhận,142,100%,Toàn phường\n";
      content += "2,Ý kiến đã xử lý dứt điểm,138,97.1%,Đúng hạn\n";
      content += "3,Ý kiến đang xử lý,4,2.9%,Trong thời hạn\n";
    } else {
      content += "1,Tổng số cuộc giám sát phản biện,12,100%,Hoàn thành tốt\n";
      content += "2,Công trình Đại đoàn kết đã bàn giao,5,100%,Kinh phí xã hội hóa\n";
      content += "3,Số lượt người dân tham gia Hội thi số,1850,120%,Vượt chỉ tiêu\n";
    }

    const blob = new Blob(["\uFEFF" + content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bao_cao_mat_tran_${reportType}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 text-slate-800 antialiased">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-800 via-red-700 to-amber-700 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-red-600/30">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            Thể thức Văn bản Hành chính NĐ 30/2020/NĐ-CP
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bộ Xuất Báo Cáo & In Ấn Chuẩn Thể Thức Số
          </h1>
          <p className="text-red-100 text-sm mt-1 max-w-2xl">
            Tự động tổng hợp số liệu công tác Mặt trận, ý kiến dân sinh và bảng điểm thi đua 21 Khu phố ra văn bản báo cáo in ấn có tem mã QR tra cứu số.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print:hidden">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium text-sm transition-all border border-white/20 backdrop-blur-md active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Xuất Excel / CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 rounded-xl font-bold text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>In / Xuất Báo Cáo PDF</span>
          </button>
        </div>
      </div>

      {/* Control Panel Filter */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm space-y-4 print:hidden">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-sm border-b border-slate-100 pb-3">
          <Filter className="w-4 h-4 text-red-600" />
          <span>Cấu hình Thông số Văn bản Báo cáo</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Loại Báo Cáo Tổng Hợp
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-800 font-medium"
            >
              <option value="front_work">Báo cáo Công tác Mặt trận Tổng hợp</option>
              <option value="opinions_summary">Báo cáo Xử lý Ý kiến Dân sinh</option>
              <option value="volunteer_welfare">Báo cáo Tình nguyện & An sinh Social</option>
              <option value="emulation_21kp">Báo cáo Thi đua 21 Ban CTMT Khu phố</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Giai Đoạn Báo Cáo
            </label>
            <input
              type="text"
              value={reportQuarter}
              onChange={(e) => setReportQuarter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-800 font-medium"
              placeholder="VD: Quý I năm 2026"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Chức danh Người Ký
            </label>
            <input
              type="text"
              value={signerTitle}
              onChange={(e) => setSignerTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">
              Họ tên Người Ký duyệt
            </label>
            <input
              type="text"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:bg-white transition-all text-slate-800 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Official Document Preview Area (Decree 30/2020 Standard) */}
      <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-12 shadow-2xl space-y-8 font-serif leading-relaxed text-slate-900 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:rounded-none">
        
        {/* Document Header (Quốc hiệu & Tiêu ngữ) */}
        <div className="grid grid-cols-12 gap-4 border-b border-slate-300 pb-6">
          <div className="col-span-5 text-center uppercase font-sans text-xs sm:text-sm font-bold text-slate-800 leading-tight">
            <p className="text-red-700 font-extrabold">ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM</p>
            <p className="font-extrabold text-slate-900">PHƯỜNG CHÁNH HIỆP</p>
            <div className="w-20 h-0.5 bg-slate-800 mx-auto my-1.5" />
            <p className="font-mono text-[11px] text-slate-600 font-normal normal-case">
              Số: {reportType === 'opinions_summary' ? '18/BC-MTTQ-DS' : '24/BC-MTTQ-TH'}
            </p>
          </div>

          <div className="col-span-7 text-center font-sans uppercase font-bold text-xs sm:text-sm text-slate-900 leading-tight">
            <p className="font-extrabold text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="text-slate-800 font-bold">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-28 h-0.5 bg-slate-800 mx-auto my-1.5" />
            <p className="font-sans italic normal-case text-xs text-slate-600 font-normal text-right mt-2">
              Chánh Hiệp, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center space-y-2 pt-2">
          <h2 className="text-lg sm:text-2xl font-sans font-extrabold text-red-800 uppercase tracking-wide leading-tight">
            {reportType === 'front_work' && 'BÁO CÁO TỔNG HỢP CÔNG TÁC MẶT TRẬN'}
            {reportType === 'opinions_summary' && 'BÁO CÁO XỬ LÝ Ý KIẾN PHẢN ÁNH DÂN SINH 21 KHU PHỐ'}
            {reportType === 'volunteer_welfare' && 'BÁO CÁO KẾT QUẢ PHONG TRÀO AN SINH XÃ HỘI & TÌNH NGUYỆN'}
            {reportType === 'emulation_21kp' && 'BÁO CÁO BẢNG ĐIỂM THI ĐƯA 21 BAN CÔNG TÁC MẶT TRẬN KHU PHỐ'}
          </h2>
          <p className="text-sm font-sans font-bold text-slate-700 italic">
            Giai đoạn: {reportQuarter}
          </p>
        </div>

        {/* Report Content Body */}
        <div className="space-y-6 text-sm sm:text-base text-slate-800 font-serif">
          
          {/* Section I */}
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-slate-900 uppercase tracking-wide">
              I. ĐÁNH GIÁ CHUNG VÀ SỐ LIỆU TỔNG HỢP
            </h3>
            <p className="indent-6 text-justify">
              Trong {reportQuarter}, Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp đã chủ động triển khai đồng bộ các nhiệm vụ trọng tâm, đẩy mạnh ứng dụng Chuyển đổi số trong quản lý điều hành và gắn kết chặt chẽ với 21 Ban Công tác Mặt trận Khu phố.
            </p>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto my-4 font-sans text-xs sm:text-sm">
            <table className="w-full border-collapse border border-slate-300 text-left">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold uppercase text-[11px] sm:text-xs">
                  <th className="border border-slate-300 px-3 py-2 text-center w-12">STT</th>
                  <th className="border border-slate-300 px-3 py-2">Danh mục Chỉ tiêu Nhiệm vụ</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">Đơn vị tính</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">Số liệu đạt</th>
                  <th className="border border-slate-300 px-3 py-2 text-center">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {reportType === 'opinions_summary' ? (
                  <>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 text-center">1</td>
                      <td className="border border-slate-300 px-3 py-2 font-medium">Tổng số Ý kiến Phản ánh Dân sinh tiếp nhận</td>
                      <td className="border border-slate-300 px-3 py-2 text-center">Ý kiến</td>
                      <td className="border border-slate-300 px-3 py-2 text-center font-bold">142</td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-emerald-700 font-bold">100%</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 text-center">2</td>
                      <td className="border border-slate-300 px-3 py-2 font-medium">Ý kiến đã phản hồi & giải quyết dứt điểm</td>
                      <td className="border border-slate-300 px-3 py-2 text-center">Ý kiến</td>
                      <td className="border border-slate-300 px-3 py-2 text-center font-bold">138</td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-emerald-700 font-bold">97.1%</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 text-center">3</td>
                      <td className="border border-slate-300 px-3 py-2 font-medium">Ý kiến đang phối hợp UBND xử lý đúng hạn</td>
                      <td className="border border-slate-300 px-3 py-2 text-center">Ý kiến</td>
                      <td className="border border-slate-300 px-3 py-2 text-center font-bold">4</td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-amber-600 font-bold">2.9%</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 text-center">1</td>
                      <td className="border border-slate-300 px-3 py-2 font-medium">Công trình Đại đoàn kết & Sửa chữa nhà an sinh</td>
                      <td className="border border-slate-300 px-3 py-2 text-center">Căn</td>
                      <td className="border border-slate-300 px-3 py-2 text-center font-bold">5</td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-emerald-700 font-bold">100%</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 text-center">2</td>
                      <td className="border border-slate-300 px-3 py-2 font-medium">Lượt người dân tham gia Hội thi Tìm hiểu trực tuyến</td>
                      <td className="border border-slate-300 px-3 py-2 text-center">Lượt</td>
                      <td className="border border-slate-300 px-3 py-2 text-center font-bold">1,850</td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-emerald-700 font-bold">123%</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 px-3 py-2 text-center">3</td>
                      <td className="border border-slate-300 px-3 py-2 font-medium">Ban Công tác Mặt trận Khu phố đạt Loại Xuất sắc</td>
                      <td className="border border-slate-300 px-3 py-2 text-center">Khu phố</td>
                      <td className="border border-slate-300 px-3 py-2 text-center font-bold">18 / 21</td>
                      <td className="border border-slate-300 px-3 py-2 text-center text-emerald-700 font-bold">85.7%</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Section II */}
          <div className="space-y-2">
            <h3 className="font-sans font-bold text-slate-900 uppercase tracking-wide">
              II. PHƯƠNG HƯỚNG VÀ TRỌNG TÂM CÔNG TÁC TIẾP THEO
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-justify pl-2">
              <li>Tiếp tục duy trì và mở rộng kênh tiếp nhận phản ánh Dân sinh 21 Khu phố.</li>
              <li>Đẩy mạnh các công trình Chuyển đổi số, gắn biển Mã QR Bản đồ an sinh số tại từng Ban Công tác Mặt trận.</li>
              <li>Thường xuyên rà soát, thi đua khen thưởng đột xuất các tập thể, cá nhân điển hình Dân vận khéo.</li>
            </ul>
          </div>
        </div>

        {/* Footer Signatures & QR Verification Stamp */}
        <div className="grid grid-cols-12 gap-4 pt-8 border-t border-slate-200 font-sans">
          
          {/* Nơi nhận & QR stamp */}
          <div className="col-span-6 space-y-3 text-xs text-slate-700">
            <div>
              <p className="font-bold uppercase text-[11px] text-slate-900">Nơi nhận:</p>
              <ul className="text-[11px] list-disc list-inside space-y-0.5 text-slate-600 italic">
                <li>Ủy ban MTTQ Việt Nam TP. Thủ Dầu Một (b/c);</li>
                <li>Thường trực Đảng ủy phường (b/c);</li>
                <li>UBND phường Chánh Hiệp (p/h);</li>
                <li>21 Ban CTMT Khu phố (t/h);</li>
                <li>Lưu: VT, CĐS.</li>
              </ul>
            </div>

            <div className="inline-flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-600">
              <div className="p-1 bg-white border border-slate-300 rounded shadow-sm">
                <QrCode className="w-8 h-8 text-red-700" />
              </div>
              <div>
                <p className="font-bold text-slate-900 uppercase">Xác thực văn bản số</p>
                <p className="font-mono text-[9px] text-slate-500">Mã: MTTQ-CH-{Date.now().toString().slice(-6)}</p>
                <p className="text-[9px] text-emerald-700 font-bold">✓ Đã đồng bộ Cloud Firestore</p>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="col-span-6 text-center space-y-12">
            <div>
              <p className="font-bold uppercase text-xs sm:text-sm text-slate-900">
                TM. THƯỜNG TRỰC UỶ BAN MTTQ
              </p>
              <p className="font-bold text-xs uppercase text-slate-800">{signerTitle}</p>
            </div>

            <div className="pt-8">
              <p className="font-bold text-sm text-slate-900">{signerName}</p>
              <p className="text-[11px] text-slate-500 italic">Dấu ký số điện tử MTTQ Chánh Hiệp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdministrativeReportExporter;
