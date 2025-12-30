import axiosApi from '~/config/axios';
import {
  IGetUserHistoryParams,
  ITrackProductViewParams,
} from '../types/viewHistory';

export const viewHistoryApi = {
  trackView: async (params: ITrackProductViewParams) => {
    return await axiosApi.post('/product-view-history/track', params);
  },
  getUserHistory: async (params: IGetUserHistoryParams) => {
    const { userIdentifier, limit } = params;

    return await axiosApi.get(`/product-view-history/${userIdentifier}`, {
      params: { limit },
    });
  },
};
