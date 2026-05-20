import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import svgPanZoom from 'svg-pan-zoom';
import { Tag } from '../ui/Tag';
import { ServiceCard } from '../ui/ServiceCard';
import { needHelpIcons } from '../need-help/needHelp.icons';
import type {
  NeedHelpOrganizationViewModel,
  NeedHelpServiceIcon,
} from '../need-help/needHelp.types';
import { ServiceCardSkeleton } from '../ui/ServiceCardSkeleton';
import { Skeleton } from '../ui/skeleton';
import { SvgIcon } from '../ui/SvgIcon';
import searchSvg from '../../assets/help-center/search.svg?raw';
import closeSvg from '../../assets/help-center/close.svg?raw';
import mapSvgUrl from '../../assets/map/map.svg';
import { useMapScreenState } from './useMapScreenState';

// Governorate paths in 185×220 coordinate space.
// Scaled to viewBox 0 0 250 326 via transform="scale(1.3514, 1.4818)".
const GOVERNORATES = [
  {
    iso: 'LB-BI',
    id: 'bekaa',
    nameEn: 'Beqaa',
    path: 'M89.8,171.6 L82.8,170.3 L78.4,162.4 L71.6,164.2 L67.8,170.3 L64.3,168.9 L65.4,167.0 L61.8,168.2 L69.8,141.9 L72.4,137.4 L74.7,139.0 L79.7,127.3 L83.3,127.4 L86.4,121.0 L81.1,118.3 L97.3,101.1 L106.9,105.4 L109.2,110.6 L113.3,108.1 L122.3,111.4 L101.5,138.9 L116.7,149.0 L113.1,153.0 L102.4,155.9 L103.2,162.2 L89.8,171.6 Z',
  },
  {
    iso: 'LB-BH',
    id: 'baalbek',
    nameEn: 'Baalbek-Hermel',
    path: 'M102.6,104.7 L95.1,99.2 L107.3,85.5 L110.7,72.3 L132.5,44.6 L127.6,36.3 L138.4,35.3 L138.6,31.7 L149.9,22.5 L153.2,25.7 L164.1,24.6 L165.7,29.6 L179.2,38.2 L173.9,43.0 L177.9,49.6 L182.6,51.1 L180.3,57.0 L185.4,65.8 L171.7,78.9 L170.8,84.0 L158.7,86.0 L144.0,103.6 L149.1,108.8 L154.2,109.0 L157.4,115.3 L140.2,111.6 L133.8,115.0 L128.4,111.8 L120.4,116.7 L118.1,116.1 L121.9,110.2 L113.3,108.1 L109.2,110.6 L106.9,105.4 L102.6,104.7 Z',
  },
  {
    iso: 'LB-AK',
    id: 'akkar',
    nameEn: 'Akkar',
    path: 'M106.6,7.5 L108.6,18.5 L104.0,23.8 L108.4,33.1 L124.0,32.6 L127.6,36.3 L139.0,34.8 L138.6,31.7 L147.4,23.8 L149.9,22.5 L150.3,25.2 L150.4,22.3 L160.0,17.7 L158.7,11.1 L164.6,13.2 L166.1,7.2 L156.2,7.8 L150.3,-0.3 L143.2,8.3 L113.6,8.4 L108.3,5.3 L106.6,7.5 Z',
  },
  {
    iso: 'LB-AS',
    id: 'north',
    nameEn: 'North',
    path: 'M127.2,35.5 L132.5,44.6 L113.7,71.6 L99.2,69.5 L94.7,72.2 L90.6,67.5 L78.5,68.2 L66.9,63.9 L67.0,54.8 L75.4,50.4 L77.5,42.1 L86.8,38.2 L85.7,32.0 L89.2,29.9 L97.7,30.0 L104.0,23.8 L108.7,33.4 L124.0,32.6 L127.2,35.5 Z',
  },
  {
    iso: 'LB-JL',
    id: 'beirut',
    nameEn: 'Mount Lebanon',
    path: 'M43.8,124.3 L34.8,147.7 L45.4,151.0 L60.0,147.3 L63.5,160.5 L69.8,141.9 L72.4,137.4 L74.7,139.0 L79.7,127.3 L83.3,127.4 L86.4,121.0 L81.1,118.3 L97.3,101.1 L86.6,95.3 L68.8,100.6 L60.5,98.0 L57.6,105.3 L53.7,105.3 L50.0,110.9 L46.2,110.3 L43.8,124.3 Z',
  },
  {
    iso: 'LB-NA',
    id: 'nabatieh',
    nameEn: 'Nabatieh',
    path: 'M24.3,208.3 L25.8,202.8 L33.9,198.9 L31.4,197.1 L38.4,194.2 L40.2,190.0 L37.7,187.4 L40.1,184.9 L31.3,185.3 L29.3,184.1 L32.3,179.0 L23.7,177.3 L26.2,177.8 L27.4,172.9 L34.4,176.1 L33.1,173.7 L37.1,172.2 L35.8,165.2 L38.9,166.3 L37.3,163.1 L40.3,161.2 L43.2,162.9 L54.9,158.9 L51.3,165.1 L53.5,179.6 L64.7,169.2 L67.8,170.3 L71.6,164.2 L78.4,162.4 L82.8,170.3 L89.8,171.6 L82.0,181.7 L75.2,182.7 L68.0,190.0 L63.5,189.3 L63.8,194.2 L56.7,188.0 L49.1,214.7 L30.9,219.0 L24.4,213.2 L24.3,208.3 Z',
  },
  {
    iso: 'LB-JA',
    id: 'south',
    nameEn: 'South',
    path: 'M5.7,209.3 L0.5,214.1 L24.0,212.4 L25.8,202.8 L28.2,203.8 L29.2,199.8 L33.9,198.9 L31.4,197.1 L38.4,194.2 L40.1,184.9 L31.3,185.3 L29.3,184.1 L32.3,179.0 L23.7,177.6 L26.2,177.8 L27.4,172.9 L34.4,176.1 L33.1,173.7 L37.1,172.2 L35.8,165.2 L39.9,164.8 L37.4,162.8 L54.9,158.9 L51.3,165.1 L53.5,179.6 L63.7,171.4 L65.5,167.4 L61.8,168.7 L63.7,161.3 L60.4,147.5 L45.4,151.0 L34.6,147.9 L30.6,158.1 L21.4,166.7 L17.7,182.0 L11.0,189.8 L13.6,192.9 L12.6,199.8 L5.7,209.3 Z',
  },
] as const;

