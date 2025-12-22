import axiosApi from '~/config/axios';
import {
  ICreateProductVariant,
  IDeleteManyProduct,
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

  createProduct: async (data: FormData) => {
    return await axiosApi.post('/products', data, {
      timeout: 60000,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  createProductVariant: async (params: ICreateProductVariant) => {
    return await axiosApi.post('/products/product-variant', params, {
      timeout: 20000,
    });
  },

  updateProduct: async (params: IUpdateProduct) => {
    return await axiosApi.put('/products', params, { timeout: 20000 } as any);
  },
  updateProductVariant: async (params: IUpdateProductVariant) => {
    return await axiosApi.put('/products/product-variant', params, {
      timeout: 20000,
    } as any);
  },

  deleteProduct: async (id: string) => {
    return await axiosApi.delete(`/products/${id}`, { timeout: 20000 } as any);
  },
  deleteManyProduct: async (params: IDeleteManyProduct) => {
    return await axiosApi.delete('/products/many', {
      data: params,
      timeout: 20000,
    } as any);
  },
  deleteProductVariant: async (variantIds: string | string[]) => {
    return await axiosApi.delete('/products/product-variant', {
      timeout: 20000,
      data: { variantIds },
    } as any);
  },
};
