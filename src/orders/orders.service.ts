import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './entities/order.entity';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productsService: ProductsService,
  ) {}

  async createOrder(
    user: User,
    createOrderDto: CreateOrderDto,
  ): Promise<OrderResponseDto> {
    return this.orderRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const order = new Order();
        order.user = user;
        order.orderItems = [];
        order.totalAmount = 0;

        for (const item of createOrderDto.orderItems) {
          const product = await this.productsService.findOne(item.productId);
          if (!product) {
            throw new BadRequestException(
              `Product with ID ${item.productId} not found`,
            );
          }
          if (product.stock < item.quantity) {
            throw new BadRequestException(
              `Not enough stock for product ${item.productId}`,
            );
          }

          const orderItem = new OrderItem();
          orderItem.product = product;
          orderItem.quantity = item.quantity;
          orderItem.price = product.price;
          orderItem.order = order;

          order.orderItems.push(orderItem);
          order.totalAmount += orderItem.price * orderItem.quantity;

          product.stock -= item.quantity;
          await transactionalEntityManager.save(product);
        }
        const savedOrder = await transactionalEntityManager.save(order);

        const orderResponse: OrderResponseDto = {
          id: savedOrder.id,
          userId: savedOrder.user.id,
          totalAmount: savedOrder.totalAmount,
          status: savedOrder.status,
          orderItems: savedOrder.orderItems.map((item) => ({
            id: item.id,
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            price: item.price,
          })),
          createdAt: savedOrder.createdAt,
        };

        return orderResponse;
      },
    );
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product'],
    });
  }

  async findAllByUser(userId: number): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { id: userId } },
      relations: ['orderItems', 'orderItems.product'],
    });
  }

  async findOne(id: number, userId?: number): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: userId ? { id, user: { id: userId } } : { id },
      relations: ['user', 'orderItems', 'orderItems.product'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }
}