type GovernorateId = (typeof GOVERNORATES)[number]['id'];

// City markers (250×326 coordinate space)
const CITY_MARKERS: {
  id: string;
  x: number;
  y: number;
  govId: GovernorateId;
  apiRegionIds: string[];
}[] = [
  { id: 'akkar', x: 183, y: 22, govId: 'akkar', apiRegionIds: ['akkar'] },
  {
    id: 'tripoli',
    x: 106,
    y: 55,
    govId: 'north',
    apiRegionIds: [
      'tripoli',
      'bcharre',
      'el-koura',
      'el-batroun',
      'el-minieh-dennie',
    ],
  },
  {
    id: 'beirut',
    x: 60,
    y: 155,
    govId: 'beirut',
    apiRegionIds: ['beirut', 'aley', 'baabda', 'chouf', 'el-meten', 'jbeil'],
  },
  {
    id: 'bekaa',
    x: 132,
    y: 200,
    govId: 'bekaa',
    apiRegionIds: ['zahle', 'west-bekaa', 'rachaya'],
  },
  {
    id: 'baalbek',
    x: 182,
    y: 130,
    govId: 'baalbek',
    apiRegionIds: ['baalbek', 'el-hermel'],
  },
  {
    id: 'south',
    x: 35,
    y: 270,
    govId: 'south',
    apiRegionIds: ['saida', 'sour', 'jezzine'],
  },
  {
    id: 'nabatieh',
    x: 70,
    y: 232,
    govId: 'nabatieh',
    apiRegionIds: ['el-nabatieh', 'bent-jbeil', 'hasbaya'],
  },
];

const FILTER_IDS = ['clothes', 'shelter', 'medical', 'food', 'nearby'] as const;
type FilterId = (typeof FILTER_IDS)[number];

