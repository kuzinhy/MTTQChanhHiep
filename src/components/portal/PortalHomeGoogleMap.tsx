import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Compass, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Navigation, 
  ExternalLink, 
  MapPin, 
  Phone, 
  Clock, 
  Maximize2,
  Landmark,
  Building2,
  Stethoscope,
  Palette,
  ShieldCheck,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';
import { INITIAL_MAP_LOCATIONS } from '../../data/mapSeedData';
import { MapLocation } from '../../data/mapSchema';

interface PortalHomeGoogleMapProps {
  selectedLocationId?: string | null;
  onSelectLocation?: (location: MapLocation) => void;
  onOpenFullMap?: () => void;
}

export const PortalHomeGoogleMap: React.FC<PortalHomeGoogleMapProps> = ({
  selectedLocationId,
  onSelectLocation,
  onOpenFullMap
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [mapStyle, setMapStyle] = useState<'roadmap' | 'satellite'>('roadmap');
  const [isLocating, setIsLocating] = useState(false);

  // Key locations to display on the home map preview
  const previewLocations = INITIAL_MAP_LOCATIONS.filter(
    loc => loc.is_featured || ['DIA_CHI_DO', 'LANG_NGHE', 'CO_QUAN', 'Y_TE'].includes(loc.category_code)
  ).slice(0, 10);

  // Get Google Maps Tile URLs
  const getGoogleTileUrl = (style: 'roadmap' | 'satellite') => {
    if (style === 'satellite') {
      // Hybrid Satellite (satellite imagery + roads + labels)
      return 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    }
    // Standard Google Roadmap (full street names, Vietnamese labels)
    return 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
  };

  // Helper for category badge color & icon
  const getCategoryColor = (code: string) => {
    switch (code) {
      case 'DIA_CHI_DO':
        return '#DC2626'; // Red
      case 'LANG_NGHE':
        return '#D97706'; // Amber
      case 'CO_QUAN':
        return '#2563EB'; // Blue
      case 'Y_TE':
        return '#059669'; // Emerald
      case 'AN_SINH':
        return '#EA580C'; // Orange
      case 'GIAO_DUC':
        return '#7C3AED'; // Purple
      default:
        return '#0284C7'; // Sky
    }
  };

  const getCategoryIconSvg = (code: string) => {
    switch (code) {
      case 'DIA_CHI_DO':
        return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`;
      case 'LANG_NGHE':
        return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`;
      case 'CO_QUAN':
        return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`;
      case 'Y_TE':
        return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>`;
      default:
        return `<svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
    }
  };

  // 1. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center on Chánh Hiệp Ward, HCMC (~11.0175, 106.652)
      const map = L.map(mapContainerRef.current, {
        center: [11.0175, 106.652],
        zoom: 14.5,
        zoomControl: false,
        attributionControl: false
      });

      // Add Google Maps Tile Layer
      const tile = L.tileLayer(getGoogleTileUrl('roadmap'), {
        maxZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        attribution: '&copy; Google Maps'
      }).addTo(map);

      tileLayerRef.current = tile;

      const markersGroup = L.layerGroup().addTo(map);
      markersGroupRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    // ResizeObserver to handle container layout changes
    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // 2. Handle map style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newTile = L.tileLayer(getGoogleTileUrl(mapStyle), {
      maxZoom: 20,
      subdomains: ['0', '1', '2', '3'],
      attribution: '&copy; Google Maps'
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newTile;
  }, [mapStyle]);

  // 3. Render Google Maps Style Markers
  useEffect(() => {
    if (!markersGroupRef.current || !mapInstanceRef.current) return;

    markersGroupRef.current.clearLayers();

    previewLocations.forEach((loc) => {
      const isSelected = selectedLocationId === loc.id;
      const color = getCategoryColor(loc.category_code);
      const iconSvg = getCategoryIconSvg(loc.category_code);

      // Create Google Maps style pin icon
      const pinIcon = L.divIcon({
        className: 'google-maps-home-pin',
        html: `
          <div class="group relative flex flex-col items-center cursor-pointer transition-transform duration-200 ${
            isSelected ? 'scale-125 z-40' : 'hover:scale-115 z-20'
          }">
            <!-- Pin Body -->
            <div 
              style="background: ${color};" 
              class="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white text-white relative transition-all"
            >
              ${iconSvg}
              ${loc.is_featured ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 text-slate-950 font-black rounded-full border border-white flex items-center justify-center text-[7px] shadow-2xs">★</span>' : ''}
            </div>
            <!-- Pin Point -->
            <div 
              style="background: ${color};" 
              class="w-2.5 h-2.5 rotate-45 -mt-1.5 border-r border-b border-white shadow-xs"
            ></div>
            <!-- Pin Label (Google Style) -->
            <div class="mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold max-w-[110px] truncate shadow-sm text-center border transition-all ${
              isSelected 
                ? 'bg-slate-900 text-white border-slate-700 ring-1 ring-blue-400' 
                : 'bg-white/95 text-slate-800 border-slate-200 group-hover:bg-slate-900 group-hover:text-white'
            }">
              ${loc.name}
            </div>
          </div>
        `,
        iconSize: [40, 52],
        iconAnchor: [20, 48],
        popupAnchor: [0, -44]
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: pinIcon });

      // Directions URL for Google Maps
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`;

      const popupHtml = `
        <div class="p-1 font-sans w-[250px] sm:w-[270px] space-y-1.5 text-slate-800">
          <div class="flex items-center justify-between gap-1">
            <span style="color: ${color};" class="text-[9.5px] font-black uppercase tracking-wide">
              ${loc.category_code === 'DIA_CHI_DO' ? '★ Địa chỉ đỏ' : loc.category_code === 'LANG_NGHE' ? '🪵 Làng nghề' : loc.category_code === 'CO_QUAN' ? '🏛️ Cơ quan' : '🏥 Y tế'}
            </span>
            <span class="text-[9px] text-slate-400 font-medium">Chánh Hiệp</span>
          </div>

          <h4 class="font-black text-xs text-slate-900 leading-snug">
            ${loc.name}
          </h4>

          <div class="text-[11px] text-slate-600 flex items-start gap-1 leading-snug">
            <span class="shrink-0 text-red-500">📍</span>
            <span class="line-clamp-2">${loc.address}</span>
          </div>

          ${loc.phone ? `
            <div class="text-[10.5px] text-blue-700 font-bold flex items-center gap-1">
              <span>📞</span>
              <a href="tel:${loc.phone}" class="hover:underline">${loc.phone}</a>
            </div>
          ` : ''}

          <div class="pt-2 border-t border-slate-100 flex items-center gap-1.5">
            <a 
              href="${directionsUrl}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex-1 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10.5px] font-black flex items-center justify-center gap-1 shadow-xs transition-colors"
            >
              <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <span>Chỉ đường</span>
            </a>
            <button 
              id="home-btn-detail-${loc.id}"
              class="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-[10.5px] font-bold transition-colors cursor-pointer"
            >
              Chi tiết
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 300, className: 'google-maps-popup' });

      marker.on('click', () => {
        if (onSelectLocation) onSelectLocation(loc);
      });

      marker.on('popupopen', () => {
        const detailBtn = document.getElementById(`home-btn-detail-${loc.id}`);
        if (detailBtn && onSelectLocation) {
          detailBtn.onclick = () => onSelectLocation(loc);
        }
      });

      markersGroupRef.current?.addLayer(marker);

      // If selected, pan to it
      if (isSelected && mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 16, { duration: 0.8 });
        marker.openPopup();
      }
    });
  }, [selectedLocationId, previewLocations]);

  // Handle Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 0.8 });

          if (userMarkerRef.current) {
            mapInstanceRef.current.removeLayer(userMarkerRef.current);
          }

          const userIcon = L.divIcon({
            className: 'google-user-pulse',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="w-7 h-7 rounded-full bg-blue-500/30 animate-ping absolute"></div>
                <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md relative z-10"></div>
              </div>
            `,
            iconSize: [28, 28],
            iconAnchor: [14, 14]
          });

          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(mapInstanceRef.current);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleCenterWard = () => {
    mapInstanceRef.current?.flyTo([11.0175, 106.652], 14.5, { duration: 0.8 });
  };

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] bg-slate-100 overflow-hidden select-none">
      {/* 1. Map Canvas */}
      <div 
        ref={mapContainerRef} 
        className="w-full h-full z-0 cursor-grab active:cursor-grabbing" 
      />

      {/* 2. Top-Left Google Maps Type Toggle (Bản đồ / Vệ tinh) */}
      <div className="absolute top-3 left-3 z-30 flex items-center bg-white/95 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200">
        <button
          onClick={() => setMapStyle('roadmap')}
          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            mapStyle === 'roadmap'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Bản đồ Google Maps chuẩn"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Bản đồ</span>
        </button>
        <button
          onClick={() => setMapStyle('satellite')}
          className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
            mapStyle === 'satellite'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
          title="Bản đồ ảnh vệ tinh Google kết hợp đường sá"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Vệ tinh</span>
        </button>
      </div>

      {/* 3. Top-Right Actions: Center Ward & Open Full Map */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
        <button
          onClick={handleCenterWard}
          className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-xs font-black shadow-md border border-slate-200 flex items-center gap-1.5 transition cursor-pointer backdrop-blur-md"
          title="Căn giữa Phường Chánh Hiệp"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Chánh Hiệp</span>
        </button>

        {onOpenFullMap && (
          <button
            onClick={onOpenFullMap}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition cursor-pointer"
            title="Mở toàn màn hình bản đồ số 21 khu phố"
          >
            <Maximize2 className="w-3.5 h-3.5 text-white" />
            <span className="hidden xs:inline">Bản đồ số</span>
          </button>
        )}
      </div>

      {/* 4. Bottom-Right Controls: Zoom & GPS */}
      <div className="absolute bottom-4 right-3 z-30 flex flex-col gap-1.5">
        <button
          onClick={handleLocateMe}
          className="w-8 h-8 rounded-xl bg-white/95 hover:bg-white text-slate-800 flex items-center justify-center shadow-md border border-slate-200 transition cursor-pointer"
          title="Định vị vị trí của bạn"
        >
          <Navigation className={`w-4 h-4 ${isLocating ? 'text-blue-600 animate-spin' : 'text-slate-700'}`} />
        </button>

        <div className="flex flex-col bg-white/95 rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors border-b border-slate-100 cursor-pointer"
            title="Phóng to"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Thu nhỏ"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 5. Google Maps Watermark Badge Bottom-Left */}
      <div className="absolute bottom-2 left-3 z-30 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[9px] font-bold text-slate-600 border border-slate-200/80 shadow-2xs flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Bản đồ Google Maps • Chánh Hiệp GIS</span>
        </div>
      </div>
    </div>
  );
};
