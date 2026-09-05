import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Volume2,
  Compass,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  Maximize2,
  Minimize2,
  MousePointerClick,
  Info,
  Move,
  Search,
  ShieldCheck,
  Edit3,
  Plus,
  RotateCw,
  CheckCircle2,
  BookOpen,
  Calendar,
  Quote,
  HeartHandshake,
  Box,
  Landmark
} from 'lucide-react';
import { StaffUser } from '../../types';
import {
  ExhibitItem,
  ExhibitPart,
  DEFAULT_HCM_EXHIBITS,
  loadStoredHcmExhibits,
  saveStoredHcmExhibits,
  resetStoredHcmExhibits
} from '../../data/hcmCulturalData';
import { SuperadminExhibitEditorModal } from './SuperadminExhibitEditorModal';
import { HcmMuseumGrandFoyer } from './HcmMuseumGrandFoyer';
import { HcmTimelineAndPeriods } from './HcmTimelineAndPeriods';
import { HcmWorksLibrary } from './HcmWorksLibrary';
import { HcmVerifiedQuotes } from './HcmVerifiedQuotes';
import { HcmFootstepsMap } from './HcmFootstepsMap';
import { HcmAudioArchive } from './HcmAudioArchive';
import { HcmChanhHiepAction } from './HcmChanhHiepAction';
import { HcmBiographyView } from './HcmBiographyView';

// Re-export for backward compatibility
export type { ExhibitItem, ExhibitPart };
export const HCM_EXHIBITS = DEFAULT_HCM_EXHIBITS;

export interface HoChiMinhCulturalSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToMap?: () => void;
  currentStaffUser?: StaffUser | null;
  onTriggerToast?: (title: string, message: string) => void;
}