const FILTER_ICONS: Record<FilterId, keyof typeof needHelpIcons> = {
  clothes: 'clothes',
  shelter: 'shelter',
  medical: 'medical',
  food: 'food',
  nearby: 'locationPin',
};

// SVG path data for sector icons (24×24 viewBox)
const SECTOR_SVG_PATHS: Record<NeedHelpServiceIcon, string[]> = {
  medical: [
    'M12 20s-6-3.8-6-9a3.5 3.5 0 0 1 6-2.2A3.5 3.5 0 0 1 18 11c0 5.2-6 9-6 9Z',
    'M12 9v4',
    'M10 11h4',
  ],
  shelter: ['M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z'],
  food: [
    'M5 4v8',
    'M8 4v8',
    'M5 8h3',
    'M6.5 12v8',
    'M15 4v7',
    'M18.5 4c0 5-1.5 7-3.5 7',
    'M15 11v9',
  ],
  clothes: [
    'M9 5c.7 1 1.8 1.5 3 1.5S14.3 6 15 5l4 2.5-2 4-2-1V20H9v-9.5l-2 1-2-4z',
  ],
};

// Approximate bounding boxes for each governorate in 250×326 SVG space
// (paths are in 185×220 space, scaled by 1.3514×1.4818)
const GOV_BOUNDS: Record<
  GovernorateId,
  { x1: number; y1: number; x2: number; y2: number }
