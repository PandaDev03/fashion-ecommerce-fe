import axiosApi from '~/config/axios';
import {
  ICreateOrder,
  IMigrateOrder,
  IOrderParams,
  IUpdateOrderStatus,
} from '../types/order';

export const orderApi = {
  createOrder: async (params: ICreateOrder) => {
    return await axiosApi.post('/orders', params, { timeout: 40000 });
  },
  migrateOrder: async (params: IMigrateOrder) => {
    return await axiosApi.post('/orders/migrate', params);
  },
  getAll: async (params: IOrderParams) => {
    return await axiosApi.get('/orders', { params });
  },
  getOrderByUserId: async () => {
    return await axiosApi.get('/orders/user');
  },
  getOrderByNumber: async (orderNumber: string) => {
    return await axiosApi.get(`/orders/number/${orderNumber}`);
  },
  getOrderById: async (id: string) => {
    return await axiosApi.get(`/orders/${id}`);
  },
  updateOrderStatus: async (params: IUpdateOrderStatus) => {
    return await axiosApi.put('/orders/status', params, {
      timeout: 40000,
    } as any);
  },
};
