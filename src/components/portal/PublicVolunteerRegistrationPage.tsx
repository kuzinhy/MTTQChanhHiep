import React from 'react';
import { VolunteerRegistrationModal } from '../VolunteerRegistrationModal';

export const PublicVolunteerRegistrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header/Back Link */}
        <div className="flex items-center justify-between mb-8">
          <a href="#/trang-chu" className="text-sm font-bold text-blue-700 hover:text-blue-900 transition flex items-center gap-1">
            &larr; Quay lại trang chủ
          </a>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">Đăng ký Tình nguyện viên</h1>
          <p className="text-slate-600">Đồng hành cùng MTTQ Phường Chánh Hiệp trong các hoạt động cộng đồng.</p>
        </div>
        
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100">
          <VolunteerRegistrationModal 
            isOpen={true} 
            onClose={() => window.location.hash = '#/trang-chu'} 
            onSuccess={(title, msg) => alert(`${title}\n${msg}`)} 
          />
        </div>
      </div>
    </div>
  );
};
