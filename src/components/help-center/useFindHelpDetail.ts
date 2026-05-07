import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseFindHelpDetailResult {
  detailId: string | null;
  openDetail: (id: string, triggerEl?: HTMLElement | null) => void;
  closeDetail: () => void;
  isOpen: boolean;
}

export function useFindHelpDetail(): UseFindHelpDetailResult {
  const [detailId, setDetailId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const openDetail = useCallback(
    (id: string, triggerEl?: HTMLElement | null) => {
      triggerRef.current = triggerEl ?? null;
      setDetailId(id);
    },
    []
  );

  const closeDetail = useCallback(() => {
    setDetailId(null);
  }, []);

  useEffect(() => {
    if (detailId !== null) return;
    const trigger = triggerRef.current;
    if (trigger && typeof trigger.focus === 'function') {
      trigger.focus();
    }
    triggerRef.current = null;
  }, [detailId]);

  return {
    detailId,
    openDetail,
    closeDetail,
    isOpen: detailId !== null,
  };
}
