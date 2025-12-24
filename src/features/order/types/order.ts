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

export interface IMigrateOrder {
  fromUserId: string;
  toUserId: string;
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
  // variantAttributes: {
  //   name: string;
  //   value: string;
  // };
  variantAttributes: any;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  imageUrl: string;
}
