import { useRef, useCallback, useEffect } from 'react';

/**
 * Unified drag-drop for kanban cards.
 * Supports both HTML5 drag API (desktop) and touch events (mobile).
 */
export function useDragDrop({ onDrop, enabled }) {
  const draggedRef = useRef(null);
  const cloneRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0 });

  // Desktop drag handlers
  const handleDragStart = useCallback(
    (e, issueNo, category) => {
      if (!enabled) return;
      draggedRef.current = { issueNo, category };
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', issueNo);
      e.currentTarget.classList.add('opacity-50', 'rotate-2');
    },
    [enabled],
  );

  const handleDragEnd = useCallback((e) => {
    e.currentTarget.classList.remove('opacity-50', 'rotate-2');
    draggedRef.current = null;
  }, []);

  const handleDragOver = useCallback(
    (e, category) => {
      if (!enabled || !draggedRef.current) return;
      e.preventDefault();
      if (draggedRef.current.category === category) {
        e.currentTarget.classList.add('bg-accent/5');
        e.dataTransfer.dropEffect = 'move';
      }
    },
    [enabled],
  );

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('bg-accent/5');
  }, []);

  const handleDrop = useCallback(
    (e, category, statusKey) => {
      e.preventDefault();
      e.currentTarget.classList.remove('bg-accent/5');
      if (!draggedRef.current || draggedRef.current.category !== category) return;
      onDrop(draggedRef.current.issueNo, statusKey);
      draggedRef.current = null;
    },
    [onDrop],
  );

  // Touch handlers
  const handleTouchStart = useCallback(
    (e, issueNo, category) => {
      if (!enabled) return;
      draggedRef.current = { issueNo, category, el: e.currentTarget };
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    },
    [enabled],
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!draggedRef.current) return;
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - touchStartRef.current.x);
      const dy = Math.abs(touch.clientY - touchStartRef.current.y);

      if (dx > 10 || dy > 10) {
        e.preventDefault();

        if (!cloneRef.current) {
          const el = draggedRef.current.el;
          const clone = el.cloneNode(true);
          clone.style.cssText =
            `position:fixed;z-index:9999;width:${el.offsetWidth}px;opacity:0.85;pointer-events:none;transform:rotate(2deg)`;
          document.body.appendChild(clone);
          cloneRef.current = clone;
          el.style.opacity = '0.3';
        }

        cloneRef.current.style.left =
          touch.clientX - draggedRef.current.el.offsetWidth / 2 + 'px';
        cloneRef.current.style.top = touch.clientY - 20 + 'px';

        // Highlight columns
        document
          .querySelectorAll('[data-kanban-col].bg-accent/5')
          .forEach((c) => c.classList.remove('bg-accent/5'));
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (target) {
          const col = target.closest('[data-kanban-col]');
          if (col && col.dataset.category === draggedRef.current.category) {
            col.classList.add('bg-accent/5');
          }
        }
      }
    },
    [],
  );

  const handleTouchEnd = useCallback(
    (e) => {
      if (!draggedRef.current || !cloneRef.current) {
        draggedRef.current = null;
        return;
      }

      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target) {
        const col = target.closest('[data-kanban-col]');
        if (col && col.dataset.category === draggedRef.current.category) {
          onDrop(draggedRef.current.issueNo, col.dataset.statusKey);
        }
      }

      document
        .querySelectorAll('[data-kanban-col].bg-accent/5')
        .forEach((c) => c.classList.remove('bg-accent/5'));
      draggedRef.current.el.style.opacity = '';
      if (cloneRef.current?.parentNode) {
        cloneRef.current.parentNode.removeChild(cloneRef.current);
      }
      cloneRef.current = null;
      draggedRef.current = null;
    },
    [onDrop],
  );

  // Global touch listeners
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e) => handleTouchMove(e);
    const onEnd = (e) => handleTouchEnd(e);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onEnd);
    };
  }, [enabled, handleTouchMove, handleTouchEnd]);

  return {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTouchStart,
  };
}
