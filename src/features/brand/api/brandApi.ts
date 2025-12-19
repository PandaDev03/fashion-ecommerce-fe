import axiosApi from '~/config/axios';
import {
  IBrandParams,
  ICreateBrandParams,
  IDeleteManyBrandParams,
  IUpdateBrandParams,
} from '../types/brand';

export const brandApi = {
  getAll: async (params: IBrandParams) => {
    return await axiosApi.get('/brands', { params });
  },
  getBrandOptions: async () => {
    return await axiosApi.get('/brands/options');
  },
  createBrand: async (params: ICreateBrandParams) => {
    return await axiosApi.post('/brands', params);
  },
  updateBrand: async (params: IUpdateBrandParams) => {
    return await axiosApi.put('/brands', params);
  },
  deleteBrand: async (id: string) => {
    return await axiosApi.delete(`/brands/${id}`);
  },
  deleteManyBrand: async (params: IDeleteManyBrandParams) => {
    return await axiosApi.delete('/brands/many', { data: params } as any);
  },
};
