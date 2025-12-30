import axiosApi from '~/config/axios';
import {
  IGetFeaturedProductParams,
  IGetRecommendationParams,
} from '../types/recommendation';

export const recommendationApi = {
  getRecommendations: async (params: IGetRecommendationParams) => {
    const { userIdentifier, limit } = params;

    return await axiosApi.get(`/recommendations/${userIdentifier}`, {
      params: { limit },
    });
  },
  getPopularProduct: async (params: IGetFeaturedProductParams) => {
    return await axiosApi.get('/recommendations/popular', { params });
  },
  trainModel: async () => {
    return await axiosApi.post('/recommendations/train');
  },
};