export const HoChiMinhCulturalSpaceModal: React.FC<HoChiMinhCulturalSpaceModalProps> = ({
  isOpen,
  onClose,
  onNavigateToMap,
  currentStaffUser,
  onTriggerToast
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Digital Museum Navigation Tabs
  type MuseumTab =
    | 'foyer'
    | 'biography'
    | 'timeline'
    | 'works'
    | 'quotes'
    | 'footsteps'
    | 'audio'
    | 'chanh-hiep'
    | 'virtual-3d';

  const [activeMuseumTab, setActiveMuseumTab] = useState<MuseumTab>('foyer');
  const [isResearchMode, setIsResearchMode] = useState<boolean>(false);

  // Dynamic Exhibits state with local storage persistence
  const [exhibits, setExhibits] = useState<ExhibitItem[]>(() => loadStoredHcmExhibits());

  // SuperAdmin mode & editing state
  const isUserSuperAdmin = currentStaffUser?.role === 'SUPER_ADMIN' || currentStaffUser?.role === 'ADMIN';
  const [isSuperAdminMode, setIsSuperAdminMode] = useState<boolean>(() => {
    // Default to true if user has admin/superadmin role or saved in session
    return isUserSuperAdmin;
  });
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingExhibit, setEditingExhibit] = useState<ExhibitItem | null>(null);
  const [saveToastMessage, setSaveToastMessage] = useState<string | null>(null);

  // 3D Camera / Player State
  const [cameraPos, setCameraPos] = useState<{ x: number; z: number }>({ x: 0, z: -50 });
  const [cameraAngle, setCameraAngle] = useState<number>(0); // Yaw in radians
  const [pitchAngle, setPitchAngle] = useState<number>(0); // Pitch in radians

  // Interaction State
  const [selectedExhibit, setSelectedExhibit] = useState<ExhibitItem | null>(() => exhibits[0] || null);
  const [hoveredExhibit, setHoveredExhibit] = useState<{
    exhibit: ExhibitItem;
    screenX: number;
    screenY: number;
    distance: number;
  } | null>(null);

  // 3D Model Part Inspection State
  const [selectedPart, setSelectedPart] = useState<ExhibitPart | null>(null);
  const [hoveredPartInModel, setHoveredPartInModel] = useState<ExhibitPart | null>(null);
  const [modelZoom, setModelZoom] = useState<number>(1);
  const [showAllPartPins, setShowAllPartPins] = useState<boolean>(true);

  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [autoTourIndex, setAutoTourIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isControlsHelpOpen, setIsControlsHelpOpen] = useState<boolean>(false);
  const [turntableRotation, setTurntableRotation] = useState<number>(0);
  const [speechSynthesisActive, setSpeechSynthesisActive] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingCanvasRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const keysPressedRef = useRef<{ [key: string]: boolean }>({});

  // Synchronize superadmin role when currentStaffUser changes
  useEffect(() => {
    if (isUserSuperAdmin) {
      setIsSuperAdminMode(true);
    }
  }, [isUserSuperAdmin]);

  // Keep selected exhibit synchronized with updated exhibits state
  useEffect(() => {
    if (selectedExhibit) {
      const matched = exhibits.find((e) => e.id === selectedExhibit.id);
      if (matched) {
        setSelectedExhibit(matched);
      } else if (exhibits.length > 0) {
        setSelectedExhibit(exhibits[0]);
      }
    } else if (exhibits.length > 0) {
      setSelectedExhibit(exhibits[0]);
    }
  }, [exhibits]);

  // Filtered Exhibits
  const filteredExhibits = useMemo(() => {
    return exhibits.filter((item) => {
      const matchCat = activeCategoryFilter === 'ALL' || item.category === activeCategoryFilter;
      const matchSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [exhibits, activeCategoryFilter, searchQuery]);

  // SuperAdmin: Save an exhibit directly to localStorage and update state
  const handleSaveExhibit = (updatedExhibit: ExhibitItem) => {
    const updatedList = exhibits.map((item) =>
      item.id === updatedExhibit.id ? updatedExhibit : item
    );
    setExhibits(updatedList);
    saveStoredHcmExhibits(updatedList);
    setSelectedExhibit(updatedExhibit);

    // Provide feedback
    const msg = `Đã lưu trực tiếp thay đổi hiện vật "${updatedExhibit.title}" vào hệ thống!`;
    setSaveToastMessage(msg);
    if (onTriggerToast) {
      onTriggerToast('Quản trị Superadmin', msg);
    }
    setTimeout(() => {
      setSaveToastMessage(null);
    }, 4000);
  };

  // SuperAdmin: Add a new exhibit
  const handleAddNewExhibit = () => {
    const newId = `ex-${Date.now()}`;
    const newExhibit: ExhibitItem = {
      id: newId,
      title: 'Hiện vật / Di tích mới ' + (exhibits.length + 1),
      subtitle: 'Tư liệu lịch sử về Bác Hồ và MTTQ Phường Chánh Hiệp',
      category: 'Hiện vật & Di tích',
      x: Math.floor(Math.random() * 200 - 100),
      z: Math.floor(Math.random() * 200 - 100),
      year: '2026',
      quote: '“Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công!”',
      imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
      description: 'Mô tả chi tiết về hiện vật văn hóa mới được số hóa và đưa vào Không gian Văn hóa...',
      details: [
        'Ý nghĩa lịch sử giáo dục truyền thống cho thế hệ trẻ phường Chánh Hiệp.',
        'Kết nối mật thiết với phong trào thi đua tại 21 khu phố.',
        'Được lưu giữ và phục dựng kỹ thuật số trang trọng.'
      ],
      audioText: 'Hiện vật tư liệu số hóa trong Không gian văn hóa Hồ Chí Minh phường Chánh Hiệp.',
      localConnection: 'Nhà truyền thống và 21 khu phố phường Chánh Hiệp.',
      parts: [
        {
          id: `${newId}-p1`,
          name: 'Cấu phần chính di tích',
          type: 'di_tich',
          typeLabel: 'Di tích & Hiện vật',
          xPercent: 50,
          yPercent: 40,
          shortSummary: 'Đặc điểm chi tiết của cấu phần...',
          significance: 'Ý nghĩa biểu tượng thiêng liêng...',
          material: 'Chất liệu nguyên bản',
          dimensions: 'Kích thước chuẩn',
          historicalNote: 'Tư liệu lịch sử lưu trữ'
        }
      ]
    };

    const updated = [...exhibits, newExhibit];
    setExhibits(updated);
    saveStoredHcmExhibits(updated);
    setSelectedExhibit(newExhibit);
    setEditingExhibit(newExhibit);
    setIsEditorOpen(true);

    const msg = 'Đã tạo hiện vật mới thành công! Vui lòng nhập thông tin chi tiết.';
    setSaveToastMessage(msg);
    if (onTriggerToast) onTriggerToast('Superadmin', msg);
    setTimeout(() => setSaveToastMessage(null), 3500);
  };

  // SuperAdmin: Delete an exhibit
  const handleDeleteExhibit = (exhibitId: string) => {
    if (exhibits.length <= 1) {
      alert('Không thể xóa hiện vật duy nhất còn lại!');
      return;
    }
    const updated = exhibits.filter((e) => e.id !== exhibitId);
    setExhibits(updated);
    saveStoredHcmExhibits(updated);
    setSelectedExhibit(updated[0]);

    const msg = 'Đã xóa hiện vật khỏi không gian văn hóa!';
    setSaveToastMessage(msg);
    if (onTriggerToast) onTriggerToast('Superadmin', msg);
    setTimeout(() => setSaveToastMessage(null), 3500);
  };

  // SuperAdmin: Reset to default exhibits
  const handleResetToDefault = () => {
    if (
      confirm(
        'Bạn có chắc chắn muốn khôi phục toàn bộ 8 hiện vật Không gian văn hóa Hồ Chí Minh về trạng thái gốc chuẩn mực ban đầu?'
      )
    ) {
      const defaults = resetStoredHcmExhibits();
      setExhibits(defaults);
      setSelectedExhibit(defaults[0]);
      const msg = 'Đã khôi phục toàn bộ hiện vật về dữ liệu chuẩn mực ban đầu!';
      setSaveToastMessage(msg);
      if (onTriggerToast) onTriggerToast('Superadmin', msg);
      setTimeout(() => setSaveToastMessage(null), 3500);
    }
  };

  // Handle Teleport to Exhibit
  const handleTeleportTo = useCallback((exhibit: ExhibitItem) => {
    const targetX = exhibit.x;
    const targetZ = exhibit.z - 55;
    setCameraPos({ x: targetX, z: targetZ });
    const angle = Math.atan2(exhibit.x - targetX, exhibit.z - targetZ);
    setCameraAngle(angle);
    setSelectedExhibit(exhibit);
    setSelectedPart(null);
    setHoveredPartInModel(null);
    setModelZoom(1);
    setTurntableRotation(0);
  }, []);

  // Keyboard navigation loop
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid hotkeys when typing in input fields
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      keysPressedRef.current[e.code] = true;

      if (e.code === 'Escape') {
        if (isEditorOpen) {
          setIsEditorOpen(false);
        } else if (selectedExhibit) {
          setSelectedExhibit(null);
        } else {
          onClose();
        }
      }
      if (e.code === 'KeyH') {
        setIsControlsHelpOpen((prev) => !prev);
      }
      if (e.code === 'KeyT') {
        setIsAutoTour((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressedRef.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, selectedExhibit, isEditorOpen, onClose]);

  // Smooth Movement Loop
  useEffect(() => {
    if (!isOpen) return;

    let animFrameId: number;

    const updateLoop = () => {
      const keys = keysPressedRef.current;
      const speed = 2.4;
      const rotSpeed = 0.035;

      let dx = 0;
      let dz = 0;
      let dAngle = 0;

      if (keys['KeyW'] || keys['ArrowUp']) {
        dx += Math.sin(cameraAngle) * speed;
        dz += Math.cos(cameraAngle) * speed;
      }
      if (keys['KeyS'] || keys['ArrowDown']) {
        dx -= Math.sin(cameraAngle) * speed;
        dz -= Math.cos(cameraAngle) * speed;
      }
      if (keys['KeyA']) {
        dx -= Math.cos(cameraAngle) * speed;
        dz += Math.sin(cameraAngle) * speed;
      }
      if (keys['KeyD']) {
        dx += Math.cos(cameraAngle) * speed;
        dz -= Math.sin(cameraAngle) * speed;
      }
      if (keys['ArrowLeft'] || keys['KeyQ']) {
        dAngle -= rotSpeed;
      }
      if (keys['ArrowRight'] || keys['KeyE']) {
        dAngle += rotSpeed;
      }

      if (dx !== 0 || dz !== 0) {
        setCameraPos((prev) => {
          const nextX = Math.max(-190, Math.min(190, prev.x + dx));
          const nextZ = Math.max(-190, Math.min(190, prev.z + dz));
          return { x: nextX, z: nextZ };
        });
      }

      if (dAngle !== 0) {
        setCameraAngle((prev) => prev + dAngle);
      }

      animFrameId = requestAnimationFrame(updateLoop);
    };

    animFrameId = requestAnimationFrame(updateLoop);
    return () => cancelAnimationFrame(animFrameId);
  }, [isOpen, cameraAngle]);

  // Auto Tour Timer
  useEffect(() => {
    if (!isAutoTour || !isOpen) return;

    const timer = setInterval(() => {
      setAutoTourIndex((prev) => {
        if (exhibits.length === 0) return 0;
        const nextIdx = (prev + 1) % exhibits.length;
        const nextExhibit = exhibits[nextIdx];
        handleTeleportTo(nextExhibit);
        return nextIdx;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, [isAutoTour, isOpen, exhibits, handleTeleportTo]);

  // Text-to-Speech audio reader
  const handleToggleSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Trình duyệt của bạn không hỗ trợ tính năng đọc thuyết minh tự động.');
      return;
    }

    if (speechSynthesisActive) {
      window.speechSynthesis.cancel();
      setSpeechSynthesisActive(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setSpeechSynthesisActive(false);
    utterance.onerror = () => setSpeechSynthesisActive(false);

    window.speechSynthesis.speak(utterance);
    setSpeechSynthesisActive(true);
  };

  // Clean up speech on unmount or close
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen]);

  // 3D Canvas Rendering Engine - BRIGHT, PRESTIGIOUS EXHIBITION HALL THEME
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let renderFrameId: number;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = canvas.parentElement?.clientHeight || 600);

      const fov = 340;
      const centerX = width / 2;
      const centerY = height / 2 + pitchAngle * 200;

      // BRIGHT GALLERY ATMOSPHERE: Soft ivory-white background with subtle warm light gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      bgGrad.addColorStop(0, '#f8fafc'); // Clean soft gallery ceiling
      bgGrad.addColorStop(0.35, '#f1f5f9');
      bgGrad.addColorStop(0.65, '#e2e8f0'); // Warm ambient light
      bgGrad.addColorStop(1, '#cbd5e1'); // Bright polished hardwood / marble floor tone
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Warm Spotlight Bloom in center of hall
      const radialLight = ctx.createRadialGradient(
        centerX,
        centerY - 40,
        20,
        centerX,
        centerY,
        Math.max(width, height) * 0.75
      );
      radialLight.addColorStop(0, 'rgba(254, 243, 199, 0.45)'); // Warm amber gallery light
      radialLight.addColorStop(0.5, 'rgba(255, 251, 235, 0.2)');
      radialLight.addColorStop(1, 'rgba(241, 245, 249, 0)');
      ctx.fillStyle = radialLight;
      ctx.fillRect(0, 0, width, height);

      ctx.save();

      // Dignified Crimson Ceiling Ribbon
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(0, 0, width, 40);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ KHÔNG GIAN VĂN HÓA HỒ CHÍ MINH - PHƯỜNG CHÁNH HIỆP ★', width / 2, 25);

      // Perspective Floor Grid Lines
      ctx.strokeStyle = 'rgba(180, 83, 9, 0.18)'; // Refined warm gold/slate lines
      ctx.lineWidth = 1;

      const roomSize = 220;
      const gridStep = 40;

      const project = (x3d: number, y3d: number, z3d: number) => {
        const relX = x3d - cameraPos.x;
        const relZ = z3d - cameraPos.z;

        const rotX = relX * Math.cos(-cameraAngle) - relZ * Math.sin(-cameraAngle);
        const rotZ = relX * Math.sin(-cameraAngle) + relZ * Math.cos(-cameraAngle);

        if (rotZ <= 10) return null;

        const scale = fov / rotZ;
        const projX = centerX + rotX * scale;
        const projY = centerY - (y3d - 20) * scale;

        return { x: projX, y: projY, scale, distance: rotZ };
      };

      // Draw Floor grid
      for (let x = -roomSize; x <= roomSize; x += gridStep) {
        const p1 = project(x, -30, -roomSize);
        const p2 = project(x, -30, roomSize);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      for (let z = -roomSize; z <= roomSize; z += gridStep) {
        const p1 = project(-roomSize, -30, z);
        const p2 = project(roomSize, -30, z);
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      // North Wall Banner: "ĐOÀN KẾT, ĐOÀN KẾT, ĐẠI ĐOÀN KẾT..."
      const nw1 = project(-160, 45, 200);
      const nw2 = project(160, 45, 200);
      const nw3 = project(160, -25, 200);
      const nw4 = project(-160, -25, 200);
      if (nw1 && nw2 && nw3 && nw4) {
        ctx.fillStyle = 'rgba(185, 28, 28, 0.85)';
        ctx.beginPath();
        ctx.moveTo(nw1.x, nw1.y);
        ctx.lineTo(nw2.x, nw2.y);
        ctx.lineTo(nw3.x, nw3.y);
        ctx.lineTo(nw4.x, nw4.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = `bold ${Math.max(10, Math.floor(17 * nw1.scale))}px serif`;
        ctx.textAlign = 'center';
        ctx.fillText(
          '“Đoàn kết, đoàn kết, đại đoàn kết. Thành công, thành công, đại thành công!”',
          (nw1.x + nw2.x) / 2,
          (nw1.y + nw3.y) / 2
        );
      }

      // Render Exhibits sorted by distance (Farthest first)
      const projectedExhibits = exhibits
        .map((item) => {
          const proj = project(item.x, 0, item.z);
          return { item, proj };
        })
        .filter((e) => e.proj !== null)
        .sort((a, b) => (b.proj?.distance || 0) - (a.proj?.distance || 0));

      projectedExhibits.forEach(({ item, proj }) => {
        if (!proj) return;
        const { x, y, scale, distance } = proj;

        // Base Pedestal
        const baseWidth = Math.max(26, 75 * scale);
        const baseHeight = Math.max(30, 95 * scale);

        const isSelected = selectedExhibit?.id === item.id;
        const isHovered = hoveredExhibit?.exhibit.id === item.id;

        // Pedestal natural shadow
        ctx.fillStyle = isHovered ? 'rgba(37, 99, 235, 0.25)' : 'rgba(15, 23, 42, 0.15)';
        ctx.beginPath();
        ctx.ellipse(
          x,
          y + baseHeight / 2 + 10 * scale,
          baseWidth * 0.75,
          baseWidth * 0.28,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Pedestal Body - Bright Ivory / Polished Marble with Gold Accent
        const pedGrad = ctx.createLinearGradient(x - baseWidth / 2, y, x + baseWidth / 2, y);
        if (isSelected) {
          pedGrad.addColorStop(0, '#f59e0b');
          pedGrad.addColorStop(0.5, '#fef08a');
          pedGrad.addColorStop(1, '#d97706');
        } else if (isHovered) {
          pedGrad.addColorStop(0, '#2563eb');
          pedGrad.addColorStop(0.5, '#bfdbfe');
          pedGrad.addColorStop(1, '#1d4ed8');
        } else {
          // Elegant white marble pedestal
          pedGrad.addColorStop(0, '#ffffff');
          pedGrad.addColorStop(0.5, '#f8fafc');
          pedGrad.addColorStop(1, '#e2e8f0');
        }

        ctx.fillStyle = pedGrad;
        ctx.beginPath();
        ctx.roundRect(x - baseWidth / 2, y - baseHeight / 2, baseWidth, baseHeight, 6 * scale);
        ctx.fill();

        // Thin hairline border
        ctx.strokeStyle = isSelected ? '#d97706' : isHovered ? '#2563eb' : '#cbd5e1';
        ctx.lineWidth = isSelected || isHovered ? Math.max(1.5, 2.5 * scale) : Math.max(1, 1.5 * scale);
        ctx.stroke();

        // Year on pedestal
        ctx.fillStyle = isSelected ? '#78350f' : isHovered ? '#1e3a8a' : '#475569';
        ctx.font = `bold ${Math.max(10, Math.floor(13 * scale))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(item.year, x, y - baseHeight * 0.15);

        // Beacon Pulsing above
        const beaconY = y - baseHeight / 2 - 26 * scale;
        const pulse = Math.sin(Date.now() / 250) * 3;

        ctx.fillStyle = isSelected ? '#d97706' : isHovered ? '#2563eb' : '#dc2626';
        ctx.beginPath();
        ctx.arc(
          x,
          beaconY + pulse,
          isHovered ? Math.max(7, 11 * scale) : Math.max(5, 8 * scale),
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // High-contrast clean white label card above pedestal
        if (distance < 190 || isHovered) {
          const fontSize = Math.max(9, Math.floor(11 * scale));
          ctx.font = `bold ${fontSize}px sans-serif`;
          const textWidth = ctx.measureText(item.title).width + 16;
          const cardHeight = Math.max(18, 22 * scale);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
          ctx.beginPath();
          ctx.roundRect(x - textWidth / 2, beaconY - 26 * scale, textWidth, cardHeight, 6);
          ctx.fill();

          ctx.strokeStyle = isSelected ? '#d97706' : isHovered ? '#2563eb' : '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = isSelected ? '#92400e' : isHovered ? '#1d4ed8' : '#0f172a';
          ctx.textAlign = 'center';
          ctx.fillText(item.title, x, beaconY - 11 * scale);
        }
      });

      ctx.restore();
      renderFrameId = requestAnimationFrame(render);
    };

    renderFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(renderFrameId);
  }, [isOpen, cameraPos, cameraAngle, pitchAngle, exhibits, selectedExhibit, hoveredExhibit]);

  // Mouse / Touch Navigation on Canvas
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingCanvasRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDraggingCanvasRef.current) {
      const deltaX = e.clientX - lastMousePosRef.current.x;
      const deltaY = e.clientY - lastMousePosRef.current.y;

      setCameraAngle((prev) => prev - deltaX * 0.005);
      setPitchAngle((prev) => Math.max(-0.4, Math.min(0.4, prev - deltaY * 0.003)));

      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      return;
    }

    // Hover hit test
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const fov = 340;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2 + pitchAngle * 200;

    let foundHover: {
      exhibit: ExhibitItem;
      screenX: number;
      screenY: number;
      distance: number;
    } | null = null;

    exhibits.forEach((item) => {
      const relX = item.x - cameraPos.x;
      const relZ = item.z - cameraPos.z;

      const rotX = relX * Math.cos(-cameraAngle) - relZ * Math.sin(-cameraAngle);
      const rotZ = relX * Math.sin(-cameraAngle) + relZ * Math.cos(-cameraAngle);

      if (rotZ > 10) {
        const scale = fov / rotZ;
        const projX = centerX + rotX * scale;
        const projY = centerY - (0 - 20) * scale;

        const baseWidth = Math.max(30, 85 * scale);
        const baseHeight = Math.max(35, 110 * scale);

        if (
          mouseX >= projX - baseWidth / 2 &&
          mouseX <= projX + baseWidth / 2 &&
          mouseY >= projY - baseHeight / 2 - 35 * scale &&
          mouseY <= projY + baseHeight / 2 + 10
        ) {
          foundHover = {
            exhibit: item,
            screenX: projX,
            screenY: projY,
            distance: rotZ
          };
        }
      }
    });

    setHoveredExhibit(foundHover);
  };

  const handleCanvasMouseUp = () => {
    isDraggingCanvasRef.current = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingCanvasRef.current) return;
    if (hoveredExhibit) {
      handleTeleportTo(hoveredExhibit.exhibit);
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 1) {
      isDraggingCanvasRef.current = true;
      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDraggingCanvasRef.current && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - lastMousePosRef.current.x;
      const deltaY = e.touches[0].clientY - lastMousePosRef.current.y;

      setCameraAngle((prev) => prev - deltaX * 0.005);
      setPitchAngle((prev) => Math.max(-0.4, Math.min(0.4, prev - deltaY * 0.003)));

      lastMousePosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    isDraggingCanvasRef.current = false;
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full h-full max-w-7xl max-h-[96vh] bg-white rounded-2xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden text-slate-800"
      >
        {/* Top Header Bar - Bright, Clean & High Information Density */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2 shrink-0 z-30">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              ★
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                  Không Gian Văn Hóa Hồ Chí Minh
                </h2>
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-200">
                  Phường Chánh Hiệp
                </span>
                {isSuperAdminMode && (
                  <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Superadmin: Chỉnh sửa trực tiếp</span>
                  </span>
                )}
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                Tham quan số hóa 3D • Tương tác hiện vật &amp; cấu phần di tích
              </p>
            </div>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Superadmin Mode Toggle */}
            <button
              onClick={() => setIsSuperAdminMode((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSuperAdminMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title={isSuperAdminMode ? 'Đang bật quyền Superadmin' : 'Bật quyền Superadmin để chỉnh sửa'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">
                {isSuperAdminMode ? 'Quyền Quản Trị' : 'Chế độ Superadmin'}
              </span>
            </button>

            {/* Superadmin Quick Action: Add Exhibit */}
            {isSuperAdminMode && (
              <button
                onClick={handleAddNewExhibit}
                className="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] flex items-center gap-1 transition shadow-xs cursor-pointer"
                title="Thêm hiện vật mới vào không gian văn hóa"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Thêm Hiện Vật</span>
              </button>
            )}

            {/* Superadmin Quick Action: Reset Defaults */}
            {isSuperAdminMode && (
              <button
                onClick={handleResetToDefault}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition cursor-pointer"
                title="Khôi phục 8 hiện vật về dữ liệu gốc chuẩn mực"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Auto Tour Toggle */}
            <button
              onClick={() => setIsAutoTour((prev) => !prev)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                isAutoTour
                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              }`}
              title="Tự động dẫn tour qua các hiện vật"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoTour ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAutoTour ? 'Dừng Tour' : 'Tham Quan Tự Động'}</span>
            </button>

            {/* Reset Camera */}
            <button
              onClick={() => {
                setCameraPos({ x: 0, z: -50 });
                setCameraAngle(0);
                setPitchAngle(0);
              }}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
              title="Đặt lại góc nhìn trung tâm"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Help Controls Modal */}
            <button
              onClick={() => setIsControlsHelpOpen(true)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
              title="Hướng dẫn điều khiển 3D"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleToggleFullscreen}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
              title="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-700 border border-slate-200 transition cursor-pointer"
              title="Đóng Không gian Văn hóa"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modern Digital Museum Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between gap-2 overflow-x-auto shrink-0 z-20 scrollbar-none">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveMuseumTab('foyer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'foyer'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Landmark className="w-3.5 h-3.5" />
              <span>Sảnh Trung Tâm</span>
            </button>

            <button
              onClick={() => setActiveMuseumTab('biography')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'biography'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Cuộc Đời &amp; Sự Nghiệp</span>
            </button>

            <button
              onClick={() => setActiveMuseumTab('timeline')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'timeline'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>08 Thời Kỳ &amp; Timeline</span>
            </button>

            <button
              onClick={() => setActiveMuseumTab('works')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'works'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Thư Viện Tác Phẩm</span>
            </button>

            <button
              onClick={() => setActiveMuseumTab('quotes')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'quotes'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Kho Lời Bác</span>
            </button>

            <button
              onClick={() => setActiveMuseumTab('footsteps')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'footsteps'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Dấu Chân Người</span>
            </button>

            <button
              onClick={() => setActiveMuseumTab('audio')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'audio'
                  ? 'bg-red-700 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Tư Liệu Âm Thanh</span>
            </button>

            <button
              onClick={() => setActiveMuseumTab('chanh-hiep')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'chanh-hiep'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              <span>Chánh Hiệp Học Bác</span>
            </button>

            <button
              onClick={() => setActiveMuseumTab('virtual-3d')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                activeMuseumTab === 'virtual-3d'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5 text-amber-500" />
              <span>Phòng 3D Tương Tác</span>
            </button>
          </div>

          {/* Research Mode toggle */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
            <button
              onClick={() => setIsResearchMode((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                isResearchMode
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
              title="Bật/tắt chế độ nghiên cứu học thuật: Hiển thị tập, trang, nhà xuất bản"
            >
              <span>{isResearchMode ? '📖 Nghiên Cứu: BẬT' : '📖 Nguồn Cấp A'}</span>
            </button>
          </div>
        </div>

        {/* In-Modal Save Toast Notification */}
        <AnimatePresence>
          {saveToastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-600"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{saveToastMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {activeMuseumTab === 'virtual-3d' ? (
          <>
          {/* Main 3D Space Viewport & Side Inspection Panel */}
          <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col md:flex-row">
          {/* Canvas 3D Space Viewport */}
          <div className="relative flex-1 w-full h-full bg-slate-100 overflow-hidden">
            <canvas
              ref={canvasRef}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={() => setHoveredExhibit(null)}
              onClick={handleCanvasClick}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full h-full block ${
                hoveredExhibit ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'
              }`}
            />

            {/* Hover Tooltip Overlay in 3D Space - Clean Bright Design */}
            <AnimatePresence>
              {hoveredExhibit && !isDraggingCanvasRef.current && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    left: `${Math.max(
                      16,
                      Math.min(
                        hoveredExhibit.screenX - 140,
                        (canvasRef.current?.parentElement?.clientWidth || 800) - 300
                      )
                    )}px`,
                    top: `${Math.max(50, hoveredExhibit.screenY - 170)}px`
                  }}
                  className="absolute z-40 w-72 pointer-events-auto bg-white/98 backdrop-blur-xl border border-slate-200 rounded-xl p-3 shadow-xl text-slate-800 ring-1 ring-slate-900/5"
                >
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-amber-900 px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                      {hoveredExhibit.exhibit.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {hoveredExhibit.exhibit.year}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 leading-snug mb-1 break-words">
                    {hoveredExhibit.exhibit.title}
                  </h4>

                  <p className="text-[11px] text-slate-600 leading-relaxed mb-2 break-words line-clamp-2">
                    {hoveredExhibit.exhibit.description}
                  </p>

                  {/* Hotspot parts count */}
                  {hoveredExhibit.exhibit.parts && hoveredExhibit.exhibit.parts.length > 0 && (
                    <div className="mb-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1 font-semibold text-amber-700">
                        <Layers className="w-3 h-3" />
                        <span>{hoveredExhibit.exhibit.parts.length} cấu phần số hóa</span>
                      </span>
                      <span className="text-blue-600 font-bold">Xem chi tiết</span>
                    </div>
                  )}

                  <button
                    onClick={() => handleTeleportTo(hoveredExhibit.exhibit)}
                    className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition active:scale-95"
                  >
                    <MousePointerClick className="w-3.5 h-3.5" />
                    <span>Mở thông tin &amp; tương tác 3D</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Minimap Radar (Top Right) - Bright styling */}
            <div className="absolute top-3 right-3 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-2 shadow-lg text-slate-800">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-red-600" /> Sơ đồ phòng
                </span>
                <span className="text-[9px] text-slate-500">{exhibits.length} vị trí</span>
              </div>
              <div className="relative w-28 h-28 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-center overflow-hidden">
                <span className="absolute top-1 text-[8px] font-bold text-red-700">BẮC (TƯỢNG BÁC)</span>
                <span className="absolute bottom-1 text-[8px] font-bold text-slate-500">NAM (CỬA VÀO)</span>

                {/* Exhibit Dots */}
                {exhibits.map((item) => {
                  const mapX = 56 + (item.x / 200) * 44;
                  const mapY = 56 - (item.z / 200) * 44;
                  const isSel = selectedExhibit?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTeleportTo(item);
                      }}
                      style={{ left: `${mapX}px`, top: `${mapY}px` }}
                      className={`absolute w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full cursor-pointer transition-transform hover:scale-150 ${
                        isSel ? 'bg-amber-500 ring-2 ring-amber-300 scale-125' : 'bg-red-500'
                      }`}
                      title={item.title}
                    />
                  );
                })}

                {/* Player Marker with Heading Arrow */}
                <div
                  style={{
                    left: `${56 + (cameraPos.x / 200) * 44}px`,
                    top: `${56 - (cameraPos.z / 200) * 44}px`,
                    transform: `translate(-50%, -50%) rotate(${cameraAngle * (180 / Math.PI)}deg)`
                  }}
                  className="absolute w-4 h-4 pointer-events-none flex items-center justify-center"
                >
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-blue-600 drop-shadow-xs" />
                </div>
              </div>
            </div>

            {/* Quick Floating Instruction Overlay */}
            <div className="hidden lg:flex absolute bottom-20 left-4 z-20 items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 shadow-sm">
              <Move className="w-3.5 h-3.5 text-amber-600" />
              <span>Phím <b>W, A, S, D</b> để di chuyển • Kéo chuột để xoay 360°</span>
            </div>
          </div>

          {/* Detailed Exhibit Inspection Panel - Clean, Bright, Information-First Layout */}
          <AnimatePresence>
            {selectedExhibit && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full md:w-[390px] lg:w-[430px] bg-white border-l border-slate-200 flex flex-col z-30 shadow-xl overflow-hidden shrink-0 h-full max-h-[88vh] md:max-h-full text-slate-800"
              >
                {/* Panel Header */}
                <div className="p-3.5 border-b border-slate-200 bg-gradient-to-r from-red-50/70 via-amber-50/40 to-white flex items-center justify-between gap-2 shrink-0">
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase text-amber-900 px-2 py-0.5 rounded bg-amber-100 border border-amber-300">
                        {selectedExhibit.category}
                      </span>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {selectedExhibit.year}
                      </span>
                    </div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug break-words">
                      {selectedExhibit.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* SuperAdmin Edit Button */}
                    {isSuperAdminMode && (
                      <button
                        onClick={() => {
                          setEditingExhibit(selectedExhibit);
                          setIsEditorOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                        title="Chỉnh sửa trực tiếp hiện vật này"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-800" />
                        <span className="hidden sm:inline">Sửa</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedExhibit(null)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                      title="Đóng bảng chi tiết"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Panel Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs text-slate-700">
                  {/* Interactive 3D Model Stage with Hotspots */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span className="font-extrabold uppercase tracking-wide text-slate-900">
                          Mô Hình 3D &amp; Cấu Phần Số Hóa
                        </span>
                      </div>
                      <button
                        onClick={() => setShowAllPartPins((prev) => !prev)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                          showAllPartPins
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                        title="Ẩn / hiện các điểm ghim cấu phần trên mô hình"
                      >
                        <Layers className="w-3 h-3" />
                        <span>{showAllPartPins ? 'Ẩn ghim' : 'Hiện ghim'}</span>
                      </button>
                    </div>

                    {/* 3D Stage Box */}
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 h-52 group select-none shadow-xs">
                      <img
                        src={selectedExhibit.imageUrl}
                        alt={selectedExhibit.title}
                        className="w-full h-full object-cover transition-transform duration-500"
                        style={{
                          transform: `scale(${modelZoom}) rotateY(${turntableRotation}deg)`
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                      {/* Hotspot Pins overlaid on 3D Model */}
                      {showAllPartPins &&
                        selectedExhibit.parts &&
                        selectedExhibit.parts.map((part, pIdx) => {
                          const isPartSelected = selectedPart?.id === part.id;
                          const isPartHovered = hoveredPartInModel?.id === part.id;

                          return (
                            <div
                              key={part.id}
                              style={{
                                left: `${part.xPercent}%`,
                                top: `${part.yPercent}%`,
                                transform: 'translate(-50%, -50%)'
                              }}
                              className="absolute z-20"
                            >
                              <button
                                onMouseEnter={() => setHoveredPartInModel(part)}
                                onMouseLeave={() => setHoveredPartInModel(null)}
                                onClick={() => setSelectedPart(isPartSelected ? null : part)}
                                className={`relative w-6 h-6 rounded-full flex items-center justify-center font-black text-[10px] shadow-md cursor-pointer transition-all duration-200 ${
                                  isPartSelected
                                    ? 'bg-amber-400 text-slate-950 ring-3 ring-amber-300 scale-125'
                                    : isPartHovered
                                    ? 'bg-blue-500 text-white ring-3 ring-blue-300 scale-115'
                                    : 'bg-red-600 text-white border border-white'
                                }`}
                                title={`Click để xem cấu phần: ${part.name}`}
                              >
                                <span
                                  className={`absolute -inset-1 rounded-full animate-ping opacity-60 pointer-events-none ${
                                    isPartSelected
                                      ? 'bg-amber-400'
                                      : isPartHovered
                                      ? 'bg-blue-500'
                                      : 'bg-red-500'
                                  }`}
                                />
                                <span className="relative z-10">{pIdx + 1}</span>
                              </button>

                              {/* Tooltip for Hotspot */}
                              <AnimatePresence>
                                {isPartHovered && !isPartSelected && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 6, scale: 0.94 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.94 }}
                                    transition={{ duration: 0.15 }}
                                    style={{
                                      bottom: part.yPercent > 50 ? '30px' : 'auto',
                                      top: part.yPercent <= 50 ? '30px' : 'auto',
                                      left:
                                        part.xPercent > 65
                                          ? '-160px'
                                          : part.xPercent < 35
                                          ? '0px'
                                          : '-80px'
                                    }}
                                    className="absolute z-40 w-56 p-2.5 rounded-xl bg-white border border-slate-200 shadow-xl text-slate-800 pointer-events-none ring-1 ring-slate-900/5"
                                  >
                                    <div className="flex items-center justify-between gap-1 mb-1">
                                      <span className="text-[9px] font-bold text-amber-900 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200">
                                        {part.typeLabel}
                                      </span>
                                      <span className="text-[9px] text-slate-500">#{pIdx + 1}</span>
                                    </div>
                                    <div className="text-xs font-bold text-slate-900 leading-tight mb-1 break-words">
                                      {part.name}
                                    </div>
                                    <div className="text-[10px] text-slate-600 leading-snug break-words line-clamp-2">
                                      {part.shortSummary}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}

                      {/* Controls on 3D Model Image */}
                      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 bg-black/60 backdrop-blur-xs p-1 rounded-lg">
                        <button
                          onClick={() => setModelZoom((prev) => Math.min(1.8, prev + 0.2))}
                          className="p-1 rounded text-white hover:bg-white/20 text-xs font-bold"
                          title="Phóng to mô hình"
                        >
                          +
                        </button>
                        <button
                          onClick={() => setModelZoom((prev) => Math.max(0.8, prev - 0.2))}
                          className="p-1 rounded text-white hover:bg-white/20 text-xs font-bold"
                          title="Thu nhỏ mô hình"
                        >
                          -
                        </button>
                        <button
                          onClick={() => setTurntableRotation((prev) => prev + 45)}
                          className="p-1 rounded text-white hover:bg-white/20 text-xs"
                          title="Xoay góc nhìn 45°"
                        >
                          ↻
                        </button>
                      </div>
                    </div>

                    {/* Part Quick Selector Chips */}
                    {selectedExhibit.parts && selectedExhibit.parts.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedExhibit.parts.map((part, pIdx) => {
                          const isPartSelected = selectedPart?.id === part.id;
                          return (
                            <button
                              key={part.id}
                              onClick={() => setSelectedPart(isPartSelected ? null : part)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                                isPartSelected
                                  ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              <span
                                className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                                  isPartSelected ? 'bg-white text-amber-900' : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {pIdx + 1}
                              </span>
                              <span className="break-words">{part.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Expanded Part Card when clicked */}
                    <AnimatePresence>
                      {selectedPart && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-slate-800 space-y-2 overflow-hidden"
                        >
                          <div className="flex items-center justify-between gap-1 border-b border-amber-200/80 pb-1.5">
                            <div>
                              <span className="text-[9px] font-bold text-amber-900 uppercase bg-amber-100 px-1.5 py-0.5 rounded mr-1.5 border border-amber-300">
                                {selectedPart.typeLabel}
                              </span>
                              <h5 className="font-extrabold text-slate-900 text-xs inline break-words">
                                {selectedPart.name}
                              </h5>
                            </div>
                            <button
                              onClick={() => setSelectedPart(null)}
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Technical Specs Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            {selectedPart.material && (
                              <div className="p-2 bg-white rounded-lg border border-amber-200/60">
                                <span className="font-bold text-slate-600 block text-[10px]">
                                  Chất liệu:
                                </span>
                                <span className="text-slate-800 font-medium break-words">
                                  {selectedPart.material}
                                </span>
                              </div>
                            )}
                            {selectedPart.dimensions && (
                              <div className="p-2 bg-white rounded-lg border border-amber-200/60">
                                <span className="font-bold text-slate-600 block text-[10px]">
                                  Kích thước / Quy cách:
                                </span>
                                <span className="text-slate-800 font-medium break-words">
                                  {selectedPart.dimensions}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className="text-[11px] text-slate-700 leading-relaxed font-medium break-words">
                            {selectedPart.shortSummary}
                          </p>

                          <div className="p-2.5 rounded-lg bg-white border border-amber-200 text-[11px] space-y-1">
                            <span className="font-bold text-red-700 text-[10px] uppercase flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-red-600" />
                              Ý nghĩa &amp; Giá trị lịch sử:
                            </span>
                            <p className="text-slate-700 leading-relaxed break-words">
                              {selectedPart.significance}
                            </p>
                          </div>

                          {selectedPart.historicalNote && (
                            <div className="text-[10px] text-slate-500 italic break-words">
                              <span className="font-bold text-slate-700 not-italic">Tư liệu lưu trữ: </span>
                              {selectedPart.historicalNote}
                            </div>
                          )}

                          {/* Part Actions */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() =>
                                handleToggleSpeech(
                                  `${selectedPart.name}. ${selectedPart.shortSummary}. ${selectedPart.significance}`
                                )
                              }
                              className="flex-1 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>Nghe thuyết minh cấu phần</span>
                            </button>

                            {isSuperAdminMode && (
                              <button
                                onClick={() => {
                                  setEditingExhibit(selectedExhibit);
                                  setIsEditorOpen(true);
                                }}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] border border-slate-200 cursor-pointer"
                                title="Sửa thông số cấu phần này"
                              >
                                Sửa cấu phần
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Famous Quote Card */}
                  {selectedExhibit.quote && (
                    <div className="bg-red-50 border-l-4 border-red-600 p-3 rounded-r-xl text-red-950 italic font-serif leading-relaxed text-xs break-words">
                      {selectedExhibit.quote}
                    </div>
                  )}

                  {/* Audio Narration Bar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-slate-900 leading-tight">
                          Thuyết minh hiện vật
                        </div>
                        <div className="text-[10px] text-slate-500">Giọng đọc số hóa tự động</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleToggleSpeech(selectedExhibit.audioText)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shrink-0 ${
                        speechSynthesisActive
                          ? 'bg-rose-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {speechSynthesisActive ? (
                        <Pause className="w-3 h-3 fill-white" />
                      ) : (
                        <Play className="w-3 h-3 fill-white" />
                      )}
                      <span>{speechSynthesisActive ? 'Dừng' : 'Nghe đọc'}</span>
                    </button>
                  </div>

                  {/* Description */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Mô tả &amp; Ý nghĩa lịch sử
                    </h4>
                    <p className="text-slate-700 leading-relaxed text-xs break-words">
                      {selectedExhibit.description}
                    </p>
                  </div>

                  {/* Key Details List */}
                  {selectedExhibit.details && selectedExhibit.details.length > 0 && (
                    <div className="space-y-1.5">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Giá trị đối với Mặt trận &amp; Chánh Hiệp
                      </h4>
                      <ul className="space-y-1 text-xs">
                        {selectedExhibit.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                            <span className="leading-snug break-words">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Local Connection */}
                  {selectedExhibit.localConnection && (
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-950 space-y-0.5">
                      <div className="font-bold uppercase text-[10px] text-blue-900">
                        Gắn kết địa phương Chánh Hiệp
                      </div>
                      <p className="break-words leading-relaxed">{selectedExhibit.localConnection}</p>
                    </div>
                  )}

                  {/* Action Link to Digital Map */}
                  {onNavigateToMap && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToMap();
                        }}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Xem vị trí trên Bản đồ số 21 Khu phố</span>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Horizontal Exhibits Selector Dock - Clean Bright Theme */}
        <div className="bg-white/95 border-t border-slate-200 p-2 z-20 shrink-0 text-slate-800">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 max-w-7xl mx-auto">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 shrink-0">
              {['ALL', 'Hiện vật & Di tích', 'Tư liệu lịch sử', 'Tủ sách Bác Hồ', 'Ảnh tư liệu', 'Mô hình 3D'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer whitespace-nowrap border ${
                      activeCategoryFilter === cat
                        ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
                    }`}
                  >
                    {cat === 'ALL' ? `Tất cả (${exhibits.length})` : cat}
                  </button>
                )
              )}
            </div>

            {/* Horizontal Scroll of All Exhibits */}
            <div className="flex items-center gap-2 overflow-x-auto w-full py-0.5">
              {filteredExhibits.map((item, idx) => {
                const isSelected = selectedExhibit?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTeleportTo(item)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all shrink-0 cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-50 text-amber-950 border-amber-400 ring-1 ring-amber-400 font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${
                        isSelected
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      0{idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold leading-snug break-words max-w-[160px]">
                        {item.title}
                      </div>
                      <div
                        className={`text-[9px] font-medium ${
                          isSelected ? 'text-amber-800' : 'text-slate-500'
                        }`}
                      >
                        {item.year}
                      </div>
                    </div>
                  </button>
                );
              })}

              {/* Superadmin Add Exhibit Button in Dock */}
              {isSuperAdminMode && (
                <button
                  onClick={handleAddNewExhibit}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-amber-400 bg-amber-50/60 hover:bg-amber-100 text-amber-900 text-xs font-bold shrink-0 cursor-pointer transition"
                  title="Thêm hiện vật mới"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-600" />
                  <span>Thêm Mới</span>
                </button>
              )}
            </div>
          </div>
        </div>
        </>
        ) : (
          <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-6 bg-gradient-to-b from-rose-50 via-amber-50/40 to-rose-100/50">
            <div className="max-w-7xl mx-auto">
              {activeMuseumTab === 'foyer' && (
                <HcmMuseumGrandFoyer
                  isResearchMode={isResearchMode}
                  onToggleResearchMode={() => setIsResearchMode((prev) => !prev)}
                  onNavigateTab={(tabId) => setActiveMuseumTab(tabId as MuseumTab)}
                  onOpenSearch={() => setActiveMuseumTab('timeline')}
                  isAdmin={isSuperAdminMode || isUserSuperAdmin}
                />
              )}

              {activeMuseumTab === 'biography' && (
                <HcmBiographyView
                  isResearchMode={isResearchMode}
                  onToggleResearchMode={() => setIsResearchMode((prev) => !prev)}
                  onNavigateTab={(tabId) => setActiveMuseumTab(tabId as MuseumTab)}
                  isAdmin={isSuperAdminMode || isUserSuperAdmin}
                />
              )}

              {activeMuseumTab === 'timeline' && (
                <HcmTimelineAndPeriods
                  isResearchMode={isResearchMode}
                  isAdmin={isSuperAdminMode || isUserSuperAdmin}
                />
              )}

              {activeMuseumTab === 'works' && (
                <HcmWorksLibrary
                  isResearchMode={isResearchMode}
                  isAdmin={isSuperAdminMode || isUserSuperAdmin}
                />
              )}

              {activeMuseumTab === 'quotes' && (
                <HcmVerifiedQuotes
                  isResearchMode={isResearchMode}
                  isAdmin={isSuperAdminMode || isUserSuperAdmin}
                />
              )}

              {activeMuseumTab === 'footsteps' && (
                <HcmFootstepsMap
                  isResearchMode={isResearchMode}
                  isAdmin={isSuperAdminMode || isUserSuperAdmin}
                />
              )}

              {activeMuseumTab === 'audio' && (
                <HcmAudioArchive
                  isResearchMode={isResearchMode}
                  isAdmin={isSuperAdminMode || isUserSuperAdmin}
                />
              )}

              {activeMuseumTab === 'chanh-hiep' && (
                <HcmChanhHiepAction
                  isAdmin={isSuperAdminMode || isUserSuperAdmin}
                />
              )}
            </div>
          </div>
        )}

        {/* Controls Help Modal */}
        <AnimatePresence>
          {isControlsHelpOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl relative text-slate-800"
              >
                <button
                  onClick={() => setIsControlsHelpOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Hướng Dẫn Khám Phá Không Gian 3D
                    </h3>
                    <p className="text-xs text-slate-500">Cách di chuyển &amp; tương tác với hiện vật</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-700 pt-1">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold">Di chuyển:</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded text-amber-900 border border-slate-200">
                      W, A, S, D hoặc Mũi tên
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold">Xoay 360°:</span>
                    <span className="text-slate-600">Kéo chuột hoặc vuốt ngón tay</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold">Xem chi tiết:</span>
                    <span className="text-amber-800 font-bold">Click vào bục trưng bày / hotspot</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="font-bold">Chế độ Superadmin:</span>
                    <span className="text-emerald-700 font-bold">Bật nút Superadmin để sửa trực tiếp</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsControlsHelpOpen(false)}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer shadow-xs transition"
                >
                  Đã hiểu, tiếp tục trải nghiệm
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* SuperAdmin Edit Exhibit Modal */}
        <SuperadminExhibitEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingExhibit(null);
          }}
          exhibit={editingExhibit}
          onSave={handleSaveExhibit}
          onDelete={handleDeleteExhibit}
        />
      </motion.div>
    </div>
  );
};
