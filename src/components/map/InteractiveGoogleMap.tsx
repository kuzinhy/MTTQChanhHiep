import React, { useEffect, useRef, useState } from 'react';
import {
  Layers,
  MapPin,
  Navigation,
  Compass,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Phone,
  Clock,
  HeartHandshake,
  ShieldCheck,
  Building2,
  Sparkles,
  Share2,
  Info
} from 'lucide-react';
import { MapLocation, NeighborhoodGIS, MapCategory, MapLayerConfig } from '../../data/mapSchema';
import { generateGoogleMapsDirectionsUrl, formatDistance } from '../../utils/geoUtils';

// Leaflet dynamic type import
import L from 'leaflet';

interface InteractiveGoogleMapProps {
  locations: MapLocation[];
  neighborhoods: NeighborhoodGIS[];
  categories: MapCategory[];
  layerConfig: MapLayerConfig;
  activeLocation: MapLocation | null;
  activeNeighborhood: NeighborhoodGIS | null;
  userCoords: { latitude: number; longitude: number } | null;
  onSelectLocation: (loc: MapLocation) => void;
  onSelectNeighborhood: (nh: NeighborhoodGIS) => void;
  onOpenDetailModal: (loc: MapLocation) => void;
  onOpenNeighborhoodModal: (nh: NeighborhoodGIS) => void;
}

