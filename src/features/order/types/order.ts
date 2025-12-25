export interface ICreateOrder {
  userId?: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  note?: string;
  paymentMethod?: 'cod' | 'bank_transfer' | 'credit_card' | 'e_wallet';
  items: {
    productId: string;
    productVariantId?: string;
    quantity: number;
  }[];
}

export interface IOrderParams extends IPaginationParams {
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  status?: string;
}

export interface IMigrateOrder {
  fromUserId: string;
  toUserId: string;
}

export interface IUpdateOrderStatus {
  id: string;
  status: 'confirmed' | 'cancelled';
  cancellationReason?: string;
}

export interface IOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  note: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  items: OrderItem[];
  createdAt: string;
}

interface OrderItem {
  id: string;
  productId: string;
  productVariantId: string;
  productName: string;
  variantAttributes: {
    name: string;
    value: string;
  }[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
}

// -----------------------------

export interface IOrderManagement {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  orderNumber: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  note: string;
  subtotal: string;
  shippingFee: string;
  total: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  userId: string;
  confirmedAt: string;
  deliveredAt: string;
  cancelledAt: string;
  cancellationReason: string;
  orderDetails: OrderDetail[];
  updater: string;
}

interface OrderDetail {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: null;
  updatedBy: null;
  orderId: string;
  productId: string;
  productVariantId: string;
  productName: string;
  variantAttributes: {
    name: string;
    value: string;
  }[];
  quantity: number;
  unitPrice: string;
  totalPrice: string;
  imageUrl: string;
}

export type OrderState = IPaginatedData<IOrderManagement>;