> = {
  akkar: { x1: 130, y1: 12, x2: 210, y2: 48 },
  north: { x1: 75, y1: 40, x2: 160, y2: 102 },
  baalbek: { x1: 138, y1: 38, x2: 240, y2: 162 },
  bekaa: { x1: 90, y1: 155, x2: 155, y2: 248 },
  beirut: { x1: 50, y1: 148, x2: 118, y2: 228 },
  nabatieh: { x1: 38, y1: 240, x2: 110, y2: 318 },
  south: { x1: 8, y1: 224, x2: 72, y2: 310 },
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pinsForZoom(zoom: number): number {
  if (zoom < 1.5) return 6;
  if (zoom < 2.5) return 14;
  if (zoom < 4) return 25;
  if (zoom < 6) return 38;
  return 50;
}

function OrgPins({
  orgs,
  govId,
  maxPins,
}: {
  orgs: NeedHelpOrganizationViewModel[];
  govId: GovernorateId;
  maxPins: number;
}) {
  const bounds = GOV_BOUNDS[govId];
  const visible = orgs.slice(0, maxPins);
  return (
    <>
      {visible.map((org, index) => {
        const h = hashString(org.id + String(index));
        const h2 = hashString(String(index) + org.id);
        const x = bounds.x1 + ((h % 1000) / 1000) * (bounds.x2 - bounds.x1);
        const y = bounds.y1 + ((h2 % 1000) / 1000) * (bounds.y2 - bounds.y1);
        const icon = org.icon;
        return (
          <g key={org.id} transform={`translate(${x}, ${y})`}>
            <rect
              x={-11}
              y={-11}
              width={22}
              height={22}
              rx={5}
              ry={5}
              fill="white"
              stroke="#d1d5db"
              strokeWidth={0.9}
              filter="url(#pin-shadow)"
            />
            <g
              transform="translate(-6,-6) scale(0.5)"
              fill="none"
              stroke="#374151"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {SECTOR_SVG_PATHS[icon].map((d, j) => (
                <path key={j} d={d} />
              ))}
            </g>
            <polygon
              points="0,13 -4,9 4,9"
              fill="white"
              stroke="#d1d5db"
              strokeWidth={0.7}
            />
          </g>
        );
      })}
    </>
  );
}

function LebanonSvgMap({
  activeGovId,
  onGovClick,
  regionCounts,
  onZoomChange,
  selectedOrgs,
  onPanZoomReady,
}: {
  activeGovId: GovernorateId | null;
  onGovClick: (id: GovernorateId) => void;
  regionCounts: Record<string, number>;
  onZoomChange: (scale: number) => void;
  selectedOrgs: NeedHelpOrganizationViewModel[];
  onPanZoomReady: (instance: SvgPanZoom.Instance) => void;
}) {
  const { t } = useTranslation();
  const svgRef = useRef<SVGSVGElement>(null);
  const panZoomRef = useRef<SvgPanZoom.Instance | null>(null);
  const onZoomChangeRef = useRef(onZoomChange);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  useEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  }, [onZoomChange]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const instance = svgPanZoom(el, {
      zoomEnabled: true,
      panEnabled: true,
      controlIconsEnabled: false,
      fit: false,
      center: true,
      minZoom: 0.6,
      maxZoom: 20,
      zoomScaleSensitivity: 0.3,
      preventMouseEventsDefault: true,
      onZoom(newScale: number) {
        setZoomScale(newScale);
        onZoomChangeRef.current(newScale);
      },
    });

    panZoomRef.current = instance;
    onPanZoomReady(instance);
    return () => {
      instance.destroy();
      panZoomRef.current = null;
    };
  }, [onPanZoomReady]);

  const isTap = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return false;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    return Math.sqrt(dx * dx + dy * dy) < 8;
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 250 326"
        aria-label={t('map.title')}
        style={{ display: 'block', width: '100%', height: '100%' }}
        onPointerDown={(e) => {
          pointerStartRef.current = { x: e.clientX, y: e.clientY };
        }}
      >
        <defs>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="1"
              stdDeviation="1.5"
              floodColor="#00000030"
            />
          </filter>
          <filter id="gov-active" x="0" y="0" width="1" height="1">
            <feFlood floodColor="#5a9e3a" floodOpacity="0.45" result="color" />
            <feComposite in="color" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        <g>
          <image href={mapSvgUrl} x="0" y="0" width="250" height="326" />

          <g transform="scale(1.3514, 1.4818)">
            {GOVERNORATES.map(({ id, nameEn, path }) => (
              <path
                key={id}
                d={path}
                fill="transparent"
                fillOpacity={1}
                stroke="none"
                role="button"
                aria-label={nameEn}
                aria-pressed={activeGovId === id}
                style={{ cursor: 'pointer' }}
                onPointerUp={(e) => {
                  if (isTap(e)) onGovClick(id);
                }}
              />
            ))}
          </g>

          {/* Org pins spread across the active governorate — count grows with zoom */}
          {activeGovId && selectedOrgs.length > 0 && (
            <OrgPins
              orgs={selectedOrgs}
              govId={activeGovId}
              maxPins={pinsForZoom(zoomScale)}
            />
          )}

          {/* City circle markers — hidden once a governorate is selected */}
          {!activeGovId &&
            CITY_MARKERS.map((marker) => {
              const count = marker.apiRegionIds.reduce(
                (sum, id) => sum + (regionCounts[id] ?? 0),
                0
              );
              const name = t(`map.cities.${marker.id}`);
              return (
                <g
                  key={marker.id}
                  style={{ cursor: 'pointer' }}
                  onPointerUp={(e) => {
                    if (isTap(e)) onGovClick(marker.govId);
                  }}
                >
                  <g filter="url(#pin-shadow)">
                    <circle
                      cx={marker.x}
                      cy={marker.y}
                      r="20"
                      fill="white"
                      stroke="#9ca3af"
                      strokeWidth={1.5}
                    />
                    <text
                      x={marker.x}
                      y={marker.y - 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill="#111827"
                    >
                      {count}
                    </text>
                    <text
                      x={marker.x}
                      y={marker.y + 9}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="6.5"
                      fontWeight="500"
                      fill="#374151"
                    >
                      {name}
                    </text>
                  </g>
                </g>
              );
            })}
        </g>
      </svg>
    </div>
  );
}

// Sheet heights
const COLLAPSED_HEIGHT = 128; // drag handle + header row only (no content)
const PEEK_HEIGHT = 300; // drag handle + header + a few cards
const FULL_HEIGHT_EXPR = (tabBarH: number) =>
  `calc(100dvh - ${tabBarH}px - 32px)`;
const DRAG_THRESHOLD = 60; // px needed to change mode
// Approximate height of the bottom tab bar + safe area
const TAB_BAR_HEIGHT = 96;

type SheetMode = 'collapsed' | 'peek' | 'expanded';

