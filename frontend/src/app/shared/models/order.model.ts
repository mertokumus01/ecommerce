/**
 * Order Model
 */
export interface OrderItem {
  orderItemId?: number;
  id?: number;
  orderId?: number;
  productId: number;
  orderItemQuantity: number;
  orderItemPrice: number;
}

export interface Order {
  orderId?: number;
  id?: number;
  userId: number;
  orderStatus: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  orderTotalAmount: number;
  orderCreatedDate?: Date;
  orderDate?: Date;
  createdAt?: Date;
  createdDate?: Date;
  totalAmount?: number;
  items?: OrderItem[];
}

export interface OrderResponse {
  success: boolean;
  data?: Order | Order[];
  message?: string;
}

export interface OrderRequest {
  userId: number;
  items: OrderItem[];
  orderTotalAmount: number;
}

export interface OrderItemResponse {
  success: boolean;
  data?: OrderItem | OrderItem[];
  message?: string;
}
