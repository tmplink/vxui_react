import { useEffect, useRef } from 'react';

export function useScrollbarSync(
  hostRef: { current: HTMLElement | null },
  scrollRef: { current: HTMLElement | null },
  enabled = true,
) {
  const draggingRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    const scroll = scrollRef.current;

    if (!host) return;

    if (!enabled || !scroll) {
      host.dataset.scrollable = 'false';
      host.dataset.scrollbarState = 'hidden';
      host.style.setProperty('--vx-scrollbar-thumb-height', '0px');
      host.style.setProperty('--vx-scrollbar-thumb-offset', '0px');
      return;
    }

    let hideTimer: number | undefined;

    const syncThumb = () => {
      const isScrollable = scroll.scrollHeight > scroll.clientHeight + 1;
      host.dataset.scrollable = isScrollable ? 'true' : 'false';

      if (!isScrollable) {
        host.dataset.scrollbarState = 'hidden';
        host.style.setProperty('--vx-scrollbar-thumb-height', '0px');
        host.style.setProperty('--vx-scrollbar-thumb-offset', '0px');
        return;
      }

      const trackHeight = Math.max(host.clientHeight - 16, 0);
      const thumbHeight = Math.max((scroll.clientHeight / scroll.scrollHeight) * trackHeight, 36);
      const maxScrollTop = scroll.scrollHeight - scroll.clientHeight;
      const maxThumbOffset = Math.max(trackHeight - thumbHeight, 0);
      const thumbOffset = maxScrollTop > 0 ? (scroll.scrollTop / maxScrollTop) * maxThumbOffset : 0;

      host.style.setProperty('--vx-scrollbar-thumb-height', `${thumbHeight}px`);
      host.style.setProperty('--vx-scrollbar-thumb-offset', `${thumbOffset}px`);

      if (host.dataset.scrollbarState !== 'active') {
        host.dataset.scrollbarState = 'hidden';
      }
    };

    const showThumb = () => {
      if (host.dataset.scrollable !== 'true') return;
      host.dataset.scrollbarState = 'active';
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => {
        host.dataset.scrollbarState = 'hidden';
      }, 640);
    };

    const handleScroll = () => {
      syncThumb();
      showThumb();
    };

    // ── Thumb drag support ──
    const thumbEl = host.querySelector<HTMLElement>('.vx-overlay-scrollbar__thumb');

    const cancelHide = () => {
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };

    const scheduleHide = () => {
      cancelHide();
      hideTimer = window.setTimeout(() => {
        host.dataset.scrollbarState = 'hidden';
      }, 640);
    };

    const onThumbMouseEnter = () => {
      cancelHide();
      host.dataset.scrollbarState = 'active';
    };

    const onThumbMouseLeave = () => {
      scheduleHide();
    };

    const onThumbMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      draggingRef.current = true;
      host.dataset.scrollbarDragging = 'true';
      cancelHide();

      // Store initial positions for delta-based calculation
      const startY = e.clientY;
      const startScrollTop = scroll.scrollTop;
      const trackHeight = Math.max(host.clientHeight - 16, 0);
      const thumbHeight = Math.max((scroll.clientHeight / scroll.scrollHeight) * trackHeight, 36);
      const maxScrollTop = scroll.scrollHeight - scroll.clientHeight;
      const maxThumbOffset = Math.max(trackHeight - thumbHeight, 0);

      const onMouseMove = (ev: MouseEvent) => {
        if (!draggingRef.current) return;
        const deltaY = ev.clientY - startY;
        if (maxThumbOffset <= 0) return;
        const scrollDelta = (deltaY / maxThumbOffset) * maxScrollTop;
        scroll.scrollTop = Math.max(0, Math.min(maxScrollTop, startScrollTop + scrollDelta));
      };

      const onMouseUp = () => {
        draggingRef.current = false;
        host.dataset.scrollbarDragging = 'false';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        scheduleHide();
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };

    if (thumbEl) {
      thumbEl.addEventListener('mousedown', onThumbMouseDown);
      thumbEl.addEventListener('mouseenter', onThumbMouseEnter);
      thumbEl.addEventListener('mouseleave', onThumbMouseLeave);
    }

    syncThumb();
    scroll.addEventListener('scroll', handleScroll, { passive: true });

    const ro = new ResizeObserver(() => syncThumb());
    ro.observe(host);
    ro.observe(scroll);

    return () => {
      scroll.removeEventListener('scroll', handleScroll);
      if (thumbEl) {
        thumbEl.removeEventListener('mousedown', onThumbMouseDown);
        thumbEl.removeEventListener('mouseenter', onThumbMouseEnter);
        thumbEl.removeEventListener('mouseleave', onThumbMouseLeave);
      }
      ro.disconnect();
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  }, [enabled, hostRef, scrollRef]);
}