function MapPeekSheet({
  open,
  cityName,
  orgCount,
  organizations,
  isLoading,
  isLoadingMore,
  hasMore,
  onLoadMore,
  isAr,
  onClose,
}: {
  open: boolean;
  cityName: string;
  orgCount: number;
  organizations: NeedHelpOrganizationViewModel[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  isAr: boolean;
  onClose: () => void;
}) {
  const [presented, setPresented] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [mode, setMode] = useState<SheetMode>('peek');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartYRef = useRef<number | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animate sheet out, then notify parent to clear activeGovId
  const triggerClose = useCallback(() => {
    if (exitTimerRef.current) return; // already closing
    setIsExiting(true);
    setDragOffset(0);
    exitTimerRef.current = setTimeout(() => {
      exitTimerRef.current = null;
      onClose();
    }, 340);
  }, [onClose]);

  // Entry animation: component mounts fresh each time (if (!open) return null unmounts it),
  // so state is already reset. We only need to trigger the slide-in animation.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPresented(true))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(
    () => () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    },
    []
  );

  if (!open) return null;

  // Base height per mode; grows upward while dragging up
  const baseHeight =
    mode === 'expanded'
      ? FULL_HEIGHT_EXPR(TAB_BAR_HEIGHT)
      : mode === 'peek'
        ? `${PEEK_HEIGHT}px`
        : `${COLLAPSED_HEIGHT}px`;

  const sheetHeight =
    mode !== 'expanded' && dragOffset < 0
      ? `${(mode === 'peek' ? PEEK_HEIGHT : COLLAPSED_HEIGHT) + Math.abs(dragOffset)}px`
      : baseHeight;

  // Slide out on exit; slide in once presented; otherwise off-screen
  const translateY = isExiting
    ? '100%'
    : presented
      ? `${Math.max(0, dragOffset)}px`
      : '100%';

  const dragHandlers = (allowExpand: boolean) => ({
    onPointerDown: (e: React.PointerEvent) => {
      dragStartYRef.current = e.clientY;
      setIsDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (dragStartYRef.current === null || isExiting) return;
      const diff = e.clientY - dragStartYRef.current;
      if (mode !== 'expanded' && allowExpand && diff < 0) {
        const maxGrow =
          mode === 'peek'
            ? -(window.innerHeight - TAB_BAR_HEIGHT - PEEK_HEIGHT - 32)
            : -(PEEK_HEIGHT - COLLAPSED_HEIGHT);
        setDragOffset(Math.max(diff, maxGrow));
      } else if (diff > 0) {
        setDragOffset(diff);
      }
    },
    onPointerUp: (e: React.PointerEvent) => {
      if (dragStartYRef.current === null) return;
      const diff = e.clientY - dragStartYRef.current;
      dragStartYRef.current = null;
      setIsDragging(false);
      setDragOffset(0);

      if (mode === 'expanded') {
        if (diff >= DRAG_THRESHOLD) setMode('peek');
      } else if (mode === 'peek') {
        if (allowExpand && diff <= -DRAG_THRESHOLD) setMode('expanded');
        else if (diff >= DRAG_THRESHOLD) setMode('collapsed');
      } else {
        // collapsed
        if (diff <= -DRAG_THRESHOLD) setMode('peek');
        else if (diff >= DRAG_THRESHOLD) triggerClose();
      }
    },
    onPointerCancel: () => {
      dragStartYRef.current = null;
      setIsDragging(false);
      setDragOffset(0);
    },
  });

  const PhoneIcon = needHelpIcons.phone;
  const WhatsappIcon = needHelpIcons.whatsapp;

  const orgCountLabel = isAr
    ? `${orgCount.toString()} منظمة`
    : `${orgCount.toString()} organizations`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="false"
      aria-label={cityName}
      dir={isAr ? 'rtl' : 'ltr'}
      style={{
        position: 'fixed',
        bottom: TAB_BAR_HEIGHT,
        left: 0,
        right: 0,
        height: sheetHeight,
        transform: `translateY(${translateY})`,
        transition: isDragging
          ? 'none'
          : 'height 340ms cubic-bezier(0.22,1,0.36,1), transform 340ms cubic-bezier(0.22,1,0.36,1)',
        borderRadius: '24px 24px 0 0',
        background: 'var(--color-surface-primary, #fcfbfa)',
        boxShadow: '0 -8px 32px rgba(13,14,16,0.14)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Drag handle — swipe up to expand, swipe down to close/collapse */}
      <div
        aria-hidden="true"
        className="flex w-full touch-none select-none items-center justify-center pb-4 pt-12"
        {...dragHandlers(true)}
      >
        <div className="h-1.5 w-48 rounded-full bg-solid-black-400" />
      </div>

      {/* Header — also draggable */}
      <div
        className="flex items-start justify-between gap-12 px-16 pb-12 touch-none select-none"
        {...dragHandlers(true)}
      >
        <div className="flex flex-col gap-1">
          <p className="text-xl font-weight-medium text-text-black">
            {cityName}
          </p>
          <p className="text-button font-weight-regular text-textfield-default-text">
            {orgCountLabel}
          </p>
        </div>
        <button
          type="button"
          aria-label={isAr ? 'إغلاق' : 'Close'}
          onClick={triggerClose}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex size-24 shrink-0 items-center justify-center text-solid-black-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
        >
          <SvgIcon svg={closeSvg} className="size-16" />
        </button>
      </div>

      <div className="w-full border-t border-solid-black-300" />

      {/*
       * Scroll viewport hidden in collapsed mode so only the header is visible.
       * In peek/expanded modes it's a normal scrollable flex child.
       */}
      <div
        className="min-h-0 flex-1 overflow-y-auto"
        style={{
          overscrollBehavior: 'contain',
          display: mode === 'collapsed' ? 'none' : undefined,
        }}
        onScroll={(e) => {
          if (!hasMore || isLoadingMore) return;
          const el = e.currentTarget;
          if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
            onLoadMore();
          }
        }}
      >
        <div className="flex flex-col gap-12 px-16 py-16">
          {isLoading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <ServiceCardSkeleton key={i} />
              ))}
            </>
          ) : organizations.length === 0 ? (
            <p className="py-16 text-center text-button font-weight-regular text-textfield-default-text">
              {isAr
                ? 'لا توجد منظمات في هذه المنطقة'
                : 'No organizations in this area'}
            </p>
          ) : (
            <>
              {organizations.map((org) => (
                <ServiceCard
                  key={org.id}
                  title={org.title}
                  category={org.category}
                  description={org.description}
                  locationsArray={org.locations}
                  moreLocationsLabel={(count) =>
                    isAr ? `+${count} أخرى` : `+${count} more`
                  }
                  locationsDialogTitle={org.title}
                  locationsDialogCloseLabel={isAr ? 'إغلاق' : 'Close'}
                  actionLabel={org.actionLabel}
                  actionIcon={
                    org.actionType === 'phone' ? (
                      <PhoneIcon />
                    ) : (
                      <WhatsappIcon />
                    )
                  }
                  actionVariant={
                    org.actionType === 'phone' ? 'filled' : 'success'
                  }
                  actionDisabled={org.actionDisabled}
                  onActionClick={() => {
                    if (!org.actionDisabled && org.actionHref) {
                      window.location.href = org.actionHref;
                    }
                  }}
                />
              ))}
              {isLoadingMore && (
                <>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <ServiceCardSkeleton key={`more-${i}`} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

function MapScreenSkeleton() {
  return (
    <section className="flex flex-col gap-16 px-16 pt-20">
      {/* Search bar */}
      <Skeleton className="h-40 w-full rounded-md" />

      {/* Filter chips */}
      <div className="flex items-center gap-8">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-72 shrink-0 rounded-full" />
        ))}
      </div>

      {/* Map area */}
      <Skeleton
        className="w-full rounded-md"
        style={{ height: 'max(280px, calc(100dvh - 340px))' }}
      />
    </section>
  );
}

