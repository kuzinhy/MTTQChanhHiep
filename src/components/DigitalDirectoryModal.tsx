import React, { useState, useMemo } from 'react';
import { Phone, Mail, Search, MapPin, UserCheck, Shield, ExternalLink, X, Building, MessageCircle } from 'lucide-react';
import { OFFICIAL_21_NEIGHBORHOODS } from '../data/neighborhoodsList';
import { AppStorageEngine } from '../lib/storage';

interface ContactItem {
  id: string;
  name: string;
  position: string;
  unit: string;
  phone: string;
  email?: string;
  zalo?: string;
  category: 'BOARD' | 'NEIGHBORHOOD' | 'ORGANIZATION';
}

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
  const [selectedTab, setSelectedTab] = useState<'ALL' | 'BOARD' | 'NEIGHBORHOOD' | 'ORGANIZATION'>('ALL');

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

    return [...STATIC_DIRECTORY_DATA, ...dynamicOrgContacts];
  }, []);

  if (!isOpen) return null;

  const filtered = directoryData.filter((item) => {
    const matchesTab = selectedTab === 'ALL' || item.category === selectedTab;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm);
    return matchesTab && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto space-y-4 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl border border-blue-200">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                  TRA CỨU TRỰC TUYẾN
                </span>
                <span className="text-[10px] font-bold text-slate-500">21 Khu phố &amp; Thường trực</span>
              </div>
              <h2 className="text-base font-black text-slate-900 mt-0.5">Danh Bạ Số Liên Lạc Mặt Trận Phường</h2>
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
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo tên cán bộ, khu phố, đơn vị hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-blue-600 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'BOARD', label: 'Thường trực BTT' },
              { id: 'NEIGHBORHOOD', label: '21 Khu phố' },
              { id: 'ORGANIZATION', label: 'Tổ chức thành viên' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedTab === tab.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact List Grid */}
        <div className="max-h-96 overflow-y-auto space-y-2.5 pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Không tìm thấy danh bạ phù hợp với từ khóa tìm kiếm.
            </div>
          ) : (
            filtered.map((contact) => (
              <div
                key={contact.id}
                className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-blue-700 font-black flex items-center justify-center shrink-0 shadow-2xs">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-slate-900">{contact.name}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.2 rounded-md ${
                        contact.category === 'BOARD' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                          : contact.category === 'NEIGHBORHOOD' 
                            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                            : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}>
                        {contact.position}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Building className="w-3 h-3 text-slate-400" />
                      <span>{contact.unit}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <a
                    href={`tel:${contact.phone.replace(/\./g, '')}`}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{contact.phone}</span>
                  </a>
                  <a
                    href={`https://zalo.me/${contact.phone.replace(/\./g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold text-xs flex items-center gap-1 transition"
                    title="Mở Zalo"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Zalo</span>
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between text-[11px] text-blue-900 font-medium">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>Đường dây nóng Thường trực MTTQ Phường: <strong>0274.3822.999</strong></span>
          </div>
          <span className="text-slate-500 hidden sm:inline">Trực 24/7 giải quyết phản ánh</span>
        </div>
      </div>
    </div>
  );
};
