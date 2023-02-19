export type OrderItemType = {
  productId: string;
  quantity: number;
  totalItemPrice: number;
};

export interface Order {
  _id?: string;
  createdAt?: string;
  orderNumber: string;
  items: OrderItemType[];
  userId: string;
  totalOrderPrice: number;
}