// Helper function to safely escape HTML special characters
function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const InteractiveGoogleMap: React.FC<InteractiveGoogleMapProps> = ({
  locations,
  neighborhoods,
  categories,
  layerConfig,
  activeLocation,
  activeNeighborhood,
  userCoords,
  onSelectLocation,
  onSelectNeighborhood,
  onOpenDetailModal,
  onOpenNeighborhoodModal
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const neighborhoodLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Map tile style state
  // 'carto-voyager' | 'esri-satellite' | 'osm'
  const [mapStyle, setMapStyle] = useState<'carto-voyager' | 'esri-satellite' | 'osm'>('carto-voyager');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [mapZoom, setMapZoom] = useState<number>(14);

  // Tile layer instance ref
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Define tile URLs (100% Free & Open Source, 0 API Keys required)
  const getTileUrl = (style: string) => {
    switch (style) {
      case 'carto-voyager':
        return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
      case 'esri-satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'osm':
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  const getTileAttribution = (style: string) => {
    switch (style) {
      case 'carto-voyager':
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';
      case 'esri-satellite':
        return 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
      case 'osm':
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Chánh Hiệp Ward, HCMC (~11.018, 106.653)
      const initialLat = 11.018;
      const initialLng = 106.653;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: false, // We render modern custom zoom controls
        attributionControl: false
      });

      // Add Tile Layer
      const tile = L.tileLayer(getTileUrl('carto-voyager'), {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: getTileAttribution('carto-voyager')
      }).addTo(map);

      tileLayerRef.current = tile;

      // Add Layer Groups
      const nhGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);

      neighborhoodLayerGroupRef.current = nhGroup;
      markersLayerGroupRef.current = markersGroup;
      mapInstanceRef.current = map;

      map.on('zoomend', () => {
        setMapZoom(map.getZoom());
      });
    }

    return () => {
      // cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Update Tile Layer on Style Change
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);

    const newTile = L.tileLayer(getTileUrl(mapStyle), {
      maxZoom: 20,
      subdomains: mapStyle.startsWith('google') ? ['mt0', 'mt1', 'mt2', 'mt3'] : ['a', 'b', 'c'],
      attribution: getTileAttribution(mapStyle)
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [mapStyle]);

  // 3. Render 21 Neighborhood Polygons & Boundary Centroids
  useEffect(() => {
    if (!neighborhoodLayerGroupRef.current || !mapInstanceRef.current) return;

    neighborhoodLayerGroupRef.current.clearLayers();

    if (!layerConfig.show_neighborhood_boundaries) return;

    neighborhoods.forEach((nh) => {
      const isSelected = activeNeighborhood?.id === nh.id;

      // Create boundary circle/polygon representation
      const circle = L.circle([nh.center_lat, nh.center_lng], {
        radius: 360,
        color: isSelected ? '#EF4444' : '#3B82F6',
        weight: isSelected ? 3 : 1.5,
        fillColor: isSelected ? '#DC2626' : '#2563EB',
        fillOpacity: isSelected ? 0.25 : 0.08,
        dashArray: isSelected ? undefined : '5, 5'
      });

      // Label Icon
      const labelIcon = L.divIcon({
        className: 'nh-label-marker',
        html: `
          <div class="px-2 py-0.5 rounded-full text-[10px] font-black shadow-md border flex items-center gap-1 cursor-pointer transition-transform hover:scale-110 ${
            isSelected
              ? 'bg-red-600 text-white border-amber-300 ring-2 ring-red-400/40'
              : 'bg-white/95 text-slate-800 border-slate-300 hover:bg-blue-50 hover:text-blue-700'
          }">
            <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-amber-300 animate-ping' : 'bg-blue-600'}"></span>
            <span>${nh.code}</span>
          </div>
        `,
        iconSize: [60, 24],
        iconAnchor: [30, 12]
      });

      const labelMarker = L.marker([nh.center_lat, nh.center_lng], { icon: labelIcon });

      labelMarker.on('click', () => {
        onSelectNeighborhood(nh);
        mapInstanceRef.current?.flyTo([nh.center_lat, nh.center_lng], 16, { duration: 0.8 });
      });

      circle.on('click', () => {
        onSelectNeighborhood(nh);
        mapInstanceRef.current?.flyTo([nh.center_lat, nh.center_lng], 16, { duration: 0.8 });
      });

      neighborhoodLayerGroupRef.current?.addLayer(circle);
      neighborhoodLayerGroupRef.current?.addLayer(labelMarker);
    });
  }, [neighborhoods, activeNeighborhood, layerConfig.show_neighborhood_boundaries]);

  // 4. Render Location Markers with Custom SVG Icons & Interactive Popups
  useEffect(() => {
    if (!markersLayerGroupRef.current || !mapInstanceRef.current) return;

    markersLayerGroupRef.current.clearLayers();

    locations.forEach((loc) => {
      // Check category layer filters
      if (loc.category_code === 'CO_QUAN' && !layerConfig.show_administrative_offices) return;
      if (loc.category_code === 'TO_CHUC' && !layerConfig.show_mttq_organizations) return;
      if (loc.category_code === 'AN_SINH' && !layerConfig.show_welfare_points) return;
      if (loc.category_code === 'Y_TE' && !layerConfig.show_medical_facilities) return;
      if (loc.category_code === 'GIAO_DUC' && !layerConfig.show_education_schools) return;
      if (loc.category_code === 'TRU_SO_KP' && !layerConfig.show_community_centers) return;
      if (loc.category_code === 'TON_GIAO' && !layerConfig.show_religious_sites) return;
      if (loc.category_code === 'DICH_VU_CONG' && !layerConfig.show_public_services) return;

      const isSelected = activeLocation?.id === loc.id;
      const cat = categories.find(c => c.id === loc.category_id);
      const markerColor = cat?.color || '#DC2626';

      // Custom Modern Blue Google Map Style Pin
      const getCategorySvgIcon = (code: string) => {
        switch (code) {
          case 'CO_QUAN':
            return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
          case 'AN_SINH':
            return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`;
          case 'Y_TE':
            return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4a2 2 0 0 0-2 2v2c0 1.1.9 2 2 2h5v5c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-5h5a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-5V4a2 2 0 0 0-2-2h-2z"/></svg>`;
          case 'GIAO_DUC':
            return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`;
          case 'TRU_SO_KP':
            return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
          case 'TON_GIAO':
            return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12"/><path d="M8 10h8"/></svg>`;
          case 'TO_CHUC':
            return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
          default:
            return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
        }
      };

      const customIcon = L.divIcon({
        className: 'custom-google-pin',
        html: `
          <div class="group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
            isSelected ? 'scale-125 z-50' : 'hover:scale-115 z-20'
          }">
            <!-- Elegant Blue Teardrop Pin Marker -->
            <div class="relative flex flex-col items-center">
              <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-xl border-2 text-white relative transition-all duration-300 ${
                isSelected
                  ? 'bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-400 border-amber-300 ring-4 ring-blue-500/40 shadow-blue-600/60 scale-105'
                  : 'bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 border-white/90 shadow-blue-900/50 hover:from-blue-600 hover:to-cyan-400'
              }">
                ${getCategorySvgIcon(loc.category_code)}
                ${loc.is_featured ? '<span class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 font-black rounded-full border border-white flex items-center justify-center text-[8px] shadow-sm">★</span>' : ''}
              </div>
              
              <!-- Teardrop Bottom Triangle Tip in Blue -->
              <div class="w-2.5 h-2.5 bg-blue-700 rotate-45 -mt-1.5 border-r border-b border-white/60 shadow-md"></div>
            </div>

            <!-- Crisp Location Label -->
            <div class="mt-1 px-2.5 py-0.5 rounded-full text-[9px] font-black max-w-[130px] truncate shadow-md text-center border transition-all ${
              isSelected
                ? 'bg-blue-600 text-white border-blue-300 ring-2 ring-blue-400/50 shadow-blue-500/30'
                : 'bg-white text-slate-800 border-slate-300 backdrop-blur-sm group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-400'
            }">
              ${escapeHtml(loc.name)}
            </div>
          </div>
        `,
        iconSize: [44, 54],
        iconAnchor: [22, 50],
        popupAnchor: [0, -46]
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });

      // Build Rich Interactive InfoWindow Popup
      const directionsUrl = generateGoogleMapsDirectionsUrl(loc.latitude, loc.longitude);
      const phoneNum = loc.phone?.trim();
      const openingHoursStr = loc.opening_hours?.trim() || '07:30 - 11:30 | 13:30 - 17:00 (Thứ 2 - Thứ 6)';
      const safeCategoryName = escapeHtml(cat?.name?.split('&')[0]?.trim() || 'Cơ sở');
      const safeNeighborhoodName = loc.neighborhood_name ? escapeHtml(loc.neighborhood_name) : '';
      const safeName = escapeHtml(loc.name);
      const safeAddress = escapeHtml(loc.address);
      const safeHours = escapeHtml(openingHoursStr);
      const safePhone = phoneNum ? escapeHtml(phoneNum) : '';
      const safeEmail = loc.email ? escapeHtml(loc.email.trim()) : '';
      const safeDesc = loc.description ? escapeHtml(loc.description.trim()) : '';

      const popupContent = `
        <div class="p-1.5 font-sans w-[270px] sm:w-[290px] space-y-2 text-slate-800">
          <!-- Header Badges -->
          <div class="flex items-center justify-between gap-1 flex-wrap">
            <div class="flex items-center gap-1 flex-wrap">
              <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                ${safeCategoryName}
              </span>
              ${safeNeighborhoodName ? `<span class="text-[9px] font-bold bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 border border-slate-200">${safeNeighborhoodName}</span>` : ''}
            </div>
            ${loc.is_featured ? '<span class="text-[9px] font-black bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">★ Trọng điểm</span>' : ''}
          </div>

          <!-- Location Name -->
          <h3 class="font-black text-xs sm:text-sm text-slate-900 leading-snug">
            ${safeName}
          </h3>

          <!-- Address -->
          <div class="text-[11px] text-slate-600 flex items-start gap-1 leading-snug">
            <span class="shrink-0">📍</span>
            <span class="line-clamp-2">${safeAddress}</span>
          </div>

          <!-- Rich Information Grid: Hours & Phone -->
          <div class="space-y-1.5 pt-1.5 border-t border-slate-100">
            <!-- Operating Hours Card -->
            <div class="p-1.5 rounded-lg bg-emerald-50/90 border border-emerald-200/90 text-[10.5px]">
              <div class="font-black text-emerald-900 flex items-center gap-1">
                <span>🕒</span>
                <span>Giờ làm việc / Mở cửa:</span>
              </div>
              <div class="text-emerald-950 font-bold pl-4 mt-0.5">
                ${safeHours}
              </div>
            </div>

            <!-- Contact Phone Number & Email -->
            <div class="p-1.5 rounded-lg bg-blue-50/90 border border-blue-200/90 text-[10.5px] space-y-0.5">
              <div class="font-black text-blue-900 flex items-center justify-between gap-1">
                <span class="flex items-center gap-1">
                  <span>📞</span>
                  <span>SĐT liên hệ:</span>
                </span>
                ${safePhone ? `<a href="tel:${safePhone}" class="text-blue-700 font-extrabold hover:underline">${safePhone}</a>` : '<span class="text-slate-500 font-normal">Đang cập nhật</span>'}
              </div>
              ${safeEmail ? `
                <div class="text-blue-800 font-medium pl-4 truncate text-[10px]">
                  ✉️ <a href="mailto:${safeEmail}" class="hover:underline">${safeEmail}</a>
                </div>
              ` : ''}
            </div>
          </div>

          ${safeDesc ? `
            <div class="bg-amber-50/80 border border-amber-200/80 rounded-lg p-1.5 text-[10px] text-amber-950 font-medium line-clamp-2">
              ℹ️ ${safeDesc}
            </div>
          ` : ''}

          <!-- Direct Action Buttons Bar -->
          <div class="pt-2 border-t border-slate-200 grid grid-cols-3 gap-1">
            ${phoneNum ? `
              <a 
                href="tel:${phoneNum}" 
                class="px-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-colors shadow-xs"
                title="Gọi điện liên hệ trực tiếp"
              >
                <span>📞</span>
                <span>Liên hệ</span>
              </a>
            ` : `
              <button 
                id="btn-detail-direct-${loc.id}"
                class="px-2 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Xem thông tin liên hệ"
              >
                <span>📞</span>
                <span>Liên hệ</span>
              </button>
            `}

            <a 
              href="${directionsUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-2 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-colors shadow-xs"
              title="Chỉ đường Google Maps"
            >
              <span>🧭</span>
              <span>Chỉ đường</span>
            </a>

            <button 
              id="btn-detail-${loc.id}"
              class="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-black flex items-center justify-center gap-1 transition-colors cursor-pointer"
              title="Xem chi tiết đầy đủ"
            >
              <span>👁️</span>
              <span>Chi tiết</span>
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 320, className: 'modern-leaflet-popup' });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      marker.on('popupopen', () => {
        // Wire up popup detail click handlers
        const btn = document.getElementById(`btn-detail-${loc.id}`);
        if (btn) {
          btn.onclick = () => {
            onOpenDetailModal(loc);
          };
        }

        const btnDirect = document.getElementById(`btn-detail-direct-${loc.id}`);
        if (btnDirect) {
          btnDirect.onclick = () => {
            onOpenDetailModal(loc);
          };
        }
      });

      markersLayerGroupRef.current?.addLayer(marker);
    });
  }, [locations, activeLocation, categories, layerConfig]);

  // 5. Render User GPS Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (userCoords) {
      if (userMarkerRef.current) {
        mapInstanceRef.current.removeLayer(userMarkerRef.current);
      }

      const userIcon = L.divIcon({
        className: 'user-gps-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-6 h-6 rounded-full bg-blue-500/30 animate-ping absolute"></div>
            <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg relative z-10 flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
            </div>
            <div class="absolute -bottom-5 bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-md whitespace-nowrap">
              Vị trí của bạn
            </div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([userCoords.latitude, userCoords.longitude], { icon: userIcon }).addTo(mapInstanceRef.current);
      userMarkerRef.current = marker;
    } else if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
  }, [userCoords]);

  // 6. Fly to Active Location or Neighborhood
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (activeLocation) {
      mapInstanceRef.current.flyTo([activeLocation.latitude, activeLocation.longitude], 17, {
        duration: 0.9
      });
    }
  }, [activeLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (activeNeighborhood && !activeLocation) {
      mapInstanceRef.current.flyTo([activeNeighborhood.center_lat, activeNeighborhood.center_lng], 15.5, {
        duration: 0.8
      });
    }
  }, [activeNeighborhood]);

  // Helper Controls
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterWard = () => {
    mapInstanceRef.current?.flyTo([11.018, 106.653], 14, { duration: 0.8 });
  };

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;
    if (!document.fullscreenElement) {
      mapContainerRef.current.parentElement?.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  return (
    <div className={`relative w-full h-full bg-slate-100 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* 1. Leaflet / Google Maps Canvas Element */}
      <div
        id="interactive-gis-map-canvas"
        ref={mapContainerRef}
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing"
      />

      {/* 2. Top-Left Floating Map Style Switcher (Carto Voyager vs Esri Satellite vs OpenStreetMap) */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200">
        <button
          onClick={() => setMapStyle('carto-voyager')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
            mapStyle === 'carto-voyager'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Bản đồ chuẩn CartoDB Voyager"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Bản đồ Chuẩn</span>
          <span className="sm:hidden">Chuẩn</span>
        </button>

        <button
          onClick={() => setMapStyle('esri-satellite')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
            mapStyle === 'esri-satellite'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Bản đồ vệ tinh Esri World Imagery"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Vệ tinh Esri</span>
          <span className="sm:hidden">Vệ tinh</span>
        </button>

        <button
          onClick={() => setMapStyle('osm')}
          className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
            mapStyle === 'osm'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Bản đồ mở OpenStreetMap"
        >
          <span className="hidden sm:inline">OpenStreetMap</span>
          <span className="sm:hidden">OSM</span>
        </button>
      </div>

      {/* 3. Top-Right Floating Controls (Center, Fullscreen, External Navigation link) */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
        <button
          onClick={handleCenterWard}
          className="bg-white/95 hover:bg-white text-slate-800 text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
          title="Căn giữa toàn bộ Phường Chánh Hiệp"
        >
          <Navigation className="w-3.5 h-3.5 text-red-600" />
          <span className="hidden sm:inline">Về Chánh Hiệp</span>
        </button>

        <a
          href="https://www.google.com/maps/search/Ph%C6%B0%E1%BB%9Dng+Ch%C3%A1nh+Hi%E1%BB%87p+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          title="Mở chỉ đường ngoài app Google Maps"
        >
          <span>Mở Google Maps</span>
          <ExternalLink className="w-3 h-3 text-white" />
        </a>

        <button
          onClick={toggleFullscreen}
          className="bg-white/95 hover:bg-white text-slate-800 p-2 rounded-xl shadow-lg border border-slate-200 transition-all cursor-pointer backdrop-blur-md"
          title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 4. Bottom-Right Modern Zoom Controls (+ / -) */}
      <div className="absolute bottom-6 right-3 z-30 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-lg border border-slate-200">
        <button
          onClick={handleZoomIn}
          className="p-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"
          title="Phóng to"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="h-px bg-slate-200 mx-1"></div>
        <button
          onClick={handleZoomOut}
          className="p-2 text-slate-700 hover:bg-slate-100 hover:text-blue-600 rounded-xl transition-colors cursor-pointer"
          title="Thu nhỏ"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* 5. Bottom-Left Map Coordinate Status Overlay */}
      <div className="absolute bottom-3 left-3 z-30 flex items-center gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md text-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-bold border border-slate-200 shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Bản đồ Số GIS Chánh Hiệp • Zoom {mapZoom} • 21 Khu phố • OpenGIS Layer</span>
        </div>
      </div>
    </div>
  );
};
