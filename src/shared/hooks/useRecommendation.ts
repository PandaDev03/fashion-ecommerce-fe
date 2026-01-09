import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { IProduct } from '~/features/products/types/product';
import { recommendationApi } from '~/features/recommendation/api/recommendationApi';
import { IGetRecommendationParams } from '~/features/recommendation/types/recommendation';
import { getUserIdentifier } from '../utils/function';
import { useAppSelector } from './useStore';

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
  const [products, setProducts] = useState<IProduct[]>([]);
  const { loading: userLoading } = useAppSelector((state) => state.user);

  const { mutate: getRecommendations, isPending: loading } = useMutation({
    mutationFn: (params: IGetRecommendationParams) =>
      recommendationApi.getRecommendations(params),
    onSuccess: (response) => {
      const products = response?.data;
      setProducts(products ?? []);
    },
  });

  useEffect(() => {
    if (!enabled || userLoading) return;

    const userIdentifier = getUserIdentifier(userId);
    getRecommendations({ userIdentifier, limit });
  }, [userId, limit, enabled, userLoading]);

  const refresh = async () => {
    const userIdentifier = getUserIdentifier(userId);
    getRecommendations({ userIdentifier, limit });
  };

  return {
    products,
    loading,
    refresh,
  };
};
