import { useEffect } from 'react';

export function useScrollbarSync(
  hostRef: { current: HTMLElement | null },
  scrollRef: { current: HTMLElement | null },
  enabled = true,
) {
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

    syncThumb();
    scroll.addEventListener('scroll', handleScroll, { passive: true });

    const ro = new ResizeObserver(() => syncThumb());
    ro.observe(host);
    ro.observe(scroll);

    return () => {
      scroll.removeEventListener('scroll', handleScroll);
      ro.disconnect();
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
    };
  }, [enabled, hostRef, scrollRef]);
}