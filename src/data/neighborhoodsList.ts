export interface NeighborhoodOfficialInfo {
  index: number;
  id: string;
  name: string;
  leaderName: string;
  leaderPosition: string;
  phone: string;
}

export const OFFICIAL_21_NEIGHBORHOODS: NeighborhoodOfficialInfo[] = [
  { index: 1, id: 'area-kp-1', name: 'Tương Bình Hiệp 1', leaderName: 'Đoàn Thị Bích Vân', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0944.029.851' },
  { index: 2, id: 'area-kp-2', name: 'Tương Bình Hiệp 2', leaderName: 'Lê Thị Thanh Loan', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0933.410.441' },
  { index: 3, id: 'area-kp-3', name: 'Tương Bình Hiệp 3', leaderName: 'Nguyễn Văn An', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0363.763.231' },
  { index: 4, id: 'area-kp-4', name: 'Tương Bình Hiệp 4', leaderName: 'Nguyễn Minh Hoàng', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0948.667.996' },
  { index: 5, id: 'area-kp-5', name: 'Tương Bình Hiệp 5', leaderName: 'Nguyễn Hoài Tân', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0987.720.790' },
  { index: 6, id: 'area-kp-6', name: 'Tương Bình Hiệp 6', leaderName: 'Võ Oanh Kiều', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0706.055.248' },
  { index: 7, id: 'area-kp-7', name: 'Tương Bình Hiệp 7', leaderName: 'Trần Minh Khải', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0888.503.448' },
  { index: 8, id: 'area-kp-8', name: 'Hiệp An 7', leaderName: 'Nguyễn Thanh Trí', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0976.534.508' },
  { index: 9, id: 'area-kp-9', name: 'Hiệp An 8', leaderName: 'Phan Tấn Nhân', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0928.579.957' },
  { index: 10, id: 'area-kp-10', name: 'Hiệp An 9', leaderName: 'Nguyễn Nhật Hồng', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0908.758.565' },
  { index: 11, id: 'area-kp-11', name: 'Định Hòa 1', leaderName: 'Nguyễn Thanh Vân', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0977.137.382' },
  { index: 12, id: 'area-kp-12', name: 'Định Hòa 2', leaderName: 'Nguyễn Phượng Hằng', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0961.880.602' },
  { index: 13, id: 'area-kp-13', name: 'Định Hòa 3', leaderName: 'Đỗ Thị Tấn', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0902.477.692' },
  { index: 14, id: 'area-kp-14', name: 'Định Hòa 4', leaderName: 'Văn Văn Hạnh', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0988.222.362' },
  { index: 15, id: 'area-kp-15', name: 'Định Hòa 5', leaderName: 'Ngô Văn Còn', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0786.752.934' },
  { index: 16, id: 'area-kp-16', name: 'Định Hòa 6', leaderName: 'Nguyễn Văn Gọt', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0943.477.286' },
  { index: 17, id: 'area-kp-17', name: 'Định Hòa 7', leaderName: 'Đặng Thị Thúy Loan', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0983.688.364' },
  { index: 18, id: 'area-kp-18', name: 'Định Hòa 8', leaderName: 'Nguyễn Văn Phụng', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0928.979.677' },
  { index: 19, id: 'area-kp-19', name: 'Mỹ Hảo', leaderName: 'Nguyễn Văn Hòa', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0989.114.005' },
  { index: 20, id: 'area-kp-20', name: 'Chánh Mỹ 1', leaderName: 'Đặng Mỹ Dung', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0843.413.153' },
  { index: 21, id: 'area-kp-21', name: 'Chánh Mỹ 2', leaderName: 'Bùi Thị Thu Thảo', leaderPosition: 'Trưởng Ban Công tác Mặt trận', phone: '0834.789.870' },
];

export const OFFICIAL_NEIGHBORHOOD_NAMES = OFFICIAL_21_NEIGHBORHOODS.map(n => n.name);
