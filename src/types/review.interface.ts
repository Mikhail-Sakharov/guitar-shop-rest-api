export interface Review {
  _id?: string;
  createdAt?: string;
  userId: string;
  productId: string;
  advantages: string;
  disadvantages: string;
  text: string;
  rating: number;
}
