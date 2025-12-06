import axiosApi from '~/config/axios';
import { IBrandParams } from '../types/brand';

export const brandApi = {
  getAllBrands: async (params: IBrandParams) => {
    return await axiosApi.get('/brands', { params });
  },
};
