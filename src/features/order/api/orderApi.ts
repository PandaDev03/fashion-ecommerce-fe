import axiosApi from '~/config/axios';
import { ICreateOrder, IMigrateOrder } from '../types/order';

export const orderApi = {
  createOrder: async (params: ICreateOrder) => {
    return await axiosApi.post('/orders', params);
  },
  migrateOrder: async (params: IMigrateOrder) => {
    return await axiosApi.post('/orders/migrate', params);
  },
  getOrderByNumber: async (orderNumber: string) => {
    return await axiosApi.get(`/orders/number/${orderNumber}`);
  },
};
