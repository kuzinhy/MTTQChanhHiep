/**
 * MAP DATA SCHEMA & TYPES
 * Phân hệ: Bản Đồ Số An Sinh 21 Khu Phố - Phường Chánh Hiệp
 * Ủy ban Mặt trận Tổ quốc Việt Nam Phường Chánh Hiệp
 */

export type MapLocationStatus = 'ACTIVE' | 'PENDING' | 'HIDDEN';

export type MapCategoryCode = 
  | 'CO_QUAN'       // Trụ sở Đảng ủy, HĐND, UBND, Ủy ban MTTQ, Công an, Quân sự
  | 'TO_CHUC'       // Đoàn Thanh niên, Hội Phụ nữ, Hội CCB, Công đoàn, Ban CTMT
  | 'Y_TE'          // Trạm Y tế, phòng khám, cơ sở y tế, nhà thuốc
  | 'GIAO_DUC'      // Trường mầm non, tiểu học, THCS, THPT
  | 'CONG_DONG'     // Nhà văn hóa, điểm sinh hoạt cộng đồng, văn phòng 21 khu phố, công viên
  | 'AN_SINH'       // Điểm hỗ trợ an sinh, bếp ăn tình thương, điểm phát quà, tiếp nhận nhu yếu phẩm
  | 'TON_GIAO'      // Chùa, nhà thờ, cơ sở tôn giáo hợp pháp
  | 'DICH_VU_CONG'  // Điểm dịch vụ công trực tuyến, bưu điện, hướng dẫn TTHC
  | 'KHAC';

/**
 * Danh mục phân loại địa điểm (map_categories)
 */
export interface MapCategory {
  id: string;
  name: string;
  code: MapCategoryCode | string;
  icon: string;         // Lucide Icon name: 'Building2', 'HeartHandshake', 'Stethoscope', 'GraduationCap', 'Users', 'Church', etc.
  color: string;        // Hex / Tailwind color class for marker badges
  bgBadgeColor?: string;
  textBadgeColor?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Cấu trúc dữ liệu 21 Khu phố (neighborhoods)
 */
export interface NeighborhoodGIS {
  id: string;                      // kp-1 ... kp-21
  code: string;                    // KP01 ... KP21
  name: string;                    // Khu phố 01 ... Khu phố 21
  slug: string;                    // khu-pho-01 ... khu-pho-21
  
  center_lat: number;              // Tọa độ trung tâm (WGS84 Latitude)
  center_lng: number;              // Tọa độ trung tâm (WGS84 Longitude)
  
  boundary_geojson?: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  } | null;

  population?: number;             // Dân số
  households?: number;             // Số hộ gia đình
  
  // Thông tin liên hệ công vụ
  leader_name?: string;            // Trưởng khu phố
  leader_position?: string;        // Chức vụ
  phone?: string;                  // Điện thoại liên hệ
  
  party_cell_secretary?: string;   // Bí thư Chi bộ
  front_work_head?: string;        // Trưởng ban Công tác Mặt trận
  youth_union_secretary?: string;  // Bí thư Chi đoàn
  women_union_head?: string;       // Chi hội trưởng Phụ nữ
  veterans_union_head?: string;    // Chi hội trưởng Cựu chiến binh

  address?: string;                // Địa chỉ Văn phòng Khu phố
  description?: string;            // Tóm tắt đặc điểm địa bàn
  image_url?: string;              // Ảnh đại diện khu phố
  
  status: 'ACTIVE' | 'INACTIVE';
  sort_order: number;
  
  // Tổng hợp số liệu POI phục vụ tra cứu nhanh
  stats?: {
    total_locations: number;
    welfare_points_count: number;
    administrative_points_count: number;
    medical_points_count: number;
    education_points_count: number;
  };

  created_at?: string;
  updated_at?: string;
}

/**
 * Địa điểm trên bản đồ - Point of Interest (map_locations)
 */
export interface MapLocation {
  id: string;
  name: string;
  slug: string;

  category_id: string;             // FK -> MapCategory.id
  category_code?: MapCategoryCode | string;
  category?: MapCategory;

  neighborhood_id?: string;         // FK -> NeighborhoodGIS.id (1 trong 21 khu phố)
  neighborhood_name?: string;
  neighborhood_code?: string;

  address: string;                 // Địa chỉ chi tiết trên địa bàn phường
  
  latitude: number;                // WGS84 Latitude (ví dụ: 11.012345)
  longitude: number;               // WGS84 Longitude (ví dụ: 106.654321)

  description?: string;            // Giới thiệu, chức năng nhiệm vụ, tiện ích

  phone?: string;                  // Số điện thoại liên hệ
  email?: string;                  // Email cơ quan / điểm hỗ trợ
  website?: string;                // Website / Trang liên kết

  opening_hours?: string;          // Giờ làm việc / Giờ mở cửa tiếp dân
  
  image_url?: string;              // Ảnh đại diện chính
  gallery?: string[];              // Bộ sưu tập ảnh địa điểm

  directions_url?: string;         // URL chỉ đường Google Maps trực tiếp

  is_featured: boolean;            // Điểm trọng điểm (nổi bật trên bản đồ)
  is_public: boolean;              // Hiển thị công khai cho nhân dân (True: Public, False: Nội bộ)
  
  // Hỗ trợ đánh dấu loại hình An sinh đặc biệt (Tuân thủ nghiêm ngặt bảo mật dữ liệu)
  welfare_type?: 'FOOD_SUPPORT' | 'EMERGENCY_AID' | 'GIFT_DISTRIBUTION' | 'RECEIVING_POINT' | 'FREE_CLINIC' | 'COMMUNITY_KITCHEN' | 'NONE';

  status: MapLocationStatus;       // Trạng thái hiển thị

  created_by?: string;
  updated_by?: string;

  created_at?: string;
  updated_at?: string;

  // Metadata tính toán động tại client
  distance_in_meters?: number;     // Khoảng cách tính theo Haversine từ vị trí GPS người dùng
}

/**
 * Bộ lọc bản đồ (Map Filter State)
 */
export interface MapFilterState {
  search_query: string;
  category_id: string | 'ALL';
  neighborhood_id: string | 'ALL';
  welfare_only: boolean;
  featured_only: boolean;
  user_coordinates?: {
    latitude: number;
    longitude: number;
  } | null;
  sort_by: 'DEFAULT' | 'DISTANCE' | 'NAME' | 'NEIGHBORHOOD';
}

/**
 * Cấu hình các lớp bản đồ (Map Layer Controls)
 */
export interface MapLayerConfig {
  show_neighborhood_boundaries: boolean;
  show_administrative_offices: boolean;
  show_mttq_organizations: boolean;
  show_medical_facilities: boolean;
  show_education_schools: boolean;
  show_welfare_points: boolean;
  show_community_centers: boolean;
  show_religious_sites: boolean;
  show_public_services: boolean;
}
