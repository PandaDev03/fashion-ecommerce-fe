import axiosApi from '~/config/axios';
import {
  ICategoryParams,
  ICreateCategoryParams,
  IDeleteManyCategoryParams,
  IUpdateCategoryParams,
} from '../types/category';

export const categoryApi = {
  getAll: async (params: ICategoryParams) => {
    return await axiosApi.get('/categories', { params });
  },
  getAllParents: async () => {
    return await axiosApi.get('/categories/parents');
  },
  getCategoryOptions: async () => {
    return await axiosApi.get('/categories/options');
  },
  createCategory: async (params: ICreateCategoryParams) => {
    return await axiosApi.post('/categories', params);
  },
  updateCategory: async (params: IUpdateCategoryParams) => {
    return await axiosApi.put('/categories', params);
  },
  deleteCategory: async (id: string) => {
    return await axiosApi.delete(`/categories/${id}`);
  },
  deleteManyCategory: async (params: IDeleteManyCategoryParams) => {
    return await axiosApi.delete('/categories/many', { data: params } as any);
  },
};
