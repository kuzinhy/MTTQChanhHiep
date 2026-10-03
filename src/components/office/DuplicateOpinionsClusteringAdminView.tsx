import React, { useState } from 'react';
import { 
  GitMerge, MessageSquare, Check, Sparkles, AlertCircle, 
  MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2 
} from 'lucide-react';

interface ClusteredOpinionGroup {
  id: string;
  topicTitle: string;
  category: string;
  neighborhood: string;
  duplicateCount: number;
  similarityScore: string;
  summary: string;
  opinions: { id: string; sender: string; time: string; text: string }[];
  suggestedResolution: string;
  status: 'PENDING_BATCH' | 'RESOLVED';
}

export const DuplicateOpinionsClusteringAdminView: React.FC<{ onTriggerToast: (title: string, msg?: string) => void }> = ({
  onTriggerToast
}) => {
  const [clusters, setClusters] = useState<ClusteredOpinionGroup[]>([
    {
      id: 'cluster-01',
      topicTitle: 'Hệ thống đèn chiếu sáng công cộng hẻm 45 đường Nguyễn Văn Tiết',
      category: 'Hạ tầng đô thị',
      neighborhood: 'Khu phố 3',
      duplicateCount: 6,
      similarityScore: '96.8%',
      summary: '6 hộ dân cùng phản ánh 2 bóng đèn cao áp bị chập chờn và tắt hẳn từ tối thứ 5 tuần trước.',
      opinions: [
        { id: 'op-1', sender: 'Nguyễn Văn T. (Hẻm 45)', time: 'Hôm qua 08:30', text: 'Đèn đường đoạn số nhà 45/12 bị đứt bóng gây tối đường đi lại.' },
        { id: 'op-2', sender: 'Trần Thị H. (Hẻm 45)', time: 'Hôm qua 10:15', text: 'Kính gửi UBND xem xét sửa đèn đường đầu hẻm 45 KP3, tối rất nguy hiểm.' },
        { id: 'op-3', sender: 'Lê Minh K.', time: 'Hôm nay 07:45', text: 'Đèn chiếu sáng trước nhà 45/8 tắt 3 hôm nay chưa thấy sửa chữa.' }
      ],
      suggestedResolution: 'Ủy ban MTTQ phối hợp Tổ Quản lý Đô thị đã chuyển đội điện chiếu sáng thay mới 02 bóng LED 50W vào chiều nay.',
      status: 'PENDING_BATCH'
    },
    {
      id: 'cluster-02',
      topicTitle: 'Thu gom rác sinh hoạt định kỳ sau kỳ nghỉ lễ',
      category: 'Môi trường',
      neighborhood: 'Khu phố 7',
      duplicateCount: 4,
      similarityScore: '92.4%',
      summary: '4 phản ánh về việc xe gom rác chậm trễ 1 ngày tại tuyến đường nội bộ số 2.',
      opinions: [
        { id: 'op-4', sender: 'Phạm Thị M.', time: 'Hôm nay 08:00', text: 'Rác sinh hoạt để trước cửa từ hôm qua chưa thấy đơn vị gom rác đến lấy.' },
        { id: 'op-5', sender: 'Võ Thành Đ.', time: 'Hôm nay 08:20', text: 'Đề nghị công ty môi trường gom rác đúng lịch trình cho tuyến đường 2.' }
      ],
      suggestedResolution: 'Đã đôn đốc Công ty Môi trường Đô thị tăng cường 01 xe ép rác chuyên dụng hoàn thành dọn dẹp trước 11:30.',
      status: 'PENDING_BATCH'
    }
  ]);

  const handleResolveBatch = (clusterId: string) => {
    setClusters(prev => prev.map(c => c.id === clusterId ? { ...c, status: 'RESOLVED' } : c));
    onTriggerToast('Xử lý thành công', 'Đã ban hành văn bản trả lời tập trung và gửi thông báo đồng loạt đến tất cả người dân phản ánh.');
  };

  return (
    <div className="space-y-6 font-sans select-none">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl border border-indigo-100">
            <GitMerge className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[10px] font-black">
                SEMANTIC CLUSTERING
              </span>
              <span className="text-xs text-slate-500 font-bold">Thuật toán Gom cụm Dân nguyện Trùng lặp</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight mt-0.5">
              Phát hiện &amp; Xử lý Tập trung Ý kiến Dân nguyện Trùng lặp
            </h2>
          </div>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
          Tiết kiệm 85% thời gian xử lý sự vụ
        </div>
      </div>

      {/* Clusters List */}
      <div className="space-y-4">
        {clusters.map(cluster => (
          <div key={cluster.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                    {cluster.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{cluster.neighborhood}</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-mono font-bold text-[10px]">
                    Độ tương đồng: {cluster.similarityScore}
                  </span>
                </div>

                <h3 className="font-black text-base text-slate-900 mt-1">
                  {cluster.topicTitle}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-black">
                  {cluster.duplicateCount} ý kiến cùng nội dung
                </span>
              </div>
            </div>

            {/* Content summary */}
            <p className="text-xs text-slate-600 font-medium">
              {cluster.summary}
            </p>

            {/* List of clustered opinions */}
            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block text-[11px]">Trích lục các ý kiến của người dân trong cụm:</span>
              <div className="space-y-1.5">
                {cluster.opinions.map(op => (
                  <div key={op.id} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-0.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
                      <span>{op.sender}</span>
                      <span>{op.time}</span>
                    </div>
                    <p className="text-slate-800 font-medium">"{op.text}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Resolution & Action Button */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-emerald-800 block text-[11px] mb-0.5">Phương án trả lời tập trung đề xuất:</span>
                <p className="text-emerald-950 font-medium">{cluster.suggestedResolution}</p>
              </div>

              {cluster.status === 'PENDING_BATCH' ? (
                <button
                  type="button"
                  onClick={() => handleResolveBatch(cluster.id)}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Xử lý &amp; Trả lời đồng loạt</span>
                </button>
              ) : (
                <span className="px-3 py-1.5 bg-white text-emerald-800 border border-emerald-300 rounded-xl font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã xử lý &amp; Phát thông báo</span>
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
