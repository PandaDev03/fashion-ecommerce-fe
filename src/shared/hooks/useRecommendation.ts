import { useEffect, useState } from 'react';

import { IProduct } from '~/features/products/types/product';
import { recommendationApi } from '~/features/recommendation/api/recommendationApi';
import { getUserIdentifier } from '../utils/function';
import { useMutation } from '@tanstack/react-query';
import { IGetRecommendationParams } from '~/features/recommendation/types/recommendation';

interface UseRecommendationsOptions {
  userId?: string;
  limit?: number;
  enabled?: boolean;
}

export const useRecommendations = ({
  userId,
  limit = 10,
  enabled = true,
}: UseRecommendationsOptions = {}) => {
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);

  //   const [products, setProducts] = useState<IRecommendationProduct[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);

  const { mutate: getRecommendations, isPending: loading } = useMutation({
    mutationFn: (params: IGetRecommendationParams) =>
      recommendationApi.getRecommendations(params),
    onSuccess: (response) => {
      console.log('recommendation', response);
      setProducts(response);
    },
  });

  useEffect(() => {
    if (!enabled) return;

    // const fetchRecommendations = async () => {
    //   setLoading(true);
    //   setError(null);

    //   try {
    //     const userIdentifier = getUserIdentifier(userId);
    //     const data = await recommendationApi.getRecommendations({
    //       userIdentifier,
    //       limit,
    //     });

    //     setProducts(data);
    //   } catch (err) {
    //     console.error('Fetch recommendations error:', err);
    //     setError('Không thể tải sản phẩm đề xuất');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchRecommendations();

    const userIdentifier = getUserIdentifier(userId);
    getRecommendations({ userIdentifier, limit });
  }, [userId, limit, enabled]);

  const refresh = async () => {
    // setLoading(true);
    // setError(null);

    // try {
    //   const userIdentifier = getUserIdentifier(userId);
    //   const data = await recommendationApi.getRecommendations({
    //     userIdentifier,
    //     limit,
    //   });

    //   setProducts(data);
    // } catch (err) {
    //   console.error('Refresh recommendations error:', err);
    //   setError('Không thể tải sản phẩm đề xuất');
    // } finally {
    //   setLoading(false);
    // }

    const userIdentifier = getUserIdentifier(userId);
    getRecommendations({ userIdentifier, limit });
  };

  return {
    products,
    loading,
    // error,
    refresh,
  };
};
