import React, { useState, useEffect } from 'react';
import { 
  X, 
  HeartHandshake, 
  AlertCircle, 
  QrCode, 
  Award, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  FileText, 
  Share2, 
  Download, 
  Printer, 
  ShieldCheck, 
  Sparkles, 
  Send, 
  Landmark, 
  HandHeart, 
  Home, 
  BookOpen, 
  Stethoscope, 
  PlusCircle, 
  Check, 
  DollarSign,
  Layers,
  ChevronRight
} from 'lucide-react';
import { UrgentWelfareRequest, DonationRecord, FamilySolidarityAssessment } from '../../types';
import { AppStorageEngine, STORAGE_KEYS } from '../../lib/storage';

interface CitizenWelfareHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'sos_aid' | 'donation' | 'solidarity_handbook';
}

export const CitizenWelfareHubModal: React.FC<CitizenWelfareHubModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'sos_aid'
}) => {
  const [activeTab, setActiveTab] = useState<'sos_aid' | 'donation' | 'solidarity_handbook'>(defaultTab);

  // =========================================================================
  // TAB 1: SOS URGENT WELFARE REQUEST STATE
  // =========================================================================
  const [sosFullName, setSosFullName] = useState('');
  const [sosPhone, setSosPhone] = useState('');
  const [sosIdCard, setSosIdCard] = useState('');
  const [sosNeighborhood, setSosNeighborhood] = useState('Khu phố 1');
  const [sosAddress, setSosAddress] = useState('');
  const [sosAidType, setSosAidType] = useState<UrgentWelfareRequest['aidType']>('FOOD_ESSENTIALS');
  const [sosPeopleCount, setSosPeopleCount] = useState(1);
  const [sosDescription, setSosDescription] = useState('');
  const [sosSubmittedRequest, setSosSubmittedRequest] = useState<UrgentWelfareRequest | null>(null);
  const [isSubmittingSos, setIsSubmittingSos] = useState(false);

  // =========================================================================
  // TAB 2: SMART DONATION & E-CERTIFICATE STATE
  // =========================================================================
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [donationAmount, setDonationAmount] = useState<number>(200000);
  const [customAmount, setCustomAmount] = useState('');
  const [donationFund, setDonationFund] = useState<DonationRecord['fundType']>('POOR_FUND');
  const [donationMessage, setDonationMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<DonationRecord | null>(null);
  const [copiedDonation, setCopiedDonation] = useState(false);

  // =========================================================================
  // TAB 3: SOLIDARITY FAMILY HANDBOOK & CRITERIA STATE
  // =========================================================================
  const solidarityCriteria = [
    { id: 'crit_1', title: '1. Gương mẫu chấp hành chủ trương của Đảng, chính sách, pháp luật của Nhà nước', desc: 'Không có thành viên trong hộ vi phạm pháp luật, chấp hành tốt các quy định địa phương.' },
    { id: 'crit_2', title: '2. Tích cực tham gia các phong trào thi đua, cuộc vận động do MTTQ phát động', desc: 'Tham gia Ngày hội Đại đoàn kết, đóng góp các quỹ an sinh vì người nghèo.' },
    { id: 'crit_3', title: '3. Giữ gìn đoàn kết, nghĩa tình xóm giềng và tương trợ cộng đồng', desc: 'Thực hiện tốt quy ước khu phố, hòa nhã, giúp đỡ các hộ khó khăn xung quanh.' },
    { id: 'crit_4', title: '4. Giữ gìn vệ sinh môi trường, tạo cảnh quan xanh - sạch - đẹp', desc: 'Phân loại rác tại nguồn, không xả rác bừa bãi, trồng cây xanh trước nhà.' },
    { id: 'crit_5', title: '5. Đảm bảo an ninh trật tự, phòng cháy chữa cháy và trật tự đô thị', desc: 'Trang bị bình chữa cháy, không lấn chiếm lòng lề đường, không tụ tập gây rối.' },
    { id: 'crit_6', title: '6. Xây dựng gia đình no ấm, tiến bộ, hạnh phúc, văn minh', desc: 'Ông bà cha mẹ mẫu mực, con cháu thảo hiền, không có bạo lực gia đình.' },
    { id: 'crit_7', title: '7. Chăm lo học tập, giáo dục con cái và nâng cao thể chất', desc: 'Con em trong độ tuổi đến trường đầy đủ, tham gia rèn luyện thể thao.' },
    { id: 'crit_8', title: '8. Thực hiện nếp sống văn minh trong việc cưới, việc tang, lễ hội', desc: 'Tổ chức tiết kiệm, trang trọng, không rải vàng mã bừa bãi, không mở nhạc quá giờ.' },
    { id: 'crit_9', title: '9. Không mắc các tệ nạn xã hội (ma túy, cờ bạc, mại dâm, mê tín dị đoan)', desc: 'Xây dựng lối sống lành mạnh, bài trừ các tệ nạn xã hội.' },
    { id: 'crit_10', title: '10. Tích cực ứng dụng công nghệ số và chuyển đổi số trong đời sống', desc: 'Cài đặt VNeID, nộp hồ sơ dịch vụ công trực tuyến, thanh toán không dùng tiền mặt.' }
  ];

  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({
    crit_1: 10, crit_2: 10, crit_3: 10, crit_4: 10, crit_5: 10,
    crit_6: 10, crit_7: 10, crit_8: 10, crit_9: 10, crit_10: 10
  });
  const [familyHead, setFamilyHead] = useState('');
  const [familyPhone, setFamilyPhone] = useState('');
  const [familyNeighborhood, setFamilyNeighborhood] = useState('Khu phố 1');
  const [familyAddress, setFamilyAddress] = useState('');
  const [familyMembersCount, setFamilyMembersCount] = useState(4);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState<FamilySolidarityAssessment | null>(null);

  useEffect(() => {
    if (defaultTab) setActiveTab(defaultTab);
  }, [defaultTab, isOpen]);

  // Calculate total solidarity score
  const totalSolidarityScore = Object.values(criteriaScores).reduce((a, b) => a + b, 0);
  const getSolidarityRating = (score: number) => {
    if (score >= 90) return { label: 'Gia đình Đại đoàn kết Xuất sắc', color: 'text-emerald-600 bg-emerald-50 border-emerald-300' };
    if (score >= 70) return { label: 'Đạt chuẩn Gia đình Đại đoàn kết', color: 'text-blue-600 bg-blue-50 border-blue-300' };
    return { label: 'Cần nỗ lực phấn đấu thêm', color: 'text-amber-600 bg-amber-50 border-amber-300' };
  };

  // Submit SOS Request
  const handleSubmitSos = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosFullName.trim() || !sosPhone.trim() || !sosAddress.trim()) {
      alert('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ để cán bộ Mặt trận đến hỗ trợ kịp thời!');
      return;
    }

    setIsSubmittingSos(true);
    const code = `AS-2026-CH${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: UrgentWelfareRequest = {
      id: `sos_${Date.now()}`,
      requestCode: code,
      fullname: sosFullName.trim(),
      phone: sosPhone.trim(),
      idCardNumber: sosIdCard.trim(),
      neighborhood: sosNeighborhood,
      address: sosAddress.trim(),
      aidType: sosAidType,
      estimatedPeople: Number(sosPeopleCount) || 1,
      description: sosDescription.trim(),
      status: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };

    try {
      const existing = AppStorageEngine.getItem<UrgentWelfareRequest[]>(STORAGE_KEYS.URGENT_AID_REQUESTS, []);
      AppStorageEngine.setItem(STORAGE_KEYS.URGENT_AID_REQUESTS, [newReq, ...existing], `Tiếp nhận yêu cầu cứu trợ ${code}`);
      setSosSubmittedRequest(newReq);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingSos(false);
    }
  };

  // Generate Donation Certificate
  const handleGenerateCertificate = () => {
    const finalAmount = customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) : donationAmount;
    if (!finalAmount || finalAmount <= 0) {
      alert('Vui lòng chọn hoặc nhập số tiền ủng hộ hợp lệ!');
      return;
    }

    const name = isAnonymous ? 'Nhà hảo tâm ẩn danh' : (donorName.trim() || 'Nhà hảo tâm vì cộng đồng');
    const recNumber = `TL-2026-CH${Math.floor(10000 + Math.random() * 90000)}`;
    
    const record: DonationRecord = {
      id: `don_${Date.now()}`,
      receiptNumber: recNumber,
      donorName: name,
      donorPhone: donorPhone.trim(),
      amount: finalAmount,
      fundType: donationFund,
      paymentMethod: 'VIETQR_BANK',
      message: donationMessage.trim(),
      isAnonymous,
      certificateGenerated: true,
      createdAt: new Date().toISOString(),
      verified: true
    };

    try {
      const existing = AppStorageEngine.getItem<DonationRecord[]>(STORAGE_KEYS.DONATIONS, []);
      AppStorageEngine.setItem(STORAGE_KEYS.DONATIONS, [record, ...existing], `Ghi nhận ủng hộ quỹ ${recNumber}`);
      setGeneratedCertificate(record);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Family Solidarity Assessment
  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!familyHead.trim() || !familyPhone.trim() || !familyAddress.trim()) {
      alert('Vui lòng điền thông tin Chủ hộ, Số điện thoại và Địa chỉ!');
      return;
    }

    const regCode = `GĐ-2026-CH${Math.floor(1000 + Math.random() * 9000)}`;
    const ratingKey = totalSolidarityScore >= 90 ? 'EXCELLENT' : totalSolidarityScore >= 70 ? 'QUALIFIED' : 'NEEDS_STRIVE';
    
    const assessment: FamilySolidarityAssessment = {
      id: `solidarity_${Date.now()}`,
      registrationCode: regCode,
      headOfHousehold: familyHead.trim(),
      phone: familyPhone.trim(),
      neighborhood: familyNeighborhood,
      address: familyAddress.trim(),
      membersCount: familyMembersCount,
      scores: criteriaScores,
      totalScore: totalSolidarityScore,
      rating: ratingKey,
      submittedAt: new Date().toISOString()
    };

    try {
      const existing = AppStorageEngine.getItem<FamilySolidarityAssessment[]>(STORAGE_KEYS.SOLIDARITY_ASSESSMENTS, []);
      AppStorageEngine.setItem(STORAGE_KEYS.SOLIDARITY_ASSESSMENTS, [assessment, ...existing], `Đăng ký gia đình văn hóa ${regCode}`);
      setAssessmentSubmitted(assessment);
    } catch (err) {
      console.error(err);
    }
  };

  const getFundLabel = (fund: DonationRecord['fundType']) => {
    switch (fund) {
      case 'POOR_FUND': return 'Quỹ "Vì Người Nghèo" Phường Chánh Hiệp';
      case 'EMERGENCY_DISASTER': return 'Quỹ Cứu Trợ Khẩn Cấp & Thiên Tai';
      case 'SCHOLARSHIP_FUND': return 'Quỹ Học Bổng "Tiếp Sức Đến Trường"';
      case 'GREAT_SOLIDARITY_HOUSE': return 'Quỹ Hỗ Trợ Xây Dựng & Sửa Chữa Nhà Đại Đoàn Kết';
      default: return 'Quỹ An Sinh Xã Hội MTTQ';
    }
  };

  const getAidTypeLabel = (type: UrgentWelfareRequest['aidType']) => {
    switch (type) {
      case 'FOOD_ESSENTIALS': return 'Gạo & Nhu yếu phẩm khẩn cấp';
      case 'EMERGENCY_MEDICAL': return 'Hỗ trợ Viện phí / Thuốc men đột xuất';
      case 'SCHOLARSHIP': return 'Học bổng / Dụng cụ học tập cho học sinh nghèo';
      case 'GREAT_SOLIDARITY_HOUSE': return 'Hỗ trợ Sửa chữa nhà dột nát / Nhà Đại đoàn kết';
      case 'WHEELCHAIR_DISABILITY': return 'Xe lăn / Thiết bị hỗ trợ người khuyết tật';
      default: return 'Hỗ trợ cứu trợ khẩn cấp khác';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header with City Branding */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 relative">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <HeartHandshake className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight uppercase">CỔNG AN SINH SỐ &amp; ĐẠI ĐOÀN KẾT</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 text-[10px] font-black border border-amber-300/30">
                  VÌ CỘNG ĐỒNG
                </span>
              </div>
              <p className="text-xs text-rose-100">Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp – Không để ai bị bỏ lại phía sau</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('sos_aid')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'sos_aid'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-300" />
            <span>1. Cứu trợ Khẩn cấp (SOS)</span>
          </button>

          <button
            onClick={() => setActiveTab('donation')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'donation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>2. Ủng hộ Quỹ &amp; Tấm Lòng Vàng</span>
          </button>

          <button
            onClick={() => setActiveTab('solidarity_handbook')}
            className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'solidarity_handbook'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4 text-amber-300" />
            <span>3. Sổ tay Gia đình ĐĐK (10 Tiêu chí)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* ========================================================================= */}
          {/* TAB 1: SOS URGENT AID FORM */}
          {/* ========================================================================= */}
          {activeTab === 'sos_aid' && (
            <div className="space-y-6">
              {!sosSubmittedRequest ? (
                <form onSubmit={handleSubmitSos} className="space-y-5">
                  <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-red-800 space-y-1">
                      <p className="font-bold">ĐƯỜNG DÂY NÓNG TIẾP NHẬN CỨU TRỢ AN SINH KHẨN CẤP</p>
                      <p>Dành cho các hộ gia đình có hoàn cảnh đặc biệt khó khăn, tai nạn đột xuất, bệnh hiểm nghèo hoặc cần trợ cấp lương thực khẩn cấp trên địa bàn 21 Khu phố Phường Chánh Hiệp.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Họ và tên người đại diện / Người cần hỗ trợ <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Nguyễn Văn A"
                        value={sosFullName}
                        onChange={(e) => setSosFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Số điện thoại liên hệ khẩn cấp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ví dụ: 0912 345 678"
                        value={sosPhone}
                        onChange={(e) => setSosPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Khu phố cư trú <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={sosNeighborhood}
                        onChange={(e) => setSosNeighborhood(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        {Array.from({ length: 21 }, (_, i) => (
                          <option key={i + 1} value={`Khu phố ${i + 1}`}>Khu phố {i + 1}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Địa chỉ nhà cụ thể (Số nhà, hẻm, tên đường) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: 123/45 đường Nguyễn Văn Tiết, Tổ 4, KP 1"
                        value={sosAddress}
                        onChange={(e) => setSosAddress(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Loại hình cứu trợ / Hỗ trợ cần thiết <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={sosAidType}
                        onChange={(e) => setSosAidType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-red-500 outline-none"
                      >
                        <option value="FOOD_ESSENTIALS">🍚 Gạo &amp; Nhu yếu phẩm khẩn cấp</option>
                        <option value="EMERGENCY_MEDICAL">💊 Viện phí / Thuốc men khẩn cấp</option>
                        <option value="SCHOLARSHIP">🎒 Học bổng &amp; Dụng cụ học tập học sinh nghèo</option>
                        <option value="GREAT_SOLIDARITY_HOUSE">🏠 Sửa chữa Nhà Đại đoàn kết / Chống dột</option>
                        <option value="WHEELCHAIR_DISABILITY">🦽 Xe lăn / Thiết bị người khuyết tật</option>
                        <option value="OTHER_URGENT">⚠️ Hỗ trợ đột xuất khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Số nhân khẩu trong hộ đang cần trợ giúp
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={sosPeopleCount}
                        onChange={(e) => setSosPeopleCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Mô tả hoàn cảnh khó khăn cụ thể
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả hoàn cảnh: người già neo đơn, ốm đau tai nạn, mất nguồn thu nhập..."
                      value={sosDescription}
                      onChange={(e) => setSosDescription(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-red-500 outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingSos}
                      className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black transition shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      {isSubmittingSos ? 'Đang gửi hồ sơ...' : 'GỬI YÊU CẦU CỨU TRỢ KHẨN CẤP'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-4 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">TIẾP NHẬN THÀNH CÔNG</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">Yêu cầu trợ giúp đã được gửi đến Ban Thường trực MTTQ</h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                      Cán bộ Mặt trận và Ban Công tác Mặt trận <strong>{sosSubmittedRequest.neighborhood}</strong> sẽ liên hệ xác minh và hỗ trợ trong thời gian sớm nhất.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 inline-block text-left text-xs space-y-1 max-w-sm w-full mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã định danh hồ sơ:</span>
                      <strong className="text-blue-700 font-mono">{sosSubmittedRequest.requestCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Người đại diện:</span>
                      <strong className="text-slate-800">{sosSubmittedRequest.fullname}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Loại cứu trợ:</span>
                      <strong className="text-slate-800">{getAidTypeLabel(sosSubmittedRequest.aidType)}</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSosSubmittedRequest(null);
                        setSosFullName('');
                        setSosPhone('');
                        setSosAddress('');
                        setSosDescription('');
                      }}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Gửi thêm yêu cầu khác
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SMART DONATION & E-CERTIFICATE */}
          {/* ========================================================================= */}
          {activeTab === 'donation' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Form & VietQR */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
                    <h4 className="text-xs font-black text-blue-900 uppercase flex items-center gap-1.5">
                      <HandHeart className="w-4 h-4 text-blue-600" />
                      Thông tin ủng hộ các quỹ an sinh MTTQ Phường Chánh Hiệp
                    </h4>
                    <p className="text-[11px] text-blue-800 mt-1">Mỗi đóng góp của quý vị là nguồn lực quý báu giúp đỡ người nghèo, học sinh vượt khó và gia đình khó khăn.</p>
                  </div>

                  {/* Fund Selector */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Chọn Quỹ ủng hộ:</label>
                    <select
                      value={donationFund}
                      onChange={(e) => setDonationFund(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="POOR_FUND">Quỹ "Vì Người Nghèo" Phường Chánh Hiệp</option>
                      <option value="EMERGENCY_DISASTER">Quỹ Cứu Trợ Khẩn Cấp &amp; Thiên Tai</option>
                      <option value="SCHOLARSHIP_FUND">Quỹ Học Bổng "Tiếp Sức Đến Trường"</option>
                      <option value="GREAT_SOLIDARITY_HOUSE">Quỹ Xây dựng &amp; Sửa Nhà Đại Đoàn Kết</option>
                    </select>
                  </div>

                  {/* Predefined Amounts */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1.5">Chọn mức đóng góp:</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => {
                            setDonationAmount(amt);
                            setCustomAmount('');
                          }}
                          className={`py-2 px-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                            donationAmount === amt && !customAmount
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          {amt.toLocaleString('vi-VN')} đ
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Hoặc nhập số tiền tùy tâm (VNĐ):</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 300,000"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  {/* Donor Info */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Họ tên người ủng hộ / Đơn vị:</label>
                      <input
                        type="text"
                        disabled={isAnonymous}
                        placeholder="Ví dụ: Gia đình ông Nguyễn Văn B hoặc Cty TNHH ..."
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="anonymousCheck"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="anonymousCheck" className="text-xs font-medium text-slate-700 cursor-pointer">
                        Ủng hộ ẩn danh (Không hiển thị tên công khai)
                      </label>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Lời nhắn / Lời chúc cộng đồng:</label>
                      <input
                        type="text"
                        placeholder="Gửi gắm tình cảm đến đồng bào..."
                        value={donationMessage}
                        onChange={(e) => setDonationMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateCertificate}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-2xl text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      TẠO GIẤY CHỨNG NHẬN TẤM LÒNG VÀNG SỐ
                    </button>
                  </div>
                </div>

                {/* Right Column: Dynamic VietQR & E-Certificate Preview */}
                <div className="lg:col-span-6 space-y-4">
                  
                  {/* VietQR Quick Scan Box */}
                  <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-5 rounded-3xl border border-blue-900 shadow-xl space-y-4 text-center">
                    <div className="flex items-center justify-between text-xs border-b border-blue-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-amber-400" />
                        <span className="font-bold">AGRIBANK - CHI NHÁNH CHÁNH HIỆP</span>
                      </div>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30 font-bold">
                        VIETQR 24/7
                      </span>
                    </div>

                    {/* QR Code Container */}
                    <div className="bg-white p-3 rounded-2xl inline-block shadow-lg mx-auto">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          `2|99|AGRIBANK|MTTQ_CHANHHIEP|${customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) : donationAmount}|${donorName || 'UngHoAnSinh'}`
                        )}`}
                        alt="Mã QR Chuyển khoản ủng hộ"
                        className="w-36 h-36 sm:w-44 sm:h-44 object-contain mx-auto"
                      />
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="text-slate-300 font-medium">Tên tài khoản: <strong className="text-white">ỦY BAN MTTQ VIỆT NAM PHƯỜNG CHÁNH HIỆP</strong></p>
                      <p className="text-slate-300 font-medium">Số tài khoản: <strong className="text-cyan-300 font-mono text-sm">5500 201 099 888</strong></p>
                      <p className="text-slate-300 font-medium">
                        Số tiền: <strong className="text-amber-300 font-bold text-base">
                          {(customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) || 0 : donationAmount).toLocaleString('vi-VN')} VNĐ
                        </strong>
                      </p>
                      <p className="text-[11px] text-blue-200/80 font-mono">
                        Nội dung: MTTQ {donationFund === 'POOR_FUND' ? 'VI NGUOI NGHEO' : 'AN SINH'} {donorName.replace(/[^a-zA-Z0-9 ]/g, '') || 'CH'}
                      </p>
                    </div>
                  </div>

                  {/* Generated E-Certificate Card Preview */}
                  {generatedCertificate && (
                    <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50 p-5 rounded-3xl border-2 border-amber-400 shadow-xl space-y-3 relative overflow-hidden animate-fadeIn">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="text-center space-y-1">
                        <span className="text-[10px] font-black text-red-700 tracking-widest uppercase">ỦY BAN MẶT TRẬN TỔ QUỐC VIỆT NAM PHƯỜNG CHÁNH HIỆP</span>
                        <h4 className="text-base sm:text-lg font-black text-amber-900 uppercase font-serif">GIẤY CHỨNG NHẬN TẤM LÒNG VÀNG</h4>
                        <p className="text-[10px] italic text-slate-500">Mã định danh ghi nhận: {generatedCertificate.receiptNumber}</p>
                      </div>

                      <div className="text-center py-2 space-y-1.5 border-y border-amber-200">
                        <p className="text-xs text-slate-600">Trân trọng tri ân và ghi nhận tấm lòng vàng của:</p>
                        <h5 className="text-base font-black text-blue-900">{generatedCertificate.donorName}</h5>
                        <p className="text-xs text-slate-700">
                          Đã ủng hộ số tiền: <strong className="text-red-700 font-black text-sm">{generatedCertificate.amount.toLocaleString('vi-VN')} VNĐ</strong>
                        </p>
                        <p className="text-[11px] text-slate-600 italic">
                          Đóng góp vào: {getFundLabel(generatedCertificate.fundType)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <div>
                          <span>Chánh Hiệp, {new Date().toLocaleDateString('vi-VN')}</span>
                          <p className="font-bold text-slate-700">BAN THƯỜNG TRỰC MTTQ</p>
                        </div>
                        <div className="w-14 h-14 rounded-full border-2 border-red-600/60 bg-red-50 flex items-center justify-center text-[9px] font-black text-red-700 text-center leading-tight">
                          ĐÃ KÝ<br />SỐ MTTQ
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => window.print()}
                          className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          In / Lưu PDF
                        </button>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: SOLIDARITY FAMILY HANDBOOK */}
          {/* ========================================================================= */}
          {activeTab === 'solidarity_handbook' && (
            <div className="space-y-6">
              
              {/* Intro Banner */}
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
                <Award className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-900 space-y-1">
                  <p className="font-bold">BẢNG TỰ ĐÁNH GIÁ 10 TIÊU CHÍ "GIA ĐÌNH ĐẠI ĐOÀN KẾT - KHU PHỐ VĂN HÓA"</p>
                  <p>Thực hiện Cuộc vận động <em>"Toàn dân đoàn kết xây dựng nông thôn mới, đô thị văn minh"</em> năm 2026. Thang điểm tối đa: 100 điểm.</p>
                </div>
              </div>

              {!assessmentSubmitted ? (
                <form onSubmit={handleSubmitAssessment} className="space-y-6">
                  
                  {/* Household Info */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-700">Thông tin Hộ gia đình tự chấm điểm:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Họ tên Chủ hộ *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Trần Văn C"
                          value={familyHead}
                          onChange={(e) => setFamilyHead(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Số điện thoại *</label>
                        <input
                          type="tel"
                          required
                          placeholder="09xx xxx xxx"
                          value={familyPhone}
                          onChange={(e) => setFamilyPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Khu phố *</label>
                        <select
                          value={familyNeighborhood}
                          onChange={(e) => setFamilyNeighborhood(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                          {Array.from({ length: 21 }, (_, i) => (
                            <option key={i + 1} value={`Khu phố ${i + 1}`}>Khu phố {i + 1}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-600 block mb-1">Số nhân khẩu</label>
                        <input
                          type="number"
                          min="1"
                          max="15"
                          value={familyMembersCount}
                          onChange={(e) => setFamilyMembersCount(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Địa chỉ cụ thể *</label>
                      <input
                        type="text"
                        required
                        placeholder="Số nhà, hẻm, đường tại Phường Chánh Hiệp..."
                        value={familyAddress}
                        onChange={(e) => setFamilyAddress(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* 10 Criteria Interactive Rating */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase text-slate-700">10 Tiêu chí tự chấm điểm (Thang 10 điểm / tiêu chí):</h4>
                    
                    <div className="space-y-3">
                      {solidarityCriteria.map((crit, idx) => {
                        const currentScore = criteriaScores[crit.id] ?? 10;
                        return (
                          <div key={crit.id} className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <h5 className="text-xs font-black text-slate-800">{crit.title}</h5>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                  {currentScore} / 10 điểm
                                </span>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500">{crit.desc}</p>
                            
                            {/* Score Selector */}
                            <div className="flex items-center gap-1.5 pt-1">
                              {[6, 7, 8, 9, 10].map((sc) => (
                                <button
                                  key={sc}
                                  type="button"
                                  onClick={() => setCriteriaScores(prev => ({ ...prev, [crit.id]: sc }))}
                                  className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    currentScore === sc
                                      ? 'bg-emerald-600 text-white shadow-2xs'
                                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                  }`}
                                >
                                  {sc} đ
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total Score Summary Bar */}
                  <div className="sticky bottom-0 bg-white p-4 rounded-2xl border-2 border-emerald-400 shadow-lg flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                        {totalSolidarityScore}
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase">TỔNG ĐIỂM TỰ ĐÁNH GIÁ</span>
                        <h4 className={`text-xs font-black px-2 py-0.5 rounded-md border inline-block ${getSolidarityRating(totalSolidarityScore).color}`}>
                          {getSolidarityRating(totalSolidarityScore).label}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      GỬI BẢN TỰ ĐÁNH GIÁ LÊN BAN CTMT KHU PHỐ
                    </button>
                  </div>

                </form>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-4 text-center animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-8 h-8 text-amber-300" />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider">ĐÃ NỘP BẢN ĐĂNG KÝ BÌNH XÉT</span>
                    <h3 className="text-lg font-black text-slate-900 mt-1">Gia đình ông/bà {assessmentSubmitted.headOfHousehold}</h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                      Tổng điểm tự chấm: <strong>{assessmentSubmitted.totalScore}/100 điểm</strong> – Xếp loại: <strong>{getSolidarityRating(assessmentSubmitted.totalScore).label}</strong>.
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 inline-block text-left text-xs space-y-1 max-w-sm w-full mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Mã hồ sơ bình xét:</span>
                      <strong className="text-blue-700 font-mono">{assessmentSubmitted.registrationCode}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Khu phố:</span>
                      <strong className="text-slate-800">{assessmentSubmitted.neighborhood}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Ngày đăng ký:</span>
                      <strong className="text-slate-800">{new Date(assessmentSubmitted.submittedAt).toLocaleDateString('vi-VN')}</strong>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setAssessmentSubmitted(null)}
                      className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      Đánh giá lại
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp – Phục vụ nhân dân</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition cursor-pointer"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
