import React, { useState, useMemo } from 'react';
import { 
  Phone, 
  Mail, 
  Search, 
  MapPin, 
  UserCheck, 
  Shield, 
  ExternalLink, 
  X, 
  Building, 
  MessageCircle, 
  Copy, 
  Check, 
  ShieldAlert, 
  Activity, 
  Flame, 
  Radio, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { OFFICIAL_21_NEIGHBORHOODS } from '../data/neighborhoodsList';
import { AppStorageEngine } from '../lib/storage';

export interface ContactItem {
  id: string;
  name: string;
  position: string;
  unit: string;
  phone: string;
  email?: string;
  zalo?: string;
  category: 'EMERGENCY' | 'BOARD' | 'NEIGHBORHOOD' | 'ORGANIZATION';
  badgeColor?: string;
}

const EMERGENCY_CONTACTS: ContactItem[] = [
  {
    id: 'em-1',
    name: 'Trực ban Công an Phường Chánh Hiệp',
    position: 'Trực ban 24/7',
    unit: 'Công an Phường Chánh Hiệp',
    phone: '0274.3822.456',
    category: 'EMERGENCY',
    badgeColor: 'bg-red-600 text-white'
  },
  {
    id: 'em-2',
    name: 'Trực ban Thường trực Ủy ban MTTQ',
    position: 'Đường dây nóng Dân nguyện',
    unit: 'Ủy ban MTTQ Phường Chánh Hiệp',
    phone: '0274.3822.123',
    category: 'EMERGENCY',
    badgeColor: 'bg-blue-600 text-white'
  },
  {
    id: 'em-3',
    name: 'Trạm Y tế Phường Chánh Hiệp',
    position: 'Cấp cứu & Dịch bệnh',
    unit: 'Trạm Y tế Phường Chánh Hiệp',
    phone: '0274.3833.789',
    category: 'EMERGENCY',
    badgeColor: 'bg-emerald-600 text-white'
  },
  {
    id: 'em-4',
    name: 'Tổng đài Cảnh sát PCCC & Cứu nạn cứu hộ',
    position: 'Khẩn cấp Quốc gia',
    unit: 'Công an TP. Thủ Dầu Một',
    phone: '114',
    category: 'EMERGENCY',
    badgeColor: 'bg-amber-600 text-white'
  },
  {
    id: 'em-5',
    name: 'Tổng đài Cấp cứu Y tế 115',
    position: 'Cấp cứu ngoại viện',
    unit: 'Bệnh viện Đa khoa Tỉnh Bình Dương',
    phone: '115',
    category: 'EMERGENCY',
    badgeColor: 'bg-rose-600 text-white'
  }
];

const STATIC_DIRECTORY_DATA: ContactItem[] = [
  // Ban Thường trực
  { id: '1', name: 'Nguyễn Văn Minh', position: 'Chủ tịch Ủy ban MTTQ', unit: 'Thường trực MTTQ Phường', phone: '0912.345.678', email: 'mttq.chanhhiep@hochiminhcity.gov.vn', category: 'BOARD' },
  { id: '2', name: 'Trần Thị Thu Thảo', position: 'Phó Chủ tịch Thường trực', unit: 'Thường trực MTTQ Phường', phone: '0988.765.432', email: 'thaott.mttq@hochiminhcity.gov.vn', category: 'BOARD' },
  { id: '3', name: 'Lê Hoàng Nam', position: 'Ủy viên BTT - Trưởng Ban Dân nguyện', unit: 'Thường trực MTTQ Phường', phone: '0903.112.233', email: 'namlh.mttq@hochiminhcity.gov.vn', category: 'BOARD' },

  // Trưởng Ban Công tác Mặt trận 21 khu phố
  ...OFFICIAL_21_NEIGHBORHOODS.map(n => ({
    id: `kp_${n.index}`,
    name: n.leaderName,
    position: n.leaderPosition,
    unit: `Khu phố ${n.name}`,
    phone: n.phone,
    category: 'NEIGHBORHOOD' as const
  }))
];

interface DigitalDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalDirectoryModal: React.FC<DigitalDirectoryModalProps> = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'EMERGENCY' | 'BOARD' | 'NEIGHBORHOOD' | 'ORGANIZATION'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const directoryData = useMemo<ContactItem[]>(() => {
    const memberOrgs = AppStorageEngine.getMemberOrganizations();
    const dynamicOrgContacts: ContactItem[] = memberOrgs.map(org => ({
      id: org.id,
      name: org.leaderName || org.name,
      position: org.leaderPosition || 'Lãnh đạo đơn vị',
      unit: org.shortName || org.name,
      phone: org.phone || '',
      email: org.email || '',
      category: 'ORGANIZATION' as const
    }));

    return [...EMERGENCY_CONTACTS, ...STATIC_DIRECTORY_DATA, ...dynamicOrgContacts];
  }, []);

  if (!isOpen) return null;

  const handleCopyPhone = (phone: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(phone.replace(/\./g, ''));
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filtered = directoryData.filter((item) => {
    const matchesTab = selectedTab === 'ALL' || item.category === selectedTab;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.unit.toLowerCase().includes(q) ||
      item.position.toLowerCase().includes(q) ||
      item.phone.includes(q);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto space-y-4 p-5 sm:p-7 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl border border-blue-200 shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  HỆ THỐNG DANH BẠ SỐ
                </span>
                <span className="text-[10px] font-bold text-slate-500">Khẩn cấp 24/7 &amp; 21 Khu phố Chánh Hiệp</span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                Danh bạ Số Khẩn cấp &amp; Liên lạc Mặt trận 21 Khu phố
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Tìm theo tên cán bộ, khu phố (1-21), cơ quan hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'EMERGENCY', label: '🚨 Khẩn cấp 24/7' },
              { id: 'BOARD', label: 'Thường trực MTTQ' },
              { id: 'NEIGHBORHOOD', label: '21 Khu phố' },
              { id: 'ORGANIZATION', label: 'Tổ chức thành viên' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer text-xs ${
                  selectedTab === tab.id
                    ? 'bg-[#0068ff] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact List Grid */}
        <div className="max-h-[420px] overflow-y-auto space-y-2 pr-1">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-xs">
              Không tìm thấy danh bạ phù hợp với từ khóa tìm kiếm.
            </div>
          ) : (
            filtered.map((contact) => (
              <div
                key={contact.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  contact.category === 'EMERGENCY'
                    ? 'bg-red-50/40 border-red-200 hover:bg-red-50/80'
                    : 'bg-slate-50/80 border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-2xl border font-black flex items-center justify-center shrink-0 shadow-2xs ${
                    contact.category === 'EMERGENCY'
                      ? 'bg-red-600 text-white border-red-500'
                      : 'bg-white text-blue-700 border-slate-200'
                  }`}>
                    {contact.category === 'EMERGENCY' ? <ShieldAlert className="w-5 h-5" /> : contact.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-xs font-black text-slate-900 truncate">{contact.name}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.2 rounded-md ${
                        contact.category === 'EMERGENCY'
                          ? 'bg-red-600 text-white'
                          : contact.category === 'BOARD' 
                            ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                            : contact.category === 'NEIGHBORHOOD' 
                              ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                              : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {contact.position}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{contact.unit}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Call / Copy */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleCopyPhone(contact.phone, contact.id)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 transition cursor-pointer"
                    title="Sao chép số điện thoại"
                  >
                    {copiedId === contact.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <a
                    href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-xs ${
                      contact.category === 'EMERGENCY'
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{contact.phone}</span>
                  </a>

                  {contact.category !== 'EMERGENCY' && (
                    <a
                      href={`https://zalo.me/${contact.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs flex items-center gap-1 transition"
                      title="Mở nhắn tin Zalo"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Zalo</span>
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-blue-900 font-medium">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Đường dây nóng Thường trực MTTQ Phường Chánh Hiệp: <strong>0274.3822.123</strong></span>
          </div>
          <span className="text-slate-600">Trực ban 24/7 tiếp nhận &amp; giải quyết phản ánh</span>
        </div>
      </div>
    </div>
  );
};
