import axiosApi from '~/config/axios';
import {
  ICreateProductVariant,
  IGetProductOptionParams,
  IProductParams,
  IUpdateProduct,
  IUpdateProductVariant,
} from '../types/product';

export const productAPI = {
  getProducts: async (params: IProductParams) => {
    return await axiosApi.get('/products', { params });
  },
  getProductBySlug: async (slug: string) => {
    return await axiosApi.get('/products/slug', { params: { slug } });
  },
  getProductOptions: async (params: IGetProductOptionParams) => {
    return await axiosApi.get('/products/product-option', { params });
  },
  createProductVariant: async (params: ICreateProductVariant) => {
    return await axiosApi.post('/products/product-variant', params);
  },
  updateProduct: async (params: IUpdateProduct) => {
    return await axiosApi.put('/products', params);
  },
  updateProductVariant: async (params: IUpdateProductVariant) => {
    return await axiosApi.put('/products/product-variant', params);
  },
};
