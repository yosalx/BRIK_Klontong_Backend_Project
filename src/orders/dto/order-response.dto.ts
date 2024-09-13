export class OrderItemResponseDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export class OrderResponseDto {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  orderItems: OrderItemResponseDto[];
  createdAt: Date;
}
