import axiosApi from '~/config/axios';
import { IGetRecommendationParams } from '../types/recommendation';

export const recommendationApi = {
  getRecommendations: async (params: IGetRecommendationParams) => {
    const { userIdentifier, limit } = params;

    return await axiosApi.get(`/recommendations/${userIdentifier}`, {
      params: { limit },
    });
  },
  trainModel: async () => {
    return await axiosApi.post('/recommendations/train');
  },
};
