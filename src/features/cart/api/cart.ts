import axiosApi from '~/config/axios';
import { IGetCartItems } from '../types/cart';

export const cartApi = {
  getCartItems: async (params: IGetCartItems) => {
    return await axiosApi.post('/carts', params);
  },
};