export default function MapScreen() {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language ?? 'ar';
  const isAr = language.startsWith('ar');

  const {
    query,
    setQuery,
    activeFilter,
    activeGovId,
    regionCounts,
    isLoading,
    selectedOrgs,
    isLoadingOrgs,
    isLoadingMoreOrgs,
    hasMoreOrgs,
    loadMoreOrgs,
    handleToggleFilter,
    handleGovClick,
  } = useMapScreenState();

  const [panZoom, setPanZoom] = useState<SvgPanZoom.Instance | null>(null);
  const handlePanZoomReady = useCallback((instance: SvgPanZoom.Instance) => {
    setPanZoom(instance);
  }, []);
  const handleZoomChange = () => {};

  const handleZoomIn = useCallback(() => panZoom?.zoomIn(), [panZoom]);
  const handleZoomOut = useCallback(() => panZoom?.zoomOut(), [panZoom]);

  if (isLoading) return <MapScreenSkeleton />;

  // Find city name for the active governorate
  const activeMarker = CITY_MARKERS.find((m) => m.govId === activeGovId);
  const cityName = activeMarker ? t(`map.cities.${activeMarker.id}`) : '';

  // Org count: always use regionCounts sum to match the pin number
  const orgCount =
    activeMarker?.apiRegionIds.reduce(
      (sum, id) => sum + (regionCounts[id] ?? 0),
      0
    ) ?? 0;

  return (
    <section className="flex flex-col gap-16 px-16 pt-20">
      <label htmlFor="map-search" className="sr-only">
        {t('map.searchPlaceholder')}
      </label>
      <div className="flex h-40 items-center gap-8 rounded-md border border-textfield-default-stroke bg-textfield-bg px-12">
        <span
          className="flex size-20 items-center justify-center text-textfield-icon"
          aria-hidden="true"
        >
          <SvgIcon svg={searchSvg} className="size-20" />
        </span>
        <input
          id="map-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('map.searchPlaceholder')}
          className="min-w-0 flex-1 bg-transparent text-start text-button font-weight-regular text-textfield-value placeholder:text-textfield-default-text outline-none"
        />
      </div>

      <section
        aria-label={isAr ? 'تصفية الخريطة' : 'Map filters'}
        className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex w-max items-center gap-8">
          {FILTER_IDS.map((id) => {
            const Icon = needHelpIcons[FILTER_ICONS[id]];
            return (
              <Tag
                key={id}
                leadingIcon={<Icon />}
                className={[
                  'shrink-0 cursor-pointer',
                  activeFilter === id
                    ? 'border-solid-primary-400 bg-solid-primary-300 text-solid-black-600'
                    : '',
                ].join(' ')}
                onClick={() => handleToggleFilter(id)}
              >
                {t(`map.filters.${id}`)}
              </Tag>
            );
          })}
        </div>
      </section>

      <div
        className="relative overflow-hidden rounded-md"
        style={{ height: 'max(280px, calc(100dvh - 340px))' }}
      >
        <LebanonSvgMap
          activeGovId={activeGovId as GovernorateId | null}
          onGovClick={handleGovClick as (id: GovernorateId) => void}
          regionCounts={regionCounts}
          onZoomChange={handleZoomChange}
          selectedOrgs={selectedOrgs}
          onPanZoomReady={handlePanZoomReady}
        />

        {/* Zoom buttons — outside overflow-hidden SVG, always visible */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            zIndex: 10,
          }}
        >
          {(
            [
              { label: '+', ariaKey: 'map.zoomIn', action: handleZoomIn },
              { label: '−', ariaKey: 'map.zoomOut', action: handleZoomOut },
            ] as const
          ).map(({ label, ariaKey, action }) => (
            <button
              key={label}
              onClick={action}
              aria-label={t(ariaKey)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                border: '1.5px solid #d1d5db',
                background: 'white',
                fontSize: 18,
                fontWeight: 600,
                lineHeight: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px #00000022',
                color: '#374151',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <MapPeekSheet
        open={activeGovId !== null}
        cityName={cityName}
        orgCount={orgCount}
        organizations={selectedOrgs}
        isLoading={isLoadingOrgs}
        isLoadingMore={isLoadingMoreOrgs}
        hasMore={hasMoreOrgs}
        onLoadMore={() => {
          void loadMoreOrgs();
        }}
        isAr={isAr}
        onClose={() => handleGovClick(activeGovId!)}
      />
    </section>
  );
}
