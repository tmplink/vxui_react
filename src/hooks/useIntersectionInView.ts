/**
 * useIntersectionInView — 监听元素是否在视口内的自定义 Hook
 * 带实例缓存，避免重复创建 Observer
 */
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseIntersectionInViewOptions {
  /** 根元素选择器，默认为 null（视口） */
  root?: string;
  /** 偏移量，默认 '-72px 0px 0px 0px' */
  rootMargin?: string;
  /** 触发阈值，0 = 只要有一个像素可见即触发 */
  threshold?: number;
}

interface UseIntersectionInViewReturn {
  /** 元素引用 (useRef 风格，传入 DOM 节点) */
  ref: React.RefCallback<HTMLElement | null>;
  /** 是否在视口内 */
  isInView: boolean;
}

/**
 * 缓存的 IntersectionObserver 实例 Map
 * key: options.rootMargin
 */
const observerCache = new Map<string, IntersectionObserver>();

export function useIntersectionInView(options: UseIntersectionInViewOptions = {}): UseIntersectionInViewReturn {
  const { rootMargin = '-72px 0px 0px 0px', threshold = 0 } = options;
  const [isInView, setIsInView] = useState(true); // 默认在视口内
  const refContainer = useRef<HTMLElement | null>(null);

  // 创建或获取缓存的 Observer
  useEffect(() => {
    let observer = observerCache.get(rootMargin);
    if (!observer) {
      observer = new IntersectionObserver(
        ([entry]) => {
          const newValue = entry?.isIntersecting ?? true;
          setIsInView(newValue);
        },
        { rootMargin, threshold },
      );
      observerCache.set(rootMargin, observer);
    }

    const target = refContainer.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [rootMargin, threshold]);

  // 返回 RefCallback — React 会在挂载/卸载时调用
  const refCallback: React.RefCallback<HTMLElement | null> = useCallback((node) => {
    refContainer.current = node;
  }, []);

  return { ref: refCallback, isInView };
}

/**
 * 清除所有缓存的 Observer（用于测试或极端内存优化场景）
 */
export function clearIntersectionObserverCache() {
  observerCache.forEach((observer) => observer.disconnect());
  observerCache.clear();
}