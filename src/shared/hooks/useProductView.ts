import { useCallback, useEffect, useRef } from 'react';

import { viewHistoryApi } from '~/features/view-history/api/viewHistoryApi';
import { ITrackProductViewParams } from '~/features/view-history/types/viewHistory';
import { getOrCreateSessionId, getUserIdentifier } from '../utils/function';
import { notificationEmitter } from '../utils/notificationEmitter';
import { useMutation } from '@tanstack/react-query';

interface UseProductViewOptions {
  productId?: string;
  userId?: string; // Nếu user đã login
  source?: ITrackProductViewParams['source'];
  enabled?: boolean; // Có track không
}

/**
 * Hook tự động track view khi user xem product
 *
 * Features:
 * - Track view time
 * - Track scroll depth
 * - Track interactions (click images, description)
 * - Debounce updates để tránh spam API
 */
export const useProductView = ({
  productId,
  userId,
  source = 'direct',
  enabled = true,
}: UseProductViewOptions) => {
  const maxScrollDepthRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  const hasTrackedRef = useRef<boolean>(false);
  const clickedImagesRef = useRef<boolean>(false);
  const clickedDescriptionRef = useRef<boolean>(false);

  const { mutate: trackView } = useMutation({
    mutationFn: (params: ITrackProductViewParams) =>
      viewHistoryApi.trackView(params),
  });

  /**
   * Track scroll depth
   */
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / scrollHeight) * 100);

    if (scrollPercent > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = Math.min(scrollPercent, 100);
    }
  }, []);

  /**
   * Send tracking data
   */
  const sendTrackingData = useCallback(async () => {
    if (!enabled || hasTrackedRef.current) return;

    if (!productId) {
      notificationEmitter.emit(
        'error',
        '[Product View]: Không tìm thấy ID của sản phẩm'
      );
      return;
    }

    const viewDurationSeconds = Math.round(
      (Date.now() - startTimeRef.current) / 1000
    );

    // Chỉ track nếu user xem ít nhất 3 giây
    if (viewDurationSeconds < 3) return;

    try {
      const params: ITrackProductViewParams = {
        userIdentifier: getUserIdentifier(userId),
        productId,
        sessionId: getOrCreateSessionId(),
        source,
        viewDurationSeconds,
        scrollDepthPercent: maxScrollDepthRef.current,
        clickedImages: clickedImagesRef.current,
        clickedDescription: clickedDescriptionRef.current,
      };

      // await viewHistoryApi.trackView(payload);
      trackView(params);
      hasTrackedRef.current = true;
      console.log('✅ View tracked:', params);
    } catch (error) {
      console.error('Track view error:', error);
    }
  }, [productId, userId, source, enabled]);

  /**
   * Track khi user rời trang
   */
  useEffect(() => {
    if (!enabled) return;

    // Reset refs
    startTimeRef.current = Date.now();
    maxScrollDepthRef.current = 0;
    hasTrackedRef.current = false;

    clickedDescriptionRef.current = true;

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);

    // Track khi user rời trang (beforeunload)
    const handleBeforeUnload = () => sendTrackingData();
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Track sau 30 giây nếu user vẫn đang xem
    const timer = setTimeout(() => sendTrackingData(), 30000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      clearTimeout(timer);

      // Track khi unmount (user chuyển trang)
      sendTrackingData();
    };
  }, [productId, enabled, handleScroll, sendTrackingData]);

  /**
   * Helper functions để track interactions
   */
  const trackImageClick = useCallback(() => {
    clickedImagesRef.current = true;
  }, []);

  const trackDescriptionClick = useCallback(() => {
    clickedDescriptionRef.current = true;
  }, []);

  return {
    trackImageClick,
    trackDescriptionClick,
  };
};
